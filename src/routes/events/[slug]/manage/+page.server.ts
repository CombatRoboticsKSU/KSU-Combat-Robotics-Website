import { dev } from '$app/environment';
import { db } from '$lib/server/db';
import { events, registrations, registrationAccess } from '$lib/server/schema';
import { accessHash, accessSession, emailDeliveryReady, exchangeAccessToken, validAccessToken } from '$lib/server/registration-access';
import { requestRegistrationLink } from '$lib/server/registration-link-request';
import { readCompetitorEdits } from '$lib/server/registration-edit-fields';
import { EDITABLE_REGISTRATION_STATUSES, registrationEditsOpen } from '$lib/utils/registration-editing';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

async function getEvent(slug: string) {
	const [event] = await db.select().from(events).where(and(eq(events.slug, slug), eq(events.published, true))).limit(1);
	if (!event) error(404, 'Event not found');
	return event;
}
const cookieName = (id: number) => `registration_edit_${id}`;
const cookiePath = (slug: string) => `/events/${slug}/manage`;
// Keep Origin on native same-site POSTs for SvelteKit's CSRF check, while
// preventing private email-link URLs from being sent to external sites.
const responseHeaders = { 'cache-control': 'private, no-store', 'referrer-policy': 'same-origin', 'x-robots-tag': 'noindex, nofollow' };

export const load: PageServerLoad = async ({ params, cookies, url, setHeaders }) => {
	setHeaders(responseHeaders);
	const event = await getEvent(params.slug);
	const grant = await accessSession(event.id, cookies.get(cookieName(event.id)) ?? '');
	const rows = grant ? await db.select({
		id: registrations.id, builderName: registrations.builderName, email: registrations.email,
		phone: registrations.phone, teamName: registrations.teamName, botName: registrations.botName,
		weaponType: registrations.weaponType, botPhotoUrl: registrations.botPhotoUrl, notes: registrations.notes,
		hazardPneumatic: registrations.hazardPneumatic, hazardHighMass: registrations.hazardHighMass, hazardDocs: registrations.hazardDocs,
		hazardStatus: registrations.hazardStatus,
		revision: sql<string>`md5(row_to_json(registrations)::text)`
	}).from(registrations).where(and(eq(registrations.eventId, event.id), sql`lower(${registrations.email}) = ${grant.email}`, inArray(registrations.status, EDITABLE_REGISTRATION_STATUSES))) : [];
	return {
		event: { name: event.name, slug: event.slug, deadline: event.registrationEditDeadline },
		open: registrationEditsOpen(event), emailReady: emailDeliveryReady(), verified: !!grant,
		token: validAccessToken(url.searchParams.get('token') ?? '') ? url.searchParams.get('token')! : '',
		registrations: rows
	};
};

