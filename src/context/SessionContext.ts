'use client';
import React, { createContext, useContext } from "react";

interface SessionContextType {
  authenticated: boolean;
  status: boolean;
  userEmail: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  checkSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export default SessionContext;

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
