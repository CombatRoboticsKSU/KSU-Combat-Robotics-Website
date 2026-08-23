import { db } from '$lib/server/db';
import { leadership, bots, projects, posts, publicity, sponsors, donations, socialLinks, events } from '$lib/server/schema';
import { count, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [[leadershipCount], [botsCount], [projectsCount], [postsCount], [publishedCount], [publicityCount], [sponsorsCount], [donationsCount], [socialLinksCount], [eventsCount]] = await Promise.all([
		db.select({ value: count() }).from(leadership),
		db.select({ value: count() }).from(bots),
		db.select({ value: count() }).from(projects),
		db.select({ value: count() }).from(posts),
		db.select({ value: count() }).from(posts).where(eq(posts.published, true)),
		db.select({ value: count() }).from(publicity),
		db.select({ value: count() }).from(sponsors),
		db.select({ value: count() }).from(donations),
		db.select({ value: count() }).from(socialLinks),
		db.select({ value: count() }).from(events),
	]);

	return {
		counts: {
			leadership: leadershipCount.value,
			bots: botsCount.value,
			projects: projectsCount.value,
			posts: postsCount.value,
			published: publishedCount.value,
			publicity: publicityCount.value,
			sponsors: sponsorsCount.value,
			donations: donationsCount.value,
			socialLinks: socialLinksCount.value,
			events: eventsCount.value,
		}
	};
};
