// src/server/db/client.ts
/**
 * Raw PostgreSQL client wrapper (bslt-aligned).
 *
 * Mirrors the `RawDb` interface of `@bslt/db` (main/server/db/src/client.ts) so that
 * repositories written against it lift into the bslt monorepo unchanged. The only
 * difference is the underlying driver: this implementation uses `pg` (node-postgres),
 * whereas bslt uses the `postgres` (porsager) driver. Swapping drivers at port time is
 * a change confined to this file.
 *
 * Supports:
 * - Parameterized queries (SQL-injection safe)
 * - Transactions with automatic commit/rollback
 * - Row-Level Security session scoping via `SET LOCAL app.user_id/tenant_id/role`
 */

import { Pool, type PoolClient, type PoolConfig } from 'pg';

/** A prepared query: parameterized text plus positional values. */
export interface QueryResult {
  readonly text: string;
  readonly values: readonly unknown[];
}

/** Optional per-query options (reserved; mirrors bslt's shape). */
export interface QueryOptions {
  timeout?: number;
}

/** Transaction isolation levels. */
export type IsolationLevel =
  | 'read uncommitted'
  | 'read committed'
  | 'repeatable read'
  | 'serializable';

/** Transaction options. */
export interface TransactionOptions {
  isolationLevel?: IsolationLevel;
  readOnly?: boolean;
}

/**
 * Session context for Row-Level Security. When present, queries run inside a
 * transaction that first applies `SET LOCAL app.*`, matching bslt's RLS policies
 * which read `current_setting('app.tenant_id')` etc.
 */
export interface SessionContext {
  userId?: string;
  tenantId?: string;
  role?: string;
}

/** Raw database client interface — identical surface to `@bslt/db`'s `RawDb`. */
export interface RawDb {
  query<T = Record<string, unknown>>(query: QueryResult, options?: QueryOptions): Promise<T[]>;
  queryOne<T = Record<string, unknown>>(
    query: QueryResult,
    options?: QueryOptions,
  ): Promise<T | null>;
  execute(query: QueryResult, options?: QueryOptions): Promise<number>;
  raw<T = Record<string, unknown>>(sql: string, values?: unknown[]): Promise<T[]>;
  transaction<T>(callback: (tx: RawDb) => Promise<T>, options?: TransactionOptions): Promise<T>;
  withSession(session: SessionContext): RawDb;
  healthCheck(): Promise<boolean>;
  close(): Promise<void>;
  getClient(): Pool;
}

/** Escape a controlled string for a SQL literal. Only used for internal RLS session vars. */
const escapeLiteral = (val: string): string => `'${val.replace(/'/g, "''")}'`;

const hasSessionVars = (session?: SessionContext): session is SessionContext =>
  session !== undefined &&
  (session.userId !== undefined || session.tenantId !== undefined || session.role !== undefined);

/** Apply RLS session variables on a dedicated client (already inside a transaction). */
async function applySession(client: PoolClient, session: SessionContext): Promise<void> {
  if (session.userId !== undefined) {
    await client.query(`SET LOCAL app.user_id = ${escapeLiteral(session.userId)}`);
  }
  if (session.tenantId !== undefined) {
    await client.query(`SET LOCAL app.tenant_id = ${escapeLiteral(session.tenantId)}`);
  }
  if (session.role !== undefined) {
    await client.query(`SET LOCAL app.role = ${escapeLiteral(session.role)}`);
  }
}

/**
 * Build a `RawDb` from a pool, an optional bound client (when inside a transaction),
 * and an optional RLS session.
 *
 * - Bound client present  → run directly on it (session already applied at txn start).
 * - Session present, no bound client → wrap each call in its own transaction + SET LOCAL.
 * - Neither → run directly on the pool.
 */
function makeDb(pool: Pool, boundClient?: PoolClient, session?: SessionContext): RawDb {
  const scoped = hasSessionVars(session);

  async function runRows<T>(text: string, values: readonly unknown[]): Promise<{ rows: T[]; count: number }> {
    if (boundClient) {
      const res = await boundClient.query(text, values as unknown[]);
      return { rows: res.rows as T[], count: res.rowCount ?? 0 };
    }
    if (scoped) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await applySession(client, session);
        const res = await client.query(text, values as unknown[]);
        await client.query('COMMIT');
        return { rows: res.rows as T[], count: res.rowCount ?? 0 };
      } catch (err) {
        await client.query('ROLLBACK').catch(() => undefined);
        throw err;
      } finally {
        client.release();
      }
    }
    const res = await pool.query(text, values as unknown[]);
    return { rows: res.rows as T[], count: res.rowCount ?? 0 };
  }

  return {
    async query<T = Record<string, unknown>>(q: QueryResult): Promise<T[]> {
      return (await runRows<T>(q.text, q.values)).rows;
    },

    async queryOne<T = Record<string, unknown>>(q: QueryResult): Promise<T | null> {
      const { rows } = await runRows<T>(q.text, q.values);
      return rows[0] ?? null;
    },

    async execute(q: QueryResult): Promise<number> {
      return (await runRows(q.text, q.values)).count;
    },

    async raw<T = Record<string, unknown>>(sql: string, values: unknown[] = []): Promise<T[]> {
      return (await runRows<T>(sql, values)).rows;
    },

    async transaction<T>(
      callback: (tx: RawDb) => Promise<T>,
      options?: TransactionOptions,
    ): Promise<T> {
      // Reuse an already-bound client (nested) via savepoint-free re-entry.
      if (boundClient) {
        return callback(makeDb(pool, boundClient, session));
      }
      const client = await pool.connect();
      try {
        const level = options?.isolationLevel;
        await client.query(level ? `BEGIN ISOLATION LEVEL ${level}` : 'BEGIN');
        if (options?.readOnly === true) await client.query('SET TRANSACTION READ ONLY');
        if (scoped) await applySession(client, session);
        const result = await callback(makeDb(pool, client, session));
        await client.query('COMMIT');
        return result;
      } catch (err) {
        await client.query('ROLLBACK').catch(() => undefined);
        throw err;
      } finally {
        client.release();
      }
    },

    withSession(s: SessionContext): RawDb {
      return makeDb(pool, boundClient, { ...session, ...s });
    },

    async healthCheck(): Promise<boolean> {
      try {
        await pool.query('SELECT 1');
        return true;
      } catch {
        return false;
      }
    },

    async close(): Promise<void> {
      await pool.end();
    },

    getClient(): Pool {
      return pool;
    },
  };
}

/** Create a `RawDb` backed by a fresh `pg` pool. */
export function createRawDb(config: PoolConfig): RawDb {
  return makeDb(new Pool(config));
}

/**
 * Create a `RawDb` over an existing pool. Exported for tests exercising the RLS session
 * mechanism without opening a real connection (mirrors bslt's `createDbFromSql`).
 * @internal — use `createRawDb` in application code.
 */
export function createDbFromPool(pool: Pool): RawDb {
  return makeDb(pool);
}
