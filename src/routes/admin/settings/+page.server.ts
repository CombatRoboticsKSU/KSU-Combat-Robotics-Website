import { db } from '$lib/server/db';
import { siteSettings } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const settings = await db.select().from(siteSettings);
	
	const getSetting = (key: string, fallback: string) => {
		const setting = settings.find(s => s.key === key);
		return setting ? setting.value : fallback;
	};

	return {
		teamPhoto: getSetting('homepage_team_photo', '/USINGimg/TEAM25.JPG'),
		groupPhoto: getSetting('leadership_group_photo', '/USINGimg/BOARD25/group.JPG')
	};
};

export const actions: Actions = {
	updateSettings: async ({ request }) => {
		const form = await request.formData();
		
		const teamPhoto = form.get('teamPhoto') as string;
		if (teamPhoto) {
			await db.insert(siteSettings).values({ key: 'homepage_team_photo', value: teamPhoto })
				.onConflictDoUpdate({ target: siteSettings.key, set: { value: teamPhoto } });
		}

		const groupPhoto = form.get('groupPhoto') as string;
		if (groupPhoto) {
			await db.insert(siteSettings).values({ key: 'leadership_group_photo', value: groupPhoto })
				.onConflictDoUpdate({ target: siteSettings.key, set: { value: groupPhoto } });
		}

		return { success: true };
	}
};
