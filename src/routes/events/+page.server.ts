import { db } from '$lib/server/db';
import { events, registrations } from '$lib/server/schema';
import { eq, desc, or, count } from 'drizzle-orm';
import { isEventFull } from '$lib/utils/events';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const all = await db
		.select()
		.from(events)
		.where(eq(events.published, true))
		.orderBy(desc(events.sortDate));

	// One grouped query for every event's taken seats, rather than a query per event.
	const takenCounts = await db
		.select({ eventId: registrations.eventId, value: count() })
		.from(registrations)
		.where(or(eq(registrations.status, 'pending'), eq(registrations.status, 'paid')))
		.groupBy(registrations.eventId);

	const takenByEvent: Record<number, number> = {};
	for (const row of takenCounts) takenByEvent[row.eventId] = row.value;

	const withFull = all.map((e) => ({
		...e,
		isFull: isEventFull(e.capacity, takenByEvent[e.id] ?? 0)
	}));

	return {
		upcoming: withFull.filter((e) => e.status !== 'past').reverse(),
		past: withFull.filter((e) => e.status === 'past')
	};
};
