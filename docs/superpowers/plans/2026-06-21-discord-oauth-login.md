# Discord OAuth Login Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add "Continue with Discord" to the `/admin/login` page, mapping the user's Discord guild roles to a site role on every sign-in.

**Architecture:** A pure role-mapping helper plus a Discord API wrapper live in a new `src/lib/server/discord-roles.ts`. `src/lib/server/auth.ts` adds a Discord social provider whose custom `getUserInfo` (with `overrideUserInfoOnSignIn: true`) fetches the user's guild roles, maps them to a site role, and writes it on each login. The login page gets a Discord button. Email/password login is untouched.

**Tech Stack:** SvelteKit, better-auth 1.5.5 (Discord social provider), Drizzle, Vitest (new dev dependency), TypeScript.

---

## File Structure

- Create: `src/lib/server/discord-roles.ts` — `parseRoleMap`, `mapRolesToSiteRole` (pure), `fetchGuildMemberRoles` (network).
- Create: `src/lib/server/discord-roles.test.ts` — unit tests for the helpers.
- Create: `vitest.config.ts` — isolated test config (no SvelteKit plugin, so `$env` is never loaded in tests).
- Create: `.env.example` — document all env vars including the new Discord ones.
- Modify: `src/lib/server/auth.ts` — add the Discord provider.
- Modify: `src/routes/admin/login/+page.svelte` — add the Discord button + handler + styles.
- Modify: `package.json` — add `vitest` dev dependency and a `test` script.

Key contract used across tasks (define once, reuse):
- `parseRoleMap(raw: string | undefined): Record<string, string>`
- `mapRolesToSiteRole(discordRoleIds: string[], roleMap: Record<string, string>, precedence: string[]): string`
- `fetchGuildMemberRoles(accessToken: string, guildId: string): Promise<string[]>`

---

## Task 1: Vitest setup + pure role-mapping helpers

**Files:**
- Create: `vitest.config.ts`
- Create: `src/lib/server/discord-roles.ts`
- Create: `src/lib/server/discord-roles.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Vitest**

Run:
```bash
npm install -D vitest
```
Expected: `vitest` added under devDependencies, no errors.

- [ ] **Step 2: Add the `test` script to package.json**

In `package.json`, inside `"scripts"`, add:
```json
"test": "vitest run"
```

- [ ] **Step 3: Create the isolated Vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['src/**/*.test.ts']
	}
});
```
(A dedicated config means Vitest does NOT load `vite.config.ts`/the SvelteKit plugin, so test files never trigger `$env` resolution.)

- [ ] **Step 4: Write the failing test**

Create `src/lib/server/discord-roles.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { parseRoleMap, mapRolesToSiteRole } from './discord-roles';

describe('parseRoleMap', () => {
	it('returns {} for undefined', () => {
		expect(parseRoleMap(undefined)).toEqual({});
	});

	it('returns {} for invalid JSON', () => {
		expect(parseRoleMap('not json')).toEqual({});
	});

	it('returns {} for a JSON array', () => {
		expect(parseRoleMap('["a","b"]')).toEqual({});
	});

	it('parses a valid object', () => {
		expect(parseRoleMap('{"111":"admin","222":"editor"}')).toEqual({
			'111': 'admin',
			'222': 'editor'
		});
	});
});

describe('mapRolesToSiteRole', () => {
	const map = { '111': 'admin', '222': 'editor' };
	const precedence = ['admin', 'editor', 'user'];

	it('defaults to user when no Discord roles', () => {
		expect(mapRolesToSiteRole([], map, precedence)).toBe('user');
	});

	it('defaults to user when no roles match the map', () => {
		expect(mapRolesToSiteRole(['999'], map, precedence)).toBe('user');
	});

	it('maps a single matching role', () => {
		expect(mapRolesToSiteRole(['111'], map, precedence)).toBe('admin');
	});

	it('returns the highest-precedence role when multiple match', () => {
		expect(mapRolesToSiteRole(['222', '111'], map, precedence)).toBe('admin');
	});

	it('ranks a matched-but-unranked site role above nothing', () => {
		expect(mapRolesToSiteRole(['222'], map, ['admin', 'user'])).toBe('editor');
	});
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run:
```bash
npm test
```
Expected: FAIL — cannot resolve `./discord-roles` / functions not defined.

- [ ] **Step 6: Implement the pure helpers**

Create `src/lib/server/discord-roles.ts`:
```ts
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
```

- [ ] **Step 7: Run the test to verify it passes**

Run:
```bash
npm test
```
Expected: PASS — all `parseRoleMap` and `mapRolesToSiteRole` tests green.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/server/discord-roles.ts src/lib/server/discord-roles.test.ts
git commit -m "feat: add Discord role-mapping helpers with tests"
```

