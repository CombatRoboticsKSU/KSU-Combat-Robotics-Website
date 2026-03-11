import { db } from '$lib/server/db';
import { bots } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allBots = await db.select().from(bots).orderBy(bots.type, bots.sortOrder);
	return { bots: allBots };
};

function parseJson<T>(raw: string, fallback: T): T {
	if (!raw) return fallback;
	try { return JSON.parse(raw); } catch { return fallback; }
}

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const name = form.get('name') as string;
		const slug = form.get('slug') as string;
		const type = form.get('type') as string || 'club';

		if (!name || !slug) return fail(400, { error: 'Name and slug are required' });

		await db.insert(bots).values({
			name,
			slug,
			image: form.get('image') as string || '/USINGimg/placeholder.png',
			weight: form.get('weight') as string || '',
			weapon: form.get('weapon') as string || '',
			status: form.get('status') as string || 'Active',
			type,
			owner: form.get('owner') as string || null,
			specs: parseJson(form.get('specs') as string, {}),
			competitions: parseJson(form.get('competitions') as string, []),
			team: parseJson(form.get('team') as string, []),
			galleryImages: parseJson(form.get('galleryImages') as string, []),
			videos: parseJson(form.get('videos') as string, []),
			youtubeLinks: parseJson(form.get('youtubeLinks') as string, []),
			mediaCoverage: parseJson(form.get('mediaCoverage') as string, []),
			backLink: type === 'personal' ? '/pbots' : '/wiki',
			backLabel: type === 'personal' ? 'Back to Personal Bots' : 'Back to Wiki',
			sortOrder: parseInt(form.get('sortOrder') as string) || 0
		});
		return { success: true };
	},

	update: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		const name = form.get('name') as string;
		const slug = form.get('slug') as string;
		const type = form.get('type') as string || 'club';

		if (!name || !slug) return fail(400, { error: 'Name and slug are required' });

		await db.update(bots).set({
			name,
			slug,
			image: form.get('image') as string || '/USINGimg/placeholder.png',
			weight: form.get('weight') as string || '',
			weapon: form.get('weapon') as string || '',
			status: form.get('status') as string || 'Active',
			type,
			owner: form.get('owner') as string || null,
			specs: parseJson(form.get('specs') as string, {}),
			competitions: parseJson(form.get('competitions') as string, []),
			team: parseJson(form.get('team') as string, []),
			galleryImages: parseJson(form.get('galleryImages') as string, []),
			videos: parseJson(form.get('videos') as string, []),
			youtubeLinks: parseJson(form.get('youtubeLinks') as string, []),
			mediaCoverage: parseJson(form.get('mediaCoverage') as string, []),
			backLink: type === 'personal' ? '/pbots' : '/wiki',
			backLabel: type === 'personal' ? 'Back to Personal Bots' : 'Back to Wiki',
			sortOrder: parseInt(form.get('sortOrder') as string) || 0,
			updatedAt: new Date()
		}).where(eq(bots.id, id));
		return { success: true };
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		await db.delete(bots).where(eq(bots.id, id));
		return { success: true };
	}
};
