// src/client/features/sounds/filters/utils/filterSync.ts

import { Dispatch } from 'redux';
import { selectCategory, removeAllGenres, selectGenres } from "@store/slices";

/**
 * Synchronizes genre selection with category selection
 * This function can be called anywhere you need to ensure both are in sync
 * 
 * @param {Dispatch} dispatch - Redux dispatch function
 * @param {string} genre - Genre to select
 */
export const syncGenreAndCategory = (dispatch: Dispatch, genre: string | null) => {
  if (!genre || genre === "All") {
    // Clear genre selection and set category to "All"
    dispatch(removeAllGenres());
    dispatch(selectCategory("All"));
  } else {
    // Set both genre and category to the same value
    dispatch(selectGenres(genre));
    dispatch(selectCategory(genre));
  }
};

/**
 * Updates the filter logic for applyAllFilters to ensure
 * category filter and genre filter work together correctly
 * 
 * This helps maintain consistency between the two filters
 */
export const ensureFilterConsistency = (
  selectedGenres: string[],
  selectedCategory: string
) => {
  // If no genres are selected, ensure category is "All"
  if (selectedGenres.length === 0 && selectedCategory !== "All") {
    return "All";
  }
  
  // If a genre is selected, ensure category matches
  if (selectedGenres.length === 1 && selectedGenres[0] !== selectedCategory) {
    return selectedGenres[0];
  }
  
  return selectedCategory;
};

/**
 * Helper function to determine if a filter is active
 * based on selected genres and categories
 * 
 * @param selectedGenres - Currently selected genres
 * @param selectedCategory - Currently selected category
 * @returns Boolean indicating if genre/category filter is active
 */
export const isGenreCategoryFilterActive = (
  selectedGenres: string[],
  selectedCategory: string
): boolean => {
  // Filter is active if either:
  // 1. Any genre is selected
  // 2. Category is not "All"
  return selectedGenres.length > 0 || (selectedCategory !== "All" && selectedCategory !== "");
};