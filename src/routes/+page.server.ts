import { db } from '$lib/server/db';
import { siteSettings, bots } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        const [settings, featuredBots] = await Promise.all([
            db.select().from(siteSettings),
            db.select().from(bots).where(eq(bots.isFeatured, true)).orderBy(bots.sortOrder)
        ]);
        const getSetting = (key: string, fallback: string) =>
            settings.find(s => s.key === key)?.value ?? fallback;

        return {
            teamPhoto: getSetting('homepage_team_photo', '/USINGimg/TEAM25.JPG'),
            meetingTime: getSetting('meeting_time', 'Every Friday 4:30-6:30pm'),
            meetingLocation: getSetting('meeting_location', '120 AEB'),
            statYears: getSetting('stat_years', '10+'),
            statWeightClass: getSetting('stat_weight_class', '12lb & 3lb'),
            statMembers: getSetting('stat_members', '30+'),
            featuredBots
        };
    } catch (e) {
        console.error('Error fetching site settings:', e);
        return {
            teamPhoto: '/USINGimg/TEAM25.JPG',
            meetingTime: 'Every Friday 4:30-6:30pm',
            meetingLocation: '120 AEB',
            statYears: '10+',
            statWeightClass: '12lb & 3lb',
            statMembers: '30+',
            featuredBots: []
        };
    }
};
