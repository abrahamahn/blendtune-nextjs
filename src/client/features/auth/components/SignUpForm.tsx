// src\client\features\auth\components\SignUpForm.tsx
"use client";
import React, { useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Logo from "@components/common//Logo";
import LoadingIcon from "@components/common//LoadingIcon";

/**
 * Props interface for the SignUp component
 * @interface SignUpProps
 * @property {() => void} openSignIn - Function to switch to sign in form
 * @property {() => void} openConfirmEmail - Function to open email confirmation
 * @property {string} email - Email input value
 * @property {(email: string) => void} setEmail - Email setter function
 */
interface SignUpProps {
  openSignIn: () => void;
  openConfirmEmail: () => void;
  email: string;
  setEmail: (email: string) => void;
}

/**
 * SignUp component handles new user registration with form validation
 * Includes email/password registration and Google OAuth options
 * 
 * @component
 * @param {SignUpProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const SignUp: React.FC<SignUpProps> = ({
  openSignIn,
  openConfirmEmail,
  email,
  setEmail,
}) => {
  // Form state management
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);

  /**
   * Toggles password visibility state
   */
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  /**
   * Toggles terms and policy agreement state
   */
  const togglePolicyButton = () => {
    setAgreePolicy(!agreePolicy);
  };

  /**
   * Placeholder for Google OAuth signup
   */
  const handleSignUpWithGoogle = async () => {};

  /**
   * Validates and processes form submission for signup
   * Includes validation for username, name, email, and password
   * @param {React.FormEvent<HTMLFormElement>} e - Form event
   */
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset validation states
    setPasswordMatch(true);
    setErrorMessage("");

    // Validation patterns
    const patterns = {
      username: /^[a-z0-9_.]{3,}$/,
      name: /^[A-Z][a-z]*$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    };

    // Username validation
    if (!patterns.username.test(username)) {
      setErrorMessage(
        "Username must be at least 3 characters long and can only contain lowercase letters, numbers, underscore (_), and period (.)"
      );
      return;
    }

    // Name validation
    if (!patterns.name.test(firstName) || !patterns.name.test(lastName)) {
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

    // Email validation
    if (!patterns.email.test(email)) {
      setErrorMessage("Enter a valid email address (e.g., user@example.com).");
      return;
    }

    // Password validation
    if (!patterns.password.test(password)) {
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

    // Password uniqueness validation
    if (password === firstName || password === lastName || password === email) {
      setErrorMessage("Password cannot be your name or email.");
      return;
    }

    // Policy agreement validation
    if (!agreePolicy) {
      setErrorMessage("You must agree to the terms and policies to sign up.");
      return;
    }

    // Submit form if all validations pass
    await submitSignUpForm();
  };

  /**
   * Submits the validated form data to the API
   */
  const submitSignUpForm = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        openConfirmEmail();
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
          {/* Header and Logo */}
          <div className="flex items-center pt-4 lg:pt-6 justify-center">
            <Logo />
          </div>
          <div className="flex flex-col items-center mt-8">
            <h1 className="hidden lg:flex text-base font-semibold text-black dark:text-white">
              Create your free account
            </h1>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleSignUpWithGoogle}
            className="mt-4 flex items-center w-full bg-transparent border border-neutral-600 dark:border-gray-500 text-black dark:text-white p-3 rounded-md cursor-pointer mb-2"
          >
            <FcGoogle className="mr-3" />
            <p className="text-sm text-neutral-600 dark:text-gray-500">
              Continue with Google [Coming Soon]
            </p>
          </button>

          {/* Divider */}
          <div className="divider-container flex py-2 items-center justify-center w-full">
            <div className="border-t border-neutral-500 dark:border-gray-500 w-1/4 mb-2"></div>
            <span className="text-neutral-500 dark:text-gray-500 text-xs lg:text-sm mb-2 mx-2">
              or sign in using email
            </span>
            <div className="border-t border-neutral-500 dark:border-gray-500 w-1/4 mb-2"></div>
          </div>

          {/* Registration Form */}
          <form
            className="flex flex-col items-center w-full"
            onSubmit={handleSignUp}
          >
            <div className="flex flex-col">
              {/* Name Fields */}
              <div className="flex flex-row items-center w-full">
                <input
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  placeholder="First Name"
                  className="w-full bg-transparent text-neutral-600 dark:text-gray-500 text-sm border-neutral-600 dark:border-gray-500 p-3 rounded-md mr-3"
                />
                <input
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  placeholder="Last Name"
                  className="w-full bg-transparent text-neutral-600 dark:text-gray-500 text-sm border-neutral-600 dark:border-gray-500 p-3 rounded-md"
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-row items-center w-full">
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Email Address"
                  autoComplete="new-password"
                  className="mt-4 w-full bg-transparent text-neutral-600 dark:text-gray-400 text-sm border-neutral-600 dark:border-gray-500 p-3 rounded-md"
                />
              </div>

              {/* Username Field */}
              <div className="relative w-full">
                <input
                  type="username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  placeholder="User Name"
                  className="mt-4 w-full bg-transparent text-neutral-600 dark:text-gray-400 text-sm border border-neutral-600 dark:border-gray-500 p-3 rounded-md"
                />
              </div>

              {/* Password Fields */}
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

              {/* Confirm Password Field */}
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
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
            </div>

            {/* Error/Help Text */}
            {errorMessage ? (
              <p className="texts-left text-red-500 text-xs mt-2">
                {errorMessage}
              </p>
            ) : (
              <p className="text-left text-neutral-500 dark:text-gray-500 text-2xs mt-3">
                Must be 8+ characters, with 1+ number and special character.
              </p>
            )}

            {/* Policy Agreement Toggle */}
            <div className="flex items-center w-full mt-3">
              <div
                onClick={togglePolicyButton}
                className={`${
                  agreePolicy
                    ? "bg-blue-600"
                    : "bg-white border border-gray-400"
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
                <p className="text-neutral-500 dark:text-white text-xs">
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 h-10 w-full bg-blue-600 text-white text-sm p-2 rounded-md cursor-pointer hover:bg-blue-700"
            >
              {isLoading ? <LoadingIcon /> : "Create Account"}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="flex items-center justify-center w-full text-xs p-6">
            <p className="text-neutral-500 dark:text-gray-500">
              Already have an account?
            </p>
            <button
              onClick={openSignIn}
              className="h-10 text-blue-500 ml-1 cursor-pointer hover:opacity-80"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;