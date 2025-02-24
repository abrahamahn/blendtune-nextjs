// src\client\features\layout\rightbar\context\useRightSidebar.tsx
/**
 * @file src/client/features/layout/rightbar/context/useRightSidebar.tsx
 * @description Context and hooks for managing the right sidebar state and interactions.
 * Handles sidebar visibility, user preferences, and provides a clean API for sidebar operations.
 */

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * Interface defining the shape of the right sidebar context.
 * Contains state and methods for managing sidebar visibility and user interactions.
 */
interface RightSidebarContextType {
  /** Current visibility state of the sidebar */
  isOpen: boolean;
  /** Tracks whether the user has manually closed the sidebar */
  userClosedSidebar: boolean;
  /** Toggles the sidebar's visibility state */
  toggleSidebar: () => void;
  /** Forces the sidebar into an open state */
  openSidebar: () => void;
  /** 
   * Closes the sidebar with optional tracking of user interaction
   * @param userInitiated - Indicates if the close action was triggered by user interaction
   */
  closeSidebar: (userInitiated?: boolean) => void;
}

// Initialize context with undefined default - forces consumers to use provider
export const RightSidebarContext = createContext<RightSidebarContextType | undefined>(undefined);

/**
 * Provider component that manages the right sidebar state and makes it available
 * to child components through context.
 * 
 * @example
 * ```tsx
 * <RightSidebarProvider>
 *   <App />
 * </RightSidebarProvider>
 * ```
 */
export const RightSidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize sidebar as visible by default
  const [isOpen, setIsOpen] = useState(true);
  const [userClosedSidebar, setUserClosedSidebar] = useState(false);

  /**
   * Toggles the sidebar visibility state and resets user preference when opening
   */
  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setUserClosedSidebar(false);
    }
  };
  
  /**
   * Forces the sidebar into an open state and resets user preference
   */
  const openSidebar = () => {
    setIsOpen(true);
    setUserClosedSidebar(false);
  };
  
  /**
   * Closes the sidebar and optionally tracks user interaction
   * @param userInitiated - Defaults to true, set to false for programmatic closes
   */
  const closeSidebar = (userInitiated = true) => {
    setIsOpen(false);
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

/**
 * Custom hook that provides access to the right sidebar context.
 * Must be used within a RightSidebarProvider component tree.
 * 
 * @throws {Error} When used outside of a RightSidebarProvider
 * @returns {RightSidebarContextType} The right sidebar context value
 * 
 * @example
 * ```tsx
 * const { isOpen, toggleSidebar } = useRightSidebar();
 * ```
 */
export const useRightSidebar = (): RightSidebarContextType => {
  const context = useContext(RightSidebarContext);
  
  if (context === undefined) {
    throw new Error('useRightSidebar must be used within a RightSidebarProvider');
  }
  
  return context;
};