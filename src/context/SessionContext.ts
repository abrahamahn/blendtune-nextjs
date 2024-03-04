'use client';
import React, { createContext, useContext } from "react";

interface SessionContextType {
  userAuthenticated: boolean;
  userStatus: boolean;
  username: string | null;
  userEmail: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  userArtistCreatorName: string | null;
  userPhoneNumber: string | null;
  userGender: string | null;
  userDateOfBirth: string | null;
  userCity: string | null;
  userState: string | null;
  userCountry: string | null;
  userType: string | null;
  userOccupation: string | null;
  userPreferredLanguage: string | null;
  userMarketingConsent: boolean;
  userProfileCreated: boolean;
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
