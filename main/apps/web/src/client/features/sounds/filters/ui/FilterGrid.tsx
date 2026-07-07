// main/apps/web/src/client/features/sounds/filters/ui/FilterGrid.tsx
/**
 * Scrollable option grid for filter panels.
 */
import React from 'react';

import '../filters.css';

interface FilterGridProps {
  children: React.ReactNode;
  /** Desktop column count (mobile always uses three) */
  columns?: 2 | 3;
}

export const FilterGrid: React.FC<FilterGridProps> = ({ children, columns = 2 }) => (
  <div className="bt-filter-grid" data-columns={columns} role="group" aria-label="Filter options">
    {children}
  </div>
);
