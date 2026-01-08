/**
 * BalanceIndicator Component - Visual indicator for player balance state
 *
 * Displays a color-coded border around the player representing their
 * combat balance state: READY (green), SHAKEN (yellow), VULNERABLE (orange), HELPLESS (red).
 *
 * NOTE: This component is rendered OUTSIDE the Canvas as part of the HTML overlay.
 * It does NOT use Html from drei - it's a standard React component.
 *
 * @module components/combat/BalanceIndicator
 * @category Combat UI
 * @korean 균형표시기
 */

import React, { useMemo } from "react";
import { KOREAN_COLORS } from "../../../../../types/constants";
import type { BalanceState } from "../../../../../types/player-visual";

export interface BalanceIndicatorProps {
  /**
   * Current balance state
   * @korean 균형상태
   */
  readonly balanceState: BalanceState;

  /**
   * Player position ('left' or 'right' side of screen)
   * @korean 플레이어위치
   */
  readonly position: "left" | "right";

  /**
   * Mobile responsive mode (thinner borders)
   * @korean 모바일여부
   */
  readonly isMobile: boolean;
}

/**
 * Get color for balance state
 */
function getBalanceColor(state: BalanceState): number {
  switch (state) {
    case "READY":
      return KOREAN_COLORS.POSITIVE_GREEN; // 🟢 Green
    case "SHAKEN":
      return KOREAN_COLORS.WARNING_YELLOW; // 🟡 Yellow
    case "VULNERABLE":
      return KOREAN_COLORS.WARNING_ORANGE; // 🟠 Orange
    case "HELPLESS":
      return KOREAN_COLORS.ACCENT_RED; // 🔴 Red
  }
}

/**
 * Get Korean label for balance state
 */
function getBalanceLabel(state: BalanceState): {
  korean: string;
  english: string;
} {
  switch (state) {
    case "READY":
      return { korean: "준비완료", english: "READY" };
    case "SHAKEN":
      return { korean: "동요상태", english: "SHAKEN" };
    case "VULNERABLE":
      return { korean: "취약상태", english: "VULNERABLE" };
    case "HELPLESS":
      return { korean: "무력상태", english: "HELPLESS" };
  }
}

/**
 * BalanceIndicator - Color-coded border indicator for player balance state
 *
 * Renders a border around the player HUD area with color matching the
 * current balance state. Uses smooth transitions for state changes.
 *
 * @example
 * ```tsx
 * <BalanceIndicator
 *   balanceState="SHAKEN"
 *   position="left"
 *   isMobile={false}
 * />
 * ```
 */
export const BalanceIndicator: React.FC<BalanceIndicatorProps> = ({
  balanceState,
  position,
  isMobile,
}) => {
  const indicatorStyle = useMemo(() => {
    const color = getBalanceColor(balanceState);
    const colorHex = `#${color.toString(16).padStart(6, "0")}`;

    // Mobile uses thinner border
    const borderWidth = isMobile ? "3px" : "4px";

    // Position based on player side
    const isLeft = position === "left";

    return {
      position: "absolute" as const,
      top: isMobile ? "8px" : "12px",
      left: isLeft ? (isMobile ? "8px" : "12px") : "auto",
      right: isLeft ? "auto" : isMobile ? "8px" : "12px",
      width: isMobile ? "180px" : "220px",
      height: isMobile ? "80px" : "100px",
      border: `${borderWidth} solid ${colorHex}`,
      borderRadius: "8px",
      boxShadow: `0 0 12px ${colorHex}`,
      pointerEvents: "none" as const,
      transition: "border-color 0.5s ease-out, box-shadow 0.5s ease-out",
      zIndex: 90, // Below HUD text but above game content
    };
  }, [balanceState, position, isMobile]);

  const label = useMemo(() => getBalanceLabel(balanceState), [balanceState]);

  return (
    <div
      data-testid={`balance-indicator-${position}`}
      style={indicatorStyle}
      aria-label={`${label.korean} | ${label.english}`}
      role="status"
      aria-live="polite"
    />
  );
};

BalanceIndicator.displayName = "BalanceIndicator";
