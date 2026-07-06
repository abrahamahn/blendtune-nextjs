// main/apps/server/src/bootstrap/refresh.ts
/**
 * Transparent token refresh. When the access JWT is missing/expired but a valid
 * refreshToken cookie is present, rotates the refresh token, mints a new access JWT,
 * sets both cookies on the reply, and lets the request proceed authenticated — so the
 * SPA keeps working with zero client changes.
 */

import type { FastifyInstance } from 'fastify';

import { db } from '@server/db';
import { createRefreshTokensRepository, createUsersRepository } from '@server/db/repositories';
import { rotateAuthTokens, verifyAccessToken } from '@server/core/auth';
import {
  extractRequestMeta,
  extractSessionToken,
  REFRESH_COOKIE,
  SESSION_COOKIE,
  setAuthCookies,
} from './context';

export function registerTransparentRefresh(app: FastifyInstance): void {
  app.addHook('onRequest', async (req, reply) => {
    const accessToken = extractSessionToken(req);
    if (accessToken && verifyAccessToken(accessToken)) return;

    const refreshToken = req.cookies[REFRESH_COOKIE];
    if (!refreshToken) return;

    const rotated = await rotateAuthTokens(
      createRefreshTokensRepository(db),
      refreshToken,
      (userId) => createUsersRepository(db).findEmailByUuid(userId),
      extractRequestMeta(req),
    );
    if (!rotated) return; // proceed unauthenticated; route-level auth will 401

    setAuthCookies(reply, rotated);
    // Downstream handlers read cookies from the request — swap in the fresh tokens.
    req.cookies[SESSION_COOKIE] = rotated.accessToken;
    req.cookies[REFRESH_COOKIE] = rotated.refreshToken;
  });
}
