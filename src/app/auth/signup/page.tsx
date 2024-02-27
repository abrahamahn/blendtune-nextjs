"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Logo from "@/components/shared/common/Logo";

const SignUp: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const [agreePolicy, setAgreePolicy] = useState(false);

  const togglePolicyButton = () => {
    setAgreePolicy(!agreePolicy);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset states
    setPasswordMatch(true);
    setErrorMessage("");

    // Name validation
    const namePattern = /^[A-Z][a-z]*$/;
    if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
      setErrorMessage(
        "Name must start with a capital letter and following lowercase letters."
      );
      return;
    }

    // Empty name check
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("First and last name are required.");
      return;
    }

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Enter a valid email address (e.g., user@example.com).");
      return;
    }

    // Password complexity validation
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      setErrorMessage(
        "Password must be 8+ characters, with 1+ number and special character."
      );
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Password similarity check
    if (password === firstName || password === lastName || password === email) {
      setErrorMessage("Password cannot be your name or email.");
      return;
    }

    if (!agreePolicy) {
      setErrorMessage("You must agree to the terms and policies to sign up.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
      } else {
        setErrorMessage(data.message || "An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900">
      <div className="w-80 lg:w-96 rounded-lg bg-gray-500 dark:bg-gray-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 lg:py-4">
          <div className="flex items-center pt-4 lg:pt-6 justify-center">
            <Logo />
          </div>
          <div className="flex flex-col items-center mt-8">
            <h1 className="hidden lg:flex text-base font-semibold text-black dark:text-white">
              Create your free account
            </h1>
          </div>
          <button className="mt-4 flex items-center w-full bg-transparent border border-gray-500 text-black dark:text-white p-3 rounded-md cursor-pointer mb-2">
            <FcGoogle className="mr-3" />
            <p className="text-sm">Continue with Google</p>
          </button>
          <div className="divider-container flex py-2 items-center justify-center w-full">
            <div className="border-t border-gray-500 w-1/4 mb-2"></div>
            <span className="text-gray-500 text-xs lg:text-sm mb-2 mx-2">
              or sign in using email
            </span>
            <div className="border-t border-gray-500 w-1/4 mb-2"></div>
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col">
              <div className="flex flex-row items-center w-full">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full bg-transparent text-gray-400 text-sm border-gray-500 p-3 rounded-md  mr-3"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full bg-transparent text-gray-400 text-sm border-gray-500 p-3 rounded-md "
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="mt-4 w-full bg-transparent text-gray-400 text-sm border-gray-500 p-3 rounded-md "
              />
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="mt-4 w-full bg-transparent text-gray-400 text-sm border-gray-500 p-3 rounded-md "
                />
                <div
                  className="absolute top-10 right-2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </div>
              </div>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="mt-4 w-full bg-transparent text-gray-400 text-sm border-gray-500 p-3 rounded-md "
                />
                <div
                  className="absolute top-10 right-2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-2xs mt-3">
            Must be 8+ characters, with 1+ number and special character.
          </p>
          <div className="flex items-center w-full mt-3">
            <div
              onClick={togglePolicyButton}
              className={`${
                agreePolicy ? "bg-blue-600" : "bg-white border border-gray-400"
              } w-10 h-4 rounded-full p-1 flex items-center cursor-pointer mr-2 transition-colors duration-300`}
            >
              <div
                className={`${
                  agreePolicy ? "bg-white" : "bg-gray-500"
                } w-4 h-2.5 rounded-full transition-all duration-300 transform ${
                  agreePolicy ? "translate-x-4" : "translate-x-0"
                }`}
              ></div>
            </div>
            <div>
              <p className="text-neutral-600 dark:text-white text-xs">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-blue-500 hover:text-blue-800"
                >
                  Terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-blue-500 hover:text-blue-800"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white text-sm p-2 rounded-md cursor-pointer hover:bg-blue-700">
            Create Account
          </button>
          <div className="flex items-center justify-center w-full text-xs p-6">
            <p className="text-gray-500">Already have an account?</p>
            <Link
              href="/auth/signin"
              className="text-blue-500 ml-1 cursor-pointer hover:opacity-80"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
