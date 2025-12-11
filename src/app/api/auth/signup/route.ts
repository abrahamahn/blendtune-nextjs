// src\app\api\auth\signup\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signUpUser, SignUpData } from '@server/services/auth/signup';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/**
 * Handles user signup requests.
 * - Parses signup data from the request body.
 * - Calls the signup service and returns the resulting status and message.
 */
async function signUpHandler(req: NextRequest): Promise<NextResponse> {
  // Extract signup details from the request
  const { firstName, lastName, email, username, password } = await req.json();
  const signUpData: SignUpData = { firstName, lastName, email, username, password };

  // Process the signup and generate the response payload
  const result = await signUpUser(signUpData);
  return createJsonResponse(
    {
      message: result.message,
      userId: result.userId,
      redirectToVerifyEmail: result.redirectToVerifyEmail,
    },
    result.status
  );
}

// Export the POST endpoint with error handling applied.
export const POST = withErrorHandling(signUpHandler);
