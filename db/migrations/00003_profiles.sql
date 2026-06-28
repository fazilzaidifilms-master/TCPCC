-- Migration 00003: client_profiles and designer_profiles
-- Identity is ISOLATED in separate tables so neither side can be reached
-- via a join on the shared users table. This is what makes RLS anonymity work.
-- ON DELETE RESTRICT: deleting a user is blocked if profile rows exist.
-- Soft-delete via users.deleted_at instead.

CREATE TABLE client_profiles (
  id          TEXT        PRIMARY KEY,           -- nanoid
  user_id     TEXT        NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
  display_name TEXT,
  company     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE designer_profiles (
  id          TEXT        PRIMARY KEY,           -- nanoid
  user_id     TEXT        NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
  -- display_name intentionally omitted — designers are anonymous to clients
  tier        SMALLINT    NOT NULL DEFAULT 1 CHECK (tier BETWEEN 1 AND 3),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
