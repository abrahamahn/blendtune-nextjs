// src/client/features/creator/components/WorkspaceSwitcher.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import type { WorkspaceSummary } from '@shared/types/creator';

interface WorkspaceSwitcherProps {
  workspaces: WorkspaceSummary[];
  activeSlug: string;
}

/** Dropdown to jump between the user's creator workspaces (/c/:slug). */
export const WorkspaceSwitcher: React.FC<WorkspaceSwitcherProps> = ({
  workspaces,
  activeSlug,
}) => {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
      Workspace
      <select
        value={activeSlug}
        onChange={(e) => router.push(`/c/${e.target.value}`)}
        className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1 text-sm text-black dark:text-white"
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
