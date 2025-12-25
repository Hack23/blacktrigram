/**
 * Body Part Health System Types
 * 
 * **Korean**: 신체부위 체력 시스템 타입
 * 
 * This module defines types for the body part-specific health tracking system,
 * which replaces the single health bar with independent health tracking for
 * each major body region. This enables realistic localized damage and combat
 * trauma simulation.
 * 
 * ## Body Part Health Philosophy
 * 
 * Traditional Korean martial arts emphasize targeting specific body regions
 * to achieve maximum combat effectiveness. This system reflects that by
 * tracking damage to:
 * - **HEAD** (두부): Consciousness and awareness
 * - **NECK** (경부): Vascular and respiratory function
 * - **TORSO_UPPER** (상부 몸통): Heart, lungs, vital organs
 * - **TORSO_LOWER** (하부 몸통): Stamina and core strength
 * - **ARM_LEFT/RIGHT** (좌/우팔): Attack capability
 * - **LEG_LEFT/RIGHT** (좌/우다리): Mobility and balance
 * 
 * @module systems/bodypart/types
 * @category Body Part System
 * @korean 신체부위타입
 */

import { KoreanText } from "@/types";

/**
 * Body part identifiers for health tracking.
 * 
 * **Korean**: 신체 부위 (Body Parts)
 * 
 * Each body part tracks independent health from 0-100 HP. Damage to specific
 * parts affects different combat capabilities based on anatomical function.
 * 
 * @example
 * ```typescript
 * const bodyPart: BodyPart = BodyPart.HEAD;
 * const health = player.bodyPartHealth[bodyPart]; // 0-100
 * ```
 * 
 * @public
 * @category Body Part System
 * @korean 신체부위
 */
export enum BodyPart {
  /** Head region - affects consciousness and awareness */
  HEAD = "head",
  /** Neck region - affects breathing and blood flow */
  NECK = "neck",
  /** Upper torso - affects heart, lungs, stamina recovery */
  TORSO_UPPER = "torsoUpper",
  /** Lower torso - affects core strength and balance */
  TORSO_LOWER = "torsoLower",
  /** Left arm - affects attack capability on left side */
  ARM_LEFT = "armLeft",
  /** Right arm - affects attack capability on right side */
  ARM_RIGHT = "armRight",
  /** Left leg - affects movement and balance */
  LEG_LEFT = "legLeft",
  /** Right leg - affects movement and balance */
  LEG_RIGHT = "legRight",
}

/**
 * Health values for each body part (0-100 HP per part).
 * 
 * **Korean**: 신체 부위별 체력
 * 
 * Tracks independent health pools for each major body region. When a body part
 * reaches 0 HP, it becomes non-functional and applies severe combat penalties.
 * 
 * ## Default Health Values
 * 
 * All body parts start at 100 HP. Different archetypes may have variations:
 * - **무사 (Musa)**: Balanced health across all parts
 * - **암살자 (Amsalja)**: Lower torso health, higher arm precision
 * - **해커 (Hacker)**: Enhanced head/neck (cyber augmentation)
 * - **정보요원 (Jeongbo)**: Balanced with slight defensive boost
 * - **조직폭력배 (Jojik)**: Higher torso/leg health (street hardened)
 * 
 * @example
 * ```typescript
 * const bodyHealth: BodyPartHealth = {
 *   head: 100,
 *   neck: 100,
 *   torsoUpper: 100,
 *   torsoLower: 100,
 *   armLeft: 100,
 *   armRight: 100,
 *   legLeft: 100,
 *   legRight: 100,
 * };
 * ```
 * 
 * @public
 * @category Body Part System
 * @korean 신체부위체력
 */
export interface BodyPartHealth {
  /** Head health (0-100 HP) - affects consciousness */
  readonly head: number;
  /** Neck health (0-100 HP) - affects breathing and circulation */
  readonly neck: number;
  /** Upper torso health (0-100 HP) - affects stamina recovery */
  readonly torsoUpper: number;
  /** Lower torso health (0-100 HP) - affects balance and core strength */
  readonly torsoLower: number;
  /** Left arm health (0-100 HP) - affects left-side attacks */
  readonly armLeft: number;
  /** Right arm health (0-100 HP) - affects right-side attacks */
  readonly armRight: number;
  /** Left leg health (0-100 HP) - affects movement and stance */
  readonly legLeft: number;
  /** Right leg health (0-100 HP) - affects movement and stance */
  readonly legRight: number;
}

