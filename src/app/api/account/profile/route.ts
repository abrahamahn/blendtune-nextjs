// src/app/api/account/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { updateBasicProfile, type BasicProfileData } from '@server/core/account';
import { requireSession } from '@server/lib/auth/helpers';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/** POST /api/account/profile — update the authenticated user's basic profile. */
async function updateBasicProfileHandler(req: NextRequest): Promise<NextResponse> {
  if (req.method !== 'POST') {
    return createJsonResponse({ message: 'Method not allowed' }, 405);
  }

  const userId = await requireSession(req);
  const userData: BasicProfileData = await req.json();
  await updateBasicProfile(userId, userData);

  return createJsonResponse({ message: 'Profile updated successfully' }, 200);
}

export const POST = withErrorHandling(updateBasicProfileHandler);
