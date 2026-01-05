/**
 * Consciousness System for managing awareness and cognitive function levels.
 * 
 * **Korean**: 의식 시스템 (Consciousness System)
 * 
 * Implements consciousness levels based on head trauma, blood flow restriction,
 * and neural damage. Consciousness affects reaction time, targeting precision,
 * and overall combat effectiveness.
 * 
 * ## Consciousness Levels
 * 
 * - **전투각성 (Combat Alert)**: 100% - Full awareness, optimal combat ability
 * - **혼란상태 (Disoriented)**: 70% - Reduced reaction, vulnerability window
 * - **기절직전 (Stunned)**: 40% - Severe impairment, incapacitation opportunity
 * - **무의식 (Unconscious)**: 0% - Complete incapacitation
 * 
 * ## Fall System Integration
 * 
 * When consciousness drops below 10%, the system triggers fall animations (낙법).
 * The character loses the ability to stand and collapses to the ground.
 * Fall direction is based on last impact location.
 * 
 * @module systems/combat/ConsciousnessSystem
 * @category Combat System
 * @korean 의식시스템
 */

import { PlayerState } from "../player";
import { VitalPointCategory } from "@/types";
import type { FallType } from "../animation/types";
import { determineFallFromStance } from "../animation/FallAnimations";
import type { TrigramStance } from "@/types/common";

/**
 * Consciousness levels representing cognitive function and awareness.
 * 
 * **Korean**: 의식 수준
 */
export enum ConsciousnessLevel {
  /** Full combat awareness (90-100%) */
  COMBAT_ALERT = "combat_alert",
  /** Disoriented and vulnerable (50-89%) */
  DISORIENTED = "disoriented",
  /** Severely stunned (10-49%) */
  STUNNED = "stunned",
  /** Completely unconscious (0-9%) */
  UNCONSCIOUS = "unconscious",
}

/**
 * Effects of consciousness levels on combat performance.
 */
interface ConsciousnessEffects {
  /** Consciousness value range */
  readonly range: readonly [number, number];
  /** Reaction time multiplier */
  readonly reactionTimeMultiplier: number;
  /** Accuracy penalty */
  readonly accuracyPenalty: number;
  /** Defense penalty */
  readonly defensePenalty: number;
  /** Can perform actions */
  readonly canAct: boolean;
  /** Vision clarity multiplier */
  readonly visionClarity: number;
}

/**
 * Consciousness System managing awareness and cognitive function.
 * 
 * Tracks consciousness damage from:
 * - Head trauma (strikes to head region)
 * - Neurological vital point hits
 * - Blood flow restriction (vascular hits)
 * - Respiratory disruption
 * 
 * Consciousness naturally recovers over time when not taking damage.
 * 
 * @example
 * ```typescript
 * const consciousnessSystem = new ConsciousnessSystem();
 * 
 * // Apply damage from head strike
 * const newPlayer = consciousnessSystem.applyDamage(
 *   player,
 *   15,
 *   VitalPointCategory.NEUROLOGICAL
 * );
 * 
 * // Check consciousness level
 * const level = consciousnessSystem.getLevel(newPlayer.consciousness);
 * console.log(`Consciousness: ${level}`);
 * 
 * // Apply recovery over time
 * const recovered = consciousnessSystem.applyRecovery(newPlayer, 1000);
 * ```
 * 
 * @public
 * @korean 의식시스템
 */
