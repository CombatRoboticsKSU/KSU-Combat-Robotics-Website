// Development database only. Uses temporary rows and intercepts every EmailJS call.
// node --env-file=.env tests/registration-editing.integration.mjs
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { createServer } from 'vite';

assert(process.env.DATABASE_URL && process.env.DATABASE_URL !== process.env.PROD_DATABASE_URL, 'Use a separate dev database');
delete process.env.EMAILJS_SERVICE_ID;
delete process.env.EMAILJS_PUBLIC_KEY;
process.env.PUBLIC_EMAILJS_SERVICE_ID = 'test-service';
process.env.PUBLIC_EMAILJS_USER_ID = 'test-public-key';
process.env.EMAILJS_REGISTRATION_TEMPLATE_ID = 'test-registration-template';
process.env.EMAILJS_PRIVATE_KEY = 'test-private-key-never-sent';
delete process.env.REGISTRATION_SITE_URL;
process.env.BETTER_AUTH_URL = 'https://club.example.invalid';
const q = neon(process.env.DATABASE_URL);
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
const suffix = randomUUID().replaceAll('-', '');
const originalFetch = globalThis.fetch;
const messages = [];
const providerResponses = [];
globalThis.fetch = async (input, options) => {
	if (String(input) === 'https://api.emailjs.com/api/v1.0/email/send') {
		messages.push(JSON.parse(options.body));
		return new Response('Mock EmailJS response', { status: providerResponses.shift() ?? 200 });
	}
	return originalFetch(input, options);
};
let eventId;
let otherEventId;
const owner = `${suffix}@example.invalid`;
const ip = `test-${suffix}`;
try {
	const access = await server.ssrLoadModule('/src/lib/server/registration-access.ts');
	assert.equal(access.emailProviderErrorCode('API calls are disabled for non-browser applications'), 'non_browser_requests_disabled');
	assert.equal(access.emailProviderErrorCode('Invalid accessToken: private@example.invalid'), 'private_key_rejected');
	assert.deepEqual(access.registrationEmailFailure(new Error('Do not log this token or address')), { provider: 'EmailJS', code: 'unexpected_failure' });
	const policy = await server.ssrLoadModule('/src/lib/utils/registration-editing.ts');
	const { blobStoreOrigin } = await server.ssrLoadModule('/src/lib/server/blob.ts');
	const route = await server.ssrLoadModule('/src/routes/events/[slug]/manage/+page.server.ts');
	const [event] = await q`insert into events (name,slug,published,sort_date) values ('Editing test',${'edit-' + suffix},true,'2035-05-10') returning id,slug,name`;
	eventId = event.id;
	otherEventId = (await q`insert into events (name,slug) values ('Other event',${'other-' + suffix}) returning id`)[0].id;
	const photo = `${blobStoreOrigin}/bot-photos/00000000-0000-0000-0000-000000000000-bot.png`;
	const docs = [{ name: 'Technical.pdf', url: `${blobStoreOrigin}/hazard-docs/00000000-0000-0000-0000-000000000000-technical.pdf` }];
	const [reg] = await q`insert into registrations (event_id,status,builder_name,email,bot_name,weapon_type,bot_photo_url,hazard_pneumatic,hazard_docs,hazard_status,hazard_review_note,waiver_ack,age_ack,amount_total)
		values (${eventId},'paid','Builder',${owner},'Bot','Flipper',${photo},true,${JSON.stringify(docs)}::json,'approved','Approved by staff',true,true,1500) returning id`;
	const [stranger] = await q`insert into registrations (event_id,status,builder_name,email,bot_name,bot_photo_url) values (${eventId},'paid','Other','other@example.invalid','Other Bot',${photo}) returning id`;
	await access.sendRegistrationAccess(event, owner);
	assert.equal(messages.length, 1);
	assert.equal(messages[0].service_id, 'test-service');
	assert.equal(messages[0].template_id, 'test-registration-template');
	assert.equal(messages[0].user_id, 'test-public-key');
	assert.equal(messages[0].accessToken, 'test-private-key-never-sent');
	assert.equal(messages[0].template_params.to_email, owner);
	const link = messages[0].template_params.edit_link;
	assert(link.startsWith('https://club.example.invalid/'));
	const token = new URL(link).searchParams.get('token');
	assert(access.validAccessToken(token));
	providerResponses.push(429, 200);
	await access.sendRegistrationAccess(event, owner);
	assert.equal(messages.length, 3, 'Explicit EmailJS throttling is retried');
	assert.equal(messages[1].template_params.edit_link, messages[2].template_params.edit_link, 'Retry uses the same private link');
	providerResponses.push(400);
	await assert.rejects(access.sendRegistrationAccess(event, owner));
	const failedToken = new URL(messages.at(-1).template_params.edit_link).searchParams.get('token');
	assert.equal(Number((await q`select count(*) as n from registration_access where token_hash=${access.accessHash(failedToken)}`)[0].n), 0, 'Failed delivery revokes its link');
	assert.equal(await access.exchangeAccessToken(otherEventId, token), null, 'Email link is event-scoped');
	const exchanges = await Promise.all([access.exchangeAccessToken(eventId, token), access.exchangeAccessToken(eventId, token)]);
	assert.equal(exchanges.filter(Boolean).length, 1, 'Single-use link consumed atomically');
	const session = exchanges.find(Boolean);
	assert.equal((await access.accessSession(eventId, session)).email, owner);
	assert.equal(await access.accessSession(otherEventId, session), null);
	assert.equal(await access.accessSession(eventId, 'bad'), null);
	const expired = access.privateToken();
	await q`insert into registration_access(token_hash,event_id,email,expires_at) values (${access.accessHash(expired)},${eventId},${owner},now()-interval '1 minute')`;
	assert.equal(await access.exchangeAccessToken(eventId, expired), null);
	const cookies = { get: () => session };
	const base = { params: { slug: event.slug }, cookies, setHeaders: () => {}, url: new URL(`https://club.example.invalid/events/${event.slug}/manage`) };
	const load = () => route.load(base);
	let data = await load();
	assert.equal(data.registrations.length, 1, 'Only entries owned by verified email are returned');
	assert.equal('stripePaymentIntentId' in data.registrations[0], false);
	assert.equal('waiverAck' in data.registrations[0], false);
	const formFor = (row, overrides = {}) => {
		const form = new FormData();
		const values = { ...row, hazardDocs: JSON.stringify(row.hazardDocs), ...overrides };
		for (const [key, value] of Object.entries(values)) {
			if (typeof value === 'boolean') { if (value) form.set(key, 'on'); }
			else form.set(key, String(value));
		}
		return form;
	};
	const save = form => route.actions.save({ ...base, request: new Request(base.url, { method: 'POST', body: form }) });
	const before = data.registrations[0];
	assert.equal((await save(formFor(before, { id: stranger.id }))).status, 409, 'Cannot edit another competitor by guessing id');
	assert.equal((await save(formFor(before, { botPhotoUrl: 'https://evil.example/photo.png' }))).status, 400);
	let result = await save(formFor(before, { teamName: 'New team', status: 'refunded', amountTotal: '0', waiverAck: false }));
	assert(result.success);
	let row = (await q`select * from registrations where id=${reg.id}`)[0];
	assert.equal(row.status, 'paid'); assert.equal(row.amount_total, 1500); assert.equal(row.waiver_ack, true);
	assert.equal(row.hazard_status, 'approved', 'Contact-only edits preserve technical approval');
	assert.equal((await save(formFor(before, { botName: 'Stale overwrite' }))).status, 409, 'Stale form cannot overwrite newer edits');
	data = await load();
	result = await save(formFor(data.registrations[0], { weaponType: 'New flipper' }));
	assert(result.success);
	row = (await q`select * from registrations where id=${reg.id}`)[0];
	assert.equal(row.hazard_status, 'pending_review'); assert.equal(row.hazard_review_note, ''); assert.equal(row.hazard_reviewed_at, null);
	data = await load();
	assert((await save(formFor(data.registrations[0], { hazardPneumatic: false, hazardDocs: '[]' }))).success);
	assert.equal((await q`select hazard_status from registrations where id=${reg.id}`)[0].hazard_status, 'pending_review', 'Removing hazard declarations cannot bypass review');
	assert.equal(Number((await q`select count(*) as n from registration_edit_audit where registration_id=${reg.id}`)[0].n), 3);
	const admin = await server.ssrLoadModule('/src/routes/admin/events/[id]/registrations/+page.server.ts');
	const review = new FormData(); review.set('registrationId', String(reg.id)); review.set('hazardReviewNote', 'Please clarify removed hazard declaration');
	assert((await admin.actions.rejectHazard({ params: { id: String(eventId) }, request: new Request(base.url, { method: 'POST', body: review }) })).success, 'Staff can review removed hazard declarations');
	data = await load();
	assert((await save(formFor(data.registrations[0], { phone: '555-0111' }))).success);
	assert.equal((await q`select hazard_review_note from registrations where id=${reg.id}`)[0].hazard_review_note, 'Please clarify removed hazard declaration', 'Contact edits preserve staff review notes');
	data = await load();
	await q`update registrations set status='refunded' where id=${reg.id}`;
	assert.equal((await save(formFor(data.registrations[0]))).status, 409, 'Refund race blocks save');
	await q`update registrations set status='paid' where id=${reg.id}`;
	await q`update events set registration_edit_deadline='2000-01-01' where id=${eventId}`;
	assert.equal((await save(formFor(data.registrations[0]))).status, 403);
	const day = { status: 'upcoming', sortDate: '2035-05-10T00:00:00Z', registrationEditDeadline: '' };
	assert(policy.registrationEditsOpen(day, new Date('2035-05-10T03:59:59Z')));
	assert.equal(policy.registrationEditsOpen(day, new Date('2035-05-10T04:00:00Z')), false, 'Deadline uses Kent local midnight');
	const limits = await Promise.all(Array.from({ length: 8 }, () => access.allowAccessRequest(eventId, owner, ip)));
	assert.equal(limits.filter(Boolean).length, 3, 'Email rate limit holds under concurrency');
	await q`update registration_access set session_expires_at=now()-interval '1 minute' where session_hash=${access.accessHash(session)}`;
	assert.equal(await access.accessSession(eventId, session), null);
	console.log('PASS: email delivery interception, hashed single-use links, concurrent redemption, event/email ownership, expired sessions, forged payment fields, stale edits, safety review, audit history, refund/deadline races, Eastern midnight, and persistent concurrent rate limits');
} finally {
	globalThis.fetch = originalFetch;
	if (eventId) {
		await q`delete from registrations where event_id=${eventId}`;
		await q`delete from events where id=${eventId}`;
		const { createHash } = await import('node:crypto');
		const hash = value => createHash('sha256').update(value).digest('hex');
		await q`delete from registration_edit_rate_limits where key in (${hash(`email:${eventId}:${owner}`)},${hash(`ip:${ip}`)})`;
	}
	if (otherEventId) await q`delete from events where id=${otherEventId}`;
	await server.close();
}
