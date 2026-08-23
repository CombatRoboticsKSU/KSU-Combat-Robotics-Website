import { pgTable, text, integer, boolean, timestamp, json, serial, index } from 'drizzle-orm/pg-core';

// ─── Better Auth tables ───────────────────────────────────────────

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull().default(false),
	image: text('image'),
	role: text('role').default('user'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(() => user.id)
});

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(() => user.id),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});

// ─── Leadership ───────────────────────────────────────────────────

export const leadership = pgTable('leadership', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	image: text('image').notNull().default('/USINGimg/placeholder.png'),
	title: text('title').notNull(),
	stats: json('stats').$type<string[]>().notNull().default([]),
	bio: text('bio').notNull().default(''),
	isCurrent: boolean('is_current').notNull().default(true),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// ─── Bots (club + personal) ──────────────────────────────────────

export const bots = pgTable('bots', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	image: text('image').notNull().default('/USINGimg/placeholder.png'),
	weight: text('weight').notNull(),
	weapon: text('weapon').notNull().default(''),
	status: text('status').notNull().default('Active'),
	type: text('type').notNull().default('club'), // 'club' or 'personal'
	owner: text('owner'), // for personal bots
	description: text('description').default(''), // overview / about text (HTML)
	specs: json('specs').$type<Record<string, string>>().default({}),
	competitions: json('competitions').$type<{
		name: string;
		location: string;
		date: string;
		fights: number;
		wins: number;
		losses: number;
		kos: number;
		kod: number;
		outcome?: string;
	}[]>().default([]),
	team: json('team').$type<{
		role: string;
		name: string;
		history?: string[];
	}[]>().default([]),
	galleryImages: json('gallery_images').$type<string[]>().default([]),
	videos: json('videos').$type<{ src: string; poster?: string }[]>().default([]),
	youtubeLinks: json('youtube_links').$type<{ url: string; label?: string }[]>().default([]),
	mediaCoverage: json('media_coverage').$type<{ text: string; link: string }[]>().default([]),
	tagline: text('tagline').notNull().default(''),
	isFeatured: boolean('is_featured').notNull().default(false),
	backLink: text('back_link').default('/wiki'),
	backLabel: text('back_label').default('Back to Wiki'),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// ─── Projects ─────────────────────────────────────────────────────

export const projects = pgTable('projects', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	icon: text('icon').notNull().default(''),
	image: text('image').notNull().default('/USINGimg/placeholder.png'),
	description: text('description').notNull().default(''),
	about: text('about').notNull().default(''), // rich text / HTML for the about section
	specs: json('specs').$type<Record<string, string>>().default({}),
	team: json('team').$type<{
		role: string;
		name: string;
		history?: string[];
	}[]>().default([]),
	galleryImages: json('gallery_images').$type<string[]>().default([]),
	videos: json('videos').$type<{ src: string; poster?: string }[]>().default([]),
	youtubeLinks: json('youtube_links').$type<{ url: string; label?: string }[]>().default([]),
	mediaCoverage: json('media_coverage').$type<{ text: string; link: string }[]>().default([]),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// ─── Blog / Updates ───────────────────────────────────────────────

export const posts = pgTable('posts', {
	id: serial('id').primaryKey(),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	date: text('date').notNull(),
	tags: json('tags').$type<string[]>().notNull().default([]),
	excerpt: text('excerpt').notNull().default(''),
	image: text('image').notNull().default(''),
	content: text('content').notNull().default(''), // full post body (markdown/html)
	galleryImages: json('gallery_images').$type<string[]>().default([]),
	videos: json('videos').$type<{ src: string; poster?: string }[]>().default([]),
	youtubeLinks: json('youtube_links').$type<{ url: string; label?: string }[]>().default([]),
	mediaCoverage: json('media_coverage').$type<{ text: string; link: string }[]>().default([]),
	published: boolean('published').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// ─── Sponsors ────────────────────────────────────────────────────

export const sponsors = pgTable('sponsors', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	image: text('image').notNull().default(''),
	link: text('link').notNull().default(''),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// ─── Donations ────────────────────────────────────────────────────

export const donations = pgTable('donations', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// ─── Social Links ─────────────────────────────────────────────────

export const socialLinks = pgTable('social_links', {
	id: serial('id').primaryKey(),
	label: text('label').notNull(),
	url: text('url').notNull(),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// ─── Site Settings (key-value) ───────────────────────────────────

export const siteSettings = pgTable('site_settings', {
	key: text('key').primaryKey(),
	value: text('value').notNull().default('')
});

// ─── Publicity / News Coverage ───────────────────────────────────

export const publicity = pgTable('publicity', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	link: text('link').notNull(),
	date: text('date').notNull(),
	image: text('image').notNull().default(''),
	summary: text('summary').notNull().default(''),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// ─── Events ───────────────────────────────────────────────────────

export const events = pgTable('events', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	tagline: text('tagline').notNull().default(''),
	image: text('image').notNull().default('/USINGimg/placeholder.png'),
	weightClass: text('weight_class').notNull().default(''),
	eventDate: text('event_date').notNull().default(''),
	sortDate: timestamp('sort_date').notNull().defaultNow(),
	doorsTime: text('doors_time').notNull().default(''),
	location: text('location').notNull().default(''),
	address: text('address').notNull().default(''),
	// 'upcoming' | 'past'. Registration gating is registrationOpen, not this.
	status: text('status').notNull().default('upcoming'),
	overview: text('overview').notNull().default(''),
	rulesPdfUrl: text('rules_pdf_url').notNull().default(''),
	rulesLabel: text('rules_label').notNull().default('Download Rules (PDF)'),
	registrationOpen: boolean('registration_open').notNull().default(false),
	competitorPriceId: text('competitor_price_id').notNull().default(''),
	competitorLabel: text('competitor_label').notNull().default('Register to Compete'),
	competitorPrice: text('competitor_price').notNull().default(''),
	competitorNote: text('competitor_note').notNull().default(''),
	capacity: integer('capacity').notNull().default(0), // 0 means unlimited
	spectatorUrl: text('spectator_url').notNull().default(''),
	spectatorLabel: text('spectator_label').notNull().default('Buy Spectator Tickets'),
	spectatorPrice: text('spectator_price').notNull().default(''),
	spectatorNote: text('spectator_note').notNull().default(''),
	schedule: json('schedule').$type<{ time: string; label: string }[]>().notNull().default([]),
	faq: json('faq').$type<{ question: string; answer: string }[]>().notNull().default([]),
	published: boolean('published').notNull().default(false),
	sortOrder: integer('sort_order').notNull().default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// ─── Event Registrations ─────────────────────────────────────────

export const registrations = pgTable('registrations', {
	id: serial('id').primaryKey(),
	eventId: integer('event_id').notNull().references(() => events.id),
	// 'pending' | 'paid' | 'expired' | 'refunded'
	status: text('status').notNull().default('pending'),
	builderName: text('builder_name').notNull(),
	email: text('email').notNull(),
	phone: text('phone').notNull().default(''),
	teamName: text('team_name').notNull().default(''),
	botName: text('bot_name').notNull(),
	weaponType: text('weapon_type').notNull().default(''),
	notes: text('notes').notNull().default(''),
	waiverAck: boolean('waiver_ack').notNull().default(false),
	stripeSessionId: text('stripe_session_id').unique(),
	stripePaymentIntentId: text('stripe_payment_intent_id'),
	amountTotal: integer('amount_total'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	paidAt: timestamp('paid_at')
}, (table) => [
	index('registrations_event_id_idx').on(table.eventId)
]);
