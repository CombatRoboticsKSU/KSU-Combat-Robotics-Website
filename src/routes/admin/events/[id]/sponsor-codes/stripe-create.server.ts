import { createHash } from 'node:crypto';
import type Stripe from 'stripe';

type SponsorCoupon = {
	eventId: number;
	code: string;
	sponsorName: string;
	tickets: number;
	unitAmount: number;
	currency: string;
	productId: string;
};

function idempotencyKey(operation: string, eventId: number, code: string, parameters: unknown) {
	// Hash all varying parameters to stay within Stripe's 255-character key limit.
	const digest = createHash('sha256').update(JSON.stringify(parameters)).digest('hex');
	return `sponsor-${operation}:${eventId}:${code}:${digest}`;
}

export function createSponsorCoupon(stripe: Stripe, input: SponsorCoupon) {
	const { eventId, code, sponsorName, tickets, unitAmount, currency, productId } = input;
	const suffix = ` (${tickets} tickets)`;
	const parameters: Stripe.CouponCreateParams = {
		amount_off: tickets * unitAmount,
		currency,
		duration: 'once',
		applies_to: { products: [productId] },
		name: `Sponsor: ${sponsorName.slice(0, 40 - 'Sponsor: '.length - suffix.length)}${suffix}`
	};
	return stripe.coupons.create(parameters, {
		idempotencyKey: idempotencyKey('coupon', eventId, code, { ...input, parameters })
	});
}

export function createSponsorPromotion(
	stripe: Stripe,
	input: Pick<SponsorCoupon, 'eventId' | 'code' | 'sponsorName' | 'tickets'> & { couponId: string }
) {
	const { eventId, code, sponsorName, tickets, couponId } = input;
	const parameters: Stripe.PromotionCodeCreateParams = {
		promotion: { type: 'coupon', coupon: couponId },
		code,
		max_redemptions: 1,
		metadata: { sponsor: sponsorName, tickets: String(tickets), eventId: String(eventId) }
	};
	return stripe.promotionCodes.create(parameters, {
		idempotencyKey: idempotencyKey('promo', eventId, code, parameters)
	});
}
