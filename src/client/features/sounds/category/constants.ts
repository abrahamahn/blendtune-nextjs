// src/client/features/sounds/category/constants.ts

/**
 * Constants for the category feature
 * Contains default values and configuration
 * 
 * @module sounds/category/constants
 */
import { GenreItem } from './types';

/**
 * Default genre items available for selection
 * First item "All" is used to reset category filters
 */
export const DEFAULT_GENRES: GenreItem[] = [
  { id: "all", name: "All" },
  { id: "pop", name: "Pop" },
  { id: "hiphop", name: "Hiphop" },
  { id: "rnb", name: "R&B" },
  { id: "latin", name: "Latin" },
  { id: "afrobeat", name: "Afrobeat" },
  { id: "electronic", name: "Electronic" },
];