/**
 * Maximum health values for each body part.
 * 
 * **Korean**: 최대 신체 부위 체력
 * 
 * Defines the maximum HP capacity for each body part. Can be modified by
 * archetype, equipment, or training bonuses.
 * 
 * @public
 * @category Body Part System
 * @korean 최대신체부위체력
 */
export interface BodyPartMaxHealth {
  /** Maximum head health */
  readonly head: number;
  /** Maximum neck health */
  readonly neck: number;
  /** Maximum upper torso health */
  readonly torsoUpper: number;
  /** Maximum lower torso health */
  readonly torsoLower: number;
  /** Maximum left arm health */
  readonly armLeft: number;
  /** Maximum right arm health */
  readonly armRight: number;
  /** Maximum left leg health */
  readonly legLeft: number;
  /** Maximum right leg health */
  readonly legRight: number;
}

/**
 * Combat capability effects from body part damage.
 * 
 * **Korean**: 신체 부위 손상 효과
 * 
 * Defines how damage to specific body parts affects combat performance.
 * Effects are applied as multipliers to base stats (0.0 = disabled, 1.0 = normal).
 * 
 * ## Effect Thresholds
 * 
 * - **100-75% HP**: No penalties (1.0x)
 * - **75-50% HP**: Minor penalties (0.9-0.8x)
 * - **50-25% HP**: Major penalties (0.7-0.5x)
 * - **25-0% HP**: Severe penalties (0.3-0.1x)
 * - **0% HP**: Non-functional (0.0x)
 * 
 * @example
 * ```typescript
 * const effects: BodyPartEffects = {
 *   consciousnessModifier: 0.75, // Head at 50% HP
 *   staminaRegenModifier: 0.5,   // Torso damaged
 *   attackDamageModifier: 0.7,   // Arm injured
 *   movementSpeedModifier: 0.6,  // Leg damaged
 * };
 * ```
 * 
 * @public
 * @category Body Part System
 * @korean 신체부위효과
 */
export interface BodyPartEffects {
  /** Consciousness and awareness multiplier (0.0-1.0) - from head/neck damage */
  readonly consciousnessModifier: number;
  /** Stamina regeneration multiplier (0.0-1.0) - from torso damage */
  readonly staminaRegenModifier: number;
  /** Attack damage multiplier (0.0-1.0) - from arm damage */
  readonly attackDamageModifier: number;
  /** Movement speed multiplier (0.0-1.0) - from leg damage */
  readonly movementSpeedModifier: number;
  /** Balance modifier (0.0-1.0) - from lower torso and leg damage */
  readonly balanceModifier: number;
  /** Technique accuracy multiplier (0.0-1.0) - from head/arm damage */
  readonly techniqueAccuracyModifier: number;
}

/**
 * Damage distribution configuration for body parts.
 * 
 * **Korean**: 신체 부위 피해 분배
 * 
 * Defines how damage from attacks is distributed across body parts based on
 * the hit location and attack type. Not all damage goes to a single part;
 * impact can affect adjacent regions.
 * 
 * @example
 * ```typescript
 * // Strike to head distributes damage
 * const distribution: BodyPartDamageDistribution = {
 *   primary: { part: BodyPart.HEAD, percentage: 0.8 },
 *   secondary: [
 *     { part: BodyPart.NECK, percentage: 0.2 }
 *   ]
 * };
 * ```
 * 
 * @public
 * @category Body Part System
 * @korean 신체부위피해분배
 */
export interface BodyPartDamageDistribution {
  /** Primary body part receiving most damage */
  readonly primary: {
    readonly part: BodyPart;
    readonly percentage: number; // 0.0-1.0
  };
  /** Secondary body parts receiving splash damage */
  readonly secondary: readonly {
    readonly part: BodyPart;
    readonly percentage: number; // 0.0-1.0
  }[];
}

/**
 * Body part status information for UI display.
 * 
 * **Korean**: 신체 부위 상태 정보
 * 
 * Provides UI-friendly data about body part health status including
 * color coding, status text, and icon information.
 * 
 * @public
 * @category Body Part System
 * @korean 신체부위상태
 */
