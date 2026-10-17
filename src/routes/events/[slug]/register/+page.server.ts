import { timingSafeEqual } from 'node:crypto';
import { db } from '$lib/server/db';
import { blobStoreOrigin, botPhotoPathname, hazardDocumentPathname } from '$lib/server/blob';
import { events, registrations } from '$lib/server/schema';
import { stripe } from '$lib/server/stripe';
import { ACTIVE_REGISTRATION_STATUSES, isEventFull, canRegister } from '$lib/utils/events';
import { resolveWaiverText } from '$lib/utils/waiver';
import { eq, and, inArray, count, sql } from 'drizzle-orm';
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
				inArray(registrations.status, ACTIVE_REGISTRATION_STATUSES)
			)
		);

	const isFull = isEventFull(ev.capacity, taken);
	return { ev, isFull };
}

export const load: PageServerLoad = async ({ params }) => {
	const { ev, isFull } = await loadOpenEvent(params.slug);

	if (!canRegister(ev.status, ev.registrationOpen, ev.competitorPriceId, isFull, ev.memberCode.trim() !== '')) {
		throw redirect(303, `/events/${ev.slug}`);
	}

	const { memberCode, ...event } = ev;
	return {
		event,
		memberCodeEnabled: memberCode.trim() !== '',
		waiverText: resolveWaiverText(ev.waiverText),
		waiverPdfUrl: ev.waiverPdfUrl
	};
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
			botPhotoUrl: readField(form, 'botPhotoUrl'),
			hazardPneumatic: form.get('hazardPneumatic') === 'on',
			hazardHighMass: form.get('hazardHighMass') === 'on',
			hazardDocs: readField(form, 'hazardDocs'),
			notes: readField(form, 'notes'),
			waiverAck: form.get('waiverAck') === 'on',
			ageAck: form.get('ageAck') === 'on'
		};

		if (!values.builderName) return fail(400, { error: 'Builder name is required', values });
		if (!values.email || !values.email.includes('@')) {
			return fail(400, { error: 'A valid email is required', values });
		}
		if (!values.botName) return fail(400, { error: 'Bot name is required', values });
		let botPhotoUrl = '';
		try {
			const photo = new URL(values.botPhotoUrl);
			if (photo.origin !== blobStoreOrigin || !botPhotoPathname.test(photo.pathname.slice(1))) throw new Error();
			botPhotoUrl = photo.href;
		} catch {
			return fail(400, { error: 'Upload a photo of your bot.', values });
		}
		if (!values.waiverAck) {
			return fail(400, { error: 'You must agree to the waiver to register', values });
		}
		if (!values.ageAck) {
			return fail(400, { error: 'You must confirm you are 18 or older to register', values });
		}

		const isHazard = values.hazardPneumatic || values.hazardHighMass;
		const hazardDocs: { name: string; url: string }[] = [];
		if (isHazard) {
			try {
				const docs: unknown = JSON.parse(values.hazardDocs || '[]');
				if (!Array.isArray(docs) || docs.length > 5) throw new Error();
				for (const doc of docs) {
					if (
						!doc || typeof doc !== 'object' ||
						typeof doc.name !== 'string' || typeof doc.url !== 'string'
					) {
						throw new Error();
					}
					const name = doc.name.trim().slice(0, 200);
					const url = new URL(doc.url);
					if (
						!name || url.origin !== blobStoreOrigin ||
						!hazardDocumentPathname.test(url.pathname.slice(1))
					) {
						throw new Error();
					}
					hazardDocs.push({ name, url: url.href });
				}
			} catch {
				return fail(400, { error: 'Upload up to 5 valid Hazard Bot documents (PDF or images).', values });
			}
			if (hazardDocs.length === 0) {
				return fail(400, { error: 'At least one technical document is required for a Hazard Bot.', values });
			}
		}

		const { ev, isFull } = await loadOpenEvent(params.slug);

		const enteredCode = readField(form, 'memberCode');
		let isMember = false;
		if (enteredCode) {
			const entered = Buffer.from(enteredCode.toLowerCase());
			const expected = Buffer.from(ev.memberCode.trim().toLowerCase());
			isMember = expected.length > 0 && entered.length === expected.length && timingSafeEqual(entered, expected);
			if (!isMember) {
				return fail(400, { error: 'That member access code is not valid for this event.', values });
			}
		}

		// isFull is checked separately below so it can carry its own message; pass isFull: false
		// here so this call only covers the "closed" reasons canRegister otherwise folds together.
		if (!canRegister(ev.status, ev.registrationOpen, ev.competitorPriceId, false, isMember)) {
			return fail(400, { error: 'Registration is closed for this event.', values });
		}
		if (isFull) {
			return fail(400, { error: 'This event is full.', values });
		}

		// neon-http batches run in one transaction. Lock the event before the insert's
		// capacity check so concurrent member and Stripe requests cannot take the same spot.
		const [, inserted] = await db.batch([
			db.execute(sql`select pg_advisory_xact_lock(${7301}, ${ev.id})`),
			db.execute<{ id: number }>(sql`
				insert into ${registrations} (
					event_id, status, builder_name, email, phone, team_name, bot_name,
					weapon_type, bot_photo_url, hazard_pneumatic, hazard_high_mass, hazard_docs,
					hazard_status, notes, waiver_ack, age_ack
				)
				select ${ev.id}, ${isMember ? 'member' : 'pending'},
					${values.builderName}, ${values.email}, ${values.phone}, ${values.teamName},
					${values.botName}, ${values.weaponType}, ${botPhotoUrl}, ${values.hazardPneumatic},
					${values.hazardHighMass}, ${JSON.stringify(hazardDocs)}::json,
					${isHazard ? 'pending_review' : 'not_required'}, ${values.notes},
					${values.waiverAck}, ${values.ageAck}
				from ${events}
				where ${events.id} = ${ev.id} and (
					${events.capacity} = 0 or (
						select count(*) from ${registrations}
						where ${registrations.eventId} = ${ev.id}
							and ${inArray(registrations.status, ACTIVE_REGISTRATION_STATUSES)}
					) < ${events.capacity}
				)
				returning ${registrations.id}
			`)
		]);
		const [row] = inserted.rows;
		if (!row) {
			return fail(400, { error: 'This event is full.', values });
		}

		if (isMember) {
			throw redirect(303, `/events/${ev.slug}/register/success?member=1${isHazard ? '&hazard=1' : ''}`);
		}

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
