// src/client/features/creator/components/AddTrackForm.tsx
'use client';

import React, { useState } from 'react';

import { parseNewTrack } from '@shared/validation/track';
import type { CreatedTrack } from '@shared/types/creator';
import { CreatorApiError, createWorkspaceTrack } from '../core/api';

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

const inputClass =
  'w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-2 py-1.5 text-sm text-black dark:text-white placeholder-neutral-400';

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {FIELDS.map(({ name, label, placeholder }) => (
          <label key={name} className="flex flex-col gap-1 text-xs text-neutral-600 dark:text-neutral-400">
            {label}
            <input
              value={values[name]}
              onChange={(e) => setValues((v) => ({ ...v, [name]: e.target.value }))}
              placeholder={placeholder}
              className={inputClass}
            />
            {errors[name] && <span className="text-red-500">{errors[name]}</span>}
          </label>
        ))}
      </div>
      {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-1.5 text-sm font-medium text-white"
      >
        {submitting ? 'Adding…' : 'Add track'}
      </button>
    </form>
  );
};
