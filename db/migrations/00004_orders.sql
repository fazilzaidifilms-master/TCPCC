-- Migration 00004: orders table
-- All money in INTEGER MINOR UNITS (cents/paise). Never floats.
-- ON DELETE RESTRICT everywhere — no cascade that silently destroys audit trail.

CREATE TABLE orders (
  id                   TEXT          PRIMARY KEY,     -- nanoid (opaque)
  client_id            TEXT          NOT NULL REFERENCES client_profiles(id)  ON DELETE RESTRICT,
  designer_id          TEXT                   REFERENCES designer_profiles(id) ON DELETE RESTRICT,
  product_type         TEXT          NOT NULL,
  status               order_status  NOT NULL DEFAULT 'DRAFT',

  -- Money: all INTEGER, all minor units (e.g. cents), all non-negative
  currency             TEXT          NOT NULL DEFAULT 'USD',
  price_total          INTEGER       NOT NULL DEFAULT 0 CHECK (price_total          >= 0),
  designer_payout      INTEGER       NOT NULL DEFAULT 0 CHECK (designer_payout      >= 0),
  qc_payout            INTEGER       NOT NULL DEFAULT 0 CHECK (qc_payout            >= 0),
  platform_commission  INTEGER       NOT NULL DEFAULT 0 CHECK (platform_commission  >= 0),

  deadline_at          TIMESTAMPTZ,
  current_version_id   TEXT,                          -- nullable FK added later when files table exists
  org_id               TEXT,                          -- nullable, reserved for multi-tenancy

  created_at           TIMESTAMPTZ   NOT NULL DEFAULT now(),
  deleted_at           TIMESTAMPTZ                    -- soft-delete
);

CREATE INDEX idx_orders_client_id   ON orders(client_id);
CREATE INDEX idx_orders_designer_id ON orders(designer_id);
CREATE INDEX idx_orders_status      ON orders(status);
