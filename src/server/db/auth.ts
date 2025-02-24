// src\server\db\auth.ts
import { Pool } from 'pg';
import { configs } from '../config';

/** Database connection pool for authentication services */
const authPool = new Pool({
  ...configs.auth,
});

export default authPool;