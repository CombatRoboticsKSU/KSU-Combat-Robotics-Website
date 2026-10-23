export const EDITABLE_REGISTRATION_STATUSES = ['paid', 'member', 'paid_offline'];

export function registrationEditsOpen(event: { status: string; sortDate: Date | string; registrationEditDeadline: string }, now = new Date()) {
	const today = now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
	const eventDay = new Date(event.sortDate).toISOString().slice(0, 10);
	return event.status !== 'past' && today < eventDay && (!event.registrationEditDeadline || today <= event.registrationEditDeadline);
}
