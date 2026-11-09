// main/apps/web/src/pages/auth/SignUpPage.tsx
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from '@router/index';

import { Button, Checkbox, Spinner, Text } from '@ui';
import { FormField } from '@client/components/form/FormField';
import Logo from '@components/common/Logo';

import '@features/auth/auth.css';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPasswordMatch(true);
    setErrorMessage('');

    const namePattern = /^[A-Z][a-z]*$/;
    if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
      setErrorMessage('Name must start with a capital letter.');
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('First and last name are required.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Enter a valid email address (e.g., user@example.com).');
      return;
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      setErrorMessage('Password must be 8+ characters, with 1+ number and special character.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password === firstName || password === lastName || password === email) {
      setErrorMessage('Password cannot be your name or email.');
      return;
    }

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
