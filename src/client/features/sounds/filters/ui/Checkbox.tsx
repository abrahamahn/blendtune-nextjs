// src\client\features\sounds\filters\ui\Checkbox.tsx
/**
 * Custom checkbox component for filter selections
 * Provides consistent styling and behavior for filter checkboxes
 * 
 * @module filters/ui/Checkbox
 */
import React from 'react';

/**
 * Props for the Checkbox component
 * Extends the native HTML input checkbox props
 * 
 * @interface CheckboxProps
 */
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Text label to display next to the checkbox */
  label: string;
}

/**
 * Custom styled checkbox component with label
 * Provides consistent styling and accessibility features
 * 
 * @param {CheckboxProps} props - Component props including standard input attributes
 * @returns {React.ReactElement} - Rendered checkbox with label
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  ...props
}) => {
  return (
    <div className="flex flex-row items-center mb-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="active:outline-none focus:outline-none checked:bg-blue-600 dark:checked:bg-blue-600 checked:border-blue-400 dark:checked:border-blue-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 bg-neutral-200 dark:bg-neutral-800/50 border-neutral-300 dark:border-neutral-500 rounded-md border-2 w-5 h-5 cursor-pointer"
        aria-label={label}
        {...props}
      />
      <span className="ml-2.5 text-neutral-500 dark:text-neutral-200">
        {label}
      </span>
    </div>
  );
};