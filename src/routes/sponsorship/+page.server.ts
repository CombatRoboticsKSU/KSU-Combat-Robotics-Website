import { db } from '$lib/server/db';
import { sponsors, donations, siteSettings } from '$lib/server/schema';
import { asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [allSponsors, allDonations, settings] = await Promise.all([
		db.select().from(sponsors).orderBy(asc(sponsors.sortOrder)),
		db.select().from(donations).orderBy(asc(donations.sortOrder)),
		db.select().from(siteSettings)
	]);

	const letterUrl = settings.find(s => s.key === 'sponsorship_letter_url')?.value ?? '/img/Letter.pdf';

	return { sponsors: allSponsors, donations: allDonations, letterUrl };
};
