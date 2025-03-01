import { useState, useEffect } from 'react';
import { Track } from "@shared/types/track";
import {
  extractUniqueArtists,
  extractUniqueMoods,
  extractUniqueInstruments,
  extractUniqueKeywords
} from '@keywords/utils';

/**
 * Custom hook to extract and manage metadata from track collection
 * 
 * @param tracks - Array of tracks to extract metadata from
 * @returns Object containing extracted metadata lists
 */
export const useTrackMetadata = (tracks: Track[]) => {
  const [artistList, setArtistList] = useState<string[]>([]);
  const [moodList, setMoodList] = useState<string[]>([]);
  const [instrumentList, setInstrumentList] = useState<string[]>([]);
  const [keywordList, setKeywordList] = useState<string[]>([]);

  useEffect(() => {
    if (tracks.length > 0) {
      setArtistList(extractUniqueArtists(tracks));
      setMoodList(extractUniqueMoods(tracks));
      setInstrumentList(extractUniqueInstruments(tracks));
      setKeywordList(extractUniqueKeywords(tracks));
    } else {
      // Reset lists when no tracks are available
      setArtistList([]);
      setMoodList([]);
      setInstrumentList([]);
      setKeywordList([]);
    }
  }, [tracks]);

  return {
    artistList,
    moodList,
    instrumentList,
    keywordList
  };
};