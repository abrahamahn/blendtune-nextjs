import { Track } from '@/shared/types/track';

/** 
 * Extracts unique artists from tracks 
 * @param tracks - Array of tracks to process
 * @returns Sorted array of unique artists
 */
export const extractUniqueArtists = (tracks: Track[]): string[] => {
  const artistSet = new Set<string>();
  tracks.forEach(track => {
    track.info?.relatedartist?.forEach(combinedArtists => {
      if (combinedArtists) {
        combinedArtists.split(',').forEach(artist => {
          artistSet.add(artist.trim());
        });
      }
    });
  });

  return Array.from(artistSet).sort();
};

/** 
 * Extracts unique moods from tracks
 * @param tracks - Array of tracks to process
 * @returns Sorted array of unique moods
 */
export const extractUniqueMoods = (tracks: Track[]): string[] => {
  const moodSet = new Set<string>();
  tracks.forEach(track => {
    track.info?.mood?.forEach(mood => {
      moodSet.add(mood);
    });
  });

  return Array.from(moodSet).sort();
};

/** 
 * Extracts unique instruments from tracks
 * @param tracks - Array of tracks to process
 * @returns Sorted array of unique instruments
 */
export const extractUniqueInstruments = (tracks: Track[]): string[] => {
  const instrumentSet = new Set<string>();
  tracks.forEach(track => {
    track.instruments?.forEach(instrument => {
      if (instrument.main) instrumentSet.add(instrument.main);
    });
  });

  return Array.from(instrumentSet).sort();
};

/** 
 * Generates comprehensive set of unique keywords from tracks
 * @param tracks - Array of tracks to process
 * @returns Sorted array of unique keywords
 */
export const extractUniqueKeywords = (tracks: Track[]): string[] => {
  const keywordSet = new Set<string>();

  // Extract keywords from various track attributes
  tracks.forEach(track => {
    // Artists
    track.info?.relatedartist?.forEach(artist => {
      if (artist) {
        artist.split(',').forEach(a => keywordSet.add(a.trim()));
      }
    });

    // Moods
    track.info?.mood?.forEach(mood => keywordSet.add(mood));

    // Additional metadata
    if (track.metadata?.producer) keywordSet.add(track.metadata.producer);
    if (track.metadata?.title) keywordSet.add(track.metadata.title);

    // Genres
    track.info?.genre?.forEach(genre => {
      if (genre.maingenre) keywordSet.add(genre.maingenre);
      if (genre.subgenre) keywordSet.add(genre.subgenre);
    });

    // Instruments
    track.instruments?.forEach(instrument => {
      if (instrument.main) keywordSet.add(instrument.main);
      if (instrument.sub) keywordSet.add(instrument.sub);
    });
  });

  return Array.from(keywordSet).sort();
};