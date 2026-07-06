// src/server/lib/auth/request.ts
import { NextRequest } from 'next/server';
import { ipAddress } from '@vercel/functions';

import type { RequestMeta } from '@server/core/auth';

/** Extract client IP + user-agent from a Next request for session records. */
export async function extractRequestMeta(req: NextRequest): Promise<RequestMeta> {
  return {
    ip: (await ipAddress(req)) || 'unknown',
    userAgent: req.headers.get('user-agent') || '',
  };
}
