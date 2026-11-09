// main/apps/web/src/client/features/sounds/filters/components/mood.tsx
import React, { useState, useMemo } from 'react';

import { ActionButtons } from '@features/sounds/filters/ui/ActionButtons';
import { FilterGrid } from '@features/sounds/filters/ui/FilterGrid';
import { FilterWrapper } from '@features/sounds/filters/ui/FilterWrapper';
import { Item } from '@features/sounds/filters/ui/Item';
import { SearchInput } from '@features/sounds/filters/ui/SearchInput';

interface MoodFilterProps {
  moods: string[];
  selectedMoods: string[];
  setSelectedMoods: (moods: string[]) => void;
  onClose: () => void;
}

/** Mood filter panel — searchable multi-select. */
const MoodFilter: React.FC<MoodFilterProps> = ({
  moods,
  selectedMoods,
  setSelectedMoods,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleMoodToggle = (mood: string) => {
    setSelectedMoods(
      selectedMoods.includes(mood)
        ? selectedMoods.filter((m) => m !== mood)
        : [...selectedMoods, mood],
    );
  };

  const filteredAndSortedMoods = useMemo(
    () => moods.filter((mood) => mood.toLowerCase().includes(searchTerm.toLowerCase())).sort(),
    [moods, searchTerm],
  );

  const handleClearClick = () => {
    setSelectedMoods([]);
    setSearchTerm('');
  };

  return (
    <FilterWrapper>
      <SearchInput
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search moods…"
      />
      <FilterGrid columns={2}>
        {filteredAndSortedMoods.map((mood) => (
          <Item
            key={mood}
            selected={selectedMoods.includes(mood)}
            onClick={() => handleMoodToggle(mood)}
          >
            {mood}
          </Item>
        ))}
      </FilterGrid>
      <ActionButtons onClear={handleClearClick} onClose={onClose} />
    </FilterWrapper>
  );
};

export default MoodFilter;
