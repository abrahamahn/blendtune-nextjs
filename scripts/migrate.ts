// scripts/migrate.ts
/**
 * Blendtune database migration CLI.
 *
 * Applies the numbered `.sql` files in `main/server/db/src/migrations/` against the
 * consolidated database resolved from the environment. Mirrors bslt's migration flow.
 *
 * Usage:
 *   pnpm db:migrate            # apply pending migrations
 *   pnpm db:migrate --dry-run  # list pending migrations without applying
 */

// Load env the same way the app does (main/shared/src/config/.env.<NODE_ENV>), BEFORE the db
// singleton is constructed on import of ../main/server/db/src/connection.
import '../main/shared/src/config/loadEnv';
import path from 'path';

import { db } from '../main/server/db/src/connection';
import { runSqlMigrations } from '../main/server/db/src/migrate';

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'main/server/db/src/migrations');

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');

  const healthy = await db.healthCheck();
  if (!healthy) {
    console.error('✗ Cannot reach the database. Check your PG_* / DATABASE_URL env vars.');
    process.exitCode = 1;
    return;
  }

  if (dryRun) {
    console.log('Dry run — no migrations will be applied.');
    console.log(`Migration directory: ${MIGRATIONS_DIR}`);
    return;
  }

  const result = await runSqlMigrations({ db, migrationsDir: MIGRATIONS_DIR });
  console.log(`Done. Applied: ${result.applied.length}, skipped: ${result.skipped.length}.`);
}

main()
  .catch((err: unknown) => {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  })
  .finally(() => {
    void db.close();
  });
