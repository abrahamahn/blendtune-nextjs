// src/app/auth/signin/page.tsx
"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setAuthenticated, setUnauthenticated } from "@store/slices";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Logo from "@components/common/Logo";
import LoadingIcon from "@/client/shared/components/icons/LoadingIcon";

/**
 * SignIn component:
 * - Allows users to sign in using email and password.
 * - Supports Google OAuth authentication.
 * - Redirects to a verification page if sign-up confirmation is required.
 */
const SignIn: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openConfirmSignUp = () => {
    router.push("/auth/security/confirm-email");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const signInWithGoogle = async () => {
    // Implement Google OAuth login here.
  };

  // Handles the sign-in process.
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        dispatch(setAuthenticated());
        router.push("/sounds");
      } else {
        const data = await response.json();
        alert(data.message);

        if (data.message === "ConfirmSignUp required") {
          openConfirmSignUp();
        }
      }
    } catch (error) {
      dispatch(setUnauthenticated());
      console.error("Error during login:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900">
      <div className="w-80 lg:w-96 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 lg:py-4">
          {/* Logo */}
          <div className="flex items-center pt-4 lg:pt-6 justify-center">
            <Logo />
          </div>
          {/* Title */}
          <div className="flex flex-col items-center mt-8">
            <h1 className="hidden lg:flex text-base font-semibold text-black dark:text-white">
              Log into Your Account
            </h1>
          </div>
          {/* Google Sign-In Button */}
          <button
            className="mt-4 flex items-center w-full bg-transparent border border-neutral-600 dark:border-gray-500 text-black dark:text-white p-3 rounded-md cursor-pointer mb-2 hover:border-blue-500"
            onClick={signInWithGoogle}
          >
            <FcGoogle className="mr-3" />
            <p className="text-neutral-600 dark:text-gray-500 text-sm">Continue with Google</p>
          </button>
          {/* Sign-In Form */}
          <form onSubmit={handleSignIn} className="w-full">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-neutral-600 dark:border-gray-500 p-3 rounded-md"
            />
            {/* Password Input */}
            <div className="relative w-full mt-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-neutral-600 dark:border-gray-500 p-3 rounded-md"
              />
              <div className="absolute right-3 top-3 cursor-pointer" onClick={togglePasswordVisibility}>
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </div>
            </div>
            <button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md">
              {isLoading ? <LoadingIcon /> : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
