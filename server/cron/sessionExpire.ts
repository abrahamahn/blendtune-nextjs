const cron = require('node-cron');
const authPool = require('../db/auth');

cron.schedule('0 0 * * *', async () => {
  console.log('Running a task every day at 12:00 AM UTC to check for expired sessions');
  const now = new Date().toISOString();
  const updateQuery = `
    UPDATE public.sessions
    SET status = 'inactive'
    WHERE expires_at < $1 AND status != 'inactive';
  `;
  try {
    await authPool.query(updateQuery, [now]);
    console.log('Expired sessions have been marked as inactive');
  } catch (error) {
    console.error('Error updating expired sessions:', error);
  }
}, {
  scheduled: true,
  timezone: "UTC"
});
