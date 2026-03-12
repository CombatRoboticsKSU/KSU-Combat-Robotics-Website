import { db } from '$lib/server/db';
import { leadership, siteSettings } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const currentBoard = await db.select().from(leadership).where(eq(leadership.isCurrent, true)).orderBy(leadership.sortOrder);
	const formerBoard = await db.select().from(leadership).where(eq(leadership.isCurrent, false)).orderBy(leadership.sortOrder);
	const row = await db.select().from(siteSettings).where(eq(siteSettings.key, 'leadership_group_photo'));
	const groupPhoto = row[0]?.value ?? '/USINGimg/BOARD25/group.JPG';
	return { currentBoard, formerBoard, groupPhoto };
};
