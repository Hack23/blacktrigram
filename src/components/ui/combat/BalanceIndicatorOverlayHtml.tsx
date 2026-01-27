/**
 * BalanceIndicatorOverlayHtml Component - 3D Html overlay for balance state
 *
 * Displays balance state with vulnerability indicators using Html from @react-three/drei.
 * Shows:
 * - Current balance percentage
 * - Vulnerability state (red border + shake effect)
 * - Bilingual Korean/English tooltips
 * - Stance transition vulnerability
 * - Rapid change penalty indicator
 *
 * @module components/ui/combat/BalanceIndicatorOverlayHtml
 * @category Combat UI
 * @korean 균형표시오버레이
 */

import React, { useMemo } from "react";
import { Html } from "@react-three/drei";
import { KOREAN_COLORS, FONT_FAMILY } from "@/types/constants";
import type { BalancePlayerState } from "@/systems/combat/BalanceSystem";

export interface BalanceIndicatorOverlayHtmlProps {
  /**
   * Player state with balance and transition data
   * @korean 플레이어상태
   */
  readonly player: BalancePlayerState;

  /**
   * Current game time in milliseconds
   * @korean 현재시간
   */
  readonly currentTime: number;

  /**
   * Position in 3D space [x, y, z]
   * @korean 3D위치
   */
  readonly position?: [number, number, number];

  /**
   * Mobile responsive mode
   * @korean 모바일여부
   */
  readonly isMobile?: boolean;
}

/**
 * Get balance color based on percentage
 */
function getBalanceColor(balance: number): string {
  if (balance >= 80) return `#${KOREAN_COLORS.POSITIVE_GREEN.toString(16).padStart(6, "0")}`;
  if (balance >= 50) return `#${KOREAN_COLORS.WARNING_YELLOW.toString(16).padStart(6, "0")}`;
  if (balance >= 20) return `#${KOREAN_COLORS.WARNING_ORANGE.toString(16).padStart(6, "0")}`;
  return `#${KOREAN_COLORS.ACCENT_RED.toString(16).padStart(6, "0")}`;
}

/**
 * Get balance state label (bilingual)
 */
function getBalanceLabel(balance: number): {
  korean: string;
  english: string;
} {
  if (balance >= 80)
    return { korean: "안정", english: "Stable" };
  if (balance >= 50)
    return { korean: "불안정", english: "Unsteady" };
  if (balance >= 20)
    return { korean: "균형상실", english: "Off-Balance" };
  return { korean: "낙하중", english: "Falling" };
}

/**
 * BalanceIndicatorOverlayHtml - 3D Html overlay for balance visualization
 *
 * Renders above player character in 3D space using Html from @react-three/drei.
 * Shows balance percentage, vulnerability state, and active modifiers.
 *
 * Features:
 * - Red border + shake animation when vulnerable
 * - Bilingual Korean/English labels
 * - Transition vulnerability indicator
 * - Rapid change penalty warning
 *
 * @example
 * ```tsx
 * <BalanceIndicatorOverlayHtml
 *   player={playerState}
 *   currentTime={Date.now()}
 *   position={[0, 2.5, 0]}
 *   isMobile={false}
 * />
 * ```
 */
export const BalanceIndicatorOverlayHtml: React.FC<
  BalanceIndicatorOverlayHtmlProps
> = ({ player, currentTime, position = [0, 2, 0], isMobile = false }) => {
  // Calculate vulnerability state
  const isVulnerable = useMemo(() => {
    const isTransitioning = player.transitionState?.isTransitioning ?? false;
    const isLowBalance = player.balance < 50; // Off-balance or worse
    const hasPenalty =
      player.rapidChangePenaltyEnd !== undefined &&
      currentTime < player.rapidChangePenaltyEnd;
    return isTransitioning ?? isLowBalance ?? hasPenalty;
  }, [player.balance, player.transitionState, player.rapidChangePenaltyEnd, currentTime]);

  const balanceColor = useMemo(
    () => getBalanceColor(player.balance),
    [player.balance]
  );

  const balanceLabel = useMemo(
    () => getBalanceLabel(player.balance),
    [player.balance]
  );

  const vulnerableColorHex = `#${KOREAN_COLORS.ACCENT_RED.toString(16).padStart(6, "0")}`;

  // Container style with vulnerability effects
  const containerStyle = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      border: isVulnerable
        ? `2px solid ${vulnerableColorHex}`
        : `2px solid ${balanceColor}`,
      padding: isMobile ? "6px 10px" : "8px 12px",
      backgroundColor: "rgba(10, 10, 10, 0.85)",
      borderRadius: "8px",
      boxShadow: isVulnerable
        ? `0 0 16px ${vulnerableColorHex}`
        : `0 0 12px ${balanceColor}`,
      transition: "all 0.3s ease-out",
      fontFamily: FONT_FAMILY.KOREAN,
      fontSize: isMobile ? "12px" : "14px",
      minWidth: isMobile ? "140px" : "180px",
      textAlign: "center" as const,
      userSelect: "none" as const,
      pointerEvents: "none" as const,
    };

    // Add shake animation when vulnerable
    if (isVulnerable) {
      baseStyle.animation = "shake 0.3s infinite";
    }

    return baseStyle;
  }, [isVulnerable, balanceColor, vulnerableColorHex, isMobile]);

  const balancePercentage = Math.round(player.balance);

  return (
    <>
      {/* Inject keyframes for shake animation */}
      <Html position={position} center>
        <style>
          {`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-2px); }
              75% { transform: translateX(2px); }
            }
          `}
        </style>
        <div style={containerStyle} data-testid="balance-indicator-overlay">
          {/* Balance percentage and label */}
          <div
            style={{
              color: balanceColor,
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            균형 | Balance: {balancePercentage}%
          </div>

          {/* Balance state label */}
          <div
            style={{
              color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}`,
              fontSize: isMobile ? "10px" : "12px",
            }}
          >
            {balanceLabel.korean} | {balanceLabel.english}
          </div>

          {/* Vulnerability indicators */}
          {player.transitionState?.isTransitioning && (
            <div
              style={{
                color: vulnerableColorHex,
                fontSize: isMobile ? "10px" : "11px",
                marginTop: "4px",
                fontWeight: "bold",
              }}
            >
              취약 | Vulnerable!
            </div>
          )}

          {/* Rapid change penalty indicator */}
          {player.rapidChangePenaltyEnd && currentTime < player.rapidChangePenaltyEnd && (
            <div
              style={{
                color: `#${KOREAN_COLORS.WARNING_ORANGE.toString(16).padStart(6, "0")}`,
                fontSize: isMobile ? "9px" : "10px",
                marginTop: "2px",
              }}
            >
              급속변경 벌칙 | Rapid Change Penalty
            </div>
          )}
        </div>
      </Html>
    </>
  );
};

BalanceIndicatorOverlayHtml.displayName = "BalanceIndicatorOverlayHtml";
