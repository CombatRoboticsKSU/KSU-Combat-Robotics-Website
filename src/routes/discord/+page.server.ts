import { db } from '$lib/server/db';
import { siteSettings } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [setting] = await db
		.select()
		.from(siteSettings)
		.where(eq(siteSettings.key, 'discord_url'))
		.limit(1);

	const url = setting?.value?.trim() ?? '';

	// 302 rather than 301 on purpose. Discord invites get rotated, and browsers
	// cache a 301 indefinitely, which would strand anyone who hit this page on a
	// dead invite with no way for an admin to correct it.
	if (url) throw redirect(302, url);

	return { configured: false };
};
