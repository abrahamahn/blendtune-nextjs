// src\server\lib\core\errors.ts
import { NextResponse } from 'next/server';
import { createJsonResponse } from './responses';

export function withErrorHandling<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): (...args: Parameters<T>) => Promise<NextResponse> {
  return async (...args: Parameters<T>): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('Error in handler:', error);
      return createJsonResponse({ message: 'Internal server error' }, 500);
    }
  };
}
