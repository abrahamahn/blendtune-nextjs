// src\server\services\auth\user.ts
import { authPool } from '@/server/db';

export async function getUserByEmail(email: string) {
  const result = await authPool.query(
    'SELECT * FROM auth.users WHERE email = $1',
    [email]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}