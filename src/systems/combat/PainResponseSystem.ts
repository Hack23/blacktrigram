/**
 * Pain Response System for managing cumulative pain effects in combat.
 * 
 * **Korean**: 고통 반응 시스템 (Pain Response System)
 * 
 * Implements realistic pain accumulation that progressively reduces combat
 * effectiveness. Unlike health, pain represents the body's protective response
 * to damage, reducing capabilities before critical injury occurs.
 * 
 * ## Pain Mechanics
 * 
 * - **충격통 (Shock Pain)**: Instant reaction affecting all abilities (10-30% reduction for 2-3 seconds)
 * - **누적외상 (Cumulative Trauma)**: Progressive damage impairment
 * - **통증과부하 (Pain Overload)**: Complete incapacitation from overwhelming pain (>80 pain)
 * - **무력화한계 (Incapacitation Threshold)**: Point of complete combat inability
 * 
 * ## Pain Levels
 * 
 * - **0-20**: Minimal pain - no significant effects
 * - **20-40**: Moderate pain - slight performance reduction (-10%)
 * - **40-60**: Significant pain - noticeable impairment (-20%)
 * - **60-80**: Severe pain - major limitations (-35%)
 * - **80-100**: Pain overload - chance of stun/unconsciousness, extreme impairment (-50%)
 * 
 * @module systems/combat/PainResponseSystem
 * @category Combat System
 * @korean 고통반응시스템
 */

import { PlayerState } from "../player";
import { VitalPointSeverity, VitalPointCategory } from "@/types";

/**
 * Pain level categories for status indication.
 */
export enum PainLevel {
  /** Minimal pain (0-20) - no significant effects */
  MINIMAL = "minimal",
  /** Moderate pain (20-40) - slight performance reduction (-10%) */
  MODERATE = "moderate",
  /** Significant pain (40-60) - noticeable impairment (-20%) */
  SIGNIFICANT = "significant",
  /** Severe pain (60-80) - major limitations (-35%) */
  SEVERE = "severe",
  /** Pain overload (80-100) - chance of stun/unconsciousness, extreme impairment (-50%) */
  OVERLOAD = "overload",
}

/**
 * Shock pain effect from sudden trauma.
 * 
 * **Korean**: 충격통 효과 (Shock Pain Effect)
 * 
 * Represents instant reaction to damage affecting all abilities for 2-3 seconds.
 */
export interface ShockPainEffect {
  /** Intensity of shock pain (0.1-0.3 for 10-30% reduction) */
  readonly intensity: number;
  /** Duration remaining in milliseconds (2000-3000ms) */
  readonly duration: number;
  /** Timestamp when shock pain was applied */
  readonly startTime: number;
  /** Damage value that caused the shock */
  readonly causedByDamage: number;
}

/**
 * Effects of pain on combat performance.
 */
interface PainEffects {
  /** Pain value range */
  readonly range: readonly [number, number];
  /** Overall performance penalty multiplier */
  readonly performancePenalty: number;
  /** Accuracy reduction */
  readonly accuracyReduction: number;
  /** Damage output reduction */
  readonly damageReduction: number;
  /** Movement speed reduction */
  readonly speedReduction: number;
  /** Chance of involuntary stun (0-1) */
  readonly stunChance: number;
}

/**
 * Pain Response System managing cumulative pain effects.
 * 
 * Pain accumulates from all damage sources and reduces combat effectiveness
 * progressively. High pain can incapacitate even if health remains adequate.
 * Pain dissipates slowly over time.
 * 
 * @example
 * ```typescript
 * const painSystem = new PainResponseSystem();
 * 
 * // Apply pain from damage
 * const newPlayer = painSystem.applyPain(player, 15, VitalPointSeverity.MAJOR);
 * 
 * // Check pain level
 * const level = painSystem.getPainLevel(newPlayer.pain);
 * 
 * // Apply dissipation over time
 * const recovered = painSystem.applyDissipation(newPlayer, 1000);
 * ```
 * 
 * @public
 * @korean 고통반응시스템
 */
