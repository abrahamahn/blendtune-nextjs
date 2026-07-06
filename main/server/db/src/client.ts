// src/server/db/client.ts
/**
 * Raw PostgreSQL client wrapper (bslt-aligned).
 *
 * Mirrors the `RawDb` interface of `@bslt/db` (main/server/db/src/client.ts), backed by
 * the same `postgres` (porsager) driver bslt uses, so repositories written against it
 * lift into the bslt monorepo unchanged.
 *
 * Supports:
 * - Parameterized queries (SQL-injection safe)
 * - Transactions with automatic commit/rollback
 * - Row-Level Security session scoping via `SET LOCAL app.user_id/tenant_id/role`
 *
 * Date parity: `date`/`timestamp` columns are parsed with a port of pg's
 * `postgres-date` algorithm (see `parsePgDate`) so results are byte-identical to the
 * previous node-postgres implementation when serialized (e.g. /api/tracks).
 */

import postgres, { type ParameterOrJSON, type Sql, type TransactionSql } from 'postgres';

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

/** Connection configuration for the consolidated database. */
export interface DbConfig {
  /** Connection URL (used verbatim when set; overrides discrete fields). */
  url?: string;
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
  /** Max connections in the pool (default: 10). */
  max?: number;
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
  getClient(): Sql;
}

// ============================================================================
// pg-compatible date parsing
// ============================================================================

// Port of pg's `postgres-date@1.0.7` parser, applied to `date` (1082),
// `timestamp` (1114) and `timestamptz` (1184) columns. The critical case is
// date-only values ('2018-11-30'), which pg parses as LOCAL-time midnight via
// `new Date(year, month, day)` — under TZ=UTC this serializes to
// '2018-11-30T00:00:00.000Z', preserving the exact pre-migration API output.
const DATE_TIME = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/;
const DATE_ONLY = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/;
const TIME_ZONE = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/;
const INFINITY = /^-?infinity$/;

// 1 BC is year 0 in JS Dates; see https://github.com/bendrucker/postgres-date/issues/5
const bcYearToNegativeYear = (year: number): number => -(year - 1);
const is0To99 = (year: number): boolean => year >= 0 && year < 100;

/** Timezone offset in ms, 0 for UTC, or undefined when no zone is present. */
function timeZoneOffset(isoDate: string): number | undefined {
  if (isoDate.endsWith('+00')) return 0;
  const zone = TIME_ZONE.exec(isoDate.split(' ')[1] ?? '');
  if (!zone) return undefined;
  if (zone[1] === 'Z') return 0;
  const sign = zone[1] === '-' ? -1 : 1;
  const offset =
    parseInt(zone[2] ?? '0', 10) * 3600 +
    parseInt(zone[3] ?? '0', 10) * 60 +
    parseInt(zone[4] ?? '0', 10);
  return offset * sign * 1000;
}

function parseDateOnly(isoDate: string): Date | null {
  const matches = DATE_ONLY.exec(isoDate);
  if (!matches) return null;
  const year = matches[4] ? bcYearToNegativeYear(parseInt(matches[1], 10)) : parseInt(matches[1], 10);
  // YYYY-MM-DD is parsed as LOCAL time, exactly like pg.
  const date = new Date(year, parseInt(matches[2], 10) - 1, parseInt(matches[3], 10));
  if (is0To99(year)) date.setFullYear(year);
  return date;
}

/** Parse a Postgres date/timestamp string exactly as pg (node-postgres) does. */
export function parsePgDate(isoDate: string): Date | number | null {
  if (INFINITY.test(isoDate)) return Number(isoDate.replace('i', 'I'));
  const matches = DATE_TIME.exec(isoDate);
  if (!matches) return parseDateOnly(isoDate);

  const year = matches[8] ? bcYearToNegativeYear(parseInt(matches[1], 10)) : parseInt(matches[1], 10);
  const month = parseInt(matches[2], 10) - 1;
  const day = parseInt(matches[3], 10);
  const hour = parseInt(matches[4], 10);
  const minute = parseInt(matches[5], 10);
  const second = parseInt(matches[6], 10);
  const ms = matches[7] ? 1000 * parseFloat(matches[7]) : 0;

  const offset = timeZoneOffset(isoDate);
  if (offset !== undefined) {
    const date = new Date(Date.UTC(year, month, day, hour, minute, second, ms));
    // Years 0–99 are interpreted as 1900–1999 by Date.UTC; correct them.
    if (is0To99(year)) date.setUTCFullYear(year);
    if (offset !== 0) date.setTime(date.getTime() - offset);
    return date;
  }
  const date = new Date(year, month, day, hour, minute, second, ms);
  if (is0To99(year)) date.setFullYear(year);
  return date;
}

// Custom `date` type: pg-compatible parse; serialize identical to the driver default.
const pgCompatTypes = {
  date: {
    to: 1184,
    from: [1082, 1114, 1184],
    serialize: (x: Date | string | number): string =>
      (x instanceof Date ? x : new Date(x)).toISOString(),
    parse: parsePgDate,
  },
};

