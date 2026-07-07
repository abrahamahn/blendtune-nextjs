// main/apps/web/src/client/shared/components/common/Logo.tsx
import React from 'react';

import { Link } from '@router/index';

import './Logo.css';

/** Wordmark — Akzidenz Extended via .bt-display; the brand voice. */
const Logo: React.FC = () => (
  <Link className="bt-display bt-logo" to="/">
    BLEND.
  </Link>
);

export default Logo;
