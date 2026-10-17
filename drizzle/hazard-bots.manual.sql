-- This repo applies schema changes with `drizzle-kit push`, not `drizzle-kit migrate`.
-- Record these additions for applying to production by hand.
ALTER TABLE "registrations"
	ADD COLUMN IF NOT EXISTS "hazard_pneumatic" boolean DEFAULT false NOT NULL,
	ADD COLUMN IF NOT EXISTS "hazard_high_mass" boolean DEFAULT false NOT NULL,
	ADD COLUMN IF NOT EXISTS "hazard_docs" json DEFAULT '[]'::json NOT NULL,
	ADD COLUMN IF NOT EXISTS "hazard_status" text DEFAULT 'not_required' NOT NULL,
	ADD COLUMN IF NOT EXISTS "hazard_review_note" text DEFAULT '' NOT NULL,
	ADD COLUMN IF NOT EXISTS "hazard_reviewed_at" timestamp;
