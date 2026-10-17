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

Robots carry moving weapons, high-current batteries, and stored energy capable of causing serious injury, permanent disability, or death. Batteries can catch fire, parts can become projectiles, and equipment can fail without warning.

By registering for a KSU Combat Robotics event at Kent State University, I acknowledge and agree to the following:

1. I acknowledge these risks and accept the risk of injury to myself and damage to my property arising from my participation.

2. I have read the event technical regulations, including the weight class, prohibited systems, and safety requirements that apply to my entry. I will comply with them. This acknowledgement does not replace the full regulations.

3. I am responsible for the safe construction, transport, handling, and operation of my robot, including its batteries, weapons, and stored energy systems.

4. I acknowledge that any pneumatic system or total moving/spinning weapon mass exceeding 50% of my robot's actual weight makes my entry a Hazard Bot requiring written technical pre-approval before event entry. Pneumatic pressure must remain at or below 150 psi. I will submit component datasheets for all reservoirs, lines, regulators, and valves, plus schematics showing relief valves and safety pressure factors. I will provide an accessible manual bleed/vent valve and safely vent all stored pressure before handling. For a high-mass inertia weapon, I will submit retention shaft verification, bearing load margins, and FEA/burst containment calculations demonstrating structural integrity at full operational RPM. I understand an unapproved Hazard Bot will not compete.

5. I will keep a physical locking pin or clamp installed on every moving weapon capable of causing injury whenever my robot is outside the cage. The lock must have a high-visibility safety color, tag, or tape, such as neon orange or neon yellow.

6. I will use elevated test stands whenever power is connected outside the arena, so drive wheels and weapons cannot contact any surface if accidentally engaged. I will also de-power the weapon through its dedicated switch or by disconnecting its battery/circuit, with the high-visibility weapon lock still installed.

7. I will cover stationary sharp edges, pick axes, and cutter teeth with protective guards in the pits, while keeping the required weapon lock installed.

8. I will use only factory-sealed LiPo, LiHV, LiFePO4, or NiMH battery packs secured so they cannot move. I acknowledge the 3S LiHV maximum and absolute 13.05 V ceiling (4.35 V per cell maximum). Exposed soft cells and damaged or swollen packs fail inspection.

9. I will provide an accessible manual mechanical disconnect (screw switch or removable link) that lets a builder or official completely sever all electrical power in under 15 seconds, without chassis disassembly or placing limbs near weapons. Each multibot segment must have its own independent disconnect.

10. I will use a 2.4 GHz digital spread-spectrum radio system. Drive and weapon outputs must drop completely to zero within 2.0 seconds of signal loss or radio deactivation. Spinning weapons must reach a complete stop in under 60 seconds after switch cutoff or radio failsafe actuation.

11. I will follow instructions from event staff, safety officials, and judges, including instructions to power down, disarm, or withdraw my robot.

12. I will limit my entry's team at the table to its robot controller(s) plus one additional support member, with no more than four people total.

13. I acknowledge that my robot and equipment may be damaged, destroyed, or lost. I accept responsibility for that risk and understand that registration does not provide equipment protection or a promise of reimbursement from KSU Combat Robotics or Kent State University.

14. I will sign the full in-person waiver at check-in before competing. I acknowledge that this online acknowledgement is not the legal release and does not replace the signed in-person waiver.

15. I acknowledge that registration fees are non-refundable except where stated in the event listing.`;

// Blank per-event text falls back to the default so events created before the waiver
// field existed keep showing something meaningful.
export function resolveWaiverText(eventWaiverText: string | null | undefined): string {
	const trimmed = (eventWaiverText ?? '').trim();
	return trimmed === '' ? DEFAULT_WAIVER_TEXT : trimmed;
}
