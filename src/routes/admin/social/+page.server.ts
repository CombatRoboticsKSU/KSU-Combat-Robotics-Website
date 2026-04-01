import { db } from '$lib/server/db';
import { socialLinks } from '$lib/server/schema';
import { eq, asc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const links = await db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder));
	return { links };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const label = form.get('label') as string;
		const url = form.get('url') as string;
		if (!label || !url) return fail(400, { error: 'Label and URL are required' });

		await db.insert(socialLinks).values({
			label,
			url,
			sortOrder: parseInt(form.get('sortOrder') as string) || 0
		});
		return { success: true };
	},

	update: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		const label = form.get('label') as string;
		const url = form.get('url') as string;
		if (!label || !url) return fail(400, { error: 'Label and URL are required' });

		await db.update(socialLinks).set({
			label,
			url,
			sortOrder: parseInt(form.get('sortOrder') as string) || 0,
			updatedAt: new Date()
		}).where(eq(socialLinks.id, id));
		return { success: true };
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		await db.delete(socialLinks).where(eq(socialLinks.id, id));
		return { success: true };
	}
};
