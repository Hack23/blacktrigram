/**
 * Attack animation definitions for Black Trigram
 * 
 * Defines keyframe animations for realistic martial arts attacks:
 * - Jab: Right arm extension with elbow straightening
 * - Cross: Left arm rotation with torso twist
 * - Front kick: Knee lift with leg extension
 * - Roundhouse kick: Hip rotation with knee bend/extend
 * - Block: Arms raise with shoulder/elbow coordination
 * 
 * All animations target 60fps and use Euler angles in radians.
 * 
 * @module systems/animation/AttackAnimations
 * @category Animation
 * @korean 공격애니메이션
 */

import * as THREE from "three";
import type { AnimationClip, BoneTransform } from "../../types/skeletal";

/**
 * Create bone transform helper
 * 
 * @param boneName - Target bone
 * @param rotation - Rotation in radians [x, y, z]
 * @param position - Optional position offset
 * @returns Bone transform object
 * @korean 뼈변환생성
 */
const transform = (
  boneName: BoneTransform["boneName"],
  rotation: [number, number, number],
  position?: [number, number, number]
): BoneTransform => ({
  boneName,
  rotation: new THREE.Euler(...rotation),
  position: position ? new THREE.Vector3(...position) : undefined,
});

/**
 * Jab animation - Right straight punch
 * 
 * Duration: 0.3s (wind-up → extension → retraction)
 * - Frame 1 (0.0s): Wind-up, elbow bent
 * - Frame 2 (0.1s): Extension begins
 * - Frame 3 (0.15s): Full extension
 * - Frame 4 (0.25s): Retraction begins
 * - Frame 5 (0.3s): Return to guard
 * 
 * @korean 잽애니메이션
 */
export const JAB_ANIMATION: AnimationClip = {
  name: "jab",
  duration: 0.3,
  loop: false,
  keyframes: [
    // Wind-up (0.0s)
    {
      time: 0.0,
      transforms: [
        transform("shoulder_R", [0, 0, -0.2]),
        transform("elbow_R", [0, 0, -1.5]), // Bent elbow
        transform("spine_upper", [0, -0.1, 0]),
      ],
    },
    // Extension begins (0.1s)
    {
      time: 0.1,
      transforms: [
        transform("shoulder_R", [0, 0, 0.3]),
        transform("elbow_R", [0, 0, -0.5]), // Straightening
        transform("spine_upper", [0, 0.1, 0]),
        transform("hand_R", [0, 0, 0], [0.3, 0, 0]), // Moving forward
      ],
    },
    // Full extension (0.15s) - Impact point
    {
      time: 0.15,
      transforms: [
        transform("shoulder_R", [0, 0, 0.5]),
        transform("elbow_R", [0, 0, -0.1]), // Nearly straight
        transform("spine_upper", [0, 0.2, 0]),
        transform("hand_R", [0, 0, 0], [0.5, 0, 0]),
      ],
    },
    // Retraction begins (0.25s)
    {
      time: 0.25,
      transforms: [
        transform("shoulder_R", [0, 0, 0.1]),
        transform("elbow_R", [0, 0, -0.8]),
        transform("spine_upper", [0, 0.05, 0]),
        transform("hand_R", [0, 0, 0], [0.2, 0, 0]),
      ],
    },
    // Return to guard (0.3s)
    {
      time: 0.3,
      transforms: [
        transform("shoulder_R", [0, 0, -0.2]),
        transform("elbow_R", [0, 0, -1.5]),
        transform("spine_upper", [0, 0, 0]),
      ],
    },
  ],
};

/**
 * Cross punch animation - Left power punch
 * 
 * Duration: 0.35s
 * Includes torso rotation and weight shift
 * 
 * @korean 크로스펀치애니메이션
 */
