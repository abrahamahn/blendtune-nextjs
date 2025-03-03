// src\client\features\sounds\filters\store\filterSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Defines the structure of the state for keyword selection in the music streaming app.
 */
export interface KeywordState {
  category: string; // Represents the currently selected category
  genres: string[]; // List of selected genres
  keywords: string[]; // List of selected keywords
}

/**
 * Initial state for keyword selection.
 */
const initialState: KeywordState = {
  category: 'All', // Default category when no specific genre is selected
  genres: [], // No genres selected initially
  keywords: [], // No keywords selected initially
};

/**
 * Redux slice to manage category, genre, and keyword selection.
 */
const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    /**
     * Updates the selected category and resets the genres array to contain only the selected category.
     */
    selectCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
      state.genres = [action.payload]; // Ensures only one category is active at a time
    },

    /**
     * Toggles a genre selection. If the genre is not already selected, it gets added; 
     * otherwise, it gets removed. Ensures category updates based on selected genres.
     */
    selectGenres: (state, action: PayloadAction<string>) => {
      const index = state.genres.indexOf(action.payload);
      
      if (index < 0) {
        state.genres.push(action.payload);
      } else {
        state.genres.splice(index, 1);
      }

      // If only one genre remains, update category; otherwise, reset to "All"
      state.category = state.genres.length === 1 ? state.genres[0] : 'All';
    },

    /**
     * Clears all selected genres and resets the category to "All".
     */
    removeAllGenres: (state) => {
      state.category = 'All';
      state.genres = [];
    },

    /**
     * Selects a single keyword, replacing any previously selected keywords.
     */
    selectKeyword: (state, action: PayloadAction<string>) => {
      state.keywords = [action.payload];
    },

    /**
     * Adds multiple keywords to the list while ensuring uniqueness.
     */
    selectKeywords: (state, action: PayloadAction<string[]>) => {
      state.keywords = Array.from(new Set([...state.keywords, ...action.payload]));
    },

    /**
     * Removes a specific keyword from the selected keywords list.
     */
    deselectKeyword: (state, action: PayloadAction<string>) => {
      state.keywords = state.keywords.filter(keyword => keyword !== action.payload);
    },

    /**
     * Clears all selected keywords.
     */
    removeAllKeywords: (state) => {
      state.keywords = [];
    },
  },
});

/**
 * Exporting action creators for modifying the keyword state.
 */
export const { 
  selectGenres, 
  selectCategory,
  removeAllGenres,
  selectKeyword, 
  selectKeywords, 
  deselectKeyword,
  removeAllKeywords, 
} = selectedSlice.actions;

/**
 * Default export for the slice reducer to be integrated into the store.
 */
export default selectedSlice.reducer;
