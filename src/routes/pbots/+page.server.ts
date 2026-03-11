import { db } from '$lib/server/db';
import { bots } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const personalBots = await db.select({
		name: bots.name,
		slug: bots.slug,
		image: bots.image,
		weight: bots.weight,
		weapon: bots.weapon,
		owner: bots.owner
	}).from(bots).where(eq(bots.type, 'personal')).orderBy(bots.sortOrder);

	return { bots: personalBots };
};
