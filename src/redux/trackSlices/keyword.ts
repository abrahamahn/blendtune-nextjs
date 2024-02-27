// lib/slices/keywordSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface KeywordState {
  category: string;
  genres: string[];
  keywords: string[];
}

const initialState: KeywordState = {
  category: 'All',
  genres: [],
  keywords: [],
};

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
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
      if (state.genres.length !== 1) {
        state.category = 'All';
      } else {
        state.category = state.genres[0];
      }
    },
    removeAllGenres: state => {
      state.category = 'All';
      state.genres = [];
    },

    // Keyword Selector
    selectKeyword: (state, action: PayloadAction<string>) => {
      state.keywords = [action.payload];
    },
    selectKeywords: (state, action: PayloadAction<string[]>) => {
      state.keywords = Array.from(new Set([...state.keywords, ...action.payload]));
    },
    deselectKeyword: (state, action: PayloadAction<string>) => {
      state.keywords = state.keywords.filter(k => k !== action.payload);
    },
    removeAllKeywords: state => {
      state.keywords = [];
    },
  },
});

export const { 
  selectGenres, 
  selectCategory,
  removeAllGenres,
  selectKeyword, 
  selectKeywords, 
  deselectKeyword,
  removeAllKeywords, 
} = selectedSlice.actions;

export default selectedSlice.reducer;
