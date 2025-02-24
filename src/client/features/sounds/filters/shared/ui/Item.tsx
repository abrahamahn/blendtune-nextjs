// src/client/features/sounds/filters/components/shared/ui/Item.tsx
import React from 'react';

interface ItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'clear' | 'close' | 'filter' | 'sort';
    size?: 'sm' | 'md';
    selected?: boolean;
    children: React.ReactNode;
  }
  
  export const Item: React.FC<ItemProps> = ({
    variant = 'primary',
    size = 'md',
    selected = false,
    className = '',
    children,
    ...props
  }) => {
    const baseStyles = 'transition-colors duration-150';
    
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
  
    const sizeStyles: Record<Required<ItemProps>['size'], string> = {
      sm: 'text-xs px-1.5 py-1.5',
      md: 'text-sm px-3 py-2'
    };
  
    return (
      <button
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };