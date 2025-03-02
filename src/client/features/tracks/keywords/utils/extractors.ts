// src/client/features/tracks/keywords/utils/extractors.ts

import { Track } from '@/shared/types/track';

/**
 * Splits a string using the provided separator (default is comma), trims each item,
 * and filters out any empty values.
 *
 * @param value - The string to process.
 * @param separator - The delimiter to use when splitting (default: ',').
 * @returns Array of trimmed, non-empty strings.
 */
const splitAndTrim = (value: string, separator: string = ','): string[] => {
  return value
    .split(separator)
    .map(item => item.trim())
    .filter(item => item.length > 0);
};

/** 
 * Extracts unique artists from tracks.
 *
 * @param tracks - Array of tracks to process.
 * @returns Sorted array of unique artists.
 */
export const extractUniqueArtists = (tracks: Track[]): string[] => {
  const artistSet = new Set<string>();
  tracks.forEach(track => {
    track.info?.relatedartist?.forEach(combinedArtists => {
      if (combinedArtists) {
        splitAndTrim(combinedArtists).forEach(artist => artistSet.add(artist));
      }
    });
  });
  return Array.from(artistSet).sort();
};

/** 
 * Extracts unique moods from tracks.
 *
 * @param tracks - Array of tracks to process.
 * @returns Sorted array of unique moods.
 */
export const extractUniqueMoods = (tracks: Track[]): string[] => {
  const moodSet = new Set<string>();
  tracks.forEach(track => {
    track.info?.mood?.forEach(mood => moodSet.add(mood));
  });
  return Array.from(moodSet).sort();
};

/** 
 * Extracts unique instruments from tracks.
 *
 * @param tracks - Array of tracks to process.
 * @returns Sorted array of unique instruments.
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
 * Generates a comprehensive set of unique keywords from tracks.
 *
 * @param tracks - Array of tracks to process.
 * @returns Sorted array of unique keywords.
 */
export const extractUniqueKeywords = (tracks: Track[]): string[] => {
  const keywordSet = new Set<string>();

  // Process artists using the helper function.
  tracks.forEach(track => {
    track.info?.relatedartist?.forEach(artist => {
      if (artist) {
        splitAndTrim(artist).forEach(a => keywordSet.add(a));
      }
    });
  });

  // Add moods directly.
  tracks.forEach(track => {
    track.info?.mood?.forEach(mood => keywordSet.add(mood));
  });

  // Additional metadata.
  tracks.forEach(track => {
    if (track.metadata?.producer) keywordSet.add(track.metadata.producer);
    if (track.metadata?.title) keywordSet.add(track.metadata.title);
  });

  // Process genres.
  tracks.forEach(track => {
    track.info?.genre?.forEach(genre => {
      if (genre.maingenre) keywordSet.add(genre.maingenre);
      if (genre.subgenre) keywordSet.add(genre.subgenre);
    });
  });

  // Process instruments.
  tracks.forEach(track => {
    track.instruments?.forEach(instrument => {
      if (instrument.main) keywordSet.add(instrument.main);
      if (instrument.sub) keywordSet.add(instrument.sub);
    });
  });

  return Array.from(keywordSet).sort();
};
