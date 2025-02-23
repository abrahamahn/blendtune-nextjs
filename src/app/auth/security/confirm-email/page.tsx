// src/app/auth/security/confirm-email/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuthenticated, setUnauthenticated } from "@store/slices";
import dynamic from "next/dynamic";

// Dynamically import SearchParamsWrapper to avoid SSR issues.
const SearchParamsWrapper = dynamic(
  () => import("@/client/features/sounds/search/services/SearchParamsWrapper"),
  { ssr: false }
);

/**
 * ConfirmEmail component:
 * - Retrieves the token via SearchParamsWrapper.
 * - Calls the API to confirm the user's email using the token.
 * - Updates the authentication state and redirects based on the confirmation result.
 */
const ConfirmEmail = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Trigger email confirmation once the token is available.
  useEffect(() => {
    if (token) {
      const apiUrl = `/api/auth/security/confirm-email?token=${token}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            dispatch(setAuthenticated());
            router.push("/welcome");
          } else {
            dispatch(setUnauthenticated());
            router.push("/auth/signin");
            alert("Invalid token or token has expired. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error confirming email:", error);
          alert("Something went wrong. Please try again.");
        })
        .finally(() => setLoading(false));
    }
  }, [token, dispatch, router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <Suspense fallback={<p className="text-center text-black dark:text-white">Loading...</p>}>
        <SearchParamsWrapper onParamsReady={setToken} />
      </Suspense>
      {loading ? (
        <p className="text-black dark:text-white">Confirming your email...</p>
      ) : (
        <p className="text-black dark:text-white">Redirecting...</p>
      )}
    </div>
  );
};

export default ConfirmEmail;
