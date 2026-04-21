import { db } from '$lib/server/db';
import { projects } from '$lib/server/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allProjects = await db.select().from(projects).orderBy(projects.sortOrder);
	return { projects: allProjects };
};
