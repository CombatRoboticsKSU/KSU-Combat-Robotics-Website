import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { events } from '$lib/server/schema';
import { stripe } from '$lib/server/stripe';
import { checkInSpectator, spectatorTicketRows, ticketToken, fulfillSpectatorSession } from '$lib/server/spectators';
import type { Actions, PageServerLoad } from './$types';

async function getEvent(id: string) {
	const eventId = Number(id);
	if (!Number.isSafeInteger(eventId) || eventId < 1) error(404, 'Event not found');
	const [event] = await db.select().from(events).where(eq(events.id, eventId));
	if (!event) error(404, 'Event not found');
	return event;
}

export const load: PageServerLoad = async ({ params, url, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-store', 'referrer-policy': 'no-referrer' });
	const event = await getEvent(params.id);
	const rows = await spectatorTicketRows(event.id);
	const raw = url.searchParams.get('ticket');
	const scanned = raw ? ticketToken(raw, url.origin, event.id) : null;
	return { event: { id: event.id, name: event.name, slug: event.slug }, rows, scanned, invalidScan: raw !== null && !rows.some(r => r.ticket.token === scanned) };
};

export const actions: Actions = {
	checkIn: async ({ params, request, url, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') error(403, 'Staff login required');
		const event = await getEvent(params.id);
		const form = await request.formData();
		const token = ticketToken(String(form.get('ticket') ?? ''), url.origin, event.id);
		if (!token) return fail(400, { error: 'Invalid ticket code.' });
		if (await checkInSpectator(event.id, token, locals.user.id)) return { success: 'Ticket checked in. Admit one spectator.' };
		const row = (await spectatorTicketRows(event.id)).find(r => r.ticket.token === token);
		return fail(409, { error: !row ? 'Ticket not found for this event.' : row.order.status !== 'confirmed' ? 'Ticket is refunded or awaiting refund review. Do not admit.' : 'Ticket has already been checked in. Do not admit again.' });
	},
	connectLink: async ({ params, url, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') error(403, 'Staff login required');
		const event = await getEvent(params.id);
		try {
			let linkId = '';
			for await (const link of stripe.paymentLinks.list({ limit: 100 })) {
				if (link.url === event.spectatorUrl) { linkId = link.id; break; }
			}
			if (!linkId) return fail(400, { error: 'Set this event’s spectator URL to a Stripe Payment Link from this environment first.' });
			const shared = await db.select({ id: events.id }).from(events).where(eq(events.spectatorUrl, event.spectatorUrl));
			if (shared.length !== 1) return fail(400, { error: 'Each event must have its own spectator Payment Link.' });
			await stripe.paymentLinks.update(linkId, { after_completion: { type: 'redirect', redirect: { url: `${url.origin}/events/${event.slug}/tickets?session_id={CHECKOUT_SESSION_ID}` } } });
			return { success: 'Stripe now returns ticket buyers to this site after checkout.' };
		} catch (e) { console.error('Spectator link setup failed', e); return fail(502, { error: 'Could not update Stripe. Please try again.' }); }
	},
	importOrder: async ({ params, request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') error(403, 'Staff login required');
		const event = await getEvent(params.id);
		const sessionId = String((await request.formData()).get('sessionId') ?? '').trim();
		if (!/^cs_(test_|live_)?[a-zA-Z0-9]+$/.test(sessionId)) return fail(400, { error: 'Enter a Stripe Checkout Session ID (cs_…).'});
		try {
			const result = await fulfillSpectatorSession(sessionId);
			if (!result || result.event.id !== event.id || !result.order) return fail(400, { error: 'No confirmed spectator order for this event was found.' });
			return { success: 'Order synced from Stripe. Existing tickets and check-ins were preserved.' };
		} catch (e) { console.error('Spectator order import failed', e); return fail(502, { error: 'Could not retrieve this order from Stripe.' }); }
	}
};
