import { db } from '$lib/server/db';
import { bots } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const clubBots = await db.select({
		name: bots.name,
		slug: bots.slug,
		image: bots.image,
		weight: bots.weight,
		weapon: bots.weapon,
		status: bots.status
	}).from(bots).where(eq(bots.type, 'club')).orderBy(bots.sortOrder);

	return { bots: clubBots };
};
