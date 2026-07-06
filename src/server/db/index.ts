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

// Repositories (bslt-aligned data access over RawDb).
export { createRepositories, type Repositories } from './repositories';
