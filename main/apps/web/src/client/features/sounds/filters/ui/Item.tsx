// main/apps/web/src/client/features/sounds/filters/ui/Item.tsx
/**
 * Filter option button used inside panels. Selected state speaks in amber —
 * the single accent per the design direction.
 */
import React from 'react';

import { Button } from '@ui';

import '../filters.css';

interface ItemProps {
  /** Whether the item is currently selected */
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Item: React.FC<ItemProps> = ({ selected = false, onClick, children, className }) => (
  <Button
    variant="text"
    size="inline"
    className={`bt-filter-option ${className ?? ''}`.trim()}
    data-active={selected}
    aria-pressed={selected}
    onClick={onClick}
  >
    {children}
  </Button>
);
