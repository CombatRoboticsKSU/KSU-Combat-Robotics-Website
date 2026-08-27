import { db } from '$lib/server/db';
import { registrations } from '$lib/server/schema';
import { stripe } from '$lib/server/stripe';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { eq, and, ne } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import type Stripe from 'stripe';

// Accepts only a string/number that is a bare positive integer. Number(null) is 0 and
// Number('1.5') is 1.5, so a plain Number.isFinite check would let both slip through.
function parsePositiveInt(value: unknown): number | null {
	if (typeof value !== 'string' && typeof value !== 'number') return null;
	if (!/^\d+$/.test(String(value))) return null;
	const n = Number(value);
	return n > 0 ? n : null;
}

function logMalformedPayload(event: Stripe.Event) {
	// A validly signed event with a null/missing data.object is permanently malformed.
	// Retrying can never fix it, so log and let the handler still return 200.
	console.error(`Stripe webhook ${event.type} (${event.id}): event.data.object is missing, skipping`);
}

// A zero-row update is either an expected no-op (the event was already applied, or this is
// a redelivery) or a real problem (the registration id does not exist). Distinguish them so
// the real problem is diagnosable instead of silently swallowed.
async function warnIfRegistrationUpdateMissed(
	updated: { id: number }[],
	event: Stripe.Event,
	registrationId: number
) {
	if (updated.length > 0) return;
	const [row] = await db
		.select({ status: registrations.status })
		.from(registrations)
		.where(eq(registrations.id, registrationId))
		.limit(1);

	if (!row) {
		console.error(`Stripe webhook ${event.type} (${event.id}): no registration found with id=${registrationId}`);
		return;
	}
	console.info(
		`Stripe webhook ${event.type} (${event.id}): no-op, registration ${registrationId} is already in status '${row.status}' (redelivery or already-applied event)`
	);
}

async function markPaid(session: Stripe.Checkout.Session, registrationId: number, event: Stripe.Event) {
	// Guarded so a redelivery does not overwrite paidAt or a later refund.
	const updated = await db
		.update(registrations)
		.set({
			status: 'paid',
			paidAt: new Date(),
			amountTotal: session.amount_total ?? null,
			stripePaymentIntentId:
				typeof session.payment_intent === 'string' ? session.payment_intent : null
		})
		.where(and(eq(registrations.id, registrationId), eq(registrations.status, 'pending')))
		.returning({ id: registrations.id });

	await warnIfRegistrationUpdateMissed(updated, event, registrationId);
}

export const POST: RequestHandler = async ({ request }) => {
	const signature = request.headers.get('stripe-signature');
	if (!signature) return new Response('Missing signature', { status: 400 });

	// The raw body is required for signature verification. Do not use request.json().
	const body = await request.text();

	let event: Stripe.Event;
	try {
		event = await stripe.webhooks.constructEventAsync(body, signature, STRIPE_WEBHOOK_SECRET);
	} catch (e) {
		console.error('Stripe webhook signature verification failed', e);
		return new Response('Invalid signature', { status: 400 });
	}

	switch (event.type) {
		case 'checkout.session.completed': {
			const session = event.data?.object as Stripe.Checkout.Session | null;
			if (!session) {
				logMalformedPayload(event);
				break;
			}

			const registrationId = parsePositiveInt(session.metadata?.registrationId ?? session.client_reference_id);
			if (registrationId === null) break;

			// Delayed-notification payment methods fire this event before the payment has
			// actually cleared (payment_status stays 'unpaid'). Only mark paid once Stripe
			// confirms payment; otherwise wait for async_payment_succeeded/async_payment_failed.
			if (session.payment_status !== 'paid') break;

			await markPaid(session, registrationId, event);
			break;
		}

		case 'checkout.session.async_payment_succeeded': {
			const session = event.data?.object as Stripe.Checkout.Session | null;
			if (!session) {
				logMalformedPayload(event);
				break;
			}

			const registrationId = parsePositiveInt(session.metadata?.registrationId ?? session.client_reference_id);
			if (registrationId === null) break;

			await markPaid(session, registrationId, event);
			break;
		}

		case 'checkout.session.expired':
		case 'checkout.session.async_payment_failed': {
			const session = event.data?.object as Stripe.Checkout.Session | null;
			if (!session) {
				logMalformedPayload(event);
				break;
			}

			const registrationId = parsePositiveInt(session.metadata?.registrationId ?? session.client_reference_id);
			if (registrationId === null) break;

			// 'expired' is also used for a failed delayed payment: it stops the row from
			// holding a capacity slot. register/+page.server.ts only counts 'pending' and
			// 'paid' as consuming.
			const updated = await db
				.update(registrations)
				.set({ status: 'expired' })
				.where(and(eq(registrations.id, registrationId), eq(registrations.status, 'pending')))
				.returning({ id: registrations.id });

			await warnIfRegistrationUpdateMissed(updated, event, registrationId);
			break;
		}

		case 'charge.refunded': {
			const charge = event.data?.object as Stripe.Charge | null;
			if (!charge) {
				logMalformedPayload(event);
				break;
			}

			const paymentIntentId =
				typeof charge.payment_intent === 'string' ? charge.payment_intent : null;
			if (!paymentIntentId) break;

			const updated = await db
				.update(registrations)
				.set({ status: 'refunded' })
				.where(
					and(
						eq(registrations.stripePaymentIntentId, paymentIntentId),
						ne(registrations.status, 'refunded')
					)
				)
				.returning({ id: registrations.id });

			if (updated.length === 0) {
				const [row] = await db
					.select({ id: registrations.id, status: registrations.status })
					.from(registrations)
					.where(eq(registrations.stripePaymentIntentId, paymentIntentId))
					.limit(1);

				if (!row) {
					// Stripe does not guarantee delivery order: this refund may have arrived
					// before the checkout.session.completed that writes stripePaymentIntentId.
					// There is no row to mark refunded, and none will be created retroactively,
					// so this needs to be loud rather than silently dropped.
					console.error(
						`Stripe webhook ${event.type} (${event.id}): no registration found for payment_intent=${paymentIntentId}. The refund may have arrived before checkout.session.completed, or the payment_intent is unknown.`
					);
				} else {
					console.info(
						`Stripe webhook ${event.type} (${event.id}): no-op, registration ${row.id} is already in status '${row.status}' (redelivery)`
					);
				}
			}
			break;
		}
	}

	// Always 200 on a verified event, including unhandled types, so Stripe stops retrying.
	return new Response(null, { status: 200 });
};
