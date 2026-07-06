// src/app/api/audio/[file]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { storage } from '@server/storage';
import { streamAudio } from '@server/media';
import { withErrorHandling } from '@server/lib/core';

// Always dynamic so streaming/range responses are never cached.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** GET /api/audio/:file — range-aware audio stream from storage (thin adapter over media). */
async function getAudioHandler(
  req: NextRequest,
  context: { params: Promise<{ file: string }> },
): Promise<NextResponse> {
  const { file } = await context.params;
  if (!file) {
    return NextResponse.json({ error: 'file is required' }, { status: 400 });
  }
  if (!file.includes('.')) {
    return NextResponse.json({ error: 'Invalid track file name' }, { status: 400 });
  }

  const audio = await streamAudio(storage, file, req.headers.get('Range'));
  if (!audio.ok) {
    return NextResponse.json(
      { error: `Remote fetch failed for track: ${file}, status: ${audio.status}` },
      { status: audio.status },
    );
  }

  return new NextResponse(audio.body, { status: audio.status, headers: audio.headers });
}

export const GET = withErrorHandling(getAudioHandler);

// Lightweight metadata/length probe.
export const HEAD = withErrorHandling(
  async (req: NextRequest, context: { params: Promise<{ file: string }> }) => {
    const response = await getAudioHandler(req, context);
    return new NextResponse(null, { status: response.status, headers: response.headers });
  },
);
