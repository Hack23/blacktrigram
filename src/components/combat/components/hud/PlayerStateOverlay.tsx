/**
 * PlayerStateOverlay Component - Unified player state visual indicators
 * 
 * Combines all player state visual effects into a single overlay:
 * - Pain vignette
 * - Balance indicator
 * - Consciousness blur
 * - Blood loss warning
 * - Stamina warning
 * 
 * @module components/combat/PlayerStateOverlay
 * @category Combat UI
 * @korean 플레이어상태오버레이
 */

import React from "react";
import { PainVignette } from "../effects/PainVignette";
import { BalanceIndicator } from "../indicators/BalanceIndicator";
import { ConsciousnessBlur } from "../effects/ConsciousnessBlur";
import { BloodLossOverlay } from "../effects/BloodLossOverlay";
import { StaminaWarning } from "../indicators/StaminaWarning";
import type { BalanceState } from "../../../../types/player-visual";

export interface PlayerStateOverlayProps {
  /**
   * Current pain level (0-100)
   * @korean 통증
   */
  readonly pain: number;

  /**
   * Current balance state
   * @korean 균형상태
   */
  readonly balanceState: BalanceState;

  /**
   * Player position ('left' or 'right')
   * @korean 플레이어위치
   */
  readonly position: "left" | "right";

  /**
   * Current consciousness level (0-100)
   * @korean 의식
   */
  readonly consciousness: number;

  /**
   * Current blood loss (0-100, optional)
   * @korean 출혈
   */
  readonly bloodLoss?: number;

  /**
   * Current stamina (0-100)
   * @korean 체력
   */
  readonly stamina: number;

  /**
   * Mobile responsive mode
   * @korean 모바일여부
   */
  readonly isMobile: boolean;
}

/**
 * PlayerStateOverlay - Unified visual effects for player state
 * 
 * Combines all player state visual indicators into a single component
 * with optimal performance and consistent rendering. All effects use
 * smooth 0.5s transitions and are optimized for 60fps.
 * 
 * @example
 * ```tsx
 * <PlayerStateOverlay
 *   pain={65}
 *   balanceState="SHAKEN"
 *   position="left"
 *   consciousness={80}
 *   bloodLoss={45}
 *   stamina={15}
 *   isMobile={false}
 * />
 * ```
 */
export const PlayerStateOverlay: React.FC<PlayerStateOverlayProps> = ({
  pain,
  balanceState,
  position,
  consciousness,
  bloodLoss = 0,
  stamina,
  isMobile,
}) => {
  return (
    <>
      {/* Pain vignette - shows when pain >= 5 (see PainVignette.tsx) */}
      <PainVignette pain={pain} isMobile={isMobile} />

      {/* Balance indicator - always visible, color-coded by state (see BalanceIndicator.tsx) */}
      <BalanceIndicator
        balanceState={balanceState}
        position={position}
        isMobile={isMobile}
      />

      {/* Consciousness blur - shows when consciousness <= 90 (see ConsciousnessBlur.tsx) */}
      <ConsciousnessBlur consciousness={consciousness} isMobile={isMobile} />

      {/* Blood loss warning - pulses when bloodLoss >= 50 (see BloodLossOverlay.tsx) */}
      <BloodLossOverlay bloodLoss={bloodLoss} isMobile={isMobile} />

      {/* Stamina warning - flashes when stamina < 20 (see StaminaWarning.tsx) */}
      <StaminaWarning stamina={stamina} isMobile={isMobile} />
    </>
  );
};

PlayerStateOverlay.displayName = "PlayerStateOverlay";
