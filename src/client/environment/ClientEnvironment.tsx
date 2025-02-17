"use client";
import React, { createContext, useContext, ReactNode } from "react";
import StoreProvider from "./StoreProvider";
import SessionProvider from "@/client/environment/services/sessionService";
import TracksProvider from "@/client/environment/services/trackService";
import AudioService from "@/client/environment/services/audioService";
import ServiceWorker from "@/client/environment/services/ServiceWorker"; // adjust the path as needed

// Define the type for ClientEnvironment
type ClientEnvironment = {};

// Create an empty environment object
const environment: ClientEnvironment = {};

// Create the context with the environment type
const ClientEnvironmentContext = createContext<ClientEnvironment | undefined>(undefined);

// Provider component that wraps the application with the context and other providers
export const ClientEnvironmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ClientEnvironmentContext.Provider value={environment}>
    <StoreProvider>
      <SessionProvider>
        <TracksProvider>
          <AudioService>
            <ServiceWorker />
            {children}
          </AudioService>
        </TracksProvider>
      </SessionProvider>
    </StoreProvider>
  </ClientEnvironmentContext.Provider>
);

// Hook to consume the ClientEnvironment context
export const useClientEnvironment = () => {
  const context = useContext(ClientEnvironmentContext);
  if (!context)
    throw new Error("useClientEnvironment must be used within ClientEnvironmentProvider");
  return context;
};
