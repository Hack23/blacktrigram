/**
 * Technique Animation Mapper
 * 
 * Maps 70 Korean techniques to appropriate attack animation types.
 * Implements the technique-to-animation link system for authentic martial arts animations.
 * 
 * @module systems/animation/TechniqueAnimationMapper
 * @category Animation System
 * @korean 기술애니메이션매퍼
 */

import { AttackAnimationType } from "../../types/skeletal";
import { ATTACK_ANIMATIONS } from "./AttackAnimations";

/**
 * Maps AttackAnimationType to existing skeletal animation names
 * 
 * Links the new enum-based system to existing animation implementation.
 * New animations will be added to AttackAnimations.ts as needed.
 * 
 * @korean 애니메이션타입맵
 */
const ANIMATION_TYPE_TO_NAME_MAP: Record<AttackAnimationType, string> = {
  // Punch category (주먹 타격) - use existing animations
  [AttackAnimationType.PUNCH_HIGH]: "jab", // High punch to head
  [AttackAnimationType.PUNCH_MID]: "cross", // Mid-level cross punch
  [AttackAnimationType.PUNCH_LOW]: "jab", // Low punch to body (reuse jab for now)

  // Kick category (발차기) - use dedicated animations
  [AttackAnimationType.KICK_FRONT]: "front_kick", // Front kick (앞차기)
  [AttackAnimationType.KICK_SIDE]: "side_kick", // Side kick (옆차기) - NEW dedicated animation
  [AttackAnimationType.KICK_ROUNDHOUSE]: "roundhouse_kick", // Roundhouse kick (돌려차기)

  // Elbow category (팔꿈치 타격) - use dedicated elbow animations
  [AttackAnimationType.ELBOW_STRIKE]: "elbow_strike",
  [AttackAnimationType.ELBOW_UPPERCUT]: "elbow_uppercut", // NEW dedicated uppercut animation

  // Knee category (무릎 타격) - use dedicated knee animation
  [AttackAnimationType.KNEE_STRIKE]: "knee_strike",
  [AttackAnimationType.KNEE_CLINCH]: "knee_strike", // Reuse knee strike in clinch position

  // Pressure point category (급소 타격) - use precise jab motion
  [AttackAnimationType.PRESSURE_POINT]: "jab",
  [AttackAnimationType.PRESSURE_POINT_RAPID]: "jab",
};

/**
 * Get skeletal animation name for an attack animation type
 * 
 * @param animationType - Attack animation type enum
 * @returns Name of skeletal animation from ATTACK_ANIMATIONS map
 * 
 * @public
 * @korean 애니메이션타입에서이름가져오기
 */
export function getAnimationNameForType(
  animationType: AttackAnimationType
): string {
  return ANIMATION_TYPE_TO_NAME_MAP[animationType];
}

/**
 * Check if an animation type has a defined animation
 * 
 * @param animationType - Attack animation type enum
 * @returns True if animation exists in ATTACK_ANIMATIONS map
 * 
 * @public
 * @korean 애니메이션존재확인
 */
export function hasAnimationForType(
  animationType: AttackAnimationType
): boolean {
  const animationName = ANIMATION_TYPE_TO_NAME_MAP[animationType];
  return ATTACK_ANIMATIONS.has(animationName);
}

/**
 * Determines appropriate animation type from technique characteristics
 * 
 * Uses technique name, damage type, and keywords to automatically
 * select the best-matching attack animation type.
 * 
 * @param techniqueName - English or Korean technique name
 * @param techniqueId - Technique ID
 * @param damageType - Type of damage dealt
 * @returns Best-matching attack animation type
 * 
 * @public
 * @korean 기술에서애니메이션타입결정
 */
