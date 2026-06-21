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
