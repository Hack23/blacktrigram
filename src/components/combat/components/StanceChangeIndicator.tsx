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
  /** Display duration in milliseconds (default: 1000ms) */
  readonly duration?: number;
  /** Show transition progress bar (default: true) */
  readonly showProgress?: boolean;
  /** Transition duration in milliseconds for progress bar (default: 600ms) */
  readonly transitionDuration?: number;
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
  showProgress = true,
  transitionDuration = 600,
}) => {
  const [showIndicator, setShowIndicator] = useState(false);
  const [progress, setProgress] = useState(0);
  const isMountedRef = useRef(true);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Track component mount state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Show/hide indicator based on stance change
  // This effect intentionally sets state synchronously for immediate visual feedback
  useEffect(() => {
    // Cancel any existing animation frame first
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    if (currentStance !== previousStance) {
      setShowIndicator(true);
      setProgress(0);
      startTimeRef.current = 0;

      // Animation loop for progress bar
      if (showProgress) {
        const animate = (timestamp: number) => {
          if (!isMountedRef.current) return;
          
          // Initialize start time on first frame
          if (startTimeRef.current === 0) {
            startTimeRef.current = timestamp;
          }
          
          const elapsed = timestamp - startTimeRef.current;
          const newProgress = Math.min((elapsed / transitionDuration) * 100, 100);
          
          setProgress(newProgress);

          if (newProgress < 100) {
            animationFrameRef.current = requestAnimationFrame(animate);
          }
        };

        animationFrameRef.current = requestAnimationFrame(animate);
      }

      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setShowIndicator(false);
        }
      }, duration);

      return () => {
        clearTimeout(timer);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [currentStance, previousStance, duration, showProgress, transitionDuration]);

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

  // Get color for current stance
  const primaryColor = data.theme?.primary ?? KOREAN_COLORS.PRIMARY_CYAN;
  const primaryColorHex = hexToRgbaString(primaryColor, 1);

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
            color: primaryColorHex,
            fontFamily: FONT_FAMILY.KOREAN,
            fontWeight: "bold",
            textShadow: `0 0 20px ${hexToRgbaString(primaryColor, 0.8)}, 
                        0 0 40px ${hexToRgbaString(primaryColor, 0.5)}`,
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
            marginBottom: showProgress ? "12px" : "0",
          }}
        >
          {data.name.english}
        </div>

        {/* Transition progress bar (600ms) */}
        {showProgress && (
          <div
            data-testid="stance-transition-progress"
            style={{
              width: "200px",
              margin: "0 auto",
              padding: "8px 0",
            }}
          >
            {/* Progress label */}
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: FONT_FAMILY.KOREAN,
                marginBottom: "4px",
                letterSpacing: "1px",
              }}
            >
              팔괘전환 | Transition
            </div>
            
            {/* Progress bar container */}
            <div
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                borderRadius: "3px",
                overflow: "hidden",
                border: `1px solid ${hexToRgbaString(primaryColor, 0.3)}`,
              }}
            >
              {/* Progress bar fill */}
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: primaryColorHex,
                  transition: "width 0.05s linear",
                  boxShadow: `0 0 8px ${primaryColorHex}`,
                }}
              />
            </div>
            
            {/* Time remaining */}
            <div
              style={{
                fontSize: "10px",
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: FONT_FAMILY.KOREAN,
                marginTop: "4px",
              }}
            >
              {Math.max(0, Math.ceil(transitionDuration * (1 - progress / 100)))}ms
            </div>
          </div>
        )}

        {/* CSS Animation - Memoized to prevent redefinition */}
        {animationStyles}
      </div>
    </Html>
  );
};
