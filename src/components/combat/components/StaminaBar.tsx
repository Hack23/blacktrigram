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
import { hexToRgbaString } from "../../../utils/colorUtils";

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
      role="progressbar"
      aria-label="기력 | Stamina"
      aria-valuenow={Math.ceil(current)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${Math.ceil(current)} out of ${max}`}
      style={{
        width: `${barWidth}px`,
        padding,
        backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 1),
        borderRadius: "8px",
        border: `2px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 1)}`,
        boxShadow: `0 0 8px ${hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 0.2)}`,
      }}
    >
      {/* Label and numeric display */}
      <div
        style={{
          fontSize: `${fontSize}px`,
          color: hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 1),
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
                  ? hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 1)
                  : hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 1),
              borderRadius: "2px",
              transition: "background-color 0.2s ease-in-out",
              boxShadow:
                index < filledSegments
                  ? `0 0 6px ${hexToRgbaString(KOREAN_COLORS.ACCENT_BLUE, 0.4)}`
                  : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};
