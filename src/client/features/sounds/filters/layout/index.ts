// src\client\features\sounds\filters\layout\index.ts
/**
 * Export filter layout components
 * Provides both named exports and a default export with both components
 * 
 * @module filters/layout
 */

import DesktopFilter from './DesktopFilter';
import MobileFilter from './MobileFilter';

// Named exports
export { DesktopFilter, MobileFilter };

// Default export that includes both components
const SoundFilterLayouts = {
  Desktop: DesktopFilter,
  Mobile: MobileFilter
};

export default SoundFilterLayouts;