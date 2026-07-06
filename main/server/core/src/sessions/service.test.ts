// main/server/core/src/sessions/service.test.ts
import { sign } from '@server/system/security/jwt';
import type { SessionProfileRow } from '@server/db/repositories/profile';
import { validateSession } from './service';

const mockQueryOne = jest.fn();
jest.mock('@server/db', () => ({
  db: { queryOne: (query: unknown) => mockQueryOne(query) },
}));

const SECRET = 'unit-test-jwt-secret-at-least-32-chars!!';
const USER_ID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

const originalSecret = process.env.JWT_SECRET;
beforeAll(() => {
  process.env.JWT_SECRET = SECRET;
});
afterAll(() => {
  process.env.JWT_SECRET = originalSecret;
});
beforeEach(() => mockQueryOne.mockReset());

function accessToken(): string {
  return sign({ userId: USER_ID, email: 'user@example.com' }, SECRET, { expiresIn: '15m' });
}

describe('validateSession', () => {
  it('returns null for an invalid token without hitting the database', async () => {
    expect(await validateSession('not-a-jwt')).toBeNull();
    expect(mockQueryOne).not.toHaveBeenCalled();
  });

  it('returns null for a valid token when the user has no profile (401 pin)', async () => {
    mockQueryOne.mockResolvedValueOnce(null);
    expect(await validateSession(accessToken())).toBeNull();
    expect(mockQueryOne).toHaveBeenCalledTimes(1);
  });

  it('returns the profile row for a valid token when a profile exists', async () => {
    const row = { email: 'user@example.com', profile_created: true } as SessionProfileRow;
    mockQueryOne.mockResolvedValueOnce(row);
    expect(await validateSession(accessToken())).toEqual(row);
  });
});
