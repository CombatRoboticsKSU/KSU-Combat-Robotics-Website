# Hazard Bot Pre-Approval, Waiver Draft, and Ruleset - Design

Source: KSU-TR-1LB-NF Rev 6.0 ("ksu_combat_1lb_ruleset_v6.1"), section 2 (Hazard Bot Pre-Approval) and sections 3-5 (safety).

## Goals

1. Registrants declare whether their bot is a Hazard Bot and, if so, upload the technical documentation the ruleset requires.
2. Hazard registrations pay like any other registration, then sit in `pending_review` until an admin approves or rejects them.
3. Replace the default waiver text with a ruleset-based draft (fixing the "Kansas State" error) and publish it as a PDF for the 1lb event.
4. Attach the v6.1 ruleset PDF as the 1lb event's rules PDF.

## Non-goals

- Locomotion class, multibot unit count, ruleset acknowledgement checkbox (explicitly declined).
- Automatic refunds on rejection. Admin refunds in the Stripe dashboard; the existing `charge.refunded` webhook marks the row `refunded`.
- Email notifications. No mail infrastructure exists; admins contact builders using the roster email.
- Legal review. The waiver is a draft for club risk management to review; the signed in-person waiver remains the legal record.

## Hazard Bot definition (from the ruleset)

Either or both:

- **Pneumatics (<=150 psi):** full documentation required: component datasheets for all reservoirs, lines, regulators, and valves, plus schematics showing relief valves and safety pressure factors. Must have an accessible manual bleed/vent valve.
- **High-mass inertia weapon (>50% of bot weight):** engineering documentation required: retention shaft verification, bearing load margins, and FEA/burst containment calculations at full operational RPM.

## Data model (`registrations`)

| Column | Type | Default | Notes |
| --- | --- | --- | --- |
| `hazard_pneumatic` | boolean not null | false | |
| `hazard_high_mass` | boolean not null | false | |
| `hazard_docs` | json not null | `[]` | `{ name: string; url: string }[]` |
| `hazard_status` | text not null | `'not_required'` | `not_required` \| `pending_review` \| `approved` \| `rejected` |
| `hazard_review_note` | text not null | `''` | |
| `hazard_reviewed_at` | timestamp | null | |

Recorded as `drizzle/hazard-bots.manual.sql`, matching the existing manual-SQL convention (schema is applied with `drizzle-kit push`). `hazard_status` is set server-side at insert: `pending_review` if either flag is true, else `not_required`. Never from client input.

## Document upload

- New endpoint `src/routes/api/upload/hazard/+server.ts` using `@vercel/blob/client`'s `handleUpload` (client uploads), so files go browser -> Blob directly and avoid Vercel's 4.5 MB function body limit.
- `onBeforeGenerateToken` enforces: pathname starts with `hazard-docs/`, `allowedContentTypes` = PDF, PNG, JPEG, WebP; `maximumSizeInBytes` = 10 MB; `addRandomSuffix: true`. Unauthenticated (registrants are not logged in). `onUploadCompleted` is a no-op.
- Client uses `upload()` from `@vercel/blob/client` with `handleUploadUrl: '/api/upload/hazard'`.
- Max 5 documents per registration.
- Blob URLs are public but unguessable, same as existing uploads. Accepted trade-off.

## Registration form (`src/routes/events/[slug]/register`)

- New "Hazard Bot" section after the bot fields: short intro linking the event's rules PDF when set, two checkboxes with the ruleset wording above.
- When either is checked: an upload control (multiple files) appears; each uploaded file is listed with remove; serialized into a hidden `hazardDocs` JSON field. At least one document required when either box is checked (client and server).
- Submit is disabled while uploads are in flight.
- Server (`+page.server.ts`): parse `hazardPneumatic`/`hazardHighMass` (`=== 'on'`), parse `hazardDocs` JSON defensively; each entry must be an object with string `name` (trimmed, capped 200 chars) and `url` whose host ends with `.public.blob.vercel-storage.com` and whose pathname starts with `/hazard-docs/`. Max 5. On failure return `fail(400, { error, values })` preserving the docs. If no flag set, store `[]` regardless of submitted docs.
- Values persist across a rejected submit like the existing fields.
- Payment flow unchanged.

## Success page

If the registration has `hazardStatus === 'pending_review'`, add a notice: payment received, entry is a Hazard Bot and requires technical approval from event staff before it can compete; staff will contact you at the registered email.

## Admin roster (`src/routes/admin/events/[id]/registrations`)

- Per registration: hazard badge with types (Pneumatic / High-mass) and status pill; document links (open in new tab, `rel="noopener noreferrer"`); review note when set.
- Actions for hazard registrations: `approveHazard` and `rejectHazard` form actions with optional note (required for reject). Sets `hazard_status`, `hazard_review_note`, `hazard_reviewed_at = now()`. Only valid when the row's flags make it a hazard bot (`hazard_status <> 'not_required'`). Admin guard already applies via `hooks.server.ts`.
- Rejection UI text reminds the admin to refund in Stripe if appropriate.
- Use existing `admin.css` classes; no inline styles.

## CSV export

- Add columns: Hazard Types, Hazard Status, Hazard Docs (URLs joined by space), Hazard Review Note.
- Fix formula injection: any cell whose string starts with `=`, `+`, `-`, `@`, tab, or CR is prefixed with `'` before RFC-4180 quoting.

## Waiver

- Rewrite `DEFAULT_WAIVER_TEXT` in `src/lib/utils/waiver.ts` from the ruleset: inherent danger; compliance with the event technical regulations; Hazard Bot pre-approval and that unapproved hazard bots will not compete; weapon locks with high-visibility pins outside the arena; elevated test stands and de-powered weapons when powered outside the arena; blade covers in the pits; battery rules and immediately reporting damaged/swollen packs; rapid deactivation; following officials' instructions; team size limit; damage to equipment; assumption of risk; signing the in-person waiver; fee refund terms. Correct institution name: Kent State University. Plain text, no em dashes.
- Typst source `docs/waiver/competitor-waiver.typ` producing `competitor-waiver.pdf` with the same text, styled to match the ruleset header (navy `#002664`, gold `#EAAB00`), "DRAFT - pending risk management review" in the footer.
- The PDF is uploaded to Blob and set as the 1lb event's `waiverPdfUrl`; the text stays as `DEFAULT_WAIVER_TEXT` (fallback / accessible path).

## Ruleset

Upload the v6.1 PDF to Blob under `documents/` and set the 1lb event's `rulesPdfUrl` (dev DB). Production is set via the admin form after deploy.

## Verification

- `npm run check` shows no new errors (1 pre-existing Navbar error).
- Browser run: hazard registration with an uploaded PDF reaches Stripe checkout; DB row has flags, docs, `pending_review`. Non-hazard registration stores `not_required` and `[]`.
- Crafted POST with a non-Blob doc URL is rejected.
- Roster shows docs; approve and reject update the row. CSV includes new columns and neutralizes `=SUM(1,1)`.
