// src/app/api/auth/security/reset-password/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { verifyResetPasswordToken } from '@server/core/auth';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/** GET /api/auth/security/reset-password/verify — verify a reset token, confirming email. */
async function verifyResetPasswordHandler(req: NextRequest): Promise<NextResponse> {
  const token = new URL(req.url).searchParams.get('token');
  if (!token) {
    return createJsonResponse({ message: 'Token is required' }, 400);
  }

  const result = await verifyResetPasswordToken(token);
  if (result.alreadyConfirmed) {
    return createJsonResponse({ success: true, message: 'Email is already confirmed.' }, 200);
  }

  return createJsonResponse({ success: true, message: 'Email confirmed successfully.' }, 201);
}

export const GET = withErrorHandling(verifyResetPasswordHandler);
