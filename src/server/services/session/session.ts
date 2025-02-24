// src\server\services\session\session.ts
import { authPool } from '@/server/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Comprehensive user session data structure
 */
export interface SessionData {
  status: string;
  expires_at: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_created: boolean;
  artist_creator_name: string;
  phone_number: string;
  gender: string;
  date_of_birth: string;
  city: string;
  state: string;
  country: string;
  user_type: string;
  occupation: string;
  preferred_language: string;
  marketing_consent: boolean;
}

/**
 * Creates a new user session
 * @returns Session tokens and expiration date
 */
export async function createSession(
  userId: string,
  userIp: string,
  userAgent: string
): Promise<{ sessionToken: string; refreshToken: string; expiresAt: Date }> {
  const sessionToken = uuidv4();
  const refreshToken = uuidv4();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await authPool.query(
    `INSERT INTO auth.sessions 
      (user_id, session_token, refresh_token, ip_address, user_agent, status, expires_at) 
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [userId, sessionToken, refreshToken, userIp, userAgent, 'active', expiresAt]
  );

  return { sessionToken, refreshToken, expiresAt };
}

/**
 * Marks a session as inactive (logout)
 */
export async function logoutSession(sessionToken: string): Promise<void> {
  await authPool.query(
    `
    UPDATE auth.sessions
    SET status = 'inactive'
    WHERE session_token = $1
    `,
    [sessionToken]
  );
}

/**
 * Validates an active session and returns user data
 * @returns User session data or null if invalid
 */
export async function validateSession(sessionToken: string): Promise<SessionData | null> {
  const result = await authPool.query(
    `
    SELECT s.status, s.expires_at, 
            u.email, u.first_name, u.last_name, u.username, u.profile_created,
            u.artist_creator_name, u.phone_number, u.gender, u.date_of_birth, 
            u.city, u.state, u.country, u.user_type, u.occupation, 
            u.preferred_language, u.marketing_consent
    FROM auth.sessions s
    JOIN users.profile u ON s.user_id = u.user_id
    WHERE s.session_token = $1 AND s.status = 'active'
    `,
    [sessionToken]
  );

  if (!result.rowCount || result.rowCount === 0) {
    return null;
  }

  const sessionData: SessionData = result.rows[0];
  const currentTime = new Date();
  const expiresAt = new Date(sessionData.expires_at);

  if (expiresAt < currentTime || sessionData.status !== 'active') {
    return null;
  }

  return sessionData;
}

/**
 * Retrieves user ID from an active session
 * @returns User ID or null if session is invalid
 */
export async function getUserIdFromSession(sessionToken: string): Promise<number | null> {
  const result = await authPool.query(
    `
    SELECT user_id 
    FROM auth.sessions 
    WHERE session_token = $1 AND status = 'active'
    `,
    [sessionToken]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0].user_id;
}