/**
 * BaseText - Enhanced bilingual text component with Korean theming
 * 
 * Builds on existing KoreanText with extracted common logic
 * Provides consistent text styling across the application
 * 
 * @module components/base
 */

import { Html } from "@react-three/drei";
import React, { useMemo } from "react";
import { KOREAN_COLORS } from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";
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
}

/**
 * BaseText Component
 * 
 * Enhanced bilingual text component with Korean cyberpunk styling.
 * Uses useKoreanTheme hook for consistent text sizing and styling.
 * 
 * @example
 * ```tsx
 * <BaseText
 *   korean="공격"
 *   english="Attack"
 *   size="large"
 *   layout="vertical"
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
}) => {
  // Use Korean theme hook for consistent text sizing
  const { textSize, fontFamily } = useKoreanTheme({
    size,
    isMobile,
  });

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
  }), [layout]);

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
    <Html position={position} center>
      <div style={containerStyle} data-testid={testId ?? "base-text"}>
        <span style={koreanStyle}>{korean}</span>
        {layout === "vertical" && <span style={englishStyle}>{english}</span>}
        {layout === "horizontal" && <span style={englishStyle}>| {english}</span>}
      </div>
    </Html>
  );
};

BaseText.displayName = "BaseText";
