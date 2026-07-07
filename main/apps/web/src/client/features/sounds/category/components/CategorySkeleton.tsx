// main/apps/web/src/client/features/sounds/category/components/CategorySkeleton.tsx
// Loading placeholder mirroring the genre tab row.
import React from 'react';

import { Skeleton } from '@ui';

import '../category.css';

const CategorySkeleton: React.FC = () => (
  <div className="bt-genre-tabs" aria-hidden="true">
    {Array.from({ length: 7 }).map((_, i) => (
      <Skeleton key={i} width="4rem" height="2rem" />
    ))}
  </div>
);

export default CategorySkeleton;
