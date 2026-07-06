// src/server/storage/spaces.ts
/**
 * DigitalOcean Spaces storage provider (S3-compatible, public bucket). Fetches an exact key,
 * trying each configured host (CDN edge, then origin) and falling through on 403/404 only.
 * Reads are unauthenticated (public bucket); swap for bslt's signed S3 provider for private keys.
 */

import type { GetObjectOptions, StorageClient } from './types';

export interface SpacesConfig {
  /** Ordered hosts to try (e.g. CDN edge first, then origin). */
  hosts: string[];
}

export function createSpacesStorage(config: SpacesConfig): StorageClient {
  const [primary] = config.hosts;

  return {
    async getObject(key, opts?: GetObjectOptions): Promise<Response> {
      const init: RequestInit = {
        method: 'GET',
        cache: 'no-store', // never let Next's data cache touch range/streaming reads
        headers: opts?.range ? { Range: opts.range } : undefined,
      };

      let last: Response | null = null;
      for (const host of config.hosts) {
        let res: Response;
        try {
          res = await fetch(`${host}/${key}`, init);
        } catch {
          // Network error (DNS/timeout, e.g. an unreachable CDN host or a missing bucket):
          // treat as a failed candidate and try the next host rather than throwing a 500.
          last = new Response(null, { status: 502, statusText: 'Bad Gateway' });
          continue;
        }
        if (res.ok) return res;
        last = res;
        // Only a missing/forbidden object is worth trying the next host for.
        if (res.status !== 403 && res.status !== 404) return res;
      }
      return last ?? new Response(null, { status: 502, statusText: 'Bad Gateway' });
    },

    publicUrl(key) {
      return `${primary}/${key}`;
    },
  };
}
