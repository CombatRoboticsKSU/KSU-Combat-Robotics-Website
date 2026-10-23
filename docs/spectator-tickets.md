# Spectator tickets

The event’s existing Stripe Payment Link remains the checkout. Confirmed purchases
are saved to `spectator_orders`, with one random QR token per admission in
`spectator_tickets`. Free sponsor purchases are supported. Competitor registration
and spectator admission remain separate.

## Deploy

1. Apply `drizzle/spectator-tickets.manual.sql` to the target database **before**
   deploying this code. The new tables are required by the webhook and event admin.
   The migration has been applied to the development database, not production.
2. Deploy with the target environment’s Stripe key and webhook signing secret.
   Use the existing snapshot webhook subscriptions: `checkout.session.completed`,
   `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`,
   `checkout.session.expired`, and `charge.refunded`.
3. Set the event’s spectator URL to its own Payment Link in that Stripe environment.
   Do not share a link between events. Sandbox and live links are different.
4. Open **Admin → Events → Spectator tickets → Ticket setup and order recovery**.
   Click **Connect ticket confirmation page** on the deployed site. This sets Stripe’s
   post-payment redirect to `/events/{slug}/tickets?session_id={CHECKOUT_SESSION_ID}`.
5. Complete a sandbox paid checkout and a fully discounted sponsor checkout. Confirm
   the purchased quantity, QR codes, name/email lookup, and single-use check-in.
   Verify a refund blocks unused admissions before accepting live purchases.

## Event-day use

Staff must sign in to an admin account. Scan a buyer’s QR using the phone camera;
the URL opens the ticket in the event’s admin spectator roster. Review its status,
then press **Check in · admit one**. Scanning alone never consumes a ticket.
Another scan shows the existing check-in. Concurrent submissions admit only once.

Search the roster by buyer name, email, ticket code, or Stripe session ID when a
QR is unavailable. Each ticket in a group order can be checked in separately.
The order total is labeled as the total for the whole order, not a per-ticket price.

Buyers can save their private confirmation URL or print the QR tickets. There is
no automatic ticket email delivery in this implementation. Staff can reopen their
tickets from the roster. Keep confirmation links and ticket codes private.

## Refunds and recovery

Full refunds block admission for the order. Partial refunds place the whole order
on **Refund needs review**; staff must arrange remaining admissions manually.
Existing check-ins are retained for audit. Replaying a checkout cannot reactivate
a refunded ticket. Refunds arriving before checkout webhooks are reconciled from
Stripe. Only cleared payments (or `no_payment_required` sponsor purchases) issue
tickets. Pending delayed payments must not be admitted.

Orders created before deployment, or missed while the webhook was unavailable,
can be recovered using **Sync order from Stripe** and their `cs_…` Checkout Session
ID. This checks the actual Payment Link against the event; it does not trust URL
references or customer metadata. Re-importing preserves tickets and check-ins.
For a ticket that needs investigation after a refund, syncing the order refreshes
its refund status from Stripe.

## Validation

After applying the migration to a separate development database:

```sh
node --env-file=.env tests/spectators.integration.mjs
npm run check
npm run build
```

The integration test creates and removes only its own unpublished temporary event,
orders, and tickets. It uses real development Postgres and a fake Stripe client;
it never creates Stripe products, sessions, or payments. It checks concurrent
fulfillment and admission, free tickets, pending payments, wrong-event tokens,
Payment Link identity, replay safety, and partial/full/out-of-order refunds.
