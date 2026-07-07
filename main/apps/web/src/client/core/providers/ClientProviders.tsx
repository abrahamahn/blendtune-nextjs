// src/client/core/providers/ClientProviders.tsx
"use client";

import React, { ReactNode } from "react";
import StoreProvider from "./StoreProvider";
import SessionProvider from "@features/auth/services/sessionService";
import TracksProvider from "@client/features/tracks/services/TracksContext";
import { PlayerProvider } from "@features/player/services/playerService";
import ServiceWorkerProvider from "@core/services/pwa/ServiceWorkerService";
import { ClientEnvironmentProvider } from "@core/context/ClientEnvironment";
import { FilterProvider } from "@features/sounds/filters/context";
import { NowPlayingProvider } from "@features/layout/rightbar";

interface ClientProvidersProps {
  children: ReactNode;
}

/**
 * ClientProviders Component:
 * - Wraps the app with global providers in the correct order.
 * - Ensures state management, authentication, and services are accessible.
 * - Provides context for filters, tracks, audio playback, and more.
 */
const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => (
  <StoreProvider>
    <ClientEnvironmentProvider>
      <SessionProvider>
        <TracksProvider>
          <FilterProvider>
            <PlayerProvider>
              <NowPlayingProvider>
                <ServiceWorkerProvider />
                {children}
              </NowPlayingProvider>
            </PlayerProvider>
          </FilterProvider>
        </TracksProvider>
      </SessionProvider>
    </ClientEnvironmentProvider>
  </StoreProvider>
);

export default ClientProviders;