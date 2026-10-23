import { createHash, randomBytes } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { and, eq, gt, inArray, isNull, sql } from 'drizzle-orm';
import { db } from './db';
import { events, registrationAccess, registrations } from './schema';
import { EDITABLE_REGISTRATION_STATUSES, registrationEditsOpen } from '$lib/utils/registration-editing';

export const accessHash = (value: string) => createHash('sha256').update(value).digest('hex');
export const privateToken = () => randomBytes(32).toString('hex');
export const validAccessToken = (value: string) => /^[a-f0-9]{64}$/.test(value);
class EmailDeliveryError extends Error {
	constructor(public status: number, public code: string) { super('Registration email delivery failed'); }
}

// Classify provider errors without logging its response, which may echo private data.
export function emailProviderErrorCode(message: string) {
	const text = message.toLowerCase();
	if (/non.browser|browser applications|server.side.*disabled/.test(text)) return 'non_browser_requests_disabled';
	if (/private.key|access.?token/.test(text)) return 'private_key_rejected';
	if (/public.key|user_id/.test(text)) return 'public_key_rejected';
	if (/template/.test(text)) return 'template_configuration';
	if (/service/.test(text)) return 'service_configuration';
	if (/captcha/.test(text)) return 'template_captcha_required';
	if (/quota|limit|too many/.test(text)) return 'provider_limit';
	if (/recipient|to_email|address/.test(text)) return 'recipient_configuration';
	return 'provider_rejected';
}

export function registrationEmailFailure(error: unknown) {
	return error instanceof EmailDeliveryError
		? { provider: 'EmailJS', status: error.status, code: error.code }
		: { provider: 'EmailJS', code: error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name) ? 'request_timeout' : 'unexpected_failure' };
}
function emailConfig() {
	return {
		serviceId: env.EMAILJS_SERVICE_ID || publicEnv.PUBLIC_EMAILJS_SERVICE_ID,
		publicKey: env.EMAILJS_PUBLIC_KEY || publicEnv.PUBLIC_EMAILJS_USER_ID,
		templateId: env.EMAILJS_REGISTRATION_TEMPLATE_ID,
		privateKey: env.EMAILJS_PRIVATE_KEY
	};
}
const registrationSiteUrl = () => env.REGISTRATION_SITE_URL || env.BETTER_AUTH_URL;
export const emailDeliveryReady = () => {
	const config = emailConfig();
	return !!(config.serviceId && config.publicKey && config.templateId && config.privateKey && registrationSiteUrl());
};

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
	if (!emailDeliveryReady()) throw new EmailDeliveryError(0, 'not_configured');
	const [registration] = await db.select({ id: registrations.id }).from(registrations)
		.where(and(eq(registrations.eventId, event.id), sql`lower(${registrations.email}) = ${email}`, inArray(registrations.status, EDITABLE_REGISTRATION_STATUSES))).limit(1);
	if (!registration) return false;
	// Validate configuration before storing a token.
	const origin = new URL(registrationSiteUrl()!).origin;
	const token = privateToken();
	await db.insert(registrationAccess).values({ tokenHash: accessHash(token), eventId: event.id, email, expiresAt: new Date(Date.now() + 30 * 60_000) });
	// Never construct emailed links from untrusted Host/request headers.
	const link = `${origin}/events/${event.slug}/manage?token=${token}`;
	try {
		const config = emailConfig();
		const body = JSON.stringify({
			service_id: config.serviceId, template_id: config.templateId, user_id: config.publicKey,
			accessToken: config.privateKey,
			template_params: {
				to_email: email, event_name: event.name, edit_link: link, expires_minutes: '30',
				message: `Use this private link to edit your confirmed entries for ${event.name}:\n\n${link}\n\nThis link expires in 30 minutes and can be used once. After opening it, press Continue to verify your email. Never share this link. If you did not request it, ignore this email. Request another link from the event page when needed.`
			}
		});
		// EmailJS limits sends to one per second. Retry only explicit throttling;
		// retrying ambiguous timeouts could send duplicate emails.
		for (let attempt = 0; attempt < 3; attempt++) {
			const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
				method: 'POST', signal: AbortSignal.timeout(10_000),
				headers: { 'Content-Type': 'application/json' }, body
			});
			if (response.ok) return true;
			if (response.status !== 429 || attempt === 2) throw new EmailDeliveryError(response.status, emailProviderErrorCode((await response.text()).slice(0, 2000)));
			await new Promise(resolve => setTimeout(resolve, 1100 * (attempt + 1)));
		}
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
	if (!emailDeliveryReady()) {
		console.error('Registration access notification skipped', { provider: 'EmailJS', code: 'not_configured' });
		return;
	}
	try {
		const [row] = await db.select({ event: events, email: registrations.email }).from(registrations)
			.innerJoin(events, eq(events.id, registrations.eventId)).where(eq(registrations.id, registrationId)).limit(1);
		if (row && registrationEditsOpen(row.event)) await sendRegistrationAccess(row.event, row.email.trim().toLowerCase());
	} catch (error) { console.error('Registration access notification failed', registrationEmailFailure(error)); }
}