export class PainResponseSystem {
  /**
   * Pain level effects and thresholds matching requirements.
   */
  private readonly painEffects: Record<PainLevel, PainEffects> = {
    [PainLevel.MINIMAL]: {
      range: [0, 20],
      performancePenalty: 0.0,
      accuracyReduction: 0.0,
      damageReduction: 0.0,
      speedReduction: 0.0,
      stunChance: 0.0,
    },
    [PainLevel.MODERATE]: {
      range: [20, 40],
      performancePenalty: 0.1, // -10% overall
      accuracyReduction: 0.1,
      damageReduction: 0.1,
      speedReduction: 0.05,
      stunChance: 0.0,
    },
    [PainLevel.SIGNIFICANT]: {
      range: [40, 60],
      performancePenalty: 0.2, // -20% overall
      accuracyReduction: 0.2,
      damageReduction: 0.2,
      speedReduction: 0.15,
      stunChance: 0.05, // 5% chance
    },
    [PainLevel.SEVERE]: {
      range: [60, 80],
      performancePenalty: 0.35, // -35% overall
      accuracyReduction: 0.35,
      damageReduction: 0.35,
      speedReduction: 0.25,
      stunChance: 0.15, // 15% chance
    },
    [PainLevel.OVERLOAD]: {
      range: [80, 100],
      performancePenalty: 0.5, // -50% overall
      accuracyReduction: 0.5,
      damageReduction: 0.5,
      speedReduction: 0.4,
      stunChance: 0.3, // 30% chance per hit at pain >80
    },
  };

  /**
   * Pain multipliers by vital point severity.
   */
  private readonly severityMultipliers: Record<VitalPointSeverity, number> = {
    [VitalPointSeverity.MINOR]: 0.5,
    [VitalPointSeverity.MODERATE]: 1.0,
    [VitalPointSeverity.MAJOR]: 1.5,
    [VitalPointSeverity.CRITICAL]: 2.0,
    [VitalPointSeverity.LETHAL]: 3.0,
  };

  /**
   * Pain multipliers by vital point category.
   */
  private readonly categoryMultipliers: Record<string, number> = {
    [VitalPointCategory.NEUROLOGICAL]: 2.5, // Nerve strikes cause intense pain
    [VitalPointCategory.VASCULAR]: 1.5, // Blood flow restriction
    [VitalPointCategory.RESPIRATORY]: 2.0, // Breathing difficulty causes panic
    [VitalPointCategory.SKELETAL]: 1.8, // Bone/structural damage
    [VitalPointCategory.MUSCULAR]: 1.4, // Muscle trauma
    [VitalPointCategory.ORGAN]: 2.2, // Internal organ trauma
    [VitalPointCategory.JOINT]: 1.9, // Joint damage
    [VitalPointCategory.CIRCULATORY]: 1.6, // Circulatory disruption
    default: 1.0, // Standard damage
  };

  /**
   * Base pain dissipation rate per second (requirement: -5 pain/second).
   */
  private readonly baseDissipationRate = 5.0; // -5 pain per second

  /**
   * Shock pain duration range in milliseconds (requirement: 2-3 seconds).
   */
  private readonly shockPainDuration = {
    min: 2000, // 2 seconds
    max: 3000, // 3 seconds
  };

  /**
   * Minimum damage to trigger shock pain.
   */
  private readonly shockPainThreshold = 10;

  /**
   * Pain overload threshold for stun chance (requirement: >80).
   */
  private readonly painOverloadThreshold = 80;

  /**
   * Shock pain intensity constants.
   */
  private readonly MAX_SHOCK_INTENSITY = 0.3; // 30% max reduction
  private readonly MIN_SHOCK_INTENSITY = 0.1; // 10% min reduction
  private readonly DAMAGE_SCALE_FACTOR = 100; // for normalizing damage to 0-1 range
  private readonly INTENSITY_RANGE = 0.2; // 20% variable range

  /**
   * Pain to damage ratio for cumulative trauma calculation.
   */
  private readonly PAIN_TO_DAMAGE_RATIO = 0.5;

