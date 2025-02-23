// src\app\api\auth\security\reset-password\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requestPasswordReset } from '@/server/services/auth/email/reset';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/**
 * Initiates a password reset request.
 * Sends a reset email if the provided email is associated with an account.
 */
async function requestResetHandler(req: NextRequest): Promise<NextResponse> {
  // Ensure the request contains a body.
  if (!req.body) {
    return createJsonResponse({ message: 'Email is required' }, 400);
  }

  const { email } = await req.json();
  if (!email) {
    return createJsonResponse({ message: 'Email is required' }, 400);
  }

  await requestPasswordReset(email);
  return createJsonResponse({
    message: 'If an account with that email exists, we have sent a password reset email.'
  }, 200);
}

// Export POST endpoint wrapped with error handling.
export const POST = withErrorHandling(requestResetHandler);
