-- This repo applies schema changes with `drizzle-kit push`, not `drizzle-kit migrate`.
-- Several existing tables were pushed without generated migrations, so the snapshot
-- history is incomplete and a generated delta is not reliable. This file is a record of
-- what this change adds, for applying to production by hand.

-- Blob URL of the waiver PDF shown in the registration waiver modal. Takes precedence
-- over events.waiver_text, which remains the fallback and the accessible path.
ALTER TABLE "events" ADD COLUMN "waiver_pdf_url" text DEFAULT '' NOT NULL;
