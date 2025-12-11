// src/client/features/sounds/filters/context.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  ReactNode
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@core/store';
import { Track } from '@/shared/types/track';
import {
  setMinTempo,
  setMaxTempo,
  setIncludeHalfTime,
  setIncludeDoubleTime,
  setSelectedKeys,
  setSelectedScale,
  setKeyFilterCombinations,
  setGenres,
  setSelectedArtists,
  setSelectedInstruments,
  setSelectedMoods,
  clearAllFilters as clearAllFiltersAction,
} from '@store/slices';
import {
  categoryFilter,
  keyFilter,
  tempoFilter,
  genreFilter,
  artistFilter,
  instrumentFilter,
  moodFilter,
  keywordFilter
} from '@/client/features/sounds/filters/utils/filterLogic';
import { sortTracks } from '@/client/features/sounds/filters/utils/sortLogic';
import { useTracks } from "@/client/features/tracks";
import { useTrackMetadata } from "@tracks/keywords/hooks";
import type { KeyFilterCombination } from '@store/slices';

/**
 * Filter context state interface
 */
interface FilterContextState {
  // Unique filter options derived from tracks
  artistList: string[];
  moodList: string[];
  instrumentList: string[];
  keywordList: string[];

  // Tempo filter state
  minTempo: number;
  maxTempo: number;
  includeHalfTime: boolean;
  includeDoubleTime: boolean;
  
  // Key filter state
  selectedKeys: string;
  selectedScale: string;
  keyFilterCombinations: KeyFilterCombination[];
  
  // Category filter state
  selectedCategory: string;
  selectedGenres: string[];
  
  // Artist filter state
  selectedArtists: string[];
  
  // Instrument filter state
  selectedInstruments: string[];
  
  // Mood filter state
  selectedMoods: string[];
  
  // Keyword filter state
  selectedKeywords: string[];
  
  // UI state
  openFilter: string | null;
  openSortFilter: boolean;
  sortBy: string;
  
  // Filter state setters
  setMinTempo: (value: number) => void;
  setMaxTempo: (value: number) => void;
  setIncludeHalfTime: (value: boolean) => void;
  setIncludeDoubleTime: (value: boolean) => void;
  setSelectedKeys: (value: string) => void;
  setSelectedScale: (value: string) => void;
  setKeyFilterCombinations: React.Dispatch<React.SetStateAction<KeyFilterCombination[]>>;
  setSelectedGenres: (genres: string[]) => void;
  setSelectedArtists: (artists: string[]) => void;
  setSelectedInstruments: (instruments: string[]) => void;
  setSelectedMoods: (moods: string[]) => void;
  setSelectedKeywords: (keywords: string[]) => void;
  handleSortChange: (option: string) => void;
  
  // UI state setters
  setOpenFilter: (filterName: string | null) => void;
  setOpenSortFilter: (isOpen: boolean) => void;
  setSortBy: (sortOption: string) => void;
  
  // Combined actions
  clearAllFilters: () => void;
  toggleFilter: (filterName: string) => void;
  setSelectedCategory: (category: string) => void;

  // Filtered and sorted tracks based on applied filters
  filteredTracks: Track[];
}

/**
 * Props for the FilterProvider component
 */
interface FilterProviderProps {
  children: ReactNode;
}

// Create the context with a default undefined value
const FilterContext = createContext<FilterContextState | undefined>(undefined);

/**
 * Custom hook to use the filter context
 * @returns {FilterContextState} The filter context state and actions
 * @throws {Error} If used outside of a FilterProvider
 */
export const useFilterContext = (): FilterContextState => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};

/**
 * Provider component for the filter context
 * 
 * @param {FilterProviderProps} props - The provider props
 * @returns {JSX.Element} The provider component
 */
