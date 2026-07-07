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
// Vendored bslt design system (theme tokens first) — coexists with tailwind during conversion.
import '@ui/styles/theme.css';
import '@ui/styles/elements.css';
import '@ui/styles/components.css';
import '@ui/styles/layouts.css';
import '@ui/styles/utilities.css';
// Blendtune brand theme — token overrides + fonts (docs/dev/design-direction.md)
import './theme/blendtune.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
