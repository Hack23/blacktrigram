/**
 * Korean Cyberpunk Theme System
 * 
 * Centralized theme configuration for Black Trigram HUD components.
 * Provides consistent colors, gradients, animations, and responsive sizing
 * across Combat and Training screens.
 * 
 * @module theme/korean-cyberpunk
 * @category UI Theme
 * @korean 한국 사이버펑크 테마
 */

import { KOREAN_COLORS, FONT_FAMILY } from "../types/constants";

/**
 * HUD component variant types
 */
export type HUDVariant = "player" | "opponent" | "training";

/**
 * Screen size breakpoints
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;

/**
 * Responsive sizing configuration
 */
export interface ResponsiveSize {
  readonly mobile: number;
  readonly tablet: number;
  readonly desktop: number;
}

/**
 * Get value based on screen width
 */
export const getResponsiveValue = (
  config: ResponsiveSize,
  width: number
): number => {
  if (width < BREAKPOINTS.mobile) return config.mobile;
  if (width < BREAKPOINTS.tablet) return config.tablet;
  return config.desktop;
};

/**
 * Health bar color gradients by health percentage
 */
export const HEALTH_GRADIENTS = {
  full: {
    start: KOREAN_COLORS.HEALTH_FULL,
    end: KOREAN_COLORS.HEALTH_MEDIUM,
    threshold: 50,
  },
  medium: {
    start: KOREAN_COLORS.HEALTH_MEDIUM,
    end: KOREAN_COLORS.HEALTH_LOW,
    threshold: 25,
  },
  critical: {
    start: KOREAN_COLORS.HEALTH_CRITICAL,
    end: KOREAN_COLORS.NEGATIVE_RED_DARK,
    threshold: 0,
  },
} as const;

/**
 * Get health bar gradient colors based on percentage
 */
export const getHealthGradient = (
  percentage: number
): { start: number; end: number } => {
  if (percentage > 50) return HEALTH_GRADIENTS.full;
  if (percentage > 25) return HEALTH_GRADIENTS.medium;
  return HEALTH_GRADIENTS.critical;
};

/**
 * Stamina bar gradient configuration
 */
export const STAMINA_GRADIENT = {
  start: KOREAN_COLORS.ACCENT_BLUE,
  end: KOREAN_COLORS.PRIMARY_CYAN,
} as const;

/**
 * Technique bar variant colors
 */
export const TECHNIQUE_VARIANT_COLORS = {
  player: {
    border: KOREAN_COLORS.PRIMARY_CYAN,
    glow: KOREAN_COLORS.PRIMARY_CYAN,
    text: KOREAN_COLORS.TEXT_PRIMARY,
  },
  opponent: {
    border: KOREAN_COLORS.ACCENT_RED,
    glow: KOREAN_COLORS.ACCENT_RED,
    text: KOREAN_COLORS.TEXT_PRIMARY,
  },
  training: {
    border: KOREAN_COLORS.ACCENT_GOLD,
    glow: KOREAN_COLORS.ACCENT_GOLD,
    text: KOREAN_COLORS.TEXT_PRIMARY,
  },
} as const;

/**
 * HUD variant colors for borders and glows
 */
export const HUD_VARIANT_COLORS = {
  player: {
    border: KOREAN_COLORS.PRIMARY_CYAN,
    glow: KOREAN_COLORS.PRIMARY_CYAN,
    background: KOREAN_COLORS.UI_BACKGROUND_DARK,
  },
  opponent: {
    border: KOREAN_COLORS.ACCENT_RED,
    glow: KOREAN_COLORS.ACCENT_RED,
    background: KOREAN_COLORS.UI_BACKGROUND_DARK,
  },
  training: {
    border: KOREAN_COLORS.ACCENT_GOLD,
    glow: KOREAN_COLORS.ACCENT_GOLD,
    background: KOREAN_COLORS.UI_BACKGROUND_DARK,
  },
} as const;

/**
 * Get variant colors for HUD component
 */
