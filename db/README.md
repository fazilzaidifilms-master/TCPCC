# Database Migrations

All schema changes live here as versioned SQL files. **Never use the Supabase dashboard** to change schema or RLS — every change must be a file in this directory so it's reviewable, auditable, and reproducible.

## Apply migrations

```bash
# Requires Supabase CLI and DIRECT_DATABASE_URL in .env
npm run db:migrate
```

## Directory layout

```
db/
  migrations/   — numbered SQL files, applied in order
  policies/     — RLS policy files, applied after tables exist
```

## Order of application

1. `00001_enums.sql`       — native Postgres enums
2. `00002_users.sql`       — users table
3. `00003_profiles.sql`    — client_profiles, designer_profiles
4. `00004_orders.sql`      — orders table
5. `policies/00001_rls_default_deny.sql` — enable RLS, no allow policies yet

## Money rule

All monetary columns are `INTEGER` (minor units — cents). **Never floats.**
