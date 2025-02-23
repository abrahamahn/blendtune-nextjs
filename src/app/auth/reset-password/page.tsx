// src\app\auth\reset-password\page.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@components/common/Logo";
import LoadingIcon from "@components/common/LoadingIcon";

/**
 * ResetPassword component allows users to initiate a password reset.
 * - Collects the user's email and sends a reset request.
 * - Redirects to a verification page upon success.
 */
const ResetPassword: React.FC = () => {
  const router = useRouter();

  // State for user email, error messages, and loading indicator.
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Sends a password reset request to the server.
   * On success, navigates the user to the verify email page.
   * On error, displays the returned error message.
   */
  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/security/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        router.push("/auth/security/verify-email");
      } else {
        setErrorMessage(data.message || "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900">
      <div className="w-80 lg:w-96 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 lg:px-8 py-8">
          {/* Logo */}
          <div className="flex items-center pt-4 lg:pt-6 justify-center">
            <Logo />
          </div>
          {/* Title */}
          <div className="flex flex-col items-center mt-8">
            <h1 className="flex text-base font-semibold text-black dark:text-white">
              Forgot Your Password?
            </h1>
          </div>
          {/* Email input */}
          <div className="w-full mt-4 lg:mt-0">
            <input
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="lg:mt-4 w-full bg-transparent text-neutral-600 dark:text-gray-500 text-sm border-neutral-600 dark:border-gray-500 p-3 rounded-md hover:border-blue-500"
            />
          </div>
          {/* Error or instructional message */}
          {errorMessage ? (
            <p className="text-left text-red-500 text-xs mt-2">{errorMessage}</p>
          ) : (
            <p className="text-left text-neutral-500 dark:text-gray-500 text-2xs mt-3">
              Please enter an email address you have registered. We will send you a confirmation email for verification.
            </p>
          )}
          {/* Reset button */}
          <div>
            <button
              onClick={handleResetPassword}
              className="w-full mt-6 h-10 bg-blue-600 text-white text-sm p-2 rounded-md cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-700"
            >
              {isLoading ? <LoadingIcon /> : "Continue"}
            </button>
          </div>
          {/* Link back to sign in */}
          <div className="text-blue-500 text-sm mt-4">
            <Link href="/auth/signin" className="cursor-pointer hover:opacity-80 text-xs">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
