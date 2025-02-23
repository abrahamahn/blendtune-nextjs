// src/app/api/auth/security/reset-password/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { setHttpOnlyCookie } from '@server/lib/auth/cookie';
import { resetPassword } from '@server/services/auth/resetPassword';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/**
 * Resets the user password using a valid reset token.
 * On success, it also creates a session and sets an HttpOnly cookie.
 */
async function resetPasswordCreateHandler(req: NextRequest): Promise<NextResponse> {
  // Verify that a request body is present.
  if (!req.body) {
    return createJsonResponse({ message: 'Request body is required' }, 400);
  }

  const { token, newPassword } = await req.json();
  if (!token || !newPassword) {
    return createJsonResponse({ message: 'Token and new password are required' }, 400);
  }

  // Attempt to reset the password and create a session.
  const { sessionToken, expiresAt } = await resetPassword(token, newPassword, req);
  const response = createJsonResponse({ success: true, message: 'Password reset successfully.' }, 200);
  return setHttpOnlyCookie(response, 'sessionToken', sessionToken, {
    httpOnly: true,
    path: '/',
    expires: expiresAt,
  });
}

// Export POST endpoint wrapped with error handling.
export const POST = withErrorHandling(resetPasswordCreateHandler);
