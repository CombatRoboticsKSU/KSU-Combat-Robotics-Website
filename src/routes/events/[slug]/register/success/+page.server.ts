import { db } from '$lib/server/db';
import { events, registrations } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const sessionId = url.searchParams.get('session_id');
	if (!sessionId) throw redirect(303, `/events/${params.slug}`);

	const [ev] = await db.select().from(events).where(eq(events.slug, params.slug)).limit(1);
	if (!ev) throw error(404, 'Event not found');

	const [reg] = await db
		.select()
		.from(registrations)
		.where(and(eq(registrations.stripeSessionId, sessionId), eq(registrations.eventId, ev.id)))
		.limit(1);

	if (!reg) throw error(404, 'Registration not found');

	return {
		event: ev,
		botName: reg.botName,
		builderName: reg.builderName,
		confirmed: reg.status === 'paid'
	};
};