export class ConsciousnessSystem {
  /**
   * Consciousness level effects and thresholds.
   */
  private readonly levelEffects: Record<ConsciousnessLevel, ConsciousnessEffects> = {
    [ConsciousnessLevel.COMBAT_ALERT]: {
      range: [90, 100],
      reactionTimeMultiplier: 1.0,
      accuracyPenalty: 0.0,
      defensePenalty: 0.0,
      canAct: true,
      visionClarity: 1.0,
    },
    [ConsciousnessLevel.DISORIENTED]: {
      range: [50, 89],
      reactionTimeMultiplier: 1.3, // 30% slower reactions
      accuracyPenalty: 0.2, // -20% accuracy
      defensePenalty: 0.15, // -15% defense
      canAct: true,
      visionClarity: 0.7,
    },
    [ConsciousnessLevel.STUNNED]: {
      range: [20, 49], // Updated: Changed from [10, 49] to [20, 49]
      reactionTimeMultiplier: 2.0, // 2x slower reactions
      accuracyPenalty: 0.5, // -50% accuracy
      defensePenalty: 0.4, // -40% defense
      canAct: true,
      visionClarity: 0.4,
    },
    [ConsciousnessLevel.UNCONSCIOUS]: {
      range: [0, 19], // Updated: Changed from [0, 9] to [0, 19] - incapacitation threshold <20%
      reactionTimeMultiplier: Infinity,
      accuracyPenalty: 1.0, // Complete inability
      defensePenalty: 1.0, // No defense
      canAct: false,
      visionClarity: 0.0,
    },
  };

  /**
   * Damage multipliers by vital point category affecting consciousness.
   */
  private readonly categoryMultipliers: Record<string, number> = {
    [VitalPointCategory.NEUROLOGICAL]: 3.0, // Nerve strikes heavily affect consciousness
    [VitalPointCategory.VASCULAR]: 2.0, // Blood flow restriction
    [VitalPointCategory.RESPIRATORY]: 1.5, // Breathing difficulty
    default: 0.5, // Other damage has minor effect
  };

  /**
   * Base recovery rate per second.
   */
  private readonly baseRecoveryRate = 5.0; // 5 points per second

  /**
   * Incapacitation threshold - consciousness <20% renders player helpless.
   * 
   * **Korean**: 무력화한계 (Incapacitation Threshold)
   */
  private readonly incapacitationThreshold = 20;

  /**
   * Duration of helplessness when consciousness drops below threshold (3-5 seconds).
   */
  private readonly helplessDuration = {
    min: 3000, // 3 seconds
    max: 5000, // 5 seconds
  };

  /**
   * Time without head trauma required for consciousness recovery (5 seconds).
   */
  private readonly noTraumaRecoveryTime = 5000; // 5 seconds

  /**
   * Applies consciousness damage from combat.
   * 
   * Calculates consciousness reduction based on damage amount and
   * vital point category. Neurological and vascular damage have
   * the highest impact on consciousness.
   * 
   * @param player - Current player state
   * @param damage - Base damage amount
   * @param category - Vital point category hit
   * @returns Updated player state with reduced consciousness
   * 
   * @example
   * ```typescript
   * // Head strike causes significant consciousness damage
   * const newPlayer = system.applyDamage(
   *   player,
   *   20,
   *   VitalPointCategory.NEUROLOGICAL
   * );
   * console.log(`Consciousness: ${newPlayer.consciousness}`);
   * ```
   * 
   * @public
   * @korean 의식피해적용
   */
  applyDamage(
    player: PlayerState,
    damage: number,
    category?: VitalPointCategory
  ): PlayerState {
    // Get multiplier based on category
    const multiplier = category
      ? this.categoryMultipliers[category] ?? this.categoryMultipliers.default
      : this.categoryMultipliers.default;

    // Calculate consciousness damage
    const consciousnessDamage = damage * multiplier;

    // Apply damage, clamped to 0-100 range
    const newConsciousness = Math.max(
      0,
      Math.min(100, player.consciousness - consciousnessDamage)
    );

    return {
      ...player,
      consciousness: newConsciousness,
    };
  }

