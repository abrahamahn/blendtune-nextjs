// src/client/features/creator/components/CreatorDashboard.tsx
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import type { Track } from '@shared/types/track';
import type { WorkspaceSummary } from '@shared/types/creator';
import { CreatorApiError, fetchWorkspaceCatalog, fetchWorkspaces } from '../core/api';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { AddTrackForm } from './AddTrackForm';

interface CreatorDashboardProps {
  slug: string;
}

/** The creator workspace dashboard (/c/:slug): catalog listing + add-track. */
export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({ slug }) => {
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[] | null>(null);
  const [tracks, setTracks] = useState<Track[] | null>(null);
  const [error, setError] = useState<CreatorApiError | null>(null);

  const loadCatalog = useCallback(() => {
    fetchWorkspaceCatalog(slug).then(setTracks, setError);
  }, [slug]);

  useEffect(() => {
    fetchWorkspaces().then(setWorkspaces, setError);
  }, []);
  useEffect(loadCatalog, [loadCatalog]);

  if (error) {
    return (
      <div className="p-8 text-center text-sm text-neutral-600 dark:text-neutral-400">
        {error.status === 401 ? (
          <p>
            Please{' '}
            <Link href="/auth/signin" className="text-indigo-500 underline">
              sign in
            </Link>{' '}
            to manage your workspace.
          </p>
        ) : (
          <p>{error.message}</p>
        )}
      </div>
    );
  }

  if (!workspaces || !tracks) {
    return (
      <div className="p-8 text-center text-sm text-neutral-500 animate-pulse">
        Loading workspace…
      </div>
    );
  }

  const active = workspaces.find((w) => w.slug === slug);
  const canWrite = active !== undefined && active.role !== 'viewer';

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-black dark:text-white">
          {active?.name ?? slug}
        </h1>
        <WorkspaceSwitcher workspaces={workspaces} activeSlug={slug} />
      </header>

      {canWrite && (
        <section className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4">
          <h2 className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Add a track
          </h2>
          <AddTrackForm slug={slug} onCreated={loadCatalog} />
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Catalog ({tracks.length})
        </h2>
        {tracks.length === 0 ? (
          <p className="text-sm text-neutral-500">No tracks yet — add your first one above.</p>
        ) : (
          <table className="w-full text-left text-sm text-neutral-800 dark:text-neutral-200">
            <thead className="text-xs uppercase text-neutral-500">
              <tr>
                <th className="py-2 pr-4">Catalog</th>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">BPM</th>
                <th className="py-2 pr-4">Key</th>
                <th className="py-2">Release</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => (
                <tr
                  key={track.metadata.catalog}
                  className="border-t border-neutral-200 dark:border-neutral-800"
                >
                  <td className="py-2 pr-4 font-mono text-xs">{track.metadata.catalog}</td>
                  <td className="py-2 pr-4">{track.metadata.title}</td>
                  <td className="py-2 pr-4">{track.info.bpm ?? '—'}</td>
                  <td className="py-2 pr-4">
                    {track.info.key.note ? `${track.info.key.note} ${track.info.key.scale}` : '—'}
                  </td>
                  <td className="py-2">{track.metadata.release ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};
