// src/client/features/creator/components/WorkspaceSwitcher.tsx
'use client';

import React from 'react';
import { useNavigate } from '@router/index';

import type { WorkspaceSummary } from '@shared/types/creator';

import './creator.css';

interface WorkspaceSwitcherProps {
  workspaces: WorkspaceSummary[];
  activeSlug: string;
}

/** Dropdown to jump between the user's creator workspaces (/c/:slug). */
export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({ workspaces, activeSlug }) => {
  const navigate = useNavigate();

  return (
    <label className="creator-switcher">
      Workspace
      <select
        value={activeSlug}
        onChange={(e) => navigate(`/c/${e.target.value}`)}
        className="creator-select"
      >
        {workspaces.map((w) => (
          <option key={w.id} value={w.slug}>
            {w.name} ({w.role})
          </option>
        ))}
      </select>
    </label>
  );
};
