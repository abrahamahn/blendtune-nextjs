// main/client/ui/src/theme/modes.ts
/**
 * Density and high-contrast theme modes.
 *
 * Vendored from bslt's @bslt/client-engine theme helpers (density.ts + contrast.ts)
 * with the shared default constants inlined, so the UI package is self-contained.
 */

/**
 * Theme density variants for adjusting spacing across the UI.
 *
 * - `compact`: Tighter spacing (0.75x), ideal for data-dense interfaces
 * - `normal`: Default spacing (1x), balanced for most use cases
 * - `comfortable`: Looser spacing (1.25x), more breathing room
 */
export type Density = 'compact' | 'normal' | 'comfortable';

/** Multipliers for each density level */
export const densityMultipliers = {
  compact: 0.75,
  normal: 1,
  comfortable: 1.25,
} as const;

export const DEFAULT_DENSITY: Density = 'normal';

/** Base spacing values in rem */
const baseSpacing = {
  xs: 0.25, // 4px
  sm: 0.5, // 8px
  md: 0.75, // 12px
  lg: 1, // 16px
  xl: 1.5, // 24px
  ['2xl']: 2, // 32px
  ['3xl']: 3, // 48px
} as const;

/**
 * Generate spacing values for a given density
 */
export function getSpacingForDensity(density: Density): Record<keyof typeof baseSpacing, string> {
  const multiplier = densityMultipliers[density];
  const entries = Object.entries(baseSpacing) as [keyof typeof baseSpacing, number][];

  return Object.fromEntries(
    entries.map(([key, value]) => [
      key,
      `${(value * multiplier).toFixed(3).replace(/\.?0+$/, '')}rem`,
    ]),
  ) as Record<keyof typeof baseSpacing, string>;
}

/**
 * Generate CSS custom properties for density-scaled spacing
 */
export function getDensityCssVariables(density: Density): Record<string, string> {
  const spacing = getSpacingForDensity(density);

  return {
    ['--ui-gap-xs']: spacing.xs,
    ['--ui-gap-sm']: spacing.sm,
    ['--ui-gap-md']: spacing.md,
    ['--ui-gap-lg']: spacing.lg,
    ['--ui-gap-xl']: spacing.xl,
    ['--ui-gap-2xl']: spacing['2xl'],
    ['--ui-gap-3xl']: spacing['3xl'],
  };
}

/**
 * High-contrast mode support for accessibility.
 *
 * Provides increased contrast ratios for users who need enhanced visual distinction.
 * Supports system preference detection via `prefers-contrast: more` media query.
 */
export type ContrastMode = 'system' | 'normal' | 'high';

export const DEFAULT_CONTRAST_MODE: ContrastMode = 'system';

/**
 * High-contrast color overrides for light theme.
 * Increases contrast ratios while maintaining color semantics.
 */
export const highContrastLightOverrides = {
  // Text: maximum contrast
  ['--ui-color-text']: '#000000',
  ['--ui-color-text-muted']: '#1a1a1a',

  // Backgrounds: pure white
  ['--ui-color-bg']: '#ffffff',
  ['--ui-color-surface']: '#ffffff',

  // Borders: darker for visibility
  ['--ui-color-border']: '#000000',
  ['--ui-layout-border']: '2px solid #000000',

  // Core colors: more saturated
  ['--ui-color-primary']: '#0040c0',
  ['--ui-color-danger']: '#c00000',
  ['--ui-color-success']: '#006000',
  ['--ui-color-warning']: '#a06000',
  ['--ui-color-muted']: '#333333',

  // Focus: stronger outline
  ['--ui-focus']: '0 0 0 3px #000000',
  ['--ui-outline-width']: '3px',
} as const;

/**
 * High-contrast color overrides for dark theme.
 * Increases contrast ratios while maintaining color semantics.
 */
export const highContrastDarkOverrides = {
  // Text: maximum contrast
  ['--ui-color-text']: '#ffffff',
  ['--ui-color-text-muted']: '#e6e6e6',

  // Backgrounds: pure black
  ['--ui-color-bg']: '#000000',
  ['--ui-color-surface']: '#0a0a0a',

  // Borders: lighter for visibility
  ['--ui-color-border']: '#ffffff',
  ['--ui-layout-border']: '2px solid #ffffff',

  // Core colors: brighter for dark bg
  ['--ui-color-primary']: '#6699ff',
  ['--ui-color-danger']: '#ff6666',
  ['--ui-color-success']: '#66ff66',
  ['--ui-color-warning']: '#ffcc00',
  ['--ui-color-muted']: '#cccccc',

  // Focus: stronger outline
  ['--ui-focus']: '0 0 0 3px #ffffff',
  ['--ui-outline-width']: '3px',
} as const;

/**
 * Get CSS variable overrides for high-contrast mode based on current theme.
 */
export function getContrastCssVariables(
  contrastMode: ContrastMode,
  resolvedTheme: 'light' | 'dark',
  prefersHighContrast: boolean,
): Record<string, string> | null {
  // Determine if high contrast should be applied
  const shouldApplyHighContrast =
    contrastMode === 'high' || (contrastMode === 'system' && prefersHighContrast);

  if (!shouldApplyHighContrast) {
    return null;
  }

  return resolvedTheme === 'dark'
    ? { ...highContrastDarkOverrides }
    : { ...highContrastLightOverrides };
}
