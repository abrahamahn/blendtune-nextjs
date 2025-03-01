import { useState } from 'react';
import { Track } from "@shared/types/track";
import { useTrackMetadata } from '@/client/features/sounds/metadata/hooks';

/**
 * Custom hook to manage filter UI state
 * Now separated from metadata extraction concerns
 * 
 * @param tracks - Array of tracks to filter
 * @returns Filter state and UI control functions
 */
export const useFilterState = (tracks: Track[]) => {
  // Get metadata lists from the dedicated hook
  const { artistList, moodList, keywordList, instrumentList } = useTrackMetadata(tracks);
  
  // Filter UI state
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [openSortFilter, setOpenSortFilter] = useState(false);

  /**
   * Toggles the open/closed state of a filter panel
   * 
   * @param filterName - Name of the filter to toggle
   */
  const toggleFilter = (filterName: string | null) => {
    setOpenFilter((prev) => (prev === filterName ? null : filterName));
  };

  return {
    // Metadata lists from keywords module
    artistList,
    moodList,
    instrumentList,
    keywordList,
    
    // Filter UI state
    openFilter,
    setOpenFilter,
    openSortFilter,
    setOpenSortFilter,
    toggleFilter
  };
};