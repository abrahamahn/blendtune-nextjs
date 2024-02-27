import dotenv from 'dotenv';

dotenv.config();

type DBConfig = {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
};

const tracksConfig: DBConfig = {
  user: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_USER ?? '' : process.env.PG_LOCAL_USER ?? '',
  host: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_HOST ?? '' : process.env.PG_LOCAL_HOST ?? '',
  database: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_DB_TRACKS ?? '' : process.env.PG_LOCAL_DB_TRACKS ?? '',
  password: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_PW ?? '' : process.env.PG_LOCAL_PW ?? '',
  port: parseInt(process.env.NODE_ENV === 'production' ? process.env.CLOUD_PORT ?? '5432' : process.env.LOCAL_PORT ?? '5432', 10),
};

const authConfig: DBConfig = {
  user: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_USER ?? '' : process.env.PG_LOCAL_USER ?? '',
  host: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_HOST ?? '' : process.env.PG_LOCAL_HOST ?? '',
  database: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_DB_USERS ?? '' : process.env.PG_LOCAL_DB_USERS ?? '',
  password: process.env.NODE_ENV === 'production' ? process.env.PG_CLOUD_PW ?? '' : process.env.PG_LOCAL_PW ?? '',
  port: parseInt(process.env.NODE_ENV === 'production' ? process.env.CLOUD_PORT ?? '5432' : process.env.LOCAL_PORT ?? '5432', 10),
};

export const configs = {
  tracks: tracksConfig,
  auth: authConfig,
};
