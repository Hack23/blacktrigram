/**
 * Injury-Based Movement Modifier System
 * 
 * **Korean**: 손상 기반 이동 시스템 (Injury-Based Movement System)
 * 
 * Dynamically calculates movement speed modifiers based on leg injuries, torso
 * damage, stance configuration, and pain levels. Part of the 12 combat realism
 * systems for authentic Korean martial arts gameplay.
 * 
 * ## Movement Speed Calculation
 * 
 * Base speed is modified by multiple factors:
 * - **Leg Injuries**: 0-100% penalty based on health
 * - **Torso Injuries**: 0-30% minor penalty
 * - **Both Legs Injured**: Additional 20% cumulative penalty
 * - **Stance Modifiers**: -20% (defensive) to +10% (offensive)
 * - **Pain Overload**: -15% when pain > 80
 * 
 * ## Injury Severity Thresholds
 * 
 * | Leg Health | State | Speed Penalty |
 * |-----------|-------|---------------|
 * | 70-100% | Normal | 0% |
 * | 30-69% | Limping | 0-40% |
 * | 10-29% | Severe Limp | 40-80% |
 * | 0-9% | Critical | 80-100% |
 * 
 * @module systems/movement/InjuryMovementModifier
 * @category Movement System
 * @korean 손상기반이동
 */

import { TrigramStance } from "@/types/common";
import { BodyPartHealth } from "../bodypart/types";

/**
 * Configuration for injury-based movement calculations.
 * 
 * **Korean**: 손상 이동 설정
 * 
 * @public
 * @category Movement System
 */
export interface InjuryMovementConfig {
  /** Leg health thresholds for injury states */
  readonly legThresholds: {
    readonly normal: number;       // 70% - no penalty
    readonly limping: number;      // 30% - start of severe penalty
    readonly critical: number;     // 10% - near-maximum penalty
  };
  /** Maximum torso injury penalty (0.3 = 30%) */
  readonly maxTorsoPenalty: number;
  /** Both legs injured cumulative penalty multiplier (0.8 = -20%) */
  readonly bothLegsInjuredMultiplier: number;
  /** Pain overload threshold (80) */
  readonly painOverloadThreshold: number;
  /** Pain overload penalty multiplier (0.85 = -15%) */
  readonly painOverloadMultiplier: number;
  /** Minimum speed multiplier (0.1 = 10% of base speed) */
  readonly minSpeedMultiplier: number;
}

/**
 * Default configuration matching acceptance criteria.
 */
export const DEFAULT_INJURY_MOVEMENT_CONFIG: InjuryMovementConfig = {
  legThresholds: {
    normal: 70,
    limping: 30,
    critical: 10,
  },
  maxTorsoPenalty: 0.3,
  bothLegsInjuredMultiplier: 0.8,
  painOverloadThreshold: 80,
  painOverloadMultiplier: 0.85,
  minSpeedMultiplier: 0.1,
} as const;

/**
 * Stance speed modifiers for eight trigram stances.
 * 
 * **Korean**: 자세 속도 배수
 * 
 * Based on Korean martial arts philosophy:
 * - Defensive stances (Gan, Gon) are slower (-20%)
 * - Offensive stances (Li, Jin, Son) are faster (+10-25%)
 * - Balanced stances (Geon, Tae, Gam) are neutral to slightly faster
 * 
 * @public
 * @category Movement System
 */
export const STANCE_SPEED_MODIFIERS: Record<TrigramStance, number> = {
  [TrigramStance.GEON]: 1.0,   // Heaven: balanced
  [TrigramStance.TAE]: 1.1,    // Lake: fluid (+10%)
  [TrigramStance.LI]: 1.2,     // Fire: aggressive (+20%)
  [TrigramStance.JIN]: 1.15,   // Thunder: explosive (+15%)
  [TrigramStance.SON]: 1.25,   // Wind: fastest (+25%)
  [TrigramStance.GAM]: 1.05,   // Water: adaptive (+5%)
  [TrigramStance.GAN]: 0.8,    // Mountain: defensive (-20%)
  [TrigramStance.GON]: 0.85,   // Earth: grounded (-15%)
};

/**
 * Result of injury-based movement calculation.
 * 
 * **Korean**: 손상 이동 결과
 * 
 * @public
 * @category Movement System
 */
export interface InjuryMovementResult {
  /** Final speed in units/second */
  readonly finalSpeed: number;
  /** Combined speed multiplier (0.1-1.0+) */
  readonly speedMultiplier: number;
  /** Breakdown of penalty sources */
  readonly penalties: {
    readonly leftLegPenalty: number;
    readonly rightLegPenalty: number;
    readonly torsoPenalty: number;
    readonly bothLegsInjured: boolean;
    readonly stanceModifier: number;
    readonly painOverload: boolean;
  };
  /** Whether player is limping */
  readonly isLimping: boolean;
  /** Whether player has severe limp */
  readonly isSevereLimp: boolean;
  /** Bilingual status text */
  readonly statusText: {
    readonly korean: string;
    readonly english: string;
  };
}