---

## Task 2: Discord guild-member fetch wrapper

**Files:**
- Modify: `src/lib/server/discord-roles.ts`
- Modify: `src/lib/server/discord-roles.test.ts`

- [ ] **Step 1: Write the failing test**

Append to `src/lib/server/discord-roles.test.ts`:
```ts
import { afterEach, vi } from 'vitest';
import { fetchGuildMemberRoles } from './discord-roles';

describe('fetchGuildMemberRoles', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns the roles array on success', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response(JSON.stringify({ roles: ['111', '222'] }), { status: 200 }))
		);
		await expect(fetchGuildMemberRoles('token', 'guild')).resolves.toEqual(['111', '222']);
	});

	it('returns [] when the user is not in the guild (404)', async () => {
		vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 404 })));
		await expect(fetchGuildMemberRoles('token', 'guild')).resolves.toEqual([]);
	});

	it('returns [] when fetch throws', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => {
				throw new Error('network');
			})
		);
		await expect(fetchGuildMemberRoles('token', 'guild')).resolves.toEqual([]);
	});

	it('returns [] when roles is missing from the response', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => new Response(JSON.stringify({ nick: 'x' }), { status: 200 }))
		);
		await expect(fetchGuildMemberRoles('token', 'guild')).resolves.toEqual([]);
	});
});
```

Note: the top-of-file imports already exist from Task 1; add `fetchGuildMemberRoles` to the existing `./discord-roles` import line and add the `afterEach, vi` import. If your editor flags duplicate imports, merge them into the existing import statements rather than adding new lines.

- [ ] **Step 2: Run the test to verify it fails**

Run:
```bash
npm test
```
Expected: FAIL — `fetchGuildMemberRoles` is not exported.

- [ ] **Step 3: Implement the wrapper**

Append to `src/lib/server/discord-roles.ts`:
```ts
const DISCORD_API = 'https://discord.com/api/v10';

/**
 * Fetch the caller's role IDs within a specific guild using their OAuth access
 * token. Requires the `guilds.members.read` scope. Fails closed to [] on any
 * error (not in guild, revoked token, network failure).
 */
export async function fetchGuildMemberRoles(accessToken: string, guildId: string): Promise<string[]> {
	try {
		const res = await fetch(`${DISCORD_API}/users/@me/guilds/${guildId}/member`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		});
		if (!res.ok) return [];
		const data = await res.json();
		return Array.isArray(data?.roles) ? data.roles : [];
	} catch {
		return [];
	}
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:
```bash
npm test
```
Expected: PASS — all `fetchGuildMemberRoles` tests green alongside the Task 1 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/server/discord-roles.ts src/lib/server/discord-roles.test.ts
git commit -m "feat: add Discord guild member roles fetch wrapper"
```

---

## Task 3: Wire the Discord provider into better-auth

**Files:**
- Modify: `src/lib/server/auth.ts`

There is no automated test here (it depends on live Discord OAuth); verification is `svelte-check` plus the manual flow in Task 5.

- [ ] **Step 1: Replace `src/lib/server/auth.ts` with the Discord-enabled config**

Full new contents of `src/lib/server/auth.ts`:
```ts
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

// Only enable Discord if credentials are present, so the app still boots without them.
const discordConfigured = Boolean(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET);

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
```

- [ ] **Step 2: Type-check**

Run:
```bash
npm run check
```
Expected: PASS (0 errors). If `getUserInfo`'s `token` param type complains, it is typed as `{ accessToken?: string }` which is structurally compatible with better-auth's `OAuth2Tokens`; adjust only if `svelte-check` reports a real mismatch.

- [ ] **Step 3: Commit**

```bash
git add src/lib/server/auth.ts
git commit -m "feat: add Discord social provider with guild-role sync"
```

---

## Task 4: Add the Discord button to the login page

**Files:**
- Modify: `src/routes/admin/login/+page.svelte`

- [ ] **Step 1: Add the handler in the `<script>` block**

In `src/routes/admin/login/+page.svelte`, after the `handleRegister` function (around line 50), add:
```ts
	async function handleDiscord() {
		error = '';
		loading = true;
		// Redirects the browser to Discord; control does not return here on success.
		await authClient.signIn.social({ provider: 'discord', callbackURL: '/admin' });
	}
```

- [ ] **Step 2: Add the Discord button + divider above the form**

