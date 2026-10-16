import { db } from '$lib/server/db';
import { events, registrations } from '$lib/server/schema';
import { eq, ne, and, or, desc } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

async function reviewHazard(request: Request, eventId: string, status: 'approved' | 'rejected') {
	const form = await request.formData();
	const registrationId = Number(form.get('registrationId'));
	const id = Number(eventId);
	const rawNote = form.get('hazardReviewNote');
	const note = typeof rawNote === 'string' ? rawNote.trim() : '';
	if (!Number.isSafeInteger(registrationId) || registrationId <= 0 || !Number.isSafeInteger(id) || id <= 0) {
		return fail(400, { error: 'Invalid registration.', registrationId, note });
	}
	if (status === 'rejected' && !note) {
		return fail(400, { error: 'A review note is required when rejecting a Hazard Bot.', registrationId, note });
	}
	const [row] = await db
		.update(registrations)
		.set({ hazardStatus: status, hazardReviewNote: note, hazardReviewedAt: new Date() })
		.where(and(
			eq(registrations.id, registrationId),
			eq(registrations.eventId, id),
			eq(registrations.status, 'paid'),
			ne(registrations.hazardStatus, 'not_required'),
			or(eq(registrations.hazardPneumatic, true), eq(registrations.hazardHighMass, true))
		))
		.returning({ id: registrations.id });
	if (!row) return fail(400, { error: 'Paid hazard registration not found for this event.', registrationId, note });
	return { success: `Hazard Bot ${status}.` };
}

export const actions: Actions = {
	approveHazard: ({ request, params }) => reviewHazard(request, params.id, 'approved'),
	rejectHazard: ({ request, params }) => reviewHazard(request, params.id, 'rejected')
};

export const load: PageServerLoad = async ({ params }) => {
	const eventId = parseInt(params.id);
	if (!Number.isFinite(eventId)) throw error(404, 'Event not found');

	const [ev] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
	if (!ev) throw error(404, 'Event not found');

	const rows = await db
		.select()
		.from(registrations)
		.where(eq(registrations.eventId, eventId))
		.orderBy(desc(registrations.createdAt));

	const counts = {
		paid: rows.filter((r) => r.status === 'paid').length,
		pending: rows.filter((r) => r.status === 'pending').length,
		expired: rows.filter((r) => r.status === 'expired').length,
		refunded: rows.filter((r) => r.status === 'refunded').length
	};

	return { event: ev, registrations: rows, counts };
};
