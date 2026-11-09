// main/apps/web/src/pages/HomePage.tsx
import React from 'react';

import Hero from '@features/home/components/Hero';

/** / — the marketing home page. */
export const HomePage: React.FC = () => (
  <div className="bt-home">
    <Hero />
  </div>
);
