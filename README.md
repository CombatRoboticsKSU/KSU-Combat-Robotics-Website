# KSU Combat Robotics Website

Website for KSU Combat Robotics at Kent State University: club info, leadership, bots, projects, blog posts, sponsors, and event registration with online payment.

## Stack

- SvelteKit 2 with Svelte 5 and TypeScript
- Drizzle ORM on Neon Postgres
- better-auth for admin login
- Stripe Checkout and Payment Links for event payments
- Vercel Blob for uploads (images, PDFs, hazard bot documents, bot photos)
- Deployed on Vercel

## Features

- Public pages: home, events, leadership, bots, projects, blog, history, calendar, sponsorship, contact, wiki
- Events: event pages with documents (rules, waiver), competitor registration with Stripe Checkout, spectator tickets via Stripe Payment Links
- Registration: required bot photo, competitor waiver, hazard bot declaration with document upload, free registration for club members via a per-event access code
- Admin (`/admin`): manage content, events, registrations (edit, change status, add manually, delete), hazard bot review, roster filters with email export, CSV export, sponsor codes for free spectator tickets

## Getting started

Requires Node 22.13 or newer.

```sh
npm install
npm run dev
```

### Environment variables

Create a `.env` file in the project root:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string (dev database) |
| `PROD_DATABASE_URL` | Production database, only used for applying manual SQL |
| `BETTER_AUTH_SECRET` | better-auth signing secret |
| `BETTER_AUTH_URL` | Base URL of the site, for example `http://localhost:5173` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token |
| `STRIPE_SECRET_KEY` | Stripe secret key (test key for dev) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for `/api/stripe/webhook` |
| `PUBLIC_EMAILJS_SERVICE_ID`, `PUBLIC_EMAILJS_TEMPLATE_ID`, `PUBLIC_EMAILJS_USER_ID` | EmailJS for the contact form |

### Stripe webhooks locally

```sh
stripe listen --forward-to localhost:5173/api/stripe/webhook --events checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.expired,checkout.session.async_payment_failed,charge.refunded
```

Put the printed `whsec_...` value in `STRIPE_WEBHOOK_SECRET`.

## Database

Schema lives in `src/lib/server/schema.ts`. Dev schema changes are applied with:

```sh
npx drizzle-kit push
```

Every schema change is also recorded as a `drizzle/*.manual.sql` file. These are idempotent and must be run against production before deploying code that depends on them.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run check` | Type check with svelte-check |

## Deployment

`main-dev` is the integration branch. Changes land through pull requests and are promoted to production in Vercel. Before promoting, apply any new `drizzle/*.manual.sql` files to the production database.
