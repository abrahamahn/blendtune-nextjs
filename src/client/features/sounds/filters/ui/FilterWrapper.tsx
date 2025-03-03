// src\client\features\sounds\filters\ui\FilterWrapper.tsx

/**
 * Container component for filter panels
 * Provides consistent styling and responsive behavior for filter components
 * 
 * @module filters/ui/FilterWrapper
 */
import React from 'react';

/**
 * Props for the FilterWrapper component
 * Provides extensive customization options for appearance
 * 
 * @interface FilterWrapperProps
 */
interface FilterWrapperProps {
  /** Child elements to render within the wrapper */
  children: React.ReactNode;
  
  /** Whether to use desktop or mobile styling */
  isDesktop?: boolean;
  
  /** Width of the filter wrapper */
  width?: string;
  
  /** Height of the filter wrapper */
  height?: string;
  
  /** Additional custom classes */
  className?: string;
  
  /** Background color and opacity */
  bgColor?: string;
  
  /** Border color */
  borderColor?: string;
  
  /** Text color */
  textColor?: string;
  
  /** Text size */
  textSize?: string;
  
  /** Z-index value for stacking */
  zIndex?: string;
  
  /** Positioning classes */
  position?: string;
  
  /** Padding classes */
  padding?: string;
  
  /** Shadow style */
  shadow?: string;
  
  /** Border radius */
  rounded?: string;
}

/**
 * Container wrapper for filter panels
 * Provides responsive behavior with different styling for desktop and mobile
 * Highly customizable through props
 * 
 * @param {FilterWrapperProps} props - Component props
 * @returns {React.ReactElement} - Rendered filter wrapper
 */
export const FilterWrapper: React.FC<FilterWrapperProps> = ({
  children,
  isDesktop = true,
  width = '',
  height = '',
  className = '',
  bgColor = 'bg-white/95 dark:bg-black/90',
  borderColor = 'border-neutral-200 dark:border-neutral-700',
  textColor = 'text-neutral-300',
  textSize = 'text-xs',
  zIndex = 'z-10',
  position = 'top-0 absolute',
  padding = 'py-4 px-2',
  shadow = 'shadow',
  rounded = 'rounded-lg'
}) => {
  // Classes for desktop view
  const desktopStyles = `
    hidden md:block 
    ${zIndex} 
    ${position} 
    ${bgColor} 
    border ${borderColor} 
    ${padding} 
    ${shadow} 
    ${rounded} 
    ${textColor} 
    ${textSize} 
    ${width} 
    ${height} 
    ${className}
  `;

  // Classes for mobile view
  const mobileStyles = `
    block md:hidden 
    ${zIndex} 
    py-4 px-2 
    ${textColor} 
    text-sm 
    ${width} 
    ${height} 
    ${className}
  `;

  return (
    <div 
      className={isDesktop ? desktopStyles : mobileStyles}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
};