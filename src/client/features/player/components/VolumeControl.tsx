// src\client\features\player\components\VolumeControl.tsx
import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useVolumeControl } from "../hooks";
import { useThrottleFn } from "@client/shared/utils/useThrottleFn";

/**
 * Displays and controls the volume level with a slider.
 * This version uses a throttled mouse–move handler (at ~60fps) to reduce frequent DOM measurements.
 */
export const VolumeControl: React.FC = () => {
  const { 
    volume, 
    setVolume, 
    volumeIcon, 
    iconTransform,
    toggleVolumeVisibility, 
    isVolumeVisible,
    calculateVolume
  } = useVolumeControl();
  
  const volumeContainerRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  // Throttled mouse–move handler to update volume at ~60fps.
  const handleVolumeMouseMove = useThrottleFn((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (volumeBarRef.current) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const newVolume = calculateVolume(e.clientY, rect);
      setVolume(newVolume);
    }
  }, 16); // 16ms delay ~60fps

  return (
    <div ref={volumeContainerRef} className="relative shrink-0 flex justify-center md:w-12 mr-3">
      <button
        onClick={toggleVolumeVisibility}
        className="focus:outline-none focus:ring-0 inline-block w-10 h-10"
      >
        <div className="w-full h-full flex items-center justify-center">
          <FontAwesomeIcon
            icon={volumeIcon}
            size="sm"
            style={{ transform: iconTransform }}
            className="cursor-pointer hover:opacity-75 text-[#1F1F1F] dark:text-white"
          />
        </div>
      </button>
      {isVolumeVisible && (
        <div
          onMouseMove={handleVolumeMouseMove}
          onWheel={(e) => e.preventDefault()} // Optionally throttle wheel events too
          className="volume-bar select-none cursor-pointer bg-neutral-50 border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 h-28 w-6 rounded-full absolute bottom-10 right-[9px] transform z-10 flex justify-center items-center"
        >
          <div
            ref={volumeBarRef}
            className="bg-blue-600 rounded-lg h-20 w-1 cursor-pointer relative"
          >
            <div
              className="bg-neutral-200 dark:bg-neutral-500 rounded-lg w-1"
              style={{ height: `${(1 - volume) * 100}%` }}
            />
            <div
              className="rounded-full h-3 w-3 bg-blue-600 absolute cursor-pointer"
              style={{
                bottom: `${volume * 100}% - [5px]`,
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 50,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VolumeControl;
