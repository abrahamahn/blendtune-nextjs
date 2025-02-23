// src\app\api\auth\login\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ipAddress } from '@vercel/functions';
import bcrypt from 'bcrypt';
import { setHttpOnlyCookie } from '@server/lib/auth/cookie';
import { getUserByEmail } from '@server/services/auth/user';
import { createSession } from '@server/services/session/session';
import { createJsonResponse, withErrorHandling } from '@server/lib/core';

/**
 * Handler for processing user login.
 * - Validates incoming credentials (email and password).
 * - Verifies user existence and password correctness.
 * - Retrieves client IP and user-agent for session logging.
 * - Creates a new session and sets a secure, HttpOnly cookie.
 */
async function loginHandler(req: NextRequest): Promise<NextResponse> {
  console.log("Request received:", req.method, req.url);
  
  // Parse and validate login credentials from the request body.
  const { email, password } = await req.json();
  if (!email || !password) {
    console.log("Email or password missing in request body");
    return createJsonResponse({ message: 'Email and password are required' }, 400);
  }

  // Retrieve the user based on the provided email.
  const user = await getUserByEmail(email);
  if (!user) {
    console.log("User not found for email:", email);
    return createJsonResponse({ message: 'Invalid credentials' }, 401);
  }

  // Validate the password against the stored hash.
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    console.log("Invalid password for email:", email);
    return createJsonResponse({ message: 'Invalid credentials' }, 401);
  }
  console.log("User logged in successfully:", email);
  
  // Retrieve the client's IP address and user-agent.
  const userIp = (await ipAddress(req)) || 'unknown';
  const userAgent = req.headers.get('user-agent') || '';
  
  // Create a new session for the authenticated user.
  const { sessionToken, expiresAt } = await createSession(user.uuid, userIp, userAgent);
  
  // Build the response and set a secure, HttpOnly cookie with the session token.
  const response = createJsonResponse({ message: 'Login successful' }, 200);
  await setHttpOnlyCookie(response, 'sessionToken', sessionToken, {
    httpOnly: true,
    path: '/',
    expires: expiresAt,
  });
  console.log("Response:", response.status);
  
  return response;
}

// Export the POST handler wrapped with error handling.
export const POST = withErrorHandling(loginHandler);
