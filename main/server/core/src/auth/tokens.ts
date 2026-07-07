// main/server/core/src/auth/tokens.ts
/**
 * Auth token issuance (framework-agnostic): HS256 access JWTs plus opaque rotating
 * refresh tokens with family tracking and reuse detection (bslt's model).
 *
 * Only the SHA-256 of a refresh token is ever stored. Rotation marks the presented
 * row `rotated_at` and issues a successor in the same family; presenting an
 * already-rotated token revokes the entire family.
 */

import { createHash, randomBytes, randomUUID } from 'node:crypto';

import { sign, verify } from '@server/system/security/jwt';
import type { RefreshTokensRepository } from '@server/db/repositories/refreshTokens';
import type { RequestMeta } from './service';

const REFRESH_TOKEN_TTL_DAYS = 30;
const MIN_SECRET_LENGTH = 32;
const DEFAULT_ACCESS_TOKEN_TTL = '15m';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;
}

interface RotatedTokens extends AuthTokens {
  userId: string;
}

/** JWT_SECRET from the environment. Throws when missing or shorter than 32 chars. */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must be set and at least ${MIN_SECRET_LENGTH} characters long. ` +
        'Add it to the environment before starting the server.',
    );
  }
  return secret;
}

function getAccessTokenTtl(): string {
  return process.env.ACCESS_TOKEN_TTL ?? DEFAULT_ACCESS_TOKEN_TTL;
}

/** Parse a `<n>[smhd]` TTL into milliseconds (mirrors the JWT module's units). */
function ttlToMs(ttl: string): number {
  const match = ttl.match(/^(\d+)([smhd])$/);
  if (!match?.[1] || !match[2]) throw new Error(`Invalid ACCESS_TOKEN_TTL: ${ttl}`);
  const multipliers: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return parseInt(match[1], 10) * (multipliers[match[2]] ?? 0);
}

/** SHA-256 hex digest of an opaque refresh token (the only form ever persisted). */
export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function refreshExpiry(): Date {
  return new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 86_400_000);
}

function signAccessToken(userId: string, email: string): { token: string; expiresAt: Date } {
  const ttl = getAccessTokenTtl();
  return {
    token: sign({ userId, email }, getJwtSecret(), { expiresIn: ttl }),
    expiresAt: new Date(Date.now() + ttlToMs(ttl)),
  };
}

/** Verify an access JWT and return its userId, or null when invalid/expired. */
export function verifyAccessToken(token: string): string | null {
  try {
    const payload = verify(token, getJwtSecret());
    return typeof payload.userId === 'string' ? payload.userId : null;
  } catch {
    return null;
  }
}

/** Issue a fresh access JWT and a new refresh-token family for a user. */
export async function createAuthTokens(
  refreshTokens: RefreshTokensRepository,
  user: { userId: string; email: string },
  meta: RequestMeta,
): Promise<AuthTokens> {
  const refreshToken = randomBytes(64).toString('hex');
  const refreshExpiresAt = refreshExpiry();

  await refreshTokens.create({
    userId: user.userId,
    tokenHash: hashRefreshToken(refreshToken),
    familyId: randomUUID(),
    ip: meta.ip,
    userAgent: meta.userAgent,
    expiresAt: refreshExpiresAt,
  });

  const access = signAccessToken(user.userId, user.email);
  return {
    accessToken: access.token,
    refreshToken,
    accessExpiresAt: access.expiresAt,
    refreshExpiresAt,
  };
}

/**
 * Rotate a refresh token: mark the presented row rotated and issue a successor in
 * the same family, plus a fresh access JWT. Returns null when the token is unknown,
 * expired, revoked, or loses a concurrent rotation. Presenting an already-rotated
 * token is treated as reuse and revokes the whole family.
 */
export async function rotateAuthTokens(
  refreshTokens: RefreshTokensRepository,
  presentedToken: string,
  email: (userId: string) => Promise<string | null>,
  meta: RequestMeta,
): Promise<RotatedTokens | null> {
  const row = await refreshTokens.findByTokenHash(hashRefreshToken(presentedToken));
  if (!row || row.family_revoked_at !== null) return null;

  if (row.rotated_at !== null) {
    // Reuse of a rotated token — assume theft and kill the family.
    await refreshTokens.revokeFamily(row.family_id, 'Refresh token reuse detected');
    return null;
  }

  if (!(await refreshTokens.markRotated(row.id))) return null; // lost a concurrent rotation

  const newRefreshToken = randomBytes(64).toString('hex');
  const refreshExpiresAt = refreshExpiry();
  await refreshTokens.create({
    userId: row.user_id,
    tokenHash: hashRefreshToken(newRefreshToken),
    familyId: row.family_id,
    ip: meta.ip,
    userAgent: meta.userAgent,
    expiresAt: refreshExpiresAt,
  });

  const userEmail = await email(row.user_id);
  if (userEmail === null) return null;

  const access = signAccessToken(row.user_id, userEmail);
  return {
    userId: row.user_id,
    accessToken: access.token,
    refreshToken: newRefreshToken,
    accessExpiresAt: access.expiresAt,
    refreshExpiresAt,
  };
}

/** Revoke the family of a presented refresh token (logout). No-op when unknown. */
export async function revokeRefreshTokenFamily(
  refreshTokens: RefreshTokensRepository,
  presentedToken: string,
  reason: string,
): Promise<void> {
  const row = await refreshTokens.findByTokenHash(hashRefreshToken(presentedToken));
  if (row) await refreshTokens.revokeFamily(row.family_id, reason);
}
