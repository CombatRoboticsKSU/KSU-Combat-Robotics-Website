import { db } from './db';
import { events } from './schema';
import { allowAccessRequest, emailDeliveryReady, registrationEmailFailure, sendRegistrationAccess } from './registration-access';
import { registrationEditsOpen } from '$lib/utils/registration-editing';
import { and, eq } from 'drizzle-orm';
import { error, fail, type RequestEvent } from '@sveltejs/kit';

// Shared by the event page and the private registration management page.
export async function requestRegistrationLink({ params, request, getClientAddress, setHeaders }: Pick<RequestEvent, 'params' | 'request' | 'getClientAddress' | 'setHeaders'>) {
	setHeaders({ 'cache-control': 'private, no-store', 'referrer-policy': 'same-origin' });
	const [event] = await db.select().from(events).where(and(eq(events.slug, params.slug ?? ''), eq(events.published, true))).limit(1);
	if (!event) error(404, 'Event not found');
	if (!registrationEditsOpen(event)) return fail(403, { error: 'Editing is closed. Contact event staff for help.' });
	if (!emailDeliveryReady()) return fail(503, { error: 'Email access is temporarily unavailable. Contact event staff for help.' });
	const form = await request.formData();
	const email = String(form.get('email') ?? '').trim().toLowerCase();
	if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(400, { error: 'Enter a valid email address.' });
	const success = 'If that email has a confirmed registration, a private link will arrive shortly. Check your spam folder. Please wait before requesting another.';
	if (!await allowAccessRequest(event.id, email, getClientAddress())) {
		console.info('Registration access request skipped', { eventId: event.id, code: 'request_rate_limited' });
		return fail(429, { error: 'Too many edit-link requests. Please wait up to an hour before trying again, or contact event staff.' });
	}
	try {
		const sent = await sendRegistrationAccess(event, email);
		console.info('Registration access email request', { eventId: event.id, code: sent ? 'provider_accepted' : 'no_confirmed_registration' });
	} catch (error) { console.error('Registration access email could not be delivered', registrationEmailFailure(error)); }
	return { success };
}
