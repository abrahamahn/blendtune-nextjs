// src\client\features\auth\services\sessionService.tsx

"use client";

/**
 * Authentication session provider that maintains user state and session validation.
 * Handles automatic session checks and provides centralized auth management.
 */

import React, { ReactNode, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  setAuthenticated,
  setUnauthenticated,
  setOnline,
} from "@auth/store/sessionSlice";
import {
  setUsername,
  setUserEmail,
  setUserFirstName,
  setUserLastName,
  setArtistCreatorName,
  setPhoneNumber,
  setGender,
  setDateOfBirth,
  setCity,
  setState,
  setCountry,
  setUserType,
  setOccupation,
  setPreferredLanguage,
  setMarketingConsent,
  setProfileCreated,
  clearUserProfile,
  setUserProfile,
} from "@auth/store/userSlice";

interface SessionProviderProps {
  children: ReactNode;
}

const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  /**
   * Validates session to maintain security and user state consistency.
   * Automatically logs out user on session expiration or invalid tokens.
   */
  const checkSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/security/check-session", {
        credentials: "include",
      });

      if (response.status === 401) {
        dispatch(setUnauthenticated());
        dispatch(clearUserProfile());
        return;
      }

      if (!response.ok) {
        throw new Error("Error checking session");
      }

      const data = await response.json();

      if (data.authenticated) {
        dispatch(setAuthenticated());
        dispatch(setOnline(true));
        
        // Single dispatch for performance optimization
        dispatch(setUserProfile({
          username: data.username,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          artist_creator_name: data.artistCreatorName,
          phone_number: data.phoneNumber,
          gender: data.gender,
          date_of_birth: data.dateOfBirth,
          city: data.city,
          state: data.state,
          country: data.country,
          user_type: data.userType,
          occupation: data.occupation,
          preferred_language: data.preferredLanguage,
          marketing_consent: data.marketingConsent,
          profile_created: data.profileCreated,
        }));
      } else {
        dispatch(setUnauthenticated());
        dispatch(clearUserProfile());
      }
    } catch (error) {
      // Reset auth state on any errors to prevent inconsistent states
      dispatch(setUnauthenticated());
      dispatch(clearUserProfile());
    }
  }, [dispatch]);

  // Initial session validation on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return <>{children}</>;
};

export default SessionProvider;