import { db } from '$lib/server/db';
import { events, sponsorCodes } from '$lib/server/schema';
import { stripe } from '$lib/server/stripe';
import { and, desc, eq } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { Actions, PageServerLoad } from './$types';

const missingLink = "Set the event's spectator ticket link to a Stripe Payment Link first.";

class TicketLinkError extends Error {}

async function getEvent(rawId: string) {
	const id = Number(rawId);
	if (!Number.isSafeInteger(id) || id <= 0) error(404, 'Event not found');
	const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
	if (!event) error(404, 'Event not found');
	return event;
}

async function getTicketLink(url: string) {
	if (!url) throw new TicketLinkError(missingLink);
	let link: Stripe.PaymentLink | undefined;
	for await (const candidate of stripe.paymentLinks.list({ limit: 100 })) {
		if (candidate.url === url) {
			link = candidate;
			break;
		}
	}
	if (!link) throw new TicketLinkError(missingLink);
	const items: Stripe.LineItem[] = [];
	for await (const item of stripe.paymentLinks.listLineItems(link.id, { limit: 100 })) {
		items.push(item);
		if (items.length > 1) break;
	}
	if (items.length !== 1) {
		throw new TicketLinkError('The spectator Payment Link must contain exactly one ticket line item.');
	}
	const price = items[0].price;
	if (!price || price.unit_amount === null || !Number.isSafeInteger(price.unit_amount) || price.unit_amount <= 0) {
		throw new TicketLinkError('The spectator Payment Link must have a fixed, positive per-ticket price.');
	}
	const productId = typeof price.product === 'string' ? price.product : price.product.id;
	return { link, unitAmount: price.unit_amount, currency: price.currency, productId };
}

function formError(cause: unknown) {
	if (cause instanceof TicketLinkError || cause instanceof Stripe.errors.StripeInvalidRequestError) {
		return cause.message;
	}
	return 'Unable to update sponsor codes. Please try again.';
}

export const load: PageServerLoad = async ({ params }) => {
	const event = await getEvent(params.id);
	const [rows, ticket] = await Promise.all([
		db.select().from(sponsorCodes).where(eq(sponsorCodes.eventId, event.id)).orderBy(desc(sponsorCodes.createdAt)),
		getTicketLink(event.spectatorUrl)
			.then(({ unitAmount, currency }) => ({ unitAmount, currency, error: null }))
			.catch((cause: unknown) => ({ unitAmount: null, currency: null, error: formError(cause) }))
	]);
	const codes = await Promise.all(rows.map(async (row) => {
		if (!row.active) return { ...row, stripeActive: false, timesRedeemed: null };
		try {
			const promotion = await stripe.promotionCodes.retrieve(row.stripePromotionCodeId);
			return { ...row, stripeActive: promotion.active, timesRedeemed: promotion.times_redeemed };
		} catch {
			return { ...row, stripeActive: null, timesRedeemed: null };
		}
	}));
	return { event, codes, ticket };
};

export const actions: Actions = {
	create: async ({ params, request }) => {
		const event = await getEvent(params.id);
		const form = await request.formData();
		const text = (key: string) => {
			const value = form.get(key);
			return typeof value === 'string' ? value.trim() : '';
		};
		const sponsorName = text('sponsorName');
		const rawTickets = text('tickets');
		const tickets = Number(rawTickets);
		const code = text('code').toUpperCase();
		const values = { sponsorName, tickets: rawTickets, code };
		if (!sponsorName) return fail(400, { error: 'Sponsor name is required.', values });
		if (!/^\d+$/.test(rawTickets) || !Number.isInteger(tickets) || tickets < 1 || tickets > 50) {
			return fail(400, { error: 'Tickets must be an integer from 1 to 50.', values });
		}
		if (!/^[A-Z0-9_-]{4,40}$/.test(code)) {
			return fail(400, { error: 'Code must be 4 to 40 letters, numbers, underscores, or hyphens.', values });
		}
		let couponId: string | undefined;
		let promotionId: string | undefined;
		try {
			const { link, unitAmount, currency, productId } = await getTicketLink(event.spectatorUrl);
			if (!link.allow_promotion_codes) {
				await stripe.paymentLinks.update(link.id, { allow_promotion_codes: true });
			}
			const suffix = ` (${tickets} tickets)`;
			const coupon = await stripe.coupons.create({
				amount_off: tickets * unitAmount,
				currency,
				duration: 'once',
				applies_to: { products: [productId] },
				name: `Sponsor: ${sponsorName.slice(0, 40 - 'Sponsor: '.length - suffix.length)}${suffix}`
			});
			couponId = coupon.id;
			const promotion = await stripe.promotionCodes.create({
				promotion: { type: 'coupon', coupon: coupon.id },
				code,
				max_redemptions: 1,
				metadata: { sponsor: sponsorName, tickets: String(tickets), eventId: String(event.id) }
			});
			promotionId = promotion.id;
			await db.insert(sponsorCodes).values({
				eventId: event.id, sponsorName, tickets, code,
				stripeCouponId: coupon.id, stripePromotionCodeId: promotion.id
			});
			return { success: `Sponsor code ${code} created.` };
		} catch (cause) {
			// Compensate only for Stripe objects created by this request.
			if (promotionId) {
				try { await stripe.promotionCodes.update(promotionId, { active: false }); }
				catch { console.error('Unable to deactivate a sponsor code after creation failed.'); }
			}
			if (couponId) {
				try { await stripe.coupons.del(couponId); }
				catch { console.error('Unable to delete a sponsor coupon after creation failed.'); }
			}
			return fail(400, { error: formError(cause), values });
		}
	},
	deactivate: async ({ params, request }) => {
		const event = await getEvent(params.id);
		const form = await request.formData();
		const id = Number(form.get('id'));
		if (!Number.isSafeInteger(id) || id <= 0) return fail(400, { error: 'Invalid sponsor code.' });
		const scope = and(eq(sponsorCodes.id, id), eq(sponsorCodes.eventId, event.id));
		const [row] = await db.select().from(sponsorCodes).where(scope).limit(1);
		if (!row) return fail(404, { error: 'Sponsor code not found for this event.' });
		try {
			await stripe.promotionCodes.update(row.stripePromotionCodeId, { active: false });
			await db.update(sponsorCodes).set({ active: false }).where(scope);
			return { success: `Sponsor code ${row.code} deactivated.` };
		} catch (cause) {
			return fail(400, { error: formError(cause) });
		}
	}
};
