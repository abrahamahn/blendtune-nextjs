// src\server\cron\sessionExpire.ts
const cron = require('node-cron');
const authPool = require('../db/auth');

/** 
 * Scheduled task to automatically expire user sessions
 * Runs daily at midnight UTC to deactivate sessions past their expiration
 */
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily session expiration check');
  const now = new Date().toISOString();
  const updateQuery = `
    UPDATE public.sessions
    SET status = 'inactive'
    WHERE expires_at < $1 AND status != 'inactive';
  `;
  try {
    await authPool.query(updateQuery, [now]);
    console.log('Expired sessions marked as inactive');
  } catch (error) {
    console.error('Session expiration update failed:', error);
  }
}, {
  scheduled: true,
  timezone: "UTC"
});