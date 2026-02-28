// src/app/api/audio/[file]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getContentType } from "@server/lib/media/audio";
import { fetchRemoteAudio, buildAudioResponseHeaders } from "@server/services/audio/audio";
import { withErrorHandling } from "@server/lib/core/errors";

// Ensure this route is always dynamic so streaming responses aren't cached
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  let contentType = getContentType(fileExtension);

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

  // Prefer upstream only when it is clearly an audio MIME type.
  // Some object stores return generic binary types, which can break media decoding.
  const upstreamContentType = remoteResponse.headers.get("Content-Type");
  if (upstreamContentType?.toLowerCase().startsWith("audio/")) {
    contentType = upstreamContentType;
  }

  // Build response headers and determine the status code.
  // Use the upstream status so we don't return a 206 without a Content-Range
  // header when the origin doesn't support range requests.
  const headers = buildAudioResponseHeaders(remoteResponse, contentType);
  const status = remoteResponse.status;
  console.log(`Returning audio: [${status}] for track ${file}`);

  // Return the audio stream response.
  return new NextResponse(remoteResponse.body, { status, headers });
}

// Export the GET handler wrapped with error handling.
export const GET = withErrorHandling(getAudioHandler);

// Provide a lightweight HEAD handler for metadata/length probes
export const HEAD = withErrorHandling(async (req, context) => {
  const response = await getAudioHandler(req, context);
  return new NextResponse(null, { status: response.status, headers: response.headers });
});
