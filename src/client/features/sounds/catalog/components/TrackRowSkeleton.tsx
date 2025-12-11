import React from "react";
import { Skeleton } from "@/client/shared/components/common/Skeleton";

const TrackRowSkeleton: React.FC = () => {
  return (
    <div className="relative">
      {/* Bottom Border Separator */}
      <div className="absolute bottom-0 left-0 right-0 border-b border-neutral-300 dark:border-neutral-900" />
      
      {/* Track Row */}
      <div className="flex items-center p-1 relative h-18">
        {/* Track Number Column */}
        <div className="mr-4 w-8 h-8 flex justify-center items-center">
            <Skeleton variant="text" width={12} />
        </div>
        
        {/* Track Artwork Column */}
        <div className="relative w-16 h-16 rounded-md">
            <Skeleton variant="rectangular" className="w-16 h-16 rounded-md" />
        </div>

        <div className="flex flex-row justify-between w-full ml-2">
          {/* Title Section */}
          <div className="flex flex-row w-5/12">
            <div className="flex-start flex-col justify-center items-center ml-1 w-full">
                <Skeleton variant="text" className="w-3/4 h-4 mb-1" />
                <Skeleton variant="text" className="w-1/2 h-3" />
            </div>
          </div>
          
          {/* Metadata Section */}
          <div className="grid grid-cols-5 items-center justify-center gap-8 w-64 mr-2">
            <div className="col-span-1"><Skeleton variant="text" width={30} /></div>
            <div className="col-span-1"><Skeleton variant="text" width={20} /></div>
            <div className="col-span-1"><Skeleton variant="rectangular" width={40} height={16} /></div>
            <div className="col-span-2"><Skeleton variant="rectangular" width={60} height={16} /></div>
          </div>
          
          {/* Tags Section */}
          <div className="p-2 grid grid-cols-3 grid-rows-2 gap-2 w-64 justify-center items-center">
             {[...Array(5)].map((_, i) => (
                 <Skeleton key={i} variant="text" className="w-full h-3" />
             ))}
          </div>
          
          {/* Actions Section */}
          <div className="flex justify-center items-center flex-grow">
              <Skeleton variant="circular" width={32} height={32} className="mr-2" />
              <Skeleton variant="circular" width={32} height={32} className="mr-2" />
              <Skeleton variant="circular" width={32} height={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackRowSkeleton;
