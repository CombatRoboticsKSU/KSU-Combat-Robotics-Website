import { db } from '$lib/server/db';
import { registrations } from '$lib/server/schema';
import { loadAdminEvent, readRegistrationFields, registrationFieldError } from '$lib/server/registration-admin';
import { ACTIVE_REGISTRATION_STATUSES, isEventFull } from '$lib/utils/events';
import { and, eq, inArray, count } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const event = await loadAdminEvent(params.id);
	const [{ value: taken }] = await db.select({ value: count() }).from(registrations).where(and(
		eq(registrations.eventId, event.id), inArray(registrations.status, ACTIVE_REGISTRATION_STATUSES)
	));
	return { event, isFull: isEventFull(event.capacity, taken) };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const event = await loadAdminEvent(params.id);
		const form = await request.formData();
		const values = readRegistrationFields(form);
		const rawStatus = form.get('status');
		const status = typeof rawStatus === 'string' ? rawStatus : '';
		const validationError = registrationFieldError(values);
		if (validationError) return fail(400, { error: validationError, values, status });
		if (status !== 'member' && status !== 'paid_offline') {
			return fail(400, { error: 'Initial status must be member or paid offline.', values, status });
		}
		await db.insert(registrations).values({
			...values, eventId: event.id, status, waiverAck: false, ageAck: false, hazardDocs: [],
			hazardStatus: values.hazardPneumatic || values.hazardHighMass ? 'pending_review' : 'not_required'
		});
		throw redirect(303, `/admin/events/${event.id}/registrations`);
	}
};
