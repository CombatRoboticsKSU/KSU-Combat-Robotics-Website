import { db } from '$lib/server/db';
import { publicity } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allItems = await db.select().from(publicity).orderBy(desc(publicity.sortOrder));
	return { items: allItems };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const title = form.get('title') as string;
		const link = form.get('link') as string;
		if (!title || !link) return fail(400, { error: 'Title and link are required' });

		await db.insert(publicity).values({
			title,
			link,
			date: form.get('date') as string || '',
			image: form.get('image') as string || '',
			summary: form.get('summary') as string || '',
			sortOrder: parseInt(form.get('sortOrder') as string) || 0
		});
		return { success: true };
	},

	update: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		const title = form.get('title') as string;
		const link = form.get('link') as string;
		if (!title || !link) return fail(400, { error: 'Title and link are required' });

		await db.update(publicity).set({
			title,
			link,
			date: form.get('date') as string || '',
			image: form.get('image') as string || '',
			summary: form.get('summary') as string || '',
			sortOrder: parseInt(form.get('sortOrder') as string) || 0,
			updatedAt: new Date()
		}).where(eq(publicity.id, id));
		return { success: true };
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		await db.delete(publicity).where(eq(publicity.id, id));
		return { success: true };
	}
};
