/**
 * StaminaWarning Component - Visual warning for low stamina
 * 
 * Displays a yellow flashing indicator when stamina drops below critical threshold (20%).
 * Uses CSS animation for attention-grabbing flash effect.
 * 
 * @module components/combat/StaminaWarning
 * @category Combat UI
 * @korean 체력경고
 */

import React, { useMemo } from "react";
import { Html } from "@react-three/drei";
import { KOREAN_COLORS } from "../../../types/constants";

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
}

/**
 * StaminaWarning - Yellow flash warning for critical stamina depletion
 * 
 * Renders a fullscreen flashing yellow border when stamina drops below 20%.
 * Uses CSS keyframe animation for fast attention-grabbing flash at 60fps.
 * 
 * @example
 * ```tsx
 * <StaminaWarning stamina={15} isMobile={false} />
 * ```
 */
export const StaminaWarning: React.FC<StaminaWarningProps> = ({
  stamina,
  isMobile,
}) => {
  const warningStyle = useMemo(() => {
    // Only show when stamina is critically low
    const criticalThreshold = 20;
    if (stamina >= criticalThreshold) {
      return null;
    }

    // Clamp stamina to 0-20 range for intensity calculation
    const clampedStamina = Math.max(0, Math.min(criticalThreshold, stamina));
    
    // Calculate urgency based on how low stamina is (20-0% -> 0-1)
    const urgency = (criticalThreshold - clampedStamina) / criticalThreshold;
    
    // Mobile uses thinner border
    const borderWidth = isMobile ? "4px" : "6px";
    
    // Use WARNING_YELLOW color (0xffff00) = rgb(255, 255, 0)
    const warningColor = `rgb(255, 255, 0)`;
    
    // Animation speed increases with urgency
    const animationDuration = Math.max(0.6, 1.2 - urgency * 0.6);
    
    return {
      position: "fixed" as const,
      inset: borderWidth,
      pointerEvents: "none" as const,
      border: `${borderWidth} solid ${warningColor}`,
      boxShadow: `0 0 20px ${warningColor}`,
      animation: `staminaFlash ${animationDuration}s ease-in-out infinite`,
      transition: "border-color 0.3s ease-out",
      zIndex: 85, // Below balance indicator but above game content
    };
  }, [stamina, isMobile]);

  // Don't render if stamina is not critical
  if (stamina >= 20 || !warningStyle) {
    return null;
  }

  return (
    <>
      <Html fullscreen>
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
      </Html>
    </>
  );
};

StaminaWarning.displayName = "StaminaWarning";
