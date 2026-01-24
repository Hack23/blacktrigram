/**
 * Design System for Black Trigram HUD Components
 * 
 * Provides a unified visual language for cyberpunk Korean-themed interfaces
 * All values based on KOREAN_COLORS and FONT_FAMILY constants
 * 
 * Key Principles:
 * - 4px base spacing scale for consistent rhythm
 * - Typography scale optimized for Korean text readability
 * - WCAG AA compliant color hierarchies
 * - Consistent HUD styling with cyberpunk aesthetic
 * 
 * @korean 흑괘 HUD 디자인 시스템
 * @module DesignSystem
 */

import { KOREAN_COLORS } from './colors';
import { FONT_FAMILY } from './typography';

/**
 * Convert hex color to RGB string
 * @param hex - Hex color value (e.g., 0x00e6e6)
 * @returns RGB string (e.g., "0, 230, 230")
 */
function hexToRgbString(hex: number): string {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return `${r}, ${g}, ${b}`;
}

/**
 * Convert hex color to RGB color string
 * @param hex - Hex color value (e.g., 0x00e6e6)
 * @returns RGB color string (e.g., "rgb(0, 230, 230)")
 */
function hexToRgb(hex: number): string {
  return `rgb(${hexToRgbString(hex)})`;
}

/**
 * Typography Scale
 * 
 * Optimized for Korean text with proper line-heights and font weights.
 * All sizes include fontFamily to ensure consistent Korean rendering.
 * 
 * @korean 타이포그래피 척도
 */
export const TYPOGRAPHY = {
  /** Heading 1 - Main titles (24px) */
  heading1: {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: 1.2,
    fontFamily: FONT_FAMILY.KOREAN,
  },
  /** Heading 2 - Section titles (20px) */
  heading2: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1.3,
    fontFamily: FONT_FAMILY.KOREAN,
  },
  /** Heading 3 - Subsection titles (16px) */
  heading3: {
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily: FONT_FAMILY.KOREAN,
  },
  /** Body - Regular content (14px) */
  body: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.5,
    fontFamily: FONT_FAMILY.KOREAN,
  },
  /** Body Small - Secondary content (12px) */
  bodySmall: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.5,
    fontFamily: FONT_FAMILY.KOREAN,
  },
  /** Button - Button text (14px, semibold) */
  button: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.4,
    fontFamily: FONT_FAMILY.KOREAN,
  },
  /** Caption - Labels and hints (10px) */
  caption: {
    fontSize: '10px',
    fontWeight: 400,
    lineHeight: 1.4,
    fontFamily: FONT_FAMILY.KOREAN,
  },
  /** Micro - Very small text (9px) - for dense information */
  micro: {
    fontSize: '9px',
    fontWeight: 400,
    lineHeight: 1.4,
    fontFamily: FONT_FAMILY.KOREAN,
  },
  /** Nano - Smallest text (8px) - for status indicators */
  nano: {
    fontSize: '8px',
    fontWeight: 400,
    lineHeight: 1.3,
    fontFamily: FONT_FAMILY.KOREAN,
  },
} as const;

/**
 * Pre-parsed Numeric Typography Values
 * 
 * Performance optimization: Numeric font sizes parsed once at module load
 * instead of repeated parseInt calls in component useMemo hooks.
 * 
 * @korean 사전 파싱된 타이포그래피 숫자 값
 */
export const TYPOGRAPHY_NUMERIC = {
  heading1: 24,
  heading2: 20,
  heading3: 16,
  body: 14,
  bodySmall: 12,
  button: 14,
  caption: 10,
  micro: 9,
  nano: 8,
} as const;

/**
 * Spacing Scale (4px base)
 * 
 * Consistent spacing system for margins, padding, and gaps.
 * Based on 4px increments for visual rhythm.
 * 
 * @korean 간격 척도
 */
