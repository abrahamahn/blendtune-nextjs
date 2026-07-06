// main/apps/server/src/http/routes/media.ts
/**
 * Audio streaming route — range-aware proxy over the storage port (same behavior as the
 * former Next handler: candidate-key resolution, clean 404s when the object is missing).
 */

import { Readable } from 'node:stream';
import type { ReadableStream as NodeReadableStream } from 'node:stream/web';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { storage } from '@server/storage';
import { streamAudio, type AudioStream } from '@server/media';

type AudioRequest = FastifyRequest<{ Params: { file: string } }>;

async function resolveAudio(req: AudioRequest, reply: FastifyReply): Promise<AudioStream | null> {
  const { file } = req.params;
  if (!file) {
    await reply.status(400).send({ error: 'file is required' });
    return null;
  }
  if (!file.includes('.')) {
    await reply.status(400).send({ error: 'Invalid track file name' });
    return null;
  }

  const range = req.headers.range ?? null;
  const audio = await streamAudio(storage, file, range);
  if (!audio.ok) {
    await reply
      .status(audio.status)
      .send({ error: `Remote fetch failed for track: ${file}, status: ${audio.status}` });
    return null;
  }
  return audio;
}

export function registerMediaRoutes(app: FastifyInstance): void {
  // One route for GET + HEAD: HEAD cancels the upstream stream after the header probe.
  app.route({
    method: ['GET', 'HEAD'],
    url: '/audio/:file',
    handler: async (req: AudioRequest, reply) => {
      const audio = await resolveAudio(req, reply);
      if (!audio) return reply;

      reply.status(audio.status).headers(Object.fromEntries(audio.headers));
      if (req.method === 'HEAD') {
        audio.body?.cancel().catch(() => undefined);
        return reply.send();
      }
      return reply.send(
        audio.body ? Readable.fromWeb(audio.body as unknown as NodeReadableStream) : null,
      );
    },
  });
}
