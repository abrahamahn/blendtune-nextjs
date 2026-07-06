// src/server/core/sessions/service.ts
/**
 * Session service (framework-agnostic). Sessions are now stateless HS256 access JWTs;
 * `auth.sessions` is no longer read or written. Exported names/signatures are preserved
 * where feasible so callers (Next routes, Fastify context) are unchanged.
 */

import { db } from '@server/db';
import { createProfileRepository, type SessionProfileRow } from '@server/db/repositories/profile';
import { createRefreshTokensRepository } from '@server/db/repositories/refreshTokens';
import { revokeRefreshTokenFamily, verifyAccessToken } from '../auth/tokens';

/** Validated profile data returned to check-session (snake_case, as consumed by the route). */
export type SessionData = SessionProfileRow;

/** Revoke the refresh-token family behind a presented refresh token (logout). */
export async function logoutSession(refreshToken: string): Promise<void> {
  await revokeRefreshTokenFamily(createRefreshTokensRepository(db), refreshToken, 'User logout');
}

/** user_id (UUID) from a valid access JWT, or null. */
export function getUserIdFromSession(sessionToken: string): Promise<string | null> {
  return Promise.resolve(verifyAccessToken(sessionToken));
}

/** Validate an access JWT and return the user's profile data, or null. */
export async function validateSession(sessionToken: string): Promise<SessionData | null> {
  const userId = verifyAccessToken(sessionToken);
  if (!userId) return null;
  return createProfileRepository(db).findSessionProfile(userId);
}
