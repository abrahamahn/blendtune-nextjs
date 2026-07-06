// src/server/db/repositories/profile.ts
/**
 * User profile repository over RawDb (users.profile). SQL preserved from
 * services/session/userProfile.
 */

import type { RawDb } from '../client';

export interface BasicProfileInput {
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

export interface ProfileRepository {
  get(userId: string): Promise<ProfileRow | null>;
  updateBasic(userId: string, data: BasicProfileInput): Promise<void>;
}

export function createProfileRepository(db: RawDb): ProfileRepository {
  return {
    get(userId) {
      return db.queryOne<ProfileRow>({
        text: `SELECT user_id, artist_creator_name, user_type, occupation, gender,
                      date_of_birth, marketing_consent, profile_created
               FROM users.profile WHERE user_id = $1`,
        values: [userId],
      });
    },

    async updateBasic(userId, data) {
      await db.execute({
        text: `UPDATE users.profile SET
                 artist_creator_name = $1,
                 user_type = $2,
                 occupation = $3,
                 gender = $4,
                 date_of_birth = $5,
                 marketing_consent = $6,
                 profile_created = true
               WHERE user_id = $7`,
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
