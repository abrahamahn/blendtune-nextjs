// src/client/features/auth/components/VerifyEmailForm.tsx
'use client';
import React, { useState, useEffect } from 'react';

import { Button, Spinner, Text } from '@ui';
import Logo from '@components/common/Logo';

import '../auth.css';

/**
 * Props interface for the VerifyEmail component
 * @interface VerifyEmailProps
 * @property {string} userEmail - Email address of the user to verify
 * @property {string} apiEndpoint - API endpoint for email verification and resend
 * @property {string} initialMessage - Initial message to display to the user
 */
interface VerifyEmailProps {
  userEmail: string;
  apiEndpoint: string;
  initialMessage: string;
}

/**
 * Status messages for different verification states
 */
const STATUS_MESSAGES = {
  success: `Confirmation email has been re-sent! Please check your inbox.`,
  failure: `Resend has failed. Please try after about a minute and check spam folder.`,
  default: `Please confirm your email by going to your inbox and click confirmation link.`,
};

/**
 * VerifyEmail component handles email verification process
 * Provides UI for email verification status and resend functionality with cooldown timer
 */
const VerifyEmail: React.FC<VerifyEmailProps> = ({ userEmail, apiEndpoint, initialMessage }) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [resendStatus, setResendStatus] = useState('');

  /**
   * Manages the cooldown timer for email resend functionality
   * Sets up an interval to decrement the cooldown counter every second
   */
  useEffect(() => {
    let interval: number | undefined;

    if (cooldown > 0) {
      interval = window.setInterval(() => {
        setCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    } else if (interval !== undefined) {
      clearInterval(interval);
    }

    // Cleanup interval on component unmount or when cooldown reaches 0
    return () => {
      if (interval !== undefined) clearInterval(interval);
    };
  }, [cooldown]);

  /**
   * Handles resending verification email
   * Manages API call, response handling, and error states
   */
  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          cooldown: cooldown,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResendStatus('success');
        setCooldown(60); // Reset cooldown timer on successful resend
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setResendStatus('failure');
      // Handle rate limiting errors (HTTP 429)
      if (error instanceof Error && error.message.includes('429')) {
        setCooldown(60); // Reset cooldown on rate limit
      } else {
        setCooldown(0); // Clear cooldown for other errors
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Determine current display message based on status
  const message = resendStatus
    ? STATUS_MESSAGES[resendStatus as keyof typeof STATUS_MESSAGES]
    : initialMessage || STATUS_MESSAGES.default;

  return (
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
  );
};

export default VerifyEmail;
