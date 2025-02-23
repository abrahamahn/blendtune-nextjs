// src\client\shared\hooks\mobile\HideMobileChrome.tsx
"use client";
import { useEffect } from "react";

export default function HideMobileChrome() {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 100);
  }, []);

  return null;
}
