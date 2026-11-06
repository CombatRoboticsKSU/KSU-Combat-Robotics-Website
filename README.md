# KSU Combat Robotics Website

Website for KSU Combat Robotics at Kent State University: club info, leadership, bots, projects, blog posts, sponsors, and free event registration.

## Stack

- SvelteKit 2 with Svelte 5 and TypeScript
- Drizzle ORM on Neon Postgres
- better-auth for admin login
- Vercel Blob for uploads (images, PDFs, hazard bot documents, bot photos)
- Deployed on Vercel

## Features

- Public pages: home, events, leadership, bots, projects, blog, history, calendar, sponsorship, contact, wiki
- Events: event pages with documents (rules, waiver), free competitor registration, spectator info with an optional external link
- Registration: required bot photo, competitor waiver, hazard bot declaration with document upload
- Admin (`/admin`): manage content, events, registrations (edit, change status, add manually, delete), hazard bot review, roster filters with email export, CSV export

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
| `PUBLIC_EMAILJS_SERVICE_ID`, `PUBLIC_EMAILJS_TEMPLATE_ID`, `PUBLIC_EMAILJS_USER_ID` | EmailJS for the contact form |

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
