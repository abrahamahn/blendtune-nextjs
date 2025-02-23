// src\client\features\sounds\search\components\SearchBar.tsx
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  selectKeyword,
  removeAllKeywords,
} from "@tracks/store/keywordSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  keywords?: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ keywords }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  /* SearchBar Focus */
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFocus = () => {
    setIsFocused(true);
  };

  /* SearchBar Styling */
  const styledSearchBarRef = useRef<HTMLDivElement | null>(null);

  /* Inputs */
  const [inputValue, setInputValue] = useState("");

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

  /* Search Category */
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement | null>(null);

  /* Related Keywords */
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [showRelatedKeywords, setShowRelatedKeywords] = useState(false);

  /* Select Search Results */
  const [resultClick, setResultClick] = useState(false);

  const resultSelection = (keyword: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setInputValue(keyword);
    setShowRelatedKeywords(false);
    setCategoryOpen(false);
    setResultClick(false);
    inputRef.current?.focus();
  };

  /* Search Results */
  const handleSearchClick = () => {
    if (inputValue) {
      dispatch(selectKeyword(inputValue));
      router.push("/sounds");
    }
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      dispatch(selectKeyword(inputValue));
      router.push("/sounds");
    }
  };

  /* Handle Clear Input */
  const handleClearInput = () => {
    setInputValue("");
    setShowRelatedKeywords(false);
    dispatch(removeAllKeywords());
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!resultClick && !isFocused) {
        handleClearInput();
      }
      setResultClick(false);
    }, 400);
  };

  useEffect(() => {
    if (!isFocused) {
      setCategoryOpen(false);
    }

    const handleClick = (e: MouseEvent) => {
      if (categoryOpen) {
        if (
          categoryRef.current &&
          categoryRef.current.contains(e.target as Node)
        ) {
          return;
        }
      } else {
        if (
          styledSearchBarRef.current &&
          styledSearchBarRef.current.contains(e.target as Node)
        ) {
          return;
        }
      }

      setIsFocused(false);
      setCategoryOpen(false);
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isFocused, categoryOpen]);

  return (
    <div
      className={`relative group rounded-2xl ${isFocused ? "animating" : "bg-neutral-200 dark:bg-neutral-950"}`}
      style={{
        transition: "all 0.4s ease-in-out",
        width: isFocused ? "22.5rem" : "15rem",
        animation: isFocused
          ? "expand 0.4s ease-in-out forwards"
          : "shrink 0.4s ease-in-out forwards",
      }}
      ref={styledSearchBarRef}
    >
      <input
        type="text"
        ref={inputRef}
        value={inputValue}
        onKeyDown={handleEnterPress}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`focus:outline-none w-full h-8 pl-4 pr-8 text-sm rounded-2xl text-black dark:text-neutral-200 bg-white dark:bg-transparent border dark:border-0 z-10`}
        placeholder="Search..."
        style={{
          outline: "none",
          border: isFocused ? "2px solid" : "none",
          borderColor: isFocused ? "#2363EB" : "transparent",
          boxShadow: "none",
        }}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pl-2 cursor-pointer">
        {inputValue && isFocused && (
          <button
            className="flex items-center justify-center p-2 cursor-pointer"
            onClick={handleClearInput}
          >
            <FontAwesomeIcon
              icon={faTimes}
              size="xs"
              className="text-neutral-600 dark:text-neutral-200"
            />
          </button>
        )}
        <button
          className={
            isFocused
              ? "flex items-center justify-center bg-blue-600 w-8 h-8 rounded-br-2xl rounded-tr-2xl"
              : "p-2"
          }
          onClick={handleSearchClick}
        >
          <FontAwesomeIcon
            icon={faSearch}
            size="xs"
            className={`text-neutral-600 dark:text-neutral-200 ${isFocused ? "text-white" : ""}`}
          />
        </button>
      </div>
      {isFocused && inputValue && showRelatedKeywords && (
        <div className="absolute top-full left-0 ml-2 bg-white/90 dark:bg-black/80 border dark:border-neutral-800 border-neutral-200 rounded-xl w-40 text-xs">
          <ul className="max-h-60 overflow-y-auto">
            {relatedKeywords?.map((keyword, index) => (
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
