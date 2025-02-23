// src\client\features\sounds\search\hooks\useMobileSearch.ts
import { useState } from "react";

const useMobileSearch = () => {
  const [isMobileSearch, setIsMobileSearch] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleSearchBar = () => {
    if (!isMobileSearch) {
      setIsMobileSearch(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      setTimeout(() => {
        setIsMobileSearch(false);
      }, 250);
    }
  };

  return { isMobileSearch, isAnimating, toggleSearchBar };
};

export default useMobileSearch;
