// src/server/config/index.ts
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Database configuration interface
 * Defines the structure for database connection parameters
 */
type DBConfig = {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
};

/**
 * Configures database connection for tracks database
 * Dynamically selects between local and cloud environments
 */
const tracksConfig: DBConfig = {
  // Use cloud or local credentials based on current environment
  user: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_USER ?? '' : process.env.PG_LOCAL_USER ?? '',
  host: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_HOST ?? '' : process.env.PG_LOCAL_HOST ?? '',
  database: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_DB_TRACKS ?? '' : process.env.PG_LOCAL_DB_TRACKS ?? '',
  password: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_PW ?? '' : process.env.PG_LOCAL_PW ?? '',
  port: parseInt(process.env.NODE_ENV === 'production' ? process.env.CLOUD_PORT ?? '5432' : process.env.LOCAL_PORT ?? '5432', 10),
};

/**
 * Configures database connection for authentication database
 * Dynamically selects between local and cloud environments
 */
const authConfig: DBConfig = {
  // Use cloud or local credentials based on current environment
  user: process.env.NODE_ENV === 'production'? process.env.PG_CLOUD_USER ?? '' : process.env.PG_LOCAL_USER ?? '',
  host: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_HOST ?? '' : process.env.PG_LOCAL_HOST ?? '',
  database: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_DB_USERS ?? '' : process.env.PG_LOCAL_DB_USERS ?? '',
  password: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_PW ?? '' : process.env.PG_LOCAL_PW ?? '',
  port: parseInt(process.env.NODE_ENV === 'production' ? process.env.CLOUD_PORT ?? '5432' : process.env.LOCAL_PORT ?? '5432', 10),
};

/**
 * Exported database configurations
 * Provides access to tracks and authentication database configurations
 */
export const configs = {
  tracks: tracksConfig,
  auth: authConfig,
};