// Directory: src/client/features/sounds/search/components/SearchBar.tsx

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  selectKeyword,
  removeAllKeywords,
} from "@/client/features/sounds/filters/store/filterSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  keywords?: string[]; // List of available keywords for search suggestions.
}

/**
 * SearchBar Component
 *
 * Provides a dynamic search bar with auto-suggestions, search functionality, and smooth animations.
 * 
 * Features:
 * - Auto-suggests keywords from the provided list.
 * - Allows users to search and navigate to the /sounds page.
 * - Implements focus and blur behavior for an interactive user experience.
 * - Includes an animated UI with smooth expansion and contraction effects.
 * 
 * @param {SearchBarProps} props - Component properties.
 * @returns {JSX.Element} The rendered component.
 */
const SearchBar: React.FC<SearchBarProps> = ({ keywords }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Manage search input state.
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Manage search suggestions.
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [showRelatedKeywords, setShowRelatedKeywords] = useState(false);

  // Manage dropdown state.
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement | null>(null);

  // Reference to the styled search bar.
  const styledSearchBarRef = useRef<HTMLDivElement | null>(null);

  /**
   * Handles input change, filters related keywords dynamically.
   * @param {string} value - The current input value.
   */
  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (value) {
      const filtered = (keywords ?? []).filter((keyword) =>
        keyword.toLowerCase().includes(value.toLowerCase())
      );
      setRelatedKeywords(filtered);
      setShowRelatedKeywords(true);
    } else {
      setRelatedKeywords([]);
      setShowRelatedKeywords(false);
    }
  };

  /**
   * Handles selection of a search keyword from suggestions.
   * @param {string} keyword - The selected keyword.
   * @param {React.MouseEvent} event - The event object.
   */
  const resultSelection = (keyword: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setInputValue(keyword);
    setShowRelatedKeywords(false);
    setCategoryOpen(false);
    inputRef.current?.focus();
  };

  /**
   * Handles the search action, dispatches the selected keyword, and navigates to the search results page.
   */
  const handleSearchClick = () => {
    if (inputValue) {
      dispatch(selectKeyword(inputValue));
      router.push("/sounds");
    }
  };

  /**
   * Handles Enter key press to initiate search.
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
   */
  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      dispatch(selectKeyword(inputValue));
      router.push("/sounds");
    }
  };

  /**
   * Clears the search input and resets the keyword suggestions.
   */
  const handleClearInput = () => {
    setInputValue("");
    setShowRelatedKeywords(false);
    dispatch(removeAllKeywords());
  };

  /**
   * Handles focus event, expanding the search bar.
   */
  const handleFocus = () => {
    setIsFocused(true);
  };

  /**
   * Handles blur event, ensuring the search bar closes properly.
   */
  const handleBlur = () => {
    setTimeout(() => {
      if (!isFocused) {
        handleClearInput();
      }
    }, 400);
  };

  // Handles clicks outside the search bar to close suggestions.
  useEffect(() => {
    if (!isFocused) {
      setCategoryOpen(false);
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (categoryOpen) {
        if (categoryRef.current?.contains(e.target as Node)) {
          return;
        }
      } else if (styledSearchBarRef.current?.contains(e.target as Node)) {
        return;
      }
      setIsFocused(false);
      setCategoryOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFocused, categoryOpen]);

  return (
    <div
      className={`relative group rounded-2xl ${
        isFocused ? "animating" : "bg-neutral-200 dark:bg-neutral-950"
      }`}
      style={{
        transition: "all 0.4s ease-in-out",
        width: isFocused ? "22.5rem" : "15rem",
        animation: isFocused
          ? "expand 0.4s ease-in-out forwards"
          : "shrink 0.4s ease-in-out forwards",
      }}
      ref={styledSearchBarRef}
    >
      {/* Search Input */}
      <input
        type="text"
        ref={inputRef}
        value={inputValue}
        onKeyDown={handleEnterPress}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="focus:outline-none w-full h-8 pl-4 pr-8 text-sm rounded-2xl text-black dark:text-neutral-200 bg-white dark:bg-transparent border dark:border-0 z-10"
        placeholder="Search..."
        style={{
          outline: "none",
          border: isFocused ? "2px solid" : "none",
          borderColor: isFocused ? "#2363EB" : "transparent",
          boxShadow: "none",
        }}
      />

      {/* Search and Clear Buttons */}
      <div className="absolute inset-y-0 right-0 flex items-center pl-2 cursor-pointer">
        {inputValue && isFocused && (
          <button className="flex items-center justify-center p-2" onClick={handleClearInput}>
            <FontAwesomeIcon icon={faTimes} size="xs" className="text-neutral-600 dark:text-neutral-200" />
          </button>
        )}
        <button
          className={isFocused ? "flex items-center justify-center bg-blue-600 w-8 h-8 rounded-br-2xl rounded-tr-2xl" : "p-2"}
          onClick={handleSearchClick}
        >
          <FontAwesomeIcon
            icon={faSearch}
            size="xs"
            className={`text-neutral-600 dark:text-neutral-200 ${isFocused ? "text-white" : ""}`}
          />
        </button>
      </div>

      {/* Search Suggestions */}
      {isFocused && inputValue && showRelatedKeywords && (
        <div className="absolute top-full left-0 ml-2 bg-white/90 dark:bg-black/80 border dark:border-neutral-800 border-neutral-200 rounded-xl w-40 text-xs">
          <ul className="max-h-60 overflow-y-auto">
            {relatedKeywords.map((keyword, index) => (
              <li key={index}>
                <button
                  className="text-neutral-600 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded-lg w-full text-left"
                  onClick={(event) => resultSelection(keyword, event)}
                >
                  {keyword}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
