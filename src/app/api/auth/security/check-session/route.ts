// src/app/api/auth/security/check-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { extractSessionToken } from '@server/lib/auth/session';
import { validateSession, SessionData } from '@server/services/session/session';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/**
 * Checks the validity of a session token.
 * Returns detailed session data if valid; otherwise, responds as unauthenticated.
 */
async function checkSessionHandler(req: NextRequest): Promise<NextResponse> {
  console.log("Request received:", req.method, req.url);

  // Retrieve and validate the session token from the request.
  const sessionToken = await extractSessionToken(req);
  if (!sessionToken) {
    console.log("Unauthorized request: no session token");
    return createJsonResponse({ authenticated: false }, 401);
  }

  const sessionData: SessionData | null = await validateSession(sessionToken);
  if (!sessionData) {
    console.log("Session token not found, inactive, or expired");
    return createJsonResponse({ authenticated: false }, 401);
  }

  // Construct the response payload with key session details.
  const responsePayload = {
    authenticated: true,
    username: sessionData.username,
    email: sessionData.email,
    firstName: sessionData.first_name,
    lastName: sessionData.last_name,
    artistCreatorName: sessionData.artist_creator_name,
    phoneNumber: sessionData.phone_number,
    gender: sessionData.gender,
    dateOfBirth: sessionData.date_of_birth,
    city: sessionData.city,
    state: sessionData.state,
    country: sessionData.country,
    userType: sessionData.user_type,
    occupation: sessionData.occupation,
    preferredLanguage: sessionData.preferred_language,
    marketingConsent: sessionData.marketing_consent,
    profileCreated: sessionData.profile_created,
  };

  console.log("Session token is valid and not expired");
  return createJsonResponse(responsePayload, 200);
}

// Export GET endpoint wrapped with error handling.
export const GET = withErrorHandling(checkSessionHandler);
