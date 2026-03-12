import { db } from '$lib/server/db';
import { bots } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [bot] = await db.select().from(bots)
		.where(and(eq(bots.slug, params.slug), eq(bots.type, 'club')));

	if (!bot) throw error(404, 'Bot not found');

	return { bot };
};
