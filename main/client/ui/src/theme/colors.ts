// main/client/ui/src/theme/colors.ts
/**
 * Theme color tokens — refined neutral palette with a single indigo accent.
 *
 * Single source of truth for every color used in the UI design system.
 * Colors are organized into semantic groups (core, background, border,
 * text, control, effect, alert, badge) with light and dark variants.
 * The system favours calm near-neutral surfaces, one confident accent,
 * and soft layered elevation for a premium, minimal feel.
 *
 * Consumed by {@link buildThemeCss} to generate CSS custom properties
 * and by the ThemeProvider at runtime.
 */

/** Core semantic colors for the light theme (brand, status, accent). */
const coreLight = {
  primary: '#4f46e5',
  accent: '#4f46e5',
  primaryMuted: '#e0e7ff',
  danger: '#dc2626',
  success: '#16a34a',
  warning: '#d97706',
  neutral: '#18181b',
  muted: '#6b7280',
} as const;

/** Core semantic colors for the dark theme (brand, status, accent). */
const coreDark = {
  primary: '#818cf8',
  accent: '#818cf8',
  primaryMuted: '#312e54',
  danger: '#f87171',
  success: '#4ade80',
  warning: '#fbbf24',
  neutral: '#f4f4f5',
  muted: '#a1a1aa',
} as const;

/** Background and surface colors for the light theme. */
const backgroundLight = {
  bg: '#ffffff',
  surface: '#f7f8fa',
  surfaceStrong: '#18181b',
} as const;

/** Background and surface colors for the dark theme. */
const backgroundDark = {
  bg: '#0c0d10',
  surface: '#16181d',
  surfaceStrong: '#000000',
} as const;

/** Border colors for the light theme. */
const borderLight = {
  border: '#e6e7eb',
} as const;

/** Border colors for the dark theme. */
const borderDark = {
  border: '#26282e',
} as const;

/** Text colors for the light theme (primary, muted, inverse). */
const textLight = {
  text: '#18181b',
  textMuted: '#6b7280',
  textInverse: '#fafafa',
} as const;

/** Text colors for the dark theme (primary, muted, inverse). */
const textDark = {
  text: '#f4f4f5',
  textMuted: '#a1a1aa',
  textInverse: '#18181b',
} as const;

/** Control colors for the light theme (switch thumbs, slider handles, etc.). */
const controlLight = {
  controlThumb: '#ffffff',
} as const;

/** Control colors for the dark theme (switch thumbs, slider handles, etc.). */
const controlDark = {
  controlThumb: '#f4f4f5',
} as const;

/**
 * Effect colors for the light theme (box shadows, focus ring outlines).
 *
 * `shadow` is the subtle, resting elevation used by cards and panels.
 * `shadowOverlay` is the stronger, floating elevation used by transient
 * surfaces that sit above the page (dropdowns, popovers, dialogs, toasts).
 */
const effectLight = {
  shadow: '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.08)',
  shadowOverlay: '0 4px 12px rgba(16, 24, 40, 0.1), 0 12px 32px rgba(16, 24, 40, 0.12)',
  focus: '0 0 0 2px rgba(79, 70, 229, 0.35)',
} as const;

/** Effect colors for the dark theme (box shadows, focus ring outlines). */
const effectDark = {
  shadow: '0 1px 2px rgba(0, 0, 0, 0.4), 0 4px 12px rgba(0, 0, 0, 0.35)',
  shadowOverlay: '0 6px 16px rgba(0, 0, 0, 0.5), 0 16px 40px rgba(0, 0, 0, 0.45)',
  focus: '0 0 0 2px rgba(129, 140, 248, 0.45)',
} as const;

/** Alert semantic colors for the light theme (info, success, danger, warning). */
const alertLight = {
  info: {
    bg: '#eef2ff',
    border: '#c7d2fe',
    text: '#3730a3',
  },
  success: {
    bg: '#ecfdf3',
    border: '#abefc6',
    text: '#067647',
  },
  danger: {
    bg: '#fef3f2',
    border: '#fecdca',
    text: '#b42318',
  },
  warning: {
    bg: '#fffaeb',
    border: '#fedf89',
    text: '#b54708',
  },
} as const;

/** Alert semantic colors for the dark theme (info, success, danger, warning). */
const alertDark = {
  info: {
    bg: '#1e1b4b',
    border: '#6366f1',
    text: '#c7d2fe',
  },
  success: {
    bg: '#0a2e1c',
    border: '#2f6f4a',
    text: '#bbf7d0',
  },
  danger: {
    bg: '#3b1414',
    border: '#b45454',
    text: '#fecaca',
  },
  warning: {
    bg: '#3a2e0a',
    border: '#b8902a',
    text: '#fde68a',
  },
} as const;

/** Badge semantic colors for the light theme (primary, success, danger, warning, neutral). */
const badgeLight = {
  primary: {
    bg: '#eef2ff',
    border: '#c7d2fe',
  },
  success: {
    bg: '#ecfdf3',
    border: '#abefc6',
  },
  danger: {
    bg: '#fef3f2',
    border: '#fecdca',
  },
  warning: {
    bg: '#fffaeb',
    border: '#fedf89',
  },
  neutral: {
    bg: '#f7f8fa',
    border: '#e6e7eb',
  },
} as const;

/** Badge semantic colors for the dark theme (primary, success, danger, warning, neutral). */
const badgeDark = {
  primary: {
    bg: '#312e54',
    border: '#6366f1',
  },
  success: {
    bg: '#0a2e1c',
    border: '#2f6f4a',
  },
  danger: {
    bg: '#3b1414',
    border: '#b45454',
  },
  warning: {
    bg: '#3a2e0a',
    border: '#b8902a',
  },
  neutral: {
    bg: '#26282e',
    border: '#3f424a',
  },
} as const;

/** Complete light theme color set, composed from all semantic groups. */
export const lightColors = {
  ...coreLight,
  ...backgroundLight,
  ...borderLight,
  ...textLight,
  ...controlLight,
  ...effectLight,
  alert: alertLight,
  badge: badgeLight,
} as const;

/** Complete dark theme color set, composed from all semantic groups. */
export const darkColors = {
  ...coreDark,
  ...backgroundDark,
  ...borderDark,
  ...textDark,
  ...controlDark,
  ...effectDark,
  alert: alertDark,
  badge: badgeDark,
} as const;

/** Top-level color map containing both light and dark theme variants. */
export const colors = {
  light: lightColors,
  dark: darkColors,
} as const;

/** Inferred type of the complete light color set. */
export type LightColors = typeof lightColors;
/** Inferred type of the complete dark color set. */
export type DarkColors = typeof darkColors;
/** Inferred type of the combined color map with both variants. */
export type ThemeColors = typeof colors;
