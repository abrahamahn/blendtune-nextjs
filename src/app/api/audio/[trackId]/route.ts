import { NextRequest, NextResponse } from 'next/server';

// Helper function to determine content type
function getContentType(extension: string): string {
  switch (extension) {
    case 'mp3':
      return 'audio/mpeg';
    case 'ogg':
      return 'audio/ogg';
    case 'flac':
      return 'audio/flac';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(req: NextRequest, { params }: { params: { trackId: string } }) {
  const trackId = params.trackId;
  const fileExtension = trackId.split('.').pop();

  if (!fileExtension) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }

  const contentType = getContentType(fileExtension);
  const range = req.headers.get('Range');

  try {
    const fetchOptions = range ? { headers: { Range: range } } : {};
    const response = await fetch(`https://blendtune-public.nyc3.digitaloceanspaces.com/tracks/${trackId}`, fetchOptions);

    if (!response.ok) {
      throw new Error(`Network response was not ok for track ID ${trackId}`);
    }

    const headers = new Headers({
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*', 
    });

    ['Content-Length', 'Content-Range', 'Accept-Ranges'].forEach(header => {
      const value = response.headers.get(header);
      if (value !== null) {
        headers.set(header, value);
      }
    });

    const status = range ? 206 : 200;

    return new NextResponse(response.body, {
      status: status,
      headers: headers,
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
