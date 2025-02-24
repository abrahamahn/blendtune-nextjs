// src\server\lib\auth\helpers.ts
import { NextRequest } from 'next/server';
import { extractSessionToken } from './session';
import { getUserIdFromSession } from '@server/services/session/session';

/**
 * Custom error for authentication failures
 */
export class UnauthorizedError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

/**
 * Validates user session and returns user ID
 */
export async function requireSession(req: NextRequest): Promise<number> {
  const token = await extractSessionToken(req);
  if (!token) {
    throw new UnauthorizedError('Unauthorized: No session token provided');
  }
  const userId = await getUserIdFromSession(token);
  if (!userId) {
    throw new UnauthorizedError('Unauthorized: Invalid or expired session token');
  }
  return userId;
}