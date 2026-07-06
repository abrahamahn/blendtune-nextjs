// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { login } from '@server/core/auth';
import { setAuthCookies } from '@server/lib/auth/cookie';
import { extractRequestMeta } from '@server/lib/auth/request';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/** POST /api/auth/login — verify credentials and set an HttpOnly session cookie. */
async function loginHandler(req: NextRequest): Promise<NextResponse> {
  const { email, password } = await req.json();
  if (!email || !password) {
    return createJsonResponse({ message: 'Email and password are required' }, 400);
  }

  const result = await login(email, password, await extractRequestMeta(req));
  if (!result.ok) {
    return createJsonResponse({ message: 'Invalid credentials' }, 401);
  }

  const response = createJsonResponse({ message: 'Login successful' }, 200);
  return setAuthCookies(response, result.tokens);
}

export const POST = withErrorHandling(loginHandler);
