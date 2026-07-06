// infra/ecosystem.bslt.config.js
// PM2 config for the bslt-stack deploy: one Fastify process serves /api AND the built SPA
// (WEB_DIST). Replaces the old Next.js `blendtune` process at cutover (M5).
module.exports = {
  apps: [
    {
      name: 'blendtune-api',
      cwd: '/var/www/blendtune',
      // Run tsx's JS CLI via node — PM2 fork-loads `script` as a Node module, so the
      // .bin/tsx shell wrapper can't be used directly.
      script: 'node_modules/tsx/dist/cli.mjs',
      args: 'main/apps/server/src/main.ts',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        TZ: 'UTC', // matches the date-parity assumption baked into the postgres.js client
        API_PORT: 8080,
        API_HOST: '0.0.0.0',
        WEB_DIST: '/var/www/blendtune/main/apps/web/dist',
      },
      max_memory_restart: '400M',
    },
  ],
};
