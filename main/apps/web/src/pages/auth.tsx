// main/apps/web/src/pages/auth.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from '@router/index';

import { setAuthenticated, setUnauthenticated } from '@store/slices';
import Logo from '@components/common/Logo';
import LoadingIcon from '@/client/shared/components/icons/LoadingIcon';

/**
 * SignInPage:
 * - Allows users to sign in using email and password.
 * - Supports Google OAuth authentication.
 * - Redirects to a verification page if sign-up confirmation is required.
 */
export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openConfirmSignUp = () => {
    navigate('/auth/security/confirm-email');
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        dispatch(setAuthenticated());
        navigate('/sounds');
      } else {
        const data = await response.json();
        alert(data.message);

        if (data.message === 'ConfirmSignUp required') {
          openConfirmSignUp();
        }
      }
    } catch (error) {
      dispatch(setUnauthenticated());
      console.error('Error during login:', error);
      alert('An unexpected error occurred');
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
                type={showPassword ? 'text' : 'password'}
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
              {isLoading ? <LoadingIcon /> : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * SignUpPage:
 * - Handles user registration with email and password.
 * - Validates user input (name, email, password format).
 * - Allows Google sign-up (to be implemented).
 * - Redirects to the email verification page upon success.
 */
export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  // User input states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const togglePolicyButton = () => setAgreePolicy(!agreePolicy);

  // Placeholder for Google sign-up (to be implemented)
  const handleSignUpWithGoogle = async () => {};

  /**
   * Handles form submission:
   * - Validates user input.
   * - Sends sign-up request.
   * - Stores email and redirects on success.
   */
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset previous validation states
    setPasswordMatch(true);
    setErrorMessage('');

    // Name validation (first letter uppercase)
    const namePattern = /^[A-Z][a-z]*$/;
    if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
      setErrorMessage('Name must start with a capital letter.');
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('First and last name are required.');
      return;
    }

    // Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Enter a valid email address (e.g., user@example.com).');
      return;
    }

    // Password complexity validation
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      setErrorMessage('Password must be 8+ characters, with 1+ number and special character.');
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Prevent use of personal information in password
    if (password === firstName || password === lastName || password === email) {
      setErrorMessage('Password cannot be your name or email.');
      return;
    }

    // Check terms agreement
    if (!agreePolicy) {
      setErrorMessage('You must agree to the terms and policies to sign up.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (response.ok) {
        localStorage.setItem('userEmail', email);
        navigate('/auth/security/verify-email');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900">
      <div className="w-80 lg:w-96 rounded-lg bg-gray-500 dark:bg-gray-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 lg:py-4">
          {/* Logo */}
          <div className="flex items-center pt-4 lg:pt-6 justify-center">
            <Logo />
          </div>
          {/* Title */}
          <div className="flex flex-col items-center mt-8">
            <h1 className="hidden lg:flex text-base font-semibold text-black dark:text-white">
              Create your free account
            </h1>
          </div>
          {/* Google Sign-Up */}
          <button
            onClick={handleSignUpWithGoogle}
            className="mt-4 flex items-center w-full bg-transparent border border-neutral-600 dark:border-gray-500 text-black dark:text-white p-3 rounded-md cursor-pointer mb-2"
          >
            <FcGoogle className="mr-3" />
            <p className="text-sm text-neutral-600 dark:text-gray-500">Continue with Google</p>
          </button>
          {/* Divider */}
          <div className="divider-container flex py-2 items-center justify-center w-full">
            <div className="border-t border-neutral-500 dark:border-gray-500 w-1/4 mb-2"></div>
            <span className="text-neutral-500 dark:text-gray-500 text-xs lg:text-sm mb-2 mx-2">
              or sign in using email
            </span>
            <div className="border-t border-neutral-500 dark:border-gray-500 w-1/4 mb-2"></div>
          </div>
          {/* Sign-Up Form */}
          <form className="flex flex-col items-center w-full" onSubmit={handleSignUp}>
            <div className="flex flex-col">
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
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email Address"
                autoComplete="new-password"
                className="mt-4 w-full bg-transparent text-neutral-600 dark:text-gray-400 text-sm border-neutral-600 dark:border-gray-500 p-3 rounded-md"
              />
              {/* Password Fields */}
              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
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
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className={`mt-4 w-full bg-transparent text-neutral-600 dark:text-gray-500 text-sm border-neutral-600 dark:border-gray-500 p-3 rounded-md ${
                    !passwordMatch ? 'border-red-500' : ''
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
            {errorMessage ? (
              <p className="texts-left text-red-500 text-xs mt-2">{errorMessage}</p>
            ) : (
              <p className="text-left text-neutral-500 dark:text-gray-500 text-2xs mt-3">
                Must be 8+ characters, with 1+ number and special character.
              </p>
            )}
            {/* Terms & Conditions */}
            <div className="flex items-center w-full mt-3">
              <div
                onClick={togglePolicyButton}
                className={`${
                  agreePolicy ? 'bg-blue-600' : 'bg-white border border-gray-400'
                } w-10 h-4 rounded-full p-1 flex items-center cursor-pointer mr-2 transition-colors duration-300`}
              >
                <div
                  className={`${
                    agreePolicy ? 'bg-white' : 'bg-gray-500'
                  } w-4 h-2.5 rounded-full transition-all duration-300 transform ${
                    agreePolicy ? 'translate-x-4' : 'translate-x-0'
                  }`}
                ></div>
              </div>
              <div>
                <p className="text-neutral-500 dark:text-white text-xs">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-500 hover:text-blue-800">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-blue-500 hover:text-blue-800">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
            {/* Sign-Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 h-10 w-full bg-blue-600 text-white text-sm p-2 rounded-md cursor-pointer hover:bg-blue-700"
            >
              {isLoading ? <LoadingIcon /> : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center justify-center w-full text-xs p-6">
            <p className="text-neutral-500 dark:text-gray-500">Already have an account?</p>
            <Link
              to="/auth/signin"
              className="h-10 text-blue-500 flex justify-center items-center ml-1 cursor-pointer hover:opacity-80"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ResetPasswordPage:
 * - Collects the user's email and sends a reset request.
 * - Redirects to a verification page upon success.
 */
export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  // State for user email, error messages, and loading indicator.
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Sends a password reset request to the server.
   * On success, navigates the user to the verify email page.
   * On error, displays the returned error message.
   */
  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/security/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        navigate('/auth/security/verify-email');
      } else {
        setErrorMessage(data.message || 'An unexpected error occurred');
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
              Please enter an email address you have registered. We will send you a confirmation
              email for verification.
            </p>
          )}
          {/* Reset button */}
          <div>
            <button
              onClick={handleResetPassword}
              className="w-full mt-6 h-10 bg-blue-600 text-white text-sm p-2 rounded-md cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-700"
            >
              {isLoading ? <LoadingIcon /> : 'Continue'}
            </button>
          </div>
          {/* Link back to sign in */}
          <div className="text-blue-500 text-sm mt-4">
            <Link to="/auth/signin" className="cursor-pointer hover:opacity-80 text-xs">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
