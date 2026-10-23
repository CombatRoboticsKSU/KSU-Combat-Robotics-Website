-- Additive migration, safe to apply before deploying registration editing.
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_edit_deadline text NOT NULL DEFAULT '';
CREATE TABLE IF NOT EXISTS registration_access (
  token_hash text PRIMARY KEY,
  event_id integer NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  email text NOT NULL,
  expires_at timestamp NOT NULL,
  session_hash text UNIQUE,
  session_expires_at timestamp,
  used_at timestamp
);
CREATE TABLE IF NOT EXISTS registration_edit_rate_limits (
  key text PRIMARY KEY,
  hits integer NOT NULL,
  resets_at timestamp NOT NULL
);
CREATE TABLE IF NOT EXISTS registration_edit_audit (
  id serial PRIMARY KEY,
  registration_id integer NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  before json NOT NULL,
  after json NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS registration_access_expiry_idx ON registration_access(expires_at);
CREATE INDEX IF NOT EXISTS registration_edit_audit_registration_idx ON registration_edit_audit(registration_id);
