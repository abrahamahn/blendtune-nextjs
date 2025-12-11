// src\client\features\player\components\ResizableHandle.tsx
"use client";

import React, { useState } from "react";

/**
* Props for the ResizableHandle component
* @property onResizeStart - Callback fired when resize operation begins
*/
interface ResizableHandleProps {
 onResizeStart: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
* Renders a draggable handle for resizing containers
* Shows a thin line that highlights on hover and during resize
* The handle area is wider than the visible line for better UX
*/
const ResizableHandle: React.FC<ResizableHandleProps> = ({ onResizeStart }) => {
 // Tracks whether handle is currently being dragged
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
     {/* Visual indicator line - shows on hover and during resize */}
     <div
       className={`absolute top-0 left-1 w-[1px] h-full transition-colors ${
         isActive ? "bg-white" : "bg-transparent hover:bg-white/50"
       }`}
     />
   </div>
 );
};

export default ResizableHandle;