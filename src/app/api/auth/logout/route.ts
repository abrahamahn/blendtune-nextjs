// src/app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { logoutSession } from '@server/core/sessions';
import { extractSessionToken } from '@server/lib/auth/session';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/** POST /api/auth/logout — revoke the refresh-token family and clear both cookies. */
async function logoutHandler(req: NextRequest): Promise<NextResponse> {
  const sessionToken = await extractSessionToken(req);
  if (!sessionToken) {
    return createJsonResponse({ success: false, message: 'Unauthorized' }, 401);
  }

  const refreshToken = req.cookies.get('refreshToken')?.value;
  if (refreshToken) await logoutSession(refreshToken);

  const response = new NextResponse(
    JSON.stringify({ success: true, message: 'Logged out successfully' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'sessionToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      },
    },
  );
  response.headers.append(
    'Set-Cookie',
    'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
  );
  return response;
}

export const POST = withErrorHandling(logoutHandler);
