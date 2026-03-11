import { db } from '$lib/server/db';
import { leadership } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const currentBoard = await db.select().from(leadership).where(eq(leadership.isCurrent, true)).orderBy(leadership.sortOrder);
	const formerBoard = await db.select().from(leadership).where(eq(leadership.isCurrent, false)).orderBy(leadership.sortOrder);
	return { currentBoard, formerBoard };
};
