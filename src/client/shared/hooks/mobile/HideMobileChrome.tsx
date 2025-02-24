// src\client\shared\hooks\mobile\HideMobileChrome.tsx
"use client";
import { useEffect } from "react";

/**
 * Mobile browser chrome hiding utility
 * Attempts to hide mobile browser's address bar by scrolling
 */
export default function HideMobileChrome() {
  useEffect(() => {
    // Minimal delay to ensure page is loaded before scrolling
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 100);
  }, []);

  return null;
}