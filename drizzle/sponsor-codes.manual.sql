CREATE TABLE IF NOT EXISTS sponsor_codes (
	id serial PRIMARY KEY,
	event_id integer NOT NULL REFERENCES events(id),
	sponsor_name text NOT NULL,
	tickets integer NOT NULL,
	code text NOT NULL,
	stripe_coupon_id text NOT NULL,
	stripe_promotion_code_id text NOT NULL UNIQUE,
	active boolean NOT NULL DEFAULT true,
	created_at timestamp DEFAULT now()
);
