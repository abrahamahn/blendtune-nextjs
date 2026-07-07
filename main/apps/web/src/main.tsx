// main/apps/web/src/main.tsx
/**
 * SPA entry — mounts the app under the custom router (bslt @bslt/react router port).
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Router } from '@router/index';
import { App } from './app/App';
// Shared with the Next app until cutover (M5); moves into this app when Next is removed.
import './globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
