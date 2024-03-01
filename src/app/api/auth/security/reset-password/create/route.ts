import { NextRequest, NextResponse } from 'next/server';
import authPool from '../../../../../../../server/db/auth';
import { setHttpOnlyCookie } from '../../../../../../../server/utils/cookie';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';


export async function POST(request: NextRequest) {
  if (!request.body) {
    return new NextResponse(JSON.stringify({ message: 'Request body is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { token, newPassword } = await request.json();
  if (!token || !newPassword) {
    return new NextResponse(JSON.stringify({ message: 'Token and new password are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await authPool.query('BEGIN');

    const validateResult = await authPool.query(
      'SELECT uuid FROM auth.users WHERE email_token = $1 AND email_token_expire > NOW()',
      [token]
    );

    if (validateResult.rowCount === 0) {
      await authPool.query('ROLLBACK');
      return new NextResponse(JSON.stringify({ success: false, message: 'Token is invalid or has expired.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = validateResult.rows[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password

    // Update user's password here, ensure to hash it before storing
    await authPool.query('UPDATE auth.users SET password = $1, email_token = NULL, email_token_expire = NOW() WHERE uuid = $2', [hashedPassword, user.uuid]);

    // Generate session token
    const sessionToken = randomBytes(16).toString('hex');
    const refresh_token = randomBytes(16).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Insert session into auth.sessions
    await authPool.query(
      'INSERT INTO auth.sessions (user_id, session_token, refresh_token, ip_address, user_agent, status, expires_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [user.uuid, sessionToken, refresh_token, request.ip, request.headers.get('user-agent') || '', 'active', expiresAt]
    );

    await authPool.query('COMMIT');

    // Set the httpOnly cookie
    const response = new NextResponse(JSON.stringify({ success: true, message: 'Password reset successfully.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
    return setHttpOnlyCookie(response, 'sessionToken', sessionToken, {
      httpOnly: true,
      path: '/',
      expires: expiresAt,
    });

  } catch (error) {
    console.error("Error during password reset:", error);
    await authPool.query('ROLLBACK');
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ success: false, message: `An error occurred: ${errorMessage}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
    });
  }
}
