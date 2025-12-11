// src/app/auth/security/new-password/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuthenticated, setUnauthenticated } from "@store/slices";
import Logo from "@components/common/Logo";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import LoadingIcon from "@/client/shared/components/icons/LoadingIcon";
import SearchParamsWrapper from "@search/services/SearchParamsWrapper";

/**
 * NewPassword component:
 * - Verifies the reset token.
 * - Allows the user to set a new password with validation.
 * - Updates authentication state and redirects upon successful password reset.
 */
const NewPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  // Verify the reset token once available.
  useEffect(() => {
    if (token) {
      fetch(`/api/auth/security/reset-password/verify?token=${token}`)
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          if (!data.success) {
            setErrorMessage("Confirmation link is invalid. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
          setIsLoading(false);
          setErrorMessage("Confirmation link is invalid. Please try again.");
        });
    }
  }, [token]);

  // Toggle visibility for password fields.
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Handle the new password form submission.
  const handleNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordMatch(true);

    // Validate password complexity.
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      setErrorMessage("Password must be 8+ characters, with 1+ number and special character.");
      return;
    }

    // Ensure the password fields match.
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Submit the new password to the API.
    const response = await fetch("/api/auth/security/reset-password/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token, newPassword: password }),
    });
    const data = await response.json();

    if (response.ok) {
      dispatch(setAuthenticated());
      router.push("/auth/security/reset-confirmed");
    } else {
      console.error(data.message);
      dispatch(setUnauthenticated());
    }
  };

  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900">
      <Suspense fallback={null}>
        <SearchParamsWrapper onParamsReady={setToken} />
      </Suspense>
      <div className="w-80 lg:w-96 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 py-8">
          {/* Logo */}
          <div className="flex items-center pt-4 lg:pt-6 justify-center">
            <Logo />
          </div>
          {/* Page title */}
          <div className="flex flex-col items-center mt-8">
            <h1 className="hidden lg:flex text-base font-semibold text-black dark:text-white">
              Create Your New Password
            </h1>
          </div>
          <form onSubmit={handleNewPassword}>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="mt-4 w-full bg-transparent text-neutral-600 dark:text-gray-400 text-sm border-neutral-600 dark:border-gray-500 p-3 rounded-md"
                autoComplete="new-password"
              />
              <div
                className="absolute top-10 right-2 transform -translate-y-1/2 cursor-pointer text-neutral-600 dark:text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </div>
            </div>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className={`mt-4 w-full bg-transparent text-neutral-600 dark:text-gray-500 text-sm border-neutral-600 dark:border-gray-500 p-3 rounded-md ${
                  !passwordMatch ? "border-red-500" : ""
                }`}
                autoComplete="new-password"
              />
              <div
                className="absolute top-10 right-2 transform -translate-y-1/2 cursor-pointer text-neutral-600 dark:text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </div>
            </div>
            {errorMessage ? (
              <p className="text-left text-red-500 text-xs mt-2">{errorMessage}</p>
            ) : (
              <p className="text-left text-neutral-500 dark:text-gray-500 text-2xs mt-3">
                Must be 8+ characters, with 1+ number and special character.
              </p>
            )}
            <div>
              <button
                type="submit"
                className="w-full mt-6 h-10 bg-blue-600 text-white text-sm p-2 rounded-md cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-700"
              >
                {isLoading ? <LoadingIcon /> : "Continue"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
