import { NextRequest, NextResponse } from 'next/server';
import tracksPool from '../../../../server/db/tracks';

interface Track {
  id: number;
  release: string;
  file_public: string;
  track_catalog: string;
  track_title: string;
  track_producer: string;
  duration: string;
  bpm: string;
  note: string;
  scale: string;
  main_genre_1: string;
  sub_genre_1: string;
  main_genre_2: string;
  sub_genre_2: string;
  related_artist_1: string;
  related_artist_2: string;
  related_artist_3: string;
  mood_1: string;
  mood_2: string;
  mood_3: string;
  instrument_1: string;
  instrument_category_1: string;
  instrument_2: string;
  instrument_category_2: string;
  instrument_3: string;
  instrument_category_3: string;
  instrument_4: string;
  instrument_category_4: string;
  instrument_5: string;
  instrument_category_5: string;
}

export async function GET(request: NextRequest) {
  try {
    const client = await tracksPool.connect();
    const result = await client.query('SELECT * FROM meekah.track_info;');
    let trackInfo = result.rows;
    client.release();

    trackInfo = trackInfo.map((track: Track, index: number) => ({
      ...track,
      id: index + 1
    }));

    const formattedTrackInfo = trackInfo.reduce((acc: Record<string, any>, track: Track) => {
      acc[track.id] = {
        id: track.id,
        file: track.file_public,
        metadata: {
          catalog: track.track_catalog,
          title: track.track_title,
          release: track.release,
          producer: track.track_producer
        },
        info: {
          duration: track.duration,
          bpm: track.bpm,
          key: {
            note: track.note,
            scale: track.scale
          },
          genre: [
            { maingenre: track.main_genre_1, subgenre: track.sub_genre_1 },
            { maingenre: track.main_genre_2, subgenre: track.sub_genre_2 }
          ],
          relatedartist: [ track.related_artist_1, track.related_artist_2, track.related_artist_3
          ],
          mood: [ track.mood_1, track.mood_2, track.mood_3
          ],
          instruments: [
            {
              main: track.instrument_1,
              sub: track.instrument_category_1
            },
            {
              main: track.instrument_2,
              sub: track.instrument_category_2
            },
            {
              main: track.instrument_3,
              sub: track.instrument_category_3
            },
            {
              main: track.instrument_4,
              sub: track.instrument_category_4
            },
            {
              main: track.instrument_5,
              sub: track.instrument_category_5
            },
          ]
        },
      };
      return acc;
    }, {});

    return NextResponse.json(formattedTrackInfo);
  } catch (error) {
    console.error('Error fetching track info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
