/**
 * Technique Name Display Component
 * 
 * Shows Korean technique name during attack execution with animated overlay.
 * Implements the technique-to-animation link by displaying technique names
 * when attacks are performed.
 * 
 * @module components/combat/components/TechniqueNameDisplay
 * @category Combat UI
 * @korean 기술이름표시
 */

import React, { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { KOREAN_COLORS } from "../../../types/constants";

/**
 * Props for TechniqueNameDisplay component
 * 
 * @public
 * @korean 기술이름표시속성
 */
export interface TechniqueNameDisplayProps {
  /**
   * Korean technique name to display
   * @korean 한글기술이름
   */
  readonly koreanName?: string;

  /**
   * English technique name (optional)
   * @korean 영어기술이름
   */
  readonly englishName?: string;

  /**
   * Duration to display in milliseconds
   * @korean 표시지속시간
   */
  readonly duration?: number;

  /**
   * Position in 3D space (relative to attacker)
   * @korean 3D공간위치
   */
  readonly position?: [number, number, number];

  /**
   * Whether technique is critical hit
   * @korean 치명타여부
   */
  readonly isCritical?: boolean;

  /**
   * Whether to show the technique name
   * @korean 표시여부
   */
  readonly visible?: boolean;
}

/**
 * Technique Name Display Component
 * 
 * Displays Korean and English technique names during attack execution.
 * Uses Html overlay from @react-three/drei for 3D positioning.
 * 
 * Features:
 * - Bilingual Korean-English display
 * - Animated fade-in/fade-out
 * - Critical hit styling with red glow
 * - Auto-hide after duration
 * 
 * @example
 * ```tsx
 * <TechniqueNameDisplay
 *   koreanName="경동맥격"
 *   englishName="Carotid Strike"
 *   duration={2000}
 *   position={[0, 2, 0]}
 *   isCritical={true}
 *   visible={true}
 * />
 * ```
 * 
 * @public
 * @korean 기술이름표시컴포넌트
 */
export const TechniqueNameDisplay: React.FC<TechniqueNameDisplayProps> = ({
  koreanName,
  englishName,
  duration = 2000,
  position = [0, 2, 0],
  isCritical = false,
  visible = true,
}) => {
  const [opacity, setOpacity] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!visible || (!koreanName && !englishName)) {
      // Ensure overlay is hidden when not visible or no names provided
      setIsVisible(false);
      setOpacity(0);
      return;
    }

    // Fade in
    setIsVisible(true);
    setOpacity(1);

    // Fade out after duration
    const fadeOutTimer = setTimeout(() => {
      setOpacity(0);
    }, duration - 500); // Start fading 500ms before end

    // Hide completely after fade out
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [visible, koreanName, englishName, duration]);

  if (!isVisible || (!koreanName && !englishName)) {
    return null;
  }

  // Color based on critical hit
  const textColor = isCritical ? "#FF0055" : `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, '0')}`;
  const glowColor = isCritical ? "#FF0055" : `#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, '0')}`;

  return (
    <Html
      position={position}
      center
      distanceFactor={10}
      occlude={false}
      style={{
        transition: "opacity 0.5s ease-in-out",
        opacity,
        pointerEvents: "none",
        userSelect: "none",
      }}
      data-testid="technique-name-display"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          fontFamily: "'Nanum Gothic', 'Noto Sans KR', sans-serif",
          textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
        }}
      >
        {/* Korean name (primary) */}
        {koreanName && (
          <div
            style={{
              fontSize: isCritical ? "32px" : "28px",
              fontWeight: "bold",
              color: textColor,
              letterSpacing: "2px",
            }}
            data-testid="technique-name-korean"
          >
            {koreanName}
          </div>
        )}

        {/* English name (secondary) */}
        {englishName && (
          <div
            style={{
              fontSize: isCritical ? "18px" : "16px",
              fontWeight: "normal",
              color: `#${KOREAN_COLORS.PRIMARY_CYAN.toString(16).padStart(6, '0')}`,
              opacity: 0.8,
              letterSpacing: "1px",
            }}
            data-testid="technique-name-english"
          >
            {englishName}
          </div>
        )}

        {/* Critical hit indicator */}
        {isCritical && (
          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#FF0055",
              marginTop: "4px",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
            data-testid="technique-critical-indicator"
          >
            치명타 | CRITICAL
          </div>
        )}
      </div>
    </Html>
  );
};

export default TechniqueNameDisplay;
