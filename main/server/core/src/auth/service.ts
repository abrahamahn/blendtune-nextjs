// src/server/core/auth/service.ts
/**
 * Auth service (framework-agnostic). Response bodies/statuses are byte-identical to the
 * previous implementation; credentials now use Argon2id (with lazy bcrypt upgrade on
 * login) and sessions are JWT access tokens + opaque rotating refresh tokens.
 */

import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@server/db';
import { createUsersRepository, type AuthUserRow } from '@server/db/repositories/users';
import { createRefreshTokensRepository } from '@server/db/repositories/refreshTokens';
import { sendConfirmationEmail } from './email';
import { hashPassword, isBcryptHash, needsRehash, verifyPassword } from './password';
import { createAuthTokens, type AuthTokens } from './tokens';

/** Client metadata captured for a token family (extracted by the route adapter). */
export interface RequestMeta {
  ip: string;
  userAgent: string;
}

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

export type LoginResult = { ok: false } | { ok: true; tokens: AuthTokens };

export function getUserByEmail(email: string): Promise<AuthUserRow | null> {
  return createUsersRepository(db).findByEmail(email);
}

/** Verify credentials and, on success, issue auth tokens. No throw — the route maps the result. */
export async function login(
  email: string,
  password: string,
  meta: RequestMeta,
): Promise<LoginResult> {
  const user = await getUserByEmail(email);
  if (!user) return { ok: false };

  const valid = await verifyPassword(password, user.password);
  if (!valid) return { ok: false };

  // Lazy migration: upgrade legacy bcrypt (or outdated Argon2) hashes on successful login.
  if (isBcryptHash(user.password) || needsRehash(user.password)) {
    await createUsersRepository(db).updatePassword(user.uuid, await hashPassword(password));
  }

  const tokens = await createAuthTokens(
    createRefreshTokensRepository(db),
    { userId: user.uuid, email: user.email },
    meta,
  );
  return { ok: true, tokens };
}

/** Sign up a new user, or resend/conflict for an existing one (unchanged logic). */
export async function signUpUser(data: SignUpData): Promise<SignUpResult> {
  const { firstName, lastName, email, username, password } = data;
  const users = createUsersRepository(db);

  const existingUser = await users.findByEmail(email);
  if (existingUser) {
    const passwordMatch = await verifyPassword(password, existingUser.password);
    if (!passwordMatch) {
      return { status: 401, message: 'Incorrect password for existing email' };
    }
    if (existingUser.email_confirmed) {
      return { status: 409, message: 'Email already exists. Please log in.' };
    }
    const confirmationToken = uuidv4();
    const emailTokenExpire = new Date(Date.now() + 15 * 60000);
    await users.setEmailToken(email, confirmationToken, emailTokenExpire);
    await sendConfirmationEmail(email, confirmationToken, 'signup');
    return { status: 200, message: 'Please verify your email.', redirectToVerifyEmail: true };
  }

  const passwordHash = await hashPassword(password);
  const confirmationToken = uuidv4();
  const emailTokenExpire = new Date(Date.now() + 15 * 60000);
  const created = await users.create({
    firstName,
    lastName,
    email,
    username,
    passwordHash,
    confirmationToken,
    emailTokenExpire,
  });
  await sendConfirmationEmail(email, confirmationToken, 'signup');
  return { status: 201, message: 'User created successfully', userId: created.id };
}

/** Begin a password reset (no-op if the email is unknown, to avoid enumeration). */
export async function requestPasswordReset(email: string): Promise<void> {
  const users = createUsersRepository(db);
  const user = await users.findByEmail(email);
  if (!user) return;

  const resetToken = randomBytes(16).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);
  await users.setEmailToken(email, resetToken, expiresAt);
  await sendConfirmationEmail(email, resetToken, 'resetpassword');
}

/** Reset a password with a valid token and issue auth tokens (transactional). */
export function resetPassword(
  token: string,
  newPassword: string,
  meta: RequestMeta,
): Promise<AuthTokens> {
  return db.transaction(async (tx) => {
    const users = createUsersRepository(tx);
    const user = await users.findByValidEmailToken(token);
    if (!user) throw new Error('Token is invalid or has expired.');

    const hashedPassword = await hashPassword(newPassword);
    await users.updatePasswordAndClearToken(user.uuid, hashedPassword);

    return createAuthTokens(
      createRefreshTokensRepository(tx),
      { userId: user.uuid, email: user.email },
      meta,
    );
  });
}

export interface ResetVerificationResult {
  alreadyConfirmed: boolean;
  user: Pick<AuthUserRow, 'uuid' | 'first_name' | 'last_name' | 'email' | 'email_confirmed'>;
}

/** Verify a reset token and confirm the email if needed (transactional). */
export function verifyResetPasswordToken(token: string): Promise<ResetVerificationResult> {
  return db.transaction(async (tx) => {
    const users = createUsersRepository(tx);
    const user = await users.findByValidEmailToken(token);
    if (!user) throw new Error('Token is invalid or has expired.');

    if (user.email_confirmed) return { alreadyConfirmed: true, user };

    await users.confirmEmail(user.uuid);
    return { alreadyConfirmed: false, user };
  });
}

export interface EmailConfirmationResult {
  alreadyConfirmed: boolean;
  tokens?: AuthTokens;
}

/** Confirm an email with a token and issue auth tokens (transactional). */
export function confirmEmail(token: string, meta: RequestMeta): Promise<EmailConfirmationResult> {
  return db.transaction(async (tx) => {
    const users = createUsersRepository(tx);
    const user = await users.findByValidEmailToken(token);
    if (!user) throw new Error('Token is invalid or has expired.');

    if (user.email_confirmed) return { alreadyConfirmed: true };

    await users.confirmEmail(user.uuid);

    const tokens = await createAuthTokens(
      createRefreshTokensRepository(tx),
      { userId: user.uuid, email: user.email },
      meta,
    );
    return { alreadyConfirmed: false, tokens };
  });
}