export interface BodyPartStatus {
  /** Body part identifier */
  readonly part: BodyPart;
  /** Current health (0-100) */
  readonly health: number;
  /** Maximum health */
  readonly maxHealth: number;
  /** Health percentage (0.0-1.0) */
  readonly percentage: number;
  /** Status description */
  readonly status: KoreanText;
  /** Color code for UI (hex number) */
  readonly color: number;
  /** Whether this part is critically damaged */
  readonly critical: boolean;
  /** Whether this part is non-functional */
  readonly disabled: boolean;
}

/**
 * Configuration for body part health system.
 * 
 * **Korean**: 신체 부위 시스템 설정
 * 
 * Defines thresholds, multipliers, and constants used by the body part
 * health system for damage calculation and effect application.
 * 
 * @public
 * @category Body Part System
 * @korean 신체부위설정
 */
export interface BodyPartHealthConfig {
  /** Default max health for all body parts */
  readonly defaultMaxHealth: number;
  /** Health threshold for minor penalties (percentage) */
  readonly minorPenaltyThreshold: number;
  /** Health threshold for major penalties (percentage) */
  readonly majorPenaltyThreshold: number;
  /** Health threshold for severe penalties (percentage) */
  readonly severePenaltyThreshold: number;
  /** Health threshold for critical status (percentage) */
  readonly criticalThreshold: number;
  /** Effect multipliers for each threshold tier */
  readonly effectMultipliers: {
    readonly minor: number;
    readonly major: number;
    readonly severe: number;
    readonly critical: number;
  };
}

/**
 * Default configuration values for body part health system.
 * 
 * @public
 * @category Body Part System
 */
export const DEFAULT_BODY_PART_CONFIG: BodyPartHealthConfig = {
  defaultMaxHealth: 100,
  minorPenaltyThreshold: 0.75,  // 75% HP
  majorPenaltyThreshold: 0.50,   // 50% HP
  severePenaltyThreshold: 0.25,  // 25% HP
  criticalThreshold: 0.10,       // 10% HP
  effectMultipliers: {
    minor: 0.90,    // 10% penalty
    major: 0.70,    // 30% penalty
    severe: 0.40,   // 60% penalty
    critical: 0.10, // 90% penalty
  },
} as const;

/**
 * Body part health effect constants matching acceptance criteria.
 * 
 * **Korean**: 신체 부위 효과 상수
 * 
 * Defines specific combat penalties as per requirements:
 * - Head <50%: Consciousness penalties
 * - Torso <50%: Stamina regen -50%
 * - Arms <50%: Attack damage -30%
 * - Legs <50%: Movement speed -40%
 * 
 * @public
 * @category Body Part System
 */
export const BODY_PART_EFFECT_CONSTANTS = {
  /** Head damage effects */
  HEAD: {
    CONSCIOUSNESS_PENALTY_AT_50: 0.75, // 25% consciousness reduction
    CRITICAL_THRESHOLD: 0.50,
  },
  /** Torso damage effects */
  TORSO: {
    STAMINA_REGEN_PENALTY_AT_50: 0.50, // 50% stamina regen reduction
    CRITICAL_THRESHOLD: 0.50,
  },
  /** Arm damage effects */
  ARMS: {
    ATTACK_DAMAGE_PENALTY_AT_50: 0.70, // 30% attack damage reduction
    CRITICAL_THRESHOLD: 0.50,
  },
  /** Leg damage effects */
  LEGS: {
    MOVEMENT_SPEED_PENALTY_AT_50: 0.60, // 40% movement speed reduction
    CRITICAL_THRESHOLD: 0.50,
  },
} as const;

/**
 * Leg injury severity levels for movement penalties.
 * 
 * **Korean**: 다리 부상 정도 (Leg Injury Severity)
 * 
 * Defines movement impairment states based on leg health percentage.
 * 
 * @public
 * @category Body Part System
 * @korean 다리부상정도
 */
