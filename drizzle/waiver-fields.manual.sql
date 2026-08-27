-- This repo applies schema changes with `drizzle-kit push`, not `drizzle-kit migrate`.
-- Several existing tables were pushed without generated migrations, so the snapshot
-- history is incomplete and a generated delta is not reliable. This file is a record of
-- what this change adds, for applying to production by hand.

-- Per-event competitor waiver text, shown on the registration form. Blank falls back to
-- DEFAULT_WAIVER_TEXT in src/lib/utils/waiver.ts.
ALTER TABLE "events" ADD COLUMN "waiver_text" text DEFAULT '' NOT NULL;
--> statement-breakpoint
-- Records the "I am 18 or older" affirmation taken alongside waiver_ack at registration.
ALTER TABLE "registrations" ADD COLUMN "age_ack" boolean DEFAULT false NOT NULL;
