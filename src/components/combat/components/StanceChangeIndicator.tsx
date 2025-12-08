/**
 * StanceChangeIndicator - Visual feedback for stance changes
 * Displays Korean and English stance names with trigram symbols
 * 
 * @module components/combat/components/StanceChangeIndicator
 * @category Combat UI
 * @korean 자세변경표시기
 */

import { Html } from "@react-three/drei";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { TRIGRAM_DATA, TRIGRAM_STANCES_ORDER } from "../../../systems/trigram/types";
import { TrigramStance } from "../../../types/common";

/**
 * Props for StanceChangeIndicator component
 */
export interface StanceChangeIndicatorProps {
  /** Current stance index (0-7) */
  readonly currentStance: number;
  /** Previous stance index (0-7) for change detection */
  readonly previousStance: number;
  /** Mobile layout flag */
  readonly isMobile?: boolean;
  /** Display duration in milliseconds */
  readonly duration?: number;
}

/**
 * Get trigram data for a stance index
 */
function getTrigramForStance(stanceIndex: number): {
  stance: TrigramStance;
  data: typeof TRIGRAM_DATA[TrigramStance];
} {
  const stance = TRIGRAM_STANCES_ORDER[stanceIndex] ?? TrigramStance.GEON;
  const data = TRIGRAM_DATA[stance];
  return { stance, data };
}

/**
 * StanceChangeIndicator Component
 * 
 * Displays a temporary overlay showing the current trigram stance
 * with Korean name, English name, and trigram symbol.
 * 
 * Features:
 * - Fade in/out animation
 * - Korean cyberpunk styling
 * - Responsive mobile layout
 * - Trigram symbol display
 * - Glow effect for visual emphasis
 * 
 * @example
 * ```tsx
 * <StanceChangeIndicator
 *   currentStance={player.stance}
 *   previousStance={previousStance}
 *   isMobile={isMobile}
 * />
 * ```
 * 
 * @public
 * @korean 자세변경표시기
 */
export const StanceChangeIndicator: React.FC<StanceChangeIndicatorProps> = ({
  currentStance,
  previousStance,
  isMobile = false,
  duration = 1000,
}) => {
  const [showIndicator, setShowIndicator] = useState(false);
  const isMountedRef = useRef(true);

  // Track component mount state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Show/hide indicator based on stance change
  useEffect(() => {
    if (currentStance !== previousStance) {
      // eslint-disable-next-line
      setShowIndicator(true);

      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setShowIndicator(false);
        }
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [currentStance, previousStance, duration]);

  // Get trigram info
  const { data } = useMemo(
    () => getTrigramForStance(currentStance),
    [currentStance]
  );

  // Memoize animation styles to prevent redefinition on every render
  const animationStyles = useMemo(() => (
    <style>
      {`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
      `}
    </style>
  ), []);

  if (!showIndicator) return null;

  const fontSize = isMobile ? 24 : 36;
  const subFontSize = isMobile ? 14 : 18;
  const top = isMobile ? "30%" : "20%";

  return (
    <Html fullscreen>
      <div
        data-testid="stance-change-indicator"
        role="status"
        aria-live="polite"
        aria-label={`Stance changed to ${data.name.english}`}
        style={{
          position: "absolute",
          top,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          animation: "fadeInOut 1s",
          pointerEvents: "none",
          zIndex: 1000,
        }}
      >
        {/* Main stance display */}
        <div
          style={{
            fontSize: `${fontSize}px`,
            color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
            fontFamily: FONT_FAMILY.KOREAN,
            fontWeight: "bold",
            textShadow: `0 0 20px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8)}, 
                        0 0 40px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.5)}`,
            marginBottom: "8px",
          }}
        >
          {data.name.korean} {data.symbol}
        </div>

        {/* English name */}
        <div
          style={{
            fontSize: `${subFontSize}px`,
            color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 1),
            fontFamily: FONT_FAMILY.KOREAN,
            textShadow: `0 0 10px ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.6)}`,
          }}
        >
          {data.name.english}
        </div>

        {/* CSS Animation - Memoized to prevent redefinition */}
        {animationStyles}
      </div>
    </Html>
  );
};
