/**
 * useKoreanTheme - Custom hook for Korean cyberpunk theming
 * 
 * Provides centralized Korean theme styling and responsive utilities
 * Eliminates code duplication across UI components
 * 
 * Enhanced with:
 * - Korean typography optimization (line height, letter spacing, word break)
 * - Accessibility features (focus indicators, touch targets, high contrast)
 * - WCAG 2.1 AA compliant color contrast ratios
 * 
 * @module components/base
 */

import { useMemo } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";

/**
 * Button variant configuration
 */
export interface ButtonVariantConfig {
  readonly background: number;
  readonly border: number;
  readonly text: number;
  readonly hoverBg: string;
  readonly activeBg: string;
}

/**
 * Panel variant configuration
 */
export interface PanelVariantConfig {
  readonly background: string;
  readonly border: string;
  readonly boxShadow: string;
}

/**
 * Size dimension configuration
 */
export interface SizeDimensions {
  readonly padding: string;
  readonly fontSize: string;
  readonly borderWidth: string;
}

/**
 * Text size configuration
 */
export interface TextSizeConfig {
  readonly korean: string;
  readonly english: string;
}

/**
 * Korean typography configuration
 */
export interface KoreanTypographyConfig {
  readonly fontFamily: string;
  readonly lineHeight: number;
  readonly letterSpacing: string;
  readonly wordBreak: "normal" | "break-all" | "keep-all" | "break-word";
  readonly wordWrap: "normal" | "break-word";
}

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  readonly focusOutline: string;
  readonly focusOutlineOffset: string;
  readonly minTouchTarget: string;
  readonly highContrastFocusOutline: string;
}

/**
 * Korean theme hook configuration
 */
export interface UseKoreanThemeConfig {
  readonly variant?: "primary" | "secondary" | "danger" | "default" | "bordered" | "elevated";
  readonly size?: "sm" | "md" | "lg" | "small" | "medium" | "large" | "xlarge";
  readonly disabled?: boolean;
  readonly isMobile?: boolean;
  readonly highContrast?: boolean;
}

/**
 * Custom hook for Korean cyberpunk theming
 * 
 * Provides consistent styling patterns for all Korean-themed components
 * Enhanced with Korean typography optimization and accessibility features
 * 
 * @example
 * ```tsx
 * const { buttonVariant, sizeDimensions, koreanTypography } = useKoreanTheme({
 *   variant: "primary",
 *   size: "md"
 * });
 * ```
 */
