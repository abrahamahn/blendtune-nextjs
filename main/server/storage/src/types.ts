// src/server/storage/types.ts
/**
 * Storage client contract (bslt-aligned). A minimal read surface over an object store;
 * mirrors the shape of @bslt/storage's StorageClient so the DO Spaces provider here can be
 * swapped for bslt's S3 provider (which speaks to Spaces via a custom endpoint) at port time.
 */

export interface GetObjectOptions {
  /** HTTP Range header value for partial/streamed reads. */
  range?: string | null;
}

export interface StorageClient {
  /** Fetch an object by exact key. Returns the web `Response` (its body is the stream). */
  getObject(key: string, opts?: GetObjectOptions): Promise<Response>;
  /** Absolute public URL for a key. */
  publicUrl(key: string): string;
}
