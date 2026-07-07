// src/client/features/creator/components/CreatorDashboard.tsx
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Link } from '@router/index';

import {
  Heading,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from '@ui';
import { EmptyState, FactsReadout } from '@client/components';
import type { Track } from '@shared/types/track';
import type { WorkspaceSummary } from '@shared/types/creator';
import { CreatorApiError, fetchWorkspaceCatalog, fetchWorkspaces } from '../core/api';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { AddTrackForm } from './AddTrackForm';

import './creator.css';

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
      <div className="creator-state">
        {error.status === 401 ? (
          <Text as="p">
            Please <Link to="/auth/signin">sign in</Link> to manage your workspace.
          </Text>
        ) : (
          <Text as="p">{error.message}</Text>
        )}
      </div>
    );
  }

  if (!workspaces || !tracks) {
    return (
      <div className="creator-state">
        <Spinner /> Loading workspace…
      </div>
    );
  }

  const active = workspaces.find((w) => w.slug === slug);
  const canWrite = active !== undefined && active.role !== 'viewer';

  return (
    <div className="creator-dash">
      <header className="creator-header">
        <Heading as="h1" size="lg">
          {active?.name ?? slug}
        </Heading>
        <WorkspaceSwitcher workspaces={workspaces} activeSlug={slug} />
      </header>

      {canWrite && (
        <section className="creator-panel">
          <Heading as="h2" size="sm" className="creator-section-title">
            Add a track
          </Heading>
          <AddTrackForm slug={slug} onCreated={loadCatalog} />
        </section>
      )}

      <section>
        <Heading as="h2" size="sm" className="creator-section-title">
          Catalog ({tracks.length})
        </Heading>
        {tracks.length === 0 ? (
          <EmptyState title="No tracks yet" hint="Add your first one above." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catalog</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Facts</TableHead>
                <TableHead>Release</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks.map((track) => (
                <TableRow key={track.metadata.catalog}>
                  <TableCell className="creator-catalog-code">{track.metadata.catalog}</TableCell>
                  <TableCell>{track.metadata.title}</TableCell>
                  <TableCell>
                    <FactsReadout
                      note={track.info.key.note}
                      scale={track.info.key.scale}
                      bpm={track.info.bpm || undefined}
                    />
                  </TableCell>
                  <TableCell>{track.metadata.release || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
};
