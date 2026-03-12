import { db } from '$lib/server/db';
import { leadership, siteSettings } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const members = await db.select().from(leadership).orderBy(leadership.sortOrder);
	const row = await db.select().from(siteSettings).where(eq(siteSettings.key, 'leadership_group_photo'));
	const groupPhoto = row[0]?.value ?? '/USINGimg/BOARD25/group.JPG';
	return { members, groupPhoto };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const name = form.get('name') as string;
		const title = form.get('title') as string;
		const image = form.get('image') as string || '/USINGimg/placeholder.png';
		const bio = form.get('bio') as string || '';
		const isCurrent = form.get('isCurrent') === 'true';
		const statsRaw = form.get('stats') as string || '';
		const stats = statsRaw.split('\n').map(s => s.trim()).filter(Boolean);
		const sortOrder = parseInt(form.get('sortOrder') as string) || 0;

		if (!name || !title) return fail(400, { error: 'Name and title are required' });

		await db.insert(leadership).values({ name, title, image, bio, isCurrent, stats, sortOrder });
		return { success: true };
	},

	update: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		const name = form.get('name') as string;
		const title = form.get('title') as string;
		const image = form.get('image') as string || '/USINGimg/placeholder.png';
		const bio = form.get('bio') as string || '';
		const isCurrent = form.get('isCurrent') === 'true';
		const statsRaw = form.get('stats') as string || '';
		const stats = statsRaw.split('\n').map(s => s.trim()).filter(Boolean);
		const sortOrder = parseInt(form.get('sortOrder') as string) || 0;

		if (!name || !title) return fail(400, { error: 'Name and title are required' });

		await db.update(leadership).set({ name, title, image, bio, isCurrent, stats, sortOrder, updatedAt: new Date() }).where(eq(leadership.id, id));
		return { success: true };
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		await db.delete(leadership).where(eq(leadership.id, id));
		return { success: true };
	},

	updateGroupPhoto: async ({ request }) => {
		const form = await request.formData();
		const value = (form.get('groupPhoto') as string) || '/USINGimg/BOARD25/group.JPG';
		await db.insert(siteSettings).values({ key: 'leadership_group_photo', value })
			.onConflictDoUpdate({ target: siteSettings.key, set: { value } });
		return { success: true };
	}
};
