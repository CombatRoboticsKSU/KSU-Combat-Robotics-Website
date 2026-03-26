import { db } from '$lib/server/db';
import { siteSettings } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // Default to the hardcoded team photo if one isn't set in DB
    let teamPhotoFilePath = '/USINGimg/TEAM25.JPG';
    
    try {
        const teamPhotoSetting = await db.query.siteSettings.findFirst({
            where: eq(siteSettings.key, 'homepage_team_photo')
        });
        
        if (teamPhotoSetting?.value) {
            teamPhotoFilePath = teamPhotoSetting.value;
        }
    } catch (e) {
        console.error('Error fetching team photo from settings:', e);
    }
    
    return {
        teamPhoto: teamPhotoFilePath
    };
};