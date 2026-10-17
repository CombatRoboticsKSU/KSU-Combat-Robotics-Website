import { db } from '$lib/server/db';
import { events, registrations } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export function readRegistrationFields(form: FormData) {
	function text(name: string) {
		const value = form.get(name);
		return typeof value === 'string' ? value.trim() : '';
	}
	return {
		builderName: text('builderName'),
		email: text('email'),
		phone: text('phone'),
		teamName: text('teamName'),
		botName: text('botName'),
		weaponType: text('weaponType'),
		notes: text('notes'),
		hazardPneumatic: form.get('hazardPneumatic') === 'on',
		hazardHighMass: form.get('hazardHighMass') === 'on'
	};
}

export function registrationFieldError(values: ReturnType<typeof readRegistrationFields>) {
	if (!values.builderName) return 'Builder name is required';
	if (!values.email || !values.email.includes('@')) return 'A valid email is required';
	if (!values.botName) return 'Bot name is required';
	return null;
}

export function eventId(value: string) {
	const id = Number(value);
	if (!Number.isSafeInteger(id) || id <= 0) throw error(404, 'Event not found');
	return id;
}

export function registrationWhere(id: string, regId: string) {
	const registrationId = Number(regId);
	if (!Number.isSafeInteger(registrationId) || registrationId <= 0) throw error(404, 'Registration not found');
	return and(eq(registrations.eventId, eventId(id)), eq(registrations.id, registrationId));
}

export async function loadAdminEvent(id: string) {
	const [event] = await db.select().from(events).where(eq(events.id, eventId(id))).limit(1);
	if (!event) throw error(404, 'Event not found');
	return event;
}

export async function loadAdminRegistration(id: string, regId: string) {
	const [registration] = await db.select().from(registrations).where(registrationWhere(id, regId)).limit(1);
	if (!registration) throw error(404, 'Registration not found');
	return registration;
}