export function determineAnimationTypeForTechnique(
  techniqueName: string,
  techniqueId: string,
  damageType?: string
): AttackAnimationType {
  const searchText = `${techniqueName} ${techniqueId}`.toLowerCase();

  // Pressure point / precise strikes (급소)
  if (
    searchText.includes("pressure") ||
    searchText.includes("precise") ||
    searchText.includes("nerve") ||
    searchText.includes("vital") ||
    searchText.includes("급소") ||
    searchText.includes("신경") ||
    damageType === "nerve" ||
    damageType === "pressure"
  ) {
    // Check for rapid/multi-hit variants
    if (
      searchText.includes("rapid") ||
      searchText.includes("multiple") ||
      searchText.includes("연속")
    ) {
      return AttackAnimationType.PRESSURE_POINT_RAPID;
    }
    return AttackAnimationType.PRESSURE_POINT;
  }

  // Kicks (차기)
  if (
    searchText.includes("kick") ||
    searchText.includes("차기") ||
    searchText.includes("발")
  ) {
    if (
      searchText.includes("roundhouse") ||
      searchText.includes("round") ||
      searchText.includes("돌려") ||
      searchText.includes("회전")
    ) {
      return AttackAnimationType.KICK_ROUNDHOUSE;
    }
    if (
      searchText.includes("side") ||
      searchText.includes("옆") ||
      searchText.includes("측면")
    ) {
      return AttackAnimationType.KICK_SIDE;
    }
    // Default to front kick
    return AttackAnimationType.KICK_FRONT;
  }

  // Elbow strikes (팔꿈치)
  if (
    searchText.includes("elbow") ||
    searchText.includes("팔꿈치") ||
    searchText.includes("팔굽")
  ) {
    if (
      searchText.includes("uppercut") ||
      searchText.includes("올려") ||
      searchText.includes("치켜")
    ) {
      return AttackAnimationType.ELBOW_UPPERCUT;
    }
    return AttackAnimationType.ELBOW_STRIKE;
  }

  // Knee strikes (무릎)
  if (
    searchText.includes("knee") ||
    searchText.includes("무릎") ||
    searchText.includes("슬")
  ) {
    if (
      searchText.includes("clinch") ||
      searchText.includes("grab") ||
      searchText.includes("잡고")
    ) {
      return AttackAnimationType.KNEE_CLINCH;
    }
    return AttackAnimationType.KNEE_STRIKE;
  }

  // Punches (주먹) - check target height
  if (
    searchText.includes("punch") ||
    searchText.includes("strike") ||
    searchText.includes("주먹") ||
    searchText.includes("권") ||
    searchText.includes("격")
  ) {
    // High attacks (head level)
    if (
      searchText.includes("head") ||
      searchText.includes("high") ||
      searchText.includes("temple") ||
      searchText.includes("jaw") ||
      searchText.includes("머리") ||
      searchText.includes("관자") ||
      searchText.includes("턱")
    ) {
      return AttackAnimationType.PUNCH_HIGH;
    }
    // Low attacks (body level)
    if (
      searchText.includes("low") ||
      searchText.includes("body") ||
      searchText.includes("ribs") ||
      searchText.includes("아래") ||
      searchText.includes("복부") ||
      searchText.includes("늑골")
    ) {
      return AttackAnimationType.PUNCH_LOW;
    }
    // Default to mid-level punch
    return AttackAnimationType.PUNCH_MID;
  }

  // Default: mid-level punch for any unmatched technique
  return AttackAnimationType.PUNCH_MID;
}

/**
 * Calculates animation speed modifier based on technique power level
 * 
 * Implements the rule:
 * - Light techniques (damage <20): 1.2x speed
 * - Normal techniques (damage 20-35): 1.0x speed
 * - Heavy techniques (damage >35): 0.8x speed
 * 
 * @param damage - Base damage of the technique
 * @returns Speed modifier (0.8 - 1.2)
 * 
 * @public
 * @korean 기술위력에서속도배율계산
 */
export function calculateSpeedModifierForDamage(damage: number): number {
  if (damage < 20) {
    return 1.2; // Light, fast techniques
  } else if (damage > 35) {
    return 0.8; // Heavy, powerful techniques
  }
  return 1.0; // Normal speed
}

/**
 * Get animation duration adjusted by speed modifier
 * 
 * @param baseAnimationName - Name of base animation
 * @param speedModifier - Speed multiplier (0.8 - 1.2)
 * @returns Adjusted duration in milliseconds
 * 
 * @public
 * @korean 조정된애니메이션지속시간
 */
export function getAdjustedAnimationDuration(
  baseAnimationName: string,
  speedModifier: number
): number {
  const animation = ATTACK_ANIMATIONS.get(baseAnimationName);
  if (!animation) {
    console.warn("Animation not found:", baseAnimationName);
    return 200; // Default 200ms for missing animations
  }

  // Convert seconds to milliseconds and apply speed modifier
  const baseDurationMs = animation.duration * 1000;
  return Math.round(baseDurationMs / speedModifier);
}

export default {
  getAnimationNameForType,
  hasAnimationForType,
  determineAnimationTypeForTechnique,
  calculateSpeedModifierForDamage,
  getAdjustedAnimationDuration,
};

/**
 * Comprehensive Technique Animation Mapping System
 * 
 * **Korean**: 포괄적 기술 애니메이션 매핑 시스템
 * 
 * Maps all 560 technique-stance combinations (70 vital points × 8 stances)
 * to appropriate animations with O(1) lookup performance.
 * 
 * ## Architecture
 * 
 * - **Primary Map**: Exact stance-type-part-intensity combinations
 * - **Fallback System**: 3-tier graceful degradation
 *   1. Exact match
 *   2. Intensity-agnostic match (same stance/type/part, medium intensity)
 *   3. Technique type generic (fallback to base technique animation)
 * 
 * ## Korean Martial Arts Integration
 * 
 * Each trigram stance influences animation selection:
 * - **☰ 건 (Geon)**: Direct, forceful animations
 * - **☱ 태 (Tae)**: Fluid, flowing animations
 * - **☲ 리 (Li)**: Precise, rapid animations
 * - **☳ 진 (Jin)**: Explosive, shocking animations
 * - **☴ 손 (Son)**: Continuous, pressuring animations
 * - **☵ 감 (Gam)**: Adaptive, countering animations
 * - **☶ 간 (Gan)**: Defensive, immovable animations
 * - **☷ 곤 (Gon)**: Grounding, takedown animations
 * 
 * @module systems/animation/TechniqueAnimationMapper
 * @category Animation System
 * @korean 기술애니메이션매퍼
 */

