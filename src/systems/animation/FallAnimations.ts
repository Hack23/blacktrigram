/**
 * Fall Animation System for Black Trigram
 * 
 * Implements realistic fall down animations for knockdowns, leg sweeps,
 * and loss of consciousness events. Based on Korean martial arts falling
 * techniques (낙법 - Nakbeop).
 * 
 * @module systems/animation/FallAnimations
 * @category Animation
 * @korean 낙법애니메이션
 */

import type { FallType } from "./types";
import { TrigramStance } from "../../types/common";

/**
 * Fall animation impact frame numbers
 * 
 * Defines which frame in each fall animation represents ground impact.
 * Used to trigger camera shake, audio, and particle effects.
 * 
 * @korean 낙법충격프레임
 */
export const FALL_IMPACT_FRAMES: Record<FallType, number> = {
  forward: 18,   // Frame 18 of 24 - hands hit ground
  backward: 22,  // Frame 22 of 30 - back impacts
  side_left: 20, // Frame 20 of 27 - shoulder/side impacts
  side_right: 20, // Frame 20 of 27 - shoulder/side impacts
};

/**
 * Determines fall direction from attack vector and player facing
 * 
 * Calculates which direction the player should fall based on:
 * - Attack vector (direction of incoming force)
 * - Player facing direction (from stance)
 * - Attack impact point (high/low)
 * 
 * Korean terminology:
 * - 전방낙법 (Jeonbang Nakbeop): Forward fall from rear attacks
 * - 후방낙법 (Hubang Nakbeop): Backward fall from frontal attacks
 * - 측방낙법 (Cheukbang Nakbeop): Side fall from lateral attacks
 * 
 * @param attackAngle - Angle of attack in radians (0 = from front)
 * @param playerFacing - Player facing angle in radians
 * @param attackHeight - Attack height: 'high', 'mid', or 'low'
 * @returns Fall type to use for animation
 * 
 * @example
 * ```typescript
 * // Attack from behind while facing forward
 * const fallType = determineFallDirection(Math.PI, 0, 'mid');
 * // Returns: 'forward' (pushed forward)
 * 
 * // Attack from front while facing forward
 * const fallType = determineFallDirection(0, 0, 'mid');
 * // Returns: 'backward' (pushed backward)
 * 
 * // Attack from left side
 * const fallType = determineFallDirection(-Math.PI/2, 0, 'mid');
 * // Returns: 'side_left'
 * ```
 * 
 * @public
 * @korean 낙법방향결정
 */
export function determineFallDirection(
  attackAngle: number,
  playerFacing: number,
  attackHeight: "high" | "mid" | "low" = "mid"
): FallType {
  // Calculate relative attack angle (attack direction relative to player facing)
  let relativeAngle = attackAngle - playerFacing;
  
  // Normalize to -π to π range
  while (relativeAngle > Math.PI) relativeAngle -= 2 * Math.PI;
  while (relativeAngle < -Math.PI) relativeAngle += 2 * Math.PI;
  
  const absAngle = Math.abs(relativeAngle);
  
  // Leg sweeps always cause side falls (more realistic for sweeps)
  if (attackHeight === "low") {
    // Determine which side based on angle
    // Use a small threshold to avoid edge case at exactly 0
    const threshold = 0.01; // ~0.6 degrees
    if (Math.abs(relativeAngle) < threshold) {
      // For perfectly frontal sweeps, default to right side fall
      return "side_right";
    }
    if (relativeAngle < 0) {
      return "side_left";
    } else {
      return "side_right";
    }
  }
  
  // High attacks to head often cause backward falls
  if (attackHeight === "high" && absAngle < Math.PI / 3) {
    return "backward";
  }
  
  // Determine fall direction based on attack angle
  // Front quadrant (±45°): Backward fall
  if (absAngle < Math.PI / 4) {
    return "backward";
  }
  
  // Rear quadrant (±45° from back): Forward fall
  if (absAngle > (3 * Math.PI) / 4) {
    return "forward";
  }
  
  // Side quadrants: Side falls
  if (relativeAngle < 0) {
    return "side_left";
  } else {
    return "side_right";
  }
}

