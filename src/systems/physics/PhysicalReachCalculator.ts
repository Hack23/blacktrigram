/**
 * Physical Reach Calculator
 *
 * **Korean**: 물리적 도달 거리 계산기
 *
 * Calculates actual combat reach based on physical attributes and animation timing.
 * Integrates archetype-specific limb lengths with animation hit windows for
 * reality-based hit detection.
 *
 * ## Philosophy
 *
 * Black Trigram emphasizes realistic combat. Hit detection must account for:
 * - Physical differences between archetypes (arm/leg length)
 * - Animation phase (chamber vs extension vs retraction)
 * - Technique type (punch vs kick vs elbow)
 * - Stance modifiers from Eight Trigrams
 *
 * A small Hacker (73cm arms) cannot reach as far as a large Jojik (84cm arms),
 * and this difference must be reflected in combat.
 *
 * @module systems/physics/PhysicalReachCalculator
 * @category Combat Physics
 * @korean 물리적도달계산기
 */

import { PhysicalAttributes } from "@/types";
import { TrigramStance } from "../../types/common";
import { 
  STANCE_REACH_MODIFIERS, 
  TechniqueType,
  PhysicalReachConfig,
} from "../../types/physics";
import {
  AnimationType,
  getAnimationHitTiming,
  getCurrentReachMultiplier,
  isWithinHitWindow,
} from "../animation";

/**
 * Physical reach calculation result.
 *
 * **Korean**: 물리적 도달 계산 결과
 *
 * @public
 * @korean 물리적도달결과
 */
export interface PhysicalReachResult {
  /**
   * Base limb length in meters.
   * Archetype-specific arm or leg length from physical attributes.
   * @korean 기본팔다리길이
   */
  readonly baseLimbLength: number;

  /**
   * Body pivot contribution in meters (kicks only).
   * Accounts for hip rotation and torso lean during kicks (~0.25m).
   * @korean 몸통회전기여도
   */
  readonly bodyPivotContribution: number;

  /**
   * Technique type used.
   * @korean 기술유형
   */
  readonly techniqueType: TechniqueType;

  /**
   * Current animation time in seconds.
   * @korean 현재애니메이션시간
   */
  readonly animationTime: number;

  /**
   * Animation reach multiplier at current time (0.0 - 1.5).
   * @korean 애니메이션도달배수
   */
  readonly animationReachMultiplier: number;

  /**
   * Base extension from technique reachConfig (0.0 - 1.5).
   * Designer-specified reach multiplier from technique definition.
   * @korean 기본확장배수
   */
  readonly baseExtension?: number;

  /**
   * Final extension multiplier used in reach calculation.
   * When reachConfig is provided, applies curve factor to hybrid peak:
   * `(animationReachMultiplier / peakMultiplier) * max(baseExtension, peakMultiplier)`
   * Otherwise uses time-varying animationReachMultiplier directly.
   * @korean 최종확장배수
   */
  readonly finalExtensionMultiplier: number;

  /**
   * Stance reach modifier (0.9 - 1.2).
   * @korean 자세도달수정자
   */
  readonly stanceModifier: number;

  /**
   * Final effective reach in meters.
   * (baseLimbLength + bodyPivotContribution) × finalExtensionMultiplier × stanceModifier
   * @korean 최종유효도달
   */
  readonly effectiveReach: number;

  /**
   * Whether currently within hit window.
   * @korean 타격창내여부
   */
  readonly canHit: boolean;
}

/**
 * Physical Reach Calculator.
 *
 * **Korean**: 물리적 도달 계산기
 *
 * Calculates reality-based reach using archetype physical attributes
 * and animation timing.
 *
 * @public
 * @korean 물리적도달계산기
 */