import { TrigramStance } from "@/types";
import { BodyPart } from "../bodypart/types";
import {
  AnimationState,
  AnimationPriority,
  TechniqueAnimationKey,
  TechniqueAnimation,
  TechniqueIntensity,
  TechniqueTypeCategory,
  MappingValidationResult,
} from "./types";

/**
 * Body part Korean terminology for animation names
 * 
 * **Korean**: 신체 부위 한글 용어
 */
const BODY_PART_KOREAN: Record<string, string> = {
  [BodyPart.HEAD]: "두부",
  [BodyPart.NECK]: "경부",
  [BodyPart.TORSO_UPPER]: "상체",
  [BodyPart.TORSO_LOWER]: "하체",
  [BodyPart.ARM_LEFT]: "좌팔",
  [BodyPart.ARM_RIGHT]: "우팔",
  [BodyPart.LEG_LEFT]: "좌각",
  [BodyPart.LEG_RIGHT]: "우각",
};

/**
 * Body part English terminology for animation names
 */
const BODY_PART_ENGLISH: Record<string, string> = {
  [BodyPart.HEAD]: "Head",
  [BodyPart.NECK]: "Neck",
  [BodyPart.TORSO_UPPER]: "Upper Torso",
  [BodyPart.TORSO_LOWER]: "Lower Torso",
  [BodyPart.ARM_LEFT]: "Left Arm",
  [BodyPart.ARM_RIGHT]: "Right Arm",
  [BodyPart.LEG_LEFT]: "Left Leg",
  [BodyPart.LEG_RIGHT]: "Right Leg",
};

/**
 * Technique type Korean terminology
 * 
 * **Korean**: 기술 유형 한글 용어
 */
const TECHNIQUE_TYPE_KOREAN: Record<TechniqueTypeCategory, string> = {
  strike: "타격",
  joint: "관절",
  throw: "던지기",
  pressure_point: "급소",
};

/**
 * Technique type English terminology
 */
const TECHNIQUE_TYPE_ENGLISH: Record<TechniqueTypeCategory, string> = {
  strike: "Strike",
  joint: "Joint Lock",
  throw: "Throw",
  pressure_point: "Pressure Point",
};

/**
 * Stance Korean names
 */
const STANCE_KOREAN: Record<string, string> = {
  [TrigramStance.GEON]: "건괘",
  [TrigramStance.TAE]: "태괘",
  [TrigramStance.LI]: "리괘",
  [TrigramStance.JIN]: "진괘",
  [TrigramStance.SON]: "손괘",
  [TrigramStance.GAM]: "감괘",
  [TrigramStance.GAN]: "간괘",
  [TrigramStance.GON]: "곤괘",
};

/**
 * Stance English names
 */
const STANCE_ENGLISH: Record<string, string> = {
  [TrigramStance.GEON]: "Heaven",
  [TrigramStance.TAE]: "Lake",
  [TrigramStance.LI]: "Fire",
  [TrigramStance.JIN]: "Thunder",
  [TrigramStance.SON]: "Wind",
  [TrigramStance.GAM]: "Water",
  [TrigramStance.GAN]: "Mountain",
  [TrigramStance.GON]: "Earth",
};

/**
 * Comprehensive Technique Animation Mapper Class
 * 
 * **Korean**: 기술 애니메이션 매퍼 클래스
 * 
 * Provides O(1) lookup for all 560 technique-stance combinations
 * with intelligent fallback system and build-time validation.
 * 
 * @class
 * @public
 */
export class TechniqueAnimationMapper {
  /** Primary animation mapping table */
  private readonly animationMap: Map<string, TechniqueAnimation>;
  
  /** Fallback animations by technique type */
  private readonly fallbackMap: Map<TechniqueTypeCategory, AnimationState>;
  
  /** Cache for generated combinations (validation) */
  private allCombinationsCache?: readonly TechniqueAnimationKey[];

  constructor() {
    this.animationMap = new Map();
    this.fallbackMap = this.initializeFallbacks();
    this.initializeCompleteMapping();
  }