  /**
   * Applies consciousness recovery over time.
   * 
   * Consciousness naturally recovers when not taking damage.
   * Recovery rate depends on current level - severely stunned
   * players recover more slowly.
   * 
   * **Note**: Full recovery only occurs after 5 seconds without head trauma.
   * 
   * @param player - Current player state
   * @param deltaTime - Time elapsed in milliseconds
   * @param lastHeadTraumaTime - Timestamp of last head trauma (optional)
   * @returns Updated player state with recovered consciousness
   * 
   * @example
   * ```typescript
   * // In game loop (60fps, ~16ms per frame)
   * player = system.applyRecovery(player, 16, player.lastActionTime);
   * ```
   * 
   * @public
   * @korean 의식회복
   */
  applyRecovery(
    player: PlayerState, 
    deltaTime: number,
    lastHeadTraumaTime?: number
  ): PlayerState {
    // Already at full consciousness
    if (player.consciousness >= 100) {
      return player;
    }

    // Check if enough time has passed since last head trauma
    const timeSinceTrauma = lastHeadTraumaTime 
      ? Date.now() - lastHeadTraumaTime 
      : Infinity;
    
    // Don't recover if head trauma is recent (within 5 seconds)
    if (timeSinceTrauma < this.noTraumaRecoveryTime) {
      return player;
    }

    // Calculate recovery based on time
    const deltaSeconds = deltaTime / 1000;
    const level = this.getLevel(player.consciousness);

    // Recovery rate modifier based on level
    let recoveryModifier = 1.0;
    if (level === ConsciousnessLevel.STUNNED) {
      recoveryModifier = 0.5; // Slower recovery when stunned
    } else if (level === ConsciousnessLevel.UNCONSCIOUS) {
      recoveryModifier = 0.2; // Very slow recovery when unconscious
    }

    const recovery = this.baseRecoveryRate * deltaSeconds * recoveryModifier;
    const newConsciousness = Math.min(100, player.consciousness + recovery);

    return {
      ...player,
      consciousness: newConsciousness,
    };
  }

  /**
   * Determines consciousness level from consciousness value.
   * 
   * Updated thresholds:
   * - 90-100: Combat Alert
   * - 50-89: Disoriented
   * - 20-49: Stunned
   * - 0-19: Unconscious (incapacitation threshold <20%)
   * 
   * @param consciousness - Consciousness value (0-100)
   * @returns Current consciousness level
   * 
   * @example
   * ```typescript
   * const level = system.getLevel(75);
   * console.log(level); // DISORIENTED
   * 
   * const level2 = system.getLevel(15);
   * console.log(level2); // UNCONSCIOUS (below incapacitation threshold)
   * ```
   * 
   * @public
   * @korean 의식수준확인
   */
  getLevel(consciousness: number): ConsciousnessLevel {
    if (consciousness >= 90) return ConsciousnessLevel.COMBAT_ALERT;
    if (consciousness >= 50) return ConsciousnessLevel.DISORIENTED;
    if (consciousness >= 20) return ConsciousnessLevel.STUNNED;
    return ConsciousnessLevel.UNCONSCIOUS;
  }

  /**
   * Gets effects for a specific consciousness level.
   * 
   * @param level - Consciousness level
   * @returns Effects applied at that level
   * 
   * @public
   * @korean 의식효과
   */
  getEffects(level: ConsciousnessLevel): ConsciousnessEffects {
    return this.levelEffects[level];
  }

  /**
   * Applies consciousness effects to player state.
   * 
   * Modifies player stats based on current consciousness level.
   * 
   * @param player - Current player state
   * @returns Modified player state with consciousness effects
   * 
   * @public
   * @korean 의식효과적용
   */
  applyEffects(player: PlayerState): PlayerState {
    const level = this.getLevel(player.consciousness);
    const effects = this.getEffects(level);

    return {
      ...player,
      attackPower: Math.floor(
        player.attackPower * (1 - effects.accuracyPenalty)
      ),
      defense: Math.floor(player.defense * (1 - effects.defensePenalty)),
      technique: Math.floor(
        player.technique * (1 - effects.accuracyPenalty)
      ),
      isStunned:
        player.isStunned ||
        level === ConsciousnessLevel.UNCONSCIOUS ||
        level === ConsciousnessLevel.STUNNED,
    };
  }

  /**
   * Checks if player is at incapacitation threshold.
   * 
   * **Korean**: 무력화한계 (Incapacitation Threshold)
   * 
   * When consciousness drops below 20%, player becomes helpless for 3-5 seconds.
   * 
   * @param player - Current player state
   * @returns True if consciousness is below incapacitation threshold (<20%)
   * 
   * @example
   * ```typescript
   * if (system.isAtIncapacitationThreshold(player)) {
   *   // Player is helpless, trigger helpless state
   *   const helplessDuration = system.getHelplessDuration();
   *   console.log(`Player helpless for ${helplessDuration}ms`);
   * }
   * ```
   * 
   * @public
   * @korean 무력화한계확인
   */
  isAtIncapacitationThreshold(player: PlayerState): boolean {
    return player.consciousness < this.incapacitationThreshold;
  }

