// src\app\terms\ClientLayout.tsx
"use client";
import React from "react";
import Header from "@/client/features/layout/header";

import LeftBar from "@layout/leftbar";
import { RightSidebarProvider, useRightSidebar } from "@rightbar/context/useRightSidebar";
import RightBar from "@layout/rightbar";
import StoreProvider from "@providers/StoreProvider";

// Wrapper component to conditionally render the right sidebar
const RightSidebarWrapper: React.FC = () => {
  const { isOpen } = useRightSidebar();
  return isOpen ? <RightBar /> : null;
};

// Main client layout for the terms page
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <RightSidebarProvider>
        <div className="flex flex-col h-full overflow-y-scroll">
          {/* Header Section */}
          <div className="h-14 shrink-0">
            <Header />
          </div>
          {/* Main Content Section */}
          <div className="flex-auto overflow-hidden">
            <div className="flex h-full">
              {/* Left Sidebar (Visible on Medium and Larger Screens) */}
              <div className="hidden md:block w-20 flex-none pl-2 p-2 h-full overflow-auto">
                <LeftBar />
              </div>
              {/* Main Content Area */}
              <div className="p-0 m-0 flex-auto relative overflow-hidden">
                <div className="absolute top-0 sm:top-2 lg:top-2 left-0 right-0 md:right-2 lg:right-1 bottom-0 md:bottom-2 rounded-xl overflow-auto bg-white border dark:border-0 dark:bg-neutral-950">
                  {children}
                </div>
              </div>
              {/* Right Sidebar (Rendered Conditionally) */}
              <RightSidebarWrapper />
            </div>
          </div>
        </div>
      </RightSidebarProvider>
    </StoreProvider>
  );
}