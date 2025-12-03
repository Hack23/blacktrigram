/**
 * StaminaBar Component - Segmented stamina display with Korean theming
 * 
 * Displays player stamina with:
 * - 5 segmented bars
 * - Consistent cyan/blue theming
 * - Pulse animation when stamina <20%
 * - Korean/English bilingual labels
 * - Numeric value display (e.g., "45/50")
 * - Responsive sizing for mobile/tablet/desktop
 */

import React, { useMemo } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";

export interface StaminaBarProps {
  /** Current stamina value */
  readonly current: number;
  /** Maximum stamina capacity */
  readonly max: number;
  /** Player identifier for test ID */
  readonly playerId: string;
  /** Whether to use mobile-optimized sizing */
  readonly isMobile: boolean;
}

/**
 * Convert hex color to CSS RGB string
 */
const hexToRgb = (hex: number): string => {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * StaminaBar - Segmented stamina display with Korean theming
 */
export const StaminaBar: React.FC<StaminaBarProps> = ({
  current,
  max,
  playerId,
  isMobile,
}) => {
  // Calculate stamina percentage
  const staminaPercent = useMemo(
    () => Math.max(0, Math.min(100, (current / max) * 100)),
    [current, max]
  );

  const segments = 5;
  const filledSegments = Math.ceil((staminaPercent / 100) * segments);
  const shouldPulse = staminaPercent < 20;

  // Responsive sizing
  const barWidth = isMobile ? 180 : 250;
  const barHeight = isMobile ? 10 : 12;
  const fontSize = isMobile ? 10 : 11;
  const padding = isMobile ? "6px 8px" : "8px 12px";

  return (
    <div
      data-testid={`stamina-bar-${playerId}`}
      style={{
        width: `${barWidth}px`,
        padding,
        backgroundColor: hexToRgb(KOREAN_COLORS.UI_BACKGROUND_DARK),
        borderRadius: "8px",
        border: `2px solid ${hexToRgb(KOREAN_COLORS.ACCENT_BLUE)}`,
        boxShadow: `0 0 8px ${hexToRgb(KOREAN_COLORS.ACCENT_BLUE)}33`,
      }}
    >
      {/* Label and numeric display */}
      <div
        style={{
          fontSize: `${fontSize}px`,
          color: hexToRgb(KOREAN_COLORS.ACCENT_BLUE),
          fontFamily: FONT_FAMILY.KOREAN,
          marginBottom: "3px",
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
        }}
      >
        <span>기력 | Stamina</span>
        <span data-testid={`stamina-value-${playerId}`}>
          {Math.ceil(current)}/{max}
        </span>
      </div>

      {/* Segmented stamina bar */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          height: `${barHeight}px`,
          animation: shouldPulse ? "staminaPulse 0.8s infinite" : "none",
        }}
      >
        {Array.from({ length: segments }).map((_, index) => (
          <div
            key={index}
            data-testid={`stamina-segment-${playerId}-${index}`}
            style={{
              flex: 1,
              backgroundColor:
                index < filledSegments
                  ? hexToRgb(KOREAN_COLORS.ACCENT_BLUE)
                  : hexToRgb(KOREAN_COLORS.UI_BACKGROUND_MEDIUM),
              borderRadius: "2px",
              transition: "background-color 0.2s ease-in-out",
              boxShadow:
                index < filledSegments
                  ? `0 0 6px ${hexToRgb(KOREAN_COLORS.ACCENT_BLUE)}66`
                  : "none",
            }}
          />
        ))}
      </div>

      {/* CSS for pulse animation */}
      <style>
        {`
          @keyframes staminaPulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.6;
            }
          }
        `}
      </style>
    </div>
  );
};

export default StaminaBar;
