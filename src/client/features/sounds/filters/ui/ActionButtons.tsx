// src/client/features/sounds/filters/ui/ActionButtons.tsx
/**
 * Action buttons component for filter control actions
 * Provides consistent UI for filter actions like clear and close
 * 
 * @module filters/ui/ActionButtons
 */
import React from 'react';

/**
 * Props for the ActionButtons component
 * @interface ActionButtonsProps
 */
export interface ActionButtonsProps {
  /** Callback function triggered when clear button is clicked */
  onClear: () => void;
  
  /** Optional callback function triggered when close button is clicked */
  onClose?: () => void;
  
  /** Flag to render mobile optimized version (only shows clear button) */
  isMobile?: boolean;
}

/**
 * ActionButtons component for filter actions
 * Provides Clear and Close buttons with consistent styling
 * Adapts to mobile or desktop layouts based on the isMobile prop
 * 
 * @param {ActionButtonsProps} props - Component props
 * @returns {React.ReactElement} - Rendered action buttons
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onClear,
  onClose,
  isMobile = false,
}) => {
  // Mobile version (only shows clear button)
  if (isMobile) {
    return (
      <div className="flex justify-end mt-4">
        <button
          onClick={onClear}
          className="font-medium text-sm rounded-full text-neutral-500 dark:text-neutral-50 bg-transparent underline"
          aria-label="Clear filters"
        >
          Clear
        </button>
      </div>
    );
  }

  // Desktop version (shows clear and optional close button)
  return (
    <div className="flex justify-between mt-4">
      <button
        onClick={onClear}
        className="font-medium text-xs rounded-full mr-3 text-neutral-500 dark:text-neutral-50 bg-transparent underline px-6 py-1"
        aria-label="Clear filters"
      >
        Clear
      </button>
      {onClose && (
        <button
          onClick={onClose}
          className="font-medium text-xs rounded-full mr-3 text-neutral-50 bg-blue-600 dark:bg-blue-600 px-6 py-1"
          aria-label="Close filter panel"
        >
          Close
        </button>
      )}
    </div>
  );
};