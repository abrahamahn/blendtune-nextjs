// src\client\features\sounds\filters\components\KeywordFilter.tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  selectKeywords,
  deselectKeyword,
  removeAllKeywords,
} from "@store/slices";

/**
 * Props interface for the KeywordFilter component
 * Defines the structure of props passed to the component
 */
interface KeywordFilterProps {
  /** List of all available keywords */
  keywords: string[];
  /** Callback function to close the filter */
  onClose: () => void;
  /** Currently selected keywords */
  selectedKeywords: string[];
}

/**
 * KeywordFilter Component
 * Provides an interactive interface for filtering and selecting keywords
 * Supports both desktop and mobile responsive designs
 * 
 * @component
 * @param {KeywordFilterProps} props - Component properties
 * @returns {React.ReactElement} Rendered KeywordFilter component
 */
const KeywordFilter: React.FC<KeywordFilterProps> = ({
  keywords,
  onClose,
  selectedKeywords,
}) => {
  // Redux dispatch hook for state management
  const dispatch = useDispatch();

  // Ensure selectedKeywords is always an array to prevent null/undefined errors
  const safeSelectedKeywords = selectedKeywords || [];

  // State management for search input
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Handles toggling keyword selection
   * Dispatches action to select or deselect a keyword
   * 
   * @param {string} keyword - The keyword to toggle
   */
  const handleKeywordToggle = (keyword: string) => {
    if (safeSelectedKeywords.includes(keyword)) {
      dispatch(deselectKeyword(keyword));
    } else {
      dispatch(selectKeywords([keyword]));
    }
  };

  /**
   * Filters and sorts keywords based on search term
   * Provides case-insensitive search functionality
   */
  const searchResult = keywords
    .filter((keyword) =>
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort();

  /**
   * Clears all selected keywords and resets search term
   * Dispatches action to remove all keywords
   */
  const handleClearClick = () => {
    dispatch(removeAllKeywords());
    setSearchTerm("");
  };

  /**
   * Handles closing the keyword filter
   * Calls the onClose callback provided as a prop
   */
  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div>
      {/* Desktop Filter View */}
      <div className="hidden md:block z-10 top-0 absolute bg-white/95 dark:bg-black/90 border border-neutral-200 dark:border-neutral-700 py-4 px-2 shadow rounded-lg text-neutral-300 text-xs">
        <div className="w-full flex flex-row mb-4">
          <input
            type="text"
            placeholder="Search Keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs h-8 rounded-lg bg-transparent dark:bg-transparent border border-neutral-400 dark:border-neutral-700 text-neutral-600 dark:text-neutral-200 placeholder-style"
            aria-label="Search keywords"
          />
        </div>
        <div className="w-[480px] border rounded-md border-neutral-400 dark:border-neutral-700 grid grid-cols-3 gap-0 overflow-y-auto h-72 scrollbar">
          {searchResult.map((keyword, index) => (
            <button
              key={index}
              className={`mb-0 items-center hover:text-neutral-500 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg flex flex-row px-1.5 py-1.5 w-full h-8 ${
                safeSelectedKeywords.includes(keyword)
                  ? "bg-blue-600 dark:bg-blue-600 text-white dark:text-white"
                  : "bg-transparent dark:transparent text-neutral-600 dark:text-neutral-300"
              }`}
              onClick={() => handleKeywordToggle(keyword)}
              aria-pressed={safeSelectedKeywords.includes(keyword)}
            >
              <p className="ml-1">{keyword}</p>
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={handleClearClick}
            className="font-medium text-xs rounded-full mr-3 text-neutral-500 dark:text-neutral-50 bg-transparent underline px-6 py-1"
            aria-label="Clear all keywords"
          >
            Clear
          </button>
          <button
            onClick={handleCloseClick}
            className="font-medium text-xs rounded-full mr-3 text-neutral-50 bg-blue-600 dark:bg-blue-600 px-6 py-1"
            aria-label="Close keyword filter"
          >
            Close
          </button>
        </div>
      </div>

      {/* Mobile Filter View */}
      <div className="block md:hidden z-10 py-4 px-2 text-neutral-300 text-xs">
        <div className="w-full flex flex-row mb-4">
          <input
            type="text"
            placeholder="Search Keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs h-8 rounded-lg bg-white/95 dark:bg-black/90 border border-neutral-400 dark:border-neutral-700 text-neutral-600 dark:text-neutral-200 placeholder-style"
            aria-label="Search keywords"
          />
        </div>
        <div className="w-[340px] h-28 border rounded-md border-neutral-400 dark:border-neutral-700 grid grid-cols-3 gap-0 overflow-y-auto max-h-72">
          {searchResult.map((keyword, index) => (
            <button
              key={index}
              className={`mb-0 items-center hover:text-neutral-500 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg flex flex-row px-1.5 py-1.5 w-full h-8 ${
                safeSelectedKeywords.includes(keyword)
                  ? "bg-blue-600 dark:bg-blue-600 text-white dark:text-white"
                  : "text-neutral-600 dark:text-neutral-300"
              }`}
              onClick={() => handleKeywordToggle(keyword)}
              aria-pressed={safeSelectedKeywords.includes(keyword)}
            >
              <p className="ml-1">{keyword}</p>
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleClearClick}
            className="font-medium text-sm rounded-full mr-3 text-neutral-500 dark:text-neutral-50 bg-transparent underline"
            aria-label="Clear all keywords"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeywordFilter;