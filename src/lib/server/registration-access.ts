import { createHash, randomBytes } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { and, eq, gt, inArray, isNull, sql } from 'drizzle-orm';
import { db } from './db';
import { events, registrationAccess, registrations } from './schema';
import { EDITABLE_REGISTRATION_STATUSES, registrationEditsOpen } from '$lib/utils/registration-editing';

export const accessHash = (value: string) => createHash('sha256').update(value).digest('hex');
export const privateToken = () => randomBytes(32).toString('hex');
export const validAccessToken = (value: string) => /^[a-f0-9]{64}$/.test(value);
export const emailDeliveryReady = () => !!(env.RESEND_API_KEY && env.REGISTRATION_EMAIL_FROM && env.REGISTRATION_SITE_URL);

// Persistent atomic buckets shared across serverless instances. Keys contain no raw PII.
export async function allowAccessRequest(eventId: number, email: string, ip: string) {
	for (const [key, limit] of [[`email:${eventId}:${email}`, 3], [`ip:${ip}`, 15]] as const) {
		const result = await db.execute(sql`
			insert into registration_edit_rate_limits (key, hits, resets_at)
			values (${accessHash(key)}, 1, now() + interval '1 hour')
			on conflict (key) do update set
				hits = case when registration_edit_rate_limits.resets_at <= now() then 1 else registration_edit_rate_limits.hits + 1 end,
				resets_at = case when registration_edit_rate_limits.resets_at <= now() then now() + interval '1 hour' else registration_edit_rate_limits.resets_at end
			where registration_edit_rate_limits.resets_at <= now() or registration_edit_rate_limits.hits < ${limit}
			returning key
		`);
		if (!result.rows.length) return false;
	}
	return true;
}

export async function sendRegistrationAccess(event: { id: number; slug: string; name: string }, email: string) {
	if (!emailDeliveryReady()) throw new Error('Registration email delivery is not configured');
	const [registration] = await db.select({ id: registrations.id }).from(registrations)
		.where(and(eq(registrations.eventId, event.id), sql`lower(${registrations.email}) = ${email}`, inArray(registrations.status, EDITABLE_REGISTRATION_STATUSES))).limit(1);
	if (!registration) return;
	const token = privateToken();
	await db.insert(registrationAccess).values({ tokenHash: accessHash(token), eventId: event.id, email, expiresAt: new Date(Date.now() + 30 * 60_000) });
	// Never construct emailed links from untrusted Host/request headers.
	const origin = new URL(env.REGISTRATION_SITE_URL!).origin;
	const link = `${origin}/events/${event.slug}/manage?token=${token}`;
	try {
		const response = await fetch('https://api.resend.com/emails', {
			method: 'POST', signal: AbortSignal.timeout(10_000),
			headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ from: env.REGISTRATION_EMAIL_FROM, to: [email], subject: `Manage your registration — ${event.name}`, text: `Use this private link to edit your confirmed entries for ${event.name}:\n\n${link}\n\nThis link expires in 30 minutes and can be used once. After opening it, press Continue to verify your email. Never share this link. If you did not request it, ignore this email. Request another link from the event page when needed.` })
		});
		if (!response.ok) throw new Error(`Registration email delivery failed (${response.status})`);
	} catch (error) {
		// Do not log response bodies, addresses, or private links.
		await db.delete(registrationAccess).where(eq(registrationAccess.tokenHash, accessHash(token)));
		throw error;
	}
}

export async function exchangeAccessToken(eventId: number, token: string) {
	if (!validAccessToken(token)) return null;
	const session = privateToken();
	const [grant] = await db.update(registrationAccess).set({ usedAt: new Date(), sessionHash: accessHash(session), sessionExpiresAt: new Date(Date.now() + 2 * 60 * 60_000) })
		.where(and(eq(registrationAccess.tokenHash, accessHash(token)), eq(registrationAccess.eventId, eventId), isNull(registrationAccess.usedAt), gt(registrationAccess.expiresAt, new Date())))
		.returning({ email: registrationAccess.email });
	return grant ? session : null;
}

export async function accessSession(eventId: number, session: string) {
	if (!validAccessToken(session)) return null;
	const [grant] = await db.select({ email: registrationAccess.email }).from(registrationAccess)
		.where(and(eq(registrationAccess.eventId, eventId), eq(registrationAccess.sessionHash, accessHash(session)), gt(registrationAccess.sessionExpiresAt, new Date()))).limit(1);
	return grant ?? null;
}

// Email failures must never undo a successful payment or a member registration.
export async function notifyRegistrationAccess(registrationId: number) {
	if (!emailDeliveryReady()) return;
	try {
		const [row] = await db.select({ event: events, email: registrations.email }).from(registrations)
			.innerJoin(events, eq(events.id, registrations.eventId)).where(eq(registrations.id, registrationId)).limit(1);
		if (row && registrationEditsOpen(row.event)) await sendRegistrationAccess(row.event, row.email.trim().toLowerCase());
	} catch { console.error('Registration access notification failed; competitor can request another link'); }
}