export const CROSS_ANIMATION: AnimationClip = {
  name: "cross",
  duration: 0.35,
  loop: false,
  keyframes: [
    // Wind-up (0.0s)
    {
      time: 0.0,
      transforms: [
        transform("shoulder_L", [0, 0, 0.2]),
        transform("elbow_L", [0, 0, 1.5]),
        transform("spine_upper", [0, 0.1, 0]),
        transform("spine_middle", [0, 0.05, 0]),
      ],
    },
    // Hip rotation begins (0.1s)
    {
      time: 0.1,
      transforms: [
        transform("pelvis", [0, -0.3, 0]),
        transform("spine_lower", [0, -0.2, 0]),
        transform("spine_middle", [0, -0.15, 0]),
        transform("spine_upper", [0, 0, 0]),
      ],
    },
    // Extension (0.18s) - Impact point
    {
      time: 0.18,
      transforms: [
        transform("shoulder_L", [0, 0, -0.5]),
        transform("elbow_L", [0, 0, 0.1]),
        transform("spine_upper", [0, -0.3, 0]),
        transform("spine_middle", [0, -0.2, 0]),
        transform("pelvis", [0, -0.4, 0]),
        transform("hand_L", [0, 0, 0], [-0.5, 0, 0]),
      ],
    },
    // Retraction (0.28s)
    {
      time: 0.28,
      transforms: [
        transform("shoulder_L", [0, 0, 0.1]),
        transform("elbow_L", [0, 0, 1.0]),
        transform("spine_upper", [0, -0.1, 0]),
        transform("pelvis", [0, -0.2, 0]),
      ],
    },
    // Return to guard (0.35s)
    {
      time: 0.35,
      transforms: [
        transform("shoulder_L", [0, 0, 0.2]),
        transform("elbow_L", [0, 0, 1.5]),
        transform("spine_upper", [0, 0, 0]),
        transform("pelvis", [0, 0, 0]),
      ],
    },
  ],
};

/**
 * Front kick animation - Mae Geri
 * 
 * Duration: 0.4s
 * Knee lift → leg extension → retraction
 * 
 * @korean 앞차기애니메이션
 */
export const FRONT_KICK_ANIMATION: AnimationClip = {
  name: "front_kick",
  duration: 0.4,
  loop: false,
  keyframes: [
    // Chambering - knee lift (0.1s)
    {
      time: 0.1,
      transforms: [
        transform("hip_R", [0.8, 0, 0]), // Hip flexion
        transform("knee_R", [0, 0, 1.8]), // Knee bent
        transform("ankle_R", [-0.3, 0, 0]),
      ],
    },
    // Extension - impact (0.2s)
    {
      time: 0.2,
      transforms: [
        transform("hip_R", [0.5, 0, 0]),
        transform("knee_R", [0, 0, 0.2]), // Leg extended
        transform("ankle_R", [-0.1, 0, 0]),
        transform("shin_R", [0, 0, 0], [0, 0, 0.3]), // Forward
      ],
    },
    // Retraction - knee back (0.3s)
    {
      time: 0.3,
      transforms: [
        transform("hip_R", [0.8, 0, 0]),
        transform("knee_R", [0, 0, 1.5]),
        transform("ankle_R", [-0.3, 0, 0]),
      ],
    },
    // Return to stance (0.4s)
    {
      time: 0.4,
      transforms: [
        transform("hip_R", [0, 0, 0]),
        transform("knee_R", [0, 0, 0]),
        transform("ankle_R", [0, 0, 0]),
      ],
    },
  ],
};

/**
 * Roundhouse kick animation - Mawashi Geri
 * 
 * Duration: 0.5s
 * Hip rotation → knee chamber → leg extension → retraction
 * 
 * @korean 돌려차기애니메이션
 */
export const ROUNDHOUSE_KICK_ANIMATION: AnimationClip = {
  name: "roundhouse_kick",
  duration: 0.5,
  loop: false,
  keyframes: [
    // Hip rotation begins (0.1s)
    {
      time: 0.1,
      transforms: [
        transform("pelvis", [0, 0.8, 0]), // Rotate hips
        transform("hip_R", [0.5, 0.3, 0]),
      ],
    },
    // Knee chamber (0.2s)
    {
      time: 0.2,
      transforms: [
        transform("pelvis", [0, 1.2, 0]),
        transform("hip_R", [0.7, 0.5, 0]),
        transform("knee_R", [0, 0, 1.8]), // Knee bent
      ],
    },
    // Extension - impact (0.3s)
    {
      time: 0.3,
      transforms: [
        transform("pelvis", [0, 1.4, 0]),
        transform("hip_R", [0.6, 0.8, 0]),
        transform("knee_R", [0, 0, 0.3]), // Leg extends
        transform("ankle_R", [-0.2, 0, 0]),
      ],
    },
    // Retraction (0.4s)
    {
      time: 0.4,
      transforms: [
        transform("pelvis", [0, 0.6, 0]),
        transform("hip_R", [0.4, 0.3, 0]),
        transform("knee_R", [0, 0, 1.0]),
      ],
    },
    // Return to stance (0.5s)
    {
      time: 0.5,
      transforms: [
        transform("pelvis", [0, 0, 0]),
        transform("hip_R", [0, 0, 0]),
        transform("knee_R", [0, 0, 0]),
        transform("ankle_R", [0, 0, 0]),
      ],
    },
  ],
};

