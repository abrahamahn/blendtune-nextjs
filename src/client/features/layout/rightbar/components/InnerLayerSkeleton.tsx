import React from "react";
import { Skeleton } from "@/client/shared/components/common/Skeleton";

const InnerLayerSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col overflow-auto">
      {/* Main container skeleton */}
      <div className="p-0 rounded-2xl h-full border dark:border-0 bg-neutral-100 dark:bg-neutral-900">
        <div className="flex flex-col p-8 pt-4 rounded-md m-0 mt-0 lg:mt-2">
          {/* Artwork Skeleton */}
          <div className="flex justify-center mt-0 p-0">
             <Skeleton variant="rectangular" className="w-56 h-56 rounded-md" />
          </div>

          {/* Track Information Skeleton */}
          <div className="mt-4 flex flex-col items-center justify-center w-full">
            <Skeleton variant="text" className="w-3/4 h-6 mb-2" />
            <Skeleton variant="text" className="w-1/2 h-4" />
            
            {/* Badges Skeleton */}
            <div className="flex mt-2 space-x-2">
               <Skeleton variant="rectangular" className="w-12 h-6 rounded-md" />
               <Skeleton variant="rectangular" className="w-16 h-6 rounded-md" />
               <Skeleton variant="rectangular" className="w-12 h-6 rounded-md" />
            </div>
          </div>

          {/* Visualizer Skeleton */}
          <div className="w-full h-8 mt-3">
             <Skeleton variant="rectangular" className="w-full h-full rounded-md" />
          </div>

          {/* Progress Bar Skeleton */}
          <div className="w-full mt-4">
             <Skeleton variant="rectangular" className="w-full h-1 rounded-full" />
             <div className="flex justify-between mt-1">
                 <Skeleton variant="text" className="w-8 h-3" />
                 <Skeleton variant="text" className="w-8 h-3" />
             </div>
          </div>

          {/* Track Details Header */}
          <div className="w-full mt-4 border-b pb-1">
             <Skeleton variant="text" className="w-24 h-4" />
          </div>

          {/* Track Metadata Grid Skeleton */}
          <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col space-y-2">
                  <Skeleton variant="text" className="w-16 h-3" />
                  <Skeleton variant="text" className="w-20 h-4" />
              </div>
              <div className="flex flex-col space-y-2">
                  <Skeleton variant="text" className="w-16 h-3" />
                  <Skeleton variant="text" className="w-20 h-4" />
              </div>
              <div className="flex flex-col space-y-2">
                  <Skeleton variant="text" className="w-16 h-3" />
                  <Skeleton variant="text" className="w-20 h-4" />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InnerLayerSkeleton;
