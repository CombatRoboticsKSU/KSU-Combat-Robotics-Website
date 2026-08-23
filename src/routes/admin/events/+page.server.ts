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
		sortDate: form.get('sortDate') ? new Date(form.get('sortDate') as string) : new Date(),
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

export const actions: Actions = {
	createEvent: async ({ request }) => {
		const form = await request.formData();
		const values = readEventFields(form);
		if (!values.name) return fail(400, { error: 'Name is required' });
		if (!/^[a-z0-9-]+$/.test(values.slug)) {
			return fail(400, { error: 'Slug must be lowercase letters, numbers, and hyphens only' });
		}
		try {
			await db.insert(events).values(values);
		} catch {
			return fail(400, { error: 'That slug is already in use' });
		}
		return { success: true };
	},

	updateEvent: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		const values = readEventFields(form);
		if (!values.name) return fail(400, { error: 'Name is required' });
		if (!/^[a-z0-9-]+$/.test(values.slug)) {
			return fail(400, { error: 'Slug must be lowercase letters, numbers, and hyphens only' });
		}
		try {
			await db.update(events).set({ ...values, updatedAt: new Date() }).where(eq(events.id, id));
		} catch {
			return fail(400, { error: 'That slug is already in use' });
		}
		return { success: true };
	},

	deleteEvent: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);

		// Paid and refunded rows are financial records. Neither may be destroyed here.
		const [{ value: protectedRows }] = await db
			.select({ value: count() })
			.from(registrations)
			.where(
				and(
					eq(registrations.eventId, id),
					or(eq(registrations.status, 'paid'), eq(registrations.status, 'refunded'))
				)
			);

		if (protectedRows > 0) {
			return fail(400, {
				error: `This event has ${protectedRows} paid or refunded registration(s) and cannot be deleted. Mark it past instead.`
			});
		}

		await db.delete(registrations).where(eq(registrations.eventId, id));
		await db.delete(events).where(eq(events.id, id));
		return { success: true };
	}
};
