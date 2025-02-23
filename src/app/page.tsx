// src\app\page.tsx
import React from "react";
import { Hero } from "@features/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blendtune",
  description: "Music for Artists and Creators",
};

// Home page component, displaying the main UI for users
const Home: React.FC = () => {
  return (
    <div className="main-height flex flex-col h-screen overflow-hidden rounded-xl">
      <Hero />
    </div>
  );
};

export default Home;