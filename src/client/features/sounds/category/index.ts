// src\client\features\sounds\category\index.ts

/**
 * Export all category components and hooks
 * Provides public API for the category feature
 * 
 * @module sounds/category
 */

// Export components using the components index
export { Category } from './layout';

// Export hooks using the hooks index
export { useCategorySelection } from './hooks';

// Export constants and types directly
export { DEFAULT_GENRES } from './constants';
export type { GenreItem, CategoryProps } from './types';