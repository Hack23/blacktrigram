/**
 * ConsciousnessBlur Component - Visual effect for consciousness impairment
 * 
 * Applies a blur effect to the screen that intensifies as consciousness decreases.
 * Uses CSS backdrop-filter for performance-efficient blur rendering.
 * 
 * @module components/combat/ConsciousnessBlur
 * @category Combat UI
 * @korean 의식흐림효과
 */

import React, { useMemo } from "react";
import { Html } from "@react-three/drei";

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
}

/**
 * ConsciousnessBlur - Screen blur effect based on consciousness level
 * 
 * Renders a fullscreen overlay with blur effect that intensifies as
 * consciousness decreases. Optimized for 60fps with CSS backdrop-filter.
 * 
 * @example
 * ```tsx
 * <ConsciousnessBlur consciousness={45} isMobile={false} />
 * ```
 */
export const ConsciousnessBlur: React.FC<ConsciousnessBlurProps> = ({
  consciousness,
  isMobile,
}) => {
  const blurStyle = useMemo(() => {
    // Clamp consciousness to 0-100 range
    const clampedConsciousness = Math.max(0, Math.min(100, consciousness));
    
    // Calculate blur amount (inverse of consciousness)
    // 100 consciousness = 0px blur, 0 consciousness = 12px blur (8px on mobile)
    const maxBlur = isMobile ? 8 : 12;
    const blurAmount = Math.round(((100 - clampedConsciousness) / 100) * maxBlur);
    
    // Also add slight opacity darkening for dramatic effect
    const opacity = Math.pow((100 - clampedConsciousness) / 100, 2) * 0.3;
    
    // Don't apply blur if consciousness is high (> 90)
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
      transition: "backdrop-filter 0.5s ease-out, background-color 0.5s ease-out",
      zIndex: 60, // Above game content but below HUD
    };
  }, [consciousness, isMobile]);

  // Don't render if consciousness is very high
  if (consciousness > 90 || !blurStyle) {
    return null;
  }

  return (
    <Html fullscreen>
      <div
        data-testid="consciousness-blur"
        style={blurStyle}
        aria-hidden="true"
      />
    </Html>
  );
};

ConsciousnessBlur.displayName = "ConsciousnessBlur";
