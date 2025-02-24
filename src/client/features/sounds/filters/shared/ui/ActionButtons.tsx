// src/client/features/sounds/filters/shared/ui/ActionButtons.tsx
import React from 'react';

export interface ActionButtonsProps {
  /** Callback function for clear action */
  onClear: () => void;
  /** Optional callback function for close action */
  onClose?: () => void;
  /** Flag to indicate if rendering in mobile view */
  isMobile?: boolean;
}

/**
 * ActionButtons component for filter actions
 * Provides Clear and Close buttons with consistent styling
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onClear,
  onClose,
  isMobile = false,
}) => {
  if (isMobile) {
    return (
      <div className="flex justify-end mt-4">
        <button
          onClick={onClear}
          className="font-medium text-sm rounded-full text-neutral-500 dark:text-neutral-50 bg-transparent underline"
        >
          Clear
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={onClear}
        className="font-medium text-xs rounded-full mr-3 text-neutral-500 dark:text-neutral-50 bg-transparent underline px-6 py-1"
      >
        Clear
      </button>
      {onClose && (
        <button
          onClick={onClose}
          className="font-medium text-xs rounded-full mr-3 text-neutral-50 bg-blue-600 dark:bg-blue-600 px-6 py-1"
        >
          Close
        </button>
      )}
    </div>
  );
};