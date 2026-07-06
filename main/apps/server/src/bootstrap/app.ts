// main/apps/server/src/bootstrap/app.ts
/**
 * Fastify composition root (mirrors bslt's apps/server bootstrap, minimal profile).
 *
 * Creates the instance, registers cookie support, the domain error handler (same wire
 * format as the Next adapters: HttpError → { error, code } with its status), and all
 * /api routes.
 */

import Fastify, { type FastifyInstance } from 'fastify';
import fastifyCookie from '@fastify/cookie';

import { HttpError } from '@server/core/errors';
import { registerRoutes } from '../http/router';
import { registerTransparentRefresh } from './refresh';
import { registerStaticWeb } from './static';

export async function createServer(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'test',
    trustProxy: true,
    bodyLimit: 1024 * 1024,
  });

  await app.register(fastifyCookie);
  registerTransparentRefresh(app);

  app.setErrorHandler((error: unknown, _req, reply) => {
    if (error instanceof HttpError) {
      return reply.status(error.status).send({ error: error.message, code: error.code });
    }
    // Fastify's own errors (404 routing, body parse) carry a statusCode.
    const fastifyError = error as { statusCode?: number; message?: string };
    const status = fastifyError.statusCode ?? 500;
    if (status >= 500) app.log.error(error, 'Error in handler');
    return reply
      .status(status)
      .send({ message: status >= 500 ? 'Internal server error' : fastifyError.message });
  });

  await registerRoutes(app);
  await registerStaticWeb(app);
  return app;
}
