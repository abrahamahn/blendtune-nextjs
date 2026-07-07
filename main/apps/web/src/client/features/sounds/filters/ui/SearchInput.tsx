// src/client/features/sounds/filters/ui/SearchInput.tsx
/**
 * Search input component for filter searching
 * Provides consistent styling and behavior for filter search fields
 * 
 * @module filters/ui/SearchInput
 */
import React from 'react';

/**
 * Props for the SearchInput component
 * Extends the native HTML input props with required onChange handler
 * 
 * @interface SearchInputProps
 */
interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Current input value */
  value: string;
  
  /** Change handler for input updates */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  /** Placeholder text to display when empty */
  placeholder?: string;
}

/**
 * Search input component for filtering options
 * Provides consistent styling and behavior for search fields
 * 
 * @param {SearchInputProps} props - Component props including standard input attributes
 * @returns {React.ReactElement} - Rendered search input
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  ...props
}) => {
  return (
    <div className="w-full flex flex-row mb-4">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full text-xs h-8 rounded-lg bg-white/95 dark:bg-black/90 border border-neutral-400 dark:border-neutral-700 text-neutral-600 dark:text-neutral-200 placeholder-style"
        aria-label={placeholder}
        {...props}
      />
    </div>
  );
};