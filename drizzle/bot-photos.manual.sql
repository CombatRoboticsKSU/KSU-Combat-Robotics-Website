-- This repo applies schema changes with `drizzle-kit push`, not `drizzle-kit migrate`.
-- Record this addition for applying to production by hand.
ALTER TABLE "registrations"
	ADD COLUMN IF NOT EXISTS "bot_photo_url" text DEFAULT '' NOT NULL;
