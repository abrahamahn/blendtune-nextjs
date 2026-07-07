// src/client/features/auth/components/ResetPasswordForm.tsx

import React, { useState } from 'react';

import { Button, Spinner } from '@ui';
import { FormField } from '@client/components';
import Logo from '@components/common/Logo';

import '../auth.css';

interface ResetPasswordProps {
  openSignIn: () => void;
  openVerifyEmail: () => void;
}

/**
 * ResetPassword Component
 * - Allows users to reset their password by entering their registered email.
 * - Sends a request to the backend to initiate a password reset.
 * - Handles error messages and displays loading states.
 */
const ResetPassword: React.FC<ResetPasswordProps> = ({ openSignIn, openVerifyEmail }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles password reset request
   * - Sends email to backend API
   * - Redirects to verify email screen on success
   * - Displays error message on failure
   */
  const handleResetPassword = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/security/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        openVerifyEmail();
      } else {
        setErrorMessage(data.message || 'An unexpected error occurred');
      }
    } catch {
      setErrorMessage('Failed to reset password. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-head">
        <Logo />
        <h1 className="auth-title">Forgot your password?</h1>
        <p className="auth-sub">
          Enter your registered email. We&apos;ll send a link to reset your password.
        </p>
      </div>

      <div className="auth-form">
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
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
        <Button variant="text" size="small" onClick={openSignIn}>
          Back to sign in
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;