export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const dispatch = useDispatch();

  // Get tracks from the TracksProvider using the hook
  const { tracks } = useTracks();

  // Get all filter state from Redux
  const {
    minTempo,
    maxTempo,
    includeHalfTime,
    includeDoubleTime,
    selectedKeys,
    selectedScale,
    keyFilterCombinations,
    category: selectedCategory,
    genres: selectedGenres,
    selectedArtists,
    selectedInstruments,
    selectedMoods,
    keywords: selectedKeywords,
  } = useSelector((state: RootState) => state.tracks.filters);

  // Keep latest key combinations without forcing rerenders
  const keyFilterCombinationsRef = useRef<KeyFilterCombination[]>(keyFilterCombinations);

  useEffect(() => {
    keyFilterCombinationsRef.current = keyFilterCombinations;
  }, [keyFilterCombinations]);

  // Get track metadata using the dedicated hook from keywords feature
  const { artistList, moodList, instrumentList, keywordList } = useTrackMetadata(tracks);

  // UI state (local - not in Redux)
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [openSortFilter, setOpenSortFilter] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('Newest');

  // Create wrapper functions for Redux dispatch actions
  const handleSetMinTempo = useCallback((value: number) => {
    dispatch(setMinTempo(value));
  }, [dispatch]);

  const handleSetMaxTempo = useCallback((value: number) => {
    dispatch(setMaxTempo(value));
  }, [dispatch]);

  const handleSetIncludeHalfTime = useCallback((value: boolean) => {
    dispatch(setIncludeHalfTime(value));
  }, [dispatch]);

  const handleSetIncludeDoubleTime = useCallback((value: boolean) => {
    dispatch(setIncludeDoubleTime(value));
  }, [dispatch]);

  const handleSetSelectedKeys = useCallback((value: string) => {
    dispatch(setSelectedKeys(value));
  }, [dispatch]);

  const handleSetSelectedScale = useCallback((value: string) => {
    dispatch(setSelectedScale(value));
  }, [dispatch]);

  const handleSetKeyFilterCombinations = useCallback((value: React.SetStateAction<KeyFilterCombination[]>) => {
    const newValue = typeof value === 'function'
      ? value(keyFilterCombinationsRef.current)
      : value;

    const currentValue = keyFilterCombinationsRef.current;
    const hasChanged =
      newValue.length !== currentValue.length ||
      newValue.some((combo, index) =>
        combo.key !== currentValue[index]?.key ||
        combo['key.note'] !== currentValue[index]?.['key.note'] ||
        combo['key.scale'] !== currentValue[index]?.['key.scale']
      );

    if (!hasChanged) {
      return;
    }

    dispatch(setKeyFilterCombinations(newValue));
  }, [dispatch]);

  const handleSetSelectedGenres = useCallback((genres: string[]) => {
    dispatch(setGenres(genres));
  }, [dispatch]);

  const handleSetSelectedArtists = useCallback((artists: string[]) => {
    dispatch(setSelectedArtists(artists));
  }, [dispatch]);

  const handleSetSelectedInstruments = useCallback((instruments: string[]) => {
    dispatch(setSelectedInstruments(instruments));
  }, [dispatch]);

  const handleSetSelectedMoods = useCallback((moods: string[]) => {
    dispatch(setSelectedMoods(moods));
  }, [dispatch]);

  // For category, we'll create a simple setter (though category is derived from genres in Redux)
  const handleSetSelectedCategory = useCallback((category: string) => {
    // Category is automatically managed by Redux based on genres
    // If needed, we can dispatch selectCategory here
  }, []);

  /**
   * Toggles a filter's open/closed state.
   */
  const toggleFilter = useCallback((filterName: string) => {
    setOpenFilter(prev => prev === filterName ? null : filterName);
  }, []);

  /**
   * Handles sorting by updating the sort option.
   */
  const handleSortChange = useCallback((option: string) => {
    setSortBy(option);
  }, []);

  /**
   * Clears all filter selections and resets to defaults.
   */
  const clearAllFilters = useCallback(() => {
    dispatch(clearAllFiltersAction());
    setOpenFilter(null);
  }, [dispatch]);

  /**
   * Compute the filtered (and sorted) tracks based on current filter criteria.
   */
  const filteredTracks = useMemo(() => {
    // Filter by category first
    const categoryFiltered = tracks.filter((track) =>
      categoryFilter(track, selectedCategory)
    );
    // Apply remaining filters
    const filtered = categoryFiltered.filter((track) => {
      const tempoPass = tempoFilter(
        track,
        minTempo,
        maxTempo,
        includeHalfTime,
        includeDoubleTime
      );
      const keyPass = keyFilter(track, keyFilterCombinations);
      const genrePass = genreFilter(track, selectedGenres);
      const artistPass = artistFilter(track, selectedArtists);
      const instrumentPass = instrumentFilter(track, selectedInstruments);
      const moodPass = moodFilter(track, selectedMoods);
      const keywordPass = keywordFilter(track, selectedKeywords);
      return (
        tempoPass &&
        keyPass &&
        genrePass &&
        artistPass &&
        instrumentPass &&
        moodPass &&
        keywordPass
      );
    });
    return sortTracks(filtered, sortBy);
  }, [
    tracks,
    selectedCategory,
    minTempo,
    maxTempo,
    includeHalfTime,
    includeDoubleTime,
    keyFilterCombinations,
    selectedGenres,
    selectedArtists,
    selectedInstruments,
    selectedMoods,
    selectedKeywords,
    sortBy
  ]);

  const contextValue = useMemo(() => ({
    // Unique filter options
    artistList,
    moodList,
    instrumentList,
    keywordList,

    // Filter state values
    minTempo,
    maxTempo,
    includeHalfTime,
    includeDoubleTime,
    selectedKeys,
    selectedScale,
    keyFilterCombinations,
    selectedCategory,
    selectedGenres,
    selectedArtists,
    selectedInstruments,
    selectedMoods,
    selectedKeywords,
    openFilter,
    openSortFilter,
    sortBy,

    // Setters and actions
    setMinTempo: handleSetMinTempo,
    setMaxTempo: handleSetMaxTempo,
    setIncludeHalfTime: handleSetIncludeHalfTime,
    setIncludeDoubleTime: handleSetIncludeDoubleTime,
    setSelectedKeys: handleSetSelectedKeys,
    setSelectedScale: handleSetSelectedScale,
    setKeyFilterCombinations: handleSetKeyFilterCombinations,
    setSelectedCategory: handleSetSelectedCategory,
    setSelectedGenres: handleSetSelectedGenres,
    setSelectedArtists: handleSetSelectedArtists,
    setSelectedInstruments: handleSetSelectedInstruments,
    setSelectedMoods: handleSetSelectedMoods,
    setSelectedKeywords: () => {}, // Keywords managed elsewhere
    setOpenFilter,
    setOpenSortFilter,
    setSortBy,
    handleSortChange,
    clearAllFilters,
    toggleFilter,

    // Derived filtered tracks
    filteredTracks,
  }), [
    artistList, moodList, instrumentList, keywordList,
    minTempo, maxTempo, includeHalfTime, includeDoubleTime,
    selectedKeys, selectedScale, keyFilterCombinations,
    selectedCategory, selectedGenres, selectedArtists, selectedInstruments, selectedMoods, selectedKeywords,
    openFilter, openSortFilter, sortBy,
    handleSetMinTempo, handleSetMaxTempo, handleSetIncludeHalfTime, handleSetIncludeDoubleTime,
    handleSetSelectedKeys, handleSetSelectedScale, handleSetKeyFilterCombinations,
    handleSetSelectedCategory, handleSetSelectedGenres, handleSetSelectedArtists,
    handleSetSelectedInstruments, handleSetSelectedMoods,
    handleSortChange, clearAllFilters, toggleFilter,
    filteredTracks
  ]);
  
  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};
