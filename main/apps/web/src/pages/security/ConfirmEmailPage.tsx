// main/apps/web/src/pages/security/ConfirmEmailPage.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from '@router/index';

import { Text } from '@ui';
import { setAuthenticated, setUnauthenticated } from '@features/auth/store/sessionSlice';
import SearchParamsWrapper from '@features/sounds/search/services/SearchParamsWrapper';

import '@features/auth/auth.css';

export const ConfirmEmailPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const apiUrl = `/api/auth/security/confirm-email?token=${token}`;
      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            dispatch(setAuthenticated());
            navigate('/welcome');
          } else {
            dispatch(setUnauthenticated());
            navigate('/auth/signin');
            alert('Invalid token or token has expired. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error confirming email:', error);
          alert('Something went wrong. Please try again.');
        })
        .finally(() => setLoading(false));
    }
  }, [token, dispatch, navigate]);

  return (
    <div className="auth-screen">
      <SearchParamsWrapper onParamsReady={setToken} />
      <Text as="p" tone="muted">
        {loading ? 'Confirming your email…' : 'Redirecting…'}
      </Text>
    </div>
  );
};
