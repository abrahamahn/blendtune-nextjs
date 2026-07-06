// src/server/cron/sessionExpire.ts
import cron from 'node-cron';

import { db } from '@server/db';

/**
 * Daily (00:00 UTC) sweep that deactivates expired sessions.
 * Fixes the previous target table bug (public.sessions → auth.sessions).
 */
cron.schedule(
  '0 0 * * *',
  async () => {
    console.log('Running daily session expiration check');
    try {
      await db.execute({
        text: "UPDATE auth.sessions SET status = 'inactive' WHERE expires_at < $1 AND status != 'inactive'",
        values: [new Date().toISOString()],
      });
      console.log('Expired sessions marked as inactive');
    } catch (error) {
      console.error('Session expiration update failed:', error);
    }
  },
  { scheduled: true, timezone: 'UTC' },
);