/**
 * Determines fall direction from current trigram stance
 * 
 * Some stances have inherent instability in certain directions.
 * This function returns likely fall directions when balance is lost.
 * 
 * Korean stances and fall tendencies:
 * - 건 (Heaven): Forward bias - aggressive stance
 * - 태 (Lake): Backward bias - fluid retreating
 * - 리 (Fire): Forward bias - aggressive advance
 * - 진 (Thunder): Backward bias - explosive preparation
 * - 손 (Wind): Side bias - lateral movement
 * - 감 (Water): Backward bias - defensive flow
 * - 간 (Mountain): Backward bias - solid defense
 * - 곤 (Earth): Forward bias - grounding takedowns
 * 
 * @param stance - Current trigram stance
 * @param defaultFall - Default fall type if stance doesn't suggest direction
 * @returns Likely fall direction for the stance
 * 
 * @public
 * @korean 자세낙법방향
 */
export function determineFallFromStance(
  stance: TrigramStance,
  defaultFall: FallType = "backward"
): FallType {
  const stanceFallBias: Record<TrigramStance, FallType> = {
    [TrigramStance.GEON]: "forward",   // Heaven - aggressive forward
    [TrigramStance.TAE]: "backward",   // Lake - fluid retreat
    [TrigramStance.LI]: "forward",     // Fire - aggressive strike
    [TrigramStance.JIN]: "backward",   // Thunder - explosive back
    [TrigramStance.SON]: "side_left",  // Wind - lateral pressure
    [TrigramStance.GAM]: "backward",   // Water - flowing back
    [TrigramStance.GAN]: "backward",   // Mountain - defensive back
    [TrigramStance.GON]: "forward",    // Earth - forward throws
  };
  
  return stanceFallBias[stance] ?? defaultFall;
}

/**
 * Fall animation keyframe data structure
 * 
 * Defines key poses during fall animations for skeletal rendering.
 * Each keyframe specifies body positions at critical moments.
 * 
 * @korean 낙법키프레임
 */
export interface FallKeyframe {
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
}

/**
 * Forward fall keyframes (전방낙법)
 * 
 * 24 frames (400ms) sequence:
 * - Frames 0-8: Forward stumble, losing balance
 * - Frames 9-15: Knee collapse, forward momentum
 * - Frames 16-20: Hands extend to brace fall
 * - Frames 21-23: Impact and settle face-down
 * 
 * @korean 전방낙법키프레임
 */
export const FALL_FORWARD_KEYFRAMES: readonly FallKeyframe[] = [
  {
    frame: 0,
    torsoRotation: { x: 0, y: 0, z: 0 },
    centerOfMassHeight: 0.9,
    description: {
      korean: "초기 자세",
      english: "Initial stance",
    },
  },
  {
    frame: 8,
    torsoRotation: { x: 0.3, y: 0, z: 0 }, // Leaning forward
    centerOfMassHeight: 0.75,
    description: {
      korean: "전방으로 비틀거림",
      english: "Forward stumble",
    },
  },
  {
    frame: 15,
    torsoRotation: { x: 0.7, y: 0, z: 0 }, // Falling forward
    centerOfMassHeight: 0.4,
    description: {
      korean: "무릎 붕괴",
      english: "Knee collapse",
    },
  },
  {
    frame: 18,
    torsoRotation: { x: 1.2, y: 0, z: 0 }, // Hands extending
    centerOfMassHeight: 0.15,
    description: {
      korean: "손으로 지면 충격 완화",
      english: "Hands brace impact",
    },
  },
  {
    frame: 23,
    torsoRotation: { x: 1.57, y: 0, z: 0 }, // Face down (90° forward)
    centerOfMassHeight: 0.05,
    description: {
      korean: "엎드려 정지",
      english: "Face-down prone",
    },
  },
] as const;

/**
 * Backward fall keyframes (후방낙법)
 * 
 * 30 frames (500ms) sequence:
 * - Frames 0-10: Backward stumble, balance loss
 * - Frames 11-18: Sitting motion begins
 * - Frames 19-25: Back impact preparation
 * - Frames 26-29: Full supine position
 * 
 * @korean 후방낙법키프레임
 */
