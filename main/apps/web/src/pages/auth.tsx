// main/apps/web/src/pages/auth.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from '@router/index';

import { Button, Checkbox, Spinner, Text } from '@ui';
import { FormField } from '@client/components';
import { setAuthenticated, setUnauthenticated } from '@core/store/slices';
import Logo from '@components/common/Logo';

import '@features/auth/auth.css';

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
  const [isLoading, setIsLoading] = useState(false);

  const openConfirmSignUp = () => {
    navigate('/auth/security/confirm-email');
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
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-head">
          <Logo />
          <h1 className="auth-title">Welcome back</h1>
        </div>

        <Button variant="secondary" className="auth-google" disabled>
          <FcGoogle /> Continue with Google
        </Button>

        <div className="auth-divider">or sign in with email</div>

        <form onSubmit={handleSignIn} className="auth-form">
          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormField
            label="Password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="auth-forgot">
            <Button as={Link} variant="text" size="small" {...{ to: '/auth/reset-password' }}>
              Forgot password?
            </Button>
          </div>
          <Button variant="primary" type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? <Spinner /> : 'Sign in'}
          </Button>
        </form>

        <div className="auth-footer">
          <Text as="span" size="sm" tone="muted">
            Don&apos;t have an account?
          </Text>
          <Button as={Link} variant="text" size="small" {...{ to: '/auth/signup' }}>
            Sign up
          </Button>
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
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);

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
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-head">
          <Logo />
          <h1 className="auth-title">Create your account</h1>
        </div>

        <Button variant="secondary" className="auth-google" disabled>
          <FcGoogle /> Continue with Google
        </Button>

        <div className="auth-divider">or sign up with email</div>

        <form className="auth-form" onSubmit={handleSignUp}>
          <div className="auth-row">
            <FormField
              label="First name"
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              placeholder="Jane"
            />
            <FormField
              label="Last name"
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              placeholder="Doe"
            />
          </div>
          <FormField
            label="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="you@example.com"
            autoComplete="new-password"
          />
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

          <Checkbox
            checked={agreePolicy}
            onChange={setAgreePolicy}
            className="auth-consent"
            label={
              <>
                I agree to the <Link to="/terms">Terms</Link> and{' '}
                <Link to="/privacy-policy">Privacy Policy</Link>
              </>
            }
          />

          <Button variant="primary" type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? <Spinner /> : 'Create account'}
          </Button>
        </form>

        <div className="auth-footer">
          <Text as="span" size="sm" tone="muted">
            Already have an account?
          </Text>
          <Button as={Link} variant="text" size="small" {...{ to: '/auth/signin' }}>
            Sign in
          </Button>
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
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-head">
          <Logo />
          <h1 className="auth-title">Forgot your password?</h1>
          <p className="auth-sub">
            Enter a registered email and we&apos;ll send a confirmation link to reset it.
          </p>
        </div>

        <div className="auth-form">
          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            error={errorMessage || undefined}
          />
          <Button
            variant="primary"
            className="auth-submit"
            onClick={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : 'Send reset link'}
          </Button>
        </div>

        <div className="auth-footer">
          <Button as={Link} variant="text" size="small" {...{ to: '/auth/signin' }}>
            Back to sign in
          </Button>
        </div>
      </div>
    </div>
  );
};
