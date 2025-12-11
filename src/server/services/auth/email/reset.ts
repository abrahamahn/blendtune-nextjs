// src\server\services\auth\email\reset.ts
import { authPool } from '@/server/db';
import { randomBytes } from 'crypto';
import sendConfirmationEmail from '@/server/services/auth/email/send';

/**
 * Initiates the password reset process.
 * If the email exists in the database, updates the user record with a reset token and expiry,
 * and sends a password reset email.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  // Look up the user by email.
  const userResult = await authPool.query(
    'SELECT uuid FROM auth.users WHERE email = $1',
    [email]
  );

  // If no user exists, simply return (avoid user enumeration).
  if (userResult.rowCount === 0) {
    return;
  }

  const user = userResult.rows[0];

  // Generate a reset token and set expiry (1 hour from now).
  const resetToken = randomBytes(16).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  // Update the user record with the reset token and its expiry.
  await authPool.query(
    'UPDATE auth.users SET email_token = $1, email_token_expire = $2 WHERE uuid = $3',
    [resetToken, expiresAt, user.uuid]
  );

  const actionType = 'resetpassword';
  console.log("Sending email with actionType:", actionType);

  // Send the reset password email.
  await sendConfirmationEmail(email, resetToken, actionType);
}
