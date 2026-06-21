/**
 * Parse the DISCORD_ROLE_MAP env value (JSON object of discordRoleId -> siteRole).
 * Returns {} on missing / invalid input so callers fail closed to 'user'.
 */
export function parseRoleMap(raw: string | undefined): Record<string, string> {
	if (!raw) return {};
	try {
		const parsed = JSON.parse(raw);
		if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
			return parsed as Record<string, string>;
		}
		return {};
	} catch {
		return {};
	}
}

/**
 * Resolve a site role from the user's Discord role IDs.
 * - No match -> 'user'
 * - Multiple matches -> highest precedence (lowest index in `precedence`)
 * - A matched site role missing from `precedence` ranks after all listed ones
 *   but still beats no match.
 */
export function mapRolesToSiteRole(
	discordRoleIds: string[],
	roleMap: Record<string, string>,
	precedence: string[]
): string {
	const matched = discordRoleIds
		.map((id) => roleMap[id])
		.filter((role): role is string => Boolean(role));
	if (matched.length === 0) return 'user';

	const rank = (role: string) => {
		const i = precedence.indexOf(role);
		return i === -1 ? precedence.length : i;
	};
	return matched.reduce((best, cur) => (rank(cur) < rank(best) ? cur : best));
}
