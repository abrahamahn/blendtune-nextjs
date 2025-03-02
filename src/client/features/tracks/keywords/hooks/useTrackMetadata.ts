import { useMemo } from 'react';
import { Track } from "@/shared/types/track";
import {
  extractUniqueArtists,
  extractUniqueMoods,
  extractUniqueInstruments,
  extractUniqueKeywords
} from '@tracks/keywords/utils';

/**
 * Custom hook to extract and manage metadata from track collection
 * 
 * @param tracks - Array of tracks to extract metadata from
 * @returns Object containing extracted metadata lists
 */
export const useTrackMetadata = (tracks: Track[]) => {
  // Use useMemo to memoize metadata extraction and prevent unnecessary recomputations
  return useMemo(() => {
    // If no tracks, return empty lists
    if (tracks.length === 0) {
      return {
        artistList: [],
        moodList: [],
        instrumentList: [],
        keywordList: []
      };
    }

    // Extract metadata lists
    return {
      artistList: extractUniqueArtists(tracks),
      moodList: extractUniqueMoods(tracks),
      instrumentList: extractUniqueInstruments(tracks),
      keywordList: extractUniqueKeywords(tracks)
    };
  }, [tracks]); // Only recompute when tracks array changes
};