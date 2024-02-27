"use client";
import React, { useRef } from "react";
import Header from "@/components/layouts/app-header";
import Footer from "@/components/layouts/footer";
import RightBar from "@/components/layouts/rightbar";
import SideBar from "@/components/layouts/sidebar/";

export default function SoundsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <SideBar />
      <div className="main-width fixed ml-0 md:ml-20">
        <div className="app-width">
          <Header />
          <div className="flex justify-center items-center app-height md:rounded-xl">
            {children}
          </div>
          <Footer />
        </div>
        <div className="hidden lg:block rightbar-width">
          <RightBar />
        </div>
      </div>
    </section>
  );
}
