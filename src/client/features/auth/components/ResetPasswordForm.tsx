// src/client/features/auth/components/ResetPasswordForm.tsx

import React, { useState } from "react";
import Logo from "@components/common/Logo";
import LoadingIcon from "@components/common/LoadingIcon";

interface ResetPasswordProps {
  openSignIn: () => void;
  openVerifyEmail: () => void;
}

/**
 * ResetPassword Component
 * - Allows users to reset their password by entering their registered email.
 * - Sends a request to the backend to initiate a password reset.
 * - Handles error messages and displays loading states.
 */
const ResetPassword: React.FC<ResetPasswordProps> = ({
  openSignIn,
  openVerifyEmail,
}) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles password reset request
   * - Sends email to backend API
   * - Redirects to verify email screen on success
   * - Displays error message on failure
   */
  const handleResetPassword = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/security/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        openVerifyEmail();
      } else {
        setErrorMessage(data.message || "An unexpected error occurred");
      }
    } catch (error) {
      setErrorMessage("Failed to reset password. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900 flex justify-center items-center">
      <div className="w-80 lg:w-96 rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 lg:px-8 py-8 shadow-md">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <div className="flex flex-col items-center mt-6">
          <h1 className="text-lg font-semibold text-black dark:text-white">
            Forgot Your Password?
          </h1>
          <p className="text-sm text-neutral-600 dark:text-gray-400 mt-2 text-center">
            Enter your registered email. A confirmation link will be sent to reset your password.
          </p>
        </div>
        <div className="w-full mt-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-neutral-600 dark:text-gray-300 text-sm border border-neutral-400 dark:border-gray-500 p-3 rounded-md focus:border-blue-500 outline-none"
          />
        </div>
        {errorMessage && (
          <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
        )}
        <button
          onClick={handleResetPassword}
          className="w-full mt-6 h-10 bg-blue-600 text-white text-sm p-2 rounded-md transition-all hover:bg-blue-500 dark:hover:bg-blue-700 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? <LoadingIcon /> : "Continue"}
        </button>
        <div className="text-center mt-4">
          <a
            onClick={openSignIn}
            className="text-blue-500 text-sm cursor-pointer hover:underline"
          >
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