  /**
   * Applies pain from combat damage with shock pain effects.
   * 
   * Calculates pain increase based on damage amount, vital point severity,
   * and vital point category. Also determines if shock pain effect should be triggered.
   * 
   * **Shock Pain**: Instant 10-30% reduction for 2-3 seconds on significant hits (>=10 damage)
   * **Cumulative Trauma**: Progressive pain accumulation that reduces performance
   * **Pain Overload**: At >80 pain, chance of stun/unconsciousness
   * 
   * @param player - Current player state
   * @param damage - Base damage amount
   * @param severity - Optional vital point severity
   * @param category - Optional vital point category for more accurate pain calculation
   * @returns Updated player state with increased pain and optional shock effect
   * 
   * @example
   * ```typescript
   * // Normal hit
   * const result = system.applyPain(player, 10);
   * 
   * // Vital point neurological hit with shock pain
   * const result = system.applyPain(
   *   player, 
   *   20, 
   *   VitalPointSeverity.MAJOR,
   *   VitalPointCategory.NEUROLOGICAL
   * );
   * if (result.shockEffect) {
   *   console.log(`Shock pain active for ${result.shockEffect.duration}ms`);
   * }
   * ```
   * 
   * @public
   * @korean 고통적용
   */
  applyPain(
    player: PlayerState,
    damage: number,
    severity?: VitalPointSeverity,
    category?: VitalPointCategory
  ): { player: PlayerState; shockEffect?: ShockPainEffect } {
    // Get multipliers based on severity and category
    const severityMultiplier = severity
      ? this.severityMultipliers[severity]
      : 1.0;
    
    const categoryMultiplier = category
      ? this.categoryMultipliers[category] ?? this.categoryMultipliers.default
      : this.categoryMultipliers.default;

    // Calculate pain increase (cumulative trauma)
    const painIncrease = damage * severityMultiplier * categoryMultiplier * this.PAIN_TO_DAMAGE_RATIO;

    // Apply pain, clamped to 0-100
    const newPain = Math.max(0, Math.min(100, player.pain + painIncrease));

    let shockEffect: ShockPainEffect | undefined;

    // Trigger shock pain for significant hits (>=10 damage)
    if (damage >= this.shockPainThreshold) {
      // Calculate shock intensity: 10-30% reduction based on damage
      const shockIntensity = Math.min(
        this.MAX_SHOCK_INTENSITY,
        this.MIN_SHOCK_INTENSITY + (damage / this.DAMAGE_SCALE_FACTOR) * this.INTENSITY_RANGE
      );
      
      // Random duration between 2-3 seconds
      const shockDuration =
        this.shockPainDuration.min +
        Math.random() *
          (this.shockPainDuration.max - this.shockPainDuration.min);

      shockEffect = {
        intensity: shockIntensity,
        duration: shockDuration,
        startTime: Date.now(),
        causedByDamage: damage,
      };
    }

    const updatedPlayer: PlayerState = {
      ...player,
      pain: newPain,
    };

    return { player: updatedPlayer, shockEffect };
  }

  /**
   * Applies pain dissipation over time (requirement: -5 pain/second).
   * 
   * Pain naturally dissipates when not taking damage at a constant rate
   * of -5 pain per second.
   * 
   * @param player - Current player state
   * @param deltaTime - Time elapsed in milliseconds
   * @returns Updated player state with reduced pain
   * 
   * @example
   * ```typescript
   * // In game loop (~60fps, 16ms per frame)
   * player = system.applyDissipation(player, 16);
   * ```
   * 
   * @public
   * @korean 고통감소
   */
  applyDissipation(player: PlayerState, deltaTime: number): PlayerState {
    // Already at zero pain
    if (player.pain <= 0) {
      return player;
    }

    const deltaSeconds = deltaTime / 1000;
    
    // Constant dissipation rate of -5 pain/second
    const dissipation = this.baseDissipationRate * deltaSeconds;
    const newPain = Math.max(0, player.pain - dissipation);

    return {
      ...player,
      pain: newPain,
    };
  }

  /**
   * Determines pain level from pain value.
   * 
   * @param pain - Pain value (0-100)
   * @returns Current pain level
   * 
   * @public
   * @korean 고통수준확인
   */
  getPainLevel(pain: number): PainLevel {
    if (pain >= 80) return PainLevel.OVERLOAD;
    if (pain >= 60) return PainLevel.SEVERE;
    if (pain >= 40) return PainLevel.SIGNIFICANT;
    if (pain >= 20) return PainLevel.MODERATE;
    return PainLevel.MINIMAL;
  }

  /**
   * Gets effects for a specific pain level.
   * 
   * @param level - Pain level
   * @returns Effects applied at that level
   * 
   * @public
   * @korean 고통효과
   */
  getEffects(level: PainLevel): PainEffects {
    return this.painEffects[level];
  }