  /**
   * Get animation for specific technique
   * 
   * **Korean**: 특정 기술의 애니메이션 가져오기
   * 
   * Uses 3-tier lookup strategy:
   * 1. Exact match (stance + type + part + intensity)
   * 2. Intensity-agnostic (stance + type + part + medium intensity)
   * 3. Technique type fallback (generic animation for technique type)
   * 
   * @param key - Technique animation key
   * @returns Technique animation configuration
   * 
   * @public
   * @korean 애니메이션가져오기
   */
  public getAnimation(key: TechniqueAnimationKey): TechniqueAnimation {
    // Try exact match first
    const lookupKey = this.createLookupKey(key);
    const exactMatch = this.animationMap.get(lookupKey);
    if (exactMatch) {
      return exactMatch;
    }

    // Fallback: Try without intensity (use medium)
    const genericKey = this.createLookupKey({
      ...key,
      intensity: "medium",
    });
    const genericMatch = this.animationMap.get(genericKey);
    if (genericMatch) {
      return this.adjustForIntensity(genericMatch, key.intensity);
    }

    // Final fallback: Use technique type generic animation
    return this.getFallbackAnimation(key);
  }

  /**
   * Create composite lookup key from technique animation key
   * 
   * **Korean**: 복합 조회 키 생성
   * 
   * Format: "stance-type-part-intensity"
   * Example: "geon-strike-head-heavy"
   * 
   * @param key - Technique animation key
   * @returns Composite lookup string
   * 
   * @private
   */
  private createLookupKey(key: TechniqueAnimationKey): string {
    return `${key.stance}-${key.techniqueType}-${key.bodyPart}-${key.intensity}`;
  }

  /**
   * Initialize fallback animations by technique type
   * 
   * **Korean**: 기술 유형별 대체 애니메이션 초기화
   * 
   * @private
   */
  private initializeFallbacks(): Map<TechniqueTypeCategory, AnimationState> {
    return new Map([
      ["strike", "attack"],
      ["joint", "attack"],
      ["throw", "attack"],
      ["pressure_point", "attack"],
    ]);
  }

  /**
   * Initialize complete mapping table
   * 
   * **Korean**: 전체 매핑 테이블 초기화
   * 
   * Maps all 560 combinations organized by:
   * - 8 stances
   * - 4 technique types
   * - 8 body parts
   * - 4 intensity levels
   * 
   * @private
   */
  private initializeCompleteMapping(): void {
    // Map all 8 trigram stances
    this.mapGeonStanceTechniques();
    this.mapTaeStanceTechniques();
    this.mapLiStanceTechniques();
    this.mapJinStanceTechniques();
    this.mapSonStanceTechniques();
    this.mapGamStanceTechniques();
    this.mapGanStanceTechniques();
    this.mapGonStanceTechniques();
  }

  /**
   * Map all techniques for Geon (Heaven) stance
   * 
   * **Korean**: 건괘 (하늘) 자세 기술 매핑
   * 
   * Philosophy: Direct force, overwhelming power, aggressive techniques
   * 
   * @private
   */
  private mapGeonStanceTechniques(): void {
    const stance = TrigramStance.GEON;
    const bodyParts = Object.values(BodyPart);
    const intensities: TechniqueIntensity[] = ["light", "medium", "heavy", "critical"];

    // Geon emphasizes direct striking techniques
    bodyParts.forEach((bodyPart) => {
      intensities.forEach((intensity) => {
        // Strike techniques - direct and forceful
        this.mapTechnique(
          { stance, techniqueType: "strike", bodyPart, intensity },
          {
            animationState: "attack",
            duration: this.getDurationForIntensity(intensity),
            impactFrame: this.getImpactFrameForIntensity(intensity),
            recoveryFrames: this.getRecoveryFramesForIntensity(intensity),
            priority: AnimationPriority.ATTACK,
            koreanName: this.generateKoreanName(stance, "strike", bodyPart, intensity),
            englishName: this.generateEnglishName(stance, "strike", bodyPart, intensity),
          }
        );

        // Joint techniques - forceful control
        this.mapTechnique(
          { stance, techniqueType: "joint", bodyPart, intensity },
          {
            animationState: "attack",
            duration: this.getDurationForIntensity(intensity) * 1.2, // Slightly slower
            impactFrame: this.getImpactFrameForIntensity(intensity),
            recoveryFrames: this.getRecoveryFramesForIntensity(intensity),
            priority: AnimationPriority.ATTACK,
            koreanName: this.generateKoreanName(stance, "joint", bodyPart, intensity),
            englishName: this.generateEnglishName(stance, "joint", bodyPart, intensity),
          }
        );

        // Throw techniques - powerful
        this.mapTechnique(
          { stance, techniqueType: "throw", bodyPart, intensity },
          {
            animationState: "attack",
            duration: this.getDurationForIntensity(intensity) * 1.5, // Longer for throws
            impactFrame: this.getImpactFrameForIntensity(intensity) + 4,
            recoveryFrames: this.getRecoveryFramesForIntensity(intensity) + 5,
            priority: AnimationPriority.ATTACK,
            koreanName: this.generateKoreanName(stance, "throw", bodyPart, intensity),
            englishName: this.generateEnglishName(stance, "throw", bodyPart, intensity),
          }
        );

        // Pressure point techniques - forceful precision
        this.mapTechnique(
          { stance, techniqueType: "pressure_point", bodyPart, intensity },
          {
            animationState: "attack",
            duration: this.getDurationForIntensity(intensity) * 0.8, // Faster
            impactFrame: this.getImpactFrameForIntensity(intensity) - 2,
            recoveryFrames: this.getRecoveryFramesForIntensity(intensity),
            priority: AnimationPriority.ATTACK,
            koreanName: this.generateKoreanName(stance, "pressure_point", bodyPart, intensity),
            englishName: this.generateEnglishName(stance, "pressure_point", bodyPart, intensity),
          }
        );
      });
    });
  }

