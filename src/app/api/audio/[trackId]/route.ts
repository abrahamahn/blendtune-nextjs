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
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { trackId?: string } }
) {
  try {
    // 1. Validate trackId param
    const trackId = params.trackId;
    if (!trackId) {
      console.error("No trackId provided in URL params.");
      return NextResponse.json(
        { error: "trackId is required" },
        { status: 400 }
      );
    }

    // 2. Extract file extension to set Content-Type
    const fileExtension = trackId.split(".").pop();
    if (!fileExtension) {
      console.error(`Cannot parse file extension from trackId: ${trackId}`);
      return NextResponse.json(
        { error: "Invalid track file name" },
        { status: 400 }
      );
    }

    const contentType = getContentType(fileExtension);

    // 3. Handle Range requests (partial content)
    const range = req.headers.get("Range");
    const fetchOptions: RequestInit = range
      ? { headers: { Range: range } }
      : {};

    // 4. Construct remote URL on DO Spaces (or S3)
    const remoteUrl = `https://blendtune-public.nyc3.digitaloceanspaces.com/tracks/${trackId}`;

    console.log("Fetching remote audio:", remoteUrl);

    // 5. Fetch from DigitalOcean Spaces
    const response = await fetch(remoteUrl, fetchOptions);

    if (!response.ok) {
      // e.g. 404 if file not found, or 403, etc.
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

    // 6. Set up headers
    const headers = new Headers({
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      // you can set more headers if needed
    });

    // Copy over any range-related headers if present
    for (const headerName of ["Content-Length", "Content-Range", "Accept-Ranges"]) {
      const value = response.headers.get(headerName);
      if (value !== null) {
        headers.set(headerName, value);
      }
    }

    // If it’s a Range request, respond with HTTP 206 Partial Content
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
