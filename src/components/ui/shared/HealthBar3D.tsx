/**
 * HealthBar3D - Shared 3D health bar component with Korean theming
 * 
 * Displays player/opponent/training health with:
 * - 10 segmented bars with smooth transitions
 * - Color transitions: Green (>50%), Yellow (25-50%), Red (<25%)
 * - Pulse animation when health <20%
 * - Korean/English bilingual labels
 * - Numeric value display (e.g., "85/100")
 * - Responsive sizing for mobile/tablet/desktop
 * - Html overlay for 3D scene integration
 * 
 * @module components/ui/shared/HealthBar3D
 * @category Combat UI
 * @korean 체력바 3D
 */

import React, { useMemo } from "react";
import { hexToRgbaString } from "../../../utils/colorUtils";
import {
  HUDVariant,
  getVariantColors,
  getHealthGradient,
  HEALTH_BAR_SIZES,
  getResponsiveValue,
  HUD_TYPOGRAPHY,
  ANIMATION_DURATIONS,
  BORDER_RADIUS,
  SHADOWS,
  OPACITY,
} from "../../../theme/korean-cyberpunk";
import { KOREAN_COLORS } from "../../../types/constants";

/**
 * Props for HealthBar3D component
 */
export interface HealthBar3DProps {
  /** Current health value */
  readonly current: number;
  /** Maximum health capacity */
  readonly max: number;
  /** Player identifier for test ID */
  readonly playerId: string;
  /** Visual variant (player/opponent/training) */
  readonly variant?: HUDVariant;
  /** Whether to show text labels */
  readonly showText?: boolean;
  /** Whether to use mobile-optimized sizing */
  readonly isMobile?: boolean;
  /** Screen width for responsive sizing */
  readonly screenWidth?: number;
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
 * HealthBar3D - Shared segmented health display with Korean theming
 * 
 * Used in CombatScreen3D and TrainingScreen3D for consistent health visualization
 */
export const HealthBar3D: React.FC<HealthBar3DProps> = ({
  current,
  max,
  playerId,
  variant = "player",
  showText = true,
  isMobile = false,
  screenWidth = 1200,
}) => {
  // Calculate health percentage and determine styling
  const healthPercent = useMemo(
    () => Math.max(0, Math.min(100, (current / max) * 100)),
    [current, max]
  );

  const segments = HEALTH_BAR_SIZES.segments;
  const filledSegments = Math.ceil((healthPercent / 100) * segments);
  const healthColor = getHealthColor(healthPercent);
  const shouldPulse = healthPercent < 20;
  const variantColors = getVariantColors(variant);

  // Responsive sizing based on screen width
  const barWidth = isMobile
    ? HEALTH_BAR_SIZES.width.mobile
    : getResponsiveValue(HEALTH_BAR_SIZES.width, screenWidth);
  const barHeight = isMobile
    ? HEALTH_BAR_SIZES.height.mobile
    : getResponsiveValue(HEALTH_BAR_SIZES.height, screenWidth);
  const fontSize = isMobile
    ? HEALTH_BAR_SIZES.fontSize.mobile
    : getResponsiveValue(HEALTH_BAR_SIZES.fontSize, screenWidth);
  const padding = isMobile
    ? HEALTH_BAR_SIZES.padding.mobile
    : getResponsiveValue(HEALTH_BAR_SIZES.padding, screenWidth);

  // Get health gradient for visual feedback
  const gradient = getHealthGradient(healthPercent);

  return (
    <div
      data-testid={`health-bar-3d-${playerId}`}
      role="progressbar"
      aria-label="체력 | Health"
      aria-valuenow={Math.ceil(current)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${Math.ceil(current)} out of ${max}`}
      style={{
        width: `${barWidth}px`,
        padding: `${padding}px`,
        backgroundColor: hexToRgbaString(variantColors.background, OPACITY.normal),
        borderRadius: BORDER_RADIUS.medium,
        border: `2px solid ${hexToRgbaString(variantColors.border, 1)}`,
        boxShadow: SHADOWS.glow(hexToRgbaString(variantColors.glow, 1), 0.2),
      }}
    >
      {/* Label and numeric display */}
      {showText && (
        <div
          style={{
            fontSize: `${fontSize}px`,
            color: hexToRgbaString(variantColors.border, 1),
            fontFamily: HUD_TYPOGRAPHY.fontFamily,
            marginBottom: "4px",
            display: "flex",
            justifyContent: "space-between",
            fontWeight: HUD_TYPOGRAPHY.fontWeights.bold,
          }}
        >
          <span>체력 | Health</span>
          <span data-testid={`health-value-3d-${playerId}`}>
            {Math.ceil(current)}/{max}
          </span>
        </div>
      )}

      {/* Segmented health bar */}
      <div
        style={{
          display: "flex",
          gap: "3px",
          height: `${barHeight}px`,
          animation: shouldPulse
            ? `healthPulse ${ANIMATION_DURATIONS.pulseSpeed}ms infinite`
            : "none",
        }}
      >
        {Array.from({ length: segments }).map((_, index) => (
          <div
            key={index}
            data-testid={`health-segment-3d-${playerId}-${index}`}
            style={{
              flex: 1,
              backgroundColor:
                index < filledSegments
                  ? hexToRgbaString(healthColor, 1)
                  : hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 1),
              borderRadius: BORDER_RADIUS.small,
              transition: `background-color ${ANIMATION_DURATIONS.barTransition}ms ease-in-out`,
              boxShadow:
                index < filledSegments
                  ? SHADOWS.glow(hexToRgbaString(healthColor, 1), 0.4)
                  : "none",
            }}
          />
        ))}
      </div>

      {/* Inject pulse animation keyframes */}
      <style>
        {`
          @keyframes healthPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}
      </style>
    </div>
  );
};

export default HealthBar3D;