  /**
   * Gets random helpless duration when consciousness drops below threshold.
   * 
   * Returns a random duration between 3-5 seconds (3000-5000ms).
   * 
   * @returns Helpless duration in milliseconds
   * 
   * @public
   * @korean 무력화지속시간
   */
  getHelplessDuration(): number {
    return (
      this.helplessDuration.min +
      Math.random() * (this.helplessDuration.max - this.helplessDuration.min)
    );
  }

  /**
   * Checks if enough time has passed for consciousness recovery.
   * 
   * Consciousness only recovers after 5 seconds without head trauma.
   * 
   * @param lastHeadTraumaTime - Timestamp of last head trauma
   * @returns True if recovery is allowed
   * 
   * @public
   * @korean 회복가능확인
   */
  canRecover(lastHeadTraumaTime: number): boolean {
    const timeSinceTrauma = Date.now() - lastHeadTraumaTime;
    return timeSinceTrauma >= this.noTraumaRecoveryTime;
  }

  /**
   * Checks if player is incapacitated due to consciousness.
   * 
   * @param player - Current player state
   * @returns True if player is unconscious
   * 
   * @public
   * @korean 무의식확인
   */
  isIncapacitated(player: PlayerState): boolean {
    return this.getLevel(player.consciousness) === ConsciousnessLevel.UNCONSCIOUS;
  }

  /**
   * Gets bilingual name for consciousness level.
   * 
   * @param level - Consciousness level
   * @returns Korean and English level names
   * 
   * @public
   * @korean 의식이름
   */
  getLevelName(level: ConsciousnessLevel): { korean: string; english: string } {
    const names: Record<ConsciousnessLevel, { korean: string; english: string }> = {
      [ConsciousnessLevel.COMBAT_ALERT]: {
        korean: "전투각성",
        english: "Combat Alert",
      },
      [ConsciousnessLevel.DISORIENTED]: {
        korean: "혼란상태",
        english: "Disoriented",
      },
      [ConsciousnessLevel.STUNNED]: {
        korean: "기절직전",
        english: "Stunned",
      },
      [ConsciousnessLevel.UNCONSCIOUS]: {
        korean: "무의식",
        english: "Unconscious",
      },
    };

    return names[level];
  }

  /**
   * Gets description of consciousness level effects.
   * 
   * @param level - Consciousness level
   * @returns Bilingual description
   * 
   * @public
   * @korean 의식설명
   */
  getLevelDescription(level: ConsciousnessLevel): {
    korean: string;
    english: string;
  } {
    const descriptions: Record<
      ConsciousnessLevel,
      { korean: string; english: string }
    > = {
      [ConsciousnessLevel.COMBAT_ALERT]: {
        korean: "완전한 의식과 전투 능력",
        english: "Full awareness and combat ability",
      },
      [ConsciousnessLevel.DISORIENTED]: {
        korean: "반응 시간 저하 및 혼란",
        english: "Reduced reaction time and confusion",
      },
      [ConsciousnessLevel.STUNNED]: {
        korean: "심각한 손상, 무력화 위험",
        english: "Severe impairment, incapacitation risk",
      },
      [ConsciousnessLevel.UNCONSCIOUS]: {
        korean: "완전한 무의식 상태",
        english: "Complete unconsciousness",
      },
    };

    return descriptions[level];
  }

  /**
   * Gets color indicator for consciousness level (for UI).
   * 
   * @param level - Consciousness level
   * @returns Hex color code
   * 
   * @public
   * @korean 의식색상
   */
  getLevelColor(level: ConsciousnessLevel): number {
    const colors: Record<ConsciousnessLevel, number> = {
      [ConsciousnessLevel.COMBAT_ALERT]: 0x00ff00, // Green
      [ConsciousnessLevel.DISORIENTED]: 0xffaa00, // Orange
      [ConsciousnessLevel.STUNNED]: 0xff4400, // Red-orange
      [ConsciousnessLevel.UNCONSCIOUS]: 0xff0000, // Red
    };

    return colors[level];
  }

