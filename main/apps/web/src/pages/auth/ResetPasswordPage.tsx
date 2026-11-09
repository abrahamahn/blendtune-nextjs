// main/apps/web/src/pages/auth/ResetPasswordPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from '@router/index';

import { Button, Spinner } from '@ui';
import { FormField } from '@client/components/form/FormField';
import Logo from '@components/common/Logo';

import '@features/auth/auth.css';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