/**
 * Injury-Based Movement Modifier System.
 * 
 * **Korean**: 손상 기반 이동 수정자 시스템
 * 
 * Calculates dynamic movement speed based on injuries, stance, and pain.
 * Integrates with MovementPhysics to apply realistic combat trauma effects.
 * 
 * @example
 * ```typescript
 * const modifier = new InjuryMovementModifier();
 * 
 * const result = modifier.calculateMovementSpeed(
 *   5.0,                    // base speed
 *   bodyPartHealth,         // current health
 *   TrigramStance.GEON,     // current stance
 *   65                      // pain level
 * );
 * 
 * console.log(`Speed: ${result.finalSpeed} m/s`);
 * console.log(`Status: ${result.statusText.korean} | ${result.statusText.english}`);
 * ```
 * 
 * @public
 * @category Movement System
 * @korean 손상기반이동수정자
 */
export class InjuryMovementModifier {
  private readonly config: InjuryMovementConfig;

  /**
   * Creates a new InjuryMovementModifier with optional configuration.
   * 
   * @param config - Optional configuration overrides
   */
  constructor(config?: Partial<InjuryMovementConfig>) {
    this.config = {
      ...DEFAULT_INJURY_MOVEMENT_CONFIG,
      ...config,
    };
  }

  /**
   * Calculate modified movement speed based on all injury factors.
   * 
   * **Korean**: 이동 속도 계산
   * 
   * Applies penalties from:
   * 1. Leg injuries (primary factor)
   * 2. Torso injuries (minor factor)
   * 3. Both legs injured (cumulative penalty)
   * 4. Stance modifiers
   * 5. Pain overload
   * 
   * @param baseSpeed - Base movement speed (m/s)
   * @param bodyPartHealth - Current body part health values
   * @param stance - Current trigram stance
   * @param painLevel - Current pain level (0-100)
   * @returns Complete movement calculation result
   * 
   * @public
   * @korean 이동속도계산
   */
  public calculateMovementSpeed(
    baseSpeed: number,
    bodyPartHealth: BodyPartHealth,
    stance: TrigramStance,
    painLevel: number
  ): InjuryMovementResult {
    // Calculate individual leg penalties
    const leftLegPenalty = this.calculateLegPenalty(bodyPartHealth.legLeft);
    const rightLegPenalty = this.calculateLegPenalty(bodyPartHealth.legRight);

    // Use worst leg penalty as base
    const baseLegPenalty = Math.max(leftLegPenalty, rightLegPenalty);
    let speedMultiplier = 1.0 - baseLegPenalty;

    // Check if both legs are significantly injured (>30% penalty each)
    const bothLegsInjured = leftLegPenalty > 0.3 && rightLegPenalty > 0.3;
    if (bothLegsInjured) {
      // Additional 20% penalty when both legs injured
      speedMultiplier *= this.config.bothLegsInjuredMultiplier;
    }

    // Calculate torso penalty (minor effect, 0-30% max)
    const avgTorsoHealth = (bodyPartHealth.torsoUpper + bodyPartHealth.torsoLower) / 2;
    const torsoPenalty = ((100 - avgTorsoHealth) / 100) * this.config.maxTorsoPenalty;
    speedMultiplier *= (1 - torsoPenalty);

    // Apply stance modifier
    const stanceModifier = this.getStanceSpeedModifier(stance);
    speedMultiplier *= stanceModifier;

    // Apply pain overload penalty if applicable (>= threshold, not just >)
    const painOverload = painLevel >= this.config.painOverloadThreshold;
    if (painOverload) {
      speedMultiplier *= this.config.painOverloadMultiplier; // -15%
    }

    // Clamp to minimum speed (10% of base)
    speedMultiplier = Math.max(speedMultiplier, this.config.minSpeedMultiplier);

    // Calculate final speed
    const finalSpeed = baseSpeed * speedMultiplier;

    // Determine injury state for status text
    const avgLegHealth = (bodyPartHealth.legLeft + bodyPartHealth.legRight) / 2;
    const isLimping = avgLegHealth < this.config.legThresholds.normal && avgLegHealth >= this.config.legThresholds.limping;
    const isSevereLimp = avgLegHealth < this.config.legThresholds.limping;

    // Generate status text
    const statusText = this.generateStatusText(avgLegHealth, bothLegsInjured, painOverload);

    return {
      finalSpeed,
      speedMultiplier,
      penalties: {
        leftLegPenalty,
        rightLegPenalty,
        torsoPenalty,
        bothLegsInjured,
        stanceModifier,
        painOverload,
      },
      isLimping,
      isSevereLimp,
      statusText,
    };
  }

