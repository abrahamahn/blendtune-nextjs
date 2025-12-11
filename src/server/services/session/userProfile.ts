// src/server/services/session/userProfile.ts
import { authPool } from '@/server/db';

/**
 * Interface representing the basic profile data for a user
 */
export interface BasicProfileData {
  /** Name of the artist or creator */
  userArtistCreatorName: string;

  /** Type of user */
  userType: string;

  /** User's occupation */
  userOccupation: string;

  /** User's gender */
  userGender: string;

  /** User's date of birth */
  userDateOfBirth: string;

  /** User's marketing consent status */
  userMarketingConsent: boolean;
}

/**
 * Updates a user's basic profile information in the database
 * 
 * @param {number} userId - The unique identifier of the user
 * @param {BasicProfileData} profileData - The profile data to update
 * @throws {Error} Will throw an error if the database update fails
 */
export async function updateBasicProfile(
  userId: number,
  profileData: BasicProfileData
): Promise<void> {
  // Destructure profile data for clarity
  const {
    userArtistCreatorName,
    userType,
    userOccupation,
    userGender,
    userDateOfBirth,
    userMarketingConsent,
  } = profileData;

  // SQL query to update user profile with all provided fields
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

  try {
    // Execute the update query with parameterized values
    await authPool.query(query, [
      userArtistCreatorName,
      userType,
      userOccupation,
      userGender,
      userDateOfBirth,
      userMarketingConsent,
      userId,
    ]);
  } catch (error) {
    // Log the error and rethrow to allow caller to handle
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Retrieves a user's profile information from the database
 * 
 * @param {number} userId - The unique identifier of the user
 * @returns {Promise<object | null>} The user's profile data or null if not found
 * @throws {Error} Will throw an error if the database query fails
 */
export async function getProfile(userId: number) {
  // SQL query to fetch all profile fields for a specific user
  const query = `
    SELECT 
      user_id, 
      artist_creator_name, 
      user_type, 
      occupation, 
      gender, 
      date_of_birth, 
      marketing_consent, 
      profile_created
    FROM users.profile
    WHERE user_id = $1;
  `;

  try {
    // Execute the query and retrieve results
    const result = await authPool.query(query, [userId]);

    // Return the first row if it exists, otherwise return null
    return (result.rowCount ?? 0) > 0 ? result.rows[0] : null;
  } catch (error) {
    // Log the error and rethrow to allow caller to handle
    console.error('Error retrieving user profile:', error);
    throw error;
  }
}