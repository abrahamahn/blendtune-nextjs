// RightSidebarContext.tsx
"use client";
import React, { createContext, useContext } from "react";

interface RightSidebarContextType {
  showSidebar: () => void;
  userClosed: boolean;
}

export const RightSidebarContext = createContext<RightSidebarContextType>({
  showSidebar: () => {},
  userClosed: false,
});

export const useRightSidebar = () => useContext(RightSidebarContext);
