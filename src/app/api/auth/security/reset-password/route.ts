// src/app/api/auth/security/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { requestPasswordReset } from '@server/core/auth';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/** POST /api/auth/security/reset-password — begin a password reset (no enumeration). */
async function requestResetHandler(req: NextRequest): Promise<NextResponse> {
  if (!req.body) {
    return createJsonResponse({ message: 'Email is required' }, 400);
  }

  const { email } = await req.json();
  if (!email) {
    return createJsonResponse({ message: 'Email is required' }, 400);
  }

  await requestPasswordReset(email);
  return createJsonResponse(
    { message: 'If an account with that email exists, we have sent a password reset email.' },
    200,
  );
}

export const POST = withErrorHandling(requestResetHandler);
