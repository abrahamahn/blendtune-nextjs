// src/app/api/auth/security/reset-password/create/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { resetPassword } from '@server/core/auth';
import { setAuthCookies } from '@server/lib/auth/cookie';
import { extractRequestMeta } from '@server/lib/auth/request';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/** POST /api/auth/security/reset-password/create — set a new password and start a session. */
async function resetPasswordCreateHandler(req: NextRequest): Promise<NextResponse> {
  if (!req.body) {
    return createJsonResponse({ message: 'Request body is required' }, 400);
  }

  const { token, newPassword } = await req.json();
  if (!token || !newPassword) {
    return createJsonResponse({ message: 'Token and new password are required' }, 400);
  }

  const tokens = await resetPassword(token, newPassword, await extractRequestMeta(req));
  const response = createJsonResponse(
    { success: true, message: 'Password reset successfully.' },
    200,
  );
  return setAuthCookies(response, tokens);
}

export const POST = withErrorHandling(resetPasswordCreateHandler);
