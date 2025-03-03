// src\client\features\player\components\VolumeControl.tsx
/**
 * @fileoverview Volume control component with slider
 * @module features/player/components/VolumeControl
 */

import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useVolumeControl } from "../hooks";

/**
 * Displays and controls volume level with a slider
 */
export const VolumeControl: React.FC = () => {
  const { 
    volume, 
    setVolume, 
    volumeIcon, 
    toggleVolumeVisibility, 
    isVolumeVisible, 
    handleVolumeWheel 
  } = useVolumeControl();
  
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const volumeContainerRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  // Calculate volume percentage and icon positioning
  const volPercent = Math.round(volume * 100);
  const iconTransform =
    volPercent === 0 ? "translateX(2.5px)" :
    volPercent === 100 ? "translateX(3.5px)" :
    "translateX(0)";

  /**
   * Calculate volume level from mouse position
   */
  const calculateVolume = (clientY: number, rect: DOMRect) => {
    const newVolume = 1 - (clientY - rect.top) / rect.height;
    return Math.max(0, Math.min(1, newVolume));
  };

  /**
   * Initialize volume drag operation
   */
  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingVolume(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "pointer";
    
    if (volumeBarRef.current) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const newVolume = calculateVolume(e.clientY, rect);
      setVolume(newVolume);
    }
    e.preventDefault();
  };

  /**
   * Handle volume control drag operation
   */
  useEffect(() => {
    if (isDraggingVolume) {
      const handleDocumentMouseMove = (e: MouseEvent) => {
        if (volumeBarRef.current) {
          const rect = volumeBarRef.current.getBoundingClientRect();
          const newVolume = calculateVolume(e.clientY, rect);
          setVolume(newVolume);
        }
        e.preventDefault();
      };
      
      document.addEventListener("mousemove", handleDocumentMouseMove);
      return () => document.removeEventListener("mousemove", handleDocumentMouseMove);
    }
  }, [isDraggingVolume, setVolume]);

  /**
   * Clean up volume drag operation
   */
  useEffect(() => {
    const handleDocumentMouseUp = () => {
      if (isDraggingVolume) {
        setIsDraggingVolume(false);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }
    };
    
    document.addEventListener("mouseup", handleDocumentMouseUp);
    return () => document.removeEventListener("mouseup", handleDocumentMouseUp);
  }, [isDraggingVolume]);

  /**
   * Handle clicks outside volume control
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        volumeContainerRef.current &&
        !volumeContainerRef.current.contains(e.target as Node)
      ) {
        toggleVolumeVisibility();
      }
    };
    
    if (isVolumeVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isVolumeVisible, toggleVolumeVisibility]);

  /**
   * Global wheel event handler for volume control
   */
  useEffect(() => {
    if (!isVolumeVisible) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    
    const handleGlobalWheel: EventListener = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const wheelEvent = e as WheelEvent;

      // Handle volume limits
      if (volume === 1 && wheelEvent.deltaY < 0) {
        toggleVolumeVisibility();
        return;
      }
      if (volume === 0 && wheelEvent.deltaY > 0) {
        toggleVolumeVisibility();
        return;
      }

      // Adjust volume
      const step = 0.05;
      const newVolume = Math.max(0, Math.min(1, volume - Math.sign(wheelEvent.deltaY) * step));
      setVolume(newVolume);
    };

    const wheelOptions = { passive: false, capture: true } as AddEventListenerOptions;
    document.addEventListener("wheel", handleGlobalWheel, wheelOptions);
    
    return () => {
      document.removeEventListener("wheel", handleGlobalWheel, wheelOptions);
      document.body.style.overflow = "";
    };
  }, [isVolumeVisible, volume, setVolume, toggleVolumeVisibility]);

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
          onMouseDown={handleVolumeMouseDown}
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