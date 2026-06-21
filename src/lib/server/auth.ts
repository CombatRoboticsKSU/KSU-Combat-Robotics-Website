import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { parseRoleMap, mapRolesToSiteRole, fetchGuildMemberRoles } from './discord-roles';

const DISCORD_API = 'https://discord.com/api/v10';

const roleMap = parseRoleMap(env.DISCORD_ROLE_MAP);
const rolePrecedence = (env.DISCORD_ROLE_PRECEDENCE ?? 'admin,user')
	.split(',')
	.map((s) => s.trim())
	.filter(Boolean);
const guildId = env.DISCORD_GUILD_ID ?? '';

// Only enable Discord if credentials AND the guild are present, so the app boots
// without Discord and we never silently resolve every login to 'user' when the
// guild is unset (which would make role-gating appear to work while granting none).
const discordConfigured = Boolean(
	env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET && env.DISCORD_GUILD_ID
);

const socialProviders = discordConfigured
	? {
			discord: {
				clientId: env.DISCORD_CLIENT_ID as string,
				clientSecret: env.DISCORD_CLIENT_SECRET as string,
				scope: ['identify', 'email', 'guilds.members.read'],
				// Re-sync the site role from Discord on every sign-in.
				overrideUserInfoOnSignIn: true,
				getUserInfo: async (token: { accessToken?: string }) => {
					const accessToken = token.accessToken;
					if (!accessToken) return null;

					const profileRes = await fetch(`${DISCORD_API}/users/@me`, {
						headers: { Authorization: `Bearer ${accessToken}` }
					});
					if (!profileRes.ok) return null;
					const profile = await profileRes.json();
					// Discord can return a null email; better-auth lowercases the email
					// downstream and would throw an opaque error. Abort cleanly instead.
					if (!profile.email) return null;

					const roleIds = await fetchGuildMemberRoles(accessToken, guildId);
					const role = mapRolesToSiteRole(roleIds, roleMap, rolePrecedence);

					const image = profile.avatar
						? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
						: undefined;

					return {
						user: {
							id: profile.id,
							name: profile.global_name || profile.username,
							email: profile.email,
							emailVerified: Boolean(profile.verified),
							image,
							role
						},
						data: profile
					};
				}
			}
		}
	: undefined;

export const auth = betterAuth({
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema
	}),
	emailAndPassword: {
		enabled: true
	},
	socialProviders,
	// Keep Discord and email/password accounts independent so Discord role
	// re-sync can never demote a manually-managed (break-glass) admin.
	account: {
		accountLinking: {
			enabled: false
		}
	},
	user: {
		additionalFields: {
			role: {
				type: 'string',
				defaultValue: 'user'
			}
		}
	}
});
