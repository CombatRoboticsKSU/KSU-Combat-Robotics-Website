import { db } from '$lib/server/db';
import { projects } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allProjects = await db.select().from(projects).orderBy(projects.sortOrder);
	return { projects: allProjects };
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
		if (!name || !slug) return fail(400, { error: 'Name and slug are required' });

		await db.insert(projects).values({
			name,
			slug,
			icon: form.get('icon') as string || '',
			image: form.get('image') as string || '/USINGimg/placeholder.png',
			description: form.get('description') as string || '',
			about: form.get('about') as string || '',
			specs: parseJson(form.get('specs') as string, {}),
			team: parseJson(form.get('team') as string, []),
			galleryImages: parseJson(form.get('galleryImages') as string, []),
			videos: parseJson(form.get('videos') as string, []),
			youtubeLinks: parseJson(form.get('youtubeLinks') as string, []),
			mediaCoverage: parseJson(form.get('mediaCoverage') as string, []),
			sortOrder: parseInt(form.get('sortOrder') as string) || 0
		});
		return { success: true };
	},

	update: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		const name = form.get('name') as string;
		const slug = form.get('slug') as string;
		if (!name || !slug) return fail(400, { error: 'Name and slug are required' });

		await db.update(projects).set({
			name,
			slug,
			icon: form.get('icon') as string || '',
			image: form.get('image') as string || '/USINGimg/placeholder.png',
			description: form.get('description') as string || '',
			about: form.get('about') as string || '',
			specs: parseJson(form.get('specs') as string, {}),
			team: parseJson(form.get('team') as string, []),
			galleryImages: parseJson(form.get('galleryImages') as string, []),
			videos: parseJson(form.get('videos') as string, []),
			youtubeLinks: parseJson(form.get('youtubeLinks') as string, []),
			mediaCoverage: parseJson(form.get('mediaCoverage') as string, []),
			sortOrder: parseInt(form.get('sortOrder') as string) || 0,
			updatedAt: new Date()
		}).where(eq(projects.id, id));
		return { success: true };
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		await db.delete(projects).where(eq(projects.id, id));
		return { success: true };
	}
};
