CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bots" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"image" text DEFAULT '/USINGimg/placeholder.png' NOT NULL,
	"weight" text NOT NULL,
	"weapon" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'Active' NOT NULL,
	"type" text DEFAULT 'club' NOT NULL,
	"owner" text,
	"description" text DEFAULT '',
	"specs" json DEFAULT '{}'::json,
	"competitions" json DEFAULT '[]'::json,
	"team" json DEFAULT '[]'::json,
	"gallery_images" json DEFAULT '[]'::json,
	"videos" json DEFAULT '[]'::json,
	"youtube_links" json DEFAULT '[]'::json,
	"media_coverage" json DEFAULT '[]'::json,
	"tagline" text DEFAULT '' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"back_link" text DEFAULT '/wiki',
	"back_label" text DEFAULT 'Back to Wiki',
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bots_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "leadership" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text DEFAULT '/USINGimg/placeholder.png' NOT NULL,
	"title" text NOT NULL,
	"stats" json DEFAULT '[]'::json NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"is_current" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"date" text NOT NULL,
	"tags" json DEFAULT '[]'::json NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"gallery_images" json DEFAULT '[]'::json,
	"videos" json DEFAULT '[]'::json,
	"youtube_links" json DEFAULT '[]'::json,
	"media_coverage" json DEFAULT '[]'::json,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"icon" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '/USINGimg/placeholder.png' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"about" text DEFAULT '' NOT NULL,
	"specs" json DEFAULT '{}'::json,
	"team" json DEFAULT '[]'::json,
	"gallery_images" json DEFAULT '[]'::json,
	"videos" json DEFAULT '[]'::json,
	"youtube_links" json DEFAULT '[]'::json,
	"media_coverage" json DEFAULT '[]'::json,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "publicity" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"link" text NOT NULL,
	"date" text NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
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
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sponsors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"link" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'user',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "registrations_event_id_idx" ON "registrations" USING btree ("event_id");