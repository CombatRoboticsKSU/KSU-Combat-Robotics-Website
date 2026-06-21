import { describe, it, expect, afterEach, vi } from 'vitest';
import { parseRoleMap, mapRolesToSiteRole, fetchGuildMemberRoles } from './discord-roles';

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
