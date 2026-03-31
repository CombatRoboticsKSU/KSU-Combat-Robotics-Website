import { db } from '$lib/server/db';
import { siteSettings } from '$lib/server/schema';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const settings = await db.select().from(siteSettings);
        const getSetting = (key: string, fallback: string) =>
            settings.find(s => s.key === key)?.value ?? fallback;

        return {
            teamPhoto: getSetting('homepage_team_photo', '/USINGimg/TEAM25.JPG'),
            meetingTime: getSetting('meeting_time', 'Every Friday 4:30-6:30pm'),
            meetingLocation: getSetting('meeting_location', '120 AEB')
        };
    } catch (e) {
        console.error('Error fetching site settings:', e);
        return {
            teamPhoto: '/USINGimg/TEAM25.JPG',
            meetingTime: 'Every Friday 4:30-6:30pm',
            meetingLocation: '120 AEB'
        };
    }
};