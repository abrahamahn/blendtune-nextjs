// src/client/features/sounds/filters/ui/FilterGrid.tsx
/**
 * Grid layout component for organizing filter options
 * Provides consistent layout for filter items with customizable columns
 * 
 * @module filters/ui/FilterGrid
 */
import React from 'react';

/**
 * Props for the FilterGrid component
 * 
 * @interface FilterGridProps
 */
interface FilterGridProps {
  /** Child elements to render within the grid */
  children: React.ReactNode;
  
  /** Number of columns to display (2, 3, or 4) */
  columns?: 2 | 3 | 4;
  
  /** Maximum height of the grid with overflow scrolling */
  maxHeight?: string;
  
  /** Whether to enable scrolling for overflow content */
  isScrollable?: boolean;
  
  /** Width of the grid container */
  width?: string;
  
  /** Border color for the grid container */
  borderColor?: string;
  
  /** Gap between grid items */
  gap?: string;
}

/**
 * Grid layout component for filter options
 * Provides responsive grid with customizable columns and scrolling
 * 
 * @param {FilterGridProps} props - Component props
 * @returns {React.ReactElement} - Rendered filter grid
 */
export const FilterGrid: React.FC<FilterGridProps> = ({
  children,
  columns = 2,
  maxHeight = "h-72",
  isScrollable = true,
  width = "w-full",
  borderColor = "border-neutral-400 dark:border-neutral-700",
  gap = "gap-0"
}) => {
  // Dynamically generate grid columns class based on columns prop
  const gridColumnClass = columns === 2 
    ? "grid-cols-2" 
    : columns === 3 
    ? "grid-cols-3" 
    : "grid-cols-4";

  return (
    <div 
      className={`
        ${width} 
        border rounded-md ${borderColor} 
        grid ${gridColumnClass} 
        ${gap}
        ${isScrollable ? `overflow-y-auto scrollbar ${maxHeight}` : ''}
      `}
      role="group"
      aria-label="Filter options"
    >
      {children}
    </div>
  );
};