export const SPACING = {
  /** Extra Extra Small - 4px */
  xxs: '4px',
  /** Extra Small - 8px */
  xs: '8px',
  /** Small - 12px */
  sm: '12px',
  /** Medium - 16px */
  md: '16px',
  /** Large - 24px */
  lg: '24px',
  /** Extra Large - 32px */
  xl: '32px',
  /** Extra Extra Large - 48px */
  xxl: '48px',
} as const;

/**
 * Spacing Adjustments
 * 
 * Fine-tuned spacing values for specific layout requirements.
 * Use when standard SPACING scale doesn't provide exact needed value.
 * 
 * @korean 간격 조정
 */
export const SPACING_ADJUSTMENTS = {
  /** Extra small with minor adjustment - 10px (xs + 2px) */
  xsPlus: '10px',
  /** Small with minor adjustment - 14px (sm + 2px) */
  smPlus: '14px',
  /** Medium with minor adjustment - 18px (md + 2px) */
  mdPlus: '18px',
  /** Small gap for compact layouts - 6px */
  compact: '6px',
  /** 
   * Horizontal emphasis - 24px
   * Aliases SPACING.lg for semantic use in wider horizontal padding
   * Defined as 1.5x SPACING.md to emphasize horizontal breathing room
   */
  horizontalEmphasis: '24px',
  /** Micro gap - 3px (for very tight layouts) */
  micro: '3px',
  /** Tiny margin - 2px (for subtle spacing) */
  tiny: '2px',
} as const;

/**
 * Pre-parsed Numeric Spacing Values
 * 
 * Performance optimization: Numeric spacing values parsed once at module load.
 * Eliminates repeated parseInt calls in component calculations.
 * 
 * @korean 사전 파싱된 간격 숫자 값
 */
export const SPACING_NUMERIC = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  // Adjustments
  xsPlus: 10,
  smPlus: 14,
  mdPlus: 18,
  compact: 6,
  horizontalEmphasis: 24,
  micro: 3,
  tiny: 2,
} as const;

/**
 * Font Size Multipliers
 * 
 * Scaling factors for responsive font size calculations.
 * Used to maintain consistent proportions across different screen sizes.
 * 
 * @korean 글꼴 크기 배율
 */
export const FONT_SIZE_MULTIPLIERS = {
  /** Small title scaling - 60% of base */
  titleSmall: 0.6,
  /** Small message scaling - 75% of base */
  messageSmall: 0.75,
  /** Body small scaling - 87.5% of base */
  bodySmall: 0.875,
  /** Title large scaling - 112.5% of base */
  titleLarge: 1.125,
} as const;

/**
 * Layout Multipliers
 * 
 * Scaling factors for layout calculations.
 * Used to maintain consistent spacing relationships.
 * 
 * @korean 레이아웃 배율
 */
export const LAYOUT_MULTIPLIERS = {
  /** Gap to padding ratio - 120% */
  gapToPadding: 1.2,
} as const;



/**
 * Border Radius Scale
 * 
 * Consistent border radius values for UI elements.
 * Provides semantic naming for rounded corners.
 * 
 * @korean 테두리 반경 척도
 */
export const BORDER_RADIUS = {
  /** None - 0px (sharp corners) */
  none: '0px',
  /** Small - 4px */
  sm: '4px',
  /** Medium - 6px */
  md: '6px',
  /** Large - 8px */
  lg: '8px',
  /** Extra Large - 12px */
  xl: '12px',
  /** Full - 9999px (pill shape) */
  full: '9999px',
} as const;

/**
 * HUD Style Constants
 * 
 * Unified styling for all HUD panels with cyberpunk Korean aesthetic.
 * Includes backgrounds, borders, shadows, and interactive states.
 * 
 * @korean HUD 스타일 상수
 */
