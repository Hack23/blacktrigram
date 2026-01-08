/**
 * HealthBar Component - Segmented health display with Korean theming
 * 
 * Displays player health with:
 * - 10 segmented bars
 * - Color transitions: Green (>50%), Yellow (25-50%), Red (<25%)
 * - Pulse animation when health <20%
 * - Korean/English bilingual labels
 * - Numeric value display (e.g., "85/100")
 * - Responsive sizing for mobile/tablet/desktop
 */

import React, { useMemo } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../../../types/constants";
import { hexToRgbaString } from "../../../../../utils/colorUtils";

export interface HealthBarProps {
  /** Current health value */
  readonly current: number;
  /** Maximum health capacity */
  readonly max: number;
  /** Player identifier for test ID */
  readonly playerId: string;
  /** Whether to use mobile-optimized sizing */
  readonly isMobile: boolean;
}

/**
 * Get health bar color based on health percentage
 */
const getHealthColor = (percentage: number): number => {
  if (percentage > 50) return KOREAN_COLORS.HEALTH_FULL; // Green
  if (percentage > 25) return KOREAN_COLORS.HEALTH_MEDIUM; // Yellow
  return KOREAN_COLORS.HEALTH_CRITICAL; // Red
};

/**
 * HealthBar - Segmented health display with Korean theming
 */
export const HealthBar: React.FC<HealthBarProps> = ({
  current,
  max,
  playerId,
  isMobile,
}) => {
  // Calculate health percentage and determine styling
  const healthPercent = useMemo(
    () => Math.max(0, Math.min(100, (current / max) * 100)),
    [current, max]
  );

  const segments = 10;
  const filledSegments = Math.ceil((healthPercent / 100) * segments);
  const healthColor = getHealthColor(healthPercent);
  const shouldPulse = healthPercent < 20;

  // Responsive sizing
  const barWidth = isMobile ? 180 : 250;
  const barHeight = isMobile ? 16 : 20;
  const fontSize = isMobile ? 11 : 13;
  const padding = isMobile ? "8px 12px" : "12px 16px";

  return (
    <div
      data-testid={`health-bar-${playerId}`}
      role="progressbar"
      aria-label="체력 | Health"
      aria-valuenow={Math.ceil(current)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${Math.ceil(current)} out of ${max}`}
      style={{
        width: `${barWidth}px`,
        padding,
        backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 1),
        borderRadius: "8px",
        border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1)}`,
        boxShadow: `0 0 10px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.2)}`,
      }}
    >
      {/* Label and numeric display */}
      <div
        style={{
          fontSize: `${fontSize}px`,
          color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
          fontFamily: FONT_FAMILY.KOREAN,
          marginBottom: "4px",
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
        }}
      >
        <span>체력 | Health</span>
        <span data-testid={`health-value-${playerId}`}>
          {Math.ceil(current)}/{max}
        </span>
      </div>

      {/* Segmented health bar */}
      <div
        style={{
          display: "flex",
          gap: "3px",
          height: `${barHeight}px`,
          animation: shouldPulse ? "healthPulse 0.8s infinite" : "none",
        }}
      >
        {Array.from({ length: segments }).map((_, index) => (
          <div
            key={index}
            data-testid={`health-segment-${playerId}-${index}`}
            style={{
              flex: 1,
              backgroundColor:
                index < filledSegments
                  ? hexToRgbaString(healthColor, 1)
                  : hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 1),
              borderRadius: "2px",
              transition: "background-color 0.2s ease-in-out",
              boxShadow:
                index < filledSegments
                  ? `0 0 8px ${hexToRgbaString(healthColor, 0.4)}`
                  : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HealthBar;
