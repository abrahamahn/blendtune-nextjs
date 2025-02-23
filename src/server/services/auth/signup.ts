// src\server\services\auth\signup.ts
import { authPool } from '@/server/db';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import sendConfirmationEmail from '@/server/services/auth/email/send';

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export interface SignUpResult {
  status: number;
  message: string;
  redirectToVerifyEmail?: boolean;
  userId?: number;
}

/**
 * Handles user sign-up. If a user with the given email already exists:
 *  - If the password matches and the email is not confirmed, it resends a confirmation email.
 *  - If the email is confirmed, it returns a conflict.
 *  - If the password doesn't match, it returns an error.
 *
 * If no user exists, it creates a new user record, sends a confirmation email,
 * and returns a success result.
 */
export async function signUpUser(data: SignUpData): Promise<SignUpResult> {
  const { firstName, lastName, email, username, password } = data;

  // Check if a user with this email already exists.
  const emailCheckResult = await authPool.query(
    'SELECT * FROM auth.users WHERE email = $1',
    [email]
  );

  if (emailCheckResult.rows.length > 0) {
    const existingUser = emailCheckResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (passwordMatch) {
      if (!existingUser.email_confirmed) {
        // Resend confirmation email if the user hasn't confirmed their email.
        const confirmationToken = uuidv4();
        const emailTokenExpire = new Date(Date.now() + 15 * 60000); // 15 minutes from now
        await authPool.query(
          'UPDATE auth.users SET email_token = $1, email_token_expire = $2 WHERE email = $3',
          [confirmationToken, emailTokenExpire, email]
        );
        await sendConfirmationEmail(email, confirmationToken, 'signup');
        return {
          status: 200,
          message: 'Please verify your email.',
          redirectToVerifyEmail: true,
        };
      } else {
        // Email is already registered and confirmed.
        return {
          status: 409,
          message: 'Email already exists. Please log in.',
        };
      }
    } else {
      // Existing user but incorrect password.
      return {
        status: 401,
        message: 'Incorrect password for existing email',
      };
    }
  } else {
    // New user creation
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const confirmationToken = uuidv4();
    const createdAt = new Date().toISOString();
    const emailTokenExpire = new Date(Date.now() + 15 * 60000); // 15 minutes from now

    const result = await authPool.query(
      `INSERT INTO auth.users 
        (first_name, last_name, email, username, password, created_at, email_confirmed, email_token, last_email_sent, email_token_expire, signup_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, uuid`,
      [firstName, lastName, email, username, hashedPassword, createdAt, false, confirmationToken, createdAt, emailTokenExpire, 'email']
    );

    // Send the confirmation email with the token.
    await sendConfirmationEmail(email, confirmationToken, 'signup');

    return {
      status: 201,
      message: 'User created successfully',
      userId: result.rows[0].id,
    };
  }
}