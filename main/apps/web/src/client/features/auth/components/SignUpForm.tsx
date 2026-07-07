// src/client/features/auth/components/SignUpForm.tsx
'use client';
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

import { Button, Checkbox, Spinner, Text } from '@ui';
import { FormField } from '@client/components';
import { Link } from '@router/index';
import Logo from '@components/common/Logo';

import '../auth.css';

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
 */
const SignUp: React.FC<SignUpProps> = ({ openSignIn, openConfirmEmail, email, setEmail }) => {
  // Form state management
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);

  /**
   * Validates and processes form submission for signup
   * Includes validation for username, name, email, and password
   */
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset validation states
    setPasswordMatch(true);
    setErrorMessage('');

    // Validation patterns
    const patterns = {
      username: /^[a-z0-9_.]{3,}$/,
      name: /^[A-Z][a-z]*$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    };

    // Username validation
    if (!patterns.username.test(username)) {
      setErrorMessage(
        'Username must be at least 3 characters long and can only contain lowercase letters, numbers, underscore (_), and period (.)',
      );
      return;
    }

    // Name validation
    if (!patterns.name.test(firstName) || !patterns.name.test(lastName)) {
      setErrorMessage('Name must start with a capital letter and following lowercase letters.');
      return;
    }

    // Empty name check
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('First and last name are required.');
      return;
    }

    // Email validation
    if (!patterns.email.test(email)) {
      setErrorMessage('Enter a valid email address (e.g., user@example.com).');
      return;
    }

    // Password validation
    if (!patterns.password.test(password)) {
      setErrorMessage('Password must be 8+ characters, with 1+ number and special character.');
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setPasswordMatch(false);
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Password uniqueness validation
    if (password === firstName || password === lastName || password === email) {
      setErrorMessage('Password cannot be your name or email.');
      return;
    }

    // Policy agreement validation
    if (!agreePolicy) {
      setErrorMessage('You must agree to the terms and policies to sign up.');
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        setErrorMessage(data.message || 'An unexpected error occurred.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage('An error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Jane"
          />
          <FormField
            label="Last name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
          />
        </div>
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="new-password"
        />
        <FormField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="janedoe"
        />
        <FormField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="8+ chars, 1 number, 1 symbol"
          autoComplete="new-password"
        />
        <FormField
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        <Button variant="text" size="small" onClick={openSignIn}>
          Sign in
        </Button>
      </div>
    </div>
  );
};

export default SignUp;
