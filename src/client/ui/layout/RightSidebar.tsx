// RightSidebar.tsx
"use client";
import React, { useState, useCallback, useEffect } from "react";
import Rightbar from "@/client/ui/global/rightbar";
import ResizableHandle from "./ResizableHandle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const MIN_WIDTH = 19 * 16; // 304px
const MAX_WIDTH = 22.5 * 16; // 360px

interface RightSidebarProps {
  onClose: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ onClose }) => {
  const [rightBarWidth, setRightBarWidth] = useState<number>(MIN_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  const onResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const onResize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = document.body.clientWidth - e.clientX;
      newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
      setRightBarWidth(newWidth);
    },
    [isResizing]
  );

  const onResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

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
      {/* X Button to close the sidebar */}
      <button
        onClick={onClose}
        className="absolute top-2 right-3 z-10 p-2 w-8 h-4"
        aria-label="Close sidebar"
      >
        <FontAwesomeIcon icon={faX} size="sm" className="text-neutral-400 dark:text-neutral-300" />
      </button>

      <ResizableHandle onResizeStart={onResizeStart} />

      <div className="w-full h-full overflow-auto">
        <Rightbar />
      </div>
    </div>
  );
};

export default RightSidebar;