/**
 * Block animation - Defensive guard
 * 
 * Duration: 0.2s
 * Both arms raise with shoulder and elbow coordination
 * 
 * @korean 막기애니메이션
 */
export const BLOCK_ANIMATION: AnimationClip = {
  name: "block",
  duration: 0.2,
  loop: false,
  keyframes: [
    // Guard raised (0.1s)
    {
      time: 0.1,
      transforms: [
        transform("shoulder_L", [-0.3, 0, 0.8]),
        transform("shoulder_R", [-0.3, 0, -0.8]),
        transform("elbow_L", [0, 0, 1.2]),
        transform("elbow_R", [0, 0, -1.2]),
        transform("spine_upper", [0, 0, -0.1]),
      ],
    },
    // Full guard position (0.2s)
    {
      time: 0.2,
      transforms: [
        transform("shoulder_L", [-0.4, 0, 0.9]),
        transform("shoulder_R", [-0.4, 0, -0.9]),
        transform("elbow_L", [0, 0, 1.3]),
        transform("elbow_R", [0, 0, -1.3]),
        transform("forearm_L", [0, 0, -0.2]),
        transform("forearm_R", [0, 0, 0.2]),
      ],
    },
  ],
};

/**
 * Fighting stance animation - Ready position
 * 
 * Duration: 1.0s (looping)
 * Slight knee bend, weight on balls of feet, hands up
 * 
 * @korean 파이팅스탠스애니메이션
 */
export const FIGHTING_STANCE_ANIMATION: AnimationClip = {
  name: "fighting_stance",
  duration: 1.0,
  loop: true,
  keyframes: [
    // Neutral stance (0.0s)
    {
      time: 0.0,
      transforms: [
        transform("knee_L", [0, 0, 0.1]),
        transform("knee_R", [0, 0, 0.1]),
        transform("shoulder_L", [0, 0, 0.3]),
        transform("shoulder_R", [0, 0, -0.3]),
        transform("elbow_L", [0, 0, 1.4]),
        transform("elbow_R", [0, 0, -1.4]),
      ],
    },
    // Breathing cycle (0.5s)
    {
      time: 0.5,
      transforms: [
        transform("spine_upper", [0, 0, 0], [0, 0.02, 0]),
        transform("knee_L", [0, 0, 0.12]),
        transform("knee_R", [0, 0, 0.12]),
      ],
    },
    // Return to neutral (1.0s)
    {
      time: 1.0,
      transforms: [
        transform("knee_L", [0, 0, 0.1]),
        transform("knee_R", [0, 0, 0.1]),
        transform("shoulder_L", [0, 0, 0.3]),
        transform("shoulder_R", [0, 0, -0.3]),
        transform("elbow_L", [0, 0, 1.4]),
        transform("elbow_R", [0, 0, -1.4]),
      ],
    },
  ],
};

/**
 * Idle breathing animation
 * 
 * Duration: 2.0s (looping)
 * Subtle breathing motion in spine
 * 
 * @korean 대기애니메이션
 */
export const IDLE_ANIMATION: AnimationClip = {
  name: "idle",
  duration: 2.0,
  loop: true,
  keyframes: [
    {
      time: 0.0,
      transforms: [
        transform("spine_upper", [0, 0, 0]),
      ],
    },
    {
      time: 1.0,
      transforms: [
        transform("spine_upper", [0, 0, 0], [0, 0.015, 0]),
      ],
    },
    {
      time: 2.0,
      transforms: [
        transform("spine_upper", [0, 0, 0]),
      ],
    },
  ],
};

/**
 * All animation clips indexed by name
 * 
 * @korean 모든애니메이션
 */
export const ANIMATION_CLIPS: Record<string, AnimationClip> = {
  jab: JAB_ANIMATION,
  cross: CROSS_ANIMATION,
  front_kick: FRONT_KICK_ANIMATION,
  roundhouse_kick: ROUNDHOUSE_KICK_ANIMATION,
  block: BLOCK_ANIMATION,
  fighting_stance: FIGHTING_STANCE_ANIMATION,
  idle: IDLE_ANIMATION,
};
