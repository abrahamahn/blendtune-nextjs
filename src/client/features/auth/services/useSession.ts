// src\client\features\auth\services\useSession.ts

"use client";
import { createContext, useContext, useMemo } from "react";
import { useAppSelector } from "@store/hooks/useAppSelector";
import { RootState } from '@core/store';

/**
 * User profile fields interface
 * Contains all possible user profile data fields
 */
interface UserProfileFields {
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
}

/**
 * User preferences interface
 * Contains user preference and consent settings
 */
interface UserPreferences {
  userMarketingConsent: boolean;
  userProfileCreated: boolean;
}

/**
 * Session status interface
 * Contains authentication and status flags
 */
interface SessionStatus {
  userAuthenticated: boolean;
  userStatus: boolean;
}

/**
 * Session context value interface
 * Combines all session-related interfaces and adds optional checkSession method
 * @extends SessionStatus
 * @extends UserProfileFields
 * @extends UserPreferences
 */
export interface SessionContextValue extends 
  SessionStatus,
  UserProfileFields,
  UserPreferences {
  checkSession?: () => Promise<void>;
}

/**
 * Session context
 * Provides session information throughout the application
 */
export const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
);

/**
 * Custom hook for accessing session information
 * Combines Redux state and context to provide user session data
 * 
 * @returns {SessionContextValue} Combined session information from Redux and context
 */
export const useSession = () => {
  // Session status selectors
  const userAuthenticated = useAppSelector(
    (state: RootState) => state.auth.session.authenticated
  );
  const userStatus = useAppSelector(
    (state: RootState) => state.auth.session.status
  );

  // User profile selectors
  const username = useAppSelector((state: RootState) => state.auth.user.username);
  const userEmail = useAppSelector((state: RootState) => state.auth.user.email);
  const userFirstName = useAppSelector(
    (state: RootState) => state.auth.user.first_name
  );
  const userLastName = useAppSelector(
    (state: RootState) => state.auth.user.last_name
  );
  const userArtistCreatorName = useAppSelector(
    (state: RootState) => state.auth.user.artist_creator_name
  );
  const userPhoneNumber = useAppSelector(
    (state: RootState) => state.auth.user.phone_number
  );
  const userGender = useAppSelector((state: RootState) => state.auth.user.gender);
  const userDateOfBirth = useAppSelector(
    (state: RootState) => state.auth.user.date_of_birth
  );
  const userCity = useAppSelector((state: RootState) => state.auth.user.city);
  const userState = useAppSelector((state: RootState) => state.auth.user.state);
  const userCountry = useAppSelector(
    (state: RootState) => state.auth.user.country
  );
  const userType = useAppSelector((state: RootState) => state.auth.user.user_type);
  const userOccupation = useAppSelector(
    (state: RootState) => state.auth.user.occupation
  );
  const userPreferredLanguage = useAppSelector(
    (state: RootState) => state.auth.user.preferred_language
  );

  // User preferences selectors
  const userMarketingConsent = useAppSelector(
    (state: RootState) => state.auth.user.marketing_consent
  );
  const userProfileCreated = useAppSelector(
    (state: RootState) => state.auth.user.profile_created
  );

  // Get context
  const context = useContext(SessionContext);

  /**
   * Memoize the session value to prevent unnecessary re-renders
   * Returns context if available, otherwise returns Redux state
   */
  return useMemo(() => {
    if (context !== undefined) {
      return context;
    }

    // Combine all session information from Redux state
    return {
      // Session status
      userAuthenticated,
      userStatus,
      
      // User profile
      username,
      userEmail,
      userFirstName,
      userLastName,
      userArtistCreatorName,
      userPhoneNumber,
      userGender,
      userDateOfBirth,
      userCity,
      userState,
      userCountry,
      userType,
      userOccupation,
      userPreferredLanguage,
      
      // User preferences
      userMarketingConsent,
      userProfileCreated,
      
      // Optional method
      checkSession: undefined,
    };
  }, [
    context,
    userAuthenticated,
    userStatus,
    username,
    userEmail,
    userFirstName,
    userLastName,
    userArtistCreatorName,
    userPhoneNumber,
    userGender,
    userDateOfBirth,
    userCity,
    userState,
    userCountry,
    userType,
    userOccupation,
    userPreferredLanguage,
    userMarketingConsent,
    userProfileCreated,
  ]);
};

export default useSession;