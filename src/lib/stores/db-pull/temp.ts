import { fetchAPI } from "./global";

export type navMap = { [key: string]: string; };

export async function loadMapData() {
    const data = await fetchAPI('/src/lib/assets/jsons/local-api/nav.json', true);
    return data as navMap;
}

