// src/server/db/connection.ts
/**
 * Consolidated database connection (bslt-aligned).
 *
 * Blendtune historically split data across two databases (PG_*_DB_TRACKS and
 * PG_*_DB_USERS). The multi-tenancy plan (docs/dev/multi-tenancy-plan.md) consolidates
 * them into ONE database so that foreign keys and Row-Level Security can span the
 * `auth`, `users`, and `meekah` schemas — matching bslt's single-database model.
 *
 * This module resolves a single `DbConfig` and exposes an HMR-safe singleton `RawDb`,
 * mirroring `createDbClient` in `@bslt/db`.
 */

import { createRawDb, type DbConfig, type RawDb } from './client';

const isProd = (): boolean => process.env.NODE_ENV === 'production';

/**
 * Resolve the connection config for the single consolidated database.
 *
 * Precedence:
 * 1. `DATABASE_URL` (bslt-parity; used verbatim).
 * 2. Discrete `PG_*` vars. The consolidated database name comes from
 *    `PG_{CLOUD,LOCAL}_DB`, falling back to the legacy `PG_{CLOUD,LOCAL}_DB_USERS`
 *    (meekah is migrated INTO the users database — see the consolidation runbook).
 */
export function resolveDbConfig(
  env: Record<string, string | undefined> = process.env,
): DbConfig {
  if (env.DATABASE_URL) {
    return { url: env.DATABASE_URL };
  }

  const cloud = env.NODE_ENV === 'production';
  const pick = (cloudKey: string, localKey: string): string =>
    (cloud ? env[cloudKey] : env[localKey]) ?? '';

  const database =
    pick('PG_CLOUD_DB', 'PG_LOCAL_DB') ||
    pick('PG_CLOUD_DB_USERS', 'PG_LOCAL_DB_USERS');

  return {
    user: pick('PG_CLOUD_USER', 'PG_LOCAL_USER'),
    host: pick('PG_CLOUD_HOST', 'PG_LOCAL_HOST'),
    database,
    password: pick('PG_CLOUD_PW', 'PG_LOCAL_PW'),
    port: parseInt(pick('CLOUD_PORT', 'LOCAL_PORT') || '5432', 10),
  };
}

type GlobalWithDb = typeof globalThis & { __blendtuneDb?: RawDb };

/**
 * Create the consolidated `RawDb` client. Memoized on `globalThis` in development so
 * Next.js HMR does not exhaust connections (mirrors bslt's `createDbClient`).
 */
export function createDbClient(config: DbConfig = resolveDbConfig()): RawDb {
  if (!isProd()) {
    const g = globalThis as GlobalWithDb;
    g.__blendtuneDb ??= createRawDb(config);
    return g.__blendtuneDb;
  }
  return createRawDb(config);
}

/** The shared consolidated database client. */
export const db: RawDb = createDbClient();
