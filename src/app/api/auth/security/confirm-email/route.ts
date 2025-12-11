// src/app/api/auth/security/confirm-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { setHttpOnlyCookie } from '@server/lib/auth/cookie';
import { confirmEmail } from '@server/services/auth/email/confirmation';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/**
 * Confirms a user's email using a token from the query string.
 * If the email is already confirmed, it returns a success message;
 * otherwise, it confirms the email and creates a new session.
 */
async function confirmEmailHandler(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  console.log("Received token:", token);

  if (!token) {
    console.log("Token is missing from request");
    return createJsonResponse({ message: 'Token is required' }, 400);
  }

  const result = await confirmEmail(token, req);

  // If already confirmed, no new session is created.
  if (result.alreadyConfirmed) {
    console.log("Email already confirmed. Skipping session creation.");
    return createJsonResponse({ success: true, message: 'Email is already confirmed.' }, 200);
  }

  console.log("Email confirmed and session created.");
  const response = createJsonResponse({ success: true, message: 'Email confirmed successfully.' }, 201);
  return setHttpOnlyCookie(response, 'sessionToken', result.sessionToken!, {
    httpOnly: true,
    path: '/',
    expires: result.expiresAt!,
  });
}

// Export GET endpoint wrapped with error handling.
export const GET = withErrorHandling(confirmEmailHandler);
