// infra/ecosystem.bslt.config.js
// PM2 config for the bslt-stack deploy: one Fastify process serves /api AND the built SPA
// (WEB_DIST). Replaces the old Next.js `blendtune` process at cutover (M5).
module.exports = {
  apps: [
    {
      name: 'blendtune-api',
      cwd: '/var/www/blendtune',
      script: 'node_modules/.bin/tsx',
      args: 'main/apps/server/src/main.ts',
      env: {
        NODE_ENV: 'production',
        TZ: 'UTC', // matches the date-parity assumption baked into the postgres.js client
        API_PORT: 8080,
        API_HOST: '127.0.0.1',
        WEB_DIST: '/var/www/blendtune/main/apps/web/dist',
      },
      max_memory_restart: '400M',
    },
  ],
};