export function useKoreanTheme(config: UseKoreanThemeConfig = {}) {
  const {
    variant = "primary",
    size = "md",
    disabled = false,
    isMobile = false,
    highContrast = false,
  } = config;

  /**
   * Get button variant colors
   */
  const buttonVariant = useMemo<ButtonVariantConfig>(() => {
    switch (variant) {
      case "primary":
        return {
          background: KOREAN_COLORS.UI_BACKGROUND_DARK,
          border: KOREAN_COLORS.PRIMARY_CYAN,
          text: KOREAN_COLORS.ACCENT_GOLD,
          hoverBg: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.1),
          activeBg: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.2),
        };
      case "secondary":
        return {
          background: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
          border: KOREAN_COLORS.ACCENT_GOLD,
          text: KOREAN_COLORS.TEXT_PRIMARY,
          hoverBg: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.1),
          activeBg: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.2),
        };
      case "danger":
        return {
          background: KOREAN_COLORS.UI_BACKGROUND_DARK,
          border: KOREAN_COLORS.ACCENT_RED,
          text: KOREAN_COLORS.ACCENT_RED,
          hoverBg: hexToRgbaString(KOREAN_COLORS.ACCENT_RED, 0.1),
          activeBg: hexToRgbaString(KOREAN_COLORS.ACCENT_RED, 0.2),
        };
      default:
        return {
          background: KOREAN_COLORS.UI_BACKGROUND_DARK,
          border: KOREAN_COLORS.PRIMARY_CYAN,
          text: KOREAN_COLORS.ACCENT_GOLD,
          hoverBg: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.1),
          activeBg: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.2),
        };
    }
  }, [variant]);

  /**
   * Get panel variant styling
   */
  const panelVariant = useMemo<PanelVariantConfig>(() => {
    switch (variant) {
      case "bordered":
        return {
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
          border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)}`,
          boxShadow: `0 0 15px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3)}`,
        };
      case "elevated":
        return {
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.9),
          border: `1px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.5)}`,
          boxShadow: `
            0 4px 12px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.5)},
            0 0 20px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.2)}
          `,
        };
      case "default":
      default:
        return {
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.85),
          border: `1px solid ${hexToRgbaString(KOREAN_COLORS.UI_BORDER, 0.5)}`,
          boxShadow: "none",
        };
    }
  }, [variant]);

  /**
   * Get size dimensions for buttons with touch-optimized mobile values
   * Mobile: 48px+ minimum touch targets with 16px+ Korean font
   */
  const buttonSize = useMemo<SizeDimensions>(() => {
    const scale = isMobile ? 1.0 : 1.0; // Keep full size on mobile for 48px+ targets
    
    switch (size) {
      case "sm":
      case "small":
        return {
          padding: `${Math.round(8 * scale)}px ${Math.round(16 * scale)}px`,
          fontSize: isMobile ? "14px" : `${Math.round(14 * scale)}px`, // Maintain readable size
          borderWidth: "1px",
        };
      case "lg":
      case "large":
        return {
          padding: `${Math.round(16 * scale)}px ${Math.round(32 * scale)}px`,
          fontSize: isMobile ? "18px" : `${Math.round(20 * scale)}px`, // 18px minimum for Korean
          borderWidth: "3px",
        };
      case "md":
      case "medium":
      default:
        return {
          padding: `${Math.round(12 * scale)}px ${Math.round(24 * scale)}px`,
          fontSize: isMobile ? "16px" : `${Math.round(16 * scale)}px`, // 16px minimum for Korean
          borderWidth: "2px",
        };
    }
  }, [size, isMobile]);

  /**
   * Get text size configuration
   */
  const textSize = useMemo<TextSizeConfig>(() => {
    const scale = isMobile ? 0.9 : 1.0;
    
    switch (size) {
      case "small":
        return {
          korean: `${Math.round(14 * scale)}px`,
          english: `${Math.round(12 * scale)}px`,
        };
      case "large":
        return {
          korean: `${Math.round(24 * scale)}px`,
          english: `${Math.round(18 * scale)}px`,
        };
      case "xlarge":
        return {
          korean: `${Math.round(32 * scale)}px`,
          english: `${Math.round(24 * scale)}px`,
        };
      case "medium":
      default:
        return {
          korean: `${Math.round(18 * scale)}px`,
          english: `${Math.round(14 * scale)}px`,
        };
    }
  }, [size, isMobile]);

  /**
   * Calculate responsive size
   */
  const calculateResponsiveSize = useMemo(() => {
    return (baseSize: number) => {
      return isMobile ? Math.round(baseSize * 0.8) : baseSize;
    };
  }, [isMobile]);

  /**
   * Apply Korean theme to base styles
   */
  const applyKoreanTheme = useMemo(() => {
    return (baseStyle: React.CSSProperties): React.CSSProperties => {
      return {
        ...baseStyle,
        fontFamily: FONT_FAMILY.KOREAN,
        color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY),
        opacity: disabled ? 0.5 : 1,
      };
    };
  }, [disabled]);

  /**
   * Korean typography configuration
   * Optimized for Korean character readability
   * 
   * - Line height: 1.6 for Korean characters (vs 1.5 for Latin)
   * - Letter spacing: -0.01em for tighter Korean spacing
   * - Word break: keep-all to prevent breaking Korean words
   * - Word wrap: break-word for long words
   */
  const koreanTypography = useMemo<KoreanTypographyConfig>(() => ({
    fontFamily: FONT_FAMILY.KOREAN,
    lineHeight: 1.6, // Optimal for Korean character readability
    letterSpacing: "-0.01em", // Tighter spacing for Korean
    wordBreak: "keep-all", // Prevent breaking Korean words mid-syllable
    wordWrap: "break-word", // Wrap long words appropriately
  }), []);

  /**
   * Accessibility configuration
   * WCAG 2.1 AA compliant focus indicators and touch targets
   */
  const accessibility = useMemo<AccessibilityConfig>(() => ({
    focusOutline: highContrast
      ? `4px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD)}` // High contrast mode
      : `3px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN)}`, // Normal mode
    focusOutlineOffset: "2px",
    minTouchTarget: "44px", // WCAG 2.1 AA minimum touch target size
    highContrastFocusOutline: `4px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD)}`,
  }), [highContrast]);

  return {
    buttonVariant,
    panelVariant,
    buttonSize,
    textSize,
    calculateResponsiveSize,
    applyKoreanTheme,
    koreanTypography,
    accessibility,
    colors: KOREAN_COLORS,
    fontFamily: FONT_FAMILY,
  };
}
