/**
 * KoreanText - Three.js-compatible text component with bilingual support
 * 
 * Displays Korean and English text with cyberpunk styling
 * 
 * @module components/three
 */

import { Html } from "@react-three/drei";
import React, { useMemo } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";

/**
 * Props for KoreanText component
 */
export interface KoreanTextProps {
  readonly korean: string;
  readonly english: string;
  readonly position?: [number, number, number];
  readonly size?: "small" | "medium" | "large" | "xlarge";
  readonly color?: number;
  readonly align?: "left" | "center" | "right";
  readonly weight?: "normal" | "bold";
  readonly layout?: "vertical" | "horizontal";
  readonly testId?: string;
}

/**
 * KoreanText Component
 * 
 * A bilingual text component with Korean cyberpunk styling.
 * Supports both vertical (stacked) and horizontal (inline) layouts.
 * 
 * @example
 * ```tsx
 * <KoreanText
 *   korean="공격"
 *   english="Attack"
 *   size="large"
 *   layout="vertical"
 * />
 * ```
 */
export const KoreanText: React.FC<KoreanTextProps> = ({
  korean,
  english,
  position = [0, 0, 0],
  size = "medium",
  color = KOREAN_COLORS.TEXT_PRIMARY,
  align = "center",
  weight = "normal",
  layout = "vertical",
  testId,
}) => {
  // Memoize font sizes for performance
  const fontSize = useMemo(() => {
    switch (size) {
      case "small":
        return { korean: "14px", english: "12px" };
      case "large":
        return { korean: "24px", english: "18px" };
      case "xlarge":
        return { korean: "32px", english: "24px" };
      case "medium":
      default:
        return { korean: "18px", english: "14px" };
    }
  }, [size]);

  // Memoize text styles for performance
  const textStyle = useMemo<React.CSSProperties>(() => ({
    color: hexToRgbaString(color),
    fontFamily: FONT_FAMILY.KOREAN,
    textAlign: align,
    fontWeight: weight === "bold" ? "bold" : "normal",
    textShadow: `0 2px 4px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.5)}`,
    userSelect: "none",
    WebkitUserSelect: "none",
  }), [color, align, weight]);

  const containerStyle = useMemo<React.CSSProperties>(() => ({
    display: "flex",
    flexDirection: layout === "vertical" ? "column" : "row",
    alignItems: "center",
    gap: layout === "vertical" ? "4px" : "8px",
  }), [layout]);

  const koreanStyle = useMemo<React.CSSProperties>(() => ({
    ...textStyle,
    fontSize: fontSize.korean,
  }), [textStyle, fontSize.korean]);

  const englishStyle = useMemo<React.CSSProperties>(() => ({
    ...textStyle,
    fontSize: fontSize.english,
    opacity: 0.8,
    fontStyle: "italic",
  }), [textStyle, fontSize.english]);

  return (
    <Html position={position} center>
      <div style={containerStyle} data-testid={testId ?? "korean-text"}>
        <span style={koreanStyle}>{korean}</span>
        {layout === "vertical" && <span style={englishStyle}>{english}</span>}
        {layout === "horizontal" && <span style={englishStyle}>| {english}</span>}
      </div>
    </Html>
  );
};

KoreanText.displayName = "KoreanText";
