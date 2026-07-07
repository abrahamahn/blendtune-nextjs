// src\client\features\sounds\catalog\hooks\useResponsiveLayout.tsx
import { useState, useEffect } from "react";

export default function useResponsiveLayout() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);

  useEffect(() => {
    const updateLayout = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        if (window.innerWidth > 1536) {
          setItemsPerPage(6);
        } else if (window.innerWidth > 1280) {
          setItemsPerPage(5);
        } else {
          setItemsPerPage(4);
        }
      }
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  return { isMobile, itemsPerPage };
}
