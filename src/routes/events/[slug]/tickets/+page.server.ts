import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import QRCode from 'qrcode';
import { db } from '$lib/server/db';
import { events, spectatorTickets } from '$lib/server/schema';
import { fulfillSpectatorSession } from '$lib/server/spectators';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-store', 'referrer-policy': 'no-referrer', 'x-robots-tag': 'noindex, nofollow' });
	const [event] = await db.select({ id: events.id, name: events.name, slug: events.slug, eventDate: events.eventDate, location: events.location })
		.from(events).where(and(eq(events.slug, params.slug), eq(events.published, true))).limit(1);
	if (!event) error(404, 'Event not found');
	const sessionId = url.searchParams.get('session_id') ?? '';
	if (!/^cs_(test_|live_)?[a-zA-Z0-9]+$/.test(sessionId)) error(404, 'Ticket order not found');
	let result;
	try { result = await fulfillSpectatorSession(sessionId); }
	catch (e) {
		// Invalid IDs are 404s; temporary Stripe/database errors must be retryable.
		if (e && typeof e === 'object' && 'code' in e && e.code === 'resource_missing') error(404, 'Ticket order not found');
		console.error('Spectator ticket confirmation failed', e);
		error(503, 'Tickets are temporarily unavailable. Please refresh in a moment or ask staff to look up your order.');
	}
	if (!result || result.event.id !== event.id) error(404, 'Ticket order not found');
	if (!result.order) return { event, status: 'pending', tickets: [] };
	const order = result.order;
	const tickets = await db.select({ ordinal: spectatorTickets.ordinal, token: spectatorTickets.token, checkedInAt: spectatorTickets.checkedInAt })
		.from(spectatorTickets).where(eq(spectatorTickets.orderId, order.id)).orderBy(spectatorTickets.ordinal);
	return {
		event, status: order.status,
		tickets: await Promise.all(tickets.map(async (ticket) => ({
			ordinal: ticket.ordinal, checkedInAt: ticket.checkedInAt,
			code: ticket.token,
			qr: order.status === 'confirmed' ? await QRCode.toDataURL(`${url.origin}/admin/events/${event.id}/spectators?ticket=${ticket.token}`, { width: 280, margin: 4 }) : null
		})))
	};
};
