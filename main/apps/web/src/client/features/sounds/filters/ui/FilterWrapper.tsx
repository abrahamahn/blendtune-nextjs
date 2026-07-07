// main/apps/web/src/client/features/sounds/filters/ui/FilterWrapper.tsx
/**
 * Filter panel container: popover card on desktop, inline section on mobile
 * (the responsive split lives in filters.css, not in duplicate markup).
 */
import React from 'react';

import '../filters.css';

interface FilterWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const FilterWrapper: React.FC<FilterWrapperProps> = ({ children, className }) => (
  <div className={`bt-filter-panel ${className ?? ''}`.trim()}>{children}</div>
);
