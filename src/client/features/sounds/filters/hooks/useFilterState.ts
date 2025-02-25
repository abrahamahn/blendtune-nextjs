// src/client/features/sounds/filters/hooks/useFilterState.ts
/**
 * Custom hook for managing filter state in sound filtering components
 * Handles track metadata extraction, filter opening/closing, and sort filter state
 * 
 * @module hooks/useFilterState
 * @author Your Name
 */

import { useState, useEffect } from 'react';
import { Track } from "@shared/types/track";
import { uniqueArtists, uniqueMoods, uniqueKeywords } from "@tracks/utils";

/**
 * A hook that manages filter state derived from track data
 * 
 * This hook:
 * - Extracts unique artists, moods, and keywords from track data
 * - Manages which filter is currently open in the UI
 * - Handles sort filter visibility
 * - Provides toggle functionality for filters
 *
 * @param {Track[]} tracks - Array of track objects to extract filter options from
 * @returns {Object} Filter state and control functions
 */
export const useFilterState = (tracks: Track[]) => {
  // State for extracted filter options from tracks
  const [artistList, setArtistList] = useState<string[]>([]);
  const [moodList, setMoodList] = useState<string[]>([]);
  const [keywordList, setKeywordList] = useState<string[]>([]);
  
  // UI state for open/closed filters
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [openSortFilter, setOpenSortFilter] = useState(false);

  /**
   * Extract unique filter options from tracks whenever tracks change
   */
  useEffect(() => {
    setArtistList(uniqueArtists(tracks));
    setMoodList(uniqueMoods(tracks));
    setKeywordList(uniqueKeywords(tracks));
  }, [tracks]);

  /**
   * Toggles the open/closed state of a filter
   * If the filter is already open, it will be closed
   * If a different filter is open, it will be closed and the selected filter opened
   * 
   * @param {string | null} filterName - Name of the filter to toggle
   */
  const toggleFilter = (filterName: string | null) => {
    setOpenFilter((prev) => (prev === filterName ? null : filterName));
  };

  return {
    artistList,
    moodList,
    keywordList,
    openFilter,
    setOpenFilter,
    openSortFilter,
    setOpenSortFilter,
    toggleFilter
  };
};