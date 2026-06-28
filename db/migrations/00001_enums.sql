-- Migration 00001: Native Postgres enums
-- These are DB-level constraints — invalid values are rejected by the database,
-- not by application code.

CREATE TYPE user_role AS ENUM (
  'CLIENT',
  'DESIGNER',
  'QC',
  'SALES',
  'OPS',
  'FINANCE',
  'ADMIN',
  'SUPER_ADMIN'
);

CREATE TYPE user_status AS ENUM (
  'PENDING',
  'ACTIVE',
  'SUSPENDED'
);

CREATE TYPE order_status AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'QUOTED',
  'PAYMENT_HELD',
  'ASSIGNED',
  'IN_PROGRESS',
  'DESIGNER_SUBMITTED',
  'QC_REVIEW',
  'REVISION_REQUESTED',
  'CLIENT_PREVIEW',
  'APPROVED',
  'DELIVERED',
  'CLOSED',
  'PAYOUT_RELEASED',
  'CANCELLED',
  'DISPUTED',
  'REFUNDED'
);
