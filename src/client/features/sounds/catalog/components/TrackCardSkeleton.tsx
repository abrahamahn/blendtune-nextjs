import React from "react";
import { Skeleton } from "@/client/shared/components/common/Skeleton";

interface TrackCardSkeletonProps {
  isMobile: boolean;
}

const TrackCardSkeleton: React.FC<TrackCardSkeletonProps> = ({ isMobile }) => {
  return (
    <div
      className={`
        flex-none md:w-40 md:h-54 rounded-lg
        bg-transparent dark:bg-transparent 
        relative 
        ${isMobile ? "snap-start" : ""}
      `}
    >
      {/* Image Skeleton */}
      <div className="w-30 h-30 sm:h-36 sm:w-36 md:w-auto flex items-center justify-center relative m-0 mr-0 md:mr-3 md:m-3">
        <div className="w-28 h-28 sm:w-36 sm:h-36 bg-black/5 dark:bg-white/5 p-2 dark:p-2 rounded-lg">
          <Skeleton
            variant="rectangular"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-md"
          />
        </div>
      </div>

      {/* Track Info Skeleton */}
      <div className="mx-0 md:mx-4 mt-2">
         {/* Title */}
        <Skeleton variant="text" className="w-3/4 h-4 mb-2" />
        
        {/* Artist */}
        <Skeleton variant="text" className="w-1/2 h-3" />
      </div>
    </div>
  );
};

export default TrackCardSkeleton;
