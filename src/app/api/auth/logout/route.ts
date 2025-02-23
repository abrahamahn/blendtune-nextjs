// src\app\api\auth\logout\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { extractSessionToken } from '@server/lib/auth/session';
import { logoutSession } from '@server/services/session/session';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/**
 * Handler for processing user logout.
 * - Extracts the session token from the request.
 * - Invalidates the session in the backend.
 * - Clears the session cookie in the response.
 */
async function logoutHandler(req: NextRequest): Promise<NextResponse> {
  console.log("Request received:", req.method, req.url);
  
  // Extract the session token from the incoming request.
  const sessionToken = await extractSessionToken(req);
  if (!sessionToken) {
    console.log("Unauthorized request");
    return createJsonResponse({ success: false, message: 'Unauthorized' }, 401);
  }
  
  // Invalidate the session.
  await logoutSession(sessionToken);
  console.log("User logged out successfully");
  
  // Return a success response and clear the session cookie.
  return new NextResponse(
    JSON.stringify({ success: true, message: 'Logged out successfully' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'sessionToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      },
    }
  );
}

// Export the POST handler wrapped with error handling.
export const POST = withErrorHandling(logoutHandler);
