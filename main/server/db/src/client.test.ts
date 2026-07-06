// src/server/db/client.test.ts
import type { Pool, PoolClient } from 'pg';

import { createDbFromPool, type RawDb } from './client';

/** Minimal fake pg Pool/PoolClient that records the SQL it sees. */
function makeFakePool(): { pool: Pool; poolCalls: string[]; clientCalls: string[] } {
  const poolCalls: string[] = [];
  const clientCalls: string[] = [];

  const client = {
    query: (text: string) => {
      clientCalls.push(text);
      return Promise.resolve({ rows: [{ ok: 1 }], rowCount: 1 });
    },
    release: () => undefined,
  } as unknown as PoolClient;

  const pool = {
    query: (text: string) => {
      poolCalls.push(text);
      return Promise.resolve({ rows: [{ ok: 1 }], rowCount: 3 });
    },
    connect: () => Promise.resolve(client),
    end: () => Promise.resolve(),
  } as unknown as Pool;

  return { pool, poolCalls, clientCalls };
}

describe('RawDb', () => {
  it('runs unscoped queries directly on the pool (no transaction)', async () => {
    const { pool, poolCalls } = makeFakePool();
    const db: RawDb = createDbFromPool(pool);
    const rows = await db.query({ text: 'SELECT 1', values: [] });
    expect(rows).toEqual([{ ok: 1 }]);
    expect(poolCalls).toEqual(['SELECT 1']);
  });

  it('wraps session-scoped queries in BEGIN + SET LOCAL app.* + COMMIT', async () => {
    const { pool, clientCalls } = makeFakePool();
    const db = createDbFromPool(pool).withSession({
      userId: 'u-1',
      tenantId: 't-1',
      role: 'member',
    });
    await db.query({ text: 'SELECT * FROM meekah.track_info', values: [] });

    expect(clientCalls[0]).toBe('BEGIN');
    expect(clientCalls).toContain("SET LOCAL app.user_id = 'u-1'");
    expect(clientCalls).toContain("SET LOCAL app.tenant_id = 't-1'");
    expect(clientCalls).toContain("SET LOCAL app.role = 'member'");
    expect(clientCalls).toContain('SELECT * FROM meekah.track_info');
    expect(clientCalls[clientCalls.length - 1]).toBe('COMMIT');
  });

  it('escapes single quotes in session values', async () => {
    const { pool, clientCalls } = makeFakePool();
    const db = createDbFromPool(pool).withSession({ tenantId: "t'; DROP" });
    await db.query({ text: 'SELECT 1', values: [] });
    expect(clientCalls).toContain("SET LOCAL app.tenant_id = 't''; DROP'");
  });

  it('execute returns the affected row count', async () => {
    const { pool } = makeFakePool();
    const db = createDbFromPool(pool);
    const count = await db.execute({ text: 'DELETE FROM x', values: [] });
    expect(count).toBe(3);
  });
});
