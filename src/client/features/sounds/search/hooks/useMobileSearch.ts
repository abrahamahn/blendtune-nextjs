// Directory: src/client/features/sounds/search/hooks/useMobileSearch.ts

import { useState } from "react";

/**
 * Custom hook to manage the mobile search bar state and animation.
 * 
 * Provides functionality to toggle the visibility of the search bar with 
 * a smooth animation effect.
 * 
 * @returns {Object} - An object containing:
 *   - `isMobileSearch`: Boolean indicating whether the search bar is active.
 *   - `isAnimating`: Boolean indicating whether the animation is in progress.
 *   - `toggleSearchBar`: Function to toggle the search bar visibility.
 */
const useMobileSearch = () => {
  const [isMobileSearch, setIsMobileSearch] = useState(false); // Controls search bar visibility.
  const [isAnimating, setIsAnimating] = useState(false); // Controls animation state.

  /**
   * Toggles the mobile search bar with an animation delay.
   */
  const toggleSearchBar = () => {
    if (!isMobileSearch) {
      setIsMobileSearch(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      setTimeout(() => {
        setIsMobileSearch(false);
      }, 250); // Delay matches animation duration for a smooth transition.
    }
  };

  return { isMobileSearch, isAnimating, toggleSearchBar };
};

export default useMobileSearch;
