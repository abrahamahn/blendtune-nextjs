// src\client\features\sounds\filters\store\filterSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Type for key filter combinations
 */
export type KeyFilterCombination = {
  key: string | null;
  'key.note': string | null;
  'key.scale': string | null;
};

/**
 * Defines the structure of the state for all filters in the music streaming app.
 */
export interface FilterState {
  // Category & Genre
  category: string;
  genres: string[];

  // Tempo
  minTempo: number;
  maxTempo: number;
  includeHalfTime: boolean;
  includeDoubleTime: boolean;

  // Key
  selectedKeys: string;
  selectedScale: string;
  keyFilterCombinations: KeyFilterCombination[];

  // Artist, Instrument, Mood
  selectedArtists: string[];
  selectedInstruments: string[];
  selectedMoods: string[];

  // Keywords
  keywords: string[];
}

/**
 * Initial state for all filters.
 */
const initialState: FilterState = {
  category: 'All',
  genres: [],
  minTempo: 40,
  maxTempo: 200,
  includeHalfTime: false,
  includeDoubleTime: false,
  selectedKeys: '',
  selectedScale: 'Major',
  keyFilterCombinations: [],
  selectedArtists: [],
  selectedInstruments: [],
  selectedMoods: [],
  keywords: [],
};

/**
 * Redux slice to manage all filter selections.
 */
const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // ===== Category & Genre =====
    selectCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
      state.genres = [action.payload];
    },

    selectGenres: (state, action: PayloadAction<string>) => {
      const index = state.genres.indexOf(action.payload);
      if (index < 0) {
        state.genres.push(action.payload);
      } else {
        state.genres.splice(index, 1);
      }
      state.category = state.genres.length === 1 ? state.genres[0] : 'All';
    },

    setGenres: (state, action: PayloadAction<string[]>) => {
      state.genres = action.payload;
      state.category = action.payload.length === 1 ? action.payload[0] : 'All';
    },

    removeAllGenres: (state) => {
      state.category = 'All';
      state.genres = [];
    },

    // ===== Tempo =====
    setMinTempo: (state, action: PayloadAction<number>) => {
      state.minTempo = action.payload;
    },

    setMaxTempo: (state, action: PayloadAction<number>) => {
      state.maxTempo = action.payload;
    },

    setIncludeHalfTime: (state, action: PayloadAction<boolean>) => {
      state.includeHalfTime = action.payload;
    },

    setIncludeDoubleTime: (state, action: PayloadAction<boolean>) => {
      state.includeDoubleTime = action.payload;
    },

    // ===== Key =====
    setSelectedKeys: (state, action: PayloadAction<string>) => {
      state.selectedKeys = action.payload;
    },

    setSelectedScale: (state, action: PayloadAction<string>) => {
      state.selectedScale = action.payload;
    },

    setKeyFilterCombinations: (state, action: PayloadAction<KeyFilterCombination[]>) => {
      state.keyFilterCombinations = action.payload;
    },

    // ===== Artist, Instrument, Mood =====
    setSelectedArtists: (state, action: PayloadAction<string[]>) => {
      state.selectedArtists = action.payload;
    },

    setSelectedInstruments: (state, action: PayloadAction<string[]>) => {
      state.selectedInstruments = action.payload;
    },

    setSelectedMoods: (state, action: PayloadAction<string[]>) => {
      state.selectedMoods = action.payload;
    },

    // ===== Keywords =====
    selectKeyword: (state, action: PayloadAction<string>) => {
      state.keywords = [action.payload];
    },

    selectKeywords: (state, action: PayloadAction<string[]>) => {
      state.keywords = Array.from(new Set([...state.keywords, ...action.payload]));
    },

    deselectKeyword: (state, action: PayloadAction<string>) => {
      state.keywords = state.keywords.filter(keyword => keyword !== action.payload);
    },

    removeAllKeywords: (state) => {
      state.keywords = [];
    },

    // ===== Clear All =====
    clearAllFilters: (state) => {
      return initialState;
    },
  },
});

/**
 * Exporting action creators for modifying filter state.
 */
export const {
  // Category & Genre
  selectGenres,
  setGenres,
  selectCategory,
  removeAllGenres,
  // Tempo
  setMinTempo,
  setMaxTempo,
  setIncludeHalfTime,
  setIncludeDoubleTime,
  // Key
  setSelectedKeys,
  setSelectedScale,
  setKeyFilterCombinations,
  // Artist, Instrument, Mood
  setSelectedArtists,
  setSelectedInstruments,
  setSelectedMoods,
  // Keywords
  selectKeyword,
  selectKeywords,
  deselectKeyword,
  removeAllKeywords,
  // Clear All
  clearAllFilters,
} = filterSlice.actions;

/**
 * Default export for the slice reducer to be integrated into the store.
 */
export default filterSlice.reducer;
