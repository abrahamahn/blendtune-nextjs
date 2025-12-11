// src/server/lib/auth/session.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Extracts session token from cookies or Authorization header
 * @returns Session token or null if not found
 */
export async function extractSessionToken(request: NextRequest): Promise<string | null> {
  // Retrieve session token from cookies
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('sessionToken');
  
  // Check Authorization header for bearer token
  const authHeader = request.headers.get('Authorization');
  
  // Prioritize cookie token, then Authorization header
  if (sessionCookie?.value) return sessionCookie.value;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split('Bearer ')[1];
  }
  
  return null;
}