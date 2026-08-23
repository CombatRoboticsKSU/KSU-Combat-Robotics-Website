import { db } from '$lib/server/db';
import { events, registrations } from '$lib/server/schema';
import { stripe } from '$lib/server/stripe';
import { isEventFull } from '$lib/utils/events';
import { eq, and, or, count } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

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

	if (ev.status === 'past' || !ev.registrationOpen || ev.competitorPriceId === '' || isFull) {
		throw redirect(303, `/events/${ev.slug}`);
	}

	return { event: ev };
};

export const actions: Actions = {
	default: async ({ request, params, url }) => {
		const form = await request.formData();
		const values = {
			builderName: (form.get('builderName') as string)?.trim() ?? '',
			email: (form.get('email') as string)?.trim() ?? '',
			phone: (form.get('phone') as string)?.trim() ?? '',
			teamName: (form.get('teamName') as string)?.trim() ?? '',
			botName: (form.get('botName') as string)?.trim() ?? '',
			weaponType: (form.get('weaponType') as string)?.trim() ?? '',
			notes: (form.get('notes') as string)?.trim() ?? '',
			waiverAck: form.get('waiverAck') === 'on'
		};

		if (!values.builderName) return fail(400, { error: 'Builder name is required', values });
		if (!values.email || !values.email.includes('@')) {
			return fail(400, { error: 'A valid email is required', values });
		}
		if (!values.botName) return fail(400, { error: 'Bot name is required', values });
		if (!values.waiverAck) {
			return fail(400, { error: 'You must acknowledge the safety rules to register', values });
		}

		const { ev, isFull } = await loadOpenEvent(params.slug);

		if (ev.status === 'past' || !ev.registrationOpen || ev.competitorPriceId === '') {
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
			// Free the capacity slot the pending row was holding.
			await db.delete(registrations).where(eq(registrations.id, row.id));
			console.error('Stripe checkout session creation failed', e);
			return fail(500, { error: 'Could not start checkout. Please try again.', values });
		}

		throw redirect(303, checkoutUrl);
	}
};