export const HUD_STYLE = {
  /** Background - Dark with 85% opacity */
  background: `rgba(${hexToRgbString(KOREAN_COLORS.UI_BACKGROUND_DARK)}, 0.85)`,
  /** Background RGB for gradient stops */
  backgroundRgb: hexToRgbString(KOREAN_COLORS.UI_BACKGROUND_DARK),
  /** Border - 2px solid cyan */
  border: `2px solid ${hexToRgb(KOREAN_COLORS.PRIMARY_CYAN)}`,
  /** Border radius - 8px for smooth corners (from BORDER_RADIUS.lg) */
  borderRadius: BORDER_RADIUS.lg,
  /** Box shadow - Subtle depth */
  shadow: `0 4px 12px rgba(${hexToRgbString(KOREAN_COLORS.UI_BACKGROUND_DARK)}, 0.6)`,
  /** Hover shadow - Increased depth on interaction */
  shadowHover: `0 6px 20px rgba(${hexToRgbString(KOREAN_COLORS.PRIMARY_CYAN)}, 0.3)`,
  /** Backdrop filter - Blur for glassmorphism */
  backdropFilter: 'blur(8px)',
  /** Accent glow - For important elements */
  accentGlow: `0 0 10px rgba(${hexToRgbString(KOREAN_COLORS.ACCENT_GOLD)}, 0.5)`,
  /** Cyan glow - For primary highlights */
  cyanGlow: `0 0 10px rgba(${hexToRgbString(KOREAN_COLORS.PRIMARY_CYAN)}, 0.5)`,
} as const;

/**
 * Color Hierarchy for Text and UI Elements
 * 
 * WCAG AA compliant color system for different levels of visual emphasis.
 * All colors formatted as RGB strings for easy opacity manipulation.
 * 
 * @korean 색상 계층
 */
export const HIERARCHY = {
  /** Primary - Main content (White - highest contrast) */
  primary: {
    color: hexToRgb(KOREAN_COLORS.TEXT_PRIMARY),
    hex: KOREAN_COLORS.TEXT_PRIMARY,
  },
  /** Secondary - Supporting content (Light gray) */
  secondary: {
    color: hexToRgb(KOREAN_COLORS.TEXT_SECONDARY),
    hex: KOREAN_COLORS.TEXT_SECONDARY,
  },
  /** Tertiary - Subtle content (Medium gray) */
  tertiary: {
    color: hexToRgb(KOREAN_COLORS.TEXT_TERTIARY),
    hex: KOREAN_COLORS.TEXT_TERTIARY,
  },
  /** Muted - Disabled or inactive (Dark gray) */
  muted: {
    color: hexToRgb(KOREAN_COLORS.UI_DISABLED_TEXT),
    hex: KOREAN_COLORS.UI_DISABLED_TEXT,
  },
  /** Accent - Emphasis and highlights (Cyan) */
  accent: {
    color: hexToRgb(KOREAN_COLORS.PRIMARY_CYAN),
    hex: KOREAN_COLORS.PRIMARY_CYAN,
  },
  /** Gold - Special emphasis (Gold) */
  gold: {
    color: hexToRgb(KOREAN_COLORS.ACCENT_GOLD),
    hex: KOREAN_COLORS.ACCENT_GOLD,
  },
  /** Accent with 70% opacity - For subtle emphasis */
  accent70: {
    color: `rgba(${hexToRgbString(KOREAN_COLORS.PRIMARY_CYAN)}, 0.7)`,
    hex: KOREAN_COLORS.PRIMARY_CYAN,
  },
  /** Accent with 50% opacity - For backgrounds */
  accent50: {
    color: `rgba(${hexToRgbString(KOREAN_COLORS.PRIMARY_CYAN)}, 0.5)`,
    hex: KOREAN_COLORS.PRIMARY_CYAN,
  },
  /** Primary with 80% opacity - For hover states */
  primary80: {
    color: `rgba(${hexToRgbString(KOREAN_COLORS.TEXT_PRIMARY)}, 0.8)`,
    hex: KOREAN_COLORS.TEXT_PRIMARY,
  },
} as const;

/**
 * Border Styles for Different UI States
 * 
 * @korean 테두리 스타일
 */
