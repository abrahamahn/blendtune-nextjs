// main/apps/server/src/http/routes/account.ts
/**
 * Account routes — profile read/update for the authenticated user.
 */

import type { FastifyInstance, FastifyRequest } from 'fastify';

import { getProfile, updateBasicProfile, type BasicProfileData } from '@server/core/account';
import { requireSession } from '../../bootstrap/context';

export function registerAccountRoutes(app: FastifyInstance): void {
  app.get('/account', async (req, reply) => {
    const userId = await requireSession(req);
    const profile = await getProfile(userId);
    if (!profile) return reply.status(404).send({ message: 'Profile not found' });
    return reply.status(200).send(profile);
  });

  app.post('/account/profile', async (req: FastifyRequest<{ Body: BasicProfileData }>, reply) => {
    const userId = await requireSession(req);
    await updateBasicProfile(userId, req.body);
    return reply.status(200).send({ message: 'Profile updated successfully' });
  });
}
