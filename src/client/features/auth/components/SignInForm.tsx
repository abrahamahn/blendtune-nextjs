// src\client\features\auth\components\SignInForm.tsx
import React, { useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Logo from "@components/common//Logo";
import LoadingIcon from "@/client/shared/components/icons/LoadingIcon";
import useAuth from "@auth/hooks/useAuth";

/**
 * Props interface for the SignIn component
 * @interface SignInProps
 * @property {() => void} openSignUp - Function to switch to signup form
 * @property {() => void} openResetPassword - Function to open reset password form
 * @property {() => void} openConfirmEmail - Function to open email confirmation
 * @property {() => void} closeAuthModal - Function to close the auth modal
 */
interface SignInProps {
  openSignUp: () => void;
  openResetPassword: () => void;
  openConfirmEmail: () => void;
  closeAuthModal: () => void;
}

/**
 * SignIn component provides user authentication functionality
 * Includes email/password login and Google OAuth options
 * 
 * @component
 * @param {SignInProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const SignIn: React.FC<SignInProps> = ({
  openSignUp,
  openResetPassword,
  openConfirmEmail,
  closeAuthModal,
}) => {
  // Authentication hook for login functionality
  const { login, isLoading } = useAuth();

  // Form state management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Toggles password visibility state
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Handles form submission for login
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
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
              Log into Your Account
            </h1>
          </div>

          {/* Google OAuth Button */}
          <button className="mt-4 flex items-center w-full bg-transparent border border-neutral-600 dark:border-gray-500 text-black dark:text-white p-3 rounded-md cursor-pointer mb-2 hover:border-blue-500">
            <FcGoogle className="mr-3" />
            <p className="text-neutral-600 dark:text-gray-500 text-sm">
              Continue with Google [Coming Soon]
            </p>
          </button>

          {/* Divider */}
          <div className="divider-container flex py-2 items-center justify-center w-full">
            <div className="border-t border-neutral-600 dark:border-gray-500 w-1/4 mb-2"></div>
            <span className="text-neutral-500 dark:text-gray-500 text-xs lg:text-sm mb-2 mx-2">
              or sign in using email
            </span>
            <div className="border-t border-neutral-600 dark:border-gray-500 w-1/4 mb-2"></div>
          </div>

          {/* Login Form */}
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center w-full mb-3 rounded">
              {/* Email Input */}
              <input
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email Address"
                className="w-full bg-transparent text-neutral-600 dark:text-gray-500 text-sm border-neutral-600 dark:border-gray-500 p-3 rounded-md"
                required
              />
              {/* Password Input with Toggle */}
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Password"
                  className="mt-4 w-full bg-transparent text-gray-400 text-sm border-neutral-600 dark:border-gray-500 p-3 rounded-md"
                  required
                />
                <div
                  className="absolute top-10 right-2 transform -translate-y-1/2 cursor-pointer text-neutral-600 dark:text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                </div>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a
                onClick={openResetPassword}
                className="ml-auto text--500 text-xs mb-2 cursor-pointer hover:opacity-80 text-blue-500"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-10 bg-blue-600 text-white text-sm p-2 rounded-md cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-700"
            >
              {isLoading ? <LoadingIcon /> : "Continue"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="flex items-center justify-start w-full text-sm py-2 mt-1">
            <p className="text-neutral-500 dark:text-gray-500 text-xs">
              Don&apos;t have an account?
            </p>
            <a
              onClick={openSignUp}
              className="text-blue-500 ml-1 text-xs cursor-pointer hover:opacity-80"
            >
              Sign Up
            </a>
          </div>

          {/* Terms and Policy */}
          <div className="text-xs text-center text-neutral-500 dark:gray-500 py-6 px-4">
            <p>
              By continuing, you agree to Blend&apos;s{" "}
              <Link href="/terms" className="text-blue-500 hover:opacity-500">
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-blue-500 hover:opacity-500"
              >
                Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;