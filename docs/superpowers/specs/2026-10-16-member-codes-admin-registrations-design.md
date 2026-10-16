# Member Access Codes, Admin Registration Management, and Event Documents - Design

Follows `2026-10-16-hazard-bots-waiver-design.md` on branch `hazard-bots-waiver`.

## Goals

1. Club members register for free using a per-event access code.
2. Admins can add, edit, change the status of, and delete registrations.
3. Event rules, the waiver, and hazard bot requirements are publicly visible on the event page without registering.

## Non-goals

- Member accounts or roles. Access is by shared code only.
- Rate limiting code attempts (no shared state on serverless). Mitigated by admin guidance to use 8+ character codes and rotate per event.
- Refunds from the admin UI. Admins refund in the Stripe dashboard; the existing webhook marks rows `refunded`.
- Admin upload of hazard documents.

## Statuses

`registrations.status` values: `pending` | `paid` | `expired` | `refunded` (Stripe-owned, unchanged) plus new `member` | `paid_offline` | `cancelled`.

New shared constant in `src/lib/utils/events.ts`: `ACTIVE_REGISTRATION_STATUSES = ['pending', 'paid', 'member', 'paid_offline']`. Every capacity count (events listing, event detail, register action) uses it via `inArray`, replacing the hard-coded `pending OR paid`. The `deleteEvent` guard in `src/routes/admin/events/+page.server.ts` blocks deletion when any registration is in `pending`, `paid`, `refunded`, `member`, or `paid_offline`.

The webhook is unchanged: it only transitions rows from `pending` (markPaid predicate) or to `refunded` (refund predicate `ne refunded`). A refund on a `cancelled` row that was Stripe-paid correctly lands as `refunded`.

## Member access code

- New column `events.member_code text not null default ''`. Blank disables member registration. Admin event form gets a "Member Access Code" field with help text: "Share with club members in Discord. Members who enter it register without paying. Use 8+ characters and change it for each event. Leave blank to disable."
- Registration form: optional "Member Access Code" input shown only when the event has a code configured (load returns `memberCodeEnabled: boolean`, never the code). Help text: "Club members: enter the code from Discord to register without paying."
- Server: if the field is non-empty, compare trimmed, lowercased input against the trimmed, lowercased event code with `crypto.timingSafeEqual` on equal-length buffers (length mismatch is a non-match). Wrong code -> `fail(400, { error: 'That member access code is not valid for this event.', values })`. Never fall through to payment when a code was entered.
- Right code: insert with `status: 'member'`, all other validation identical (waiver, age, hazard docs, capacity, registration open). Capacity and open/closed checks apply. `competitorPriceId` is not required for member registration (an event can be member-only); `canRegister` gets the member path accordingly: open + upcoming is enough when a valid code is used.
- Redirect to `/events/[slug]/register/success?member=1` (plus `&hazard=1` for hazard entries). The success page member branch is static: "You are registered as a club member. No payment needed." plus the hazard approval notice when `hazard=1`, and the existing check-in/waiver note. It performs no registration lookup.
- Values persist across failed submits, except the code field, which is cleared.
- Schema change recorded in `drizzle/member-codes.manual.sql` and applied to the dev DB.

## Admin registration management

Admin guard already covers `/admin/**` including form actions (`hooks.server.ts`).

### Roster (`/admin/events/[id]/registrations`)
- "Add Registration" button -> `new` page.
- Each row: "Edit" link -> `[regId]` page. Status pill styles for the new statuses. Rows with `waiverAck = false` show "Waiver at check-in".
- Existing hazard approve/reject stays.

### Edit page (`/admin/events/[id]/registrations/[regId]`)
- 404 if the registration is not on that event.
- Edit: builderName, email, phone, teamName, botName, weaponType, notes, hazardPneumatic, hazardHighMass. Same required fields as public registration (builderName, email with `@`, botName). Turning a hazard flag on when status is `not_required` sets `pending_review`; turning both off sets `not_required` and clears review note/time. Changing flags while already flagged keeps the current hazard status. Docs shown read-only.
- Status change (separate form action `setStatus`), allowed transitions enforced server-side with a predicate on the current status in the UPDATE (no read-then-write):
  - `paid` -> `cancelled` (UI notes: does not refund; refund in Stripe).
  - `expired` | `member` | `paid_offline` | `cancelled` -> any of `member` | `paid_offline` | `cancelled`.
  - `pending` and `refunded`: no manual changes (UI explains why: pending may be mid-checkout; refunded is final).
