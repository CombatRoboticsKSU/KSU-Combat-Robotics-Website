import { db } from '$lib/server/db';
import { socialLinks } from '$lib/server/schema';
import { asc } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const links = await db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder));
	return { socialLinks: links };
};
