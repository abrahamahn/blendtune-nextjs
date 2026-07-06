// src/server/db/repositories/users.ts
/**
 * Auth user repository over RawDb (auth.users). SQL preserved from the previous
 * services/auth/* implementation; composes inside a transaction (pass a tx RawDb).
 */

import type { RawDb } from '../client';

export interface AuthUserRow {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  created_at: string;
  email_confirmed: boolean;
  email_token: string | null;
  last_email_sent: string | null;
  email_token_expire: string | null;
  signup_method: string | null;
}

export interface NewAuthUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  passwordHash: string;
  confirmationToken: string;
  emailTokenExpire: Date;
}

export interface UsersRepository {
  findByEmail(email: string): Promise<AuthUserRow | null>;
  /** Email address for a user UUID, or null. */
  findEmailByUuid(uuid: string): Promise<string | null>;
  /** User whose email_token matches and has not expired. */
  findByValidEmailToken(token: string): Promise<AuthUserRow | null>;
  create(input: NewAuthUser): Promise<{ id: number; uuid: string }>;
  setEmailToken(email: string, token: string, expire: Date): Promise<void>;
  confirmEmail(uuid: string): Promise<void>;
  /** Replace the stored password hash (lazy bcrypt → Argon2id upgrade). */
  updatePassword(uuid: string, passwordHash: string): Promise<void>;
  updatePasswordAndClearToken(uuid: string, passwordHash: string): Promise<void>;
  touchLastEmailSent(email: string): Promise<void>;
}

export function createUsersRepository(db: RawDb): UsersRepository {
  return {
    findByEmail(email) {
      return db.queryOne<AuthUserRow>({
        text: 'SELECT * FROM auth.users WHERE email = $1',
        values: [email],
      });
    },

    async findEmailByUuid(uuid) {
      const row = await db.queryOne<{ email: string }>({
        text: 'SELECT email FROM auth.users WHERE uuid = $1',
        values: [uuid],
      });
      return row?.email ?? null;
    },

    findByValidEmailToken(token) {
      return db.queryOne<AuthUserRow>({
        text: 'SELECT * FROM auth.users WHERE email_token = $1 AND email_token_expire > NOW()',
        values: [token],
      });
    },

    async create(input) {
      const createdAt = new Date().toISOString();
      const row = await db.queryOne<{ id: number; uuid: string }>({
        text: `INSERT INTO auth.users
                 (first_name, last_name, email, username, password, created_at, email_confirmed,
                  email_token, last_email_sent, email_token_expire, signup_method)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
               RETURNING id, uuid`,
        values: [
          input.firstName,
          input.lastName,
          input.email,
          input.username,
          input.passwordHash,
          createdAt,
          false,
          input.confirmationToken,
          createdAt,
          input.emailTokenExpire,
          'email',
        ],
      });
      if (!row) throw new Error('Failed to create user');
      return row;
    },

    async setEmailToken(email, token, expire) {
      await db.execute({
        text: 'UPDATE auth.users SET email_token = $1, email_token_expire = $2 WHERE email = $3',
        values: [token, expire, email],
      });
    },

    async confirmEmail(uuid) {
      await db.execute({
        text: 'UPDATE auth.users SET email_confirmed = TRUE WHERE uuid = $1',
        values: [uuid],
      });
    },

    async updatePassword(uuid, passwordHash) {
      await db.execute({
        text: 'UPDATE auth.users SET password = $1 WHERE uuid = $2',
        values: [passwordHash, uuid],
      });
    },

    async updatePasswordAndClearToken(uuid, passwordHash) {
      await db.execute({
        text: 'UPDATE auth.users SET password = $1, email_token = NULL, email_token_expire = NOW() WHERE uuid = $2',
        values: [passwordHash, uuid],
      });
    },

    async touchLastEmailSent(email) {
      await db.execute({
        text: 'UPDATE auth.users SET last_email_sent = NOW() WHERE email = $1',
        values: [email],
      });
    },
  };
}
