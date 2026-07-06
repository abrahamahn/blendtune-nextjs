// src/app/api/auth/security/confirm-email/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { confirmEmail } from '@server/core/auth';
import { setHttpOnlyCookie } from '@server/lib/auth/cookie';
import { extractRequestMeta } from '@server/lib/auth/request';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/** GET /api/auth/security/confirm-email — confirm an email and start a session. */
async function confirmEmailHandler(req: NextRequest): Promise<NextResponse> {
  const token = new URL(req.url).searchParams.get('token');
  if (!token) {
    return createJsonResponse({ message: 'Token is required' }, 400);
  }

  const result = await confirmEmail(token, await extractRequestMeta(req));
  if (result.alreadyConfirmed) {
    return createJsonResponse({ success: true, message: 'Email is already confirmed.' }, 200);
  }

  const response = createJsonResponse(
    { success: true, message: 'Email confirmed successfully.' },
    201,
  );
  return setHttpOnlyCookie(response, 'sessionToken', result.sessionToken!, {
    httpOnly: true,
    path: '/',
    expires: result.expiresAt!,
  });
}

export const GET = withErrorHandling(confirmEmailHandler);
