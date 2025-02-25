// src/client/features/sounds/category/types.ts

/**
 * Type definitions for the category feature
 * Defines interfaces and types used across category components
 * 
 * @module sounds/category/types
 */

/**
 * Genre item configuration
 * @interface GenreItem
 */
export interface GenreItem {
    id: string;
    name: string;
}
  
/**
 * Props for the Category component
 * @interface CategoryProps
 */
export interface CategoryProps {
    className?: string;
    genres?: GenreItem[];
}