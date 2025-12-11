// src/client/features/layout/rightbar/index.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import InnerLayer from "@rightbar/components/InnerLayer";
import ResizableHandle from "@rightbar/context/ResizableHandle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useRightSidebar } from "@rightbar/context/useRightSidebar";
import { usePlayer } from "@/client/features/player/services/playerService";

/**
 * Constants for sidebar width constraints
 * Using rem units (16px base) for consistent scaling
 */
const MIN_WIDTH = 19 * 16; // 304px
const MAX_WIDTH = 22.5 * 16; // 360px

/**
 * RightBar Component
 * 
 * Renders a resizable sidebar with width constraints and close functionality.
 * Handles mouse events for resizing and maintains width state.
 * Only visible on large screens (lg breakpoint and above).
 * 
 * @component
 */
const RightBar: React.FC = () => {
  const { closeSidebar } = useRightSidebar();
  const { currentTrack } = usePlayer();
  const [rightBarWidth, setRightBarWidth] = useState<number>(MIN_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  /**
   * Initiates the resize operation
   * @param e - Mouse event that triggered the resize
   */
  const onResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  /**
   * Handles the continuous resize operation
   * Calculates and sets new width within MIN_WIDTH and MAX_WIDTH constraints
   * @param e - Mouse event containing current cursor position
   */
  const onResize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = document.body.clientWidth - e.clientX;
      newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
      setRightBarWidth(newWidth);
    },
    [isResizing]
  );

  /**
   * Terminates the resize operation
   */
  const onResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  /**
   * Handles the close button click
   * Triggers sidebar close with user-initiated flag
   */
  const handleClose = useCallback(() => {
    closeSidebar(true);
  }, [closeSidebar]);

  /**
   * Sets up and cleans up mouse event listeners for resize functionality
   * Listeners are only active during resize operations
   */
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", onResize);
      document.addEventListener("mouseup", onResizeEnd);
    } else {
      document.removeEventListener("mousemove", onResize);
      document.removeEventListener("mouseup", onResizeEnd);
    }

    return () => {
      document.removeEventListener("mousemove", onResize);
      document.removeEventListener("mouseup", onResizeEnd);
    };
  }, [isResizing, onResize, onResizeEnd]);

  return (
    <div
      className="hidden lg:block flex-none relative h-full"
      style={{ width: `${rightBarWidth}px` }}
    >
      {/* Close button - positioned absolutely in top-right corner */}
      {currentTrack && (
        <button
          onClick={handleClose}
          className="absolute top-2 right-3 z-10 p-2 w-8 h-4"
          aria-label="Close sidebar"
        >
          <FontAwesomeIcon 
            icon={faX} 
            size="sm" 
            color="#525252" 
            className="text-[#525252] dark:text-neutral-300" 
          />
        </button>
      )}

      {/* Resize handle component */}
      <ResizableHandle onResizeStart={onResizeStart} />

      {/* Main content container with scrolling */}
      <div className="absolute top-2 left-1 right-2 bottom-2 overflow-hidden rounded-xl">
        <InnerLayer />
      </div>
    </div>
  );
};

export default RightBar;