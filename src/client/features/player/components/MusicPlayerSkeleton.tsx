import React from "react";
import { Skeleton } from "@/client/shared/components/common/Skeleton";

const MusicPlayerSkeleton: React.FC = () => {
  return (
    <div>
      {/* DESKTOP PLAYER SKELETON */}
      <div className="hidden md:block fixed bottom-0 left-0 w-full flex justify-center items-center">
        <div className="flex flex-row items-center justify-center w-full h-20 border-t dark:border-neutral-800 bg-white dark:bg-transparent border-neutral-300 backdrop-blur-md lg:px-6 px-0">
          {/* Playback Controls Skeleton */}
          <div className="flex items-center justify-center w-1/4">
             <Skeleton variant="circular" width={32} height={32} className="mx-2" />
             <Skeleton variant="circular" width={40} height={40} className="mx-2" />
             <Skeleton variant="circular" width={32} height={32} className="mx-2" />
          </div>

          {/* Track Progress and Volume Skeleton */}
          <div className="flex flex-row w-1/2 h-full items-center px-4 space-x-4">
             <Skeleton variant="text" className="w-10 h-3" />
             
             {/* Waveform Skeleton */}
             <div className="flex flex-1 items-center justify-center space-x-1 h-8 overflow-hidden opacity-50">
                {[...Array(20)].map((_, i) => (
                    <Skeleton 
                      key={i} 
                      variant="rectangular" 
                      className={`w-1 rounded-full ${i % 2 === 0 ? 'h-4' : 'h-6'}`} 
                    />
                ))}
             </div>

             <Skeleton variant="text" className="w-10 h-3" />
             <Skeleton variant="rectangular" className="w-24 h-1 rounded-full" />
          </div>

          {/* Track Info Skeleton */}
          <div className="flex items-center w-1/4 px-4 space-x-3">
             <Skeleton variant="rectangular" width={48} height={48} className="rounded-md" />
             <div className="flex flex-col space-y-1 w-full">
                 <Skeleton variant="text" className="w-3/4 h-3" />
                 <Skeleton variant="text" className="w-1/2 h-2" />
             </div>
          </div>
        </div>
      </div>

      {/* MOBILE PLAYER SKELETON */}
      <div className="md:hidden fixed bottom-0 w-full bg-white dark:bg-black border-t dark:border-neutral-800 p-2 h-16 flex items-center">
          <Skeleton variant="rectangular" width={48} height={48} className="rounded-md mr-3" />
          <div className="flex flex-col flex-1 space-y-1">
              <Skeleton variant="text" className="w-3/4 h-3" />
              <Skeleton variant="text" className="w-1/2 h-2" />
          </div>
          <Skeleton variant="circular" width={32} height={32} className="ml-3" />
      </div>
    </div>
  );
};

export default MusicPlayerSkeleton;
