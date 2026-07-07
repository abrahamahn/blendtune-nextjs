// main/apps/web/src/client/features/sounds/filters/components/keyword.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { selectKeywords, deselectKeyword, removeAllKeywords } from '@core/store/slices';
import { FilterWrapper, SearchInput, FilterGrid, Item, ActionButtons } from '@features/sounds/filters/ui';

interface KeywordFilterProps {
  keywords: string[];
  onClose: () => void;
  selectedKeywords: string[];
}

/** Keyword filter panel — searchable multi-select backed by the Redux store. */
const KeywordFilter: React.FC<KeywordFilterProps> = ({ keywords, onClose, selectedKeywords }) => {
  const dispatch = useDispatch();
  const safeSelectedKeywords = selectedKeywords ?? [];
  const [searchTerm, setSearchTerm] = useState('');

  const handleKeywordToggle = (keyword: string) => {
    if (safeSelectedKeywords.includes(keyword)) {
      dispatch(deselectKeyword(keyword));
    } else {
      dispatch(selectKeywords([keyword]));
    }
  };

  const searchResult = keywords
    .filter((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort();

  const handleClearClick = () => {
    dispatch(removeAllKeywords());
    setSearchTerm('');
  };

  return (
    <FilterWrapper>
      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search keywords…"
      />
      <FilterGrid columns={3}>
        {searchResult.map((keyword) => (
          <Item
            key={keyword}
            selected={safeSelectedKeywords.includes(keyword)}
            onClick={() => handleKeywordToggle(keyword)}
          >
            {keyword}
          </Item>
        ))}
      </FilterGrid>
      <ActionButtons onClear={handleClearClick} onClose={onClose} />
    </FilterWrapper>
  );
};

export default KeywordFilter;
