import { NextRequest, NextResponse } from 'next/server';
import authPool from '../../../../../../server/db/auth';
import { randomBytes } from 'crypto';
import sendConfirmationEmail from '../../../../../../server/services/authEmail';


export async function POST(request: NextRequest) {
  if (!request.body) {
    return new NextResponse(JSON.stringify({ message: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { email } = await request.json();
  if (!email) {
    return new NextResponse(JSON.stringify({ message: 'Email is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const userResult = await authPool.query('SELECT uuid FROM auth.users WHERE email = $1', [email]);
    if (userResult.rowCount === 0) {
      return new NextResponse(JSON.stringify({ message: 'If an account with that email exists, we have sent a password reset email.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = userResult.rows[0];
    const resetToken = randomBytes(16).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); 

    await authPool.query('UPDATE auth.users SET email_token = $1, email_token_expire = $2 WHERE uuid = $3', [resetToken, expiresAt, user.uuid]);
    const actionType='resetpassword';
    console.log("Sending email with actionType:", actionType);

    await sendConfirmationEmail(email, resetToken, actionType);

    return new NextResponse(JSON.stringify({ message: 'If an account with that email exists, we have sent a password reset email.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Reset password request failed:', error);
    return new NextResponse(JSON.stringify({ message: 'An error occurred while processing your request.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
