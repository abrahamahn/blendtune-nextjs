// src\client\features\sounds\category\hooks\useCategorySelection.ts

/**
 * Custom hook for managing category selection state
 * Centralized category selection logic and Redux interactions
 * 
 * @module sounds/category/hooks/useCategorySelection
 */
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@core/store';
import { selectCategory, removeAllGenres } from "@sounds/filters/store/filterSlice";

/**
 * Hook that manages category selection state
 * Provides access to selected categories and selection handlers
 * 
 * @returns {Object} Category selection state and handlers
 */
export const useCategorySelection = () => {
  const dispatch = useDispatch();
  
  // Get current selection state from Redux store
  const selectedGenres = useSelector(
    (state: RootState) => state.tracks.filters.genres
  );

  const selectedCategory = useSelector(
    (state: RootState) => state.tracks.filters.category
  );

  /**
   * Handles genre selection/deselection
   * Implements single-select behavior using the selectCategory action
   * 
   * @param {string} genre - The genre to select
   */
  const handleGenreSelection = (genre: string) => {
    if (genre === "All") {
      // Clear all genre selections
      dispatch(removeAllGenres());
    } else {
      // Check if this genre is already selected
      const isSelected = selectedCategory === genre;
      
      if (isSelected) {
        // If already selected, clear selection
        dispatch(removeAllGenres());
      } else {
        // Otherwise, select the new category
        dispatch(selectCategory(genre));
      }
    }
  };

  /**
   * Checks if a genre is currently selected
   * 
   * @param {string} genre - The genre to check
   * @returns {boolean} Whether the genre is selected
   */
  const isGenreSelected = (genre: string) => {
    if (genre === "All") {
      // "All" is selected when category is "All"
      return selectedCategory === "All";
    }
    
    // For other genres, check if it matches the category
    return selectedCategory === genre;
  };

  return {
    selectedGenres,
    selectedCategory,
    handleGenreSelection,
    isGenreSelected
  };
};

export default useCategorySelection;