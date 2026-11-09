// main/apps/web/src/pages/static/StaticLayout.tsx
import React from 'react';
import Header from '@client/features/layout/header';
import LeftBar from '@features/layout/leftbar';
import StoreProvider from '@core/providers/StoreProvider';

import '../static.css';

/** Shared static-page layout: header, left sidebar, content area. */
export const StaticLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <StoreProvider>
    <div className="static-layout">
      <div className="static-header">
        <Header />
      </div>
      <div className="static-main">
        <div className="static-rail">
          <LeftBar />
        </div>
        <div className="static-content">{children}</div>
      </div>
    </div>
  </StoreProvider>
);
