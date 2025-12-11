import React from "react";
import { Skeleton } from "@/client/shared/components/common/Skeleton";

const FilterSkeleton: React.FC = () => {
  return (
    <div className="hidden md:block w-full border-neutral-600 bg-white dark:bg-neutral-950 sticky top-0 py-2 z-10">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-row justify-between items-center w-full">
          {/* Filter Buttons Skeleton */}
          <div className="flex flex-row items-center space-x-2">
            {[...Array(6)].map((_, i) => (
                <Skeleton key={i} variant="rectangular" className="w-20 h-7 rounded-lg" />
            ))}
          </div>

          {/* Sort Filter Skeleton */}
          <div className="relative">
             <Skeleton variant="rectangular" className="w-32 h-7 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSkeleton;