export enum LegInjuryState {
  /** Normal movement - Leg health 100-70% */
  NORMAL = "normal",
  /** Limping - Leg health 69-50% */
  LIMPING = "limping",
  /** Severe limp - Leg health 49-30% */
  SEVERE_LIMP = "severe_limp",
  /** Hobbled - Leg health <30%, cannot run */
  HOBBLED = "hobbled",
}

/**
 * Movement penalty applied from leg damage.
 * 
 * **Korean**: 이동 패널티 (Movement Penalty)
 * 
 * Describes the current movement impairment including speed reduction,
 * stance change penalties, and balance effects.
 * 
 * @public
 * @category Body Part System
 * @korean 이동패널티
 */
export interface MovementPenalty {
  /** Movement speed multiplier (0.0-1.0) */
  readonly speedMultiplier: number;
  /** Whether player can run (false when hobbled) */
  readonly canRun: boolean;
  /** Current injury state */
  readonly injuryState: LegInjuryState;
  /** Stance change duration multiplier (1.0 = normal, 2.0 = 2x slower) */
  readonly stanceChangePenalty: number;
  /** Whether advanced stances are restricted */
  readonly advancedStancesRestricted: boolean;
  /** Balance modifier from leg damage (0.0-1.0) */
  readonly balanceModifier: number;
  /** Whether instant penalty is active (from knee/ankle strike) */
  readonly hasInstantPenalty: boolean;
  /** Timestamp when instant penalty expires (0 if not active) */
  readonly instantPenaltyExpiry: number;
}

/**
 * Instant movement penalty from knee/ankle strikes.
 * 
 * **Korean**: 순간 이동 패널티 (Instant Movement Penalty)
 * 
 * Applied immediately upon striking knee or ankle vital points,
 * causing temporary severe movement impairment.
 * 
 * @public
 * @category Body Part System
 * @korean 순간이동패널티
 */
export interface InstantMovementPenalty {
  /** Speed multiplier during instant penalty */
  readonly speedMultiplier: number;
  /** Duration in milliseconds */
  readonly duration: number;
  /** Timestamp when penalty was applied */
  readonly appliedAt: number;
  /** Body part that was struck */
  readonly affectedPart: BodyPart;
}

/**
 * Movement penalty constants matching acceptance criteria.
 * 
 * **Korean**: 이동 패널티 상수
 * 
 * Defines thresholds and multipliers for injury-based movement penalties:
 * - 100-70%: Normal speed (100%)
 * - 69-50%: Limping (-20% speed)
 * - 49-30%: Severe limp (-40% speed)
 * - <30%: Hobbled (-60% speed, cannot run)
 * 
 * @public
 * @category Body Part System
 */
export const MOVEMENT_PENALTY_CONSTANTS = {
  /** Health percentage thresholds for injury states */
  THRESHOLDS: {
    NORMAL: 0.70,        // 70% and above
    LIMPING: 0.50,       // 50-69%
    SEVERE_LIMP: 0.30,   // 30-49%
    HOBBLED: 0.0,        // Below 30%
  },
  
  /** Speed multipliers for each injury state */
  SPEED_MULTIPLIERS: {
    NORMAL: 1.0,         // 100% speed
    LIMPING: 0.8,        // 80% speed (-20%)
    SEVERE_LIMP: 0.6,    // 60% speed (-40%)
    HOBBLED: 0.4,        // 40% speed (-60%)
  },
  
  /** Stance change penalty multipliers */
  STANCE_CHANGE: {
    NORMAL: 1.0,         // Normal duration
    INJURED: 2.0,        // 2x duration when legs <50%
    CRITICAL_THRESHOLD: 0.50,  // Threshold for stance penalties
    RESTRICTION_THRESHOLD: 0.30, // Threshold for advanced stance restriction
  },
  
  /** Instant penalty from knee/ankle strikes */
  INSTANT_PENALTY: {
    SPEED_MULTIPLIER: 0.3,  // 30% speed for 5 seconds
    DURATION: 5000,         // 5 seconds in milliseconds
  },
  
  /** Asymmetric damage effects */
  ASYMMETRIC: {
    /** Penalty when moving toward injured side */
    SAME_SIDE_PENALTY: 0.8,    // Additional 20% penalty
    /** Penalty when moving away from injured side */
    OPPOSITE_SIDE_PENALTY: 0.9, // Additional 10% penalty
  },
} as const;
