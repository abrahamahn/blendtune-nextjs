"use client";
import React, { useState, useCallback, useEffect } from "react";
import Rightbar from "@/client/ui/global/rightbar";
import ResizableHandle from "./ResizableHandle";

// If you want the min width to be 304px (19rem), for example:
const MIN_WIDTH = 19 * 16;   // 304px
const MAX_WIDTH = 22.5 * 16; // 360px

const RightSidebar: React.FC = () => {
  // Initialize to MIN_WIDTH to match the smallest allowed size
  const [rightBarWidth, setRightBarWidth] = useState<number>(MIN_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  // ✅ Use React.MouseEvent for component events
  const onResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  // ✅ Use global `MouseEvent` for document events
  const onResize = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!isResizing) return;
      // Calculate how wide the sidebar should be based on mouse X
      let newWidth = document.body.clientWidth - e.clientX;

      // Clamp within the min and max
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
      <ResizableHandle onResizeStart={onResizeStart} />
      <div className="w-full h-full overflow-auto">
        <Rightbar />
      </div>
    </div>
  );
};

export default RightSidebar;
