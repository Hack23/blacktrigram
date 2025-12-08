/**
 * Utility functions for Player3D component integration
 * 
 * Converts PlayerState from combat system to Player3DUnifiedProps for rendering.
 * 
 * @module utils/player3DHelpers
 * @category Utilities
 * @korean 플레이어3D도우미
 */

import type { PlayerState } from "../systems";
import type { Player3DUnifiedProps, BalanceState, PlayerAnimation } from "../types/player-visual";

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
 * @param player - Current player state
 * @returns PlayerAnimation enum value
 * @korean 애니메이션상태가져오기
 */
export function getPlayerAnimation(player: PlayerState): PlayerAnimation {
  if (player.isStunned) return "hit";
  if (player.isBlocking) return "defend";
  if (player.isCountering) return "counter";
  
  // Check combat state (CombatState enum values are lowercase strings)
  switch (player.combatState) {
    case "attacking":
      return "attack";
    case "defending":
      return "defend";
    case "stunned":
      return "hit";
    case "recovering":
      return "idle";
    case "idle":
    default:
      return "idle";
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
 * @returns Props for Player3DUnified component
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
 * <Player3DUnified {...playerProps} />
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
  } = {}
): Player3DUnifiedProps {
  return {
    playerId: player.id,
    archetype: player.archetype,
    stance: player.currentStance,
    position,
    rotation,
    
    // Health and resources
    health: player.health,
    maxHealth: player.maxHealth,
    stamina: player.stamina,
    ki: player.ki,
    
    // Combat states
    pain: player.pain,
    balance: getBalanceState(player.balance),
    consciousness: player.consciousness,
    
    // Combat flags
    isBlocking: player.isBlocking,
    isStunned: player.isStunned,
    isCountering: player.isCountering,
    
    // Animation (derived from combat state)
    currentAnimation: getPlayerAnimation(player),
    
    // Display options
    name: player.name,
    isMobile: options.isMobile ?? false,
    facing: options.facing ?? "right",
    scale: options.scale ?? 1,
    showDetails: options.showDetails,
    showHealthBar: options.showHealthBar,
    showStanceIndicator: options.showStanceIndicator,
    onAnimationComplete: options.onAnimationComplete,
  };
}
