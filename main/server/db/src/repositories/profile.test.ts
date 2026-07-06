// main/server/db/src/repositories/profile.test.ts
import { createProfileRepository } from './profile';
import type { QueryResult, RawDb } from '../client';

/** Minimal RawDb double that records queries and returns a canned row. */
function fakeDb(row: Record<string, unknown> | null): { db: RawDb; calls: QueryResult[] } {
  const calls: QueryResult[] = [];
  const db: RawDb = {
    async query<T>(): Promise<T[]> {
      return [];
    },
    async queryOne<T>(query: QueryResult): Promise<T | null> {
      calls.push(query);
      return row as T | null;
    },
    async execute(query: QueryResult): Promise<number> {
      calls.push(query);
      return row ? 1 : 0;
    },
    async raw<T>(): Promise<T[]> {
      return [];
    },
    transaction<T>(): Promise<T> {
      throw new Error('unused');
    },
    withSession(): RawDb {
      return db;
    },
    async healthCheck(): Promise<boolean> {
      return true;
    },
    async close(): Promise<void> {},
    getClient() {
      throw new Error('unused');
    },
  };
  return { db, calls };
}

const UUID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

describe('createProfileRepository (profile inlined on auth.users)', () => {
  it('get targets auth.users and filters out profile-less users', async () => {
    const { db, calls } = fakeDb(null);
    expect(await createProfileRepository(db).get(UUID)).toBeNull();
    expect(calls[0]?.text).toContain('FROM auth.users');
    expect(calls[0]?.text).toContain('profile_created IS NOT NULL');
    expect(calls[0]?.text).not.toContain('users.profile');
    expect(calls[0]?.values).toEqual([UUID]);
  });

  it('get returns the row unchanged when a profile exists', async () => {
    const row = { user_id: UUID, artist_creator_name: 'MK', profile_created: true };
    const { db } = fakeDb(row);
    expect(await createProfileRepository(db).get(UUID)).toEqual(row);
  });

  it('findSessionProfile returns null for a profile-less user (check-session 401 pin)', async () => {
    const { db, calls } = fakeDb(null);
    expect(await createProfileRepository(db).findSessionProfile(UUID)).toBeNull();
    expect(calls[0]?.text).toContain('FROM auth.users');
    expect(calls[0]?.text).toContain('profile_created IS NOT NULL');
    expect(calls[0]?.values).toEqual([UUID]);
  });

  it('updateBasic writes auth.users, guarded like the legacy no-op on missing profile', async () => {
    const { db, calls } = fakeDb({});
    await createProfileRepository(db).updateBasic(UUID, {
      artistCreatorName: 'MK',
      userType: 'artist',
      occupation: 'producer',
      gender: 'other',
      dateOfBirth: '1990-01-01',
      marketingConsent: true,
    });
    expect(calls[0]?.text).toContain('UPDATE auth.users SET');
    expect(calls[0]?.text).toContain('profile_created = true');
    expect(calls[0]?.text).toContain('WHERE uuid = $7 AND profile_created IS NOT NULL');
    expect(calls[0]?.values).toEqual(['MK', 'artist', 'producer', 'other', '1990-01-01', true, UUID]);
  });
});
