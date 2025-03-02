import React, { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  useMemo,
  useEffect, 
  ReactNode 
} from 'react';
import { Track } from '@/shared/types/track';
import { FILTER_DEFAULTS, KEY_CONSTANTS } from './constants';
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@core/store";
import { setTrackList } from "@store/slices";

/**
 * Type for key filter combinations
 */
type KeyFilterCombination = {
  key: string | null;
  'key.note': string | null;
  'key.scale': string | null;
};

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

  // Get track metadata using the dedicated hook from keywords feature
  const { artistList, moodList, instrumentList, keywordList } = useTrackMetadata(tracks);

  // Filtered tracks state maintained in context
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  
  // Tempo filter state
  const [minTempo, setMinTempo] = useState<number>(FILTER_DEFAULTS.MIN_TEMPO);
  const [maxTempo, setMaxTempo] = useState<number>(FILTER_DEFAULTS.MAX_TEMPO);
  const [includeHalfTime, setIncludeHalfTime] = useState<boolean>(FILTER_DEFAULTS.INCLUDE_HALF_TIME);
  const [includeDoubleTime, setIncludeDoubleTime] = useState<boolean>(FILTER_DEFAULTS.INCLUDE_DOUBLE_TIME);
  
  // Key filter state
  const [selectedKeys, setSelectedKeys] = useState<string>('');
  const [selectedScale, setSelectedScale] = useState<string>(KEY_CONSTANTS.DEFAULT_SCALE);
  const [keyFilterCombinations, setKeyFilterCombinations] = useState<KeyFilterCombination[]>([]);
  
  // Get Redux state
  const selectedCategory = useSelector(
    (state: RootState) => state.tracks.selected.category
  );
  const selectedGenres = useSelector(
    (state: RootState) => state.tracks.selected.genres
  );
  const selectedKeywords = useSelector(
    (state: RootState) => state.tracks.selected.keywords
  );
  
  // Local state for filters not in Redux
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  // UI state
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [openSortFilter, setOpenSortFilter] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('Newest');

  /**
   * Toggles a filter's open/closed state
   * 
   * @param {string} filterName - The name of the filter to toggle
   */
  const toggleFilter = useCallback((filterName: string) => {
    setOpenFilter(prev => prev === filterName ? null : filterName);
  }, []);
  
  /**
   * Redux dispatch wrapper functions for selected genres and keywords
   */
  // We don't directly modify Redux state for genres and keywords
  // These are likely handled by dedicated components elsewhere
  const setSelectedGenresWrapper = useCallback((genres: string[]) => {
    console.warn('setSelectedGenres called in FilterContext, but this may not update Redux state');
    // This is a placeholder - the actual Redux update likely happens elsewhere
  }, []);

  const setSelectedKeywordsWrapper = useCallback((keywords: string[]) => {
    console.warn('setSelectedKeywords called in FilterContext, but this may not update Redux state');
    // This is a placeholder - the actual Redux update likely happens elsewhere
  }, []);
  
  /**
   * Handles sorting when a new sort option is selected.
   */
  const handleSortChange = useCallback(
    (option: string) => {
      setSortBy(option);
      const sorted = sortTracks(filteredTracks, option);
      setFilteredTracks(sorted);
    },
    [filteredTracks]
  );
  
  /**
   * Clears all filter selections and resets to defaults
   */
  const clearAllFilters = useCallback(() => {
    // Reset tempo filters
    setMinTempo(FILTER_DEFAULTS.MIN_TEMPO);
    setMaxTempo(FILTER_DEFAULTS.MAX_TEMPO);
    setIncludeHalfTime(FILTER_DEFAULTS.INCLUDE_HALF_TIME);
    setIncludeDoubleTime(FILTER_DEFAULTS.INCLUDE_DOUBLE_TIME);
    
    // Reset key filters
    setSelectedKeys('');
    setSelectedScale(KEY_CONSTANTS.DEFAULT_SCALE);
    setKeyFilterCombinations([]);
    
    // Reset other filters
    setSelectedArtists([]);
    setSelectedInstruments([]);
    setSelectedMoods([]);
    
    // Reset UI state
    setOpenFilter(null);
  }, []);

    /**
   * Filters tracks based on selected criteria.
   * - Category, tempo, key, genre, artist, instrument, mood, and keyword filters.
   * - Updates the `filteredTracks` state after applying filters.
   */
    const applyAllFilters = useCallback(() => {
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
  
      setFilteredTracks(filtered);
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
    ]);
  
    // Reapply filters whenever the track list or filter criteria change
    useEffect(() => {
      applyAllFilters();
    }, [tracks, applyAllFilters]);

    // Dispatch sorted track list to global state
    useEffect(() => {
      if (filteredTracks.length > 0) {
        dispatch(setTrackList(filteredTracks));
      }
    }, [filteredTracks, dispatch]);

  
  const contextValue = useMemo(() => ({
    // Unique filter options from keywords feature
    artistList,
    moodList,
    instrumentList,
    keywordList,
    
    // Filter state
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
    
    // Setters
    setMinTempo,
    setMaxTempo,
    setIncludeHalfTime,
    setIncludeDoubleTime,
    setSelectedKeys,
    setSelectedScale,
    setKeyFilterCombinations,
    setSelectedGenres: setSelectedGenresWrapper,
    setSelectedArtists,
    setSelectedInstruments,
    setSelectedMoods,
    setSelectedKeywords: setSelectedKeywordsWrapper,
    setOpenFilter,
    setOpenSortFilter,
    setSortBy,
    handleSortChange,
    
    // Actions
    clearAllFilters,
    toggleFilter,
    
    // Filtered and sorted tracks
    filteredTracks,
  }), [
    artistList, moodList, instrumentList, keywordList,
    minTempo, maxTempo, includeHalfTime, includeDoubleTime,
    selectedKeys, selectedScale, keyFilterCombinations,
    selectedCategory, selectedGenres, selectedArtists, selectedInstruments, selectedMoods, selectedKeywords,
    openFilter, openSortFilter, sortBy, setSortBy, handleSortChange,
    clearAllFilters, toggleFilter,
    filteredTracks,
    setSelectedGenresWrapper, setSelectedKeywordsWrapper
  ]);
  
  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};