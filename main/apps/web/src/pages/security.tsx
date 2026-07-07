// main/apps/web/src/pages/security.tsx
import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from '@router/index';

import { Button, Spinner, Text } from '@ui';
import { FormField } from '@client/components';
import { setAuthenticated, setUnauthenticated } from '@core/store/slices';
import { useSession } from '@features/auth/services';
import Logo from '@components/common/Logo';
import SearchParamsWrapper from '@features/sounds/search/services/SearchParamsWrapper';

import '@features/auth/auth.css';

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
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-head">
          <Logo />
          <h1 className="auth-title">Check your email</h1>
          <Text as="p" size="sm" tone="muted" className="auth-sub">
            {message}
          </Text>
        </div>

        <Button
          variant="primary"
          className="auth-submit"
          onClick={handleResendEmail}
          disabled={cooldown > 0 || isLoading}
        >
          {isLoading ? <Spinner /> : <>Resend email {cooldown > 0 && `(${cooldown}s)`}</>}
        </Button>
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
    <div className="auth-screen">
      <SearchParamsWrapper onParamsReady={setToken} />
      <div className="auth-card">
        <div className="auth-head">
          <Logo />
          <h1 className="auth-title">Create a new password</h1>
        </div>

        <form className="auth-form" onSubmit={handleNewPassword}>
          <FormField
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="8+ chars, 1 number, 1 symbol"
            autoComplete="new-password"
          />
          <FormField
            label="Confirm password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            placeholder="Re-enter your password"
            error={!passwordMatch ? 'Passwords do not match.' : undefined}
            autoComplete="new-password"
          />
          {errorMessage ? (
            <Text as="span" size="sm" tone="danger">
              {errorMessage}
            </Text>
          ) : (
            <Text as="span" size="sm" tone="muted">
              Must be 8+ characters, with 1+ number and special character.
            </Text>
          )}
          <Button variant="primary" type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? <Spinner /> : 'Save password'}
          </Button>
        </form>
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
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-head">
          <Logo />
        </div>
        <Text as="p" size="sm" tone="muted" className="auth-sub">
          Your password has been changed. Signing you in…
        </Text>
        <div className="auth-spinner-row">
          <Spinner />
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
    <div className="auth-screen">
      <SearchParamsWrapper onParamsReady={setToken} />
      <Text as="p" tone="muted">
        {loading ? 'Confirming your email…' : 'Redirecting…'}
      </Text>
    </div>
  );
};
