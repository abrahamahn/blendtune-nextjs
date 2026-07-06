// src/app/api/auth/security/check-session/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { validateSession, type SessionData } from '@server/core/sessions';
import { extractSessionToken } from '@server/lib/auth/session';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/** GET /api/auth/security/check-session — return session/profile data when authenticated. */
async function checkSessionHandler(req: NextRequest): Promise<NextResponse> {
  const sessionToken = await extractSessionToken(req);
  if (!sessionToken) {
    return createJsonResponse({ authenticated: false }, 401);
  }

  const sessionData: SessionData | null = await validateSession(sessionToken);
  if (!sessionData) {
    return createJsonResponse({ authenticated: false }, 401);
  }

  return createJsonResponse(
    {
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
    },
    200,
  );
}

export const GET = withErrorHandling(checkSessionHandler);
