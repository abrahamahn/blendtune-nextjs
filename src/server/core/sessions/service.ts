// src/server/core/sessions/service.ts
/**
 * Session service (framework-agnostic). Behavior preserved from services/session/session.ts,
 * now over the RawDb session repository. IP / user-agent are passed as primitives.
 */

import { v4 as uuidv4 } from 'uuid';

import { db } from '@server/db';
import { createSessionsRepository, type SessionProfileRow } from '@server/db/repositories/sessions';

/** Validated session joined to the user profile (snake_case, as consumed by the route). */
export type SessionData = SessionProfileRow;

export interface CreatedSession {
  sessionToken: string;
  refreshToken: string;
  expiresAt: Date;
}

/** Create a 30-day session for a user. */
export async function createSession(
  userId: string,
  userIp: string,
  userAgent: string,
): Promise<CreatedSession> {
  const sessionToken = uuidv4();
  const refreshToken = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await createSessionsRepository(db).create({
    userId,
    sessionToken,
    refreshToken,
    ip: userIp,
    userAgent,
    expiresAt,
  });

  return { sessionToken, refreshToken, expiresAt };
}

/** Mark a session inactive (logout). */
export async function logoutSession(sessionToken: string): Promise<void> {
  await createSessionsRepository(db).deactivate(sessionToken);
}

/** user_id (UUID) of an active session, or null. */
export function getUserIdFromSession(sessionToken: string): Promise<string | null> {
  return createSessionsRepository(db).findActiveUserId(sessionToken);
}

/** Validate an active, unexpired session and return the joined profile data, or null. */
export async function validateSession(sessionToken: string): Promise<SessionData | null> {
  const row = await createSessionsRepository(db).findActiveWithProfile(sessionToken);
  if (!row) return null;

  const expiresAt = new Date(row.expires_at);
  if (expiresAt < new Date() || row.status !== 'active') return null;

  return row;
}
