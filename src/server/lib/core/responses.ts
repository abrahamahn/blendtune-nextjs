// src\server\lib\core\responses.ts
import { NextResponse } from 'next/server';

export function createJsonResponse(data: any, status: number = 200): NextResponse {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function errorResponse(message: string, status = 500): NextResponse {
    return createJsonResponse({ message }, status);
  }