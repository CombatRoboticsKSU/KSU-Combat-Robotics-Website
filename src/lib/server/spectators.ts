import { randomBytes } from 'node:crypto';
import { and, eq, ne, sql } from 'drizzle-orm';
import type Stripe from 'stripe';
import { db } from './db';
import { events, spectatorOrders, spectatorTickets } from './schema';
import { stripe } from './stripe';

export function refundStatus(charge: Pick<Stripe.Charge, 'amount' | 'amount_refunded'>) {
	return charge.amount_refunded >= charge.amount ? 'refunded' : 'refund_review';
}

export function ticketToken(input: string, origin: string, eventId: number): string | null {
	const value = input.trim();
	if (/^[a-f0-9]{64}$/.test(value)) return value;
	try {
		const url = new URL(value);
		const token = url.searchParams.get('ticket') ?? '';
		return url.origin === origin && url.pathname === `/admin/events/${eventId}/spectators` && /^[a-f0-9]{64}$/.test(token) ? token : null;
	} catch { return null; }
}

/** Match the actual Stripe Payment Link, never client_reference_id or buyer-supplied metadata. */
export async function fulfillSpectatorSession(sessionId: string, client: Stripe = stripe) {
	const session = await client.checkout.sessions.retrieve(sessionId);
	if (!session.payment_link || session.mode !== 'payment') return null;
	const linkId = typeof session.payment_link === 'string' ? session.payment_link : session.payment_link.id;
	const [existing] = await db.select({ eventId: spectatorOrders.eventId }).from(spectatorOrders)
		.where(eq(spectatorOrders.stripeSessionId, session.id)).limit(1);
	// An already-verified order remains accessible if staff replace the event's link.
	const matches = existing
		? await db.select().from(events).where(eq(events.id, existing.eventId)).limit(1)
		: await db.select().from(events).where(eq(events.spectatorUrl, (await client.paymentLinks.retrieve(linkId)).url)).limit(2);
	if (matches.length !== 1) return null; // A link shared between events is ambiguous.
	const event = matches[0];
	if (session.status !== 'complete' || !['paid', 'no_payment_required'].includes(session.payment_status)) {
		return { event, order: null };
	}
	const items = await client.checkout.sessions.listLineItems(session.id, { limit: 100 });
	if (items.has_more || items.data.length !== 1) throw new Error('Spectator checkout must contain one ticket product');
	const quantity = items.data[0].quantity ?? 0;
	if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 1000) throw new Error('Invalid spectator ticket quantity');
	const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null;
	let status = 'confirmed';
	if (paymentIntentId) {
		const intent = await client.paymentIntents.retrieve(paymentIntentId, { expand: ['latest_charge'] });
		const charge = intent.latest_charge;
		if (charge && typeof charge !== 'string' && charge.amount_refunded > 0) status = refundStatus(charge);
	}
	const tickets = Array.from({ length: quantity }, (_, i) => ({ ordinal: i + 1, token: randomBytes(32).toString('hex') }));
	// One statement: order and all tickets commit together. Unique session ID makes
	// simultaneous webhook delivery / confirmation-page visits idempotent.
	await db.execute(sql`
		with new_order as (
			insert into spectator_orders (event_id, stripe_session_id, stripe_payment_intent_id, buyer_name, email, quantity, amount_total, currency, status)
			values (${event.id}, ${session.id}, ${paymentIntentId}, ${session.customer_details?.name ?? ''},
				${session.customer_details?.email ?? session.customer_email ?? ''}, ${quantity}, ${session.amount_total ?? 0}, ${session.currency ?? 'usd'}, ${status})
			on conflict (stripe_session_id) do nothing returning id
		)
		insert into spectator_tickets (order_id, ordinal, token)
		select new_order.id, ticket.ordinal, ticket.token from new_order,
		jsonb_to_recordset(${JSON.stringify(tickets)}::jsonb) as ticket(ordinal integer, token text)
	`);
	// A refund is terminal; a late checkout event must never reactivate admission.
	if (status !== 'confirmed') {
		await db.update(spectatorOrders).set({ status }).where(and(eq(spectatorOrders.stripeSessionId, session.id), status === 'refunded' ? ne(spectatorOrders.status, 'refunded') : eq(spectatorOrders.status, 'confirmed')));
	}
	const [order] = await db.select().from(spectatorOrders).where(eq(spectatorOrders.stripeSessionId, session.id));
	if (!order) throw new Error('Spectator order was not saved');
	return { event, order };
}

export async function refundSpectatorOrder(charge: Stripe.Charge, client: Stripe = stripe) {
	const id = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
	if (!id) return false;
	let [order] = await db.select({ id: spectatorOrders.id }).from(spectatorOrders).where(eq(spectatorOrders.stripePaymentIntentId, id)).limit(1);
	if (!order) {
		// Refund delivery can precede checkout delivery. Reconcile from Stripe now.
		const sessions = await client.checkout.sessions.list({ payment_intent: id, limit: 100 });
		for (const session of sessions.data) {
			if (session.payment_link) await fulfillSpectatorSession(session.id, client);
		}
		[order] = await db.select({ id: spectatorOrders.id }).from(spectatorOrders).where(eq(spectatorOrders.stripePaymentIntentId, id)).limit(1);
	}
	if (!order) return false;
	const current = await client.charges.retrieve(charge.id);
	if (current.amount_refunded > 0) await db.update(spectatorOrders).set({ status: refundStatus(current) }).where(eq(spectatorOrders.id, order.id));
	return true;
}

export async function checkInSpectator(eventId: number, token: string, staffId: string) {
	// Lock the order as well as the ticket, so refund updates and two gate staff
	// cannot admit a refunded ticket or consume the same admission twice.
	const result = await db.execute(sql`
		with eligible_order as (
			select o.id from spectator_orders o join spectator_tickets t on t.order_id = o.id
			where o.event_id = ${eventId} and o.status = 'confirmed' and t.token = ${token}
			for update of o
		)
		update spectator_tickets t set checked_in_at = now(), checked_in_by = ${staffId}
		from eligible_order o where t.order_id = o.id and t.token = ${token} and t.checked_in_at is null
		returning t.id
	`);
	return result.rows.length === 1;
}

export async function spectatorTicketRows(eventId: number) {
	return db.select({ ticket: spectatorTickets, order: spectatorOrders }).from(spectatorTickets)
		.innerJoin(spectatorOrders, eq(spectatorTickets.orderId, spectatorOrders.id))
		.where(eq(spectatorOrders.eventId, eventId)).orderBy(spectatorOrders.createdAt, spectatorTickets.ordinal);
}
