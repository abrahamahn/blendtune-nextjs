// main/apps/web/src/pages/security.tsx
import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useDispatch } from 'react-redux';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { useNavigate } from '@router/index';

import { setAuthenticated, setUnauthenticated } from '@store/slices';
import { useSession } from '@auth/services';
import Logo from '@components/common/Logo';
import LoadingIcon from '@client/shared/components/icons/LoadingIcon';
import SearchParamsWrapper from '@search/services/SearchParamsWrapper';

// localStorage never notifies within this page's lifetime; read-once external store.
const subscribeNever = () => () => {};
const readStoredEmail = () => localStorage.getItem('userEmail') || '';

/**
 * VerifyEmailPage:
 * - Retrieves the user's email from local storage.
 * - Allows users to resend the verification email.
 * - Implements a cooldown timer for resending.
 */
export const VerifyEmailPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [resendStatus, setResendStatus] = useState('');

  // User email from local storage.
  const userEmail = useSyncExternalStore(subscribeNever, readStoredEmail, () => '');

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
      const response = await fetch('/api/auth/security/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, cooldown: cooldown }),
      });

      const data = await response.json();

      if (data.success) {
        setResendStatus('success');
        setCooldown(60);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setResendStatus('failure');
      if (error instanceof Error && error.message.includes('429')) {
        setCooldown(60);
      } else {
        setCooldown(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Determine the message to display based on resend status.
  let message;
  if (resendStatus === 'success') {
    message = `Confirmation email has been re-sent! Please check your inbox.`;
  } else if (resendStatus === 'failure') {
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
              cooldown > 0 ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
            } text-white text-sm p-2 rounded-md cursor-pointer`}
          >
            {isLoading ? <LoadingIcon /> : <>Resend Email {cooldown > 0 && `(${cooldown}s)`}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * NewPasswordPage:
 * - Verifies the reset token.
 * - Allows the user to set a new password with validation.
 * - Updates authentication state and redirects upon successful password reset.
 */
export const NewPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Verify the reset token once available.
  useEffect(() => {
    if (token) {
      fetch(`/api/auth/security/reset-password/verify?token=${token}`)
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          if (!data.success) {
            setErrorMessage('Confirmation link is invalid. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error verifying token:', error);
          setIsLoading(false);
          setErrorMessage('Confirmation link is invalid. Please try again.');
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
      setErrorMessage('Password must be 8+ characters, with 1+ number and special character.');
      return;
    }

    // Ensure the password fields match.
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Submit the new password to the API.
    const response = await fetch('/api/auth/security/reset-password/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token, newPassword: password }),
    });
    const data = await response.json();

    if (response.ok) {
      dispatch(setAuthenticated());
      navigate('/auth/security/reset-confirmed');
    } else {
      console.error(data.message);
      dispatch(setUnauthenticated());
    }
  };

  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900">
      <SearchParamsWrapper onParamsReady={setToken} />
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
                name="confirmPassword"
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
                {isLoading ? <LoadingIcon /> : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * ResetConfirmedPage:
 * - Displays a confirmation message after a successful password reset.
 * - Automatically redirects the user to the main page after a short delay.
 */
export const ResetConfirmedPage: React.FC = () => {
  const navigate = useNavigate();
  const { userAuthenticated } = useSession();

  useEffect(() => {
    if (userAuthenticated) {
      const timer = setTimeout(() => {
        navigate('/sounds');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [userAuthenticated, navigate]);

  return (
    <div className="w-full h-full bg-opacity-80 bg-gray-500 dark:bg-gray-900">
      <div className="w-80 lg:w-96 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 py-8">
        <div className="rounded-lg bg-neutral-100 dark:bg-gray-900 px-6 py-8">
          {/* Logo */}
          <div className="flex items-center pt-4 lg:pt-6 justify-center">
            <Logo />
          </div>
          <p className="text-left text-neutral-600 dark:text-gray-200 text-xs mt-3">
            Your password has been successfully changed! Now logging in...
          </p>
          <div className="flex justify-center items-center w-full mt-6 h-10 bg-blue-600 text-white text-sm p-2 rounded-md cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-700">
            <LoadingIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ConfirmEmailPage:
 * - Retrieves the token via SearchParamsWrapper.
 * - Calls the API to confirm the user's email using the token.
 * - Updates the authentication state and redirects based on the confirmation result.
 */
export const ConfirmEmailPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Trigger email confirmation once the token is available.
  useEffect(() => {
    if (token) {
      const apiUrl = `/api/auth/security/confirm-email?token=${token}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            dispatch(setAuthenticated());
            navigate('/welcome');
          } else {
            dispatch(setUnauthenticated());
            navigate('/auth/signin');
            alert('Invalid token or token has expired. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error confirming email:', error);
          alert('Something went wrong. Please try again.');
        })
        .finally(() => setLoading(false));
    }
  }, [token, dispatch, navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <SearchParamsWrapper onParamsReady={setToken} />
      {loading ? (
        <p className="text-black dark:text-white">Confirming your email...</p>
      ) : (
        <p className="text-black dark:text-white">Redirecting...</p>
      )}
    </div>
  );
};
