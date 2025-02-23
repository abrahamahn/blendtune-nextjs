// src\client\features\player\components\ResizableHandle.tsx
"use client";
import React, { useState } from "react";

interface ResizableHandleProps {
  onResizeStart: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const ResizableHandle: React.FC<ResizableHandleProps> = ({ onResizeStart }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className="absolute top-0 left-0 w-3 h-full cursor-col-resize bg-transparent"
      onMouseDown={(e) => {
        setIsActive(true);
        onResizeStart(e);
      }}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      style={{ zIndex: 10 }}
    >
      {/* Thin visible line */}
      <div
        className={`absolute top-0 left-1 w-[1px] h-full transition-colors ${
          isActive ? "bg-white" : "bg-transparent hover:bg-white/50"
        }`}
      />
    </div>
  );
};

export default ResizableHandle;
