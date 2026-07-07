// main/apps/web/src/client/features/sounds/filters/ui/SearchInput.tsx
/**
 * Search input for filtering options within a panel.
 */
import React from 'react';

import { Input } from '@ui';

import '../filters.css';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search…',
}) => (
  <div className="bt-filter-search">
    <Input value={value} onChange={onChange} placeholder={placeholder} aria-label={placeholder} />
  </div>
);