  /**
   * Map all techniques for Tae (Lake) stance
   * 
   * **Korean**: 태괘 (호수) 자세 기술 매핑
   * 
   * Philosophy: Fluid movement, joint manipulation, flowing techniques
   * 
   * @private
   */
  private mapTaeStanceTechniques(): void {
    const stance = TrigramStance.TAE;
    const bodyParts = Object.values(BodyPart);
    const intensities: TechniqueIntensity[] = ["light", "medium", "heavy", "critical"];

    bodyParts.forEach((bodyPart) => {
      intensities.forEach((intensity) => {
        // All technique types with fluid, flowing characteristics
        const techniqueTypes: TechniqueTypeCategory[] = ["strike", "joint", "throw", "pressure_point"];
        
        techniqueTypes.forEach((techniqueType) => {
          this.mapTechnique(
            { stance, techniqueType, bodyPart, intensity },
            {
              animationState: "attack",
              duration: this.getDurationForIntensity(intensity) * (techniqueType === "joint" ? 1.3 : 1.0),
              impactFrame: this.getImpactFrameForIntensity(intensity),
              recoveryFrames: this.getRecoveryFramesForIntensity(intensity) - 2, // Faster recovery (fluid)
              priority: AnimationPriority.ATTACK,
              koreanName: this.generateKoreanName(stance, techniqueType, bodyPart, intensity),
              englishName: this.generateEnglishName(stance, techniqueType, bodyPart, intensity),
            }
          );
        });
      });
    });
  }

  /**
   * Map all techniques for Li (Fire) stance
   * 
   * **Korean**: 리괘 (불) 자세 기술 매핑
   * 
   * Philosophy: Precision and speed, rapid attacks, nerve strikes
   * 
   * @private
   */
  private mapLiStanceTechniques(): void {
    const stance = TrigramStance.LI;
    const bodyParts = Object.values(BodyPart);
    const intensities: TechniqueIntensity[] = ["light", "medium", "heavy", "critical"];

    bodyParts.forEach((bodyPart) => {
      intensities.forEach((intensity) => {
        const techniqueTypes: TechniqueTypeCategory[] = ["strike", "joint", "throw", "pressure_point"];
        
        techniqueTypes.forEach((techniqueType) => {
          this.mapTechnique(
            { stance, techniqueType, bodyPart, intensity },
            {
              animationState: "attack",
              duration: this.getDurationForIntensity(intensity) * 0.85, // Faster (fire)
              impactFrame: this.getImpactFrameForIntensity(intensity) - 1,
              recoveryFrames: this.getRecoveryFramesForIntensity(intensity) - 3, // Quick recovery
              priority: AnimationPriority.ATTACK,
              koreanName: this.generateKoreanName(stance, techniqueType, bodyPart, intensity),
              englishName: this.generateEnglishName(stance, techniqueType, bodyPart, intensity),
            }
          );
        });
      });
    });
  }

  /**
   * Map all techniques for Jin (Thunder) stance
   * 
   * **Korean**: 진괘 (천둥) 자세 기술 매핑
   * 
   * Philosophy: Explosive power, shocking techniques, sudden movements
   * 
   * @private
   */
  private mapJinStanceTechniques(): void {
    const stance = TrigramStance.JIN;
    const bodyParts = Object.values(BodyPart);
    const intensities: TechniqueIntensity[] = ["light", "medium", "heavy", "critical"];

    bodyParts.forEach((bodyPart) => {
      intensities.forEach((intensity) => {
        const techniqueTypes: TechniqueTypeCategory[] = ["strike", "joint", "throw", "pressure_point"];
        
        techniqueTypes.forEach((techniqueType) => {
          this.mapTechnique(
            { stance, techniqueType, bodyPart, intensity },
            {
              animationState: "attack",
              duration: this.getDurationForIntensity(intensity) * 0.9, // Slightly faster (explosive)
              impactFrame: this.getImpactFrameForIntensity(intensity),
              recoveryFrames: this.getRecoveryFramesForIntensity(intensity) + 2, // Longer recovery (explosive power)
              priority: AnimationPriority.ATTACK,
              koreanName: this.generateKoreanName(stance, techniqueType, bodyPart, intensity),
              englishName: this.generateEnglishName(stance, techniqueType, bodyPart, intensity),
            }
          );
        });
      });
    });
  }

