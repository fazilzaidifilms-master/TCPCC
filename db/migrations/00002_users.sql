-- Migration 00002: users table
-- id is a text nanoid — never a sequential integer.
-- Identity is intentionally thin here; it lives in client_profiles /
-- designer_profiles so RLS can isolate it per role.

CREATE TABLE users (
  id          TEXT        PRIMARY KEY,           -- nanoid, set by application
  clerk_id    TEXT        NOT NULL UNIQUE,       -- Clerk user ID
  role        user_role   NOT NULL DEFAULT 'CLIENT',
  status      user_status NOT NULL DEFAULT 'PENDING',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at  TIMESTAMPTZ                        -- soft-delete
);

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_role     ON users(role);
