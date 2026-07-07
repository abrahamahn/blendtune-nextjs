// main/apps/web/src/client/features/sounds/filters/components/sort.tsx
import React from 'react';

import { Button } from '@ui';

import '../filters.css';

const SORT_OPTIONS = ['Newest', 'Oldest', 'Random', 'A-Z'] as const;

interface SortFilterProps {
  /** Current active sort option */
  sortBy: string | null;
  /** Handler for changing the sort option */
  handleSortChange: (option: (typeof SORT_OPTIONS)[number]) => void;
}

/** Sort option menu (the opener owns visibility and positioning). */
const SortFilter: React.FC<SortFilterProps> = ({ sortBy, handleSortChange }) => (
  <div className="bt-sort-menu" role="menu" aria-orientation="vertical">
    {SORT_OPTIONS.map((option) => (
      <Button
        key={option}
        variant="text"
        size="inline"
        role="menuitem"
        className="bt-sort-option"
        data-active={sortBy === option}
        onClick={() => handleSortChange(option)}
      >
        {option}
      </Button>
    ))}
  </div>
);

export default SortFilter;
