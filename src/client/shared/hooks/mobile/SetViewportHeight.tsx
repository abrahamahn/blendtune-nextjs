// src\client\shared\hooks\mobile\SetViewportHeight.tsx
"use client";
import { useEffect } from "react";

export default function SetViewportHeight() {
  useEffect(() => {
    const setVh = () => {
      // Calculate 1% of the viewport height
      const vh = window.innerHeight * 0.01;
      // Set the value in a CSS variable
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  return null;
}