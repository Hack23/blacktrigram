/**
 * BaseText - Enhanced bilingual text component with Korean theming
 * 
 * Builds on existing KoreanText with extracted common logic
 * Provides consistent text styling across the application
 * 
 * Now with Html overlay positioning helpers for:
 * - Consistent z-index management
 * - Performance optimization with distanceFactor
 * - GPU acceleration
 * 
 * @module components/base
 */

import { Html } from "@react-three/drei";
import React, { useMemo, useState, useEffect } from "react";
import { KOREAN_COLORS, UI_DIMENSIONS } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { applyHtmlOverlayStyles, calculateDistanceFactor } from "../../../utils/htmlOverlayHelpers";
import type { HtmlOverlayLayer } from "../../../types/HtmlOverlayTypes";
import { useKoreanTheme } from "./useKoreanTheme";

/**
 * Props for BaseText component
 */
export interface BaseTextProps {
  readonly korean: string;
  readonly english: string;
  readonly position?: [number, number, number];
  readonly size?: "small" | "medium" | "large" | "xlarge";
  readonly color?: number;
  readonly align?: "left" | "center" | "right";
  readonly weight?: "normal" | "bold";
  readonly layout?: "vertical" | "horizontal";
  readonly testId?: string;
  readonly isMobile?: boolean;
  /** Html overlay layer for z-index (default: 'hud') */
  readonly layer?: HtmlOverlayLayer;
  /** Whether text should occlude behind 3D objects (default: false) */
  readonly occlude?: boolean;
  /** ARIA label for accessibility (optional) */
  readonly ariaLabel?: string;
  /** ARIA live region for dynamic content (optional) */
  readonly ariaLive?: "polite" | "assertive" | "off";
}

/**
 * BaseText Component
 * 
 * Enhanced bilingual text component with Korean cyberpunk styling.
 * Uses useKoreanTheme hook for consistent text sizing and styling.
 * Now includes Html overlay positioning helpers for proper z-index and performance.
 * 
 * Korean Typography Features:
 * - Optimized line height (1.6) for Korean character readability
 * - Letter spacing (-0.01em) for tighter Korean text
 * - Word break (keep-all) to prevent breaking Korean words mid-syllable
 * - Proper language attributes (lang="ko" / lang="en")
 * 
 * WCAG 2.1 AA Accessibility Features:
 * - Proper language attributes for screen readers
 * - Optional ARIA labels for additional context
 * - ARIA live regions for dynamic content
 * 
 * Optimized with React.memo for performance
 * 
 * @example
 * ```tsx
 * <BaseText
 *   korean="공격"
 *   english="Attack"
 *   size="large"
 *   layout="vertical"
 *   layer="hud"
 *   ariaLive="polite"
 * />
 * ```
 */
const BaseTextComponent: React.FC<BaseTextProps> = ({
  korean,
  english,
  position = [0, 0, 0],
  size = "medium",
  color = KOREAN_COLORS.TEXT_PRIMARY,
  align = "center",
  weight = "normal",
  layout = "vertical",
  testId,
  isMobile = false,
  layer = "hud",
  occlude = false,
  ariaLabel,
  ariaLive = "off",
}) => {
  // Use Korean theme hook for consistent text sizing
  const { textSize, koreanTypography } = useKoreanTheme({
    size,
    isMobile,
  });

  // Track screen width for responsive distance factor updates on resize
  const [screenWidth, setScreenWidth] = useState(() => 
    typeof window !== "undefined" ? window.innerWidth : UI_DIMENSIONS.DEFAULT_SCREEN_WIDTH
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate optimal distance factor for text
  const distanceFactor = useMemo(() => {
    return calculateDistanceFactor(screenWidth, "text", isMobile);
  }, [screenWidth, isMobile]);

  // Apply Html overlay styles with proper z-index
  const overlayStyle = useMemo(() => {
    return applyHtmlOverlayStyles(layer, false, distanceFactor, true, occlude);
  }, [layer, distanceFactor, occlude]);

  // Memoize text styles for performance with Korean typography optimization
  const textStyle = useMemo<React.CSSProperties>(() => ({
    color: hexToRgbaString(color),
    fontFamily: koreanTypography.fontFamily,
    textAlign: align,
    fontWeight: weight === "bold" ? "bold" : "normal",
    textShadow: `0 2px 4px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.5)}`,
    userSelect: "none",
    WebkitUserSelect: "none",
    // Korean typography optimization
    lineHeight: koreanTypography.lineHeight,
    letterSpacing: koreanTypography.letterSpacing,
    wordBreak: koreanTypography.wordBreak,
    wordWrap: koreanTypography.wordWrap,
  }), [color, align, weight, koreanTypography]);

  const containerStyle = useMemo<React.CSSProperties>(() => ({
    display: "flex",
    flexDirection: layout === "vertical" ? "column" : "row",
    alignItems: "center",
    gap: layout === "vertical" ? "4px" : "8px",
    // Apply GPU acceleration from overlay style
    transform: overlayStyle.transform,
    pointerEvents: overlayStyle.pointerEvents,
    zIndex: overlayStyle.zIndex,
  }), [layout, overlayStyle]);

  const koreanStyle = useMemo<React.CSSProperties>(() => ({
    ...textStyle,
    fontSize: textSize.korean,
  }), [textStyle, textSize.korean]);

  const englishStyle = useMemo<React.CSSProperties>(() => ({
    ...textStyle,
    fontSize: textSize.english,
    opacity: 0.8,
    fontStyle: "italic",
  }), [textStyle, textSize.english]);

  return (
    <Html 
      position={position} 
      center={overlayStyle.center}
      distanceFactor={overlayStyle.distanceFactor}
      occlude={overlayStyle.occlude}
      style={{ pointerEvents: overlayStyle.pointerEvents }}
    >
      <div 
        style={containerStyle} 
        data-testid={testId ?? "base-text"}
        aria-label={ariaLabel}
        aria-live={ariaLive}
      >
        <span lang="ko" style={koreanStyle}>{korean}</span>
        {layout === "vertical" && <span lang="en" style={englishStyle}>{english}</span>}
        {layout === "horizontal" && <span lang="en" style={englishStyle}>| {english}</span>}
      </div>
    </Html>
  );
};

// Export memoized component for performance optimization
export const BaseText = React.memo(BaseTextComponent);

BaseText.displayName = "BaseText";
