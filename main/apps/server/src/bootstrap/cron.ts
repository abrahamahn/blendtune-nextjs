// main/apps/server/src/bootstrap/cron.ts
/**
 * Scheduled background jobs for the Fastify app. Wired into createServer() so they run in
 * production; guarded off during tests so the scheduler never fires under Jest.
 */

import cron from 'node-cron';

import { db } from '@server/db';
import { createRefreshTokensRepository } from '@server/db/repositories/refreshTokens';

/**
 * Register recurring jobs. Currently: a daily (00:00 UTC) sweep that prunes expired and
 * revoked refresh tokens. Rotated-but-unexpired rows are kept for token-reuse detection.
 */
export function registerCron(): void {
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
}
