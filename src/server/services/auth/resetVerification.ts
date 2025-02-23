// src\server\services\auth\resetVerification.ts
import { authPool } from '@/server/db';

export interface ResetPasswordVerificationResult {
  alreadyConfirmed: boolean;
  user: {
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
    email_confirmed: boolean;
  };
}

/**
 * Verifies a reset password token by checking that the token is valid
 * and not expired. If the email is not yet confirmed, it confirms the email.
 * This function uses a transaction to ensure atomicity.
 */
export async function verifyResetPasswordToken(
  token: string
): Promise<ResetPasswordVerificationResult> {
  await authPool.query('BEGIN');
  try {
    const validateResult = await authPool.query(
      `SELECT uuid, first_name, last_name, email, email_confirmed
       FROM auth.users
       WHERE email_token = $1 AND email_token_expire > NOW()`,
      [token]
    );

    if (!validateResult.rowCount || validateResult.rowCount === 0) {
      await authPool.query('ROLLBACK');
      throw new Error('Token is invalid or has expired.');
    }

    const user = validateResult.rows[0];

    // If the email is already confirmed, no need to update.
    if (user.email_confirmed) {
      await authPool.query('COMMIT');
      return { alreadyConfirmed: true, user };
    }

    // Confirm the email.
    await authPool.query(
      'UPDATE auth.users SET email_confirmed = TRUE WHERE uuid = $1',
      [user.uuid]
    );

    await authPool.query('COMMIT');
    return { alreadyConfirmed: false, user };
  } catch (error) {
    await authPool.query('ROLLBACK');
    throw error;
  }
}
