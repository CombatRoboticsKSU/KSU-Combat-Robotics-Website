import { db } from '$lib/server/db';
import { events, registrations } from '$lib/server/schema';
import { eq, and, or, count } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { isEventFull, canRegister } from '$lib/utils/events';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [ev] = await db
		.select()
		.from(events)
		.where(and(eq(events.slug, params.slug), eq(events.published, true)))
		.limit(1);

	if (!ev) throw error(404, 'Event not found');

	const [{ value: taken }] = await db
		.select({ value: count() })
		.from(registrations)
		.where(
			and(
				eq(registrations.eventId, ev.id),
				or(eq(registrations.status, 'pending'), eq(registrations.status, 'paid'))
			)
		);

	const isFull = isEventFull(ev.capacity, taken);

	return {
		event: ev,
		isFull,
		spotsLeft: ev.capacity > 0 ? Math.max(0, ev.capacity - taken) : null,
		canRegister: canRegister(ev.status, ev.registrationOpen, ev.competitorPriceId, isFull)
	};
};
