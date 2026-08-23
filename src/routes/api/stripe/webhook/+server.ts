import { db } from '$lib/server/db';
import { registrations } from '$lib/server/schema';
import { stripe } from '$lib/server/stripe';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { eq, and, ne } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import type Stripe from 'stripe';

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
			const session = event.data.object as Stripe.Checkout.Session;
			const registrationId = Number(session.metadata?.registrationId ?? session.client_reference_id);
			if (!Number.isFinite(registrationId)) break;

			// Guarded so a redelivery does not overwrite paidAt or a later refund.
			await db
				.update(registrations)
				.set({
					status: 'paid',
					paidAt: new Date(),
					amountTotal: session.amount_total ?? null,
					stripePaymentIntentId:
						typeof session.payment_intent === 'string' ? session.payment_intent : null
				})
				.where(and(eq(registrations.id, registrationId), eq(registrations.status, 'pending')));
			break;
		}

		case 'checkout.session.expired': {
			const session = event.data.object as Stripe.Checkout.Session;
			const registrationId = Number(session.metadata?.registrationId ?? session.client_reference_id);
			if (!Number.isFinite(registrationId)) break;

			await db
				.update(registrations)
				.set({ status: 'expired' })
				.where(and(eq(registrations.id, registrationId), eq(registrations.status, 'pending')));
			break;
		}

		case 'charge.refunded': {
			const charge = event.data.object as Stripe.Charge;
			const paymentIntentId =
				typeof charge.payment_intent === 'string' ? charge.payment_intent : null;
			if (!paymentIntentId) break;

			await db
				.update(registrations)
				.set({ status: 'refunded' })
				.where(
					and(
						eq(registrations.stripePaymentIntentId, paymentIntentId),
						ne(registrations.status, 'refunded')
					)
				);
			break;
		}
	}

	// Always 200 on a verified event, including unhandled types, so Stripe stops retrying.
	return new Response(null, { status: 200 });
};
