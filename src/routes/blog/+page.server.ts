import { db } from '$lib/server/db';
import { posts } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allPosts = await db.select({
		slug: posts.slug,
		title: posts.title,
		date: posts.date,
		tags: posts.tags,
		excerpt: posts.excerpt,
		image: posts.image
	}).from(posts).where(eq(posts.published, true)).orderBy(desc(posts.createdAt));

	return { posts: allPosts };
};
