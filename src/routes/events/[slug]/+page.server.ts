import { db } from '$lib/server/db';
import { events, registrations } from '$lib/server/schema';
import { eq, and, inArray, count } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { ACTIVE_REGISTRATION_STATUSES, isEventFull, canRegister } from '$lib/utils/events';
import { registrationEditsOpen } from '$lib/utils/registration-editing';
import { requestRegistrationLink } from '$lib/server/registration-link-request';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [ev] = await db
		.select()
		.from(events)
		.where(and(eq(events.slug, params.slug), eq(events.published, true)))
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

	const { memberCode, ...event } = ev;
	const memberCodeEnabled = memberCode.trim() !== '';
	return {
		event,
		registrationEditsOpen: registrationEditsOpen(ev),
		memberCodeEnabled,
		isFull,
		spotsLeft: ev.capacity > 0 ? Math.max(0, ev.capacity - taken) : null,
		canRegister: canRegister(ev.status, ev.registrationOpen, ev.competitorPriceId, isFull, memberCodeEnabled)
	};
};

export const actions: Actions = { requestEditLink: requestRegistrationLink };
