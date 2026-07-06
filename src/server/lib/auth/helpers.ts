// src/server/lib/auth/helpers.ts
import { NextRequest } from 'next/server';

import { extractSessionToken } from './session';
import { getUserIdFromSession } from '@server/core/sessions';
import { UnauthorizedError } from '@server/core/errors';

// Re-exported for callers that referenced it here previously.
export { UnauthorizedError };

/**
 * Validate the request's session and return the authenticated user's UUID.
 * Throws UnauthorizedError (→ 401 via withErrorHandling) when absent/invalid.
 */
export async function requireSession(req: NextRequest): Promise<string> {
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
