# Competitor registration editing

Competitors receive an edit link automatically after payment confirmation or member
registration. The event page also has a **Send registration edit link** button with
an email field, so missing or expired links can be replaced without leaving the event.
Both that form and **Manage registration** use the same protected resend action.
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
   - `EMAILJS_REGISTRATION_TEMPLATE_ID`: a dedicated registration email template.
     Do not reuse the contact form template, which sends messages to staff.
   - `EMAILJS_PRIVATE_KEY`: the account's private API key, kept server-only.
   - `EMAILJS_SERVICE_ID` and `EMAILJS_PUBLIC_KEY`: optionally override the existing
     contact form service and public key. By default these reuse
     `PUBLIC_EMAILJS_SERVICE_ID` and `PUBLIC_EMAILJS_USER_ID`.
   - The site address reuses `BETTER_AUTH_URL`. Check it points to
     `https://www.ksucombat.club` in production and `https://dev.ksucombat.club` in preview.
     `REGISTRATION_SITE_URL` is an optional override only if the email links need
     a different canonical origin.
3. Rebuild the deployment after saving environment variables.
4. Request an edit link using a real confirmed registration. Confirm delivery,
   link verification, saving, logout, and requesting a replacement link.

Email uses the [EmailJS REST Send API](https://www.emailjs.com/docs/rest-api/send/).
No Resend account or new npm package is needed. In EmailJS account settings,
allow non-browser API requests and enable private-key authorization for those
requests. Keep the private key out of all `PUBLIC_` variables and browser code.
The existing browser-based contact form remains unchanged. Check that it still
works after adjusting account settings; do not disable its browser access.

Create the registration template with:

- **To Email:** `{{to_email}}`
- **Subject:** `Manage your registration — {{event_name}}`
- **From Name:** `KSU Combat Robotics`
- **From Email:** the connected service's default sender
- **Body:** `{{message}}` (plain text, preserving line breaks), or an HTML template
  with a link to `{{edit_link}}`, event name `{{event_name}}`, and an expiry note
  saying the link works once and expires in `{{expires_minutes}}` minutes.

Use normal escaped template variables, not unescaped HTML substitutions. Turn off
template-level CAPTCHA for this server-driven template only. Keep any existing
contact form CAPTCHA rules unchanged. EmailJS's one-send-per-second limit is handled
with bounded retries on explicit HTTP 429 responses. Requests that time out are
not automatically retried to avoid duplicate sends. EmailJS account/service quotas
still apply.

Missing email configuration leaves the recovery page
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
removes only temporary fixtures and intercepts EmailJS requests, sending no email.
It covers concurrent token redemption/rate limits, cross-event/owner access,
expired links/sessions, protected payment fields, stale saves, safety review,
audit history, refund/deadline races, Eastern-time midnight boundaries, EmailJS
request parameters, throttling retries, and failed-delivery link revocation.
