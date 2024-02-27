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
  setUserEmail,
  setUserFirstName,
  setUserLastName,
} from "@/redux/userSlices/user";
import { RootState } from "@/redux/store";

interface SessionProviderProps {
  children: ReactNode;
}

const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Selectors
  const userEmail = useSelector((state: RootState) => state.auth.user.email);
  const userFirstName = useSelector(
    (state: RootState) => state.auth.user.first_name
  );
  const userLastName = useSelector(
    (state: RootState) => state.auth.user.last_name
  );
  const status = useSelector((state: RootState) => state.auth.session.status);
  const authenticated = useSelector(
    (state: RootState) => state.auth.session.authenticated
  );

  const checkSession = useCallback(() => {
    fetch("/api/auth/security/check-session", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.authenticated) {
          dispatch(setAuthenticated());
          dispatch(setUserEmail(data.email));
          dispatch(setUserFirstName(data.firstName));
          dispatch(setUserLastName(data.lastName));
          dispatch(setOnline(true));
        } else {
          dispatch(setUnauthenticated());
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
      authenticated,
      status,
      userEmail,
      userFirstName,
      userLastName,
      checkSession,
    }),
    [
      authenticated,
      status,
      userEmail,
      userFirstName,
      userLastName,
      checkSession,
    ]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export default SessionProvider;
