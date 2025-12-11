// src\server\services\auth\resetPassword.ts
import { authPool } from '@/server/db';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { NextRequest } from 'next/server';
import { ipAddress } from '@vercel/functions';

export interface ResetPasswordResult {
  sessionToken: string;
  expiresAt: Date;
}

/**
 * Resets the user's password if the provided token is valid and not expired.
 * Updates the user's password (after hashing), clears the email token,
 * and creates a new session.
 */
export async function resetPassword(
  token: string,
  newPassword: string,
  request: NextRequest
): Promise<ResetPasswordResult> {
  await authPool.query('BEGIN');
  try {
    // Validate the reset token
    const validateResult = await authPool.query(
      'SELECT uuid FROM auth.users WHERE email_token = $1 AND email_token_expire > NOW()',
      [token]
    );
    if (!validateResult.rowCount || validateResult.rowCount === 0) {
      await authPool.query('ROLLBACK');
      throw new Error('Token is invalid or has expired.');
    }

    const user = validateResult.rows[0];

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear email token fields
    await authPool.query(
      'UPDATE auth.users SET password = $1, email_token = NULL, email_token_expire = NOW() WHERE uuid = $2',
      [hashedPassword, user.uuid]
    );

    // Generate session and refresh tokens
    const sessionToken = randomBytes(16).toString('hex');
    const refreshToken = randomBytes(16).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Get IP address and user agent
    const userIp = await ipAddress(request);
    const userAgent = request.headers.get('user-agent') || '';

    // Insert a new session record
    await authPool.query(
      `INSERT INTO auth.sessions 
         (user_id, session_token, refresh_token, ip_address, user_agent, status, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [user.uuid, sessionToken, refreshToken, userIp, userAgent, 'active', expiresAt]
    );

    await authPool.query('COMMIT');

    return { sessionToken, expiresAt };
  } catch (error) {
    await authPool.query('ROLLBACK');
    throw error;
  }
}
