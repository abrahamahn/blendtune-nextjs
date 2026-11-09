// main/apps/web/src/pages/security/NewPasswordPage.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from '@router/index';

import { Button, Spinner, Text } from '@ui';
import { FormField } from '@client/components/form/FormField';
import { setAuthenticated, setUnauthenticated } from '@features/auth/store/sessionSlice';
import Logo from '@components/common/Logo';
import SearchParamsWrapper from '@features/sounds/search/services/SearchParamsWrapper';

import '@features/auth/auth.css';

export const NewPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordMatch(true);

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

    const response = await fetch('/api/auth/security/reset-password/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: password }),
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
