// src/server/db/index.ts

// Consolidated, bslt-aligned data access (target API — use this for new code).
export { db, createDbClient, resolveDbConfig } from './connection';
export { createRawDb } from './client';
export type {
  RawDb,
  QueryResult,
  QueryOptions,
  SessionContext,
  TransactionOptions,
  IsolationLevel,
} from './client';

// Legacy per-database pools (back-compat during the multi-tenancy migration).
// These are retained so existing routes keep working until each is ported to `db`.
// See docs/dev/multi-tenancy-plan.md — removed at the end of Phase 2.
export { default as authPool } from './auth';
export { default as tracksPool } from './tracks';
