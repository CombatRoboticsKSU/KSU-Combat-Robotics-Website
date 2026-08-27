// The online waiver is an acknowledgement gate, not the legal release. Competitors still
// sign the paper waiver at check-in, and that paper copy remains the record of record.
// Because of that, this text is deliberately plain-language risk acknowledgement rather
// than a liability release: it tells a registrant what they are agreeing to before they
// pay, and nothing here is relied on in place of the signed document.
//
// This default is a starting point. Whoever handles club risk management should review it
// and, where an event needs its own terms, set the per-event waiver text in the admin
// event form, which overrides this.
export const DEFAULT_WAIVER_TEXT = `Combat robotics is an inherently dangerous activity.

Robots in this competition carry spinning weapons, high-current batteries, and stored energy capable of causing serious injury, permanent disability, or death. Fragments can leave the arena. Batteries can catch fire. Equipment can fail without warning.

By registering, I acknowledge that:

1. I have read the event rules and the weight class and safety requirements that apply to my entry, and my robot will comply with them.
2. I am responsible for the safe construction, transport, handling, and operation of my robot, including its batteries and weapon systems.
3. I will follow all instructions from event staff, safety officials, and judges, including instructions to power down, disarm, or withdraw my robot.
4. I understand my robot may be damaged or destroyed, and that neither the event organizers nor Kansas State University are responsible for damage to or loss of my equipment.
5. I accept the risk of injury to myself and my property arising from my participation.
6. I will sign the full liability waiver in person at check-in, and I understand I will not be permitted to compete until I have done so.

Registration fees are non-refundable except where stated in the event listing.`;

// Blank per-event text falls back to the default so events created before the waiver
// field existed keep showing something meaningful.
export function resolveWaiverText(eventWaiverText: string | null | undefined): string {
	const trimmed = (eventWaiverText ?? '').trim();
	return trimmed === '' ? DEFAULT_WAIVER_TEXT : trimmed;
}
