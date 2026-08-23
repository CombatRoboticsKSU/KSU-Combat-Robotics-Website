import { db } from '$lib/server/db';
import { events } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const all = await db
		.select()
		.from(events)
		.where(eq(events.published, true))
		.orderBy(desc(events.sortDate));

	return {
		upcoming: all.filter((e) => e.status !== 'past').reverse(),
		past: all.filter((e) => e.status === 'past')
	};
};
