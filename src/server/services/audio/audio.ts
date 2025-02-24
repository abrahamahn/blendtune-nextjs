// src\server\services\audio\audio.ts

/**
 * Fetches audio track from remote CDN
 * @param trackId - Unique identifier for the audio track
 * @param range - Optional byte range for partial content retrieval
 * @returns Fetch response from remote audio source
 */
export async function fetchRemoteAudio(
  trackId: string,
  range?: string | null
): Promise<Response> {
  const fetchOptions: RequestInit = range ? { headers: { Range: range } } : {};
  const remoteUrl = `https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/streaming/${trackId}`;
  console.log("Fetching remote audio:", remoteUrl);
  return await fetch(remoteUrl, fetchOptions);
}

/**
 * Constructs response headers for audio streaming
 * @param remoteResponse - Original response from remote source
 * @param contentType - MIME content type for the audio
 * @returns Configured Headers object
 */
export function buildAudioResponseHeaders(
  remoteResponse: Response,
  contentType: string
): Headers {
  const headers = new Headers({
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*",
    // Aggressive caching for static audio files
    "Cache-Control": "public, max-age=31536000, immutable",
  });

  // Propagate range-related headers from remote response
  for (const headerName of ["Content-Length", "Content-Range", "Accept-Ranges"]) {
    const value = remoteResponse.headers.get(headerName);
    if (value !== null) {
      headers.set(headerName, value);
    }
  }
  return headers;
}