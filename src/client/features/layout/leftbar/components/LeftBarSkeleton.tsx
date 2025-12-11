import React from "react";
import { Skeleton } from "@/client/shared/components/common/Skeleton";

const LeftBarSkeleton: React.FC = () => {
  return (
    <header>
      {/* Home navigation skeleton */}
      <div className="bg-white border dark:border-0 dark:bg-neutral-950 rounded-xl h-20 flex justify-center items-center">
         <div className="flex flex-col items-center">
             <Skeleton variant="rectangular" className="w-8 h-6 mb-2" />
             <Skeleton variant="text" className="w-10 h-2" />
         </div>
      </div>

      {/* Genre navigation skeleton */}
      <div className="mt-2 bg-white border dark:border-0 dark:bg-neutral-950 rounded-xl p-2">
         {/* Simulate "Sounds" + 6 genres */}
         {[...Array(7)].map((_, i) => (
             <div key={i} className="flex flex-col items-center py-3">
                 <Skeleton variant="rectangular" className="w-6 h-6 mb-2" />
                 <Skeleton variant="text" className="w-12 h-2" />
             </div>
         ))}
      </div>

      {/* Page navigation skeleton */}
      <div className="mt-2 bg-white border dark:border-0 dark:bg-neutral-950 rounded-xl p-2">
         {[...Array(3)].map((_, i) => (
             <div key={i} className="flex flex-col items-center py-3">
                 <Skeleton variant="rectangular" className="w-6 h-6 mb-2" />
                 <Skeleton variant="text" className="w-12 h-2" />
             </div>
         ))}
      </div>
    </header>
  );
};

export default LeftBarSkeleton;
