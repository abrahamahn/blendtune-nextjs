// src/server/lib/core/responses.ts
import { NextResponse } from 'next/server';

/**
 * Creates a JSON response with specified data and status code
 * 
 * @param {any} data - The data to be sent in the response body
 * @param {number} [status=200] - HTTP status code (defaults to 200 OK)
 * @returns {NextResponse} Configured Next.js server response
 * @description
 * Converts data to JSON and sets appropriate content type header
 * 
 * @example
 * // Returns a 200 OK response with JSON body
 * createJsonResponse({ user: { id: 1, name: 'John' } })
 * 
 * // Returns a 201 Created response with JSON body
 * createJsonResponse({ id: 123 }, 201)
 */
export function createJsonResponse(data: any, status: number = 200): NextResponse {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Creates an error response with a custom error message
 * 
 * @param {string} message - Error message to be returned
 * @param {number} [status=500] - HTTP status code (defaults to 500 Internal Server Error)
 * @returns {NextResponse} Configured Next.js server error response
 * @description
 * Generates a standardized error response with a message and status code
 * 
 * @example
 * // Returns a 404 Not Found error response
 * errorResponse('User not found', 404)
 * 
 * // Returns a 500 Internal Server Error response
 * errorResponse('Unexpected error occurred')
 */
export function errorResponse(message: string, status = 500): NextResponse {
  return createJsonResponse({ message }, status);
}