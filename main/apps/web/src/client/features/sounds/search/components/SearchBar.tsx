// main/apps/web/src/client/features/sounds/search/components/SearchBar.tsx
/**
 * Desktop search bar with keyword auto-suggestions. Expands on focus, dispatches
 * the selected keyword to the filter store, and routes to /sounds.
 */
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

import { Button, Input } from '@ui';
import { useNavigate } from '@router/index';
import { selectKeyword, removeAllKeywords } from '@client/features/sounds/filters/store/filterSlice';

import './search.css';

interface SearchBarProps {
  keywords?: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ keywords }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [showRelatedKeywords, setShowRelatedKeywords] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /** Filters suggestion keywords as the user types. */
  const handleInputChange = (value: string) => {
    setInputValue(value);
    const filtered = value
      ? (keywords ?? []).filter((keyword) => keyword.toLowerCase().includes(value.toLowerCase()))
      : [];
    setRelatedKeywords(filtered);
    setShowRelatedKeywords(filtered.length > 0);
  };

  /** Fills the input with a suggestion, keeping focus for a follow-up search. */
  const resultSelection = (keyword: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setInputValue(keyword);
    setShowRelatedKeywords(false);
    inputRef.current?.focus();
  };

  /** Dispatches the keyword and routes to the catalog. */
  const handleSearch = () => {
    if (inputValue) {
      dispatch(selectKeyword(inputValue));
      navigate('/sounds');
    }
  };

  const handleClearInput = () => {
    setInputValue('');
    setShowRelatedKeywords(false);
    dispatch(removeAllKeywords());
  };

  // Close suggestions when clicking outside the search bar.
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setIsFocused(false);
      setShowRelatedKeywords(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bt-search" data-focused={isFocused} ref={containerRef}>
      <Input
        ref={inputRef}
        className="bt-search-input"
        value={inputValue}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder="Search…"
        aria-label="Search sounds"
      />
      <div className="bt-search-buttons">
        {inputValue !== '' && isFocused && (
          <Button
            variant="text"
            size="inline"
            className="bt-header-icon-btn"
            onClick={handleClearInput}
            aria-label="Clear search"
          >
            <FontAwesomeIcon icon={faTimes} size="xs" />
          </Button>
        )}
        <Button
          variant="text"
          size="inline"
          className="bt-header-icon-btn"
          onClick={handleSearch}
          aria-label="Search"
        >
          <FontAwesomeIcon icon={faSearch} size="xs" />
        </Button>
      </div>
      {isFocused && inputValue !== '' && showRelatedKeywords && (
        <ul className="bt-search-results">
          {relatedKeywords.map((keyword) => (
            <li key={keyword}>
              <Button
                variant="text"
                size="inline"
                className="bt-search-result"
                onClick={(event) => resultSelection(keyword, event)}
              >
                {keyword}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
