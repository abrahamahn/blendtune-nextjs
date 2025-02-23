// src\client\features\layout\rightbar\context\useRightSidebar.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the right sidebar context
interface RightSidebarContextType {
  isOpen: boolean;
  userClosedSidebar: boolean; // New state to track if user manually closed sidebar
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: (userInitiated?: boolean) => void; // Modified to track user-initiated closes
}

// Create the context with a default value
export const RightSidebarContext = createContext<RightSidebarContextType | undefined>(undefined);

// Provider component
export const RightSidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true); // Initialize as open
  const [userClosedSidebar, setUserClosedSidebar] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      // If opening, reset the userClosedSidebar flag
      setUserClosedSidebar(false);
    }
  };
  
  const openSidebar = () => {
    setIsOpen(true);
    // Reset the user closed flag when explicitly opening
    setUserClosedSidebar(false);
  };
  
  const closeSidebar = (userInitiated = true) => {
    setIsOpen(false);
    // Only set the userClosedSidebar flag if this was user-initiated
    if (userInitiated) {
      setUserClosedSidebar(true);
    }
  };
  
  const contextValue = {
    isOpen,
    userClosedSidebar,
    toggleSidebar,
    openSidebar,
    closeSidebar,
  };
  
  return (
    <RightSidebarContext.Provider value={contextValue}>
      {children}
    </RightSidebarContext.Provider>
  );
};

// Custom hook to use the right sidebar context
export const useRightSidebar = () => {
  const context = useContext(RightSidebarContext);
  
  if (context === undefined) {
    throw new Error('useRightSidebar must be used within a RightSidebarProvider');
  }
  
  return context;
};