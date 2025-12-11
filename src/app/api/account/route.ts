// src\app\api\account\profile\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@server/services/session/userProfile';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';
import { requireSession } from '@server/lib/auth/helpers';

/**
 * Handler for retrieving the user profile.
 * - Ensures the request is authenticated.
 * - Fetches the user profile.
 * - Returns the profile data or a 404 if not found.
 */
async function getProfileHandler(req: NextRequest): Promise<NextResponse> {
  // Ensure the request is authenticated and get the user ID.
  const userId = await requireSession(req);

  // Retrieve the user's profile.
  const profile = await getProfile(userId);
  if (!profile) {
    return createJsonResponse({ message: 'Profile not found' }, 404);
  }
  
  // Return the profile data.
  return createJsonResponse(profile, 200);
}

// Export the GET handler wrapped with error handling.
export const GET = withErrorHandling(getProfileHandler);
