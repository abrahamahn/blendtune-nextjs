// src/middleware.ts
/**
 * Resolve the creator workspace from a /c/:slug path and forward it to route handlers as the
 * x-tenant-slug header (consumed by getRequestContext). Inert for all other paths, so existing
 * routes are unaffected until the creator surface (Phase 5+) is built.
 */

import { NextRequest, NextResponse } from 'next/server';

import { TENANT_SLUG_HEADER } from '@server/core/context/header';

const TENANT_PATH = /^\/c\/([a-z0-9-]+)/i;

export function middleware(req: NextRequest): NextResponse {
  const match = req.nextUrl.pathname.match(TENANT_PATH);
  if (!match) return NextResponse.next();

  const headers = new Headers(req.headers);
  headers.set(TENANT_SLUG_HEADER, match[1]);
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ['/c/:path*'] };