export const FALL_BACKWARD_KEYFRAMES: readonly FallKeyframe[] = [
  {
    frame: 0,
    torsoRotation: { x: 0, y: 0, z: 0 },
    centerOfMassHeight: 0.9,
    description: {
      korean: "초기 자세",
      english: "Initial stance",
    },
  },
  {
    frame: 10,
    torsoRotation: { x: -0.2, y: 0, z: 0 }, // Leaning back
    centerOfMassHeight: 0.8,
    description: {
      korean: "후방으로 비틀거림",
      english: "Backward stumble",
    },
  },
  {
    frame: 18,
    torsoRotation: { x: -0.6, y: 0, z: 0 }, // Sitting motion
    centerOfMassHeight: 0.45,
    description: {
      korean: "앉는 동작",
      english: "Sitting motion",
    },
  },
  {
    frame: 22,
    torsoRotation: { x: -1.2, y: 0, z: 0 }, // Back impact
    centerOfMassHeight: 0.2,
    description: {
      korean: "등 충격",
      english: "Back impact",
    },
  },
  {
    frame: 29,
    torsoRotation: { x: -1.57, y: 0, z: 0 }, // Face up (90° back)
    centerOfMassHeight: 0.05,
    description: {
      korean: "누워 정지",
      english: "Supine position",
    },
  },
] as const;

/**
 * Side fall keyframes (측방낙법)
 * 
 * 27 frames (450ms) sequence:
 * - Frames 0-9: Side rotation begins
 * - Frames 10-16: Shoulder roll motion
 * - Frames 17-22: Hip impact
 * - Frames 23-26: Side sprawl position
 * 
 * @korean 측방낙법키프레임
 */
export const FALL_SIDE_KEYFRAMES: readonly FallKeyframe[] = [
  {
    frame: 0,
    torsoRotation: { x: 0, y: 0, z: 0 },
    centerOfMassHeight: 0.9,
    description: {
      korean: "초기 자세",
      english: "Initial stance",
    },
  },
  {
    frame: 9,
    torsoRotation: { x: 0, y: 0.3, z: 0.4 }, // Side rotation
    centerOfMassHeight: 0.7,
    description: {
      korean: "측면 회전 시작",
      english: "Side rotation begins",
    },
  },
  {
    frame: 16,
    torsoRotation: { x: 0.2, y: 0.8, z: 0.9 }, // Shoulder roll
    centerOfMassHeight: 0.4,
    description: {
      korean: "어깨 구르기",
      english: "Shoulder roll",
    },
  },
  {
    frame: 20,
    torsoRotation: { x: 0.3, y: 1.2, z: 1.3 }, // Hip impact
    centerOfMassHeight: 0.2,
    description: {
      korean: "엉덩이 충격",
      english: "Hip impact",
    },
  },
  {
    frame: 26,
    torsoRotation: { x: 0, y: 1.57, z: 1.57 }, // Side position (90° roll)
    centerOfMassHeight: 0.05,
    description: {
      korean: "측면 정지",
      english: "Side sprawl",
    },
  },
] as const;

/**
 * Get keyframes for a specific fall type
 * 
 * @param fallType - Type of fall animation
 * @returns Array of keyframes for that fall type
 * 
 * @public
 * @korean 낙법키프레임가져오기
 */
export function getFallKeyframes(fallType: FallType): readonly FallKeyframe[] {
  switch (fallType) {
    case "forward":
      return FALL_FORWARD_KEYFRAMES;
    case "backward":
      return FALL_BACKWARD_KEYFRAMES;
    case "side_left":
    case "side_right":
      return FALL_SIDE_KEYFRAMES;
  }
}

/**
 * Get impact frame number for fall type
 * 
 * @param fallType - Type of fall animation
 * @returns Frame number when ground impact occurs
 * 
 * @public
 * @korean 충격프레임가져오기
 */
export function getImpactFrame(fallType: FallType): number {
  return FALL_IMPACT_FRAMES[fallType];
}