// ============================================================================
// Implementation
// ============================================================================

/** Escape a controlled string for a SQL literal. Only used for internal RLS session vars. */
const escapeLiteral = (val: string): string => `'${val.replace(/'/g, "''")}'`;

const hasSessionVars = (session?: SessionContext): session is SessionContext =>
  session !== undefined &&
  (session.userId !== undefined || session.tenantId !== undefined || session.role !== undefined);

// The main Sql instance exposes begin(); a TransactionSql only exposes savepoint().
type PostgresClient = Sql | TransactionSql;

type TxCallback<T> = (tx: TransactionSql) => Promise<T>;
type BeginFn = <T>(first: string | TxCallback<T>, second?: TxCallback<T>) => Promise<T>;

const beginOf = (sql: PostgresClient): BeginFn | undefined => {
  const begin = (sql as { begin?: unknown }).begin;
  return typeof begin === 'function' ? (begin.bind(sql) as BeginFn) : undefined;
};

/** Create a `RawDb` backed by a fresh postgres.js connection pool. */
export function createRawDb(config: DbConfig): RawDb {
  const options = {
    max: config.max ?? 10,
    types: pgCompatTypes,
    ...(config.url === undefined && {
      user: config.user,
      password: config.password,
      host: config.host,
      port: config.port,
      database: config.database,
    }),
  };
  return createDbFromSql(config.url === undefined ? postgres(options) : postgres(config.url, options));
}

/**
 * Build a `RawDb` over an existing postgres.js client (main `Sql` or a `TransactionSql`),
 * optionally scoped to an RLS session. Exported for tests exercising the RLS session
 * mechanism without opening a real connection (mirrors bslt's `createDbFromSql`).
 *
 * - Inside a transaction (`TransactionSql`) → run directly (session applied at txn start).
 * - Session present on the main client → wrap each call in a transaction + `SET LOCAL`.
 * - Neither → run directly on the pool.
 *
 * @internal — use `createRawDb` in application code.
 */
export function createDbFromSql(sql: PostgresClient, session?: SessionContext): RawDb {
  const scoped = hasSessionVars(session);

  const applySession = async (client: PostgresClient): Promise<void> => {
    if (!scoped) return;
    if (session.userId !== undefined) {
      await client.unsafe(`SET LOCAL app.user_id = ${escapeLiteral(session.userId)}`);
    }
    if (session.tenantId !== undefined) {
      await client.unsafe(`SET LOCAL app.tenant_id = ${escapeLiteral(session.tenantId)}`);
    }
    if (session.role !== undefined) {
      await client.unsafe(`SET LOCAL app.role = ${escapeLiteral(session.role)}`);
    }
  };

  const run = async (text: string, values: readonly unknown[]): Promise<postgres.RowList<postgres.Row[]>> => {
    const params = [...values] as ParameterOrJSON<never>[];
    const begin = scoped ? beginOf(sql) : undefined;
    if (begin) {
      // Wrap in a transaction so SET LOCAL RLS variables are connection-isolated and reset.
      return begin(async (tx) => {
        await applySession(tx);
        return await tx.unsafe(text, params);
      });
    }
    if (scoped) await applySession(sql); // already inside a transaction
    return sql.unsafe(text, params);
  };

  return {
    async query<T = Record<string, unknown>>(q: QueryResult): Promise<T[]> {
      return (await run(q.text, q.values)) as unknown as T[];
    },

    async queryOne<T = Record<string, unknown>>(q: QueryResult): Promise<T | null> {
      const rows = (await run(q.text, q.values)) as unknown as T[];
      return rows[0] ?? null;
    },

    async execute(q: QueryResult): Promise<number> {
      return (await run(q.text, q.values)).count;
    },

    async raw<T = Record<string, unknown>>(sqlText: string, values: unknown[] = []): Promise<T[]> {
      return (await run(sqlText, values)) as unknown as T[];
    },

    async transaction<T>(
      callback: (tx: RawDb) => Promise<T>,
      options?: TransactionOptions,
    ): Promise<T> {
      const begin = beginOf(sql);
      if (!begin) {
        // Nested transaction: reuse the bound connection (session already applied).
        return callback(createDbFromSql(sql, session));
      }
      const isolationClause = `isolation level ${options?.isolationLevel ?? 'read committed'}`;
      return begin(isolationClause, async (tx) => {
        if (options?.readOnly === true) await tx.unsafe('SET TRANSACTION READ ONLY');
        await applySession(tx);
        return await callback(createDbFromSql(tx));
      });
    },

    withSession(s: SessionContext): RawDb {
      return createDbFromSql(sql, { ...session, ...s });
    },

    async healthCheck(): Promise<boolean> {
      try {
        await sql.unsafe('SELECT 1');
        return true;
      } catch {
        return false;
      }
    },

    async close(): Promise<void> {
      await (sql as Sql).end();
    },

    getClient(): Sql {
      return sql as Sql;
    },
  };
}
