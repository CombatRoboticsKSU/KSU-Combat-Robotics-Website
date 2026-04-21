import { db } from '$lib/server/db';
import { sponsors, donations, siteSettings } from '$lib/server/schema';
import { eq, asc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [allSponsors, allDonations, settings] = await Promise.all([
		db.select().from(sponsors).orderBy(asc(sponsors.sortOrder)),
		db.select().from(donations).orderBy(asc(donations.sortOrder)),
		db.select().from(siteSettings)
	]);

	const letterUrl = settings.find(s => s.key === 'sponsorship_letter_url')?.value ?? '/img/Letter.pdf';

	return { sponsors: allSponsors, donations: allDonations, letterUrl };
};

export const actions: Actions = {
	createSponsor: async ({ request }) => {
		const form = await request.formData();
		const name = form.get('name') as string;
		const link = form.get('link') as string;
		if (!name) return fail(400, { error: 'Name is required' });

		await db.insert(sponsors).values({
			name,
			link: link || '',
			image: form.get('image') as string || '',
			sortOrder: parseInt(form.get('sortOrder') as string) || 0
		});
		return { success: true };
	},

	updateSponsor: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		const name = form.get('name') as string;
		if (!name) return fail(400, { error: 'Name is required' });

		await db.update(sponsors).set({
			name,
			link: form.get('link') as string || '',
			image: form.get('image') as string || '',
			sortOrder: parseInt(form.get('sortOrder') as string) || 0,
			updatedAt: new Date()
		}).where(eq(sponsors.id, id));
		return { success: true };
	},

	deleteSponsor: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		await db.delete(sponsors).where(eq(sponsors.id, id));
		return { success: true };
	},

	createDonation: async ({ request }) => {
		const form = await request.formData();
		const name = form.get('name') as string;
		if (!name) return fail(400, { error: 'Name is required' });

		await db.insert(donations).values({
			name,
			sortOrder: parseInt(form.get('sortOrder') as string) || 0
		});
		return { success: true };
	},

	updateDonation: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		const name = form.get('name') as string;
		if (!name) return fail(400, { error: 'Name is required' });

		await db.update(donations).set({
			name,
			sortOrder: parseInt(form.get('sortOrder') as string) || 0,
			updatedAt: new Date()
		}).where(eq(donations.id, id));
		return { success: true };
	},

	deleteDonation: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		await db.delete(donations).where(eq(donations.id, id));
		return { success: true };
	},

	updateLetter: async ({ request }) => {
		const form = await request.formData();
		const url = form.get('letterUrl') as string;
		await db.insert(siteSettings).values({ key: 'sponsorship_letter_url', value: url || '' })
			.onConflictDoUpdate({ target: siteSettings.key, set: { value: url || '' } });
		return { success: true };
	}
};
