/**
 * PainVignette Component - Visual overlay for pain intensity
 *
 * Displays a red vignette effect around the screen edges that intensifies
 * as the player's pain level increases. Uses CSS box-shadow for performance.
 *
 * NOTE: This component is rendered OUTSIDE the Canvas as part of the HTML overlay.
 * It does NOT use Html from drei - it's a standard React component.
 *
 * @module components/combat/PainVignette
 * @category Combat UI
 * @korean 통증비네트
 */

import React, { useMemo } from "react";
import { KOREAN_COLORS } from "../../../../../types/constants";

export interface PainVignetteProps {
  /**
   * Current pain level (0-100)
   * @korean 통증수준
   */
  readonly pain: number;

  /**
   * Mobile responsive mode (subtle effects)
   * @korean 모바일여부
   */
  readonly isMobile: boolean;
}

/**
 * PainVignette - Red edge vignette overlay for pain visualization
 *
 * Renders a fullscreen overlay with red vignette effect that intensifies
 * as pain increases. Only visible when pain is 5 or higher. Optimized
 * for 60fps with CSS transitions.
 *
 * @example
 * ```tsx
 * <PainVignette pain={65} isMobile={false} />
 * // No render if pain < 5
 * <PainVignette pain={2} isMobile={false} />
 * ```
 */
export const PainVignette: React.FC<PainVignetteProps> = ({
  pain,
  isMobile,
}) => {
  const vignetteStyle = useMemo(() => {
    // Clamp pain to 0-100 range
    const clampedPain = Math.max(0, Math.min(100, pain));

    // Calculate intensity (0-1) with cubic easing for dramatic effect
    const normalizedPain = clampedPain / 100;
    const intensity = Math.pow(normalizedPain, 1.5);

    // Mobile uses smaller vignette size for subtlety
    const vignetteSize = isMobile ? "80px" : "150px";

    // Maximum opacity is lower on mobile
    const maxOpacity = isMobile ? 0.5 : 0.7;
    const opacity = intensity * maxOpacity;

    // Use KOREAN_COLORS.PAIN_INDICATOR constant
    const rgb = KOREAN_COLORS.PAIN_INDICATOR;
    const painColor = `rgba(${(rgb >> 16) & 255}, ${(rgb >> 8) & 255}, ${
      rgb & 255
    }, ${opacity})`;

    return {
      position: "fixed" as const,
      inset: 0,
      pointerEvents: "none" as const,
      boxShadow: `inset 0 0 ${vignetteSize} ${painColor}`,
      transition: "box-shadow 0.5s ease-out",
      zIndex: 50, // Below UI controls but above game content
    };
  }, [pain, isMobile]);

  // Don't render if pain is very low (< 5%)
  if (pain < 5) {
    return null;
  }

  return (
    <div data-testid="pain-vignette" style={vignetteStyle} aria-hidden="true" />
  );
};

PainVignette.displayName = "PainVignette";