export class PhysicalReachCalculator {
  /**
   * Calculate effective reach for a technique at a specific animation time.
   *
   * **Korean**: 특정 애니메이션 시간의 유효 도달 거리 계산
   *
   * This is the core method that integrates:
   * 1. Physical attributes (archetype-specific limb length)
   * 2. Animation timing (hit window and extension phase)
   * 3. Technique baseExtension (designer-specified reach)
   * 4. Stance modifiers (Eight Trigrams reach bonuses)
   * 5. Body pivot contribution (hip rotation and torso lean for kicks)
   *
   * **Hybrid Reach System**: Uses the maximum of:
   * - `reachConfig.baseExtension` (designer-specified reach)
   * - `maxReachMultiplier` (animation-driven reach)
   *
   * This ensures techniques get at least their designed reach while allowing
   * animations to extend beyond the base if needed.
   *
   * **Body Pivot Mechanics for Kicks**:
   * Kicks benefit from whole-body rotation that punches don't utilize:
   * - Hip rotation adds ~0.15m (pelvis width + pivot)
   * - Torso lean adds ~0.1m (forward lean during kick)
   * - Total body pivot: ~0.25m additional reach
   *
   * This accounts for the biomechanics of kicks where the fighter rotates
   * their entire body to extend reach, unlike punches which rely primarily
   * on arm extension.
   *
   * @param physicalAttributes - Fighter's physical attributes
   * @param animationType - Animation being executed
   * @param animationTime - Current time in animation (seconds)
   * @param stance - Current trigram stance
   * @param reachConfig - Optional technique reach configuration with baseExtension
   * @returns Physical reach calculation result
   *
   * @example
   * ```typescript
   * const calculator = new PhysicalReachCalculator();
   *
   * // With reachConfig (uses max of baseExtension and animation multiplier)
   * const frontKick = calculator.calculateReach(
   *   MUSA_PHYSICAL,
   *   AnimationType.FRONT_KICK,
   *   0.27, // Peak time
   *   TrigramStance.GEON,
   *   { bodyPart: "leg", techniqueType: "kick", baseExtension: 1.05 }
   * );
   * // Uses max(1.05, 1.0) = 1.05 for proper designed reach
   *
   * // Without reachConfig (uses only animation multiplier - backward compatible)
   * const legacyKick = calculator.calculateReach(
   *   MUSA_PHYSICAL,
   *   AnimationType.FRONT_KICK,
   *   0.27,
   *   TrigramStance.GEON
   * );
   * // Uses animation multiplier (1.0) only
   * ```
   *
   * @public
   * @korean 도달계산
   */
  calculateReach(
    physicalAttributes: PhysicalAttributes,
    animationType: AnimationType,
    animationTime: number,
    stance: TrigramStance,
    reachConfig?: PhysicalReachConfig,
  ): PhysicalReachResult {
    // Determine technique type from animation
    const techniqueType = this.getTechniqueTypeFromAnimation(animationType);

    // Get base limb length for technique type
    const baseLimbLength = this.getLimbLength(
      physicalAttributes,
      techniqueType,
    );

    // Get animation hit timing
    const canHit = isWithinHitWindow(animationType, animationTime);
    const animationReachMultiplier = getCurrentReachMultiplier(
      animationType,
      animationTime,
    );

    // **Hybrid Reach System with Curve Factor**:
    // Apply baseExtension at the peak reach level, then scale by the time-varying
    // curve factor so reach still ramps up and down with the animation.
    // This prevents phantom hits at the start/end of the hit window.
    const baseExtension = reachConfig?.baseExtension;

    // Retrieve peak (max) reach multiplier for this animation's hit window
    const hitTiming = getAnimationHitTiming(animationType);
    const rawPeakMultiplier = hitTiming?.hitWindow.maxReachMultiplier;

    // Determine whether we have valid timing data. When timing is missing or
    // the configured peak multiplier is non-positive, fall back to a neutral
    // curve so reach/damage checks remain possible for those techniques.
    const hasValidTiming =
      rawPeakMultiplier !== undefined && rawPeakMultiplier > 0;

    const fallbackBase = baseExtension ?? 1;

    const peakMultiplier = hasValidTiming ? rawPeakMultiplier : fallbackBase;

    const effectiveAnimationReachMultiplier = hasValidTiming
      ? animationReachMultiplier
      : fallbackBase;

    // Normalized curve factor in [0, 1] that represents where we are on
    // the reach curve. When peakMultiplier is 0, we treat reach as 0.
    const curveFactor =
      peakMultiplier > 0 ? effectiveAnimationReachMultiplier / peakMultiplier : 0;

    // Apply the hybrid "max" at the peak level, then reapply the curve
    const peakExtension =
      baseExtension !== undefined
        ? Math.max(baseExtension, peakMultiplier)
        : peakMultiplier;

    const finalExtensionMultiplier = curveFactor * peakExtension;

    // Get stance modifier
    const stanceModifier = STANCE_REACH_MODIFIERS[stance];

    // Calculate final effective reach
    // Convert cm to meters for consistency with physics system
    const baseLimbLengthMeters = baseLimbLength / 100;

    // Add body pivot/offset contribution based on technique type
    // This accounts for the fact that limbs extend from the body surface,
    // not the body center, plus rotational contributions
    let bodyPivotContribution: number;

    if (techniqueType === "kick" || techniqueType === "knee") {
      // Kicks benefit from hip rotation and torso lean which add 0.25m
      // This accounts for:
      // - Hip width/rotation (0.15m)
      // - Torso lean during kick (0.1m)
      // Total body pivot contribution: 0.25m for kicks
      bodyPivotContribution = 0.25;
    } else if (
      techniqueType === "punch" ||
      techniqueType === "pressure_point"
    ) {
      // Punches extend from the shoulder, which is offset from body center
      // Shoulder offset = shoulderWidth / 2 (converted to meters)
      // Plus torso rotation contribution for cross/hooks (~0.1m)
      // Average shoulder width ~45cm → offset ~0.225m, plus rotation ~0.1m
      // Total: ~0.30m for arm techniques
      const shoulderOffset = physicalAttributes.shoulderWidth / 2 / 100; // Convert cm to m
      const torsoRotation = 0.1; // 10cm from torso rotation during punches
      bodyPivotContribution = shoulderOffset + torsoRotation;
    } else if (techniqueType === "elbow") {
      // Elbows are close range but still extend from shoulder
      // Less torso rotation contribution
      const shoulderOffset = physicalAttributes.shoulderWidth / 2 / 100;
      bodyPivotContribution = shoulderOffset;
    } else {
      bodyPivotContribution = 0;
    }

    const effectiveReach =
      (baseLimbLengthMeters + bodyPivotContribution) *
      finalExtensionMultiplier *
      stanceModifier;

    return {
      baseLimbLength: baseLimbLengthMeters,
      bodyPivotContribution,
      techniqueType,
      animationTime,
      animationReachMultiplier,
      baseExtension,
      finalExtensionMultiplier,
      stanceModifier,
      effectiveReach,
      canHit,
    };
  }

