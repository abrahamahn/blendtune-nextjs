// SoundsLayout.tsx
"use client";
import React from "react";
import Header from "@/client/ui/global/header";
import Footer from "@/client/ui/global/footer";
import SideBar from "@/client/ui/global/sidebar";
import RightSidebar from "@/client/ui/layout/RightSidebar";

export default function SoundsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* HEADER */}
      <div className="h-14 shrink-0">
        <Header />
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-auto overflow-hidden">
        <div className="flex h-full">
          {/* LEFT SIDEBAR */}
          <div className="hidden md:block w-20 flex-none p-2 h-full overflow-auto">
            <SideBar />
          </div>
          {/* MAIN CONTENT AREA (GREEN BACKGROUND) */}
          {/* Note: 'relative' so we can absolutely-position our 'card' inside it */}
          <div className="flex-auto relative overflow-hidden">
            <div className="absolute top-2 left-2 right-2 bottom-2 rounded-xl shadow-lg overflow-auto p-0 md:mt-0 mt-12">
              {children}
            </div>
          </div>

          {/* RIGHT SIDEBAR (RESIZABLE) */}
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
