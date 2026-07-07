// src/client/features/creator/components/AddTrackForm.tsx
'use client';

import React, { useState } from 'react';

import { Button, Spinner, Text } from '@ui';
import { FormField } from '@client/components';
import { parseNewTrack } from '@shared/validation/track';
import type { CreatedTrack } from '@shared/types/creator';
import { CreatorApiError, createWorkspaceTrack } from '../core/api';

import './creator.css';

interface AddTrackFormProps {
  slug: string;
  onCreated: (track: CreatedTrack) => void;
}

const FIELDS = [
  { name: 'catalog', label: 'Catalog ID *', placeholder: 'mkh063' },
  { name: 'title', label: 'Title *', placeholder: 'Track title' },
  { name: 'bpm', label: 'BPM', placeholder: '140' },
  { name: 'note', label: 'Key', placeholder: 'C' },
  { name: 'scale', label: 'Scale', placeholder: 'minor' },
] as const;

type FieldName = (typeof FIELDS)[number]['name'];

/** Add-track form: validates with the shared parser before submitting to the creator API. */
export const AddTrackForm: React.FC<AddTrackFormProps> = ({ slug, onCreated }) => {
  const [values, setValues] = useState<Record<FieldName, string>>({
    catalog: '',
    title: '',
    bpm: '',
    note: '',
    scale: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseNewTrack(values);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const created = await createWorkspaceTrack(slug, parsed.data);
      setValues({ catalog: '', title: '', bpm: '', note: '', scale: '' });
      onCreated(created);
    } catch (err) {
      if (err instanceof CreatorApiError && err.code === 'TRACK_CATALOG_TAKEN') {
        setErrors({ catalog: err.message });
      } else {
        setErrors({ form: err instanceof Error ? err.message : 'Failed to create track' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="creator-form">
      <div className="creator-form-grid">
        {FIELDS.map(({ name, label, placeholder }) => (
          <FormField
            key={name}
            label={label}
            type="text"
            value={values[name]}
            onChange={(e) => setValues((v) => ({ ...v, [name]: e.target.value }))}
            placeholder={placeholder}
            error={errors[name] || undefined}
          />
        ))}
      </div>
      {errors.form && (
        <Text as="span" size="sm" tone="danger">
          {errors.form}
        </Text>
      )}
      <Button variant="primary" type="submit" disabled={submitting} className="creator-submit">
        {submitting ? <Spinner /> : 'Add track'}
      </Button>
    </form>
  );
};