  /**
   * Checks if consciousness is low enough to trigger fall animation.
   * 
   * Falls occur when consciousness drops below 10% (UNCONSCIOUS threshold).
   * This represents complete loss of ability to maintain standing position.
   * 
   * Korean terminology:
   * - 의식상실낙법 (Uisik Sangsil Nakbeop): Consciousness loss fall
   * - 기절낙하 (Gijeol Nakha): Knockout collapse
   * 
   * @param player - Current player state
   * @returns True if fall animation should trigger
   * 
   * @example
   * ```typescript
   * if (consciousnessSystem.shouldTriggerFall(player)) {
   *   const fallType = consciousnessSystem.determineFallType(
   *     player,
   *     lastImpactAngle
   *   );
   *   animationMachine.transitionTo(FALL_TYPE_TO_ANIMATION[fallType]);
   * }
   * ```
   * 
   * @public
   * @korean 의식상실낙법확인
   */
  shouldTriggerFall(player: PlayerState): boolean {
    return player.consciousness < 10; // UNCONSCIOUS threshold
  }

  /**
   * Determines fall direction based on last impact and stance.
   * 
   * When consciousness is lost, fall direction is determined by:
   * - Last attack angle (if available)
   * - Current stance bias (if no attack data)
   * - Default to backward fall (natural collapse)
   * 
   * Korean falling from consciousness loss:
   * - 후방의식상실 (Hubang Uisik Sangsil): Backward consciousness loss fall
   * - 전방기절 (Jeonbang Gijeol): Forward knockout
   * 
   * @param player - Current player state
   * @param lastImpactAngle - Angle of last hit (optional)
   * @returns Fall type to use for animation
   * 
   * @example
   * ```typescript
   * // Player loses consciousness from frontal head strike
   * const fallType = consciousnessSystem.determineFallType(
   *   player,
   *   0 // Front angle
   * );
   * // Returns: 'backward' (knocked back by frontal strike)
   * 
   * // Player loses consciousness without specific impact
   * const fallType = consciousnessSystem.determineFallType(player);
   * // Returns: Stance-based fall or 'backward' default
   * ```
   * 
   * @public
   * @korean 의식상실낙법결정
   */
  determineFallType(
    _player: PlayerState,
    lastImpactAngle?: number
  ): FallType {
    // If we have impact angle, use simple direction logic
    if (lastImpactAngle !== undefined) {
      const normalizedAngle = Math.abs(lastImpactAngle);
      
      // Front impact (0° ±45°) causes backward fall
      if (normalizedAngle < Math.PI / 4) {
        return "backward";
      }
      
      // Rear impact (180° ±45°) causes forward fall
      if (normalizedAngle > (3 * Math.PI) / 4 && normalizedAngle < (5 * Math.PI) / 4) {
        return "forward";
      }
      
      // Side impacts
      if (lastImpactAngle < 0) {
        return "side_left";
      } else {
        return "side_right";
      }
    }
    
    // Default to backward fall (natural collapse from consciousness loss)
    return "backward";
  }

  /**
   * Determines fall type based on stance when consciousness is lost.
   * 
   * Uses stance bias to determine fall direction when consciousness
   * is lost without specific impact data.
   * 
   * Korean terminology:
   * - 자세의식상실 (Jase Uisik Sangsil): Stance-based consciousness loss
   * 
   * @param stance - Current trigram stance
   * @returns Fall type based on stance characteristics
   * 
   * @example
   * ```typescript
   * // Player in Mountain stance (defensive back)
   * const fallType = consciousnessSystem.determineFallTypeFromStance(
   *   TrigramStance.GAN
   * );
   * // Returns: 'backward' (Mountain has defensive backward bias)
   * ```
   * 
   * @public
   * @korean 자세의식상실낙법
   */
  determineFallTypeFromStance(stance: TrigramStance): FallType {
    return determineFallFromStance(stance, "backward");
  }
}

export default ConsciousnessSystem;
