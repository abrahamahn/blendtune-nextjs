// main/apps/web/src/client/features/sounds/category/layout/Category.tsx
/**
 * Genre tab row for filtering tracks — the only genre UI in the marketplace.
 * Selection state lives in the Redux filter store.
 */
import React from 'react';

import { DEFAULT_GENRES } from '../constants';
import { useCategorySelection } from '../hooks/useCategorySelection';
import { CategoryItem } from '../components/Item';
import { CategoryProps } from '../types';
import CategorySkeleton from '../components/CategorySkeleton';

import '../category.css';

const Category: React.FC<CategoryProps & { isLoading?: boolean }> = ({
  className = '',
  genres = DEFAULT_GENRES,
  isLoading = false,
}) => {
  const { handleGenreSelection, isGenreSelected } = useCategorySelection();

  if (isLoading) {
    return <CategorySkeleton />;
  }

  return (
    <div
      className={`bt-genre-tabs ${className}`.trim()}
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
  );
};

export default Category;
