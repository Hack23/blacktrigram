/**
 * Recovery Animation System for Black Trigram
 * 
 * Implements realistic recovery animations for standing up from fallen states.
 * Based on Korean martial arts recovery techniques (기상 - Gisang).
 * 
 * @module systems/animation/RecoveryAnimations
 * @category Animation
 * @korean 기상애니메이션
 */

import type { RecoveryAnimationType, GroundState } from "./types";
import { GROUND_STATE_TO_RECOVERY, RECOVERY_TYPE_TO_ANIMATION } from "./types";

/**
 * Recovery animation keyframe data structure
 * 
 * Defines key poses during recovery animations for skeletal rendering.
 * Each keyframe specifies body positions at critical moments.
 * 
 * @korean 기상키프레임
 */
export interface RecoveryKeyframe {
  /** Frame number (0-indexed) */
  readonly frame: number;
  
  /** Torso rotation (radians) */
  readonly torsoRotation: { x: number; y: number; z: number };
  
  /** Center of mass vertical position (0-1, 1=standing, 0=ground) */
  readonly centerOfMassHeight: number;
  
  /** Description of this keyframe */
  readonly description: {
    readonly korean: string;
    readonly english: string;
  };
  
  /** Whether player is vulnerable at this frame */
  readonly vulnerable: boolean;
}

/**
 * Prone stand-up keyframes (엎드린 기상)
 * 
 * 30 frames (500ms) sequence:
 * - Frames 0-8: Push up with hands, torso lifts
 * - Frames 9-18: Legs swing under body, kneeling position
 * - Frames 19-24: Rise from kneeling to standing (vulnerable)
 * - Frames 25-29: Final stance adjustment (interruptible)
 * 
 * @korean 엎드린기상키프레임
 */
export const RECOVERY_PRONE_KEYFRAMES: readonly RecoveryKeyframe[] = [
  {
    frame: 0,
    torsoRotation: { x: 1.57, y: 0, z: 0 }, // Face down (90° forward)
    centerOfMassHeight: 0.05,
    description: {
      korean: "엎드린 자세",
      english: "Prone position",
    },
    vulnerable: true,
  },
  {
    frame: 8,
    torsoRotation: { x: 1.2, y: 0, z: 0 }, // Hands pushing, torso lifting
    centerOfMassHeight: 0.2,
    description: {
      korean: "손으로 밀어 올리기",
      english: "Hands push up torso",
    },
    vulnerable: true,
  },
  {
    frame: 18,
    torsoRotation: { x: 0.7, y: 0, z: 0 }, // Kneeling position
    centerOfMassHeight: 0.5,
    description: {
      korean: "무릎 꿇기",
      english: "Kneeling position",
    },
    vulnerable: true,
  },
  {
    frame: 24,
    torsoRotation: { x: 0.2, y: 0, z: 0 }, // Rising to standing
    centerOfMassHeight: 0.75,
    description: {
      korean: "일어서기",
      english: "Rising to standing",
    },
    vulnerable: false, // Last 6 frames (24-30) entering safe zone
  },
  {
    frame: 29,
    torsoRotation: { x: 0, y: 0, z: 0 }, // Standing (interruptible)
    centerOfMassHeight: 0.9,
    description: {
      korean: "서 있는 자세",
      english: "Standing stance",
    },
    vulnerable: false, // Last 6 frames (25-30) are not vulnerable
  },
] as const;

/**
 * Supine stand-up keyframes (누운 기상)
 * 
 * 36 frames (600ms) sequence:
 * - Frames 0-10: Abs crunch sit-up motion
 * - Frames 11-22: Forward roll onto feet
 * - Frames 23-30: Feet plant, rise to standing (vulnerable)
 * - Frames 31-35: Final stance adjustment (interruptible)
 * 
 * @korean 누운기상키프레임
 */
export const RECOVERY_SUPINE_KEYFRAMES: readonly RecoveryKeyframe[] = [
  {
    frame: 0,
    torsoRotation: { x: -1.57, y: 0, z: 0 }, // Face up (90° back)
    centerOfMassHeight: 0.05,
    description: {
      korean: "누운 자세",
      english: "Supine position",
    },
    vulnerable: true,
  },
  {
    frame: 10,
    torsoRotation: { x: -0.9, y: 0, z: 0 }, // Sit-up motion
    centerOfMassHeight: 0.3,
    description: {
      korean: "윗몸 일으키기",
      english: "Sit-up motion",
    },
    vulnerable: true,
  },
  {
    frame: 22,
    torsoRotation: { x: 0.4, y: 0, z: 0 }, // Forward roll
    centerOfMassHeight: 0.4,
    description: {
      korean: "전방 구르기",
      english: "Forward roll",
    },
    vulnerable: true,
  },
  {
    frame: 30,
    torsoRotation: { x: 0.2, y: 0, z: 0 }, // Feet planted, rising
    centerOfMassHeight: 0.7,
    description: {
      korean: "발 디디고 일어서기",
      english: "Feet planted, rising",
    },
    vulnerable: false, // Last 6 frames (30-36) entering safe zone
  },
  {
    frame: 35,
    torsoRotation: { x: 0, y: 0, z: 0 }, // Standing (interruptible)
    centerOfMassHeight: 0.9,
    description: {
      korean: "서 있는 자세",
      english: "Standing stance",
    },
    vulnerable: false, // Last 6 frames (30-36) are not vulnerable
  },
] as const;

