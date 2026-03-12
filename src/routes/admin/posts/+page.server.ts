import { db } from '$lib/server/db';
import { posts } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
	return { posts: allPosts };
};

function parseTags(raw: string): string[] {
	return raw.split(',').map(t => t.trim()).filter(Boolean);
}

function parseJson<T>(raw: string, fallback: T): T {
	if (!raw) return fallback;
	try { return JSON.parse(raw); } catch { return fallback; }
}

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const title = form.get('title') as string;
		const slug = form.get('slug') as string;
		if (!title || !slug) return fail(400, { error: 'Title and slug are required' });

		await db.insert(posts).values({
			title,
			slug,
			date: form.get('date') as string || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
			tags: parseTags(form.get('tags') as string || ''),
			excerpt: form.get('excerpt') as string || '',
			image: form.get('image') as string || '',
			content: form.get('content') as string || '',
			galleryImages: parseJson(form.get('galleryImages') as string, []),
			videos: parseJson(form.get('videos') as string, []),
			youtubeLinks: parseJson(form.get('youtubeLinks') as string, []),
			mediaCoverage: parseJson(form.get('mediaCoverage') as string, []),
			published: form.get('published') === 'true'
		});
		return { success: true };
	},

	update: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		const title = form.get('title') as string;
		const slug = form.get('slug') as string;
		if (!title || !slug) return fail(400, { error: 'Title and slug are required' });

		await db.update(posts).set({
			title,
			slug,
			date: form.get('date') as string || '',
			tags: parseTags(form.get('tags') as string || ''),
			excerpt: form.get('excerpt') as string || '',
			image: form.get('image') as string || '',
			content: form.get('content') as string || '',
			galleryImages: parseJson(form.get('galleryImages') as string, []),
			videos: parseJson(form.get('videos') as string, []),
			youtubeLinks: parseJson(form.get('youtubeLinks') as string, []),
			mediaCoverage: parseJson(form.get('mediaCoverage') as string, []),
			published: form.get('published') === 'true',
			updatedAt: new Date()
		}).where(eq(posts.id, id));
		return { success: true };
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = parseInt(form.get('id') as string);
		await db.delete(posts).where(eq(posts.id, id));
		return { success: true };
	}
};
