// Run against a development database after applying spectator-tickets.manual.sql:
// node --env-file=.env tests/spectators.integration.mjs
// Only the temporary event created here is removed. No Stripe mutations occur.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { createServer } from 'vite';

assert(process.env.DATABASE_URL && process.env.DATABASE_URL !== process.env.PROD_DATABASE_URL, 'Use a separate dev database');
const sql = neon(process.env.DATABASE_URL);
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const suffix = randomUUID().replaceAll('-', '');
let eventId;
try {
	const service = await server.ssrLoadModule('/src/lib/server/spectators.ts');
	const { render } = await server.ssrLoadModule('svelte/server');
	const [event] = await sql`insert into events (name,slug,spectator_url) values (${'Spectator integration test'}, ${'test-' + suffix}, ${'https://buy.stripe.com/test_' + suffix}) returning id`;
	eventId = event.id;
	const session = {
		id: 'cs_test_' + suffix, mode: 'payment', payment_link: 'plink_test', status: 'complete', payment_status: 'paid',
		payment_intent: 'pi_' + suffix, amount_total: 1000, currency: 'usd', customer_details: { name: 'Test Buyer', email: 'spectator@example.invalid' }
	};
	const charge = { id: 'ch_' + suffix, payment_intent: session.payment_intent, amount: 1000, amount_refunded: 0 };
	let linkUrl = 'https://buy.stripe.com/test_' + suffix;
	let quantity = 2;
	const client = {
		checkout: { sessions: {
			retrieve: async () => ({ ...session }),
			listLineItems: async () => ({ has_more: false, data: [{ quantity }] }),
			list: async () => ({ data: [{ ...session }] })
		} },
		paymentLinks: { retrieve: async () => ({ id: 'plink_test', url: linkUrl }) },
		paymentIntents: { retrieve: async () => ({ latest_charge: { ...charge } }) },
		charges: { retrieve: async () => ({ ...charge }) }
	};
	const countTickets = async () => (await service.spectatorTicketRows(eventId));
	// Buyer-supplied references cannot turn a random Payment Link into event admission.
	session.client_reference_id = String(eventId);
	linkUrl = 'https://buy.stripe.com/unrelated';
	assert.equal(await service.fulfillSpectatorSession(session.id, client), null);
	assert.equal((await countTickets()).length, 0);
	linkUrl = 'https://buy.stripe.com/test_' + suffix;
	session.payment_status = 'unpaid';
	assert.equal((await service.fulfillSpectatorSession(session.id, client)).order, null);
	assert.equal((await countTickets()).length, 0);
	session.payment_status = 'paid';
	await Promise.all(Array.from({ length: 4 }, () => service.fulfillSpectatorSession(session.id, client)));
	let rows = await countTickets();
	assert.equal(rows.length, 2, 'Concurrent fulfillment must create exactly the purchased quantity');
	const token = rows[0].ticket.token;
	assert.equal(new Set(rows.map(r => r.ticket.token)).size, 2);
	assert.equal(service.ticketToken(token, 'https://example.com', eventId), token);
	assert.equal(service.ticketToken(`https://example.com/admin/events/${eventId}/spectators?ticket=${token}`, 'https://example.com', eventId), token);
	assert.equal(service.ticketToken(`https://evil.example/admin/events/${eventId}/spectators?ticket=${token}`, 'https://example.com', eventId), null);
	assert.equal(await service.checkInSpectator(eventId + 1, token, 'test-staff'), false);
	const admissions = await Promise.all(Array.from({ length: 4 }, () => service.checkInSpectator(eventId, token, 'test-staff')));
	assert.equal(admissions.filter(Boolean).length, 1, 'A ticket can be consumed only once under concurrency');
	await service.fulfillSpectatorSession(session.id, client);
	assert((await countTickets())[0].ticket.checkedInAt, 'Replayed checkout must preserve check-in');
	await sql`update events set spectator_url = ${'https://buy.stripe.com/replacement_' + suffix} where id = ${eventId}`;
	assert((await service.fulfillSpectatorSession(session.id, client)).order, 'Replacing the Payment Link must not hide existing tickets');
	await sql`update events set spectator_url = ${'https://buy.stripe.com/test_' + suffix} where id = ${eventId}`;
	charge.amount_refunded = 500;
	await service.refundSpectatorOrder(charge, client);
	rows = await countTickets();
	assert(rows.every(r => r.order.status === 'refund_review'));
	assert.equal(await service.checkInSpectator(eventId, rows[1].ticket.token, 'test-staff'), false);
	charge.amount_refunded = 1000;
	await service.refundSpectatorOrder(charge, client);
	await service.fulfillSpectatorSession(session.id, client);
	assert((await countTickets()).every(r => r.order.status === 'refunded'));
	// Refund before checkout webhook: source-of-truth reconciliation creates blocked tickets.
	session.id = 'cs_test_refund' + suffix;
	session.payment_intent = 'pi_refund' + suffix;
	charge.payment_intent = session.payment_intent;
	await service.refundSpectatorOrder(charge, client);
	assert.equal((await countTickets()).filter(r => r.order.stripeSessionId === session.id && r.order.status === 'refunded').length, 2);
	// Fully discounted sponsor sessions have no PaymentIntent but still receive admission.
	session.id = 'cs_test_free' + suffix;
	session.payment_intent = null;
	session.payment_status = 'no_payment_required';
	session.amount_total = 0;
	quantity = 3;
	await service.fulfillSpectatorSession(session.id, client);
	rows = (await countTickets()).filter(r => r.order.stripeSessionId === session.id);
	assert.equal(rows.length, 3);
	assert(rows.every(r => r.order.status === 'confirmed' && r.order.amountTotal === 0));
	assert.equal(await service.checkInSpectator(eventId, rows[0].ticket.token, 'test-staff'), true);
	const admin = await server.ssrLoadModule('/src/routes/admin/events/[id]/spectators/+page.server.ts');
	for (const action of Object.values(admin.actions)) {
		await assert.rejects(() => action({ locals: { user: null } }), e => e.status === 403);
	}
	const adminPage = await server.ssrLoadModule('/src/routes/admin/events/[id]/spectators/+page.svelte');
	const rendered = render(adminPage.default, { props: { data: {
		event: { id: eventId, name: 'Integration event', slug: 'test-' + suffix }, rows: await countTickets(), scanned: rows[0].ticket.token, invalidScan: false
	}, form: null } });
	assert.match(rendered.body, /Already checked in/);
	assert.match(rendered.body, /Refunded/);
	assert.match(rendered.body, /Sponsor \/ complimentary/);
	const buyerPage = await server.ssrLoadModule('/src/routes/events/[slug]/tickets/+page.svelte');
	for (const status of ['pending', 'refunded', 'refund_review', 'confirmed']) {
		const page = render(buyerPage.default, { props: { data: { event: { name: 'Integration event', slug: 'test-' + suffix, eventDate: 'Test date', location: 'Test venue' }, status, tickets: status === 'confirmed' ? [{ ordinal: 1, code: rows[0].ticket.token, qr: null, checkedInAt: null }] : [] } } });
		assert.match(page.body, /Your spectator tickets/);
		if (status === 'pending') assert.match(page.body, /Waiting for payment confirmation/);
		if (status === 'refunded') assert.match(page.body, /Order refunded/);
		if (status === 'refund_review') assert.match(page.body, /Refund needs review/);
		if (status === 'confirmed') assert.match(page.body, /Ready for admission/);
	}
	console.log('PASS: payment-link identity, pending payments, concurrent fulfillment/check-in, replay safety, partial/full refunds, refund ordering, and free sponsor admission');
	console.log('PASS: staff-only actions and rendered roster / buyer status pages');
} finally {
	if (eventId) await sql.transaction([
		sql`delete from spectator_tickets where order_id in (select id from spectator_orders where event_id = ${eventId})`,
		sql`delete from spectator_orders where event_id = ${eventId}`,
		sql`delete from events where id = ${eventId}`
	]);
	await server.close();
}