  /**
   * Map all techniques for Son (Wind) stance
   * 
   * **Korean**: 손괘 (바람) 자세 기술 매핑
   * 
   * Philosophy: Continuous pressure, evasion, mobility
   * 
   * @private
   */
  private mapSonStanceTechniques(): void {
    const stance = TrigramStance.SON;
    const bodyParts = Object.values(BodyPart);
    const intensities: TechniqueIntensity[] = ["light", "medium", "heavy", "critical"];

    bodyParts.forEach((bodyPart) => {
      intensities.forEach((intensity) => {
        const techniqueTypes: TechniqueTypeCategory[] = ["strike", "joint", "throw", "pressure_point"];
        
        techniqueTypes.forEach((techniqueType) => {
          this.mapTechnique(
            { stance, techniqueType, bodyPart, intensity },
            {
              animationState: "attack",
              duration: this.getDurationForIntensity(intensity) * 0.95, // Slightly faster (continuous)
              impactFrame: this.getImpactFrameForIntensity(intensity),
              recoveryFrames: this.getRecoveryFramesForIntensity(intensity) - 1, // Faster recovery (mobility)
              priority: AnimationPriority.ATTACK,
              koreanName: this.generateKoreanName(stance, techniqueType, bodyPart, intensity),
              englishName: this.generateEnglishName(stance, techniqueType, bodyPart, intensity),
            }
          );
        });
      });
    });
  }

  /**
   * Map all techniques for Gam (Water) stance
   * 
   * **Korean**: 감괘 (물) 자세 기술 매핑
   * 
   * Philosophy: Flow and adaptation, counter techniques, redirection
   * 
   * @private
   */
  private mapGamStanceTechniques(): void {
    const stance = TrigramStance.GAM;
    const bodyParts = Object.values(BodyPart);
    const intensities: TechniqueIntensity[] = ["light", "medium", "heavy", "critical"];

    bodyParts.forEach((bodyPart) => {
      intensities.forEach((intensity) => {
        const techniqueTypes: TechniqueTypeCategory[] = ["strike", "joint", "throw", "pressure_point"];
        
        techniqueTypes.forEach((techniqueType) => {
          this.mapTechnique(
            { stance, techniqueType, bodyPart, intensity },
            {
              animationState: "attack",
              duration: this.getDurationForIntensity(intensity) * 1.1, // Slightly slower (adaptive)
              impactFrame: this.getImpactFrameForIntensity(intensity) + 1,
              recoveryFrames: this.getRecoveryFramesForIntensity(intensity), // Standard recovery
              priority: AnimationPriority.ATTACK,
              koreanName: this.generateKoreanName(stance, techniqueType, bodyPart, intensity),
              englishName: this.generateEnglishName(stance, techniqueType, bodyPart, intensity),
            }
          );
        });
      });
    });
  }

  /**
   * Map all techniques for Gan (Mountain) stance
   * 
   * **Korean**: 간괘 (산) 자세 기술 매핑
   * 
   * Philosophy: Defensive mastery, immovable stance, endurance
   * 
   * @private
   */
  private mapGanStanceTechniques(): void {
    const stance = TrigramStance.GAN;
    const bodyParts = Object.values(BodyPart);
    const intensities: TechniqueIntensity[] = ["light", "medium", "heavy", "critical"];

    bodyParts.forEach((bodyPart) => {
      intensities.forEach((intensity) => {
        const techniqueTypes: TechniqueTypeCategory[] = ["strike", "joint", "throw", "pressure_point"];
        
        techniqueTypes.forEach((techniqueType) => {
          this.mapTechnique(
            { stance, techniqueType, bodyPart, intensity },
            {
              animationState: "attack",
              duration: this.getDurationForIntensity(intensity) * 1.2, // Slower (defensive)
              impactFrame: this.getImpactFrameForIntensity(intensity) + 2,
              recoveryFrames: this.getRecoveryFramesForIntensity(intensity) + 3, // Longer recovery (immovable)
              priority: AnimationPriority.ATTACK,
              koreanName: this.generateKoreanName(stance, techniqueType, bodyPart, intensity),
              englishName: this.generateEnglishName(stance, techniqueType, bodyPart, intensity),
            }
          );
        });
      });
    });
  }

