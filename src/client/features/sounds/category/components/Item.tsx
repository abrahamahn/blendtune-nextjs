// src\client\features\sounds\category\components\Item.tsx
/**
 * Individual category item button component
 * Represents a single genre selection option
 * 
 * @module sounds/category/components/CategoryItem
 */
import React from "react";

/**
 * Props for the CategoryItem component
 * @interface CategoryItemProps
 */
interface CategoryItemProps {
  /** The name of the genre */
  genre: string;
  
  /** Whether the genre is currently selected */
  isSelected: boolean;
  
  /** Click handler for selection */
  onClick: (genre: string) => void;
}

/**
 * Individual genre selection button
 * Shows active state when selected
 * 
 * @param {CategoryItemProps} props - Component properties
 * @returns {React.ReactElement} Rendered category item
 */
export const CategoryItem: React.FC<CategoryItemProps> = ({ 
  genre, 
  isSelected, 
  onClick 
}) => {
  return (
    <button
      onClick={() => onClick(genre)}
      className={`flex justify-center items-center text-sm mr-2 py-1 px-2 ${
        isSelected
          ? "text-neutral-500 dark:text-neutral-100 border-b-2 border-neutral-600 dark:border-neutral-100"
          : "text-neutral-600 hover:text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-200 border-b border-transparent"
      }`}
      aria-pressed={isSelected}
    >
      <p>{genre}</p>
    </button>
  );
};