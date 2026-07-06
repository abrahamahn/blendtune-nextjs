-- 0101_seed_tenants.sql
--
-- Backfill tenancy for existing data so nothing 404s after Phase 1:
--   1. A single "Blendtune" creator tenant that will own the existing track catalog.
--   2. A personal tenant + owner membership for every existing user (bslt convention:
--      see main/server/core/src/auth/personal-tenant.ts).
--
-- Idempotent via ON CONFLICT so a re-run is a no-op. The Blendtune tenant is owned by the
-- earliest-created user; if the database has no users yet, no seed tenant is created and
-- 0200 will fail fast with a clear message (add a user, then re-run).
--
-- Depends on: 0100_tenants.sql

-- ----------------------------------------------------------------------------
-- 1. Seed "Blendtune" creator tenant (owner = earliest user)
-- ----------------------------------------------------------------------------

INSERT INTO tenants (name, slug, owner_id)
SELECT 'Blendtune', 'blendtune', u.uuid
FROM auth.users u
ORDER BY u.created_at ASC NULLS LAST
LIMIT 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO memberships (tenant_id, user_id, role)
SELECT t.id, t.owner_id, 'owner'
FROM tenants t
WHERE t.slug = 'blendtune'
ON CONFLICT (tenant_id, user_id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. Personal tenant per existing user (slug = "u-<uuid>")
-- ----------------------------------------------------------------------------

INSERT INTO tenants (name, slug, owner_id)
SELECT
    COALESCE(NULLIF(u.username, ''), 'user'),
    'u-' || u.uuid::text,
    u.uuid
FROM auth.users u
ON CONFLICT (slug) DO NOTHING;

INSERT INTO memberships (tenant_id, user_id, role)
SELECT t.id, u.uuid, 'owner'
FROM auth.users u
JOIN tenants t ON t.slug = 'u-' || u.uuid::text
ON CONFLICT (tenant_id, user_id) DO NOTHING;
