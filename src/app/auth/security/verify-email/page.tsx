// src/app/auth/security/verify-email/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@components/common/Logo";
import LoadingIcon from "@components/common/LoadingIcon";

/**
 * VerifyEmail component:
 * - Retrieves the user's email from local storage.
 * - Allows users to resend the verification email.
 * - Implements a cooldown timer for resending.
 */
const VerifyEmail: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [resendStatus, setResendStatus] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  // Load user email from local storage when component mounts.
  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    setUserEmail(email);
  }, []);

  // Handle cooldown timer logic.
  useEffect(() => {
    let interval: number | undefined;
    if (cooldown > 0) {
      interval = window.setInterval(() => {
        setCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    } else if (interval !== undefined) {
      clearInterval(interval);
    }
    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [cooldown]);

  // Handles resending the verification email.
  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/security/resend-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, cooldown: cooldown }),
      });

      const data = await response.json();

      if (data.success) {
        setResendStatus("success");
        setCooldown(60);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setResendStatus("failure");
      if (error instanceof Error && error.message.includes("429")) {
        setCooldown(60);
      } else {
        setCooldown(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCooldown(60);
  }, []);

  // Determine the message to display based on resend status.
  let message;
  if (resendStatus === "success") {
    message = `Confirmation email has been re-sent! Please check your inbox.`;
  } else if (resendStatus === "failure") {
    message = `Resend has failed. Please try after about a minute and check spam folder.`;
  } else {
    message = `Please confirm your email by going to your inbox and clicking the confirmation link.`;
  }

  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900">
      <div className="w-80 lg:w-96 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 py-8">
          {/* Logo */}
          <div className="flex items-center pt-4 lg:pt-6 justify-center">
            <Logo />
          </div>
          {/* Title */}
          <div className="flex flex-col items-center mt-8">
            <h1 className="hidden lg:flex text-base font-semibold text-black dark:text-white">
              Check Your Email
            </h1>
          </div>
          {/* Instruction message */}
          <div className="flex flex-col items-center w-full rounded">
            <p className="text-sm text-neutral-600 dark:text-gray-500 w-full text-center">
              {message}
            </p>
          </div>
          {/* Resend button with cooldown handling */}
          <button
            onClick={handleResendEmail}
            disabled={cooldown > 0 || isLoading}
            className={`h-10 w-full mt-6 ${
              cooldown > 0 ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
            } text-white text-sm p-2 rounded-md cursor-pointer`}
          >
            {isLoading ? <LoadingIcon /> : <>Resend Email {cooldown > 0 && `(${cooldown}s)`}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
