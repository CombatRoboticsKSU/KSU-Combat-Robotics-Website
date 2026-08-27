import { db } from '$lib/server/db';
import { events, registrations } from '$lib/server/schema';
import { stripe } from '$lib/server/stripe';
import { isEventFull, canRegister } from '$lib/utils/events';
import { resolveWaiverText } from '$lib/utils/waiver';
import { eq, and, or, count } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// A crafted multipart POST can make form.get(name) return a File instead of a string.
// Treat anything non-string as absent rather than letting .trim() throw and 500.
function readField(form: FormData, name: string): string {
	const value = form.get(name);
	return typeof value === 'string' ? value.trim() : '';
}

async function loadOpenEvent(slug: string) {
	const [ev] = await db
		.select()
		.from(events)
		.where(and(eq(events.slug, slug), eq(events.published, true)))
		.limit(1);

	if (!ev) throw error(404, 'Event not found');

	const [{ value: taken }] = await db
		.select({ value: count() })
		.from(registrations)
		.where(
			and(
				eq(registrations.eventId, ev.id),
				or(eq(registrations.status, 'pending'), eq(registrations.status, 'paid'))
			)
		);

	const isFull = isEventFull(ev.capacity, taken);
	return { ev, isFull };
}

export const load: PageServerLoad = async ({ params }) => {
	const { ev, isFull } = await loadOpenEvent(params.slug);

	if (!canRegister(ev.status, ev.registrationOpen, ev.competitorPriceId, isFull)) {
		throw redirect(303, `/events/${ev.slug}`);
	}

	return { event: ev, waiverText: resolveWaiverText(ev.waiverText) };
};

export const actions: Actions = {
	default: async ({ request, params, url }) => {
		const form = await request.formData();
		const values = {
			builderName: readField(form, 'builderName'),
			email: readField(form, 'email'),
			phone: readField(form, 'phone'),
			teamName: readField(form, 'teamName'),
			botName: readField(form, 'botName'),
			weaponType: readField(form, 'weaponType'),
			notes: readField(form, 'notes'),
			waiverAck: form.get('waiverAck') === 'on',
			ageAck: form.get('ageAck') === 'on'
		};

		if (!values.builderName) return fail(400, { error: 'Builder name is required', values });
		if (!values.email || !values.email.includes('@')) {
			return fail(400, { error: 'A valid email is required', values });
		}
		if (!values.botName) return fail(400, { error: 'Bot name is required', values });
		if (!values.waiverAck) {
			return fail(400, { error: 'You must agree to the waiver to register', values });
		}
		if (!values.ageAck) {
			return fail(400, { error: 'You must confirm you are 18 or older to register', values });
		}

		const { ev, isFull } = await loadOpenEvent(params.slug);

		// isFull is checked separately below so it can carry its own message; pass isFull: false
		// here so this call only covers the "closed" reasons canRegister otherwise folds together.
		if (!canRegister(ev.status, ev.registrationOpen, ev.competitorPriceId, false)) {
			return fail(400, { error: 'Registration is closed for this event.', values });
		}
		if (isFull) {
			return fail(400, { error: 'This event is full.', values });
		}

		const [row] = await db
			.insert(registrations)
			.values({ ...values, eventId: ev.id, status: 'pending' })
			.returning({ id: registrations.id });

		let checkoutUrl: string;
		try {
			const session = await stripe.checkout.sessions.create({
				mode: 'payment',
				line_items: [{ price: ev.competitorPriceId, quantity: 1 }],
				customer_email: values.email,
				client_reference_id: String(row.id),
				metadata: { registrationId: String(row.id), eventId: String(ev.id) },
				success_url: `${url.origin}/events/${ev.slug}/register/success?session_id={CHECKOUT_SESSION_ID}`,
				cancel_url: `${url.origin}/events/${ev.slug}/register?canceled=1`
			});

			if (!session.url) throw new Error('Stripe returned no checkout URL');

			await db
				.update(registrations)
				.set({ stripeSessionId: session.id })
				.where(eq(registrations.id, row.id));

			checkoutUrl = session.url;
		} catch (e) {
			console.error('Stripe checkout session creation failed', e);
			try {
				// Free the capacity slot the pending row was holding.
				await db.delete(registrations).where(eq(registrations.id, row.id));
			} catch (cleanupError) {
				// The original Stripe error above is still the one we report to the user;
				// log this separately so an orphaned pending row doesn't hide silently.
				console.error('Failed to clean up pending registration after Stripe error', cleanupError);
			}
			return fail(500, { error: 'Could not start checkout. Please try again.', values });
		}

		// redirect() is thrown by SvelteKit, so it must stay outside the try/catch above:
		// if it were thrown from inside the try, the catch would swallow it and then delete
		// the registration of a customer who was already on their way to pay.
		throw redirect(303, checkoutUrl);
	}
};
