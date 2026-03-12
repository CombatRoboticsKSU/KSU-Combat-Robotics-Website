import { db } from '$lib/server/db';
import { leadership, bots, projects, posts, publicity } from '$lib/server/schema';
import { count, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [[leadershipCount], [botsCount], [projectsCount], [postsCount], [publishedCount], [publicityCount]] = await Promise.all([
		db.select({ value: count() }).from(leadership),
		db.select({ value: count() }).from(bots),
		db.select({ value: count() }).from(projects),
		db.select({ value: count() }).from(posts),
		db.select({ value: count() }).from(posts).where(eq(posts.published, true)),
		db.select({ value: count() }).from(publicity),
	]);

	return {
		counts: {
			leadership: leadershipCount.value,
			bots: botsCount.value,
			projects: projectsCount.value,
			posts: postsCount.value,
			published: publishedCount.value,
			publicity: publicityCount.value,
		}
	};
};
