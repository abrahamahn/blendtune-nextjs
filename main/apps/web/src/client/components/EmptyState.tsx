// main/apps/web/src/client/components/EmptyState.tsx
// Empty states invite, per the direction doc: "No beats match — loosen a filter."
import { Text } from '@ui';

import './components.css';

import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  /** What to do next, e.g. "Loosen a filter." */
  hint?: string;
  icon?: ReactNode;
}

export function EmptyState({ title, hint, icon }: EmptyStateProps) {
  return (
    <div className="bt-empty" role="status">
      {icon != null && (
        <span className="bt-empty-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <Text as="span" className="bt-empty-title">
        {title}
      </Text>
      {hint != null && (
        <Text as="span" size="sm" tone="muted">
          {hint}
        </Text>
      )}
    </div>
  );
}
