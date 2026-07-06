// src/server/media/audio.ts
/**
 * Audio streaming service (bslt @bslt/media-aligned). Resolves a requested track to a stored
 * object — trying encoding variants (.webm/.ogg/.mp3) under the streaming/ then tracks/ prefixes —
 * and builds the range-aware response headers. Storage access is abstracted behind StorageClient.
 */

import { getContentType } from '@server/lib/media/audio';
import type { StorageClient } from '@server/storage';

export interface AudioStream {
  ok: boolean;
  status: number;
  statusText: string;
  headers: Headers;
  body: ReadableStream<Uint8Array> | null;
}

const PREFIXES = ['streaming', 'tracks'] as const;

/** Candidate object keys for a requested file, in priority order. */
function candidateKeys(file: string): string[] {
  const dot = file.lastIndexOf('.');
  const base = dot > 0 ? file.slice(0, dot) : file;
  const names = Array.from(new Set([file, `${base}.webm`, `${base}.ogg`, `${base}.mp3`]));
  return PREFIXES.flatMap((prefix) => names.map((name) => `${prefix}/${name}`));
}

/** Propagate range headers from the upstream response (Content-Length/Range, Accept-Ranges). */
function buildHeaders(remote: Response, contentType: string): Headers {
  const headers = new Headers({
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store, max-age=0, must-revalidate',
    'CDN-Cache-Control': 'public, max-age=31536000, immutable',
  });
  for (const name of ['Content-Length', 'Content-Range', 'Accept-Ranges']) {
    const value = remote.headers.get(name);
    if (value !== null) headers.set(name, value);
  }
  if (!headers.has('Accept-Ranges')) headers.set('Accept-Ranges', 'bytes');
  return headers;
}

/** Resolve + stream an audio file (optionally a byte range) from storage. */
export async function streamAudio(
  storage: StorageClient,
  file: string,
  range?: string | null,
): Promise<AudioStream> {
  let remote: Response | null = null;
  for (const key of candidateKeys(file)) {
    const res = await storage.getObject(key, { range });
    remote = res;
    if (res.ok) break;
    // Keep probing only for missing/forbidden objects.
    if (res.status !== 403 && res.status !== 404) break;
  }
  const response = remote as Response;

  let contentType = getContentType(file.split('.').pop() ?? '');
  const upstream = response.headers.get('Content-Type');
  if (upstream?.toLowerCase().startsWith('audio/')) contentType = upstream;

  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    headers: buildHeaders(response, contentType),
    body: response.body,
  };
}
