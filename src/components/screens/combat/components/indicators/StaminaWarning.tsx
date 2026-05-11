/**
 * StaminaWarning Component - Visual warning for low stamina
 *
 * Displays a yellow flashing indicator when stamina drops below critical threshold (20%).
 * Uses CSS animation for attention-grabbing flash effect.
 *
 * NOTE: This component is rendered OUTSIDE the Canvas as part of the HTML overlay.
 * It does NOT use Html from drei - it's a standard React component.
 *
 * Refactored to use useKoreanTheme for consistent styling.
 *
 * @module components/combat/StaminaWarning
 * @category Combat UI
 * @korean 체력경고
 */

import React, { useMemo } from "react";
import { useKoreanTheme } from "../../../../shared/base/useKoreanTheme";
import { hexToRgbaString } from "../../../../../utils/colorUtils";

export interface StaminaWarningProps {
  /**
   * Current stamina amount (0-100)
   * @korean 체력량
   */
  readonly stamina: number;

  /**
   * Mobile responsive mode (reduced flash intensity)
   * @korean 모바일여부
   */
  readonly isMobile: boolean;

  /**
   * Multiplier applied to the warning's visual weight (0.0-1.0).
   *
   * Used to soften the fullscreen flash when the 3D arena is already
   * visually compressed (e.g. portrait mobile). Default is `1.0`.
   *
   * @korean 효과강도배수
   */
  readonly intensityScale?: number;
}

/**
 * StaminaWarning - Yellow flash warning for critical stamina depletion
 *
 * Renders a fullscreen flashing yellow border when stamina drops below 20%.
 * Only visible when stamina is below 20. If stamina is 20 or higher, the component does not render.
 * Uses CSS keyframe animation for fast attention-grabbing flash at 60fps.
 * Uses useKoreanTheme for consistent color scheme.
 *
 * @example
 * ```tsx
 * <StaminaWarning stamina={15} isMobile={false} /> // Renders warning
 * <StaminaWarning stamina={25} isMobile={false} /> // Does not render
 * ```
 */
export const StaminaWarning: React.FC<StaminaWarningProps> = ({
  stamina,
  isMobile,
  intensityScale = 1,
}) => {
  const theme = useKoreanTheme({ variant: "danger", size: "md", isMobile });
  
  const warningStyle = useMemo(() => {
    const criticalThreshold = 20;
    if (stamina >= criticalThreshold) {
      return null;
    }

    const clampedStamina = Math.max(0, Math.min(criticalThreshold, stamina));

    const urgency = (criticalThreshold - clampedStamina) / criticalThreshold;

    const safeScale = Math.max(0, Math.min(1, intensityScale));

    const borderWidth = isMobile ? "4px" : "6px";

    const borderColor = hexToRgbaString(theme.colors.WARNING_YELLOW, 1);
    const glowColor = hexToRgbaString(theme.colors.WARNING_YELLOW, safeScale);
    const animationDuration = Math.max(0.6, 1.2 - urgency * 0.6);

    return {
      position: "fixed" as const,
      inset: borderWidth,
      pointerEvents: "none" as const,
      border: `${borderWidth} solid ${borderColor}`,
      boxShadow: `0 0 ${Math.round(20 * safeScale)}px ${glowColor}`,
      animation: `staminaFlash ${animationDuration}s ease-in-out infinite`,
      transition: "border-color 0.3s ease-out",
      zIndex: 85, // Below balance indicator but above game content
    };
  }, [stamina, isMobile, intensityScale, theme.colors.WARNING_YELLOW]);

  if (stamina >= 20 || !warningStyle) {
    return null;
  }

  return (
    <>
      {/* CSS keyframe animation for flashing */}
      <style>
        {`
          @keyframes staminaFlash {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 1;
            }
          }
        `}
      </style>
      <div
        data-testid="stamina-warning"
        style={warningStyle}
        aria-hidden="true"
      />
    </>
  );
};

StaminaWarning.displayName = "StaminaWarning";
