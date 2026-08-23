import { db } from '$lib/server/db';
import { events, registrations } from '$lib/server/schema';
import { eq, and, or, asc, count } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allEvents = await db.select().from(events).orderBy(asc(events.sortOrder));
	const paidCounts = await db
		.select({ eventId: registrations.eventId, value: count() })
		.from(registrations)
		.where(eq(registrations.status, 'paid'))
		.groupBy(registrations.eventId);

	const paidByEvent: Record<number, number> = {};
	for (const row of paidCounts) paidByEvent[row.eventId] = row.value;

	return { events: allEvents, paidByEvent };
};

function parseJsonField<T>(raw: FormDataEntryValue | null, fallback: T): T {
	if (typeof raw !== 'string' || raw.trim() === '') return fallback;
	try {
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

function readEventFields(form: FormData) {
	return {
		name: (form.get('name') as string)?.trim() ?? '',
		slug: (form.get('slug') as string)?.trim().toLowerCase() ?? '',
		tagline: (form.get('tagline') as string) ?? '',
		image: (form.get('image') as string) || '/USINGimg/placeholder.png',
		weightClass: (form.get('weightClass') as string) ?? '',
		eventDate: (form.get('eventDate') as string) ?? '',
		// sortDate is intentionally excluded here: createEvent and updateEvent handle it
		// differently (see readSortDate below) so that clearing the field on an update
		// preserves the existing value instead of silently writing today's date.
		doorsTime: (form.get('doorsTime') as string) ?? '',
		location: (form.get('location') as string) ?? '',
		address: (form.get('address') as string) ?? '',
		status: (form.get('status') as string) === 'past' ? 'past' : 'upcoming',
		overview: (form.get('overview') as string) ?? '',
		rulesPdfUrl: (form.get('rulesPdfUrl') as string) ?? '',
		rulesLabel: (form.get('rulesLabel') as string) || 'Download Rules (PDF)',
		registrationOpen: form.get('registrationOpen') === 'on',
		competitorPriceId: (form.get('competitorPriceId') as string)?.trim() ?? '',
		competitorLabel: (form.get('competitorLabel') as string) || 'Register to Compete',
		competitorPrice: (form.get('competitorPrice') as string) ?? '',
		competitorNote: (form.get('competitorNote') as string) ?? '',
		capacity: parseInt(form.get('capacity') as string) || 0,
		spectatorUrl: (form.get('spectatorUrl') as string)?.trim() ?? '',
		spectatorLabel: (form.get('spectatorLabel') as string) || 'Buy Spectator Tickets',
		spectatorPrice: (form.get('spectatorPrice') as string) ?? '',
		spectatorNote: (form.get('spectatorNote') as string) ?? '',
		schedule: parseJsonField<{ time: string; label: string }[]>(form.get('schedule'), []),
		faq: parseJsonField<{ question: string; answer: string }[]>(form.get('faq'), []),
		published: form.get('published') === 'on',
		sortOrder: parseInt(form.get('sortOrder') as string) || 0
	};
}

// An empty sortDate field must not silently write today's date. CREATE has no prior value
// to preserve, so falling back to now is fine; UPDATE returns null on empty so the caller
// can omit the column entirely and leave the stored value untouched.
function readSortDate(form: FormData): Date | null {
	const raw = (form.get('sortDate') as string) ?? '';
	return raw ? new Date(raw) : null;
}

function pgErrorCode(err: unknown): string | undefined {
	if (!err || typeof err !== 'object') return undefined;
	if ('code' in err && typeof (err as { code?: unknown }).code === 'string') {
		return (err as { code: string }).code;
	}
	// drizzle-orm wraps the underlying postgres error in a DrizzleQueryError,
	// putting the real error (with its SQLSTATE code) on `.cause`.
	if ('cause' in err) return pgErrorCode((err as { cause?: unknown }).cause);
	return undefined;
}

function isUniqueViolation(err: unknown): boolean {
	return pgErrorCode(err) === '23505';
}

export const actions: Actions = {
	createEvent: async ({ request }) => {
		const form = await request.formData();
		const values = readEventFields(form);
		if (!values.name) return fail(400, { error: 'Name is required' });
		if (!/^[a-z0-9-]+$/.test(values.slug)) {
			return fail(400, { error: 'Slug must be lowercase letters, numbers, and hyphens only' });
		}
		try {
			await db.insert(events).values({ ...values, sortDate: readSortDate(form) ?? new Date() });
		} catch (err) {
			if (isUniqueViolation(err)) {
				return fail(400, { error: 'That slug is already in use' });
			}
			console.error('createEvent failed', err);
			return fail(400, { error: 'Failed to create event' });
		}
		return { success: true };
	},

	updateEvent: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		if (!Number.isFinite(id)) return fail(400, { error: 'Invalid event id' });
		const values = readEventFields(form);
		if (!values.name) return fail(400, { error: 'Name is required' });
		if (!/^[a-z0-9-]+$/.test(values.slug)) {
			return fail(400, { error: 'Slug must be lowercase letters, numbers, and hyphens only' });
		}
		// Omit sortDate from the update entirely when the field was submitted empty, so
		// clearing it in the form preserves the existing stored value instead of
		// overwriting it with today's date.
		const sortDate = readSortDate(form);
		try {
			await db
				.update(events)
				.set({ ...values, ...(sortDate ? { sortDate } : {}), updatedAt: new Date() })
				.where(eq(events.id, id));
		} catch (err) {
			if (isUniqueViolation(err)) {
				return fail(400, { error: 'That slug is already in use' });
			}
			console.error('updateEvent failed', err);
			return fail(400, { error: 'Failed to update event' });
		}
		return { success: true };
	},

	deleteEvent: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		if (!Number.isFinite(id)) return fail(400, { error: 'Invalid event id' });

		// Paid and refunded rows are financial records and may never be destroyed here.
		// Pending rows must also be protected: a pending row can be someone on the Stripe
		// checkout page right now. Deleting the event out from under them lets the payment
		// complete with no registration left for the webhook to mark paid. Only rows that
		// have resolved to 'expired' (or no rows at all) may be deleted.
		const [{ value: protectedRows }] = await db
			.select({ value: count() })
			.from(registrations)
			.where(
				and(
					eq(registrations.eventId, id),
					or(
						eq(registrations.status, 'pending'),
						eq(registrations.status, 'paid'),
						eq(registrations.status, 'refunded')
					)
				)
			);

		if (protectedRows > 0) {
			return fail(400, {
				error: `This event has ${protectedRows} pending, paid, or refunded registration(s) and cannot be deleted. A pending registration may just be an in-flight checkout that will resolve itself shortly; wait for it to complete or expire, or mark the event past instead.`
			});
		}

		await db.delete(registrations).where(eq(registrations.eventId, id));
		await db.delete(events).where(eq(events.id, id));
		return { success: true };
	}
};
