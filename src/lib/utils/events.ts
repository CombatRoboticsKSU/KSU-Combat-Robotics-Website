export type EventStatus = 'upcoming' | 'past';

export type BadgeTone = 'open' | 'closed' | 'past';

// Single source of truth for capacity math, used by both the listing loader
// and the detail loader so they can never disagree on whether an event is full.
export function isEventFull(capacity: number, taken: number): boolean {
	return capacity > 0 && taken >= capacity;
}

// Single source of truth for whether the competitor registration flow is open, used by
// both the event detail page and the register route so they can never disagree.
export function canRegister(
	status: string,
	registrationOpen: boolean,
	competitorPriceId: string,
	isFull: boolean
): boolean {
	return status !== 'past' && registrationOpen && competitorPriceId !== '' && !isFull;
}

export function eventBadge(
	status: string,
	registrationOpen: boolean,
	isFull: boolean,
	hasCompetitorPrice: boolean
): { text: string; tone: BadgeTone } {
	if (status === 'past') return { text: 'Past event', tone: 'past' };
	// No Stripe price configured yet: the competitor card is disabled regardless of
	// registrationOpen or capacity, so the badge must agree instead of promising
	// registration that the action card will not actually offer.
	if (!hasCompetitorPrice) return { text: 'Coming soon', tone: 'closed' };
	if (isFull) return { text: 'Registration full', tone: 'closed' };
	if (registrationOpen) return { text: 'Registration open', tone: 'open' };
	return { text: 'Registration closed', tone: 'closed' };
}
