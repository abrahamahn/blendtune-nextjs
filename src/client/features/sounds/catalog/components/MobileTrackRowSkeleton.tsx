import React from "react";
import { Skeleton } from "@/client/shared/components/common/Skeleton";

const MobileTrackRowSkeleton: React.FC = () => {
  return (
    <div className="flex p-1 border-neutral-300 dark:border-neutral-800 justify-center items-center rounded-lg pr-12 relative h-16">
      {/* Artwork Skeleton */}
      <Skeleton variant="rectangular" className="w-[50px] h-[50px] rounded-md" />

      {/* Track Information Skeleton */}
      <div className="flex flex-row justify-between w-full ml-2">
        
        {/* Title Info Skeleton */}
        <div className="flex flex-col pt-0 w-1/3">
           <Skeleton variant="text" className="h-3 w-3/4 mb-1" />
           <Skeleton variant="text" className="h-2 w-1/2" />
        </div>

        {/* Attributes Skeleton */}
        <div className="flex flex-col justify-center items-end w-1/2">
          <div className="flex justify-end mb-1">
             <Skeleton variant="rectangular" className="h-4 w-12 mr-1 rounded-md" />
             <Skeleton variant="rectangular" className="h-4 w-12 mr-1 rounded-md" />
             <Skeleton variant="rectangular" className="h-4 w-8 rounded-md" />
          </div>
          <div className="flex flex-row justify-end">
             <Skeleton variant="text" className="h-2 w-8 mr-1" />
             <Skeleton variant="text" className="h-2 w-8" />
          </div>
        </div>
      </div>
      
       {/* Actions Placeholder (Matches the pr-12 space) */}
       {/* Since actions are absolute or handled via padding in real component, we might not need explicit skeleton for actions if they are hidden/static, but let's put a small circle just in case */}
    </div>
  );
};

export default MobileTrackRowSkeleton;
