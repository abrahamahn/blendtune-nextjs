import React from "react";
import { Skeleton } from "@/client/shared/components/common/Skeleton";

const CategorySkeleton: React.FC = () => {
  return (
    <div className="max-w-screen-xl mx-auto md:px-2 lg:px-2 px-4 sm:pt-4 md:pt-0 lg:p-2">
      <div className="flex flex-row justify-start items-start w-full border-b border-neutral-200 dark:border-neutral-700 overflow-x-hidden space-x-4 pb-2">
        {[...Array(8)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="w-20 h-8 rounded-full" />
        ))}
      </div>
    </div>
  );
};

export default CategorySkeleton;
