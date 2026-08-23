-- This repo applies schema changes with `drizzle-kit push`, not `drizzle-kit migrate`.
-- Several existing tables were pushed without generated migrations, so the snapshot
-- history is incomplete and a generated delta is not reliable. This file is a record of
-- what this change adds, for applying to production by hand.

CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '/USINGimg/placeholder.png' NOT NULL,
	"weight_class" text DEFAULT '' NOT NULL,
	"event_date" text DEFAULT '' NOT NULL,
	"sort_date" timestamp DEFAULT now() NOT NULL,
	"doors_time" text DEFAULT '' NOT NULL,
	"location" text DEFAULT '' NOT NULL,
	"address" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'upcoming' NOT NULL,
	"overview" text DEFAULT '' NOT NULL,
	"rules_pdf_url" text DEFAULT '' NOT NULL,
	"rules_label" text DEFAULT 'Download Rules (PDF)' NOT NULL,
	"registration_open" boolean DEFAULT false NOT NULL,
	"competitor_price_id" text DEFAULT '' NOT NULL,
	"competitor_label" text DEFAULT 'Register to Compete' NOT NULL,
	"competitor_price" text DEFAULT '' NOT NULL,
	"competitor_note" text DEFAULT '' NOT NULL,
	"capacity" integer DEFAULT 0 NOT NULL,
	"spectator_url" text DEFAULT '' NOT NULL,
	"spectator_label" text DEFAULT 'Buy Spectator Tickets' NOT NULL,
	"spectator_price" text DEFAULT '' NOT NULL,
	"spectator_note" text DEFAULT '' NOT NULL,
	"schedule" json DEFAULT '[]'::json NOT NULL,
	"faq" json DEFAULT '[]'::json NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"builder_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"team_name" text DEFAULT '' NOT NULL,
	"bot_name" text NOT NULL,
	"weapon_type" text DEFAULT '' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"waiver_ack" boolean DEFAULT false NOT NULL,
	"stripe_session_id" text,
	"stripe_payment_intent_id" text,
	"amount_total" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"paid_at" timestamp,
	CONSTRAINT "registrations_stripe_session_id_unique" UNIQUE("stripe_session_id")
);
--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "registrations_event_id_idx" ON "registrations" USING btree ("event_id");