  /**
   * Calculate maximum possible reach for a technique.
   *
   * **Korean**: 기술의 최대 가능 도달 거리
   *
   * Calculates reach at peak animation time (maximum extension).
   * Uses hybrid reach system with reachConfig if provided.
   *
   * @param physicalAttributes - Fighter's physical attributes
   * @param animationType - Animation type
   * @param stance - Current trigram stance
   * @param reachConfig - Optional technique reach configuration with baseExtension
   * @returns Maximum effective reach in meters
   *
   * @example
   * ```typescript
   * const calculator = new PhysicalReachCalculator();
   *
   * // With reachConfig for accurate designed reach
   * const maxReachWithConfig = calculator.calculateMaxReach(
   *   MUSA_PHYSICAL,
   *   AnimationType.FRONT_KICK,
   *   TrigramStance.GEON,
   *   { bodyPart: "leg", techniqueType: "kick", baseExtension: 1.05 }
   * );
   * // Uses max(1.05, 1.0) = 1.05
   *
   * // Without reachConfig (backward compatible)
   * const maxReachLegacy = calculator.calculateMaxReach(
   *   MUSA_PHYSICAL,
   *   AnimationType.FRONT_KICK,
   *   TrigramStance.GEON
   * );
   * // Uses animation multiplier only (1.0)
   * ```
   *
   * @public
   * @korean 최대도달계산
   */
  calculateMaxReach(
    physicalAttributes: PhysicalAttributes,
    animationType: AnimationType,
    stance: TrigramStance,
    reachConfig?: PhysicalReachConfig,
  ): number {
    const hitTiming = getAnimationHitTiming(animationType);
    
    // Handle missing AnimationHitTiming entries
    // When timing data is unavailable, use baseExtension if provided,
    // otherwise use a neutral 1.0 multiplier to keep reach calculations functional.
    // This ensures techniques like GEON_ROUNDHOUSE, WATER_COUNTER, IRON_BLOCK
    // (which have technique definitions but missing animation timing entries)
    // can still perform reach/damage checks.
    if (!hitTiming) {
      // Use fallback approach: calculate reach with neutral timing
      const fallbackTime = 0.5; // Midpoint of typical animation
      const result = this.calculateReach(
        physicalAttributes,
        animationType,
        fallbackTime,
        stance,
        reachConfig,
      );
      return result.effectiveReach;
    }
    
    const peakTime = hitTiming.hitWindow.peakTime;

    const result = this.calculateReach(
      physicalAttributes,
      animationType,
      peakTime,
      stance,
      reachConfig,
    );

    return result.effectiveReach;
  }

  /**
   * Get limb length for a technique type.
   *
   * **Korean**: 기술 유형에 대한 팔다리 길이 가져오기
   *
   * @param physicalAttributes - Fighter's physical attributes
   * @param techniqueType - Type of technique
   * @returns Limb length in centimeters
   *
   * @private
   * @korean 팔다리길이가져오기
   */
  private getLimbLength(
    physicalAttributes: PhysicalAttributes,
    techniqueType: TechniqueType,
  ): number {
    switch (techniqueType) {
      case "punch":
      case "elbow":
      case "pressure_point":
        // Use arm length for hand-based techniques
        return physicalAttributes.armLength;

      case "kick":
      case "knee":
        // Use leg length for leg-based techniques
        return physicalAttributes.legLength;

      default:
        // Fallback to arm length
        return physicalAttributes.armLength;
    }
  }

