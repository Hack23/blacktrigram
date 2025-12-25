/**
 * BreathingIndicator Component - Visual feedback for breathing disruption status
 * 
 * **Korean**: 호흡곤란 표시기
 * 
 * Displays breathing difficulty with:
 * - Color-coded lungs icon (🫁)
 * - Bilingual label (Korean | English)
 * - Time remaining until recovery
 * - Pulsing animation based on severity
 */

import React, { useMemo } from "react";
import {
  BreathingDisruptionSystem,
  createBreathingIndicator,
} from "../../../systems/breathing";
import { PlayerState } from "../../../systems/player";
import { FONT_FAMILY } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";

export interface BreathingIndicatorProps {
  /** Player state to check for breathing disruption */
  readonly player: PlayerState;
  /** Whether to use mobile-optimized sizing */
  readonly isMobile?: boolean;
}

/**
 * BreathingIndicator - Shows breathing disruption status with Korean-English labels
 */
export const BreathingIndicator: React.FC<BreathingIndicatorProps> = ({
  player,
  isMobile = false,
}) => {
  // Get current timestamp outside useMemo
  const currentTime = Date.now();

  // Get current breathing disruption state
  const breathingState = useMemo(() => {
    const level = BreathingDisruptionSystem.getCurrentLevel(player);
    const activeEffect = BreathingDisruptionSystem.getActiveEffect(player);
    const timeRemaining = activeEffect
      ? Math.max(0, activeEffect.endTime - currentTime)
      : 0;
    const isRecovering = BreathingDisruptionSystem.canRecover(player);

    return createBreathingIndicator(level, timeRemaining, isRecovering);
  }, [player, currentTime]);

  // Don't render if no breathing disruption
  if (!breathingState.visible) {
    return null;
  }

  // Responsive sizing
  const iconSize = isMobile ? 24 : 32;
  const fontSize = isMobile ? 10 : 12;
  const padding = isMobile ? "4px 8px" : "6px 12px";

  // Format time remaining
  const secondsRemaining = Math.ceil(breathingState.timeRemaining / 1000);

  return (
    <div
      data-testid="breathing-indicator"
      style={{
        display: "flex",
        alignItems: "center",
        gap: isMobile ? "6px" : "8px",
        padding,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: "8px",
        border: `2px solid ${hexToRgbaString(breathingState.color, breathingState.opacity)}`,
        boxShadow: `0 0 10px ${hexToRgbaString(breathingState.color, 0.5)}`,
        animation: "breathing-pulse 1s ease-in-out infinite",
        pointerEvents: "none",
      }}
    >
      {/* Lungs icon */}
      <div
        data-testid="breathing-icon"
        style={{
          fontSize: `${iconSize}px`,
          lineHeight: 1,
          transform: `scale(${breathingState.scale})`,
          filter: `drop-shadow(0 0 6px ${hexToRgbaString(breathingState.color, 0.6)})`,
        }}
      >
        {breathingState.icon}
      </div>

      {/* Label and time */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {/* Bilingual label */}
        <div
          data-testid="breathing-label"
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: FONT_FAMILY.KOREAN,
            fontWeight: "bold",
            color: hexToRgbaString(breathingState.color, 1),
            textShadow: `0 0 4px ${hexToRgbaString(breathingState.color, 0.8)}`,
            whiteSpace: "nowrap",
          }}
        >
          {breathingState.label.korean} | {breathingState.label.english}
        </div>

        {/* Time remaining */}
        <div
          data-testid="breathing-timer"
          style={{
            fontSize: `${fontSize - 2}px`,
            fontFamily: FONT_FAMILY.KOREAN,
            color: breathingState.isRecovering
              ? hexToRgbaString(0x00ff00, 0.8)
              : hexToRgbaString(0xffffff, 0.6),
            whiteSpace: "nowrap",
          }}
        >
          {breathingState.isRecovering ? "회복중 | Recovering" : `${secondsRemaining}s`}
        </div>
      </div>

      <style>
        {`
          @keyframes breathing-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: ${breathingState.opacity * 0.7}; }
          }
        `}
      </style>
    </div>
  );
};