export const actions: Actions = {
	requestLink: requestRegistrationLink,
	verify: async ({ params, request, cookies }) => {
		const event = await getEvent(params.slug);
		if (!registrationEditsOpen(event)) return fail(403, { error: 'Editing is closed. Contact event staff for help.' });
		const session = await exchangeAccessToken(event.id, String((await request.formData()).get('token') ?? ''));
		if (!session) return fail(400, { error: 'This link has expired or was already used. Request a new link below.' });
		cookies.set(cookieName(event.id), session, { path: cookiePath(event.slug), httpOnly: true, secure: !dev, sameSite: 'lax', maxAge: 7200 });
		redirect(303, cookiePath(event.slug));
	},
	logout: async ({ params, cookies }) => {
		const event = await getEvent(params.slug);
		const session = cookies.get(cookieName(event.id)) ?? '';
		if (validAccessToken(session)) await db.delete(registrationAccess).where(and(eq(registrationAccess.eventId, event.id), eq(registrationAccess.sessionHash, accessHash(session))));
		cookies.delete(cookieName(event.id), { path: cookiePath(event.slug) });
		redirect(303, cookiePath(event.slug));
	},
	save: async ({ params, request, cookies, setHeaders }) => {
		setHeaders(responseHeaders);
		const event = await getEvent(params.slug);
		const grant = await accessSession(event.id, cookies.get(cookieName(event.id)) ?? '');
		if (!grant) return fail(401, { error: 'Your editing session expired. Request a new email link.' });
		if (!registrationEditsOpen(event)) return fail(403, { error: 'Editing is closed. Contact event staff for help.' });
		const form = await request.formData();
		const id = Number(form.get('id'));
		const revision = String(form.get('revision') ?? '');
		if (!Number.isSafeInteger(id) || id < 1 || !/^[a-f0-9]{32}$/.test(revision)) return fail(400, { error: 'Invalid registration. Reload the page and try again.' });
		let values: ReturnType<typeof readCompetitorEdits>;
		try { values = readCompetitorEdits(form); }
		catch (e) { return fail(400, { error: e instanceof Error ? e.message : 'Invalid registration details.' }); }
		const hazard = values.hazardPneumatic || values.hazardHighMass;
		// One statement locks, checks ownership/status/deadline/revision, updates the allowlisted
		// fields, and records the before/after. Payment and waiver columns never come from the form.
		const result = await db.execute(sql`
			with original as (
				select r.* from registrations r join events e on e.id = r.event_id
				where r.id = ${id} and r.event_id = ${event.id} and lower(r.email) = ${grant.email}
				and r.status in ('paid', 'member', 'paid_offline') and e.published = true and e.status <> 'past'
				and (now() at time zone 'America/New_York')::date < e.sort_date::date
				and (e.registration_edit_deadline = '' or to_char(now() at time zone 'America/New_York', 'YYYY-MM-DD') <= e.registration_edit_deadline)
				for update of r, e
			), changed as (
				update registrations r set builder_name = ${values.builderName}, phone = ${values.phone},
				team_name = ${values.teamName}, bot_name = ${values.botName}, weapon_type = ${values.weaponType},
				bot_photo_url = ${values.botPhotoUrl}, notes = ${values.notes}, hazard_pneumatic = ${values.hazardPneumatic},
				hazard_high_mass = ${values.hazardHighMass}, hazard_docs = ${JSON.stringify(values.hazardDocs)}::json,
				hazard_status = case when (${hazard} or o.hazard_pneumatic or o.hazard_high_mass or o.hazard_status <> 'not_required') and (
					o.weapon_type is distinct from ${values.weaponType} or o.bot_photo_url is distinct from ${values.botPhotoUrl}
					or o.hazard_pneumatic is distinct from ${values.hazardPneumatic} or o.hazard_high_mass is distinct from ${values.hazardHighMass}
					or o.hazard_docs::jsonb is distinct from ${JSON.stringify(values.hazardDocs)}::jsonb) then 'pending_review' else o.hazard_status end,
				hazard_review_note = case when o.weapon_type = ${values.weaponType} and o.bot_photo_url = ${values.botPhotoUrl}
					and o.hazard_pneumatic = ${values.hazardPneumatic} and o.hazard_high_mass = ${values.hazardHighMass}
					and o.hazard_docs::jsonb = ${JSON.stringify(values.hazardDocs)}::jsonb then o.hazard_review_note else '' end,
				hazard_reviewed_at = case when o.weapon_type = ${values.weaponType} and o.bot_photo_url = ${values.botPhotoUrl}
					and o.hazard_pneumatic = ${values.hazardPneumatic} and o.hazard_high_mass = ${values.hazardHighMass}
					and o.hazard_docs::jsonb = ${JSON.stringify(values.hazardDocs)}::jsonb then o.hazard_reviewed_at else null end
				from original o where r.id = o.id and md5(row_to_json(o)::text) = ${revision}
				returning r.*
			)
			insert into registration_edit_audit (registration_id, before, after)
			select c.id, row_to_json(o), row_to_json(c) from changed c join original o on c.id = o.id returning id
		`);
		if (!result.rows.length) return fail(409, { error: 'This entry changed or is no longer editable. Reload the page before saving again.' });
		return { success: 'Registration saved. Your payment is unchanged. Any changed Hazard Bot details have been sent back for technical review.' };
	}
};
