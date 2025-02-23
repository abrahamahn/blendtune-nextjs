// src\server\services\audio\audio.ts
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
   * Builds response headers by setting common CORS, Cache, and content-related headers.
   */
  export function buildAudioResponseHeaders(
    remoteResponse: Response,
    contentType: string
  ): Headers {
    const headers = new Headers({
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      // In production you might adjust caching policies
      "Cache-Control": "public, max-age=31536000, immutable",
    });
  
    // Copy over any range-related headers from the remote response.
    for (const headerName of ["Content-Length", "Content-Range", "Accept-Ranges"]) {
      const value = remoteResponse.headers.get(headerName);
      if (value !== null) {
        headers.set(headerName, value);
      }
    }
    return headers;
  }