// src/server/db/repositories/sessions.ts
/**
 * Session repository over RawDb (auth.sessions). SQL preserved from services/session.
 */

import type { RawDb } from '../client';

export interface NewSession {
  userId: string;
  sessionToken: string;
  refreshToken: string;
  ip: string;
  userAgent: string;
  expiresAt: Date;
}

/** Row from the session ⋈ profile validation join. */
export interface SessionProfileRow {
  status: string;
  expires_at: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  profile_created: boolean;
  artist_creator_name: string;
  phone_number: string;
  gender: string;
  date_of_birth: string;
  city: string;
  state: string;
  country: string;
  user_type: string;
  occupation: string;
  preferred_language: string;
  marketing_consent: boolean;
}

export interface SessionsRepository {
  create(input: NewSession): Promise<void>;
  deactivate(sessionToken: string): Promise<void>;
  /** user_id of an active session, or null. */
  findActiveUserId(sessionToken: string): Promise<string | null>;
  /** Active session joined to the user profile, or null. */
  findActiveWithProfile(sessionToken: string): Promise<SessionProfileRow | null>;
}

export function createSessionsRepository(db: RawDb): SessionsRepository {
  return {
    async create(input) {
      await db.execute({
        text: `INSERT INTO auth.sessions
                 (user_id, session_token, refresh_token, ip_address, user_agent, status, expires_at)
               VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        values: [
          input.userId,
          input.sessionToken,
          input.refreshToken,
          input.ip,
          input.userAgent,
          'active',
          input.expiresAt,
        ],
      });
    },

    async deactivate(sessionToken) {
      await db.execute({
        text: "UPDATE auth.sessions SET status = 'inactive' WHERE session_token = $1",
        values: [sessionToken],
      });
    },

    async findActiveUserId(sessionToken) {
      const row = await db.queryOne<{ user_id: string }>({
        text: "SELECT user_id FROM auth.sessions WHERE session_token = $1 AND status = 'active'",
        values: [sessionToken],
      });
      return row?.user_id ?? null;
    },

    findActiveWithProfile(sessionToken) {
      return db.queryOne<SessionProfileRow>({
        text: `SELECT s.status, s.expires_at,
                      u.email, u.first_name, u.last_name, u.username, u.profile_created,
                      u.artist_creator_name, u.phone_number, u.gender, u.date_of_birth,
                      u.city, u.state, u.country, u.user_type, u.occupation,
                      u.preferred_language, u.marketing_consent
               FROM auth.sessions s
               JOIN users.profile u ON s.user_id = u.user_id
               WHERE s.session_token = $1 AND s.status = 'active'`,
        values: [sessionToken],
      });
    },
  };
}
