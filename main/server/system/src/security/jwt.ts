// main/server/system/src/security/jwt.ts
/**
 * Native JWT implementation (vendored from bslt's @bslt/server-system).
 *
 * Minimal HS256 (HMAC SHA-256) JWT using Node's native crypto module.
 * Zero dependencies. Full control over token handling.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

// ============================================================================
// Types
// ============================================================================

export interface JwtHeader {
  alg: 'HS256';
  typ: 'JWT';
}

export interface JwtPayload {
  iat?: number; // Issued at (Unix timestamp)
  exp?: number; // Expiration (Unix timestamp)
  [key: string]: unknown;
}

export interface SignOptions {
  expiresIn?: string | number; // e.g., '15m', '7d', 3600
}

export interface VerifyOptions {
  /** Clock skew tolerance in seconds for distributed systems (default: 0) */
  clockToleranceSeconds?: number;
}

// ============================================================================
// Errors
// ============================================================================

export type JwtErrorCode =
  | 'INVALID_TOKEN'
  | 'INVALID_SIGNATURE'
  | 'TOKEN_EXPIRED'
  | 'MALFORMED_TOKEN';

export class JwtError extends Error {
  constructor(
    message: string,
    readonly code: JwtErrorCode,
  ) {
    super(message);
    this.name = 'JwtError';
  }
}

// ============================================================================
// Utilities
// ============================================================================

function base64UrlEncode(input: string | Buffer): string {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buffer.toString('base64url');
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf8');
}

/**
 * Parse expiration string to seconds.
 * Supports: 's' (seconds), 'm' (minutes), 'h' (hours), 'd' (days)
 */
function parseExpiration(exp: string | number): number {
  if (typeof exp === 'number') return exp;

  const match = exp.match(/^(\d+)([smhd])$/);
  if (!match?.[1] || !match[2]) {
    throw new JwtError(`Invalid expiration format: ${exp}`, 'INVALID_TOKEN');
  }

  const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  const multiplier = multipliers[match[2]];
  if (multiplier === undefined) {
    throw new JwtError(`Invalid expiration unit: ${match[2]}`, 'INVALID_TOKEN');
  }
  return parseInt(match[1], 10) * multiplier;
}

function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

// ============================================================================
// Core Functions
// ============================================================================

/** Sign a payload and create a JWT token. */
export function sign(payload: object, secret: string, options?: SignOptions): string {
  const header: JwtHeader = { alg: 'HS256', typ: 'JWT' };

  const now = nowInSeconds();
  const tokenPayload: JwtPayload = { ...payload, iat: now };

  if (options?.expiresIn !== undefined) {
    tokenPayload.exp = now + parseExpiration(options.expiresIn);
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));

  const signature = createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify a JWT token and return the payload.
 * Throws JwtError if token is invalid, expired, or signature doesn't match.
 */
export function verify(token: string, secret: string, options?: VerifyOptions): JwtPayload {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new JwtError('Invalid token format', 'MALFORMED_TOKEN');
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  if (!encodedHeader || !encodedPayload || !signature) {
    throw new JwtError('Invalid token format', 'MALFORMED_TOKEN');
  }

  // Verify the header first to ensure alg is HS256 — prevents "none" algorithm attacks.
  let header: unknown;
  try {
    header = JSON.parse(base64UrlDecode(encodedHeader));
  } catch {
    throw new JwtError('Invalid header', 'MALFORMED_TOKEN');
  }

  if (header === null || typeof header !== 'object' || Array.isArray(header)) {
    throw new JwtError('Invalid header', 'MALFORMED_TOKEN');
  }

  const headerRecord = header as Record<string, unknown>;
  if (headerRecord['alg'] !== 'HS256' || headerRecord['typ'] !== 'JWT') {
    throw new JwtError('Algorithm not supported', 'INVALID_TOKEN');
  }

  const expectedSignature = createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  const signatureBuffer = Buffer.from(signature, 'utf8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

  // Pad both buffers to equal length to prevent a timing leak on length mismatch.
  const maxLen = Math.max(signatureBuffer.length, expectedBuffer.length);
  const paddedSignature = Buffer.alloc(maxLen);
  const paddedExpected = Buffer.alloc(maxLen);
  signatureBuffer.copy(paddedSignature);
  expectedBuffer.copy(paddedExpected);

  const validSignature =
    signatureBuffer.length === expectedBuffer.length &&
    timingSafeEqual(paddedSignature, paddedExpected);

  if (!validSignature) {
    throw new JwtError('Invalid signature', 'INVALID_SIGNATURE');
  }

  let payload: JwtPayload;
  try {
    const parsed: unknown = JSON.parse(base64UrlDecode(encodedPayload));
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new JwtError('Malformed token payload', 'MALFORMED_TOKEN');
    }
    payload = parsed as JwtPayload;
  } catch (e) {
    if (e instanceof JwtError) throw e;
    throw new JwtError('Malformed token payload', 'MALFORMED_TOKEN');
  }

  if (payload.exp !== undefined) {
    const tolerance = options?.clockToleranceSeconds ?? 0;
    if (nowInSeconds() >= payload.exp + tolerance) {
      throw new JwtError('Token has expired', 'TOKEN_EXPIRED');
    }
  }

  return payload;
}

/**
 * Decode a JWT token without verification (useful for debugging).
 * WARNING: This does NOT verify the signature — never trust unverified data.
 */
export function decode(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    const encodedPayload = parts[1];
    if (parts.length !== 3 || !encodedPayload) return null;

    const parsed: unknown = JSON.parse(base64UrlDecode(encodedPayload));
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return parsed as JwtPayload;
  } catch {
    return null;
  }
}
