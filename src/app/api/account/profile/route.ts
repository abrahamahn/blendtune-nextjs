// src/app/api/account/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateBasicProfile, BasicProfileData } from '@server/services/session/userProfile';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';
import { requireSession } from '@server/lib/auth/helpers';

/**
 * Handler for updating the basic profile.
 * - Verifies HTTP method is POST.
 * - Ensures the user is authenticated.
 * - Parses and validates the profile data.
 * - Updates the user profile in the database.
 */
async function updateBasicProfileHandler(req: NextRequest): Promise<NextResponse> {
  if (req.method !== 'POST') {
    return createJsonResponse({ message: 'Method not allowed' }, 405);
  }

  // Ensure the request is authenticated and get the user ID.
  const userId = await requireSession(req);

  // Parse the request body for profile data.
  const userData: BasicProfileData = await req.json();

  // Update the user's basic profile.
  await updateBasicProfile(userId, userData);

  // Return a success response.
  return createJsonResponse({ message: 'Profile updated successfully' }, 200);
}

// Export the POST handler wrapped with error handling.
export const POST = withErrorHandling(updateBasicProfileHandler);
