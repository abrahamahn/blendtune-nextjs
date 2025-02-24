// src\server\services\auth\email\confirmation.ts
import authPool from '@/server/db/auth';
import { NextRequest } from 'next/server';
import { randomBytes } from 'crypto';
import { ipAddress } from '@vercel/functions';

/**
 * Result of email confirmation process
 */
export interface EmailConfirmationResult {
  /** Indicates if email was already confirmed */
  alreadyConfirmed: boolean;
  /** Session token for new session (if applicable) */
  sessionToken?: string;
  /** Session expiration date (if applicable) */
  expiresAt?: Date;
}

/**
 * Confirms user email and creates a new session
 * @param token - Email confirmation token
 * @param request - Incoming request for IP and user agent
 * @returns Email confirmation result
 */
export async function confirmEmail(
  token: string,
  request: NextRequest
): Promise<EmailConfirmationResult> {
  await authPool.query('BEGIN');
  try {
    // Validate email confirmation token
    const validateResult = await authPool.query(
      `SELECT uuid, email_confirmed 
       FROM auth.users 
       WHERE email_token = $1 AND email_token_expire > NOW()`,
      [token]
    );

    if (!validateResult.rowCount || validateResult.rowCount === 0) {
      await authPool.query('ROLLBACK');
      throw new Error('Token is invalid or has expired.');
    }

    const user = validateResult.rows[0];

    // Check if email is already confirmed
    if (user.email_confirmed) {
      await authPool.query('COMMIT');
      return { alreadyConfirmed: true };
    }

    // Mark email as confirmed
    await authPool.query(
      'UPDATE auth.users SET email_confirmed = TRUE WHERE uuid = $1',
      [user.uuid]
    );

    // Generate session tokens
    const sessionToken = randomBytes(16).toString('hex');
    const refreshToken = randomBytes(16).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Retrieve request metadata
    const userIp = await ipAddress(request);
    const userAgent = request.headers.get('user-agent') || '';

    // Create new session
    await authPool.query(
      `INSERT INTO auth.sessions 
         (user_id, session_token, refresh_token, ip_address, user_agent, status, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [user.uuid, sessionToken, refreshToken, userIp, userAgent, 'active', expiresAt]
    );

    await authPool.query('COMMIT');
    return { alreadyConfirmed: false, sessionToken, expiresAt };
  } catch (error) {
    await authPool.query('ROLLBACK');
    throw error;
  }
}