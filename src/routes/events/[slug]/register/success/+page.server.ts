import { db } from '$lib/server/db';
import { events, registrations } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	if (url.searchParams.get('member') === '1') {
		const [ev] = await db.select({ name: events.name, slug: events.slug }).from(events)
			.where(and(eq(events.slug, params.slug), eq(events.published, true))).limit(1);
		if (!ev) throw error(404, 'Event not found');
		return {
			event: { name: ev.name, slug: ev.slug },
			member: true,
			status: 'member',
			botName: '',
			builderName: '',
			hazardStatus: url.searchParams.get('hazard') === '1' ? 'pending_review' : 'not_required'
		};
	}
	const sessionId = url.searchParams.get('session_id');
	if (!sessionId) throw redirect(303, `/events/${params.slug}`);

	const [ev] = await db.select({ id: events.id, name: events.name, slug: events.slug })
		.from(events).where(eq(events.slug, params.slug)).limit(1);
	if (!ev) throw error(404, 'Event not found');

	const [reg] = await db
		.select({
			botName: registrations.botName,
			builderName: registrations.builderName,
			status: registrations.status,
			hazardStatus: registrations.hazardStatus
		})
		.from(registrations)
		.where(and(eq(registrations.stripeSessionId, sessionId), eq(registrations.eventId, ev.id)))
		.limit(1);

	if (!reg) throw error(404, 'Registration not found');

	return {
		event: { name: ev.name, slug: ev.slug },
		member: false,
		botName: reg.botName,
		builderName: reg.builderName,
		status: reg.status,
		hazardStatus: reg.hazardStatus
	};
};
