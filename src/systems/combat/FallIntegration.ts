/**
 * Fall Integration Utilities
 *
 * Helper functions to check for fall conditions and determine fall animations
 * based on balance and consciousness systems.
 *
 * @module systems/combat/FallIntegration
 * @category Combat System
 * @korean 낙법통합
 */

import type { AnimationState, FallType } from "../animation/types";
import {
  FALL_TYPE_TO_ANIMATION,
  isFallState,
  isGroundState,
} from "../animation/types";
import type { CombatSystem } from "../CombatSystem";
import type { PlayerState } from "../player";

/**
 * Result of fall check with animation state
 * @korean 낙법확인결과
 */
export interface FallCheckResult {
  /** Whether a fall should be triggered */
  readonly shouldFall: boolean;
  /** Fall type if falling */
  readonly fallType?: FallType;
  /** Animation state to transition to */
  readonly animationState?: AnimationState;
  /** Reason for fall */
  readonly reason?: "balance" | "consciousness";
}

/**
 * Checks if player should fall and determines fall animation.
 *
 * Integrates BalanceSystem and ConsciousnessSystem to check fall conditions.
 * Returns animation state to transition to if fall is triggered.
 *
 * Korean terminology:
 * - 균형상실 (Gyunhyeong Sangsil): Balance loss
 * - 의식상실 (Uisik Sangsil): Consciousness loss
 *
 * @param player - Player state to check
 * @param combatSystem - Combat system with balance and consciousness systems
 * @param lastImpactAngle - Optional angle of last impact (for consciousness falls)
 * @param attackAngle - Optional angle of current attack (for balance falls)
 * @returns Fall check result with animation state
 *
 * @example
 * ```typescript
 * const fallCheck = checkForFall(player, combatSystem, undefined, attackAngle);
 * if (fallCheck.shouldFall && fallCheck.animationState) {
 *   animationMachine.transitionTo(fallCheck.animationState);
 *   console.log(`Player falling: ${fallCheck.reason}`);
 * }
 * ```
 *
 * @public
 * @korean 낙법확인
 */
export function checkForFall(
  player: PlayerState,
  combatSystem: CombatSystem,
  lastImpactAngle?: number,
  attackAngle?: number
): FallCheckResult {
  const balanceSystem = combatSystem.getBalanceSystem();
  const consciousnessSystem = combatSystem.getConsciousnessSystem();

  // Check consciousness first (higher priority - complete loss of control)
  if (consciousnessSystem.shouldTriggerFall(player)) {
    const fallType = consciousnessSystem.determineFallType(
      player,
      lastImpactAngle
    );
    return {
      shouldFall: true,
      fallType,
      animationState: FALL_TYPE_TO_ANIMATION[fallType],
      reason: "consciousness",
    };
  }

  // Check balance (lower priority - still some control)
  if (balanceSystem.shouldTriggerFall(player)) {
    // Use attack angle if available, otherwise use stance-based fall
    const fallType =
      attackAngle !== undefined
        ? balanceSystem.determineFallType(player, attackAngle, "mid")
        : balanceSystem.determineFallTypeFromStance(player.currentStance);

    return {
      shouldFall: true,
      fallType,
      animationState: FALL_TYPE_TO_ANIMATION[fallType],
      reason: "balance",
    };
  }

  // No fall condition met
  return {
    shouldFall: false,
  };
}

/**
 * Checks if player is currently in a fall or ground animation state.
 *
 * Used to prevent other actions during falls and ground states.
 *
 * @param animationState - Current animation state
 * @returns True if player is falling or on ground
 *
 * @public
 * @korean 낙법중확인
 */
export function isInFallOrGroundState(animationState: AnimationState): boolean {
  return isFallState(animationState) || isGroundState(animationState);
}

/**
 * Gets Korean description for fall type.
 *
 * @param fallType - Type of fall
 * @returns Korean and English names
 *
 * @public
 * @korean 낙법이름
 */
export function getFallTypeName(fallType: FallType): {
  korean: string;
  english: string;
} {
  const names: Record<FallType, { korean: string; english: string }> = {
    forward: { korean: "전방낙법", english: "Forward Fall" },
    backward: { korean: "후방낙법", english: "Backward Fall" },
    side_left: { korean: "좌측낙법", english: "Left Side Fall" },
    side_right: { korean: "우측낙법", english: "Right Side Fall" },
  };

  return names[fallType];
}
