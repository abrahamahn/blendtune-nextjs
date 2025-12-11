import React from "react";
import { Skeleton } from "@/client/shared/components/common/Skeleton";

const WelcomeSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full bg-opacity-80 bg-neutral-200 dark:bg-gray-900 rounded-xl flex justify-center items-center">
      <div className="w-96 rounded-lg bg-gray-500 dark:bg-gray-900 flex justify-center items-center">
        <div className="rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 lg:py-4 w-full">
          {/* Welcome header */}
          <div className="flex flex-col items-center p-4">
            <Skeleton variant="text" className="h-6 w-48 mb-4" />
            <Skeleton variant="text" className="h-3 w-64" />
          </div>

          {/* Form Skeleton */}
          <div className="flex flex-col items-center w-full">
            {/* Input fields */}
            {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col w-full mt-3">
                   <Skeleton variant="rectangular" className="h-12 w-full rounded-md" />
                </div>
            ))}

            {/* Date of Birth Selection */}
            <div className="flex flex-row w-full justify-center items-center mt-3 relative">
              <div className="flex flex-row w-full">
                <div className="relative w-1/4 mr-3">
                  <Skeleton variant="rectangular" className="h-12 w-full rounded-md" />
                </div>
                <div className="relative w-1/4 mr-3">
                  <Skeleton variant="rectangular" className="h-12 w-full rounded-md" />
                </div>
                <div className="relative w-1/2">
                   <Skeleton variant="rectangular" className="h-12 w-full rounded-md" />
                </div>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center w-full mt-3">
               <Skeleton variant="rectangular" className="w-10 h-4 rounded-full mr-2" />
               <Skeleton variant="text" className="w-40 h-3" />
            </div>

            {/* Footer Text */}
            <div className="flex flex-row w-full justify-center items-center mt-3">
               <Skeleton variant="text" className="w-full h-8" />
            </div>

            {/* Submit Button */}
            <Skeleton variant="rectangular" className="mt-4 h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSkeleton;
