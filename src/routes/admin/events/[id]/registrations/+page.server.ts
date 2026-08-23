import { db } from '$lib/server/db';
import { events, registrations } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
