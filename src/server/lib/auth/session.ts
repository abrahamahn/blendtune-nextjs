// src\server\lib\auth\session.ts
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function extractSessionToken(request: NextRequest): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('sessionToken');
  const authHeader = request.headers.get('Authorization');
  
  if (sessionCookie?.value) return sessionCookie.value;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split('Bearer ')[1];
  }
  
  return null;
}