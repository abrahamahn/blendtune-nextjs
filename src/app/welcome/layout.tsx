import React from "react";
import Header from "@/components/layouts/app-header";

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="main-height overflow-hidden w-full">
        <Header />
        {children}
      </div>
    </section>
  );
}
