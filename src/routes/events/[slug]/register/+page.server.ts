import { db } from '$lib/server/db';
import { blobStoreOrigin, botPhotoPathname, hazardDocumentPathname } from '$lib/server/blob';
import { events, registrations } from '$lib/server/schema';
import { notifyRegistrationAccess } from '$lib/server/registration-access';
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

	if (!canRegister(ev.status, ev.registrationOpen, isFull)) {
		throw redirect(303, `/events/${ev.slug}`);
	}

	const { memberCode: _memberCode, ...event } = ev;
	return {
		event,
		waiverText: resolveWaiverText(ev.waiverText),
		waiverPdfUrl: ev.waiverPdfUrl
	};
};

export const actions: Actions = {
	default: async ({ request, params }) => {
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

		// isFull is checked separately below so it can carry its own message; pass isFull: false
		// here so this call only covers the "closed" reasons canRegister otherwise folds together.
		if (!canRegister(ev.status, ev.registrationOpen, false)) {
			return fail(400, { error: 'Registration is closed for this event.', values });
		}
		if (isFull) {
			return fail(400, { error: 'This event is full.', values });
		}

		// neon-http batches run in one transaction. Lock the event before the insert's
		// capacity check so concurrent requests cannot take the same spot.
		const [, inserted] = await db.batch([
			db.execute(sql`select pg_advisory_xact_lock(${7301}, ${ev.id})`),
			db.execute<{ id: number }>(sql`
				insert into ${registrations} (
					event_id, status, builder_name, email, phone, team_name, bot_name,
					weapon_type, bot_photo_url, hazard_pneumatic, hazard_high_mass, hazard_docs,
					hazard_status, notes, waiver_ack, age_ack
				)
				select ${ev.id}, 'registered',
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

		await notifyRegistrationAccess(row.id);
		throw redirect(303, `/events/${ev.slug}/register/success${isHazard ? '?hazard=1' : ''}`);
	}
};