export const BORDERS = {
  /** Default border - Cyan 40% opacity */
  default: `2px solid rgba(${hexToRgbString(KOREAN_COLORS.PRIMARY_CYAN)}, 0.4)`,
  /** Accent border - Gold for emphasis */
  accent: `2px solid rgba(${hexToRgbString(KOREAN_COLORS.ACCENT_GOLD)}, 0.6)`,
  /** Muted border - Gray for subtle separation */
  muted: `1px solid rgba(${hexToRgbString(KOREAN_COLORS.UI_STEEL_GRAY)}, 0.3)`,
  /** Active border - Full cyan for interaction */
  active: `2px solid rgba(${hexToRgbString(KOREAN_COLORS.PRIMARY_CYAN)}, 1.0)`,
} as const;

/**
 * Gradient Backgrounds
 * 
 * Cyberpunk-inspired gradients for panels and overlays.
 * 
 * @korean 그라디언트 배경
 */
export const GRADIENTS = {
  /** Vertical fade - Top to bottom */
  vertical: (opacity: number = 0.85) =>
    `linear-gradient(180deg, rgba(${hexToRgbString(KOREAN_COLORS.UI_BACKGROUND_DARK)}, ${opacity}) 0%, rgba(${hexToRgbString(KOREAN_COLORS.UI_BACKGROUND_DARK)}, ${opacity * 0.7}) 100%)`,
  /** Vertical fade (reverse) - Bottom to top */
  verticalReverse: (opacity: number = 0.85) =>
    `linear-gradient(0deg, rgba(${hexToRgbString(KOREAN_COLORS.UI_BACKGROUND_DARK)}, ${opacity}) 0%, rgba(${hexToRgbString(KOREAN_COLORS.UI_BACKGROUND_DARK)}, ${opacity * 0.7}) 100%)`,
  /** Horizontal fade - Left to right */
  horizontal: (opacity: number = 0.85) =>
    `linear-gradient(90deg, rgba(${hexToRgbString(KOREAN_COLORS.UI_BACKGROUND_DARK)}, ${opacity}) 0%, rgba(${hexToRgbString(KOREAN_COLORS.UI_BACKGROUND_DARK)}, ${opacity * 0.4}) 100%)`,
  /** Horizontal fade (reverse) - Right to left */
  horizontalReverse: (opacity: number = 0.85) =>
    `linear-gradient(270deg, rgba(${hexToRgbString(KOREAN_COLORS.UI_BACKGROUND_DARK)}, ${opacity}) 0%, rgba(${hexToRgbString(KOREAN_COLORS.UI_BACKGROUND_DARK)}, ${opacity * 0.4}) 100%)`,
  /** Radial fade - Center outward */
  radial: (opacity: number = 0.85) =>
    `radial-gradient(circle, rgba(${hexToRgbString(KOREAN_COLORS.UI_BACKGROUND_DARK)}, ${opacity}) 0%, rgba(${hexToRgbString(KOREAN_COLORS.UI_BACKGROUND_DARK)}, ${opacity * 0.5}) 100%)`,
} as const;

/**
 * Transition Timings
 * 
 * Consistent animation durations for smooth interactions.
 * 
 * @korean 전환 타이밍
 */
export const TRANSITIONS = {
  /** Fast - Quick interactions (150ms) */
  fast: '150ms ease-in-out',
  /** Normal - Standard interactions (250ms) */
  normal: '250ms ease-in-out',
  /** Slow - Emphasis animations (400ms) */
  slow: '400ms ease-in-out',
} as const;

/**
 * Opacity Constants
 * 
 * Standard opacity values for consistent transparency effects.
 * 
 * @korean 투명도 상수
 */
export const OPACITY = {
  /** Base opacity for layered elements */
  base: 0.7,
  /** Opacity increment for stacking */
  increment: 0.1,
  /** High transparency */
  light: 0.3,
  /** Medium transparency */
  medium: 0.5,
  /** Low transparency */
  heavy: 0.8,
} as const;

