// src/server/db/migrate/runner.ts
/**
 * SQL migration runner (bslt-aligned).
 *
 * A faithful port of `@bslt/db`'s runner (main/server/db/src/migrations.ts): numbered
 * `.sql` files applied in lexical order, each inside a transaction, tracked in a
 * `migrations` table. No ORM, no external migration dependency — so these files lift
 * directly into `main/server/db/migrations/` at port time.
 */

import fs from 'fs/promises';
import path from 'path';

import type { RawDb } from '../client';

export interface MigrationLogger {
  log(message?: unknown, ...optionalParams: unknown[]): void;
}

export interface MigrationRunResult {
  applied: string[];
  skipped: string[];
}

export interface RunSqlMigrationsOptions {
  db: RawDb;
  migrationsDir: string;
  logger?: MigrationLogger;
}

export async function runSqlMigrations({
  db,
  migrationsDir,
  logger = console,
}: RunSqlMigrationsOptions): Promise<MigrationRunResult> {
  logger.log('Starting database migrations...');
  logger.log(`Migration directory: ${migrationsDir}`);

  await db.raw(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const files = await fs.readdir(migrationsDir);
  const sqlFiles = files.filter((f) => f.endsWith('.sql')).sort();

  const appliedRows = await db.query<{ name: string }>({
    text: 'SELECT name FROM migrations',
    values: [],
  });
  const appliedNames = new Set(appliedRows.map((m) => m.name));

  const applied: string[] = [];
  const skipped: string[] = [];

  for (const file of sqlFiles) {
    if (appliedNames.has(file)) {
      skipped.push(file);
      continue;
    }

    logger.log(`  Applying migration: ${file}`);
    const sqlContent = await fs.readFile(path.join(migrationsDir, file), 'utf-8');

    await db.transaction(async (tx) => {
      await tx.raw(sqlContent);
      await tx.execute({ text: 'INSERT INTO migrations (name) VALUES ($1)', values: [file] });
    });

    logger.log(`  Applied: ${file}`);
    applied.push(file);
  }

  logger.log(
    applied.length === 0
      ? 'All migrations already applied.'
      : `\nApplied ${String(applied.length)} migration(s) successfully.`,
  );

  return { applied, skipped };
}
