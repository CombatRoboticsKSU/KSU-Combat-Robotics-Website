import { db } from '$lib/server/db';
import { events, registrations } from '$lib/server/schema';
import { eq, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { toCsvRow } from '$lib/utils/csv';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const eventId = parseInt(params.id);
	if (!Number.isFinite(eventId)) throw error(404, 'Event not found');

	const [ev] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
	if (!ev) throw error(404, 'Event not found');

	const rows = await db
		.select()
		.from(registrations)
		.where(eq(registrations.eventId, eventId))
		.orderBy(desc(registrations.createdAt));

	const lines = [
		toCsvRow([
			'Status',
			'Builder',
			'Bot',
			'Weapon',
			'Team',
			'Email',
			'Phone',
			'Notes',
			'Hazard Types',
			'Hazard Status',
			'Hazard Docs',
			'Hazard Review Note',
			'Waiver Acknowledged Online',
			'18+ confirmed',
			'Paid at'
		]),
		...rows.map((r) =>
			toCsvRow([
				r.status,
				r.builderName,
				r.botName,
				r.weaponType,
				r.teamName,
				r.email,
				r.phone,
				r.notes,
				[r.hazardPneumatic ? 'Pneumatic' : '', r.hazardHighMass ? 'High-mass' : ''].filter(Boolean).join(' / '),
				r.hazardStatus,
				r.hazardDocs.map((doc) => doc.url).join(' '),
				r.hazardReviewNote,
				r.waiverAck ? 'Yes' : 'No',
				r.ageAck ? 'yes' : 'no',
				r.paidAt ? r.paidAt.toISOString() : ''
			])
		)
	];

	return new Response(lines.join('\r\n'), {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="${ev.slug}-roster.csv"`
		}
	});
};
