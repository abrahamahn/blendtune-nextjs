"use client";
import React, { ReactNode, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import SessionContext from "@/context/SessionContext";
import {
  setAuthenticated,
  setUnauthenticated,
  setOnline,
} from "@/redux/userSlices/session";
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
  setNoUser,
} from "@/redux/userSlices/user";
import { RootState } from "@/redux/store";

interface SessionProviderProps {
  children: ReactNode;
}

const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const userAuthenticated = useSelector(
    (state: RootState) => state.auth.session.authenticated
  );
  const userStatus = useSelector(
    (state: RootState) => state.auth.session.status
  );
  const username = useSelector((state: RootState) => state.auth.user.username);
  const userEmail = useSelector((state: RootState) => state.auth.user.email);
  const userFirstName = useSelector(
    (state: RootState) => state.auth.user.first_name
  );
  const userLastName = useSelector(
    (state: RootState) => state.auth.user.last_name
  );
  const userArtistCreatorName = useSelector(
    (state: RootState) => state.auth.user.artist_creator_name
  );
  const userPhoneNumber = useSelector(
    (state: RootState) => state.auth.user.phone_number
  );
  const userGender = useSelector((state: RootState) => state.auth.user.gender);
  const userDateOfBirth = useSelector(
    (state: RootState) => state.auth.user.date_of_birth
  );
  const userCity = useSelector((state: RootState) => state.auth.user.city);
  const userState = useSelector((state: RootState) => state.auth.user.state);
  const userCountry = useSelector(
    (state: RootState) => state.auth.user.country
  );
  const userType = useSelector((state: RootState) => state.auth.user.user_type);
  const userOccupation = useSelector(
    (state: RootState) => state.auth.user.occupation
  );
  const userPreferredLanguage = useSelector(
    (state: RootState) => state.auth.user.preferred_language
  );
  const userMarketingConsent = useSelector(
    (state: RootState) => state.auth.user.marketing_consent
  );
  const userProfileCreated = useSelector(
    (state: RootState) => state.auth.user.profile_created
  );

  const checkSession = useCallback(() => {
    fetch("/api/auth/security/check-session", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.authenticated) {
          dispatch(setAuthenticated());
          dispatch(setUsername(data.username));
          dispatch(setUserEmail(data.email));
          dispatch(setUserFirstName(data.firstName));
          dispatch(setUserLastName(data.lastName));
          dispatch(setArtistCreatorName(data.artistCreatorName));
          dispatch(setPhoneNumber(data.phoneNumber));
          dispatch(setGender(data.gender));
          dispatch(setDateOfBirth(data.dateOfBirth));
          dispatch(setCity(data.city));
          dispatch(setState(data.state));
          dispatch(setCountry(data.country));
          dispatch(setUserType(data.userType));
          dispatch(setOccupation(data.occupation));
          dispatch(setPreferredLanguage(data.preferredLanguage));
          dispatch(setMarketingConsent(data.marketingConsent));
          dispatch(setProfileCreated(data.profileCreated));
          dispatch(setOnline(true));
        } else {
          dispatch(setUnauthenticated());
          dispatch(setNoUser());
        }
      })
      .catch(() => {
        dispatch(setUnauthenticated());
      });
  }, [dispatch]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const value = useMemo(
    () => ({
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
      checkSession,
    }),
    [
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
      checkSession,
    ]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export default SessionProvider;
