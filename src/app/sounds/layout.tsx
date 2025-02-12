import React from "react";
import Header from "@/client/ui/global/header";
import Footer from "@/client/ui/global/footer";
import RightBar from "@/client/ui/global/rightbar";
import SideBar from "@/client/ui/global/sidebar";

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
