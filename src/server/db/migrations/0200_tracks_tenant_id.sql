-- 0200_tracks_tenant_id.sql
--
-- Make the track catalog tenant-scoped: add `tenant_id` to every meekah.* table, backfill
-- existing rows to the seed "Blendtune" creator tenant, enforce NOT NULL, and index it.
-- This is the column RLS policies (Phase 3, 0900_rls.sql) will filter on.
--
-- Fails fast if the seed tenant is absent (see 0101). Uses a loop over the eight catalog
-- tables since the change is identical for each.
--
-- Depends on: 0101_seed_tenants.sql

DO $$
DECLARE
    seed_id UUID;
    tbl TEXT;
    tables TEXT[] := ARRAY[
        'track_arrangement', 'track_creator', 'track_exclusive', 'track_file',
        'track_info', 'track_instruments', 'track_release', 'track_sample'
    ];
BEGIN
    SELECT id INTO seed_id FROM tenants WHERE slug = 'blendtune';
    IF seed_id IS NULL THEN
        RAISE EXCEPTION
            'Seed tenant "blendtune" missing — run 0101_seed_tenants with at least one user present.';
    END IF;

    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format(
            'ALTER TABLE meekah.%I ADD COLUMN IF NOT EXISTS tenant_id UUID '
            'REFERENCES tenants(id) ON DELETE CASCADE', tbl);
        EXECUTE format(
            'UPDATE meekah.%I SET tenant_id = %L WHERE tenant_id IS NULL', tbl, seed_id);
        EXECUTE format(
            'ALTER TABLE meekah.%I ALTER COLUMN tenant_id SET NOT NULL', tbl);
        EXECUTE format(
            'CREATE INDEX IF NOT EXISTS idx_%s_tenant ON meekah.%I(tenant_id)', tbl, tbl);
    END LOOP;
END $$;
