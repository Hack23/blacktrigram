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

  /**
   * Multiplier applied to the effect's maximum opacity (0.0-1.0).
   *
   * Use this to soften the fullscreen effect when the 3D arena is already
   * visually compressed (e.g. portrait mobile) so the vignette does not
   * further obscure the view. Default is `1.0` (no attenuation).
   *
   * @korean 효과강도배수
   */
  readonly intensityScale?: number;
}

/**
 * PainVignette - Red edge vignette overlay for pain visualization
 *
 * Renders a fullscreen overlay with red vignette effect that intensifies
 * as pain increases. Only visible when pain is 5 or higher. Optimized
 * for 60fps with CSS transitions.
 * 
 * Accessibility:
 * - Purely visual, decorative-only overlay
 * - Hidden from assistive technologies via aria-hidden="true"
 * - Does not announce pain levels; use a separate mechanism if announcements are required
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
  intensityScale = 1,
}) => {
  const vignetteStyle = useMemo(() => {
    const clampedPain = Math.max(0, Math.min(100, pain));

    const normalizedPain = clampedPain / 100;
    const intensity = Math.pow(normalizedPain, 1.5);

    const vignetteSize = isMobile ? "80px" : "150px";

    const safeScale = Math.max(0, Math.min(1, intensityScale));
    const maxOpacity = (isMobile ? 0.5 : 0.7) * safeScale;
    const opacity = intensity * maxOpacity;

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
  }, [pain, isMobile, intensityScale]);

  if (pain < 5) {
    return null;
  }

  return (
    <div 
      data-testid="pain-vignette" 
      style={vignetteStyle} 
      aria-hidden="true"
    />
  );
};

PainVignette.displayName = "PainVignette";
