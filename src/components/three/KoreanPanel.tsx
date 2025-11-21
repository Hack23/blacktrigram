/**
 * KoreanPanel - Three.js-compatible panel container component
 * 
 * Provides a styled container with Korean cyberpunk theming
 * 
 * @module components/three
 */

import { Html } from "@react-three/drei";
import React, { useMemo } from "react";
import { KOREAN_COLORS } from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";

/**
 * Props for KoreanPanel component
 */
export interface KoreanPanelProps {
  readonly children: React.ReactNode;
  readonly position?: [number, number, number];
  readonly width?: number | string;
  readonly height?: number | string;
  readonly padding?: number;
  readonly variant?: "default" | "bordered" | "elevated";
  readonly testId?: string;
}

/**
 * KoreanPanel Component
 * 
 * A container component with Korean cyberpunk styling.
 * Uses @react-three/drei Html overlay for proper DOM rendering.
 * 
 * @example
 * ```tsx
 * <KoreanPanel variant="bordered" padding={20}>
 *   <h1>Panel Content</h1>
 * </KoreanPanel>
 * ```
 */
export const KoreanPanel: React.FC<KoreanPanelProps> = ({
  children,
  position = [0, 0, 0],
  width = "auto",
  height = "auto",
  padding = 16,
  variant = "default",
  testId,
}) => {
  // Memoize panel styles for performance
  const panelStyle = useMemo<React.CSSProperties>(() => {
    const baseStyle: React.CSSProperties = {
      width,
      height,
      padding: `${padding}px`,
      borderRadius: "8px",
      fontFamily: '"Noto Sans KR", "Malgun Gothic", Arial, sans-serif',
    };

    switch (variant) {
      case "bordered":
        return {
          ...baseStyle,
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.95),
          border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)}`,
          boxShadow: `0 0 15px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3)}`,
        };
      case "elevated":
        return {
          ...baseStyle,
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
          ...baseStyle,
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.85),
          border: `1px solid ${hexToRgbaString(KOREAN_COLORS.UI_BORDER, 0.5)}`,
        };
    }
  }, [width, height, padding, variant]);

  return (
    <Html position={position} center>
      <div style={panelStyle} data-testid={testId ?? "korean-panel"}>
        {children}
      </div>
    </Html>
  );
};

KoreanPanel.displayName = "KoreanPanel";
