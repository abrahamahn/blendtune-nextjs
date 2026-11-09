// main/apps/web/src/pages/security/VerifyEmailPage.tsx
import React, { useState, useEffect, useSyncExternalStore } from 'react';

import { Button, Spinner, Text } from '@ui';
import Logo from '@components/common/Logo';

import '@features/auth/auth.css';

const subscribeNever = () => () => {};
const readStoredEmail = () => localStorage.getItem('userEmail') || '';

export const VerifyEmailPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [resendStatus, setResendStatus] = useState('');

  const userEmail = useSyncExternalStore(subscribeNever, readStoredEmail, () => '');

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

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/security/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, cooldown }),
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
