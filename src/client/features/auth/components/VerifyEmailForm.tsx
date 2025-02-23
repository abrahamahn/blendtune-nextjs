// src\client\features\auth\components\VerifyEmailForm.tsx
"use client";
import React, { useState, useEffect } from "react";
import Logo from "@components/common//Logo";
import LoadingIcon from "@components/common//LoadingIcon";

/**
 * Props interface for the VerifyEmail component
 * @interface VerifyEmailProps
 * @property {string} userEmail - Email address of the user to verify
 * @property {'signup' | 'resetPassword'} mode - Current verification mode (signup or password reset)
 * @property {string} apiEndpoint - API endpoint for email verification and resend
 * @property {string} initialMessage - Initial message to display to the user
 */
interface VerifyEmailProps {
  userEmail: string;
  mode: "signup" | "resetPassword";
  apiEndpoint: string;
  initialMessage: string;
}

/**
 * Status messages for different verification states
 */
const STATUS_MESSAGES = {
  success: `Confirmation email has been re-sent! Please check your inbox.`,
  failure: `Resend has failed. Please try after about a minute and check spam folder.`,
  default: `Please confirm your email by going to your inbox and click confirmation link.`
};

/**
 * VerifyEmail component handles email verification process
 * Provides UI for email verification status and resend functionality with cooldown timer
 * 
 * @component
 * @param {VerifyEmailProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const VerifyEmail: React.FC<VerifyEmailProps> = ({
  userEmail,
  mode,
  apiEndpoint,
  initialMessage,
}) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [resendStatus, setResendStatus] = useState("");

  /**
   * Manages the cooldown timer for email resend functionality
   * Sets up an interval to decrement the cooldown counter every second
   */
  useEffect(() => {
    let interval: number | undefined;
    
    if (cooldown > 0) {
      interval = window.setInterval(() => {
        setCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    } else if (interval !== undefined) {
      clearInterval(interval);
    }

    // Cleanup interval on component unmount or when cooldown reaches 0
    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [cooldown]);

  /**
   * Initializes cooldown timer on component mount
   */
  useEffect(() => {
    setCooldown(60);
  }, []);

  /**
   * Handles resending verification email
   * Manages API call, response handling, and error states
   */
  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: userEmail, 
          cooldown: cooldown 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResendStatus("success");
        setCooldown(60); // Reset cooldown timer on successful resend
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setResendStatus("failure");
      // Handle rate limiting errors (HTTP 429)
      if (error instanceof Error && error.message.includes("429")) {
        setCooldown(60); // Reset cooldown on rate limit
      } else {
        setCooldown(0); // Clear cooldown for other errors
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Determine current display message based on status
  const message = resendStatus 
    ? STATUS_MESSAGES[resendStatus as keyof typeof STATUS_MESSAGES] 
    : initialMessage || STATUS_MESSAGES.default;

  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900">
      <div className="w-80 lg:w-96 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 py-8">
          {/* Header and Logo */}
          <div className="flex items-center pt-4 lg:pt-6 justify-center">
            <Logo />
          </div>
          <div className="flex flex-col items-center mt-8">
            <h1 className="hidden lg:flex text-base font-semibold text-black dark:text-white">
              Check Your Email
            </h1>
          </div>

          {/* Status Message */}
          <div className="flex flex-col items-center w-full rounded">
            <p className="text-sm text-neutral-600 dark:text-gray-500 w-full text-center">
              {message}
            </p>
          </div>

          {/* Resend Button */}
          <button
            onClick={handleResendEmail}
            disabled={cooldown > 0 || isLoading}
            className={`h-10 w-full mt-6 ${
              cooldown > 0 ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
            } text-white text-sm p-2 rounded-md cursor-pointer`}
          >
            {isLoading ? (
              <LoadingIcon />
            ) : (
              <>Resend Email {cooldown > 0 && `(${cooldown}s)`}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;