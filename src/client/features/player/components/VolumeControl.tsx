import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useVolumeControl } from "../hooks";

/**
 * Displays and controls volume level with a slider
 */
export const VolumeControl: React.FC = () => {
  const { 
    volume, 
    volumeIcon, 
    iconTransform,
    toggleVolumeVisibility, 
    isVolumeVisible, 
    handleVolumeMouseDown,
    handleVolumeWheel,
    useDragListeners,
    useOutsideClick,
    useGlobalWheel
  } = useVolumeControl();
  
  const volumeContainerRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  // Use custom hooks for various volume interactions
  useDragListeners(volumeBarRef);
  useOutsideClick(volumeContainerRef);
  useGlobalWheel();

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
          onMouseDown={(e) => handleVolumeMouseDown(e, volumeBarRef)}
          onWheel={handleVolumeWheel}
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