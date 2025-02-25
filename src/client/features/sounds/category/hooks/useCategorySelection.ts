// src/client/features/sounds/category/hooks/useCategorySelection.ts

/**
 * Custom hook for managing category selection state
 * Centralizes category selection logic and Redux interactions
 * 
 * @module sounds/category/hooks/useCategorySelection
 */
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@core/store';
import { selectCategory, removeAllGenres } from "@store/slices";

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
    (state: RootState) => state.tracks.selected.genres
  );
  
  const selectedCategory = useSelector(
    (state: RootState) => state.tracks.selected.category
  );

  /**
   * Handles genre selection/deselection
   * "All" selection clears other genre filters
   * 
   * @param {string} genre - The genre to select
   */
  const handleGenreSelection = (genre: string) => {
    if (genre === "All") {
      dispatch(removeAllGenres());
    } else {
      dispatch(selectCategory(genre));
    }
  };

  /**
   * Checks if a genre is currently selected
   * 
   * @param {string} genre - The genre to check
   * @returns {boolean} Whether the genre is selected
   */
  const isGenreSelected = (genre: string) => {
    return (
      (selectedCategory.includes("All") && genre === "All") ||
      selectedCategory.includes(genre)
    );
  };

  return {
    selectedGenres,
    selectedCategory,
    handleGenreSelection,
    isGenreSelected
  };
};