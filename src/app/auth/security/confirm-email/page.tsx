"use client";
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  setAuthenticated,
  setUnauthenticated,
} from "@/redux/userSlices/session";

const ConfirmEmail = () => {
  console.log("ConfirmEmail component rendered");

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    console.log("Token:", token);

    if (token) {
      const actionType = searchParams.get("action");

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
            alert(
              "Invalid token or token has expired. Please try again with the same email and password on the signup or login page."
            );
          }
        })
        .catch((error) => {
          console.error("Error confirming email:", error);
          alert(
            "Invalid token or token has expired. Please try again with the same email and password on the signup or login page."
          );
        });
    }
  }, [searchParams, dispatch, router, token]);

  return (
    <div className="h-screen w-full flex">
      <p className="w-full flex justify-center items-center dark:text-white text-black">
        Confirming your email...
      </p>
    </div>
  );
};

export default ConfirmEmail;
