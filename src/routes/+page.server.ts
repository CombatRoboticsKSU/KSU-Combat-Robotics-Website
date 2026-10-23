import { db } from '$lib/server/db';
import { siteSettings, bots, events } from '$lib/server/schema';
import { and, asc, eq, gte } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        // Event dates are stored at UTC midnight; keep today's event visible all day in Kent.
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
        const [settings, featuredBots, upcomingEvents] = await Promise.all([
            db.select().from(siteSettings),
            db.select().from(bots).where(eq(bots.isFeatured, true)).orderBy(bots.sortOrder),
            db.select({ name: events.name, slug: events.slug, eventDate: events.eventDate, location: events.location })
                .from(events)
                .where(and(eq(events.published, true), eq(events.status, 'upcoming'), gte(events.sortDate, new Date(`${today}T00:00:00Z`))))
                .orderBy(asc(events.sortDate), asc(events.id))
                .limit(1)
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
            featuredBots,
            upcomingEvent: upcomingEvents[0] ?? null
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
            featuredBots: [],
            upcomingEvent: null
        };
    }
};