  /**
   * Map all techniques for Gon (Earth) stance
   * 
   * **Korean**: 곤괘 (땅) 자세 기술 매핑
   * 
   * Philosophy: Grounding techniques, takedowns, throws
   * 
   * @private
   */
  private mapGonStanceTechniques(): void {
    const stance = TrigramStance.GON;
    const bodyParts = Object.values(BodyPart);
    const intensities: TechniqueIntensity[] = ["light", "medium", "heavy", "critical"];

    bodyParts.forEach((bodyPart) => {
      intensities.forEach((intensity) => {
        const techniqueTypes: TechniqueTypeCategory[] = ["strike", "joint", "throw", "pressure_point"];
        
        techniqueTypes.forEach((techniqueType) => {
          this.mapTechnique(
            { stance, techniqueType, bodyPart, intensity },
            {
              animationState: "attack",
              duration: this.getDurationForIntensity(intensity) * (techniqueType === "throw" ? 1.6 : 1.0),
              impactFrame: this.getImpactFrameForIntensity(intensity) + (techniqueType === "throw" ? 3 : 0),
              recoveryFrames: this.getRecoveryFramesForIntensity(intensity) + (techniqueType === "throw" ? 4 : 0),
              priority: AnimationPriority.ATTACK,
              koreanName: this.generateKoreanName(stance, techniqueType, bodyPart, intensity),
              englishName: this.generateEnglishName(stance, techniqueType, bodyPart, intensity),
            }
          );
        });
      });
    });
  }

  /**
   * Add single technique mapping to the map
   * 
   * **Korean**: 단일 기술 매핑 추가
   * 
   * @private
   */
  private mapTechnique(
    key: TechniqueAnimationKey,
    animation: TechniqueAnimation
  ): void {
    const lookupKey = this.createLookupKey(key);
    this.animationMap.set(lookupKey, animation);
  }

  /**
   * Get duration based on intensity level
   * 
   * **Korean**: 강도 레벨에 따른 지속시간 가져오기
   * 
   * @private
   */
  private getDurationForIntensity(intensity: TechniqueIntensity): number {
    const baseDuration = 0.6; // 600ms base
    switch (intensity) {
      case "light":
        return baseDuration * 0.7; // 420ms
      case "medium":
        return baseDuration; // 600ms
      case "heavy":
        return baseDuration * 1.3; // 780ms
      case "critical":
        return baseDuration * 1.6; // 960ms
    }
  }

  /**
   * Get impact frame based on intensity level
   * 
   * **Korean**: 강도 레벨에 따른 충격 프레임 가져오기
   * 
   * @private
   */
  private getImpactFrameForIntensity(intensity: TechniqueIntensity): number {
    switch (intensity) {
      case "light":
        return 8; // Frame 8 at 60fps
      case "medium":
        return 10; // Frame 10
      case "heavy":
        return 14; // Frame 14
      case "critical":
        return 18; // Frame 18
    }
  }

  /**
   * Get recovery frames based on intensity level
   * 
   * **Korean**: 강도 레벨에 따른 회복 프레임 가져오기
   * 
   * @private
   */
  private getRecoveryFramesForIntensity(intensity: TechniqueIntensity): number {
    switch (intensity) {
      case "light":
        return 8; // 8 frames recovery
      case "medium":
        return 12; // 12 frames recovery
      case "heavy":
        return 18; // 18 frames recovery
      case "critical":
        return 24; // 24 frames recovery
    }
  }

  /**
   * Generate Korean technique name
   * 
   * **Korean**: 한글 기술 이름 생성
   * 
   * Format: "스탠스 신체부위 기술유형"
   * Example: "건괘 두부 타격"
   * 
   * @private
   */
  private generateKoreanName(
    stance: string,
    techniqueType: TechniqueTypeCategory,
    bodyPart: string,
    intensity: TechniqueIntensity
  ): string {
    const stanceName = STANCE_KOREAN[stance] || stance;
    const bodyPartName = BODY_PART_KOREAN[bodyPart] || bodyPart;
    const techniqueName = TECHNIQUE_TYPE_KOREAN[techniqueType] || techniqueType;
    const intensityName = this.getIntensityKorean(intensity);
    
    return `${stanceName} ${bodyPartName} ${intensityName} ${techniqueName}`;
  }

  /**
   * Generate English technique name
   * 
   * Format: "Stance BodyPart Intensity TechniqueType"
   * Example: "Heaven Head Heavy Strike"
   * 
   * @private
   */
  private generateEnglishName(
    stance: string,
    techniqueType: TechniqueTypeCategory,
    bodyPart: string,
    intensity: TechniqueIntensity
  ): string {
    const stanceName = STANCE_ENGLISH[stance] || stance;
    const bodyPartName = BODY_PART_ENGLISH[bodyPart] || bodyPart;
    const techniqueName = TECHNIQUE_TYPE_ENGLISH[techniqueType] || techniqueType;
    const intensityName = intensity.charAt(0).toUpperCase() + intensity.slice(1);
    
    return `${stanceName} ${bodyPartName} ${intensityName} ${techniqueName}`;
  }

