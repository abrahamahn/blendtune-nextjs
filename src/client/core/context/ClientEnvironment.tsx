// src/client/core/context/ClientEnvironment.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";

/**
 * Type definition for client environment variables.
 * These values can be accessed throughout the app.
 */
export interface ClientEnvironmentType {
  version: string; // Application version
  buildId: string; // Build identifier (useful for debugging)
  debug: boolean;  // Flag for development/debug mode
}

// Default values for the client environment
const defaultEnvironment: ClientEnvironmentType = {
  version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  buildId: process.env.NEXT_PUBLIC_BUILD_ID || "development",
  debug: process.env.NODE_ENV === "development",
};

// Create a React context for environment variables
const ClientEnvironmentContext = createContext<ClientEnvironmentType>(defaultEnvironment);

interface ClientEnvironmentProviderProps {
  children: ReactNode;
  initialEnvironment?: Partial<ClientEnvironmentType>;
}

/**
 * ClientEnvironmentProvider:
 * - Provides environment values to child components.
 * - Merges defaults with any provided values.
 */
export const ClientEnvironmentProvider: React.FC<ClientEnvironmentProviderProps> = ({
  children,
  initialEnvironment = {},
}) => {
  const environment = { ...defaultEnvironment, ...initialEnvironment };

  return (
    <ClientEnvironmentContext.Provider value={environment}>
      {children}
    </ClientEnvironmentContext.Provider>
  );
};

/**
 * useClientEnvironment Hook:
 * - Access environment variables anywhere in the app.
 * - Returns default values if used outside the provider.
 */
export const useClientEnvironment = () => {
  const context = useContext(ClientEnvironmentContext);
  if (!context) {
    console.warn("useClientEnvironment used outside of provider, using default values");
    return defaultEnvironment;
  }
  return context;
};
