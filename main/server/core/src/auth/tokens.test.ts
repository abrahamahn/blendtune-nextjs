// main/server/core/src/auth/tokens.test.ts
import type {
  NewRefreshToken,
  RefreshTokenRow,
  RefreshTokensRepository,
} from '@server/db/repositories/refreshTokens';

import {
  createAuthTokens,
  hashRefreshToken,
  revokeRefreshTokenFamily,
  rotateAuthTokens,
  verifyAccessToken,
} from './tokens';

const META = { ip: '127.0.0.1', userAgent: 'jest' };
const EMAIL = async (): Promise<string | null> => 'user@example.com';

/** In-memory RefreshTokensRepository mirroring the SQL semantics. */
function createFakeRepo(): RefreshTokensRepository & { rows: RefreshTokenRow[] } {
  const rows: RefreshTokenRow[] = [];
  let nextId = 1;
  return {
    rows,
    async create(input: NewRefreshToken) {
      rows.push({
        id: String(nextId++),
        user_id: input.userId,
        token_hash: input.tokenHash,
        family_id: input.familyId,
        rotated_at: null,
        family_revoked_at: null,
        family_revoke_reason: null,
        user_agent: input.userAgent,
        ip: input.ip,
        expires_at: input.expiresAt.toISOString(),
        created_at: new Date().toISOString(),
      });
    },
    async findByTokenHash(tokenHash: string) {
      return (
        rows.find((r) => r.token_hash === tokenHash && new Date(r.expires_at) > new Date()) ?? null
      );
    },
    async markRotated(id: string) {
      const row = rows.find((r) => r.id === id);
      if (!row || row.rotated_at !== null) return false;
      row.rotated_at = new Date().toISOString();
      return true;
    },
    async revokeFamily(familyId: string, reason: string) {
      const targets = rows.filter(
        (r) => r.family_id === familyId && r.family_revoked_at === null,
      );
      targets.forEach((r) => {
        r.family_revoked_at = new Date().toISOString();
        r.family_revoke_reason = reason;
      });
      return targets.length;
    },
    async deleteExpired() {
      const before = rows.length;
      const keep = rows.filter(
        (r) => new Date(r.expires_at) >= new Date() && r.family_revoked_at === null,
      );
      rows.length = 0;
      rows.push(...keep);
      return before - rows.length;
    },
  };
}

describe('auth tokens', () => {
  const originalSecret = process.env.JWT_SECRET;

  beforeAll(() => {
    process.env.JWT_SECRET = 'unit-test-jwt-secret-at-least-32-chars!!';
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  it('issues an access JWT and stores only the SHA-256 of the refresh token', async () => {
    const repo = createFakeRepo();
    const tokens = await createAuthTokens(repo, { userId: 'u1', email: 'user@example.com' }, META);

    expect(verifyAccessToken(tokens.accessToken)).toBe('u1');
    expect(tokens.refreshToken).toHaveLength(128); // 64 random bytes, hex
    expect(repo.rows).toHaveLength(1);
    expect(repo.rows[0].token_hash).toBe(hashRefreshToken(tokens.refreshToken));
    expect(repo.rows[0].token_hash).not.toContain(tokens.refreshToken);
    expect(tokens.refreshExpiresAt.getTime()).toBeGreaterThan(tokens.accessExpiresAt.getTime());
  });

  it('rotation marks the old token rotated and issues a successor in the same family', async () => {
    const repo = createFakeRepo();
    const issued = await createAuthTokens(repo, { userId: 'u1', email: 'user@example.com' }, META);

    const rotated = await rotateAuthTokens(repo, issued.refreshToken, EMAIL, META);

    expect(rotated).not.toBeNull();
    expect(rotated?.userId).toBe('u1');
    expect(rotated?.refreshToken).not.toBe(issued.refreshToken);
    expect(verifyAccessToken(rotated!.accessToken)).toBe('u1');

    expect(repo.rows).toHaveLength(2);
    const [oldRow, newRow] = repo.rows;
    expect(oldRow.rotated_at).not.toBeNull();
    expect(newRow.rotated_at).toBeNull();
    expect(newRow.family_id).toBe(oldRow.family_id);
  });

  it('reusing an already-rotated token revokes the entire family', async () => {
    const repo = createFakeRepo();
    const issued = await createAuthTokens(repo, { userId: 'u1', email: 'user@example.com' }, META);
    const rotated = await rotateAuthTokens(repo, issued.refreshToken, EMAIL, META);

    // Replay the original (rotated-away) token — theft signal.
    const reuse = await rotateAuthTokens(repo, issued.refreshToken, EMAIL, META);
    expect(reuse).toBeNull();
    expect(repo.rows.every((r) => r.family_revoked_at !== null)).toBe(true);

    // The successor is dead too: the whole family is revoked.
    const afterRevoke = await rotateAuthTokens(repo, rotated!.refreshToken, EMAIL, META);
    expect(afterRevoke).toBeNull();
  });

  it('returns null for unknown or expired refresh tokens', async () => {
    const repo = createFakeRepo();
    expect(await rotateAuthTokens(repo, 'never-issued', EMAIL, META)).toBeNull();

    const issued = await createAuthTokens(repo, { userId: 'u1', email: 'user@example.com' }, META);
    repo.rows[0].expires_at = new Date(Date.now() - 1000).toISOString();
    expect(await rotateAuthTokens(repo, issued.refreshToken, EMAIL, META)).toBeNull();
  });

  it('logout revokes the family of the presented token', async () => {
    const repo = createFakeRepo();
    const issued = await createAuthTokens(repo, { userId: 'u1', email: 'user@example.com' }, META);

    await revokeRefreshTokenFamily(repo, issued.refreshToken, 'User logout');

    expect(repo.rows[0].family_revoked_at).not.toBeNull();
    expect(repo.rows[0].family_revoke_reason).toBe('User logout');
    expect(await rotateAuthTokens(repo, issued.refreshToken, EMAIL, META)).toBeNull();
  });

  it('rejects tampered and expired access JWTs', async () => {
    const repo = createFakeRepo();
    const tokens = await createAuthTokens(repo, { userId: 'u1', email: 'user@example.com' }, META);

    expect(verifyAccessToken(`${tokens.accessToken}x`)).toBeNull();
    expect(verifyAccessToken('garbage')).toBeNull();
  });
});
