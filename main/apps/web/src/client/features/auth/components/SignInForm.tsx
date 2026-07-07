// src/client/features/auth/components/SignInForm.tsx
import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

import { Button, Spinner, Text } from '@ui';
import { FormField } from '@client/components';
import { Link } from '@router/index';
import Logo from '@components/common/Logo';
import useAuth from '@features/auth/hooks/useAuth';

import '../auth.css';

/**
 * Props interface for the SignIn component
 * @interface SignInProps
 * @property {() => void} openSignUp - Function to switch to signup form
 * @property {() => void} openResetPassword - Function to open reset password form
 */
interface SignInProps {
  openSignUp: () => void;
  openResetPassword: () => void;
}

/**
 * SignIn component provides user authentication functionality
 * Includes email/password login and Google OAuth options
 */
const SignIn: React.FC<SignInProps> = ({ openSignUp, openResetPassword }) => {
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="auth-card">
      <div className="auth-head">
        <Logo />
        <h1 className="auth-title">Welcome back</h1>
      </div>

      <Button variant="secondary" className="auth-google" disabled>
        <FcGoogle /> Continue with Google
      </Button>

      <div className="auth-divider">or sign in with email</div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <FormField
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
        />
        <div className="auth-forgot">
          <Button variant="text" size="small" type="button" onClick={openResetPassword}>
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
        <Button variant="text" size="small" onClick={openSignUp}>
          Sign up
        </Button>
      </div>

      <p className="auth-terms">
        By continuing, you agree to Blend&apos;s <Link to="/terms">Terms</Link> and{' '}
        <Link to="/privacy-policy">Policy</Link>.
      </p>
    </div>
  );
};

export default SignIn;
