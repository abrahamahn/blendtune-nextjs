// src/app/api/account/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { getProfile } from '@server/core/account';
import { requireSession } from '@server/lib/auth/helpers';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/** GET /api/account — the authenticated user's profile. */
async function getProfileHandler(req: NextRequest): Promise<NextResponse> {
  const userId = await requireSession(req);

  const profile = await getProfile(userId);
  if (!profile) {
    return createJsonResponse({ message: 'Profile not found' }, 404);
  }

  return createJsonResponse(profile, 200);
}

export const GET = withErrorHandling(getProfileHandler);
