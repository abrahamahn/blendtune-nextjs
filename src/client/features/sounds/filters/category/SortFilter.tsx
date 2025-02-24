// src\client\features\sounds\filters\components\SortFilter.tsx
import React, { useMemo, useCallback } from "react";

/**
 * Defines the available sort options
 */
const SORT_OPTIONS = ["Newest", "Oldest", "Random", "A-Z"] as const;

/**
 * Props interface for the SortFilter component
 * Defines the structure of props passed to the component
 */
interface SortFilterProps {
  /** Indicates whether the sort filter is open in desktop view */
  openSortFilter: boolean;
  /** Current active sort option */
  sortBy: string | null;
  /** Handler for changing sort option in desktop view */
  handleSortChange: (option: typeof SORT_OPTIONS[number]) => void;
  /** Indicates whether the mobile filter is open */
  mobileFilterOpen?: boolean;
  /** Optional handler for changing sort option in mobile view */
  handleMobileSortChange?: (option: typeof SORT_OPTIONS[number]) => void;
}

/**
 * SortFilter Component
 * Provides an interactive sorting interface for both desktop and mobile views
 * Supports multiple sorting options: Newest, Oldest, Random, A-Z
 * 
 * @component
 * @param {SortFilterProps} props - Component properties
 * @returns {React.ReactElement} Rendered SortFilter component
 */
const SortFilter: React.FC<SortFilterProps> = ({
  openSortFilter,
  mobileFilterOpen,
  sortBy,
  handleSortChange,
  handleMobileSortChange,
}) => {
  /**
   * Generates consistent button className based on current sort state
   * Memoized to prevent unnecessary recalculations
   * 
   * @param {string} option - The sort option to check
   * @returns {string} Tailwind CSS classes for button styling
   */
  const getButtonClassName = useCallback((option: string) => `
    block w-full text-left px-2 py-1.5 text-xs text-neutral-200 
    hover:bg-neutral-200 dark:hover:bg-neutral-700 
    rounded-lg hover:text-neutral-500 
    ${sortBy === option 
      ? "text-neutral-600 dark:text-neutral-50" 
      : "text-neutral-600 dark:text-neutral-500"}
  `, [sortBy]);

  /**
   * Memoized sort buttons to prevent unnecessary re-renders
   */
  const desktopSortButtons = useMemo(() => 
    SORT_OPTIONS.map((option) => (
      <button
        key={option}
        className={getButtonClassName(option)}
        role="menuitem"
        onClick={() => handleSortChange(option)}
      >
        {option}
      </button>
    )), 
    [handleSortChange, getButtonClassName]
  );

  /**
   * Memoized mobile sort buttons to prevent unnecessary re-renders
   */
  const mobileSortButtons = useMemo(() => 
    SORT_OPTIONS.map((option) => (
      <button
        key={option}
        className={getButtonClassName(option)}
        role="menuitem"
        onClick={() => handleMobileSortChange && handleMobileSortChange(option)}
      >
        {option}
      </button>
    )), 
    [handleMobileSortChange, getButtonClassName]
  );

  return (
    <div>
      {/* Desktop Sort Filter */}
      {openSortFilter && (
        <div className="hidden md:block z-20 w-28 bg-white/95 dark:bg-black/90 border border-neutral-200 dark:border-neutral-700 shadow-sm rounded-lg text-neutral-300 text-xs">
          <div
            className="py-0"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {desktopSortButtons}
          </div>
        </div>
      )}

      {/* Mobile Sort Filter */}
      {mobileFilterOpen && (
        <div className="block md:hidden z-20 absolute top-28 right-4 w-32 shadow-lg bg-white/95 dark:bg-black/90 border border-neutral-200 dark:border-neutral-700 px-2 rounded-lg text-neutral-300 p-1">
          <div
            className="py-1.5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {mobileSortButtons}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortFilter;