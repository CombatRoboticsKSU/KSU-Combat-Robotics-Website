import { db } from '$lib/server/db';
import { events } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { resolveWaiverText } from '$lib/utils/waiver';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [event] = await db
		.select()
		.from(events)
		.where(and(eq(events.slug, params.slug), eq(events.published, true)))
		.limit(1);

	if (!event) throw error(404, 'Event not found');

	return {
		event: {
			name: event.name,
			slug: event.slug,
			waiverPdfUrl: event.waiverPdfUrl
		},
		waiverText: resolveWaiverText(event.waiverText)
	};
};