  /**
   * Get Korean intensity name
   * 
   * @private
   */
  private getIntensityKorean(intensity: TechniqueIntensity): string {
    switch (intensity) {
      case "light":
        return "경";
      case "medium":
        return "중";
      case "heavy":
        return "중";
      case "critical":
        return "극";
    }
  }

  /**
   * Adjust animation for different intensity
   * 
   * **Korean**: 강도에 따른 애니메이션 조정
   * 
   * @private
   */
  private adjustForIntensity(
    animation: TechniqueAnimation,
    intensity: TechniqueIntensity
  ): TechniqueAnimation {
    const durationMultiplier = this.getDurationMultiplierForIntensity(intensity);
    
    return {
      ...animation,
      duration: animation.duration * durationMultiplier,
      impactFrame: Math.round(animation.impactFrame * durationMultiplier),
      recoveryFrames: Math.round(animation.recoveryFrames * durationMultiplier),
    };
  }

  /**
   * Get duration multiplier for intensity
   * 
   * @private
   */
  private getDurationMultiplierForIntensity(intensity: TechniqueIntensity): number {
    switch (intensity) {
      case "light":
        return 0.7;
      case "medium":
        return 1.0;
      case "heavy":
        return 1.3;
      case "critical":
        return 1.6;
    }
  }

  /**
   * Get fallback animation when no exact match
   * 
   * **Korean**: 일치하는 항목이 없을 때 대체 애니메이션 가져오기
   * 
   * @private
   */
  private getFallbackAnimation(key: TechniqueAnimationKey): TechniqueAnimation {
    const fallbackState = this.fallbackMap.get(key.techniqueType) || "attack";
    
    return {
      animationState: fallbackState,
      duration: this.getDurationForIntensity(key.intensity),
      impactFrame: this.getImpactFrameForIntensity(key.intensity),
      recoveryFrames: this.getRecoveryFramesForIntensity(key.intensity),
      priority: AnimationPriority.ATTACK,
      koreanName: "일반 기술",
      englishName: "Generic Technique",
    };
  }

  /**
   * Generate all possible technique combinations
   * 
   * **Korean**: 모든 가능한 기술 조합 생성
   * 
   * @private
   */
  private generateAllCombinations(): readonly TechniqueAnimationKey[] {
    if (this.allCombinationsCache) {
      return this.allCombinationsCache;
    }

    const stances = Object.values(TrigramStance);
    const techniqueTypes: TechniqueTypeCategory[] = ["strike", "joint", "throw", "pressure_point"];
    const bodyParts = Object.values(BodyPart);
    const intensities: TechniqueIntensity[] = ["light", "medium", "heavy", "critical"];

    const combinations: TechniqueAnimationKey[] = [];

    stances.forEach((stance) => {
      techniqueTypes.forEach((techniqueType) => {
        bodyParts.forEach((bodyPart) => {
          intensities.forEach((intensity) => {
            combinations.push({
              stance,
              techniqueType,
              bodyPart,
              intensity,
            });
          });
        });
      });
    });

    this.allCombinationsCache = combinations;
    return combinations;
  }

  /**
   * Validate mapping completeness at build time
   * 
   * **Korean**: 빌드 시간에 매핑 완전성 검증
   * 
   * Reports coverage percentage and lists missing mappings.
   * Expected: 8 stances × 4 technique types × 8 body parts × 4 intensities = 1024 combinations
   * (Note: The issue mentions 560 combinations, but with 8 body parts this is 1024)
   * 
   * @returns Validation result with coverage and missing mappings
   * 
   * @public
   * @korean 완전성검증
   */
  public validateCompleteness(): MappingValidationResult {
    const allCombinations = this.generateAllCombinations();
    const missing: TechniqueAnimationKey[] = [];

    allCombinations.forEach((combo) => {
      const key = this.createLookupKey(combo);
      if (!this.animationMap.has(key)) {
        missing.push(combo);
      }
    });

    const mapped = allCombinations.length - missing.length;
    const coverage = (mapped / allCombinations.length) * 100;
    
    return {
      coverage,
      total: allCombinations.length,
      mapped,
      missing,
    };
  }

  /**
   * Get total number of mapped combinations
   * 
   * **Korean**: 매핑된 조합의 총 개수 가져오기
   * 
   * @returns Number of mapped combinations
   * 
   * @public
   */
  public getMappedCount(): number {
    return this.animationMap.size;
  }
}

/**
 * Singleton instance of TechniqueAnimationMapper
 * 
 * **Korean**: 기술 애니메이션 매퍼 싱글톤 인스턴스
 * 
 * Use this instance throughout the application for consistent
 * technique animation mapping.
 * 
 * @public
 * @korean 싱글톤인스턴스
 */
export const techniqueAnimationMapper = new TechniqueAnimationMapper();
