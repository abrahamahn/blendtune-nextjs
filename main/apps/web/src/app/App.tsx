// main/apps/web/src/app/App.tsx
/**
 * App shell + route table (mirrors bslt's app/routes pattern).
 *
 * Reproduces the former Next.js layout tree: global providers, mobile viewport hooks,
 * the persistent bottom music player, and one route per former page.tsx.
 */

import React from 'react';

import ClientProviders from '@core/providers/ClientProviders';
import MusicPlayer from '@features/player/components/MusicPlayer';
import RightBar from '@features/layout/rightbar';
import { HideMobileChrome, SetViewportHeight } from '@client/shared/hooks/mobile';
import { Route, Routes } from '@router/index';

import { HomePage } from '../pages/HomePage';
import { SoundsPage } from '../pages/SoundsPage';
import { CreatorPage } from '../pages/CreatorPage';
import { SignInPage, SignUpPage, ResetPasswordPage } from '../pages/auth';
import {
  ConfirmEmailPage,
  NewPasswordPage,
  ResetConfirmedPage,
  VerifyEmailPage,
} from '../pages/security';
import { PrivacyPolicyPage, TermsPage, WelcomePage } from '../pages/static';

import './App.css';

export const App: React.FC = () => (
  <ClientProviders>
    <HideMobileChrome />
    <SetViewportHeight />
    <div className="bt-app full-viewport">
      <div className="bt-app-body">
        <div className="bt-app-routes">
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sounds" element={<SoundsPage />} />
          <Route path="/c/:slug" element={<CreatorPage />} />
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/security/verify-email" element={<VerifyEmailPage />} />
          <Route path="/auth/security/new-password" element={<NewPasswordPage />} />
          <Route path="/auth/security/reset-confirmed" element={<ResetConfirmedPage />} />
          <Route path="/auth/security/confirm-email" element={<ConfirmEmailPage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          </Routes>
        </div>
        <RightBar />
      </div>
      <MusicPlayer />
    </div>
  </ClientProviders>
);
