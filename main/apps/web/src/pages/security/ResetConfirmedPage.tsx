// main/apps/web/src/pages/security/ResetConfirmedPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from '@router/index';

import { Spinner, Text } from '@ui';
import { useSession } from '@features/auth/services/useSession';
import Logo from '@components/common/Logo';

import '@features/auth/auth.css';

export const ResetConfirmedPage: React.FC = () => {
  const navigate = useNavigate();
  const { userAuthenticated } = useSession();

  useEffect(() => {
    if (userAuthenticated) {
      const timer = setTimeout(() => {
        navigate('/sounds');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [userAuthenticated, navigate]);

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-head">
          <Logo />
        </div>
        <Text as="p" size="sm" tone="muted" className="auth-sub">
          Your password has been changed. Signing you in…
        </Text>
        <div className="auth-spinner-row">
          <Spinner />
        </div>
      </div>
    </div>
  );
};
