// src/client/features/sounds/category/components/Category.tsx
/**
 * Category selection component for filtering tracks by genre
 * Displays a horizontally scrollable list of music genres
 * 
 * @module sounds/category/components/Category
 */
import React from "react";
import { GenreItem } from "../types";
import { DEFAULT_GENRES } from "../constants";
import { useCategorySelection } from "../hooks/useCategorySelection";
import { CategoryItem } from "../components/Item";
import { CategoryProps } from "../types";

/**
 * Genre selection component for filtering tracks
 * Displays a horizontally scrollable list of music genres
 * Manages selection state through Redux store
 * 
 * @param {CategoryProps} props - Component properties
 * @returns {React.ReactElement} Rendered category component
 */
const Category: React.FC<CategoryProps> = ({ 
  className = "",
  genres = DEFAULT_GENRES
}) => {
  const { handleGenreSelection, isGenreSelected } = useCategorySelection();

  return (
    <div className={`max-w-screen-xl mx-auto md:px-2 lg:px-2 px-4 sm:pt-4 md:pt-0 lg:p-2 ${className}`}>
      <div 
        className="flex flex-row justify-start items-start w-full border-b border-neutral-200 dark:border-neutral-700 overflow-x-scroll"
        role="tablist"
        aria-label="Music genres"
      >
        {genres.map((genreItem) => (
          <CategoryItem
            key={genreItem.id}
            genre={genreItem.name}
            isSelected={isGenreSelected(genreItem.name)}
            onClick={handleGenreSelection}
          />
        ))}
      </div>
    </div>
  );
};

export default Category;