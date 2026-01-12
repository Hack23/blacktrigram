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
import { AnimationType } from "../animation/MartialArtsAnimationBuilder";
import {
  getAnimationHitTiming,
  getCurrentReachMultiplier,
  isWithinHitWindow,
} from "../animation/AnimationHitTiming";
import { STANCE_REACH_MODIFIERS, TechniqueType } from "../../types/physics";

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
   * Stance reach modifier (0.9 - 1.2).
   * @korean 자세도달수정자
   */
  readonly stanceModifier: number;
  
  /**
   * Final effective reach in meters.
   * baseLimbLength × animationReachMultiplier × stanceModifier
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
   * 3. Stance modifiers (Eight Trigrams reach bonuses)
   * 
   * @param physicalAttributes - Fighter's physical attributes
   * @param animationType - Animation being executed
   * @param animationTime - Current time in animation (seconds)
   * @param stance - Current trigram stance
   * @returns Physical reach calculation result
   * 
   * @example
   * ```typescript
   * const calculator = new PhysicalReachCalculator();
   * 
   * // Amsalja (long arms: 82cm) doing a jab at peak time
   * const amsaljaReach = calculator.calculateReach(
   *   AMSALJA_PHYSICAL,
   *   AnimationType.JAB,
   *   0.15, // Peak time
   *   TrigramStance.LI
   * );
   * // Result: 82cm × 0.95 (jab extension) × 1.20 (fire stance) = 93.48cm
   * 
   * // Hacker (short arms: 73cm) doing same jab at peak time
   * const hackerReach = calculator.calculateReach(
   *   HACKER_PHYSICAL,
   *   AnimationType.JAB,
   *   0.15,
   *   TrigramStance.LI
   * );
   * // Result: 73cm × 0.95 × 1.20 = 83.22cm (10cm shorter!)
   * ```
   * 
   * @public
   * @korean 도달계산
   */
  calculateReach(
    physicalAttributes: PhysicalAttributes,
    animationType: AnimationType,
    animationTime: number,
    stance: TrigramStance
  ): PhysicalReachResult {
    // Determine technique type from animation
    const techniqueType = this.getTechniqueTypeFromAnimation(animationType);
    
    // Get base limb length for technique type
    const baseLimbLength = this.getLimbLength(physicalAttributes, techniqueType);
    
    // Get animation hit timing
    const canHit = isWithinHitWindow(animationType, animationTime);
    const animationReachMultiplier = getCurrentReachMultiplier(animationType, animationTime);
    
    // Get stance modifier
    const stanceModifier = STANCE_REACH_MODIFIERS[stance];
    
    // Calculate final effective reach
    // Convert cm to meters for consistency with physics system
    const baseLimbLengthMeters = baseLimbLength / 100;
    const effectiveReach = baseLimbLengthMeters * animationReachMultiplier * stanceModifier;
    
    return {
      baseLimbLength: baseLimbLengthMeters,
      techniqueType,
      animationTime,
      animationReachMultiplier,
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
   * 
   * @param physicalAttributes - Fighter's physical attributes
   * @param animationType - Animation type
   * @param stance - Current trigram stance
   * @returns Maximum effective reach in meters
   * 
   * @example
   * ```typescript
   * const calculator = new PhysicalReachCalculator();
   * const maxReach = calculator.calculateMaxReach(
   *   JOJIK_PHYSICAL,
   *   AnimationType.SIDE_KICK,
   *   TrigramStance.LI
   * );
   * // Jojik legs (100cm) × side kick peak (1.1) × fire stance (1.20) = 1.32m
   * ```
   * 
   * @public
   * @korean 최대도달계산
   */
  calculateMaxReach(
    physicalAttributes: PhysicalAttributes,
    animationType: AnimationType,
    stance: TrigramStance
  ): number {
    const hitTiming = getAnimationHitTiming(animationType);
    if (!hitTiming) {
      // Not a combat animation, return zero reach
      return 0;
    }
    const peakTime = hitTiming.hitWindow.peakTime;
    
    const result = this.calculateReach(
      physicalAttributes,
      animationType,
      peakTime,
      stance
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
    techniqueType: TechniqueType
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
  public getTechniqueTypeFromAnimation(animationType: AnimationType): TechniqueType {
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
