# Discord OAuth Login — Design

Date: 2026-06-21
Status: Approved (pending implementation plan)

## Goal

Let admins sign in to the site with Discord, in addition to the existing
email/password login on `/admin/login`. The club's Discord guild is the source
of truth for admin access: a user's roles inside the guild determine their site
role on every sign-in.

## Decisions

- **Login methods:** Keep both. Discord is added alongside the existing
  email/password form.
- **Role sync:** Re-sync on every Discord sign-in. Removing a member's Discord
  role revokes their site admin access on their next login.
- **Role mapping:** Configurable map of Discord role ID -> site role, with a
  precedence order so a user holding multiple mapped roles gets the highest.
- **Account linking:** Disabled. Discord accounts and email/password accounts
  stay independent so Discord governance can't clobber manually-managed admins.
- **Location:** Login stays at `/admin/login` (there is no `/login` route).

## Architecture

### 1. `src/lib/server/auth.ts` — Discord provider

Add a Discord social provider to the existing `betterAuth(...)` config:

- `clientId` / `clientSecret` from env.
- `scope: ['identify', 'guilds.members.read']`. The `guilds.members.read` scope
  is what permits reading the user's roles within a specific guild via
  `GET /users/@me/guilds/{guild.id}/member`.
- Custom `getUserInfo` together with `overrideUserInfoOnSignIn: true` so the
  mapped role is recomputed and written on every login (re-sync requirement).
  `getUserInfo` receives the OAuth tokens, then:
  1. Calls `https://discord.com/api/users/@me` for identity
     (id, username, email, avatar).
  2. Calls `https://discord.com/api/users/@me/guilds/{DISCORD_GUILD_ID}/member`
     for the `roles` array (array of role ID strings).
  3. Maps the roles to a site role via the helper below.
  4. Returns the user profile including the resolved `role`.

Note: the exact better-auth 1.5.5 hook surface (`getUserInfo` vs
`mapProfileToUser` + a database hook) will be confirmed against the installed
version during implementation. The mechanism must (a) have access to the OAuth
access token to call the guild-member endpoint and (b) run on every sign-in.

Account linking is left at the default disabled state — Discord and
email/password accounts are not auto-merged by email.

### 2. `src/lib/server/discord-roles.ts` (new)

Two responsibilities, split so the mapping logic is unit-testable in isolation:

- `mapRolesToSiteRole(discordRoleIds, roleMap, precedence)` — pure function.
  Given the user's Discord role IDs, the configured `roleMap`
  (`Record<discordRoleId, siteRole>`), and a `precedence` ordering of site roles
  (highest first), return the highest-precedence matching site role, defaulting
  to `'user'` when nothing matches.
- `fetchGuildMemberRoles(accessToken, guildId)` — thin wrapper around the
  Discord guild-member endpoint that returns the `roles` array, or an empty
  array / signal on 404 (user not in guild) and other failures.

### 3. `src/routes/admin/login/+page.svelte`

Add a "Continue with Discord" button (Discord brand styling) above or below the
existing form, calling:

```ts
authClient.signIn.social({ provider: 'discord', callbackURL: '/admin' });
```

The page already reads `?error=unauthorized` and shows an admin-access message,
which covers the case of a Discord user who is not an admin.

### 4. Configuration (env vars)

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_GUILD_ID`
- `DISCORD_ROLE_MAP` — JSON object, e.g.
  `{"111111111111111111":"admin","222222222222222222":"editor"}`
- Site role precedence — ordering used by `mapRolesToSiteRole`
  (e.g. `admin > editor > user`). Defined in one place (constant or env).

Manual one-time setup: register
`${BETTER_AUTH_URL}/api/auth/callback/discord` as an OAuth2 redirect URI in the
Discord Developer Portal, and grant the application the `identify` and
`guilds.members.read` scopes.

## Data flow

1. User clicks "Continue with Discord" ->
   `authClient.signIn.social({ provider: 'discord', callbackURL: '/admin' })`.
2. Redirect to Discord; user authorizes `identify` + `guilds.members.read`.
3. Discord redirects to `/api/auth/callback/discord`; better-auth exchanges the
   code for tokens.
4. `getUserInfo` fetches identity + guild-member roles, maps roles to a site
   role.
5. better-auth upserts the user with `overrideUserInfoOnSignIn: true` (role
   overwritten), creates a session.
6. Browser lands on `/admin`. `hooks.server.ts` gates access: `admin` passes;
   any other role redirects to `/admin/login?error=unauthorized`.

## Error handling / edge cases

All failures fail closed to site role `user` and never block login itself:

- User not in the guild -> member endpoint 404 -> role `user`.
- Discord API error or malformed `DISCORD_ROLE_MAP` -> role `user`, log a
  warning; login still succeeds.
- No matching role -> role `user`.
- Multiple matching roles -> highest-precedence site role wins.
- **Demotion caveat:** because the role re-syncs every login, an admin who signs
  in via Discord without the mapped role is set to `user`. Mitigation: keep at
  least one email/password "break-glass" admin account (not linked to Discord)
  as a fallback, and ensure officers hold the correct Discord role. This is also
  why auto account-linking is disabled.
- Email collision: if a Discord account's email matches an existing
  email/password account, with linking disabled better-auth will not auto-merge.
  Acceptable for a small club site; documented here as known behavior.

## Testing

Vitest unit tests for `mapRolesToSiteRole`:

- no match -> `user`
- single admin-mapped role -> `admin`
- multiple mapped roles -> highest precedence wins
- empty or invalid map -> `user`

Vitest is not currently a dependency and will be added as a dev dependency.

## Out of scope

- Building a UI to edit `DISCORD_ROLE_MAP` (managed via env for now).
- Verifying guild membership beyond the role check.
- Migrating existing email/password admins to Discord.
