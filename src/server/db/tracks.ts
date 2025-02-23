// src\server\db\tracks.ts
import { Pool } from 'pg';
import { configs } from '../config';

const tracksPool = new Pool({
  ...configs.tracks,
});

export default tracksPool;
