// src\client\shared\components\icons\LoadingIcon.tsx
import React from "react";

/**
 * Animated loading icon component
 * Renders three animated circles to indicate loading state
 * 
 * @component
 * @example
 * return (
 *   <LoadingIcon />
 * )
 */
const LoadingIcon: React.FC = () => {
  return (
    <div className="loading-icon">
      {/* Three circles with staggered animation delays */}
      <div className="loading-icon-circle" style={{ animationDelay: "0s" }} />
      <div className="loading-icon-circle" style={{ animationDelay: "0.2s" }} />
      <div className="loading-icon-circle" style={{ animationDelay: "0.4s" }} />
    </div>
  );
};

export default LoadingIcon;