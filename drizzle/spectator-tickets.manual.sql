CREATE TABLE IF NOT EXISTS spectator_orders (
    id serial PRIMARY KEY,
    event_id integer NOT NULL REFERENCES events(id),
    stripe_session_id text NOT NULL UNIQUE,
    stripe_payment_intent_id text,
    buyer_name text NOT NULL DEFAULT '',
    email text NOT NULL DEFAULT '',
    quantity integer NOT NULL CHECK (quantity > 0),
    amount_total integer NOT NULL CHECK (amount_total >= 0),
    currency text NOT NULL,
    status text NOT NULL DEFAULT 'confirmed',
    created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS spectator_orders_event_idx ON spectator_orders(event_id);
CREATE INDEX IF NOT EXISTS spectator_orders_payment_idx ON spectator_orders(stripe_payment_intent_id);
CREATE TABLE IF NOT EXISTS spectator_tickets (
    id serial PRIMARY KEY,
    order_id integer NOT NULL REFERENCES spectator_orders(id),
    ordinal integer NOT NULL CHECK (ordinal > 0),
    token text NOT NULL UNIQUE,
    checked_in_at timestamp,
    checked_in_by text
);
CREATE UNIQUE INDEX IF NOT EXISTS spectator_tickets_order_ordinal_idx ON spectator_tickets(order_id, ordinal);
