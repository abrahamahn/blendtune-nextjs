-- 0900_rls.sql
-- Row-Level Security for the tenant-scoped track catalog (creator-marketplace model).
--
-- Model: the marketplace is PUBLIC-READ (buyers browse every tenant's tracks), while writes
-- are tenant-scoped (a creator may only mutate their own catalog). So each meekah.* table gets
-- an open SELECT policy plus a tenant-scoped write policy keyed on current_setting('app.tenant_id')
-- — the GUC set by RawDb.withSession(). Mirrors bslt's role/policy shape (authenticated + app.*).
--
-- RLS is intentionally NOT enabled on tenants/memberships yet: getRequestContext resolves a
-- workspace by slug BEFORE membership is known, which a tenant-scoped SELECT policy would block.
-- That hardening lands with the creator surface (Phase 5), matching bslt's 0901 trust boundary.
--
-- Enforcement requires a NON-superuser login role that is a member of `authenticated` (superusers
-- and table owners bypass RLS). See the app-role bootstrap in docs/dev/db-consolidation-runbook.md.
--
-- Depends on: 0200_tracks_tenant_id.sql

-- ----------------------------------------------------------------------------
-- Policy target role + privileges
-- ----------------------------------------------------------------------------

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated NOLOGIN;
    END IF;
END $$;

GRANT USAGE ON SCHEMA auth, users, meekah, public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA auth, users, meekah, public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA auth, users, meekah, public TO authenticated;

-- Future tables/sequences created by later migrations (run as the owner) stay accessible.
ALTER DEFAULT PRIVILEGES IN SCHEMA auth, users, meekah, public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth, users, meekah, public
    GRANT USAGE, SELECT ON SEQUENCES TO authenticated;

-- ----------------------------------------------------------------------------
-- Enable RLS + policies on every catalog table
-- ----------------------------------------------------------------------------

DO $$
DECLARE
    tbl TEXT;
    tables TEXT[] := ARRAY[
        'track_arrangement', 'track_creator', 'track_exclusive', 'track_file',
        'track_info', 'track_instruments', 'track_release', 'track_sample'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format('ALTER TABLE meekah.%I ENABLE ROW LEVEL SECURITY', tbl);
        EXECUTE format('ALTER TABLE meekah.%I FORCE ROW LEVEL SECURITY', tbl);

        -- Public marketplace read: any authenticated connection may read any track.
        EXECUTE format(
            'CREATE POLICY %s_public_read ON meekah.%I FOR SELECT TO authenticated USING (true)',
            tbl, tbl);

        -- Tenant-scoped writes: only rows of the active workspace (app.tenant_id) may be
        -- inserted/updated/deleted. With no app.tenant_id set, writes match nothing.
        EXECUTE format(
            'CREATE POLICY %s_tenant_write ON meekah.%I FOR ALL TO authenticated '
            'USING (tenant_id = current_setting(''app.tenant_id'', true)::uuid) '
            'WITH CHECK (tenant_id = current_setting(''app.tenant_id'', true)::uuid)',
            tbl, tbl);
    END LOOP;
END $$;
