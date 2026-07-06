// src/server/db/repositories/refreshTokens.ts
/**
 * Refresh token repository over RawDb (auth.refresh_tokens). Stores only SHA-256
 * token hashes; rotated rows are kept until expiry so reuse can be detected.
 */

import type { RawDb } from '../client';

export interface RefreshTokenRow {
  id: string;
  user_id: string;
  token_hash: string;
  family_id: string;
  rotated_at: string | null;
  family_revoked_at: string | null;
  family_revoke_reason: string | null;
  user_agent: string | null;
  ip: string | null;
  expires_at: string;
  created_at: string;
}

export interface NewRefreshToken {
  userId: string;
  tokenHash: string;
  familyId: string;
  ip: string;
  userAgent: string;
  expiresAt: Date;
}

export interface RefreshTokensRepository {
  create(input: NewRefreshToken): Promise<void>;
  /** Unexpired row for a token hash (rotated rows included, for reuse detection), or null. */
  findByTokenHash(tokenHash: string): Promise<RefreshTokenRow | null>;
  /** Mark a token rotated. Returns false if it was already rotated (concurrent use). */
  markRotated(id: string): Promise<boolean>;
  /** Stamp every token in a family revoked. Returns rows affected. */
  revokeFamily(familyId: string, reason: string): Promise<number>;
  /** Delete expired rows and rows of revoked families. Returns rows deleted. */
  deleteExpired(): Promise<number>;
}

export function createRefreshTokensRepository(db: RawDb): RefreshTokensRepository {
  return {
    async create(input) {
      await db.execute({
        text: `INSERT INTO auth.refresh_tokens
                 (user_id, token_hash, family_id, ip, user_agent, expires_at)
               VALUES ($1,$2,$3,$4,$5,$6)`,
        values: [
          input.userId,
          input.tokenHash,
          input.familyId,
          input.ip,
          input.userAgent,
          input.expiresAt,
        ],
      });
    },

    findByTokenHash(tokenHash) {
      return db.queryOne<RefreshTokenRow>({
        text: 'SELECT * FROM auth.refresh_tokens WHERE token_hash = $1 AND expires_at > NOW()',
        values: [tokenHash],
      });
    },

    async markRotated(id) {
      const count = await db.execute({
        text: 'UPDATE auth.refresh_tokens SET rotated_at = NOW() WHERE id = $1 AND rotated_at IS NULL',
        values: [id],
      });
      return count > 0;
    },

    revokeFamily(familyId, reason) {
      return db.execute({
        text: `UPDATE auth.refresh_tokens
               SET family_revoked_at = NOW(), family_revoke_reason = $2
               WHERE family_id = $1 AND family_revoked_at IS NULL`,
        values: [familyId, reason],
      });
    },

    deleteExpired() {
      return db.execute({
        text: 'DELETE FROM auth.refresh_tokens WHERE expires_at < NOW() OR family_revoked_at IS NOT NULL',
        values: [],
      });
    },
  };
}
