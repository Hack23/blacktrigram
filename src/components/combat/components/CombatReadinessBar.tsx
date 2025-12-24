/**
 * CombatReadinessBar Component - 10-bar segmented combat readiness display
 * 
 * Displays comprehensive combat readiness with:
 * - 10 segmented bars representing 10% each
 * - Color transitions: Green (>80%), Yellow (60-79%), Orange (40-59%), Red (20-39%), Dark Red (<20%)
 * - Smooth 0.3s transition animations
 * - Korean/English bilingual labels
 * - Numeric percentage display
 * - Responsive sizing for mobile/tablet/desktop
 * - Real-time calculation from body health, pain, consciousness, and balance
 */

import React, { useMemo } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { 
  calculateCombatReadiness, 
  getCombatReadinessColor, 
  getCombatReadinessLabel 
} from "../../../utils/combatReadiness";
import type { PlayerState } from "../../../systems/player";

export interface CombatReadinessBarProps {
  /** Player state containing all combat factors */
  readonly player: PlayerState;
  /** Player identifier for test ID */
  readonly playerId: string;
  /** Whether to use mobile-optimized sizing */
  readonly isMobile: boolean;
}

/**
 * CombatReadinessBar - 10-bar segmented combat readiness display with Korean theming
 * 
 * Calculates and displays overall combat readiness from multiple factors:
 * - Body part health (40% weight)
 * - Pain level (20% weight)
 * - Consciousness (20% weight)
 * - Balance state (20% weight)
 * 
 * @example
 * ```tsx
 * <CombatReadinessBar 
 *   player={playerState} 
 *   playerId="player-1"
 *   isMobile={false}
 * />
 * ```
 */
export const CombatReadinessBar: React.FC<CombatReadinessBarProps> = ({
  player,
  playerId,
  isMobile,
}) => {
  // Calculate combat readiness percentage
  const readiness = useMemo(
    () => calculateCombatReadiness(player),
    [player]
  );

  const segments = 10;
  const filledSegments = Math.ceil((readiness / 100) * segments);
  const readinessColor = getCombatReadinessColor(readiness);
  const readinessLabel = getCombatReadinessLabel(readiness);
  const shouldPulse = readiness < 20;

  // Responsive sizing
  const barWidth = isMobile ? 180 : 250;
  const barHeight = isMobile ? 16 : 20;
  const fontSize = isMobile ? 11 : 13;
  const padding = isMobile ? "8px 12px" : "12px 16px";

  // Status text based on readiness level
  const statusText = useMemo(() => {
    if (readiness >= 80) return `${readiness}% ${readinessLabel.korean}`;
    return `${readiness}% ${readinessLabel.korean}`;
  }, [readiness, readinessLabel]);

  return (
    <div
      data-testid={`combat-readiness-bar-${playerId}`}
      role="progressbar"
      aria-label="전투 준비도 | Combat Readiness"
      aria-valuenow={readiness}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${readiness}% Combat Readiness - ${readinessLabel.english}`}
      style={{
        width: `${barWidth}px`,
        padding,
        backgroundColor: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 1),
        borderRadius: "8px",
        border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1)}`,
        boxShadow: `0 0 10px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.2)}`,
      }}
    >
      {/* Label and numeric/status display */}
      <div
        style={{
          fontSize: `${fontSize}px`,
          color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 1),
          fontFamily: FONT_FAMILY.KOREAN,
          marginBottom: "4px",
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
        }}
      >
        <span>전투 준비도 | Combat Readiness</span>
        <span data-testid={`combat-readiness-value-${playerId}`}>
          {statusText}
        </span>
      </div>

      {/* 10-segment combat readiness bar */}
      <div
        style={{
          display: "flex",
          gap: "3px",
          height: `${barHeight}px`,
          animation: shouldPulse ? "healthPulse 0.8s infinite" : "none",
        }}
      >
        {Array.from({ length: segments }).map((_, index) => (
          <div
            key={index}
            data-testid={`combat-readiness-segment-${playerId}-${index}`}
            style={{
              flex: 1,
              backgroundColor:
                index < filledSegments
                  ? hexToRgbaString(readinessColor, 1)
                  : hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 1),
              borderRadius: "2px",
              transition: "background-color 0.3s ease-in-out",
              boxShadow:
                index < filledSegments
                  ? `0 0 8px ${hexToRgbaString(readinessColor, 0.4)}`
                  : "none",
            }}
          />
        ))}
      </div>

      {/* Breakdown tooltip (hover) - optional enhancement */}
      <div
        data-testid={`combat-readiness-breakdown-${playerId}`}
        style={{
          display: "none", // Hidden by default, can be shown on hover
          fontSize: `${fontSize - 2}px`,
          color: hexToRgbaString(KOREAN_COLORS.TEXT_SECONDARY, 1),
          marginTop: "4px",
          fontFamily: FONT_FAMILY.KOREAN,
        }}
      >
        {/* Detailed breakdown for debugging/advanced players */}
        <div>Body: {player.bodyPartHealth ? "tracked" : "aggregate"}</div>
        <div>Pain: {Math.round(player.pain)}%</div>
        <div>Consciousness: {Math.round(player.consciousness)}%</div>
        <div>Balance: {Math.round(player.balance)}%</div>
      </div>
    </div>
  );
};

export default CombatReadinessBar;
