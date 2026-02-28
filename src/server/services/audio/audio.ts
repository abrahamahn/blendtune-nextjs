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
  const fetchOptions: RequestInit = {
    method: "GET",
    // Avoid any Next.js data cache interference with range/streaming requests
    cache: "no-store",
    headers: range ? { Range: range } : undefined,
  };
  const dotIndex = trackId.lastIndexOf(".");
  const baseName = dotIndex > 0 ? trackId.slice(0, dotIndex) : trackId;
  const fileNames = Array.from(
    new Set([trackId, `${baseName}.webm`, `${baseName}.ogg`, `${baseName}.mp3`])
  );
  const prefixes = ["streaming", "tracks"];
  const hosts = [
    "https://blendtune-public.nyc3.cdn.digitaloceanspaces.com",
    "https://blendtune-public.nyc3.digitaloceanspaces.com",
  ];

  const candidates: string[] = [];
  for (const host of hosts) {
    for (const prefix of prefixes) {
      for (const fileName of fileNames) {
        candidates.push(`${host}/${prefix}/${fileName}`);
      }
    }
  }

  let lastResponse: Response | null = null;
  for (const url of candidates) {
    console.log("Fetching remote audio:", url);
    const response = await fetch(url, fetchOptions);
    if (response.ok) return response;
    lastResponse = response;

    // If this is not an authorization/not-found issue, return immediately.
    if (response.status !== 403 && response.status !== 404) {
      return response;
    }
  }

  // All candidates failed with 403/404 (or similar). Return the last response.
  return lastResponse as Response;
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
    // Prevent browser disk caching of range responses; keep CDN hot via surrogate header
    "Cache-Control": "no-store, max-age=0, must-revalidate",
    "CDN-Cache-Control": "public, max-age=31536000, immutable",
  });

  // Propagate range-related headers from remote response
  for (const headerName of ["Content-Length", "Content-Range", "Accept-Ranges"]) {
    const value = remoteResponse.headers.get(headerName);
    if (value !== null) {
      headers.set(headerName, value);
    }
  }
  // Ensure browsers know range requests are supported even if the origin omits it
  if (!headers.has("Accept-Ranges")) {
    headers.set("Accept-Ranges", "bytes");
  }
  return headers;
}
