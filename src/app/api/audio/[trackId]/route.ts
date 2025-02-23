// src/app/api/audio/[trackId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getContentType } from "@server/lib/media/audio";
import { fetchRemoteAudio, buildAudioResponseHeaders } from "@server/services/audio/audio";
import { withErrorHandling } from "@server/lib/core/errors";

/**
 * Handler for retrieving audio streams.
 * - Extracts and validates the trackId from URL parameters.
 * - Determines the content type based on the file extension.
 * - Handles Range requests for partial content streaming.
 * - Fetches the audio from remote storage and returns the appropriate response.
 */
async function getAudioHandler(
  req: NextRequest,
  context: { params: Promise<{ trackId: string }> }
): Promise<NextResponse> {
  // Extract trackId from URL parameters.
  const { trackId } = await context.params;
  if (!trackId) {
    console.error("No trackId provided in URL params.");
    return NextResponse.json({ error: "trackId is required" }, { status: 400 });
  }

  // Extract file extension and determine content type.
  const fileExtension = trackId.split(".").pop();
  if (!fileExtension) {
    console.error(`Cannot parse file extension from trackId: ${trackId}`);
    return NextResponse.json({ error: "Invalid track file name" }, { status: 400 });
  }
  const contentType = getContentType(fileExtension);

  // Retrieve the Range header (if present) for partial content.
  const range = req.headers.get("Range");

  // Fetch the audio content from remote storage.
  const remoteResponse = await fetchRemoteAudio(trackId, range);
  if (!remoteResponse.ok) {
    console.error(
      `Failed to fetch from remote storage: [${remoteResponse.status}] ${remoteResponse.statusText}`
    );
    return NextResponse.json(
      { error: `Remote fetch failed for track: ${trackId}, status: ${remoteResponse.status}` },
      { status: remoteResponse.status }
    );
  }

  // Build response headers and determine the status code.
  const headers = buildAudioResponseHeaders(remoteResponse, contentType);
  const status = range ? 206 : 200;
  console.log(`Returning audio: [${status}] for track ${trackId}`);

  // Return the audio stream response.
  return new NextResponse(remoteResponse.body, { status, headers });
}

// Export the GET handler wrapped with error handling.
export const GET = withErrorHandling(getAudioHandler);
