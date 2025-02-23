// src\server\services\auth\email\confirmation.ts
import authPool from '@/server/db/auth';
import { NextRequest } from 'next/server';
import { randomBytes } from 'crypto';
import { ipAddress } from '@vercel/functions';

export interface EmailConfirmationResult {
  alreadyConfirmed: boolean;
  sessionToken?: string;
  expiresAt?: Date;
}

export async function confirmEmail(
  token: string,
  request: NextRequest
): Promise<EmailConfirmationResult> {
  await authPool.query('BEGIN');
  try {
    // Validate the email confirmation token and its expiration.
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

    // If the email is already confirmed, commit and return a flag.
    if (user.email_confirmed) {
      await authPool.query('COMMIT');
      return { alreadyConfirmed: true };
    }

    // Update the user's email_confirmed status.
    await authPool.query(
      'UPDATE auth.users SET email_confirmed = TRUE WHERE uuid = $1',
      [user.uuid]
    );

    // Generate session and refresh tokens.
    const sessionToken = randomBytes(16).toString('hex');
    const refreshToken = randomBytes(16).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Get IP address and user agent.
    const userIp = await ipAddress(request);
    const userAgent = request.headers.get('user-agent') || '';

    // Insert a new session record.
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
