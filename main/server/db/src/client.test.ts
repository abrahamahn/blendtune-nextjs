// src/server/db/client.test.ts
import type { Sql, TransactionSql } from 'postgres';

import { createDbFromSql, createRawDb, parsePgDate, type RawDb } from './client';

jest.mock('postgres', () => ({
  __esModule: true,
  default: jest.fn(() => ({ unsafe: jest.fn(), end: jest.fn(), begin: jest.fn() })),
}));

const postgresMock = (jest.requireMock('postgres') as { default: jest.Mock }).default;

/** RowList-shaped result: an array with the `count` postgres.js attaches. */
const rowList = (rows: Record<string, unknown>[], count: number): unknown =>
  Object.assign([...rows], { count });

/**
 * Minimal fake postgres.js client that records every SQL statement it sees.
 * `begin` mirrors the driver: BEGIN, run the callback on a transaction client
 * (which has no `begin` of its own), then COMMIT — or ROLLBACK on error.
 */
function makeFakeSql(): { sql: Sql; calls: string[] } {
  const calls: string[] = [];

  const tx = {
    unsafe: (text: string) => {
      calls.push(text);
      return Promise.resolve(rowList([{ ok: 1 }], 1));
    },
  } as unknown as TransactionSql;

  const sql = {
    unsafe: (text: string) => {
      calls.push(text);
      return Promise.resolve(rowList([{ ok: 1 }], 3));
    },
    begin: async (first: unknown, second?: unknown) => {
      const cb = (typeof first === 'function' ? first : second) as (
        t: TransactionSql,
      ) => Promise<unknown>;
      calls.push(typeof first === 'string' ? `BEGIN ${first}` : 'BEGIN');
      try {
        const result = await cb(tx);
        calls.push('COMMIT');
        return result;
      } catch (err) {
        calls.push('ROLLBACK');
        throw err;
      }
    },
    end: () => Promise.resolve(),
  } as unknown as Sql;

  return { sql, calls };
}

describe('RawDb', () => {
  it('runs unscoped queries directly on the pool (no transaction)', async () => {
    const { sql, calls } = makeFakeSql();
    const db: RawDb = createDbFromSql(sql);
    const rows = await db.query({ text: 'SELECT 1', values: [] });
    expect([...rows]).toEqual([{ ok: 1 }]);
    expect(calls).toEqual(['SELECT 1']);
  });

  it('wraps session-scoped queries in BEGIN + SET LOCAL app.* + COMMIT', async () => {
    const { sql, calls } = makeFakeSql();
    const db = createDbFromSql(sql).withSession({
      userId: 'u-1',
      tenantId: 't-1',
      role: 'member',
    });
    await db.query({ text: 'SELECT * FROM meekah.track_info', values: [] });

    expect(calls[0]).toBe('BEGIN');
    expect(calls).toContain("SET LOCAL app.user_id = 'u-1'");
    expect(calls).toContain("SET LOCAL app.tenant_id = 't-1'");
    expect(calls).toContain("SET LOCAL app.role = 'member'");
    expect(calls).toContain('SELECT * FROM meekah.track_info');
    expect(calls[calls.length - 1]).toBe('COMMIT');
    expect(calls.indexOf("SET LOCAL app.user_id = 'u-1'")).toBeLessThan(
      calls.indexOf('SELECT * FROM meekah.track_info'),
    );
  });

  it('escapes single quotes in session values', async () => {
    const { sql, calls } = makeFakeSql();
    const db = createDbFromSql(sql).withSession({ tenantId: "t'; DROP" });
    await db.query({ text: 'SELECT 1', values: [] });
    expect(calls).toContain("SET LOCAL app.tenant_id = 't''; DROP'");
  });

  it('execute returns the affected row count', async () => {
    const { sql } = makeFakeSql();
    const db = createDbFromSql(sql);
    const count = await db.execute({ text: 'DELETE FROM x', values: [] });
    expect(count).toBe(3);
  });

  it('transaction begins with the isolation level and commits', async () => {
    const { sql, calls } = makeFakeSql();
    const db = createDbFromSql(sql);
    const result = await db.transaction(
      async (tx) => {
        await tx.execute({ text: 'UPDATE x SET y = 1', values: [] });
        return 'done';
      },
      { isolationLevel: 'serializable' },
    );

    expect(result).toBe('done');
    expect(calls).toEqual(['BEGIN isolation level serializable', 'UPDATE x SET y = 1', 'COMMIT']);
  });

  it('transaction rolls back and rethrows on error', async () => {
    const { sql, calls } = makeFakeSql();
    const db = createDbFromSql(sql);
    await expect(db.transaction(() => Promise.reject(new Error('boom')))).rejects.toThrow('boom');
    expect(calls).toEqual(['BEGIN isolation level read committed', 'ROLLBACK']);
  });

  it('applies the session once at transaction start; queries inside reuse the bound connection', async () => {
    const { sql, calls } = makeFakeSql();
    const db = createDbFromSql(sql).withSession({ tenantId: 't-1' });
    await db.transaction(async (tx) => {
      await tx.query({ text: 'SELECT a', values: [] });
      // Nested transaction reuses the bound connection — no second BEGIN.
      await tx.transaction((inner) => inner.query({ text: 'SELECT b', values: [] }));
    });

    expect(calls).toEqual([
      'BEGIN isolation level read committed',
      "SET LOCAL app.tenant_id = 't-1'",
      'SELECT a',
      'SELECT b',
      'COMMIT',
    ]);
  });
});

describe('createRawDb', () => {
  beforeEach(() => postgresMock.mockClear());

  it('passes a verbatim URL through with pool options and the pg-compatible date type', () => {
    createRawDb({ url: 'postgres://u:p@h:5432/db', max: 5 });
    expect(postgresMock).toHaveBeenCalledWith(
      'postgres://u:p@h:5432/db',
      expect.objectContaining({
        max: 5,
        types: { date: expect.objectContaining({ from: [1082, 1114, 1184] }) },
      }),
    );
  });

  it('passes discrete connection fields when no URL is set', () => {
    createRawDb({ user: 'u', password: 'p', host: 'h', port: 5433, database: 'db' });
    expect(postgresMock).toHaveBeenCalledWith(
      expect.objectContaining({ user: 'u', password: 'p', host: 'h', port: 5433, database: 'db', max: 10 }),
    );
  });
});

describe('parsePgDate (pg parity)', () => {
  it('parses date-only values as LOCAL-time midnight, exactly like pg', () => {
    // Under TZ=UTC (production) this serializes to '2018-11-30T00:00:00.000Z'.
    expect(parsePgDate('2018-11-30')).toEqual(new Date(2018, 10, 30));
  });

  it('parses timestamps without a zone as local time', () => {
    expect(parsePgDate('2023-01-15 10:30:45.5')).toEqual(new Date(2023, 0, 15, 10, 30, 45, 500));
  });

  it('parses timestamps with a UTC offset', () => {
    expect(parsePgDate('2023-01-15 10:30:00+00')).toEqual(
      new Date(Date.UTC(2023, 0, 15, 10, 30, 0)),
    );
    expect(parsePgDate('2023-01-15 10:30:00-05')).toEqual(
      new Date(Date.UTC(2023, 0, 15, 15, 30, 0)),
    );
  });

  it('parses infinity sentinels as numbers', () => {
    expect(parsePgDate('infinity')).toBe(Infinity);
    expect(parsePgDate('-infinity')).toBe(-Infinity);
  });

  it('returns null for unparseable input', () => {
    expect(parsePgDate('not-a-date')).toBeNull();
  });
});
