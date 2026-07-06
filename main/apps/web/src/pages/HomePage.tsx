// main/apps/web/src/pages/HomePage.tsx
import React from 'react';

import { Hero } from '@features/home';

/** / — the marketing home page. */
export const HomePage: React.FC = () => (
  <div className="main-height flex flex-col h-screen overflow-hidden rounded-xl">
    <Hero />
  </div>
);