  /**
   * Calculate movement penalty from leg injury severity.
   * 
   * **Korean**: 다리 부상 페널티 계산
   * 
   * Progressive penalty scaling:
   * - 100-70%: No penalty (0%)
   * - 70-30%: Linear scaling (0-40%)
   * - 30-10%: Accelerated scaling (40-80%)
   * - 10-0%: Critical scaling (80-100%)
   * 
   * @param legHealth - Leg health (0-100)
   * @returns Penalty factor (0.0-1.0)
   * 
   * @private
   */
  private calculateLegPenalty(legHealth: number): number {
    const { normal, limping, critical } = this.config.legThresholds;

    if (legHealth >= normal) {
      // 70-100%: No penalty
      return 0;
    } else if (legHealth >= limping) {
      // 30-70%: 0-40% penalty (linear)
      const healthRange = normal - limping;
      const healthFactor = (normal - legHealth) / healthRange;
      return healthFactor * 0.4;
    } else if (legHealth >= critical) {
      // 10-30%: 40-80% penalty (accelerated)
      const healthRange = limping - critical;
      const healthFactor = (limping - legHealth) / healthRange;
      return 0.4 + (healthFactor * 0.4);
    } else {
      // 0-10%: 80-100% penalty (critical)
      const healthFactor = (critical - legHealth) / critical;
      return 0.8 + (healthFactor * 0.2);
    }
  }

  /**
   * Get stance-based speed modifier.
   * 
   * **Korean**: 자세 속도 배수 가져오기
   * 
   * @param stance - Current trigram stance
   * @returns Speed multiplier (0.8-1.25)
   * 
   * @public
   */
  public getStanceSpeedModifier(stance: TrigramStance): number {
    return STANCE_SPEED_MODIFIERS[stance];
  }

  /**
   * Generate bilingual status text based on injury state.
   * 
   * **Korean**: 상태 텍스트 생성
   * 
   * @param avgLegHealth - Average leg health percentage
   * @param bothLegsInjured - Whether both legs are significantly injured
   * @param painOverload - Whether pain is over threshold
   * @returns Bilingual status text
   * 
   * @private
   */
  private generateStatusText(
    avgLegHealth: number,
    bothLegsInjured: boolean,
    painOverload: boolean
  ): { korean: string; english: string } {
    const { normal, limping, critical } = this.config.legThresholds;

    if (avgLegHealth < critical) {
      return {
        korean: bothLegsInjured ? "심각한 부상 | 양 다리" : "심각한 부상",
        english: bothLegsInjured ? "Critical Injury | Both Legs" : "Critical Injury",
      };
    } else if (avgLegHealth < limping) {
      return {
        korean: bothLegsInjured ? "중증 절름거림 | 양 다리" : "중증 절름거림",
        english: bothLegsInjured ? "Severe Limping | Both Legs" : "Severe Limping",
      };
    } else if (avgLegHealth < normal) {
      const painText = painOverload ? " | 고통 과부하" : "";
      const painTextEn = painOverload ? " | Pain Overload" : "";
      return {
        korean: `절름거림${painText}`,
        english: `Limping${painTextEn}`,
      };
    } else if (painOverload) {
      return {
        korean: "고통 과부하",
        english: "Pain Overload",
      };
    } else {
      return {
        korean: "정상",
        english: "Normal",
      };
    }
  }

  /**
   * Check if player should display limping animation.
   * 
   * **Korean**: 절름거림 확인
   * 
   * @param bodyPartHealth - Current body part health
   * @returns True if limping animation should play
   * 
   * @public
   */
  public shouldLimp(bodyPartHealth: BodyPartHealth): boolean {
    const avgLegHealth = (bodyPartHealth.legLeft + bodyPartHealth.legRight) / 2;
    return avgLegHealth < this.config.legThresholds.normal;
  }

  /**
   * Check if player has severe limp.
   * 
   * **Korean**: 중증 절름거림 확인
   * 
   * @param bodyPartHealth - Current body part health
   * @returns True if severe limp (leg health < 30%)
   * 
   * @public
   */
  public hasSevereLimp(bodyPartHealth: BodyPartHealth): boolean {
    const avgLegHealth = (bodyPartHealth.legLeft + bodyPartHealth.legRight) / 2;
    return avgLegHealth < this.config.legThresholds.limping;
  }

  /**
   * Get current injury state description.
   * 
   * **Korean**: 부상 상태 설명
   * 
   * @param bodyPartHealth - Current body part health
   * @returns Bilingual injury description
   * 
   * @public
   */
  public getInjuryDescription(bodyPartHealth: BodyPartHealth): {
    korean: string;
    english: string;
  } {
    const avgLegHealth = (bodyPartHealth.legLeft + bodyPartHealth.legRight) / 2;
    const leftLegPenalty = this.calculateLegPenalty(bodyPartHealth.legLeft);
    const rightLegPenalty = this.calculateLegPenalty(bodyPartHealth.legRight);
    const bothLegsInjured = leftLegPenalty > 0.3 && rightLegPenalty > 0.3;

    return this.generateStatusText(avgLegHealth, bothLegsInjured, false);
  }
}

/**
 * Singleton instance for global access.
 * 
 * @public
 */
export const injuryMovementModifier = new InjuryMovementModifier();