export const getVariantColors = (variant: HUDVariant) => {
  return HUD_VARIANT_COLORS[variant];
};

/**
 * Health bar sizing configuration
 */
export const HEALTH_BAR_SIZES = {
  width: { mobile: 180, tablet: 220, desktop: 250 } as ResponsiveSize,
  height: { mobile: 16, tablet: 18, desktop: 20 } as ResponsiveSize,
  fontSize: { mobile: 11, tablet: 12, desktop: 13 } as ResponsiveSize,
  padding: { mobile: 8, tablet: 10, desktop: 12 } as ResponsiveSize,
  segments: 10,
} as const;

/**
 * Stamina bar sizing configuration
 */
export const STAMINA_BAR_SIZES = {
  width: { mobile: 180, tablet: 220, desktop: 250 } as ResponsiveSize,
  height: { mobile: 10, tablet: 11, desktop: 12 } as ResponsiveSize,
  fontSize: { mobile: 10, tablet: 11, desktop: 11 } as ResponsiveSize,
  padding: { mobile: 6, tablet: 7, desktop: 8 } as ResponsiveSize,
  segments: 5,
} as const;

/**
 * Technique bar sizing configuration
 */
export const TECHNIQUE_BAR_SIZES = {
  cardWidth: { mobile: 70, tablet: 80, desktop: 90 } as ResponsiveSize,
  cardHeight: { mobile: 80, tablet: 90, desktop: 100 } as ResponsiveSize,
  gap: { mobile: 8, tablet: 10, desktop: 12 } as ResponsiveSize,
  fontSize: { mobile: 10, tablet: 11, desktop: 12 } as ResponsiveSize,
  iconSize: { mobile: 24, tablet: 28, desktop: 32 } as ResponsiveSize,
} as const;

/**
 * Status indicator sizing configuration
 */
export const STATUS_INDICATOR_SIZES = {
  width: { mobile: 40, tablet: 50, desktop: 60 } as ResponsiveSize,
  height: { mobile: 40, tablet: 50, desktop: 60 } as ResponsiveSize,
  fontSize: { mobile: 14, tablet: 16, desktop: 18 } as ResponsiveSize,
  iconSize: { mobile: 20, tablet: 24, desktop: 28 } as ResponsiveSize,
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATIONS = {
  barTransition: 200,
  pulseSpeed: 800,
  fadeIn: 300,
  fadeOut: 300,
} as const;

/**
 * CSS animations for HUD components
 */
export const CSS_ANIMATIONS = {
  healthPulse: `
    @keyframes healthPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `,
  staminaPulse: `
    @keyframes staminaPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `,
  glow: `
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 8px currentColor; }
      50% { box-shadow: 0 0 16px currentColor; }
    }
  `,
} as const;

/**
 * Typography configuration for HUD
 */
export const HUD_TYPOGRAPHY = {
  fontFamily: FONT_FAMILY.KOREAN,
  fontWeights: {
    light: 400,
    normal: 500,
    bold: 700,
  },
} as const;

/**
 * Border radius values
 */
export const BORDER_RADIUS = {
  small: "4px",
  medium: "8px",
  large: "12px",
  pill: "9999px",
} as const;

/**
 * Z-index layers for HUD elements
 */
export const Z_INDEX = {
  background: 0,
  content: 10,
  hud: 100,
  overlay: 200,
  modal: 300,
  tooltip: 400,
} as const;

/**
 * Opacity values
 */
export const OPACITY = {
  disabled: 0.4,
  dimmed: 0.6,
  normal: 0.85,
  full: 1.0,
} as const;

/**
 * Shadow configurations
 */
export const SHADOWS = {
  small: "0 2px 8px rgba(0, 0, 0, 0.3)",
  medium: "0 4px 16px rgba(0, 0, 0, 0.4)",
  large: "0 8px 24px rgba(0, 0, 0, 0.5)",
  glow: (color: string, intensity: number = 0.2) =>
    `0 0 ${10 * intensity}px ${color}`,
} as const;

/**
 * Spacing scale
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;
