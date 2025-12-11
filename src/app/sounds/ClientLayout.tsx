// src/app/sounds/ClientLayout.tsx
"use client";

import React from "react";
import Header from "@/client/features/layout/header";
import LeftBar from "@layout/leftbar";
import { RightSidebarProvider, useRightSidebar } from "@rightbar/context/useRightSidebar";
import RightBar from "@layout/rightbar";
import StoreProvider from "@providers/StoreProvider";

/**
 * RightSidebarWrapper Component:
 * - Renders the right sidebar only when it is open.
 */
const RightSidebarWrapper: React.FC = () => {
  const { isOpen } = useRightSidebar();
  return isOpen ? <RightBar /> : null;
};

/**
 * ClientLayout Component:
 * - Provides a structured layout with a header, left sidebar, right sidebar, and content area.
 * - Uses global state providers to manage sidebar visibility.
 */
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <RightSidebarProvider>
        <div className="flex flex-col h-full overflow-y-scroll">
          {/* HEADER */}
          <div className="h-14 shrink-0">
            <Header />
          </div>

          {/* MAIN CONTAINER */}
          <div className="flex-auto overflow-hidden">
            <div className="flex h-full">
              {/* LEFT SIDEBAR (Visible on md+ screen sizes) */}
              <div className="hidden md:block w-20 flex-none pl-2 p-2 h-full overflow-auto">
                <LeftBar />
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="p-0 m-0 flex-auto relative overflow-hidden">
                <div className="absolute top-0 sm:top-2 lg:top-2 left-0 right-0 md:right-2 lg:right-1 bottom-0 md:bottom-2 rounded-xl overflow-auto bg-white border dark:border-0 dark:bg-neutral-950">
                  {children}
                </div>
              </div>

              {/* RIGHT SIDEBAR (Renders conditionally) */}
              <RightSidebarWrapper />
            </div>
          </div>
        </div>
      </RightSidebarProvider>
    </StoreProvider>
  );
}
