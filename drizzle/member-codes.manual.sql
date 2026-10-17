-- This repo applies schema changes with `drizzle-kit push`, not `drizzle-kit migrate`.
-- Record this addition for applying to production by hand.
ALTER TABLE "events"
	ADD COLUMN IF NOT EXISTS "member_code" text DEFAULT '' NOT NULL;
