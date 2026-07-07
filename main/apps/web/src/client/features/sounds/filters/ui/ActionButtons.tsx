// main/apps/web/src/client/features/sounds/filters/ui/ActionButtons.tsx
/**
 * Clear / Close row at the bottom of a filter panel. Close is omitted where the
 * surrounding surface owns dismissal (mobile accordions).
 */
import React from 'react';

import { Button } from '@ui';

import '../filters.css';

interface ActionButtonsProps {
  onClear: () => void;
  onClose?: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onClear, onClose }) => (
  <div className="bt-filter-actions" data-clear-only={onClose == null}>
    <Button variant="text" size="small" onClick={onClear} aria-label="Clear filters">
      Clear
    </Button>
    {onClose != null && (
      <Button variant="secondary" size="small" onClick={onClose} aria-label="Close filter panel">
        Close
      </Button>
    )}
  </div>
);
