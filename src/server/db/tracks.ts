// src/server/db/tracks.ts
import { Pool } from 'pg';
import { configs } from '../config';

// Create a connection pool for tracks database
const tracksPool = new Pool({
  ...configs.tracks,
});

export default tracksPool;