/**
 * ConsciousnessBlur Component - Visual effect for consciousness impairment
 *
 * Applies a blur effect to the screen that intensifies as consciousness decreases.
 * Uses CSS backdrop-filter for performance-efficient blur rendering.
 *
 * NOTE: This component is rendered OUTSIDE the Canvas as part of the HTML overlay.
 * It does NOT use Html from drei - it's a standard React component.
 *
 * @module components/combat/ConsciousnessBlur
 * @category Combat UI
 * @korean 의식흐림효과
 */

import React, { useMemo } from "react";

export interface ConsciousnessBlurProps {
  /**
   * Current consciousness level (0-100)
   * 100 = fully conscious, 0 = unconscious
   * @korean 의식수준
   */
  readonly consciousness: number;

  /**
   * Mobile responsive mode (reduced blur strength)
   * @korean 모바일여부
   */
  readonly isMobile: boolean;

  /**
   * Multiplier applied to the effect's maximum blur + darkening (0.0-1.0).
   *
   * Use this to soften the fullscreen effect when the 3D arena is already
   * visually compressed (e.g. portrait mobile). Default is `1.0`.
   *
   * @korean 효과강도배수
   */
  readonly intensityScale?: number;
}

/**
 * ConsciousnessBlur - Screen blur effect based on consciousness level
 *
 * Renders a fullscreen overlay with blur effect that intensifies as
 * consciousness decreases. Only visible when consciousness is 90 or below.
 * Optimized for 60fps with CSS backdrop-filter.
 * 
 * Accessibility behavior:
 * - Purely decorative visual effect
 * - Marked with aria-hidden="true" and excluded from the accessibility tree
 * - Does not announce consciousness level to screen readers
 *   (use a separate, dedicated announcement channel if needed)
 *
 * @example
 * ```tsx
 * <ConsciousnessBlur consciousness={45} isMobile={false} />
 * // No render if consciousness > 90
 * <ConsciousnessBlur consciousness={95} isMobile={false} />
 * ```
 */
export const ConsciousnessBlur: React.FC<ConsciousnessBlurProps> = ({
  consciousness,
  isMobile,
  intensityScale = 1,
}) => {
  const blurStyle = useMemo(() => {
    const clampedConsciousness = Math.max(0, Math.min(100, consciousness));

    const safeScale = Math.max(0, Math.min(1, intensityScale));

    const maxBlur = (isMobile ? 8 : 12) * safeScale;
    const blurAmount = Math.round(
      ((100 - clampedConsciousness) / 100) * maxBlur
    );

    const opacity =
      Math.pow((100 - clampedConsciousness) / 100, 2) * 0.3 * safeScale;

    if (clampedConsciousness > 90) {
      return null;
    }

    return {
      position: "fixed" as const,
      inset: 0,
      pointerEvents: "none" as const,
      backdropFilter: `blur(${blurAmount}px)`,
      WebkitBackdropFilter: `blur(${blurAmount}px)`, // Safari support
      backgroundColor: `rgba(0, 0, 0, ${opacity})`,
      transition:
        "backdrop-filter 0.5s ease-out, background-color 0.5s ease-out",
      zIndex: 60, // Above game content but below HUD
    };
  }, [consciousness, isMobile, intensityScale]);

  if (consciousness > 90 || !blurStyle) {
    return null;
  }

  return (
    <div
      data-testid="consciousness-blur"
      style={blurStyle}
      aria-hidden="true"
    />
  );
};

ConsciousnessBlur.displayName = "ConsciousnessBlur";
