// src/server/cron/sessionExpire.ts
import cron from 'node-cron';

import { db } from '@server/db';
import { createRefreshTokensRepository } from '@server/db/repositories/refreshTokens';

/**
 * Daily (00:00 UTC) sweep that prunes expired and revoked refresh tokens.
 * Rotated-but-unexpired rows are kept for token-reuse detection.
 */
cron.schedule(
  '0 0 * * *',
  async () => {
    console.log('Running daily refresh token cleanup');
    try {
      const deleted = await createRefreshTokensRepository(db).deleteExpired();
      console.log(`Pruned ${deleted} expired/revoked refresh tokens`);
    } catch (error) {
      console.error('Refresh token cleanup failed:', error);
    }
  },
  { scheduled: true, timezone: 'UTC' },
);
