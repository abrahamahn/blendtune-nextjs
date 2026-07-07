// main/apps/web/src/client/features/sounds/filters/components/FilterSkeleton.tsx
// Loading placeholder mirroring the desktop filter chip row.
import React from 'react';

import { Skeleton } from '@ui';

import '../filters.css';

const FilterSkeleton: React.FC = () => (
  <div className="bt-filterbar" aria-hidden="true">
    <div className="bt-filterbar-chips">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} width="5rem" height="1.75rem" />
      ))}
    </div>
    <Skeleton width="8rem" height="1.75rem" />
  </div>
);

export default FilterSkeleton;
