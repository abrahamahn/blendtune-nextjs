// src\client\shared\components\common\LoadingIcon.tsx
import React from "react";

const LoadingIcon: React.FC = () => {
  return (
    <div className="loading-icon">
      <div className="loading-icon-circle" style={{ animationDelay: "0s" }} />
      <div className="loading-icon-circle" style={{ animationDelay: "0.2s" }} />
      <div className="loading-icon-circle" style={{ animationDelay: "0.4s" }} />
    </div>
  );
};

export default LoadingIcon;
