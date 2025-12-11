// src\client\shared\hooks\mobile\SetViewportHeight.tsx
"use client";
import { useEffect } from "react";

/**
 * Dynamic viewport height hook for mobile responsiveness
 * Sets a CSS variable to handle mobile browser viewport height variations
 */
export default function SetViewportHeight() {
  useEffect(() => {
    // Calculate and set viewport height CSS variable
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Initial setup and resize event listener
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  return null;
}