// scripts/db-status.ts
/**
 * Read-only database status probe for the multi-tenancy migration.
 *
 * Reports which migrations have applied, which schemas exist, whether the track catalog was
 * consolidated + made tenant-scoped, and the tenant/user counts. Makes no changes.
 *
 * Usage: pnpm db:status
 */

// Load env the same way the app does, BEFORE the db singleton is constructed on import.
import '../src/shared/config/loadEnv';

import { db, resolveDbConfig } from '../src/server/db/connection';

async function main(): Promise<void> {
  const cfg = resolveDbConfig();
  const target =
    'connectionString' in cfg
      ? String(cfg.connectionString).replace(/:[^:@/]*@/, ':***@')
      : `${cfg.user ?? '?'}@${cfg.host ?? '?'}:${cfg.port ?? '?'}/${cfg.database ?? '?'}`;
  console.log(`Target DB: ${target}\n`);

  if (!(await db.healthCheck())) {
    console.error('✗ Cannot reach the database.');
    process.exitCode = 1;
    return;
  }

  const q = async (text: string, values: unknown[] = []) =>
    db.query<Record<string, unknown>>({ text, values });

  const migrationsExist = await q(
    `SELECT to_regclass('public.migrations') IS NOT NULL AS present`,
  );
  if (migrationsExist[0]?.present) {
    const applied = await q('SELECT name FROM migrations ORDER BY name');
    console.log('Applied migrations:', applied.map((r) => r.name).join(', ') || '(none)');
  } else {
    console.log('Applied migrations: (no migrations table — db:migrate never ran)');
  }

  const schemas = await q(
    `SELECT nspname FROM pg_namespace WHERE nspname IN ('auth','users','meekah') ORDER BY nspname`,
  );
  console.log('Schemas present:', schemas.map((r) => r.nspname).join(', ') || '(none)');

  const trackInfo = await q(`SELECT to_regclass('meekah.track_info') IS NOT NULL AS present`);
  const hasTrackInfo = Boolean(trackInfo[0]?.present);
  console.log('meekah.track_info exists:', hasTrackInfo);

  if (hasTrackInfo) {
    const rowCount = await q('SELECT count(*)::int AS n FROM meekah.track_info');
    console.log('  track_info rows:', rowCount[0]?.n);
    const hasTenant = await q(
      `SELECT EXISTS (
         SELECT 1 FROM information_schema.columns
         WHERE table_schema='meekah' AND table_name='track_info' AND column_name='tenant_id'
       ) AS present`,
    );
    console.log('  track_info.tenant_id column:', Boolean(hasTenant[0]?.present));
  }

  const tenantsExist = await q(`SELECT to_regclass('public.tenants') IS NOT NULL AS present`);
  if (tenantsExist[0]?.present) {
    const counts = await q(
      `SELECT
         (SELECT count(*)::int FROM tenants)     AS tenants,
         (SELECT count(*)::int FROM memberships) AS memberships`,
    );
    console.log('Tenants:', counts[0]?.tenants, '| Memberships:', counts[0]?.memberships);
  } else {
    console.log('Tenants table: (not created)');
  }

  const users = await q(`SELECT to_regclass('auth.users') IS NOT NULL AS present`);
  if (users[0]?.present) {
    const n = await q('SELECT count(*)::int AS n FROM auth.users');
    console.log('auth.users rows:', n[0]?.n);
  }
}

main()
  .catch((err: unknown) => {
    console.error('Status probe failed:', err);
    process.exitCode = 1;
  })
  .finally(() => {
    void db.close();
  });
