# Competitor registration editing

Competitors use **Manage registration** on the event or payment confirmation page.
They enter their registration email to receive a private, single-use link valid for
30 minutes. A deliberate Continue submission exchanges it for an HttpOnly browser
session lasting two hours. Email scanners opening the link do not consume it.
The session covers confirmed entries belonging to that email for that event only.
No account, registration ID, Stripe session ID, or payment receipt grants editing access.

## Deployment

The additive migration was applied to development and production on October 23,
2026. Email configuration and a deployment of this code are still required.

1. Apply `drizzle/registration-editing.manual.sql` before deploying this version.
2. Configure these server-only environment variables separately for each environment:
   - `RESEND_API_KEY`: a Resend key allowed to send email.
   - `REGISTRATION_EMAIL_FROM`: a sender on a verified Resend domain, such as
     `KSU Combat Robotics <events@ksucombat.club>`.
   - `REGISTRATION_SITE_URL`: canonical site origin, for example
     `https://www.ksucombat.club` in production or `https://dev.ksucombat.club` in preview.
3. Rebuild the deployment after saving environment variables.
4. Request an edit link using a real confirmed registration. Confirm delivery,
   link verification, saving, logout, and requesting a replacement link.

Email uses the [Resend Send Email API](https://resend.com/docs/api-reference/emails/send-email).
No new npm package is needed. Missing email configuration leaves the recovery page
available with a contact-staff message. Payment processing continues normally.
Automatic edit emails are attempted when Stripe first confirms a payment and when
a member registers. Failures do not reverse payment; the competitor can request
another link later. Offline entries can use the same request form.

## Editing rules

- Confirmed `paid`, `member`, and `paid_offline` entries are eligible. Pending,
  expired, refunded, and cancelled entries are blocked, including changes that
  occur after the editing page loads.
- Editable: builder name, phone, team and bot names, weapon type, notes, bot photo,
  hazard declarations, and technical documents. Staff handle registration-email
  changes so ownership cannot be transferred to an unverified address.
- Payment status, price, Stripe identifiers, and waiver/age acknowledgements are
  never accepted from competitor forms.
- Safety changes to an existing or newly declared Hazard Bot reset technical review.
  Removing a hazard declaration also requires staff review. Contact-only changes
  preserve approval. Audit records and data updates commit atomically.
- Staff see the latest 20 competitor saves on the admin entry page.
- The event editor's **Last day competitors can edit** is inclusive in Eastern
  time. Blank permits editing through the day before the event. All self-service
  edits close when event day begins or the event is marked past. Staff retain
  their existing editing access.
- Optimistic revisions reject stale saves instead of overwriting a newer staff
  or competitor edit. Save is also guarded by current ownership, eligibility,
  publication, and the current deadline in the database.

## Operational details

Private links and sessions use 256-bit random tokens, stored only as SHA-256 hashes.
Private pages send no-store, no-referrer, and noindex headers. The configured
canonical origin, rather than request headers, determines emailed URLs. Request
responses are identical for known/unknown email addresses. Persistent atomic
limits allow three requests per email/event and fifteen per IP per hour.
Failures are logged without email addresses, tokens, or provider response bodies.

Periodically remove expired access records after both `expires_at` and
`session_expires_at` have passed, and rate-limit rows whose `resets_at` has passed.
Audit records contain before/after entry details and follow the club's registration
data retention policy; they are visible only to staff.

## Verification

After the migration, run:

```sh
node --env-file=.env tests/registration-editing.integration.mjs
npm run check
npm run build
```

The integration test requires a separate development database. It creates and
removes only temporary fixtures and intercepts Resend requests, sending no email.
It covers concurrent token redemption/rate limits, cross-event/owner access,
expired links/sessions, protected payment fields, stale saves, safety review,
audit history, refund/deadline races, and Eastern-time midnight boundaries.
