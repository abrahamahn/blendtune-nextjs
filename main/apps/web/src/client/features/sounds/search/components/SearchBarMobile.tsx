// main/apps/web/src/client/features/sounds/search/components/SearchBarMobile.tsx
/**
 * Mobile search overlay: full-width bar with keyword suggestions.
 * Selecting a suggestion dispatches the keyword and routes to /sounds.
 */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';

import { Button, Input } from '@ui';
import { useNavigate } from '@router/index';
import { RootState } from '@core/store';
import { selectKeyword, removeAllGenres, removeAllKeywords } from '@core/store/slices';

import './search.css';

interface SearchBarMobileProps {
  keywords?: string[];
  toggleSearchBar: () => void;
  isAnimating: boolean;
}

const SearchBarMobile: React.FC<SearchBarMobileProps> = ({
  keywords,
  toggleSearchBar,
  isAnimating,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState('');

  const selectedKeywords = useSelector((state: RootState) => state.tracks.filters.keywords);

  /** Clears the input, or closes the bar when already empty. */
  const handleClearInput = () => {
    if (inputValue) {
      setInputValue('');
    } else {
      toggleSearchBar();
      dispatch(removeAllKeywords());
    }
  };

  const searchResults = useMemo(() => {
    if (!inputValue) return [];
    return (keywords ?? []).filter((keyword) =>
      keyword.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [inputValue, keywords]);

  /** Applies a keyword: resets genres, selects it, and closes the bar. */
  const resultSelection = (keyword: string) => {
    setInputValue(keyword);
    dispatch(removeAllGenres());
    dispatch(selectKeyword(keyword));
    handleClearInput();
    toggleSearchBar();
  };

  // Route to the catalog once a keyword filter is active.
  useEffect(() => {
    if (selectedKeywords.length > 0) {
      navigate('/sounds');
    }
  }, [selectedKeywords, navigate]);

  // Focus the input while the bar is expanding.
  useEffect(() => {
    if (isAnimating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAnimating]);

  return (
    <div className="bt-search-mobile" data-testid="mobile-searchbar">
      <FontAwesomeIcon icon={faSearch} size="sm" />
      <Input
        ref={inputRef}
        className="bt-search-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        placeholder="Search…"
        aria-label="Search sounds"
      />
      <Button
        variant="text"
        size="inline"
        className="bt-header-icon-btn"
        onClick={handleClearInput}
        aria-label="Close search"
      >
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </Button>
      {inputValue !== '' && searchResults.length > 0 && (
        <ul className="bt-search-results">
          {searchResults.map((keyword) => (
            <li key={keyword}>
              <Button
                variant="text"
                size="inline"
                className="bt-search-result"
                onClick={() => resultSelection(keyword)}
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

export default SearchBarMobile;
