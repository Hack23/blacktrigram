/**
 * StaminaBar3D - Shared 3D stamina bar component with Korean theming
 * 
 * Displays player/opponent/training stamina with:
 * - 5 segmented bars with smooth transitions
 * - Cyan/blue gradient theming
 * - Pulse animation when stamina <20%
 * - Korean/English bilingual labels
 * - Numeric value display (e.g., "45/50")
 * - Responsive sizing for mobile/tablet/desktop
 * - Html overlay for 3D scene integration
 * 
 * @module components/ui/shared/StaminaBar3D
 * @category Combat UI
 * @korean 기력바 3D
 */

import React, { useMemo } from "react";
import { hexToRgbaString } from "../../../utils/colorUtils";
import {
  HUDVariant,
  getVariantColors,
  STAMINA_BAR_SIZES,
  getResponsiveValue,
  HUD_TYPOGRAPHY,
  ANIMATION_DURATIONS,
  BORDER_RADIUS,
  SHADOWS,
  OPACITY,
} from "../../../theme/korean-cyberpunk";
import { KOREAN_COLORS } from "../../../types/constants";

/**
 * Props for StaminaBar3D component
 */
export interface StaminaBar3DProps {
  /** Current stamina value */
  readonly current: number;
  /** Maximum stamina capacity */
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
 * StaminaBar3D - Shared segmented stamina display with Korean theming
 * 
 * Used in CombatScreen3D and TrainingScreen3D for consistent stamina visualization
 */
export const StaminaBar3D: React.FC<StaminaBar3DProps> = ({
  current,
  max,
  playerId,
  variant = "player",
  showText = true,
  isMobile = false,
  screenWidth = 1200,
}) => {
  // Calculate stamina percentage
  const staminaPercent = useMemo(
    () => Math.max(0, Math.min(100, (current / max) * 100)),
    [current, max]
  );

  const segments = STAMINA_BAR_SIZES.segments;
  const filledSegments = Math.ceil((staminaPercent / 100) * segments);
  const shouldPulse = staminaPercent < 20;
  const variantColors = getVariantColors(variant);

  // Responsive sizing based on screen width
  const barWidth = isMobile
    ? STAMINA_BAR_SIZES.width.mobile
    : getResponsiveValue(STAMINA_BAR_SIZES.width, screenWidth);
  const barHeight = isMobile
    ? STAMINA_BAR_SIZES.height.mobile
    : getResponsiveValue(STAMINA_BAR_SIZES.height, screenWidth);
  const fontSize = isMobile
    ? STAMINA_BAR_SIZES.fontSize.mobile
    : getResponsiveValue(STAMINA_BAR_SIZES.fontSize, screenWidth);
  const padding = isMobile
    ? STAMINA_BAR_SIZES.padding.mobile
    : getResponsiveValue(STAMINA_BAR_SIZES.padding, screenWidth);

  // Stamina uses consistent blue gradient
  const staminaColor = KOREAN_COLORS.ACCENT_BLUE;

  return (
    <div
      data-testid={`stamina-bar-3d-${playerId}`}
      role="progressbar"
      aria-label="기력 | Stamina"
      aria-valuenow={Math.ceil(current)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${Math.ceil(current)} out of ${max}`}
      style={{
        width: `${barWidth}px`,
        padding: `${padding}px`,
        backgroundColor: hexToRgbaString(variantColors.background, OPACITY.normal),
        borderRadius: BORDER_RADIUS.medium,
        border: `2px solid ${hexToRgbaString(staminaColor, 1)}`,
        boxShadow: SHADOWS.glow(hexToRgbaString(staminaColor, 1), 0.2),
      }}
    >
      {/* Label and numeric display */}
      {showText && (
        <div
          style={{
            fontSize: `${fontSize}px`,
            color: hexToRgbaString(staminaColor, 1),
            fontFamily: HUD_TYPOGRAPHY.fontFamily,
            marginBottom: "3px",
            display: "flex",
            justifyContent: "space-between",
            fontWeight: HUD_TYPOGRAPHY.fontWeights.bold,
          }}
        >
          <span>기력 | Stamina</span>
          <span data-testid={`stamina-value-3d-${playerId}`}>
            {Math.ceil(current)}/{max}
          </span>
        </div>
      )}

      {/* Segmented stamina bar */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          height: `${barHeight}px`,
          animation: shouldPulse
            ? `staminaPulse ${ANIMATION_DURATIONS.pulseSpeed}ms infinite`
            : "none",
        }}
      >
        {Array.from({ length: segments }).map((_, index) => (
          <div
            key={index}
            data-testid={`stamina-segment-3d-${playerId}-${index}`}
            style={{
              flex: 1,
              backgroundColor:
                index < filledSegments
                  ? hexToRgbaString(staminaColor, 1)
                  : hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 1),
              borderRadius: BORDER_RADIUS.small,
              transition: `background-color ${ANIMATION_DURATIONS.barTransition}ms ease-in-out`,
              boxShadow:
                index < filledSegments
                  ? SHADOWS.glow(hexToRgbaString(staminaColor, 1), 0.4)
                  : "none",
            }}
          />
        ))}
      </div>

      {/* Inject pulse animation keyframes */}
      <style>
        {`
          @keyframes staminaPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>
    </div>
  );
};

export default StaminaBar3D;
