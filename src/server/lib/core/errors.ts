// src\server\lib\core\errors.ts
import { NextResponse } from 'next/server';
import { createJsonResponse } from './responses';
import { HttpError } from '@server/core/errors';

/**
 * Wraps handler functions with global error handling.
 *
 * Domain errors (HttpError from @server/core) are mapped to their status + code so
 * framework-agnostic core logic can signal 4xx conditions without knowing about Next.js.
 * Anything else is a 500.
 *
 * @param handler - Async function returning NextResponse
 * @returns Wrapped function with error catching
 */
export function withErrorHandling<T extends (...args: never[]) => Promise<NextResponse>>(
  handler: T
): (...args: Parameters<T>) => Promise<NextResponse> {
  return async (...args: Parameters<T>): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof HttpError) {
        return createJsonResponse({ error: error.message, code: error.code }, error.status);
      }
      console.error('Error in handler:', error);
      return createJsonResponse({ message: 'Internal server error' }, 500);
    }
  };
}