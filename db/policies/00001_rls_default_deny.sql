-- RLS Policy: DEFAULT DENY
-- Enables RLS on every table with NO allow policies.
-- Result: any role that does not have an explicit allow policy (including 'anon')
-- sees ZERO rows — the system fails closed, not open.
-- Per-role allow policies are added next slice with the Clerk JWT bridge.

ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE designer_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders             ENABLE ROW LEVEL SECURITY;

-- Explicit FORCE RLS so table owners (postgres role) also go through RLS
-- unless they bypass it intentionally with service-role.
ALTER TABLE users              FORCE ROW LEVEL SECURITY;
ALTER TABLE client_profiles    FORCE ROW LEVEL SECURITY;
ALTER TABLE designer_profiles  FORCE ROW LEVEL SECURITY;
ALTER TABLE orders             FORCE ROW LEVEL SECURITY;

-- No CREATE POLICY statements here — absence of policies = deny all.
-- This comment is the documentation: if you see no policies, that is intentional.
