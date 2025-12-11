// src\client\shared\components\common\Watermark.tsx
import React from "react";

/** Props for configuring Watermark component */
interface WatermarkProps {
  /** Size of the watermark */
  size: string;
}

/**
 * Renders a branded watermark with responsive sizing
 */
const Watermark: React.FC<WatermarkProps> = ({ size }) => {
  let textSizeClass;
  let bgSizeClass;

  // Color variations (unused but kept for potential future use)
  const backgroundColors = [
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-red-100",
    "bg-purple-100",
  ];

  // Determine background size classes based on size prop
  switch (size) {
    case "xl":
      bgSizeClass = "w-12 h-5 p-0.5 bottom-4 right-1 rounded-md";
      break;
    case "lg":
      bgSizeClass = "w-10 h-4 p-0.5 bottom-3.5 right-1 rounded-md";
      break;
    case "md":
      bgSizeClass = "w-10 h-4 p-0.5 bottom-3 right-1 rounded-md";
      break;
    case "sm":
      bgSizeClass = "flex w-5 h-2 bottom-2 right-0 rounded-sm";
      break;
    default:
      bgSizeClass = "relative w=10 h-4 p-0.5";
      break;
  }

  // Determine text size classes based on size prop
  switch (size) {
    case "xl":
      textSizeClass = "text-xs";
      break;
    case "lg":
      textSizeClass = "text-3xs";
      break;
    case "md":
      textSizeClass = "text-3xs";
      break;
    case "sm":
      textSizeClass = "text-4xs";
      break;
    default:
      textSizeClass = "text-base";
      break;
  }

  return (
    <div
      className={`absolute justify-center items-center ${bgSizeClass} bg-neutral-800 dark:bg-black`}
    >
      <p
        className={`flex justify-center items-center text-neutral-200 dark:text-white font-extrabold tracking-tighter ${textSizeClass} p-0`}
      >
        BLEND.
      </p>
    </div>
  );
};

export default Watermark;