// src/client/features/sounds/filters/ui/Item.tsx
/**
 * Button component for filter items
 * Provides consistent styling for various button types used in filters
 * 
 * @module filters/ui/Item
 */
import React from 'react';

/**
 * Props for the Item component
 * Extends the native HTML button props with additional styling options
 * 
 * @interface ItemProps
 */
interface ItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: 'primary' | 'clear' | 'close' | 'filter' | 'sort';
  
  /** Size of the button */
  size?: 'sm' | 'md';
  
  /** Whether the item is currently selected */
  selected?: boolean;
  
  /** Child elements to render within the button */
  children: React.ReactNode;
}

/**
 * Button component for filter interface elements
 * Provides consistent styling with multiple variants and sizes
 * 
 * @param {ItemProps} props - Component props including standard button attributes
 * @returns {React.ReactElement} - Rendered button with appropriate styling
 */
export const Item: React.FC<ItemProps> = ({
  variant = 'primary',
  size = 'md',
  selected = false,
  className = '',
  children,
  ...props
}) => {
  // Base styles applied to all variants
  const baseStyles = 'transition-colors duration-150';
  
  // Styles specific to each variant
  const variantStyles: Record<Required<ItemProps>['variant'], string> = {
    primary: 'bg-blue-600 dark:bg-blue-600 text-white',
    clear: 'bg-transparent underline text-neutral-500 dark:text-neutral-50',
    close: 'font-medium text-neutral-50 bg-blue-600 dark:bg-blue-600',
    filter: `${selected 
      ? 'bg-blue-600 text-white' 
      : 'bg-white/90 dark:bg-black/90 text-neutral-500 border border-neutral-200 dark:border-transparent'}
      text-neutral-500 dark:text-neutral-200 
      hover:text-neutral-600 dark:hover:text-neutral-200 
      hover:bg-neutral-300 dark:hover:bg-neutral-600 
      rounded-lg flex flex-row`,
    sort: 'text-left hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg hover:text-neutral-500'
  };
  
  // Styles specific to each size
  const sizeStyles: Record<Required<ItemProps>['size'], string> = {
    sm: 'text-xs px-1.5 py-1.5',
    md: 'text-sm px-3 py-2'
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      aria-pressed={variant === 'filter' ? selected : undefined}
      {...props}
    >
      {children}
    </button>
  );
};