// src\server\db\auth.ts
import { Pool } from 'pg';
import { configs } from '../config';

const authPool = new Pool({
  ...configs.auth,
});

export default authPool;