In the markup, between the `{#if error}...{/if}` block (ends ~line 64) and the `<form ...>` tag (~line 66), insert:
```svelte
		<button type="button" class="btn-discord" onclick={handleDiscord} disabled={loading}>
			<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
				<path d="M20.317 4.369A19.79 19.79 0 0 0 15.885 3c-.21.375-.444.882-.608 1.283a18.27 18.27 0 0 0-5.487 0A12.6 12.6 0 0 0 9.18 3a19.74 19.74 0 0 0-4.434 1.369C1.96 8.555 1.2 12.63 1.58 16.65a19.94 19.94 0 0 0 6.075 3.078c.49-.668.927-1.378 1.304-2.124a12.94 12.94 0 0 1-2.053-.989c.172-.127.34-.26.503-.397a14.2 14.2 0 0 0 12.18 0c.165.14.333.272.504.397-.655.39-1.345.722-2.056.99.378.745.814 1.455 1.304 2.123a19.9 19.9 0 0 0 6.078-3.078c.448-4.66-.766-8.697-3.203-12.281ZM8.02 14.18c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.419-2.157 2.419Zm7.974 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419Z" />
			</svg>
			Continue with Discord
		</button>

		<div class="divider"><span>or</span></div>
```

- [ ] **Step 3: Add styles**

Inside the `<style>` block, after the `.error-msg` rule, add:
```css
	.btn-discord {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem 1.5rem;
		background: #5865f2;
		color: #fff;
		font-weight: 600;
		font-size: 1rem;
		font-family: inherit;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.btn-discord:hover { opacity: 0.9; }
	.btn-discord:disabled { opacity: 0.5; cursor: not-allowed; }

	.divider {
		display: flex;
		align-items: center;
		text-align: center;
		color: var(--text-muted);
		font-size: 0.8125rem;
		margin: 1.5rem 0;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		border-bottom: 1px solid var(--border-color);
	}

	.divider span { padding: 0 0.75rem; }
```

- [ ] **Step 4: Type-check**

Run:
```bash
npm run check
```
Expected: PASS (0 errors).

- [ ] **Step 5: Commit**

```bash
git add src/routes/admin/login/+page.svelte
git commit -m "feat: add Discord sign-in button to admin login"
```

---

## Task 5: Document env vars + Discord portal setup, then manual verification

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Create `.env.example`**

Create `.env.example`:
```bash
# Database
DATABASE_URL=
PROD_DATABASE_URL=

# Vercel Blob storage
BLOB_READ_WRITE_TOKEN=

# EmailJS (public)
PUBLIC_EMAILJS_SERVICE_ID=
PUBLIC_EMAILJS_TEMPLATE_ID=
PUBLIC_EMAILJS_USER_ID=

# better-auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:5173

# Discord OAuth
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_GUILD_ID=
# JSON object mapping Discord role IDs to site roles
DISCORD_ROLE_MAP={"<discord-role-id>":"admin"}
# Comma-separated site roles, highest priority first (optional; defaults to "admin,user")
DISCORD_ROLE_PRECEDENCE=admin,user
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: document Discord OAuth env vars in .env.example"
```

- [ ] **Step 3: Configure the Discord application (manual, one-time)**

In the [Discord Developer Portal](https://discord.com/developers/applications):
1. Create (or open) an application; copy its **Client ID** and **Client Secret**.
2. Under OAuth2 -> Redirects, add: `http://localhost:5173/api/auth/callback/discord` (and the production equivalent, `${BETTER_AUTH_URL}/api/auth/callback/discord`).
3. The requested scopes (`identify`, `email`, `guilds.members.read`) are set in code; no portal scope config is needed beyond enabling OAuth2.
4. Put the real values into your local `.env`: `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_GUILD_ID` (the club server's ID, enable Developer Mode in Discord to copy it), and `DISCORD_ROLE_MAP` (right-click an officer role -> Copy Role ID).

- [ ] **Step 4: Manual verification**

Run:
```bash
npm run dev
```
Then:
1. Visit `http://localhost:5173/admin/login` — confirm the Discord button and "or" divider appear above the email form.
2. Click "Continue with Discord", authorize. With a Discord account holding a role mapped to `admin`, you should land on `/admin` with full access.
3. Sign out, sign in with a Discord account NOT holding a mapped role — confirm you are redirected to `/admin/login?error=unauthorized` and the admin-access error message shows.
4. Confirm existing email/password login still works.
5. (Re-sync) In the DB `user` table, confirm the Discord user's `role` reflects their Discord roles; remove the Discord role, sign in again, and confirm `role` drops to `user`.

- [ ] **Step 5: Final check + commit (if any tweaks were needed)**

Run:
```bash
npm test && npm run check
```
Expected: tests PASS, check reports 0 errors. Commit any fixes discovered during verification.
```bash
git add -A
git commit -m "chore: finalize Discord OAuth login"
```
```
