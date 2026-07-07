// main/apps/web/src/main.tsx
/**
 * SPA entry — mounts the app under the custom router (bslt @bslt/react router port).
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Router } from '@router/index';
import { App } from './app/App';
// Global reset + fonts, then the vendored @ui design system (tokens first), then the brand theme.
import './globals.css';
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
