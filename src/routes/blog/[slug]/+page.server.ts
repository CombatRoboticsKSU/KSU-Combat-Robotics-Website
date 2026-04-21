import { db } from '$lib/server/db';
import { posts } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [post] = await db.select().from(posts).where(eq(posts.slug, params.slug));

	if (!post) throw error(404, 'Post not found');

	return { post };
};
