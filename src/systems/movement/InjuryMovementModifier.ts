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
 * - **Stance Modifiers**: -20% (defensive) to +25% (offensive)
 * - **Pain Overload**: -15% when pain ≥ 80
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

import type { TrigramStance } from "@/types/common";
import type { BodyPartHealth } from "../bodypart/types";
import { STANCE_SPEED_MODIFIERS } from "../physics/MovementPhysics";

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
 * Deep partial type for InjuryMovementConfig to support partial overrides.
 * Allows callers to override individual threshold values without providing all.
 * 
 * @public
 * @category Movement System
 */
export type PartialInjuryMovementConfig = {
  readonly legThresholds?: Partial<InjuryMovementConfig["legThresholds"]>;
  readonly maxTorsoPenalty?: number;
  readonly bothLegsInjuredMultiplier?: number;
  readonly painOverloadThreshold?: number;
  readonly painOverloadMultiplier?: number;
  readonly minSpeedMultiplier?: number;
};

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
   * @param config - Optional configuration overrides (supports partial threshold overrides)
   */
  constructor(config?: PartialInjuryMovementConfig) {
    // Deep merge leg thresholds to prevent partial overrides from breaking the config
    const mergedLegThresholds = {
      ...DEFAULT_INJURY_MOVEMENT_CONFIG.legThresholds,
      ...(config?.legThresholds ?? {}),
    };

    const mergedConfig: InjuryMovementConfig = {
      ...DEFAULT_INJURY_MOVEMENT_CONFIG,
      ...config,
      legThresholds: mergedLegThresholds,
    };

    // Development-mode sanity check: ensure thresholds are finite and ordered
    if (process.env.NODE_ENV !== "production") {
      const { normal, limping, critical } = mergedConfig.legThresholds;
      const allFinite =
        Number.isFinite(normal) &&
        Number.isFinite(limping) &&
        Number.isFinite(critical);
      const ordered = normal >= limping && limping >= critical;

      if (!allFinite || !ordered) {
        // Non-throwing warning to avoid breaking existing behavior
        console.warn(
          "[InjuryMovementModifier] Invalid legThresholds configuration detected:",
          mergedConfig.legThresholds
        );
      }
    }

    this.config = mergedConfig;
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
    // Clamp torso health to prevent negative penalties or exceeding max penalty
    const clampedAvgTorsoHealth = Math.min(100, Math.max(0, avgTorsoHealth));
    const torsoPenalty = ((100 - clampedAvgTorsoHealth) / 100) * this.config.maxTorsoPenalty;
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

    // Determine injury state for status text based on worst leg health
    // This ensures status matches the actual movement penalty (which uses worst leg)
    const worstLegHealth = Math.min(bodyPartHealth.legLeft, bodyPartHealth.legRight);
    const isLimping =
      worstLegHealth < this.config.legThresholds.normal &&
      worstLegHealth >= this.config.legThresholds.limping;
    const isSevereLimp = worstLegHealth < this.config.legThresholds.limping;

    // Generate status text
    const statusText = this.generateStatusText(worstLegHealth, bothLegsInjured, painOverload);

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
   * @returns Penalty factor (0.0-1.0), clamped to valid range
   * 
   * @private
   */
  private calculateLegPenalty(legHealth: number): number {
    const { normal, limping, critical } = this.config.legThresholds;

    // Clamp input health to valid range to prevent runaway penalties
    const clampedHealth = Math.min(Math.max(legHealth, 0), 100);

    let penalty: number;

    if (clampedHealth >= normal) {
      // 70-100%: No penalty
      penalty = 0;
    } else if (clampedHealth >= limping) {
      // 30-70%: 0-40% penalty (linear)
      const healthRange = normal - limping;
      // Guard against division by zero if thresholds are misconfigured
      const healthFactor = healthRange > 0 
        ? (normal - clampedHealth) / healthRange 
        : 0;
      penalty = healthFactor * 0.4;
    } else if (clampedHealth >= critical) {
      // 10-30%: 40-80% penalty (accelerated)
      const healthRange = limping - critical;
      // Guard against division by zero if thresholds are misconfigured
      const healthFactor = healthRange > 0 
        ? (limping - clampedHealth) / healthRange 
        : 0;
      penalty = 0.4 + (healthFactor * 0.4);
    } else {
      // 0-10%: 80-100% penalty (critical)
      // Guard against division by zero if critical threshold is 0
      const healthFactor = critical > 0 
        ? (critical - clampedHealth) / critical 
        : 1.0;
      penalty = 0.8 + (healthFactor * 0.2);
    }

    // Ensure returned penalty is always within [0, 1]
    return Math.min(Math.max(penalty, 0), 1);
  }

  /**
   * Get stance-based speed modifier.
   * 
   * **Korean**: 자세 속도 배수 가져오기
   * 
   * @param stance - Current trigram stance
   * @returns Speed multiplier (0.8-1.25), defaults to 1.0 for unknown stances
   * 
   * @public
   */
  public getStanceSpeedModifier(stance: TrigramStance): number {
    const modifier = STANCE_SPEED_MODIFIERS[stance];

    // Defensive fallback for unknown stances (e.g., test/invalid values)
    if (modifier == null) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[InjuryMovementModifier] Unknown stance "${String(
            stance
          )}" received in getStanceSpeedModifier; defaulting to 1.0.`
        );
      }
      return 1.0;
    }

    return modifier;
  }

  /**
   * Generate bilingual status text based on injury state.
   * 
   * **Korean**: 상태 텍스트 생성
   * 
   * @param legHealthForStatus - Leg health percentage used for status determination (typically worst leg)
   * @param bothLegsInjured - Whether both legs are significantly injured
   * @param painOverload - Whether pain is over threshold
   * @returns Bilingual status text
   * 
   * @private
   */
  private generateStatusText(
    legHealthForStatus: number,
    bothLegsInjured: boolean,
    painOverload: boolean
  ): { korean: string; english: string } {
    const { normal, limping, critical } = this.config.legThresholds;

    if (legHealthForStatus < critical) {
      const painText = painOverload ? " | 고통 과부하" : "";
      const painTextEn = painOverload ? " | Pain Overload" : "";
      const baseKorean = bothLegsInjured ? "심각한 부상 | 양 다리" : "심각한 부상";
      const baseEnglish = bothLegsInjured ? "Critical Injury | Both Legs" : "Critical Injury";
      return {
        korean: `${baseKorean}${painText}`,
        english: `${baseEnglish}${painTextEn}`,
      };
    } else if (legHealthForStatus < limping) {
      const painText = painOverload ? " | 고통 과부하" : "";
      const painTextEn = painOverload ? " | Pain Overload" : "";
      const baseKorean = bothLegsInjured ? "중증 절름거림 | 양 다리" : "중증 절름거림";
      const baseEnglish = bothLegsInjured ? "Severe Limping | Both Legs" : "Severe Limping";
      return {
        korean: `${baseKorean}${painText}`,
        english: `${baseEnglish}${painTextEn}`,
      };
    } else if (legHealthForStatus < normal) {
      const statusKrParts = ["절름거림"];
      const statusEnParts = ["Limping"];

      if (bothLegsInjured) {
        statusKrParts.push("양 다리");
        statusEnParts.push("Both Legs");
      }

      if (painOverload) {
        statusKrParts.push("고통 과부하");
        statusEnParts.push("Pain Overload");
      }

      return {
        korean: statusKrParts.join(" | "),
        english: statusEnParts.join(" | "),
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
   * Uses worst leg health to match movement penalty behavior.
   * 
   * @param bodyPartHealth - Current body part health
   * @returns True if limping animation should play
   * 
   * @public
   */
  public shouldLimp(bodyPartHealth: BodyPartHealth): boolean {
    const worstLegHealth = Math.min(bodyPartHealth.legLeft, bodyPartHealth.legRight);
    return worstLegHealth < this.config.legThresholds.normal;
  }

  /**
   * Check if player has severe limp.
   * 
   * **Korean**: 중증 절름거림 확인
   * 
   * Uses worst leg health to match movement penalty behavior.
   * 
   * @param bodyPartHealth - Current body part health
   * @returns True if severe limp (leg health < 30%)
   * 
   * @public
   */
  public hasSevereLimp(bodyPartHealth: BodyPartHealth): boolean {
    const worstLegHealth = Math.min(bodyPartHealth.legLeft, bodyPartHealth.legRight);
    return worstLegHealth < this.config.legThresholds.limping;
  }

  /**
   * Get current injury state description.
   * 
   * **Korean**: 부상 상태 설명
   * 
   * Uses worst leg health to match movement penalty behavior.
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
    const worstLegHealth = Math.min(bodyPartHealth.legLeft, bodyPartHealth.legRight);
    const leftLegPenalty = this.calculateLegPenalty(bodyPartHealth.legLeft);
    const rightLegPenalty = this.calculateLegPenalty(bodyPartHealth.legRight);
    const bothLegsInjured = leftLegPenalty > 0.3 && rightLegPenalty > 0.3;

    return this.generateStatusText(worstLegHealth, bothLegsInjured, false);
  }
}

/**
 * Singleton instance for global access.
 * 
 * @public
 */
export const injuryMovementModifier = new InjuryMovementModifier();
