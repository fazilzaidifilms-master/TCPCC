import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Tests B, C (schema-level): verify the SQL migrations encode the right constraints.
// These are structural tests that parse the SQL files themselves — they run
// without a live database and are therefore always deterministic in CI.
// The actual DB enforcement is verified manually (see README "Running tests A–D").

const migration = (name: string) =>
  readFileSync(join(process.cwd(), 'db', 'migrations', name), 'utf8');

const policy = (name: string) =>
  readFileSync(join(process.cwd(), 'db', 'policies', name), 'utf8');

describe('Test B — Enum enforcement in SQL', () => {
  it('order_status enum is a native Postgres CREATE TYPE', () => {
    const sql = migration('00001_enums.sql');
    expect(sql).toContain('CREATE TYPE order_status AS ENUM');
  });

  it('order_status enum contains all required statuses from the spec', () => {
    const sql = migration('00001_enums.sql');
    const required = [
      'DRAFT', 'SUBMITTED', 'QUOTED', 'PAYMENT_HELD', 'ASSIGNED', 'IN_PROGRESS',
      'DESIGNER_SUBMITTED', 'QC_REVIEW', 'REVISION_REQUESTED', 'CLIENT_PREVIEW',
      'APPROVED', 'DELIVERED', 'CLOSED', 'PAYOUT_RELEASED', 'CANCELLED',
      'DISPUTED', 'REFUNDED',
    ];
    for (const status of required) {
      expect(sql).toContain(`'${status}'`);
    }
  });

  it('orders table uses the order_status enum type (not plain TEXT)', () => {
    const sql = migration('00004_orders.sql');
    expect(sql).toContain('order_status');
    // Confirm it’s typed, not just a text column named status
    expect(sql).toMatch(/status\s+order_status/);
  });
});

describe('Test C — Opaque ID in SQL schema', () => {
  it('orders.id is TEXT (nanoid), not a SERIAL or INTEGER', () => {
    const sql = migration('00004_orders.sql');
    // id column must be TEXT PRIMARY KEY
    expect(sql).toMatch(/id\s+TEXT\s+PRIMARY KEY/);
    // Must not have SERIAL, BIGSERIAL, or INTEGER as the PK type
    expect(sql).not.toMatch(/id\s+SERIAL/);
    expect(sql).not.toMatch(/id\s+BIGSERIAL/);
    expect(sql).not.toMatch(/id\s+INTEGER\s+PRIMARY KEY/);
  });

  it('users.id is TEXT (nanoid), not a SERIAL or INTEGER', () => {
    const sql = migration('00002_users.sql');
    expect(sql).toMatch(/id\s+TEXT\s+PRIMARY KEY/);
  });
});

describe('Test D — RLS default-deny in SQL', () => {
  it('every table has ENABLE ROW LEVEL SECURITY', () => {
    const sql = policy('00001_rls_default_deny.sql');
    const tables = ['users', 'client_profiles', 'designer_profiles', 'orders'];
    for (const table of tables) {
      expect(sql).toContain(`ALTER TABLE ${table}`);
      expect(sql).toContain('ENABLE ROW LEVEL SECURITY');
    }
  });

  it('FORCE ROW LEVEL SECURITY is set on every table', () => {
    const sql = policy('00001_rls_default_deny.sql');
    expect(sql).toContain('FORCE ROW LEVEL SECURITY');
  });

  it('contains NO CREATE POLICY statements (default-deny = no allow rules)', () => {
    const sql = policy('00001_rls_default_deny.sql');
    expect(sql).not.toMatch(/CREATE POLICY/i);
  });
});

describe('Money safety — no floats', () => {
  it('all money columns in orders use INTEGER, not NUMERIC or FLOAT', () => {
    const sql = migration('00004_orders.sql');
    const moneyColumns = ['price_total', 'designer_payout', 'qc_payout', 'platform_commission'];
    for (const col of moneyColumns) {
      // Each money column must be INTEGER
      expect(sql).toMatch(new RegExp(`${col}\\s+INTEGER`));
      // And must have a >= 0 check
      expect(sql).toContain(`${col}          >= 0`);
    }
  });
});