  /**
   * Applies pain effects to player state, including shock pain.
   * 
   * Modifies player stats based on current pain level. When shock pain
   * is active, additional penalties are applied temporarily.
   * 
   * @param player - Current player state
   * @param shockEffect - Optional active shock pain effect
   * @returns Modified player state with pain effects
   * 
   * @public
   * @korean 고통효과적용
   */
  applyEffects(
    player: PlayerState,
    shockEffect?: ShockPainEffect
  ): PlayerState {
    const level = this.getPainLevel(player.pain);
    const effects = this.getEffects(level);

    // Calculate total penalties (base pain + shock pain if active)
    let totalAccuracyPenalty = effects.accuracyReduction;
    let totalDamagePenalty = effects.damageReduction;

    // Apply shock pain if still active
    if (shockEffect) {
      const elapsed = Date.now() - shockEffect.startTime;
      if (elapsed < shockEffect.duration) {
        // Add shock pain intensity to penalties
        totalAccuracyPenalty = Math.min(
          1.0,
          totalAccuracyPenalty + shockEffect.intensity
        );
        totalDamagePenalty = Math.min(
          1.0,
          totalDamagePenalty + shockEffect.intensity
        );
      }
    }

    return {
      ...player,
      attackPower: Math.floor(
        player.attackPower * (1 - totalDamagePenalty)
      ),
      defense: Math.floor(
        player.defense * (1 - effects.performancePenalty)
      ),
      speed: Math.floor(
        player.speed * (1 - effects.speedReduction)
      ),
      technique: Math.floor(
        player.technique * (1 - totalAccuracyPenalty)
      ),
    };
  }

  /**
   * Checks if pain overload should trigger stun.
   * 
   * At pain >80, there's a chance per hit to trigger stun based on pain level.
   * Pain Overload level has 30% chance to trigger stun.
   * 
   * @param player - Current player state
   * @returns True if player should be stunned from pain
   * 
   * @public
   * @korean 고통기절확인
   */
  shouldTriggerStun(player: PlayerState): boolean {
    if (player.pain < this.painOverloadThreshold) {
      return false;
    }

    const level = this.getPainLevel(player.pain);
    const effects = this.getEffects(level);

    // Roll for stun chance
    return Math.random() < effects.stunChance;
  }

  /**
   * Checks if player is in pain overload state (>80 pain).
   * 
   * @param player - Current player state
   * @returns True if pain is above overload threshold
   * 
   * @public
   * @korean 고통과부하확인
   */
  isInPainOverload(player: PlayerState): boolean {
    return player.pain >= this.painOverloadThreshold;
  }

  /**
   * Checks if player is incapacitated by pain.
   * 
   * @param player - Current player state
   * @returns True if pain is at overload level
   * 
   * @public
   * @korean 고통무력화확인
   */
  isIncapacitated(player: PlayerState): boolean {
    return this.getPainLevel(player.pain) === PainLevel.OVERLOAD;
  }

  /**
   * Gets bilingual name for pain level.
   * 
   * @param level - Pain level
   * @returns Korean and English level names
   * 
   * @public
   * @korean 고통이름
   */
  getLevelName(level: PainLevel): { korean: string; english: string } {
    const names: Record<PainLevel, { korean: string; english: string }> = {
      [PainLevel.MINIMAL]: {
        korean: "최소",
        english: "Minimal",
      },
      [PainLevel.MODERATE]: {
        korean: "보통",
        english: "Moderate",
      },
      [PainLevel.SIGNIFICANT]: {
        korean: "상당",
        english: "Significant",
      },
      [PainLevel.SEVERE]: {
        korean: "심각",
        english: "Severe",
      },
      [PainLevel.OVERLOAD]: {
        korean: "과부하",
        english: "Overload",
      },
    };

    return names[level];
  }

  /**
   * Gets description of pain level effects.
   * 
   * @param level - Pain level
   * @returns Bilingual description
   * 
   * @public
   * @korean 고통설명
   */
  getLevelDescription(level: PainLevel): {
    korean: string;
    english: string;
  } {
    const descriptions: Record<
      PainLevel,
      { korean: string; english: string }
    > = {
      [PainLevel.MINIMAL]: {
        korean: "최소한의 고통, 전투 능력에 영향 없음",
        english: "Minimal pain, no significant effects on combat",
      },
      [PainLevel.MODERATE]: {
        korean: "보통 고통, 약간의 능력 저하 (-10%)",
        english: "Moderate pain, slight performance reduction (-10%)",
      },
      [PainLevel.SIGNIFICANT]: {
        korean: "상당한 고통, 명확한 손상 (-20%)",
        english: "Significant pain, noticeable impairment (-20%)",
      },
      [PainLevel.SEVERE]: {
        korean: "심각한 고통, 주요 제한 (-35%)",
        english: "Severe pain, major limitations (-35%)",
      },
      [PainLevel.OVERLOAD]: {
        korean: "고통 과부하, 기절 위험 (-50%, 30% 기절 확률)",
        english: "Pain overload, stun risk (-50%, 30% stun chance)",
      },
    };

    return descriptions[level];
  }
}

export default PainResponseSystem;
