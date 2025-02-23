// src\server\services\session\userProfile.ts
import { authPool } from '@/server/db';

export interface BasicProfileData {
  userArtistCreatorName: string;
  userType: string;
  userOccupation: string;
  userGender: string;
  userDateOfBirth: string;
  userMarketingConsent: boolean;
}

export async function updateBasicProfile(
  userId: number,
  profileData: BasicProfileData
): Promise<void> {
  const {
    userArtistCreatorName,
    userType,
    userOccupation,
    userGender,
    userDateOfBirth,
    userMarketingConsent,
  } = profileData;

  const query = `
    UPDATE users.profile
    SET
      artist_creator_name = $1,
      user_type = $2,
      occupation = $3,
      gender = $4,
      date_of_birth = $5,
      marketing_consent = $6,
      profile_created = true
    WHERE user_id = $7;
  `;

  await authPool.query(query, [
    userArtistCreatorName,
    userType,
    userOccupation,
    userGender,
    userDateOfBirth,
    userMarketingConsent,
    userId,
  ]);
}


export async function getProfile(userId: number) {
    const query = `
      SELECT user_id, artist_creator_name, user_type, occupation, gender, date_of_birth, marketing_consent, profile_created
      FROM users.profile
      WHERE user_id = $1;
    `;
    const result = await authPool.query(query, [userId]);
    return (result.rowCount ?? 0) > 0 ? result.rows[0] : null;
  }