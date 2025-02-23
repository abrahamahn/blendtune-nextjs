// src/client/core/providers/ClientProviders.tsx
"use client";

import React, { ReactNode } from "react";
import StoreProvider from "./StoreProvider";
import SessionProvider from "@auth/services/sessionService";
import TracksProvider from "@tracks/services/trackService";
import AudioProvider from "@player/services/audioService";
import ServiceWorkerProvider from "@core/services/pwa/ServiceWorkerService";
import { ClientEnvironmentProvider } from "@core/context/ClientEnvironment";

interface ClientProvidersProps {
  children: ReactNode;
}

/**
 * ClientProviders Component:
 * - Wraps the app with global providers in the correct order.
 * - Ensures state management, authentication, and services are accessible.
 */
const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => (
  <StoreProvider>
    <ClientEnvironmentProvider>
      <SessionProvider>
        <TracksProvider>
          <AudioProvider>
            <ServiceWorkerProvider />
            {children}
          </AudioProvider>
        </TracksProvider>
      </SessionProvider>
    </ClientEnvironmentProvider>
  </StoreProvider>
);

export default ClientProviders;
