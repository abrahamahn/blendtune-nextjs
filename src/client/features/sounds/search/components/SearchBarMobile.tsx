// src/client/features/sounds/search/components/SearchBarMobile.tsx

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@core/store";
import {
  selectKeyword,
  removeAllGenres,
  removeAllKeywords,
} from "@store/slices";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchBarMobileProps {
  keywords?: string[]; // List of available keywords for search suggestions.
  toggleSearchBar: () => void; // Function to toggle search bar visibility.
  isAnimating: boolean; // Controls the animation state of the search bar.
}

/**
 * SearchBarMobile Component
 *
 * A mobile-friendly search bar that allows users to filter tracks using keywords.
 * Features include:
 * - Search suggestions from available keywords.
 * - Clear input and close functionality.
 * - Auto-focus on animation trigger.
 *
 * @param {SearchBarMobileProps} props - Component properties.
 * @returns {JSX.Element} The rendered component.
 */
const SearchBarMobile: React.FC<SearchBarMobileProps> = ({
  keywords,
  toggleSearchBar,
  isAnimating,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Search input state management.
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Retrieves selected keywords from the Redux store.
  const selectedKeywords = useSelector(
    (state: RootState) => state.tracks.filters.keywords
  );

  // Handles changes in the search input field.
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  // Clears the input field or toggles search bar visibility.
  const handleClearInput = () => {
    if (inputValue) {
      setInputValue("");
    } else {
      toggleSearchBar();
      dispatch(removeAllKeywords());
    }
  };

  // Updates search suggestions based on input value.
  useEffect(() => {
    if (inputValue) {
      const filtered = keywords?.filter((keyword) =>
        keyword.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSearchResults(filtered || []);
    } else {
      setSearchResults([]);
    }
  }, [inputValue, keywords]);

  // Handles selection of a search keyword.
  const resultSelection = (keyword: string) => {
    setInputValue(keyword);
    dispatch(removeAllGenres()); // Reset genres on keyword selection.
    dispatch(selectKeyword(keyword));
    handleClearInput();
    toggleSearchBar();
  };

  // Redirect to the /sounds page when a keyword is selected.
  useEffect(() => {
    if (selectedKeywords.length > 0) {
      router.push("/sounds");
    }
  }, [selectedKeywords, router]);

  // Focus the input field when the search bar is expanding.
  useEffect(() => {
    if (isAnimating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAnimating]);

  return (
    <div
      className="block md:hidden fixed top-0 right-0 w-full bg-white dark:bg-black group h-14 z-50 animating border dark:border-neutral-800 border-neutral-200"
      style={{
        animation: isAnimating
          ? "expandMobile 0.4s ease-in-out forwards"
          : "shrinkMobile 0.4s ease-in-out forwards",
      }}
      data-testid="mobile-searchbar"
    >
      <div className="flex flex-row justify-center items-center w-full h-full">
        {/* Search Icon */}
        <FontAwesomeIcon
          icon={faSearch}
          size="sm"
          className="text-neutral-800 dark:text-white pl-4 pr-2"
        />

        {/* Search Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="focus:outline-none h-full w-full text-base rounded-2xl text-neutral-800 dark:text-neutral-200 bg-transparent border"
          placeholder="Search..."
          style={{
            outline: "none",
            borderColor: "transparent",
            boxShadow: "none",
          }}
        />

        {/* Clear/Search Toggle Button */}
        <button className="p-2 cursor-pointer" onClick={handleClearInput}>
          <FontAwesomeIcon
            icon={faTimes}
            size="lg"
            className="text-neutral-700 dark:text-neutral-200 rounded-full pr-4"
          />
        </button>

        {/* Displaying search suggestions only when input is active */}
        {inputValue && (
          <div className="absolute block lg:hidden top-full left-0 right-0 bg-white dark:bg-black border dark:border-neutral-800 border-neutral-200">
            <ul className="flex flex-col max-h-60 overflow-y-auto">
              {searchResults?.map((keyword, index) => (
                <li
                  key={index}
                  className="flex items-center text-center p-2 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-200 cursor-pointer"
                  onClick={() => resultSelection(keyword)}
                >
                  {keyword}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBarMobile;
