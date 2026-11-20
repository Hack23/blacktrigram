/**
 * Utility functions for Player3D component integration
 *
 * Converts PlayerState from combat system to Player3DUnifiedProps for rendering
 * with SkeletalPlayer3D (28-bone articulated body model).
 *
 * @module utils/player3DHelpers
 * @category Utilities
 * @korean 플레이어3D도우미
 */

import type { PlayerState } from "../systems";
import type { AnimationState } from "../systems/animation/core/types";
import type {
  BalanceState,
  Player3DUnifiedProps,
  PlayerAnimation,
} from "../types/player-visual";

/**
 * Only these states use a different name in the visual layer.
 *
 * @korean 애니메이션상태맵
 */
type RenamedState = Extract<AnimationState, `stance_guard_${string}` | "ko">;
const RENAMED_ANIMATION_STATES: Record<RenamedState, PlayerAnimation> = {
  ko: "death",
  stance_guard_geon: "stance_geon",
  stance_guard_tae: "stance_tae",
  stance_guard_li: "stance_li",
  stance_guard_jin: "stance_jin",
  stance_guard_son: "stance_son",
  stance_guard_gam: "stance_gam",
  stance_guard_gan: "stance_gan",
  stance_guard_gon: "stance_gon",
};

function isRenamedState(state: AnimationState): state is RenamedState {
  return Object.hasOwn(RENAMED_ANIMATION_STATES, state);
}

/**
 * Convert AnimationState to PlayerAnimation
 *
 * Maps the animation system's state types to SkeletalPlayer3D's animation types.
 *
 * @param animState - Animation state from the animation system
 * @returns Corresponding PlayerAnimation type
 * @korean 애니메이션상태변환
 */
export function animationStateToPlayerAnimation(
  animState: AnimationState
): PlayerAnimation {
  return isRenamedState(animState) ? RENAMED_ANIMATION_STATES[animState] : animState;
}

/**
 * Convert balance number (0-100) to BalanceState enum
 *
 * @param balance - Balance value from PlayerState (0-100)
 * @returns BalanceState enum value
 * @korean 균형상태변환
 */
export function getBalanceState(balance: number): BalanceState {
  if (balance >= 80) return "READY";
  if (balance >= 50) return "SHAKEN";
  if (balance >= 20) return "VULNERABLE";
  return "HELPLESS";
}

/**
 * Get current animation state from PlayerState
 *
 * Returns stance-specific idle animations when player is in idle/recovering state.
 * This ensures each trigram stance displays the correct guard pose with proper
 * leg positioning and breathing animation.
 *
 * @param player - Current player state
 * @returns PlayerAnimation enum value (stance-specific for idle states)
 * @korean 애니메이션상태가져오기
 */
export function getPlayerAnimation(player: PlayerState): PlayerAnimation {
  if (player.health <= 0) return "death";
  if (player.isStunned || player.combatState === "stunned") return "hit";
  if (player.isCountering || player.combatState === "countering") return "counter";

  switch (player.combatState) {
    case "attacking":
      return "attack";
    case "defending":
      return "defend";
    case "transitioning":
      return "stance_change";
    case "grappling":
      return "grapple_control";
    case "grappled":
      return "grapple_struggle";
    case "recovering":
    case "idle":
    default:
      return player.isBlocking ? "defend" : `stance_${player.currentStance}`;
  }
}

/**
 * Converts PlayerState to Player3DUnifiedProps for visual rendering.
 *
 * Note: This function converts base PlayerState properties used in combat.
 * Training-specific stats (misses, accuracy, comboCount) are optional in PlayerState
 * and handled separately in training contexts.
 *
 * @param player - The player state to convert
 * @param position - 3D position [x, y, z]
 * @param rotation - Rotation in radians
 * @param options - Display and behavior options
 * @returns Props for SkeletalPlayer3D component (28-bone articulated body model)
 * @korean 플레이어상태변환
 *
 * @example
 * ```tsx
 * const playerProps = convertPlayerStateToProps(
 *   playerState,
 *   [-3, 0, 0],
 *   0,
 *   { isMobile: false, showVitalPoints: false }
 * );
 *
 * <SkeletalPlayer3D {...playerProps} />
 * ```
 */
export function convertPlayerStateToProps(
  player: PlayerState,
  position: [number, number, number],
  rotation: number,
  options: {
    readonly isMobile?: boolean;
    readonly facing?: "left" | "right";
    readonly scale?: number;
    readonly showDetails?: boolean;
    readonly showHealthBar?: boolean;
    readonly showStanceIndicator?: boolean;
    readonly onAnimationComplete?: () => void;
    // Facial expression options - 얼굴 표정 옵션
    readonly enableFacialExpressions?: boolean;
    readonly enableEyeTracking?: boolean;
    readonly opponentPosition?: [number, number, number];
  } = {}
): Player3DUnifiedProps {
  return {
    playerId: player.id,
    archetype: player.archetype,
    stance: player.currentStance,
    position,
    rotation,

    health: player.health,
    maxHealth: player.maxHealth,
    stamina: player.stamina,
    ki: player.ki,

    pain: player.pain,
    balance: getBalanceState(player.balance),
    consciousness: player.consciousness,

    isBlocking: player.isBlocking,
    isStunned: player.isStunned,
    isCountering: player.isCountering,

    currentAnimation: getPlayerAnimation(player),

    name: player.name,
    isMobile: options.isMobile ?? false,
    facing: options.facing ?? "right",
    scale: options.scale ?? 1,
    showDetails: options.showDetails,
    showHealthBar: options.showHealthBar,
    showStanceIndicator: options.showStanceIndicator,
    onAnimationComplete: options.onAnimationComplete,

    enableFacialExpressions: options.enableFacialExpressions ?? false,
    enableEyeTracking: options.enableEyeTracking ?? true,
    opponentPosition: options.opponentPosition,
  };
}
