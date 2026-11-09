// main/apps/web/src/pages/auth/SignInPage.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from '@router/index';

import { Button, Spinner, Text } from '@ui';
import { FormField } from '@client/components/form/FormField';
import { setAuthenticated, setUnauthenticated } from '@features/auth/store/sessionSlice';
import Logo from '@components/common/Logo';

import '@features/auth/auth.css';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const openConfirmSignUp = () => {
    navigate('/auth/security/confirm-email');
  };

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
