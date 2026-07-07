// main/apps/web/src/client/features/sounds/category/components/Item.tsx
// A single genre tab. Active = amber text + amber underline (the one accent).
import React from 'react';

import { Button } from '@ui';

import '../category.css';

interface CategoryItemProps {
  genre: string;
  isSelected: boolean;
  onClick: (genre: string) => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({ genre, isSelected, onClick }) => (
  <Button
    variant="text"
    size="inline"
    role="tab"
    className="bt-genre-tab"
    aria-selected={isSelected}
    onClick={() => onClick(genre)}
  >
    {genre}
  </Button>
);