/**
 * Combat UI Dimensions
 * 
 * Common width and size constraints for combat UI elements.
 * 
 * @korean 전투 UI 크기
 */
export const COMBAT_UI_DIMENSIONS = {
  /** Combat log minimum width - mobile */
  combatLogMinMobile: '200px',
  /** Combat log minimum width - desktop */
  combatLogMinDesktop: '280px',
  /** Combat log maximum width - mobile (percentage) */
  combatLogMaxMobile: '90%',
  /** Combat log maximum width - desktop */
  combatLogMaxDesktop: '500px',
  /** Combat log maximum width percentage (mobile) - 90% as decimal */
  combatLogMaxWidthPercentMobile: 0.9,
  /** Technique bar width - mobile (full width) */
  techniqueBarWidthMobile: '100%',
  /** Technique bar width - desktop (70% width) */
  techniqueBarWidthDesktop: '70%',
} as const;

/**
 * Pre-parsed Numeric Combat UI Dimensions
 * 
 * Performance optimization: Numeric dimension values parsed once at module load.
 * Eliminates repeated parseInt calls for combat UI dimensions.
 * 
 * @korean 사전 파싱된 전투 UI 크기 숫자 값
 */
export const COMBAT_UI_DIMENSIONS_NUMERIC = {
  combatLogMinMobile: 200,
  combatLogMinDesktop: 280,
  combatLogMaxDesktop: 500,
} as const;

/**
 * Text Effects
 * 
 * Reusable text shadow effects for emphasis and readability.
 * 
 * @korean 텍스트 효과
 */
export const TEXT_EFFECTS = {
  /** Dark shadow for contrast on bright backgrounds */
  darkShadow: '0 0 4px rgba(0,0,0,0.8)',
  /** Light glow for emphasis */
  lightGlow: '0 0 8px rgba(255,255,255,0.5)',
} as const;

/**
 * Get responsive spacing based on screen size
 * 
 * Note: This helper function uses parseInt internally for flexibility
 * in returning pixel-suffixed strings. For performance-critical useMemo
 * calculations, prefer using SPACING_NUMERIC constants directly.
 * 
 * @param baseSpacing - Base spacing value from SPACING scale
 * @param isMobile - Whether mobile layout is active
 * @param positionScale - Position scale multiplier (for 4K displays)
 * @returns Calculated spacing in pixels
 */
export function getResponsiveSpacing(
  baseSpacing: keyof typeof SPACING,
  isMobile: boolean,
  positionScale: number = 1.0
): string {
  const baseValue = parseInt(SPACING[baseSpacing], 10);
  const scaledValue = isMobile ? baseValue : baseValue * positionScale;
  return `${scaledValue}px`;
}

/**
 * Get responsive font size based on typography scale
 * 
 * Note: This helper function uses parseInt internally for flexibility
 * in returning pixel-suffixed strings. For performance-critical useMemo
 * calculations, prefer using TYPOGRAPHY_NUMERIC constants directly.
 * 
 * @param typographyLevel - Typography level from TYPOGRAPHY
 * @param isMobile - Whether mobile layout is active
 * @param positionScale - Position scale multiplier (for 4K displays)
 * @returns Calculated font size in pixels
 */
export function getResponsiveFontSize(
  typographyLevel: keyof typeof TYPOGRAPHY,
  isMobile: boolean,
  positionScale: number = 1.0
): string {
  const baseSize = parseInt(TYPOGRAPHY[typographyLevel].fontSize, 10);
  const scaledSize = isMobile ? baseSize : baseSize * positionScale;
  return `${scaledSize}px`;
}

/**
 * Type definitions for design system usage
 */
export type TypographyLevel = keyof typeof TYPOGRAPHY;
export type SpacingLevel = keyof typeof SPACING;
export type BorderRadiusLevel = keyof typeof BORDER_RADIUS;
export type HierarchyLevel = keyof typeof HIERARCHY;
