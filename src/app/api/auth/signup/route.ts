// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { signUpUser, type SignUpData } from '@server/core/auth';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/** POST /api/auth/signup — create a user (or resend verification / conflict). */
async function signUpHandler(req: NextRequest): Promise<NextResponse> {
  const { firstName, lastName, email, username, password } = await req.json();
  const signUpData: SignUpData = { firstName, lastName, email, username, password };

  const result = await signUpUser(signUpData);
  return createJsonResponse(
    {
      message: result.message,
      userId: result.userId,
      redirectToVerifyEmail: result.redirectToVerifyEmail,
    },
    result.status,
  );
}

export const POST = withErrorHandling(signUpHandler);
