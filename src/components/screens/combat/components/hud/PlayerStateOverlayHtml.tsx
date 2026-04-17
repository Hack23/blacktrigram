/**
 * PlayerStateOverlayHtml Component - Unified player state visual indicators
 * 
 * Combines all player state visual effects into a single overlay:
 * - Pain vignette
 * - Balance indicator
 * - Consciousness blur
 * - Blood loss warning
 * - Stamina warning
 * 
 * @module components/combat/PlayerStateOverlayHtml
 * @category Combat UI
 * @korean 플레이어상태오버레이
 */

import React from "react";
import { PainVignette } from "../effects/PainVignette";
import { BalanceIndicator } from "../indicators/BalanceIndicator";
import { ConsciousnessBlur } from "../effects/ConsciousnessBlur";
import { BloodLossOverlayHtml } from "../effects/BloodLossOverlayHtml";
import { StaminaWarning } from "../indicators/StaminaWarning";
import type { BalanceState } from "../../../../../types/player-visual";

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

  /**
   * Multiplier applied to every fullscreen effect's visual weight (0.0-1.0).
   *
   * Used by the parent screen to attenuate fullscreen vignette / blur / flash
   * effects when the 3D arena is already visually compressed (e.g. portrait
   * mobile, where the arena is rendered in a 3:4 aspect ratio and consumes
   * the majority of the viewport height). Default is `1.0` (no attenuation).
   *
   * Cascades to `PainVignette`, `ConsciousnessBlur`, `BloodLossOverlayHtml`
   * and `StaminaWarning`. Does not affect `BalanceIndicator`, which is an
   * informational indicator rather than a fullscreen overlay.
   *
   * @korean 효과강도배수
   */
  readonly intensityScale?: number;
}

/**
 * PlayerStateOverlayHtml - Unified visual effects for player state
 * 
 * Combines all player state visual indicators into a single component
 * with optimal performance and consistent rendering. All effects use
 * smooth 0.5s transitions and are optimized for 60fps.
 *
 * Optimized with React.memo for performance:
 * - Prevents re-renders when props haven't changed
 * - Custom comparison function for precise control
 * - Reduces DOM updates for 60fps target
 * 
 * @example
 * ```tsx
 * <PlayerStateOverlayHtml
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
export const PlayerStateOverlayHtml = React.memo<PlayerStateOverlayProps>(
  ({
    pain,
    balanceState,
    position,
    consciousness,
    bloodLoss = 0,
    stamina,
    isMobile,
    intensityScale = 1,
  }) => {
    return (
      <div data-testid="player-state-overlay" style={{ display: 'contents' }}>
        {/* Pain vignette - shows when pain >= 5 (see PainVignette.tsx) */}
        <PainVignette
          pain={pain}
          isMobile={isMobile}
          intensityScale={intensityScale}
        />

        {/* Balance indicator - always visible, color-coded by state (see BalanceIndicator.tsx) */}
        <BalanceIndicator
          balanceState={balanceState}
          position={position}
          isMobile={isMobile}
        />

        {/* Consciousness blur - shows when consciousness <= 90 (see ConsciousnessBlur.tsx) */}
        <ConsciousnessBlur
          consciousness={consciousness}
          isMobile={isMobile}
          intensityScale={intensityScale}
        />

        {/* Blood loss warning - pulses when bloodLoss >= 50 (see BloodLossOverlayHtml.tsx) */}
        <BloodLossOverlayHtml
          bloodLoss={bloodLoss}
          isMobile={isMobile}
          intensityScale={intensityScale}
        />

        {/* Stamina warning - flashes when stamina < 20 (see StaminaWarning.tsx) */}
        <StaminaWarning
          stamina={stamina}
          isMobile={isMobile}
          intensityScale={intensityScale}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for optimal re-render prevention
    // Only re-render if any state value actually changed
    return (
      prevProps.pain === nextProps.pain &&
      prevProps.balanceState === nextProps.balanceState &&
      prevProps.position === nextProps.position &&
      prevProps.consciousness === nextProps.consciousness &&
      prevProps.bloodLoss === nextProps.bloodLoss &&
      prevProps.stamina === nextProps.stamina &&
      prevProps.isMobile === nextProps.isMobile &&
      prevProps.intensityScale === nextProps.intensityScale
    );
  },
);

PlayerStateOverlayHtml.displayName = "PlayerStateOverlayHtml";
