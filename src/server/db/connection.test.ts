// src/server/db/connection.test.ts
import { resolveDbConfig } from './connection';

describe('resolveDbConfig', () => {
  it('prefers DATABASE_URL verbatim when set', () => {
    const config = resolveDbConfig({
      DATABASE_URL: 'postgres://u:p@h:5432/blendtune',
      PG_LOCAL_DB: 'ignored',
    });
    expect(config).toEqual({ connectionString: 'postgres://u:p@h:5432/blendtune' });
  });

  it('uses local PG_* vars when NODE_ENV is not production', () => {
    const config = resolveDbConfig({
      NODE_ENV: 'development',
      PG_LOCAL_USER: 'local_user',
      PG_LOCAL_HOST: 'localhost',
      PG_LOCAL_DB: 'blendtune_dev',
      PG_LOCAL_PW: 'secret',
      LOCAL_PORT: '5433',
      PG_CLOUD_USER: 'cloud_user',
    });
    expect(config).toEqual({
      user: 'local_user',
      host: 'localhost',
      database: 'blendtune_dev',
      password: 'secret',
      port: 5433,
    });
  });

  it('uses cloud PG_* vars when NODE_ENV is production', () => {
    const config = resolveDbConfig({
      NODE_ENV: 'production',
      PG_CLOUD_USER: 'cloud_user',
      PG_CLOUD_HOST: 'db.example.com',
      PG_CLOUD_DB: 'blendtune',
      PG_CLOUD_PW: 'topsecret',
      CLOUD_PORT: '25060',
    });
    expect(config).toMatchObject({
      user: 'cloud_user',
      host: 'db.example.com',
      database: 'blendtune',
      password: 'topsecret',
      port: 25060,
    });
  });

  it('falls back to the legacy *_DB_USERS name (meekah is migrated into it)', () => {
    const config = resolveDbConfig({
      NODE_ENV: 'development',
      PG_LOCAL_DB_USERS: 'blendtune_users',
    });
    expect(config).toMatchObject({ database: 'blendtune_users' });
  });

  it('defaults the port to 5432 when unset', () => {
    const config = resolveDbConfig({ NODE_ENV: 'development' });
    expect(config).toMatchObject({ port: 5432 });
  });
});
