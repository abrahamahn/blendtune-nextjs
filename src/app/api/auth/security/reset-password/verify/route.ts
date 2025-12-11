// src\app\api\auth\security\reset-password\verify\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyResetPasswordToken } from '@/server/services/auth/resetVerification';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/**
 * Verifies a password reset token.
 * Returns a success message if the token is valid or already confirmed.
 */
async function verifyResetPasswordHandler(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  console.log("Received token:", token);

  if (!token) {
    console.log("Token is missing from request");
    return createJsonResponse({ message: 'Token is required' }, 400);
  }

  const result = await verifyResetPasswordToken(token);
  if (result.alreadyConfirmed) {
    console.log("Email already confirmed. Skipping further action.");
    return createJsonResponse({ success: true, message: 'Email is already confirmed.' }, 200);
  }

  console.log("Reset password token verified and email confirmed successfully.");
  return createJsonResponse({ success: true, message: 'Email confirmed successfully.' }, 201);
}

// Export GET endpoint wrapped with error handling.
export const GET = withErrorHandling(verifyResetPasswordHandler);
