import React from "react";
import { Hero } from "@/components/pages/home";
import type { Metadata } from "next";
import Footer from "@/components/layouts/footer";

export const metadata: Metadata = {
  title: "Blendtune",
  description: "Music for Artists and Creators",
};

const Home: React.FC = () => {
  return (
    <div className="main-height flex flex-col h-screen overflow-hidden rounded-xl">
      <Hero />
    </div>
  );
};

export default Home;