/**
 * Roll recovery keyframes (회전기상)
 * 
 * 24 frames (400ms) sequence - FAST recovery
 * - Frames 0-6: Roll to side, momentum building
 * - Frames 7-14: Spring to feet with explosive movement
 * - Frames 15-18: Quick stance (vulnerable)
 * - Frames 19-23: Combat ready (interruptible)
 * 
 * Costs 20 stamina for speed advantage.
 * 
 * @korean 회전기상키프레임
 */
export const RECOVERY_ROLL_KEYFRAMES: readonly RecoveryKeyframe[] = [
  {
    frame: 0,
    torsoRotation: { x: 0, y: 1.57, z: 1.57 }, // Side position (90° roll)
    centerOfMassHeight: 0.05,
    description: {
      korean: "측면 자세",
      english: "Side position",
    },
    vulnerable: true,
  },
  {
    frame: 6,
    torsoRotation: { x: 0.3, y: 0.8, z: 0.9 }, // Rolling motion
    centerOfMassHeight: 0.25,
    description: {
      korean: "구르기 움직임",
      english: "Rolling motion",
    },
    vulnerable: true,
  },
  {
    frame: 14,
    torsoRotation: { x: 0.4, y: 0, z: 0 }, // Springing to feet
    centerOfMassHeight: 0.6,
    description: {
      korean: "발로 튀어오르기",
      english: "Spring to feet",
    },
    vulnerable: true,
  },
  {
    frame: 18,
    torsoRotation: { x: 0.1, y: 0, z: 0 }, // Quick stance
    centerOfMassHeight: 0.85,
    description: {
      korean: "빠른 자세",
      english: "Quick stance",
    },
    vulnerable: false, // Last 6 frames (18-24) entering safe zone
  },
  {
    frame: 23,
    torsoRotation: { x: 0, y: 0, z: 0 }, // Combat ready (interruptible)
    centerOfMassHeight: 0.9,
    description: {
      korean: "전투 준비",
      english: "Combat ready",
    },
    vulnerable: false, // Last 6 frames (18-24) are not vulnerable
  },
] as const;

/**
 * Defensive getup keyframes (방어기상)
 * 
 * 42 frames (700ms) sequence - SLOW but protected
 * - Frames 0-14: Slow rise with arms guarding head/torso
 * - Frames 15-28: Gradual stand with maintained guard
 * - Frames 29-36: Stance formation with guard (50% damage reduction)
 * - Frames 37-41: Ready stance (interruptible)
 * 
 * Provides 50% damage reduction throughout animation.
 * 
 * @korean 방어기상키프레임
 */
export const RECOVERY_DEFENSIVE_KEYFRAMES: readonly RecoveryKeyframe[] = [
  {
    frame: 0,
    torsoRotation: { x: 1.2, y: 0, z: 0 }, // Grounded, arms up
    centerOfMassHeight: 0.05,
    description: {
      korean: "지면에서 팔 올리기",
      english: "Grounded, arms up",
    },
    vulnerable: true, // 50% damage reduction applies
  },
  {
    frame: 14,
    torsoRotation: { x: 0.9, y: 0, z: 0 }, // Slow rise, guard maintained
    centerOfMassHeight: 0.3,
    description: {
      korean: "천천히 일어나며 방어",
      english: "Slow rise, guarded",
    },
    vulnerable: true, // 50% damage reduction applies
  },
  {
    frame: 28,
    torsoRotation: { x: 0.5, y: 0, z: 0 }, // Gradual stand, guard up
    centerOfMassHeight: 0.6,
    description: {
      korean: "점차 서며 방어 유지",
      english: "Gradual stand, guard up",
    },
    vulnerable: true, // 50% damage reduction applies
  },
  {
    frame: 36,
    torsoRotation: { x: 0.2, y: 0, z: 0 }, // Stance formation, guarded
    centerOfMassHeight: 0.8,
    description: {
      korean: "자세 형성, 방어 상태",
      english: "Stance formation, guarded",
    },
    vulnerable: false, // Last 6 frames (36-42) entering safe zone (still 50% reduction)
  },
  {
    frame: 41,
    torsoRotation: { x: 0, y: 0, z: 0 }, // Ready stance (interruptible)
    centerOfMassHeight: 0.9,
    description: {
      korean: "준비 자세",
      english: "Ready stance",
    },
    vulnerable: false, // Last 6 frames (36-42) are not vulnerable
  },
] as const;

/**
 * Get keyframes for a specific recovery type
 * 
 * @param recoveryType - Type of recovery animation
 * @returns Array of keyframes for that recovery type
 * 
 * @public
 * @korean 기상키프레임가져오기
 */
