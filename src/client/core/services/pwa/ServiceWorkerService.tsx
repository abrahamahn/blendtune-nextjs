// src/client/core/services/pwa/ServiceWorkerService.tsx
"use client";

import { useEffect } from "react";
import { useClientEnvironment } from "@core/context/ClientEnvironment";

/**
 * ServiceWorkerProvider:
 * - Registers a Service Worker (`/sw.js`) for PWA capabilities.
 * - Runs only in production (skips in debug mode).
 */
const ServiceWorkerProvider = () => {
  const { debug } = useClientEnvironment();

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure it runs on the client

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        if (debug) {
          return;
        }

        navigator.serviceWorker
          .register("/sw.js")
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }
  }, [debug]);

  return null;
};

export default ServiceWorkerProvider;
