// src/app/api/audio/[file]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getContentType } from "@server/lib/media/audio";
import { fetchRemoteAudio, buildAudioResponseHeaders } from "@server/services/audio/audio";
import { withErrorHandling } from "@server/lib/core/errors";

/**
 * Handler for retrieving audio streams.
 * - Extracts and validates the file from URL parameters.
 * - Determines the content type based on the file extension.
 * - Handles Range requests for partial content streaming.
 * - Fetches the audio from remote storage and returns the appropriate response.
 */
async function getAudioHandler(
  req: NextRequest,
  context: { params: Promise<{ file: string }> }
): Promise<NextResponse> {
  // Extract file from URL parameters.
  const { file } = await context.params;

  if (!file) {
    console.error("No file provided in URL params.");
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  // Extract file extension and determine content type.
  const fileExtension = file.split(".").pop();
  if (!fileExtension) {
    console.error(`Cannot parse file extension from file: ${file}`);
    return NextResponse.json({ error: "Invalid track file name" }, { status: 400 });
  }
  const contentType = getContentType(fileExtension);

  // Retrieve the Range header (if present) for partial content.
  const range = req.headers.get("Range");

  // Fetch the audio content from remote storage.
  const remoteResponse = await fetchRemoteAudio(file, range);
  if (!remoteResponse.ok) {
    console.error(
      `Failed to fetch from remote storage: [${remoteResponse.status}] ${remoteResponse.statusText}`
    );
    return NextResponse.json(
      { error: `Remote fetch failed for track: ${file}, status: ${remoteResponse.status}` },
      { status: remoteResponse.status }
    );
  }

  // Build response headers and determine the status code.
  const headers = buildAudioResponseHeaders(remoteResponse, contentType);
  const status = range ? 206 : 200;
  console.log(`Returning audio: [${status}] for track ${file}`);

  // Return the audio stream response.
  return new NextResponse(remoteResponse.body, { status, headers });
}

// Export the GET handler wrapped with error handling.
export const GET = withErrorHandling(getAudioHandler);
