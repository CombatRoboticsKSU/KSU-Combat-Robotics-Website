export type EventStatus = 'upcoming' | 'past';

export type BadgeTone = 'open' | 'closed' | 'past';

// Single source of truth for capacity math, used by both the listing loader
// and the detail loader so they can never disagree on whether an event is full.
export function isEventFull(capacity: number, taken: number): boolean {
	return capacity > 0 && taken >= capacity;
}

export function eventBadge(
	status: string,
	registrationOpen: boolean,
	isFull: boolean
): { text: string; tone: BadgeTone } {
	if (status === 'past') return { text: 'Past event', tone: 'past' };
	if (isFull) return { text: 'Registration full', tone: 'closed' };
	if (registrationOpen) return { text: 'Registration open', tone: 'open' };
	return { text: 'Registration closed', tone: 'closed' };
}
