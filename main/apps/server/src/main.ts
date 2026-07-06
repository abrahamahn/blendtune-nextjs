// main/apps/server/src/main.ts
/**
 * Server entry — load env, build the Fastify app, listen. Mirrors bslt's tiny main.ts.
 */

import '@shared/config/loadEnv';

import { createServer } from './bootstrap/app';

const PORT = Number(process.env.API_PORT ?? 8080);
const HOST = process.env.API_HOST ?? '127.0.0.1';

async function start(): Promise<void> {
  const app = await createServer();

  const shutdown = async (signal: string): Promise<void> => {
    app.log.info(`${signal} received, shutting down`);
    await app.close();
    process.exit(0);
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));

  await app.listen({ port: PORT, host: HOST });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
