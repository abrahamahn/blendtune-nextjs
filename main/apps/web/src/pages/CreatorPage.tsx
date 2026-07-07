// main/apps/web/src/pages/CreatorPage.tsx
import React from 'react';

import { CreatorDashboard } from '@client/features/creator';
import { useParams } from '@router/index';

/** /c/:slug — the creator workspace dashboard. */
export const CreatorPage: React.FC = () => {
  const { slug } = useParams();
  return <CreatorDashboard slug={slug ?? ''} />;
};
