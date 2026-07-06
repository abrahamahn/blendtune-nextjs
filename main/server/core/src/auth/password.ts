// main/server/core/src/auth/password.ts
/**
 * Password hashing utilities (vendored from bslt's auth/utils/password.ts).
 *
 * Argon2id (OWASP recommended params) for all new hashes. Legacy bcrypt hashes
 * ($2…) are still verifiable so logins can lazily upgrade them to Argon2id.
 */

import argon2, { type Options } from 'argon2';
import bcrypt from 'bcrypt';

/** OWASP-recommended Argon2id parameters. */
const ARGON2_OPTIONS: Options = {
  type: argon2.argon2id,
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
};

/** Hash a password using Argon2id (OWASP recommended). */
export function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

/** True when the stored hash is a legacy bcrypt hash. */
export function isBcryptHash(hash: string): boolean {
  return hash.startsWith('$2');
}

/**
 * Verify a password against a stored hash, dispatching on hash format:
 * bcrypt for legacy `$2…` hashes, Argon2id otherwise. Never throws.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return isBcryptHash(hash) ? await bcrypt.compare(password, hash) : await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

/** True when the hash should be regenerated (legacy bcrypt or outdated Argon2 params). */
export function needsRehash(hash: string): boolean {
  if (!hash.startsWith('$argon2')) return true;
  return argon2.needsRehash(hash, ARGON2_OPTIONS);
}
