/**
 * BloodLossOverlay Component - Visual warning for blood loss
 * 
 * Displays a pulsing red overlay when blood loss exceeds critical threshold (50%).
 * Uses CSS animation for smooth pulsing effect.
 * 
 * @module components/combat/BloodLossOverlay
 * @category Combat UI
 * @korean 출혈오버레이
 */

import React, { useMemo } from "react";
import { Html } from "@react-three/drei";
import { KOREAN_COLORS } from "../../../types/constants";

export interface BloodLossOverlayProps {
  /**
   * Current blood loss amount (0-100)
   * @korean 출혈량
   */
  readonly bloodLoss: number;

  /**
   * Mobile responsive mode (reduced pulse intensity)
   * @korean 모바일여부
   */
  readonly isMobile: boolean;
}

/**
 * BloodLossOverlay - Pulsing red warning for critical blood loss
 * 
 * Renders a fullscreen pulsing red overlay when blood loss is 50 or higher.
 * Only visible when bloodLoss is 50 or above; does not render for values below 50.
 * Uses CSS keyframe animation for smooth pulsing effect at 60fps.
 * 
 * @example
 * ```tsx
 * // Overlay is rendered (bloodLoss >= 50)
 * <BloodLossOverlay bloodLoss={75} isMobile={false} />
 * 
 * // Overlay is not rendered (bloodLoss < 50)
 * <BloodLossOverlay bloodLoss={30} isMobile={false} />
 * ```
 */
export const BloodLossOverlay: React.FC<BloodLossOverlayProps> = ({
  bloodLoss,
  isMobile,
}) => {
  const overlayStyle = useMemo(() => {
    // Only show when blood loss exceeds critical threshold
    const criticalThreshold = 50;
    if (bloodLoss < criticalThreshold) {
      return null;
    }

    // Clamp blood loss to 50-100 range for intensity calculation
    const clampedBloodLoss = Math.max(criticalThreshold, Math.min(100, bloodLoss));
    
    // Calculate intensity based on blood loss (50-100% -> 0-1)
    const intensity = (clampedBloodLoss - criticalThreshold) / (100 - criticalThreshold);
    
    // Mobile uses reduced intensity
    const maxOpacity = isMobile ? 0.15 : 0.25;
    const baseOpacity = intensity * maxOpacity;
    
    // Use KOREAN_COLORS.BLOODLOSS_INDICATOR constant
    const rgb = KOREAN_COLORS.BLOODLOSS_INDICATOR;
    const bloodColor = `rgb(${(rgb >> 16) & 255}, ${(rgb >> 8) & 255}, ${rgb & 255})`;
    
    return {
      position: "fixed" as const,
      inset: 0,
      pointerEvents: "none" as const,
      backgroundColor: bloodColor,
      // Use CSS variable for dynamic animation
      ['--base-opacity']: baseOpacity.toString(),
      animation: "bloodLossPulse 1.5s ease-in-out infinite",
      transition: "opacity 0.5s ease-out",
      zIndex: 55, // Between pain vignette and consciousness blur
    } as React.CSSProperties;
  }, [bloodLoss, isMobile]);

  // Don't render if blood loss is below threshold
  if (bloodLoss < 50 || !overlayStyle) {
    return null;
  }

  return (
    <>
      <Html fullscreen>
        {/* CSS keyframe animation for pulsing with CSS variables */}
        <style>
          {`
            @keyframes bloodLossPulse {
              0%, 100% {
                opacity: var(--base-opacity);
              }
              50% {
                opacity: calc(var(--base-opacity) * 1.5);
              }
            }
          `}
        </style>
        <div
          data-testid="bloodloss-overlay"
          style={overlayStyle}
          aria-hidden="true"
        />
      </Html>
    </>
  );
};

BloodLossOverlay.displayName = "BloodLossOverlay";
