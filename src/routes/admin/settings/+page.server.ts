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
		groupPhoto: getSetting('leadership_group_photo', '/USINGimg/BOARD25/group.JPG'),
		meetingTime: getSetting('meeting_time', 'Every Friday 4:30-6:30pm'),
		meetingLocation: getSetting('meeting_location', '120 AEB'),
		statYears: getSetting('stat_years', '10+'),
		statWeightClass: getSetting('stat_weight_class', '12lb & 3lb'),
		statMembers: getSetting('stat_members', '30+')
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

		const meetingTime = form.get('meetingTime') as string;
		if (meetingTime !== null) {
			await db.insert(siteSettings).values({ key: 'meeting_time', value: meetingTime })
				.onConflictDoUpdate({ target: siteSettings.key, set: { value: meetingTime } });
		}

		const meetingLocation = form.get('meetingLocation') as string;
		if (meetingLocation !== null) {
			await db.insert(siteSettings).values({ key: 'meeting_location', value: meetingLocation })
				.onConflictDoUpdate({ target: siteSettings.key, set: { value: meetingLocation } });
		}

		for (const [formKey, settingKey] of [
			['statYears', 'stat_years'],
			['statWeightClass', 'stat_weight_class'],
			['statMembers', 'stat_members']
		] as const) {
			const val = form.get(formKey) as string;
			if (val !== null) {
				await db.insert(siteSettings).values({ key: settingKey, value: val })
					.onConflictDoUpdate({ target: siteSettings.key, set: { value: val } });
			}
		}

		return { success: true };
	}
};