export function getRecoveryKeyframes(
  recoveryType: RecoveryAnimationType
): readonly RecoveryKeyframe[] {
  switch (recoveryType) {
    case "prone_standup":
      return RECOVERY_PRONE_KEYFRAMES;
    case "supine_standup":
      return RECOVERY_SUPINE_KEYFRAMES;
    case "roll_recovery":
      return RECOVERY_ROLL_KEYFRAMES;
    case "defensive_getup":
      return RECOVERY_DEFENSIVE_KEYFRAMES;
  }
}

/**
 * Check if a frame in a recovery animation is vulnerable
 * 
 * Vulnerability is determined by keyframe data. The last 6 frames
 * of each recovery animation are interruptible and not vulnerable.
 * 
 * @param recoveryType - Type of recovery animation
 * @param frame - Current frame number (0-indexed)
 * @returns True if player is vulnerable at this frame
 * 
 * @public
 * @korean 취약프레임확인
 */
export function isVulnerableFrame(
  recoveryType: RecoveryAnimationType,
  frame: number
): boolean {
  const keyframes = getRecoveryKeyframes(recoveryType);
  
  // Find the keyframe for this frame or the previous keyframe
  let currentKeyframe = keyframes[0];
  for (const kf of keyframes) {
    if (kf.frame <= frame) {
      currentKeyframe = kf;
    } else {
      break;
    }
  }
  
  return currentKeyframe.vulnerable;
}

/**
 * Determine appropriate recovery animation from ground state
 * 
 * Uses ground state to select default recovery animation.
 * Side positions default to roll recovery for dynamic movement.
 * 
 * @param groundState - Current ground position
 * @returns Default recovery animation type
 * 
 * @example
 * ```typescript
 * const recoveryType = determineRecoveryType("prone");
 * // Returns: "prone_standup"
 * 
 * const sideRecovery = determineRecoveryType("side_left");
 * // Returns: "roll_recovery" (default for side positions)
 * ```
 * 
 * @public
 * @korean 기상유형결정
 */
export function determineRecoveryType(
  groundState: GroundState
): RecoveryAnimationType {
  return GROUND_STATE_TO_RECOVERY[groundState];
}

/**
 * Get recovery animation state from recovery type
 * 
 * @param recoveryType - Recovery animation type
 * @returns Animation state name
 * 
 * @public
 * @korean 기상애니메이션상태
 */
export function getRecoveryAnimationState(
  recoveryType: RecoveryAnimationType
): string {
  return RECOVERY_TYPE_TO_ANIMATION[recoveryType];
}

/**
 * Recovery animation configuration
 * 
 * Additional properties for recovery animations beyond base AnimationConfig.
 * 
 * @korean 기상설정
 */
export interface RecoveryConfig {
  /** Recovery animation type */
  readonly type: RecoveryAnimationType;
  
  /** Stamina cost to execute (0 for normal recoveries) */
  readonly staminaCost: number;
  
  /** Damage reduction percentage during animation (0-1) */
  readonly damageReduction: number;
  
  /** Number of initial vulnerable frames (first N frames are vulnerable to damage) */
  readonly vulnerableFrames: number;
  
  /** Frame when player becomes interruptible (last 6 frames typically) */
  readonly interruptibleFrame: number;
}

/**
 * Recovery animation configurations
 * 
 * Defines stamina costs, damage reduction, and vulnerability windows.
 * 
 * @korean 기상설정맵
 */
export const RECOVERY_CONFIGS: Record<RecoveryAnimationType, RecoveryConfig> = {
  prone_standup: {
    type: "prone_standup",
    staminaCost: 0,
    damageReduction: 0,
    vulnerableFrames: 24, // Vulnerable for first 24 frames (80%)
    interruptibleFrame: 24, // Last 6 frames (25-30) are interruptible
  },
  supine_standup: {
    type: "supine_standup",
    staminaCost: 0,
    damageReduction: 0,
    vulnerableFrames: 30, // Vulnerable for first 30 frames (83%)
    interruptibleFrame: 30, // Last 6 frames (30-36) are interruptible
  },
  roll_recovery: {
    type: "roll_recovery",
    staminaCost: 20, // Costs stamina for speed
    damageReduction: 0,
    vulnerableFrames: 18, // Vulnerable for first 18 frames (75%)
    interruptibleFrame: 18, // Last 6 frames (18-24) are interruptible
  },
  defensive_getup: {
    type: "defensive_getup",
    staminaCost: 0,
    damageReduction: 0.5, // 50% damage reduction throughout
    vulnerableFrames: 36, // Vulnerable for first 36 frames (86%)
    interruptibleFrame: 36, // Last 6 frames (36-42) are interruptible
  },
};

/**
 * Get recovery configuration
 * 
 * @param recoveryType - Recovery animation type
 * @returns Recovery configuration
 * 
 * @public
 * @korean 기상설정가져오기
 */
export function getRecoveryConfig(
  recoveryType: RecoveryAnimationType
): RecoveryConfig {
  return RECOVERY_CONFIGS[recoveryType];
}
