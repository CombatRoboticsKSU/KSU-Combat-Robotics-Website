// Body wording must match DEFAULT_WAIVER_TEXT in src/lib/utils/waiver.ts.
// Compile from the repository root: typst compile docs/waiver/competitor-waiver.typ
#let navy = rgb("#002664")
#let gold = rgb("#EAAB00")
#set document(title: "Competitor Waiver and Safety Acknowledgement", author: "KSU Combat Robotics")
#set text(font: ("Arial", "Segoe UI"), size: 11pt, fill: rgb("#202630"))
#set par(leading: 0.48em, spacing: 0.85em, justify: false)
// kent-state-logo.png is the main blue and gold logo from kent.edu/ucm/university-logos.
#set page(
  paper: "us-letter",
  margin: (left: 0.6in, right: 0.6in, top: 1.35in, bottom: 0.75in),
  header-ascent: 0.2in,
  header: [
    #grid(columns: (auto, 1fr, auto), column-gutter: 12pt, align: horizon,
      image("ksu-combat-logo.png", height: 0.62in),
      [
        #text(size: 13pt, weight: "bold", fill: navy)[Competitor Waiver and Safety Acknowledgement]
        #v(-6pt)
        #text(size: 8.5pt, fill: rgb("#5a6270"))[KSU Combat Robotics #h(4pt) | #h(4pt) Kent State University #h(4pt) | #h(4pt) ksucombat.club]
      ],
      image("kent-state-logo.png", height: 0.38in),
    )
    #v(-2pt)
    #grid(columns: (3fr, 1fr), line(length: 100%, stroke: 2.5pt + navy), line(length: 100%, stroke: 2.5pt + gold))
  ],
  footer: context [
    #line(length: 100%, stroke: 0.5pt + rgb("#c8ccd4"))
    #v(4pt)
    #grid(columns: (1fr, auto), column-gutter: 8pt,
      text(size: 6.6pt, fill: rgb("#5a6270"), "KSU COMBAT ROBOTICS  //  COMPETITOR WAIVER"),
      text(size: 7pt, fill: navy, weight: "bold")[Page #counter(page).display() of #counter(page).final().first()],
    )
  ],
)
#let waiver-text = ```
Combat robotics is an inherently dangerous activity.

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

15. I acknowledge that registration fees are non-refundable except where stated in the event listing.
```.text

#let paragraphs = waiver-text.trim().split("\n\n")
#let item(num, content) = block(breakable: false, below: 0.7em)[
  #grid(columns: (20pt, 1fr), column-gutter: 8pt,
    box(width: 20pt, height: 20pt, radius: 3pt, fill: navy,
      align(center + horizon, text(size: 8.5pt, weight: "bold", fill: white, num))),
    pad(top: 3pt, content),
  )
]

// Risk warning: the first two paragraphs.
#block(width: 100%, fill: rgb("#fff6dc"), stroke: (left: 4pt + gold), inset: (x: 12pt, y: 10pt), radius: (right: 3pt), below: 1em)[
  #text(size: 12pt, weight: "bold", fill: navy, paragraphs.at(0))
  #v(-2pt)
  #paragraphs.at(1)
]

#text(weight: "bold", paragraphs.at(2))
#v(2pt)

// Keep each numbered acknowledgement together and balance the two pages.
#for paragraph in paragraphs.slice(3) {
  let m = paragraph.match(regex("^(\\d+)\\. (.*)$"))
  if m != none { item(m.captures.at(0), m.captures.at(1)) } else { block(breakable: false, paragraph) }
}

#v(1.2em)
#block(width: 100%, breakable: false, stroke: 0.75pt + rgb("#c8ccd4"), radius: 3pt, inset: 12pt)[
  #text(size: 8pt, weight: "bold", fill: navy)[DOCUMENT INFORMATION]
  #v(-2pt)
  #set text(size: 9pt)
  #grid(columns: (auto, 1fr), column-gutter: 14pt, row-gutter: 7pt,
    text(fill: rgb("#5a6270"))[Issued by], [KSU Combat Robotics, a registered student organization of Kent State University],
    text(fill: rgb("#5a6270"))[Status], [Approved for use],
    text(fill: rgb("#5a6270"))[Applies to], [All competitors at KSU Combat Robotics events],
    text(fill: rgb("#5a6270"))[Questions], [ksu.fightingrobotics\@gmail.com #h(4pt) | #h(4pt) ksucombat.club],
  )
]
#v(0.8em)
#text(size: 8.5pt, fill: rgb("#5a6270"))[This online acknowledgement is completed at registration. The signed in-person waiver collected at check-in is the legal release.]
