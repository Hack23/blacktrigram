/**
 * ProgressBar - Three.js-compatible progress bar component
 * 
 * Displays health, ki, stamina with Korean theming
 * 
 * @module components/three
 */

import { Html } from "@react-three/drei";
import React, { useMemo } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../types/constants";
import { hexToRgbaString } from "../../utils/colorUtils";

/**
 * Progress bar type
 */
export type ProgressBarType = "health" | "ki" | "stamina";

/**
 * Props for ProgressBar component
 */
export interface ProgressBarProps {
  readonly type: ProgressBarType;
  readonly current: number;
  readonly max: number;
  readonly label?: { korean: string; english: string };
  readonly position?: [number, number, number];
  readonly width?: number;
  readonly height?: number;
  readonly showText?: boolean;
  readonly animated?: boolean;
  readonly testId?: string;
}

/**
 * ProgressBar Component
 * 
 * A progress bar component for displaying health, ki, and stamina.
 * Uses Korean cyberpunk theming with gradient fills.
 * 
 * @example
 * ```tsx
 * <ProgressBar
 *   type="health"
 *   current={75}
 *   max={100}
 *   label={{ korean: "체력", english: "Health" }}
 * />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  type,
  current,
  max,
  label,
  position = [0, 0, 0],
  width = 200,
  height = 24,
  showText = true,
  animated = true,
  testId,
}) => {
  // Calculate percentage safely
  const percentage = useMemo(
    () => Math.max(0, Math.min(1, max > 0 ? current / max : 0)),
    [current, max]
  );

  // Get colors based on type and percentage
  const colors = useMemo(() => {
    switch (type) {
      case "health":
        if (percentage > 0.6) {
          return {
            start: KOREAN_COLORS.HEALTH_FULL,
            end: KOREAN_COLORS.HEALTH_MEDIUM,
            glow: KOREAN_COLORS.POSITIVE_GREEN,
          };
        } else if (percentage > 0.3) {
          return {
            start: KOREAN_COLORS.HEALTH_MEDIUM,
            end: KOREAN_COLORS.HEALTH_LOW,
            glow: KOREAN_COLORS.WARNING_ORANGE,
          };
        } else {
          return {
            start: KOREAN_COLORS.HEALTH_LOW,
            end: KOREAN_COLORS.HEALTH_CRITICAL,
            glow: KOREAN_COLORS.ACCENT_RED,
          };
        }
      case "ki":
        return {
          start: KOREAN_COLORS.KI_FULL,
          end: KOREAN_COLORS.KI_MEDIUM,
          glow: KOREAN_COLORS.PRIMARY_CYAN,
        };
      case "stamina":
        return {
          start: KOREAN_COLORS.STAMINA_FULL,
          end: KOREAN_COLORS.STAMINA_MEDIUM,
          glow: KOREAN_COLORS.SECONDARY_YELLOW,
        };
      default:
        return {
          start: KOREAN_COLORS.PRIMARY_CYAN,
          end: KOREAN_COLORS.ACCENT_BLUE,
          glow: KOREAN_COLORS.PRIMARY_CYAN,
        };
    }
  }, [type, percentage]);

  // Memoize container styles for performance
  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      width: `${width}px`,
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    }),
    [width]
  );

  // Memoize label styles for performance
  const labelStyle = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: FONT_FAMILY.KOREAN,
      fontSize: "12px",
      fontWeight: "bold",
      color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY),
      textShadow: `0 2px 4px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.5)}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }),
    []
  );

  // Memoize bar container styles for performance
  const barContainerStyle = useMemo<React.CSSProperties>(
    () => ({
      width: "100%",
      height: `${height}px`,
      background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8),
      border: `2px solid ${hexToRgbaString(KOREAN_COLORS.UI_BORDER, 0.6)}`,
      borderRadius: "4px",
      overflow: "hidden",
      position: "relative",
    }),
    [height]
  );

  // Memoize fill styles for performance
  const fillStyle = useMemo<React.CSSProperties>(() => {
    return {
      width: `${percentage * 100}%`,
      height: "100%",
      background: `linear-gradient(to right, ${hexToRgbaString(colors.start)}, ${hexToRgbaString(colors.end)})`,
      transition: animated ? "width 0.3s ease" : "none",
      position: "relative",
      boxShadow: animated
        ? `0 0 10px ${hexToRgbaString(colors.glow, 0.5)}`
        : "none",
    };
  }, [percentage, colors, type, animated]);

  // Memoize shine effect styles for performance
  const shineStyle = useMemo<React.CSSProperties>(
    () => ({
      position: "absolute",
      top: "0",
      left: "0",
      width: "60%",
      height: "40%",
      background: hexToRgbaString(KOREAN_COLORS.WHITE_SOLID, 0.3),
      borderRadius: "4px",
      margin: "2px",
    }),
    []
  );

  // Memoize text styles for performance
  const textStyle = useMemo<React.CSSProperties>(
    () => ({
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontFamily: FONT_FAMILY.KOREAN,
      fontSize: "11px",
      fontWeight: "bold",
      color: hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY),
      textShadow: `
        0 1px 2px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.8)},
        0 0 4px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.6)}
      `,
      whiteSpace: "nowrap",
    }),
    []
  );

  return (
    <Html position={position} center>
      <div style={containerStyle} data-testid={testId ?? `progress-bar-${type}`}>
        {/* Label */}
        {label && showText && (
          <div style={labelStyle}>
            <span>
              {label.korean} | {label.english}
            </span>
            <span>
              {Math.ceil(current)} / {max}
            </span>
          </div>
        )}

        {/* Bar Container */}
        <div style={barContainerStyle}>
          {/* Fill */}
          <div style={fillStyle}>
            {/* Shine effect */}
            <div style={shineStyle} />
          </div>

          {/* Percentage Text Overlay */}
          {showText && (
            <div style={textStyle}>
              {Math.round(percentage * 100)}%
            </div>
          )}
        </div>
      </div>
    </Html>
  );
};

ProgressBar.displayName = "ProgressBar";
