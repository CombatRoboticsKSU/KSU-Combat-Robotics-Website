import { db } from '$lib/server/db';
import { registrations, registrationEditAudit } from '$lib/server/schema';
import { stripe } from '$lib/server/stripe';
import { loadAdminEvent, loadAdminRegistration, readRegistrationFields, registrationFieldError, registrationWhere } from '$lib/server/registration-admin';
import { and, desc, eq, inArray, isNull, notInArray, sql } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const registration = await loadAdminRegistration(params.id, params.regId);
	const history = await db.select().from(registrationEditAudit).where(eq(registrationEditAudit.registrationId, registration.id)).orderBy(desc(registrationEditAudit.createdAt)).limit(20);
	return {
		event: await loadAdminEvent(params.id),
		registration,
		editHistory: history.map(row => {
			const before = row.before as Record<string, unknown>;
			const after = row.after as Record<string, unknown>;
			return { id: row.id, createdAt: row.createdAt, changes: Object.keys(after).filter(key => JSON.stringify(before[key]) !== JSON.stringify(after[key])).map(key => ({ field: key.replaceAll('_', ' '), before: JSON.stringify(before[key]), after: JSON.stringify(after[key]) })) };
		})
	};
};

export const actions: Actions = {
	edit: async ({ request, params }) => {
		const values = readRegistrationFields(await request.formData());
		const validationError = registrationFieldError(values);
		if (validationError) return fail(400, { error: validationError, values });
		const isHazard = values.hazardPneumatic || values.hazardHighMass;
		const [row] = await db.update(registrations).set({
			...values,
			hazardStatus: isHazard
				? sql`CASE WHEN ${registrations.hazardStatus} = 'not_required' THEN 'pending_review' ELSE ${registrations.hazardStatus} END`
				: 'not_required',
			...(!isHazard ? { hazardReviewNote: '', hazardReviewedAt: null } : {})
		}).where(registrationWhere(params.id, params.regId)).returning({ id: registrations.id });
		if (!row) throw error(404, 'Registration not found');
		return { success: 'Registration saved.' };
	},
	setStatus: async ({ request, params }) => {
		const form = await request.formData();
		const status = form.get('status');
		if (status !== 'member' && status !== 'paid_offline' && status !== 'cancelled') {
			return fail(400, { error: 'Invalid registration status.' });
		}
		const allowed = ['expired', 'member', 'paid_offline', 'cancelled', 'pending'];
		if (status === 'cancelled') allowed.push('paid');

		// A pending row may still be mid-checkout. Close the Stripe session first so the
		// builder cannot pay after the admin has already settled the registration.
		const current = await loadAdminRegistration(params.id, params.regId);
		if (current.status === 'pending' && current.stripeSessionId) {
			try {
				const session = await stripe.checkout.sessions.retrieve(current.stripeSessionId);
				if (session.status === 'complete') {
					return fail(400, { error: 'This checkout was already paid. Refresh in a moment; it will show as paid.' });
				}
				if (session.status === 'open') await stripe.checkout.sessions.expire(current.stripeSessionId);
			} catch (e) {
				console.error('Could not close Stripe checkout for pending registration', e);
				return fail(500, { error: 'Could not close the Stripe checkout for this registration. Try again.' });
			}
		}

		const [row] = await db.update(registrations).set({ status }).where(and(
			registrationWhere(params.id, params.regId), inArray(registrations.status, allowed)
		)).returning({ id: registrations.id });
		if (!row) {
			await loadAdminRegistration(params.id, params.regId);
			return fail(400, { error: 'That status change is not allowed. Refunded registrations cannot be changed manually; paid registrations can only be cancelled.' });
		}
		return { success: 'Registration status updated.' };
	},
	deleteRegistration: async ({ params }) => {
		const [row] = await db.delete(registrations).where(and(
			registrationWhere(params.id, params.regId), isNull(registrations.stripePaymentIntentId),
			notInArray(registrations.status, ['pending', 'paid', 'refunded'])
		)).returning({ id: registrations.id });
		if (!row) {
			await loadAdminRegistration(params.id, params.regId);
			return fail(400, { error: 'Registrations with a payment intent or a pending, paid, or refunded status cannot be deleted.' });
		}
		throw redirect(303, `/admin/events/${params.id}/registrations`);
	}
};
