import { db } from '$lib/server/db';
import { publicity } from '$lib/server/schema';
import { desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const items = await db.select().from(publicity).orderBy(desc(publicity.sortOrder));
	return { items };
};
