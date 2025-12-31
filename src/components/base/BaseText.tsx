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
import { KOREAN_COLORS, UI_DIMENSIONS } from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";
import { applyHtmlOverlayStyles, calculateDistanceFactor } from "../../utils/htmlOverlayHelpers";
import type { HtmlOverlayLayer } from "../../types/HtmlOverlayTypes";
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
}

/**
 * BaseText Component
 * 
 * Enhanced bilingual text component with Korean cyberpunk styling.
 * Uses useKoreanTheme hook for consistent text sizing and styling.
 * Now includes Html overlay positioning helpers for proper z-index and performance.
 * 
 * @example
 * ```tsx
 * <BaseText
 *   korean="공격"
 *   english="Attack"
 *   size="large"
 *   layout="vertical"
 *   layer="hud"
 * />
 * ```
 */
export const BaseText: React.FC<BaseTextProps> = ({
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
}) => {
  // Use Korean theme hook for consistent text sizing
  const { textSize, fontFamily } = useKoreanTheme({
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

  // Memoize text styles for performance
  const textStyle = useMemo<React.CSSProperties>(() => ({
    color: hexToRgbaString(color),
    fontFamily: fontFamily.KOREAN,
    textAlign: align,
    fontWeight: weight === "bold" ? "bold" : "normal",
    textShadow: `0 2px 4px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.5)}`,
    userSelect: "none",
    WebkitUserSelect: "none",
  }), [color, align, weight, fontFamily]);

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
      <div style={containerStyle} data-testid={testId ?? "base-text"}>
        <span style={koreanStyle}>{korean}</span>
        {layout === "vertical" && <span style={englishStyle}>{english}</span>}
        {layout === "horizontal" && <span style={englishStyle}>| {english}</span>}
      </div>
    </Html>
  );
};

BaseText.displayName = "BaseText";
