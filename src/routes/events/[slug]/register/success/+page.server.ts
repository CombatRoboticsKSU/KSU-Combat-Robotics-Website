import { db } from '$lib/server/db';
import { events } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const [ev] = await db.select({ name: events.name, slug: events.slug }).from(events)
		.where(and(eq(events.slug, params.slug), eq(events.published, true))).limit(1);
	if (!ev) throw error(404, 'Event not found');
	return { event: ev, hazard: url.searchParams.get('hazard') === '1' };
};
