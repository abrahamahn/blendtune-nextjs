// src/server/services/auth/user.ts
import { authPool } from '@/server/db';

/**
 * Retrieves a user's information from the database by their email address
 * 
 * @param {string} email - The email address of the user
 * @returns {Promise<object | null>} The user's data if found, or null if no user exists
 * @throws {Error} Will throw an error if the database query fails
 */
export async function getUserByEmail(email: string) {
  try {
    // Execute query to find user by email in the auth.users table
    const result = await authPool.query(
      'SELECT * FROM auth.users WHERE email = $1',
      [email]
    );

    // Return the first user record if found, otherwise return null
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    // Log the error and rethrow to allow caller to handle
    console.error('Error retrieving user by email:', error);
    throw error;
  }
}