  /**
   * Determine technique type from animation type.
   *
   * Public method exposed to avoid duplication across codebase.
   *
   * **Korean**: 애니메이션 타입에서 기술 유형 결정
   *
   * @param animationType - Animation type
   * @returns Technique type
   *
   * @public
   * @korean 기술유형결정
   */
  public getTechniqueTypeFromAnimation(
    animationType: AnimationType,
  ): TechniqueType {
    // Punch techniques
    if (
      animationType === AnimationType.JAB ||
      animationType === AnimationType.CROSS ||
      animationType === AnimationType.HOOK ||
      animationType === AnimationType.UPPERCUT ||
      animationType === AnimationType.OVERHAND ||
      animationType === AnimationType.BACKFIST ||
      animationType === AnimationType.HAMMER_FIST ||
      animationType === AnimationType.PALM_STRIKE ||
      animationType === AnimationType.SPEAR_HAND_STRIKE ||
      animationType === AnimationType.HEAVEN_STRIKE ||
      animationType === AnimationType.FLOWING_CROSS ||
      animationType === AnimationType.SOLAR_PLEXUS_STRIKE ||
      animationType === AnimationType.FLOWING_PUSH ||
      animationType === AnimationType.LIVER_DISRUPTION ||
      animationType === AnimationType.EAR_STRIKE
    ) {
      return "punch";
    }

    // Kick techniques
    if (
      animationType === AnimationType.FRONT_KICK ||
      animationType === AnimationType.ROUNDHOUSE_KICK ||
      animationType === AnimationType.SIDE_KICK ||
      animationType === AnimationType.BACK_KICK ||
      animationType === AnimationType.AXE_KICK ||
      animationType === AnimationType.CRESCENT_KICK ||
      animationType === AnimationType.LOW_KICK ||
      animationType === AnimationType.PUSH_KICK ||
      animationType === AnimationType.JUMPING_KICK ||
      animationType === AnimationType.SPINNING_HEEL_KICK ||
      animationType === AnimationType.TORNADO_KICK
    ) {
      return "kick";
    }

    // Elbow techniques
    if (
      animationType === AnimationType.ELBOW_STRIKE ||
      animationType === AnimationType.ELBOW_UPPERCUT ||
      animationType === AnimationType.SPINNING_ELBOW ||
      animationType === AnimationType.TEMPLE_ELBOW ||
      animationType === AnimationType.SPINNING_BACK_ELBOW ||
      animationType === AnimationType.SPINAL_ELBOW ||
      animationType === AnimationType.BRACHIAL_ELBOW
    ) {
      return "elbow";
    }

    // Knee techniques
    if (
      animationType === AnimationType.KNEE_STRIKE ||
      animationType === AnimationType.FLYING_KNEE ||
      animationType === AnimationType.KIDNEY_KNEE ||
      animationType === AnimationType.FEMORAL_KNEE
    ) {
      return "knee";
    }

    // Pressure point techniques
    if (
      animationType === AnimationType.NERVE_STRIKE ||
      animationType === AnimationType.PRESSURE_POINT_STRIKE ||
      animationType === AnimationType.NERVE_PARALYSIS ||
      animationType === AnimationType.THROAT_STRIKE ||
      animationType === AnimationType.EYE_GOUGE
    ) {
      return "pressure_point";
    }

    // Default to "punch" for any techniques not explicitly mapped above, including
    // complex grappling or hybrid animations. For *reach calculation* purposes we
    // approximate these using primary arm/forearm extension, since initial contact
    // is typically established with the upper limbs before the torso closes distance.
    // If a dedicated grappling TechniqueType and reach model are introduced later,
    // update this fallback to return that specific type instead of "punch".
    return "punch";
  }
}

/**
 * Singleton instance for convenient access.
 *
 * **Korean**: 싱글톤 인스턴스
 *
 * @example
 * ```typescript
 * import { physicalReachCalculator } from '@/systems/physics/PhysicalReachCalculator';
 *
 * const reach = physicalReachCalculator.calculateReach(
 *   playerPhysical,
 *   AnimationType.ROUNDHOUSE_KICK,
 *   0.32, // Peak time
 *   TrigramStance.GEON
 * );
 * ```
 *
 * @public
 * @korean 싱글톤인스턴스
 */
export const physicalReachCalculator = new PhysicalReachCalculator();