- Delete (`deleteRegistration` action, confirm in UI): allowed only when `stripePaymentIntentId IS NULL` and status not in `pending`, `paid`, `refunded`. Enforced in the DELETE predicate. Redirect to roster.
- Stripe fields (session id, payment intent, amount, paidAt) shown read-only.

### New page (`/admin/events/[id]/registrations/new`)
- Same fields as edit plus initial status `member` or `paid_offline`. Inserts with `waiverAck: false`, `ageAck: false`, `hazardDocs: []`, hazard status derived from flags. Not subject to capacity or registration-open checks (admin override), but shows a warning when the event is full.
- Redirect to roster on success.

### CSV
Status column already present; ensure new statuses export as-is. Add "Waiver Acknowledged Online" column (Yes/No).

## Event page documents

- New "Documents" block on `src/routes/events/[slug]/+page.svelte` (move the existing rules button into it) listing, when available:
  - Rules: `rulesPdfUrl` with `rulesLabel`.
  - Competitor Waiver: `waiverPdfUrl` if set, otherwise link to new page `/events/[slug]/waiver`.
  - Hazard Bots: short static note: "Pneumatic systems (150 psi max) and weapons over 50% of robot weight require written technical pre-approval. See section 2 of the rules. Upload documentation when you register."  Only shown when a rules PDF exists or the event is upcoming; keep it simple: always shown for upcoming events.
- `/events/[slug]/waiver`: public page rendering `resolveWaiverText(event.waiverText)` as plain text paragraphs (same splitting as `WaiverModal`), with a PDF link when `waiverPdfUrl` is set. 404 for unpublished events, same as the detail page.
- Use the existing site styles and lucide icons (FileText, ShieldAlert, Download).

## Verification

- `npm run check`: only the pre-existing Navbar error.
- Member code: correct code (case/space variations) -> 303 to success with `member=1`, row `member`; wrong code -> 400, no row; blank code with no price -> closed message as before; member hazard entry -> `pending_review`.
- Capacity counts include `member` and `paid_offline`.
- Admin: add, edit (hazard flag transitions), every allowed and disallowed status transition, delete allowed and blocked cases, cross-event regId -> 404.
- Event page shows the Documents block; `/events/1lb/waiver` renders.
- All test rows, temp admin users, and scripts removed afterwards.

## Sponsor codes (free spectator tickets)

Spectator tickets are sold through a per-event Stripe Payment Link (`events.spectator_url`). Sponsor codes are Stripe promotion codes on that link, managed from the admin.

- Page `/admin/events/[id]/sponsor-codes`, linked from the roster header. Admin guard covers it.
- Table `sponsor_codes`: `id serial`, `event_id int not null references events`, `sponsor_name text not null`, `tickets int not null`, `code text not null`, `stripe_coupon_id text not null`, `stripe_promotion_code_id text not null unique`, `active boolean not null default true`, `created_at timestamp default now`. Recorded in `drizzle/sponsor-codes.manual.sql`.
- Create action (sponsor name required; tickets integer 1-50; code required, uppercased, `^[A-Z0-9_-]{4,40}$`):
  1. Resolve the event's Payment Link: list payment links (auto-paginate) and match `url === events.spectator_url`. No match -> error "Set the event's spectator ticket link to a Stripe Payment Link first."
  2. Read its line items: exactly one line item expected; take its price (`unit_amount`, `currency`) and product id.
  3. If `allow_promotion_codes` is false, update the link to true.
  4. Create coupon: `amount_off = tickets * unit_amount`, `currency`, `duration: 'once'`, `applies_to.products = [productId]`, `name = "Sponsor: <name> (<n> tickets)"` (Stripe name max 40 chars; truncate the sponsor name to fit).
  5. Create promotion code: `promotion: { type: 'coupon', coupon }` (match the installed `stripe` SDK version's API shape), `code`, `max_redemptions: 1`, metadata `{ sponsor, tickets, eventId }`.
  6. Insert the row. Stripe errors (e.g. duplicate code) surface as a form error with Stripe's message for `StripeInvalidRequestError`, generic otherwise.
- Load: rows for the event; for each active row fetch the promotion code from Stripe to show `times_redeemed` and `active` (parallel, tolerate individual failures with "unavailable").
- Deactivate action: set the promotion code `active: false` in Stripe, then set `active = false` in the row (scoped by event id).
- Page shows the ticket link, per-ticket price, and a note that codes are single-use and cover up to N tickets per order, and that test vs live follows the deployed Stripe key.
