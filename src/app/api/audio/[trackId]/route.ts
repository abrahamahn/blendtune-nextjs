import { NextRequest, NextResponse } from "next/server";

// Helper function to determine content type
function getContentType(extension: string): string {
  switch (extension.toLowerCase()) {
    case "mp3":
      return "audio/mpeg";
    case "ogg":
      return "audio/ogg";
    case "flac":
      return "audio/flac";
    case "webm":
      return "audio/webm";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ trackId: string }> }
) {
  try {
    // Await the params to resolve the Promise (Next.js 15 change)
    const { trackId } = await context.params;

    // Validate trackId param
    if (!trackId) {
      console.error("No trackId provided in URL params.");
      return NextResponse.json(
        { error: "trackId is required" },
        { status: 400 }
      );
    }

    // Extract file extension to set Content-Type
    const fileExtension = trackId.split(".").pop();
    if (!fileExtension) {
      console.error(`Cannot parse file extension from trackId: ${trackId}`);
      return NextResponse.json(
        { error: "Invalid track file name" },
        { status: 400 }
      );
    }

    const contentType = getContentType(fileExtension);

    // Handle Range requests (partial content)
    const range = req.headers.get("Range");
    const fetchOptions: RequestInit = range
      ? { headers: { Range: range } }
      : {};

    // Construct remote URL on DO Spaces (or S3)
    const remoteUrl = `https://blendtune-public.nyc3.digitaloceanspaces.com/streaming/${trackId}`;
    console.log("Fetching remote audio:", remoteUrl);

    // Fetch from DigitalOcean Spaces (this supports streaming & range requests)
    const response = await fetch(remoteUrl, fetchOptions);

    if (!response.ok) {
      console.error(
        `Failed to fetch from DO Spaces: [${response.status}] ${response.statusText}`
      );
      return NextResponse.json(
        {
          error: `Remote fetch failed for track: ${trackId}, status: ${response.status}`,
        },
        { status: response.status }
      );
    }

    // Set up response headers
    const headers = new Headers({
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      // In production you might set a longer max-age or adjust caching per your needs:
      "Cache-Control": "public, max-age=31536000, immutable",
    });

    // Copy over any range-related headers if present from the remote response
    for (const headerName of ["Content-Length", "Content-Range", "Accept-Ranges"]) {
      const value = response.headers.get(headerName);
      if (value !== null) {
        headers.set(headerName, value);
      }
    }

    // Determine status: 206 for Range requests, 200 otherwise
    const status = range ? 206 : 200;
    console.log(`Returning audio: [${status}] for track ${trackId}`);

    return new NextResponse(response.body, {
      status,
      headers,
    });
  } catch (error) {
    console.error("Error in GET /api/audio/[trackId]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
