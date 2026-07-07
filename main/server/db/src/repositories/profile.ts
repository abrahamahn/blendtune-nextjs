// src/server/db/repositories/profile.ts
/**
 * User profile repository over RawDb. Profile fields are inlined on auth.users
 * (migration 0600, bslt-style); the legacy users.profile table is retired.
 *
 * Null semantics: the legacy queries returned no row when a user had no
 * users.profile row. That is preserved via `profile_created IS NOT NULL` —
 * NULL marks users who never had a profile row — so check-session still 401s
 * and /api/account still 404s for profile-less users.
 */

import type { RawDb } from '../client';

interface BasicProfileInput {
  artistCreatorName: string;
  userType: string;
  occupation: string;
  gender: string;
  dateOfBirth: string;
  marketingConsent: boolean;
}

export interface ProfileRow {
  user_id: string;
  artist_creator_name: string;
  user_type: string;
  occupation: string;
  gender: string;
  date_of_birth: string;
  marketing_consent: boolean;
  profile_created: boolean;
}

/** Row for session validation (same fields the old auth.sessions ⋈ users.profile join returned). */
export interface SessionProfileRow {
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

export interface ProfileRepository {
  get(userId: string): Promise<ProfileRow | null>;
  /** Full profile fields for check-session, or null when the user has no profile. */
  findSessionProfile(userId: string): Promise<SessionProfileRow | null>;
  updateBasic(userId: string, data: BasicProfileInput): Promise<void>;
}

export function createProfileRepository(db: RawDb): ProfileRepository {
  return {
    get(userId) {
      return db.queryOne<ProfileRow>({
        text: `SELECT uuid AS user_id, artist_creator_name, user_type, occupation, gender,
                      date_of_birth, marketing_consent, profile_created
               FROM auth.users WHERE uuid = $1 AND profile_created IS NOT NULL`,
        values: [userId],
      });
    },

    findSessionProfile(userId) {
      return db.queryOne<SessionProfileRow>({
        text: `SELECT email, first_name, last_name, username, profile_created,
                      artist_creator_name, phone_number, gender, date_of_birth,
                      city, state, country, user_type, occupation,
                      preferred_language, marketing_consent
               FROM auth.users WHERE uuid = $1 AND profile_created IS NOT NULL`,
        values: [userId],
      });
    },

    async updateBasic(userId, data) {
      // Guard matches the legacy UPDATE, which silently no-oped without a profile row.
      await db.execute({
        text: `UPDATE auth.users SET
                 artist_creator_name = $1,
                 user_type = $2,
                 occupation = $3,
                 gender = $4,
                 date_of_birth = $5,
                 marketing_consent = $6,
                 profile_created = true
               WHERE uuid = $7 AND profile_created IS NOT NULL`,
        values: [
          data.artistCreatorName,
          data.userType,
          data.occupation,
          data.gender,
          data.dateOfBirth,
          data.marketingConsent,
          userId,
        ],
      });
    },
  };
}
