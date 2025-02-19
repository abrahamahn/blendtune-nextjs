// src/app/sounds/ClientSoundsLayout.tsx (Client Component)
"use client";

import React, { useState } from "react";
import Header from "@/client/ui/global/header";
import SideBar from "@/client/ui/global/sidebar";
import RightSidebar from "@/client/ui/layout/RightSidebar";
import { RightSidebarContext } from "@/client/utils/context/RightSidebarContext";

export default function ClientSoundsLayout({ children }: { children: React.ReactNode }) {
  // Manage sidebar visibility and track how many times the user has closed it.
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [closeCount, setCloseCount] = useState(0);

  // showSidebar() will re-open the sidebar if the user has not permanently closed it (i.e. closeCount < 2).
  const showSidebar = () => {
    if (closeCount < 2) {
      setShowRightSidebar(true);
      setCloseCount(0); // reset the counter once the sidebar reopens
    }
  };

  const contextValue = {
    showSidebar,
    // userClosed is true when the user has closed the sidebar twice (i.e. permanently closed)
    userClosed: closeCount >= 2,
  };

  return (
    <RightSidebarContext.Provider value={contextValue}>
      <div className="flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <div className="h-14 shrink-0">
          <Header />
        </div>
        {/* MAIN CONTAINER */}
        <div className="flex-auto overflow-hidden">
          <div className="flex h-full">
            {/* LEFT SIDEBAR */}
            <div className="hidden md:block w-20 flex-none pl-2 p-2 h-full overflow-auto">
              <SideBar />
            </div>
            {/* MAIN CONTENT AREA */}
            <div className="p-0 m-0 flex-auto relative overflow-hidden">
              <div className="absolute top-0 sm:top-2 lg:top-2 left-0 right-0 md:right-2 lg:right-1 bottom-0 md:bottom-2 rounded-xl overflow-auto bg-white border dark:border-0 dark:bg-neutral-950">
                {children}
              </div>
            </div>
            {/* RIGHT SIDEBAR */}
            {showRightSidebar && (
              <RightSidebar
                onClose={() => {
                  // Each time the user presses X, increment closeCount
                  setShowRightSidebar(false);
                  setCloseCount((prev) => prev + 1);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </RightSidebarContext.Provider>
  );
}
