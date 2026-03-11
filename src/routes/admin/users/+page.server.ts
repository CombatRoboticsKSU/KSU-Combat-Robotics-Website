import { db } from '$lib/server/db';
import { user } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const users = await db.select({
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		createdAt: user.createdAt
	}).from(user);
	return { users };
};

export const actions: Actions = {
	promote: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'User ID is required' });

		await db.update(user).set({ role: 'admin', updatedAt: new Date() }).where(eq(user.id, id));
		return { success: true };
	},

	demote: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'User ID is required' });

		await db.update(user).set({ role: 'user', updatedAt: new Date() }).where(eq(user.id, id));
		return { success: true };
	},

	delete: async ({ request }) => {
		const form = await request.formData();
		const id = form.get('id') as string;
		if (!id) return fail(400, { error: 'User ID is required' });

		// Delete sessions and accounts first (foreign keys)
		const { session, account } = await import('$lib/server/schema');
		await db.delete(session).where(eq(session.userId, id));
		await db.delete(account).where(eq(account.userId, id));
		await db.delete(user).where(eq(user.id, id));
		return { success: true };
	}
};
