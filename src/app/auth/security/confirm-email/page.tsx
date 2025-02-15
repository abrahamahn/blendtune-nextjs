"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  setAuthenticated,
  setUnauthenticated,
} from "@/client/environment/redux/slices/session";
import dynamic from "next/dynamic";

// ✅ Dynamically import SearchParamsWrapper to avoid SSR issues
const SearchParamsWrapper = dynamic(() => import("@/client/wrapper/SearchParamsWrapper"), {
  ssr: false, // Prevents SSR errors
});

const ConfirmEmail = () => {
  console.log("ConfirmEmail component rendered");

  const dispatch = useDispatch();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      console.log("Token:", token);
      const apiUrl = `/api/auth/security/confirm-email?token=${token}`;
      
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log("Confirmation response:", data);
          if (data.success) {
            dispatch(setAuthenticated());
            console.log("Redirecting to welcome page");
            router.push("/welcome");
          } else {
            dispatch(setUnauthenticated());
            router.push("/auth/signin");
            console.log("Invalid token or token has expired");
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
