/**
 * Korean martial arts step movement animations with skeletal keyframes
 *
 * Defines realistic tactical step animation sequences for precise footwork
 * with 30cm distance, 300ms duration (18 frames at 60fps), and guard maintenance.
 *
 * @module systems/animation/StepSkeletalAnimations
 * @category Animation System
 * @korean 발걸음애니메이션
 */

import * as THREE from "three";
import type { SkeletalAnimation } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";

/**
 * FORWARD STEP Animation (전진보법)
 *
 * Tactical forward step with weight transfer and guard maintenance.
 *
 * Animation phases:
 * 1. Preparation (0-0.1s): Weight shifts to back foot, crouch slightly
 * 2. Movement (0.1-0.2s): Front foot lifts and extends forward
 * 3. Landing (0.2-0.25s): Front foot plants, weight transfers forward
 * 4. Stabilization (0.25-0.3s): Back foot follows, body straightens
 *
 * Distance: 30cm forward
 * Duration: 300ms (18 frames at 60fps)
 * Guard: Maintained throughout
 *
 * @korean 전진보법애니메이션
 */
export const STEP_FORWARD_ANIMATION: SkeletalAnimation = {
  name: "step_forward",
  koreanName: "전진보법",
  duration: 0.3,
  loop: false,
  type: "movement",
  keyframes: [
    // Frame 1: Preparation - Weight shift (0.0s)
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        // Pelvis lowers slightly (crouch)
        [BoneName.PELVIS, new THREE.Euler(0.05, 0, 0, "XYZ")],
        // Back knee bends slightly more
        [BoneName.KNEE_R, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        // Guard arms maintained
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        // Weight on back foot
        [BoneName.PELVIS, new THREE.Vector3(0, -0.02, 0)],
      ]),
    },

    // Frame 2: Movement - Foot lift (0.1s)
    {
      time: 0.1,
      easing: "ease-out",
      boneRotations: new Map([
        // Front knee lifts
        [BoneName.KNEE_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        // Front hip flexes
        [BoneName.HIP_L, new THREE.Euler(0.2, 0, 0, "XYZ")],
        // Ankle dorsiflexion
        [BoneName.FOOT_L, new THREE.Euler(0.15, 0, 0, "XYZ")],
        // Pelvis tilts forward slightly with subtle hip drive (Y-rotation)
        [BoneName.PELVIS, new THREE.Euler(0.08, 0.03, 0, "XYZ")],
        // Spine counter-rotation for natural walking mechanics
        [BoneName.SPINE_LOWER, new THREE.Euler(0, -0.02, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0.02, -0.03, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.04, 0, "XYZ")],
        // Guard maintained
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        // Front foot lifts 8cm
        [BoneName.FOOT_L, new THREE.Vector3(0, 0.08, 0.1)],
        // Center of gravity shifts forward
        [BoneName.PELVIS, new THREE.Vector3(0, -0.01, 0.05)],
      ]),
    },

    // Frame 3: Landing - Foot placement (0.2s)
    {
      time: 0.2,
      easing: "ease-in",
      boneRotations: new Map([
        // Front leg extends
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.HIP_L, new THREE.Euler(0.05, 0, 0, "XYZ")],
        // Ankle plantar flexion for landing
        [BoneName.FOOT_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        // Back leg begins to extend
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        // Hip and spine transition - reducing counter-rotation
        [BoneName.PELVIS, new THREE.Euler(0.02, 0.02, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, -0.01, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0.01, -0.02, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.02, 0, "XYZ")],
        // Guard maintained
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        // Front foot lands 30cm forward
        [BoneName.FOOT_L, new THREE.Vector3(0, 0, 0.3)],
        // Weight transfers forward
        [BoneName.PELVIS, new THREE.Vector3(0, 0, 0.15)],
      ]),
    },

    // Frame 4: Stabilization - Complete (0.3s)
    {
      time: 0.3,
      easing: "ease-out",
      boneRotations: new Map([
        // Both legs stable
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.HIP_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0, 0, 0, "XYZ")],
        // Pelvis and spine return to neutral
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        // Guard maintained
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        // Back foot has followed forward
        [BoneName.FOOT_R, new THREE.Vector3(0, 0, 0.3)],
        // Full weight transfer complete
        [BoneName.PELVIS, new THREE.Vector3(0, 0, 0.3)],
      ]),
    },
  ],
};

/**
 * BACKWARD STEP Animation (후퇴보법)
 *
 * Tactical retreat step maintaining guard and balance.
 *
 * Duration: 300ms (18 frames at 60fps)
 * Distance: 30cm backward
 * Guard: Maintained throughout
 *
 * @korean 후퇴보법애니메이션
 */
export const STEP_BACK_ANIMATION: SkeletalAnimation = {
  name: "step_back",
  koreanName: "후퇴보법",
  duration: 0.3,
  loop: false,
  type: "movement",
  keyframes: [
    // Preparation
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.02, 0)],
      ]),
    },

    // Back foot lift
    {
      time: 0.1,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.KNEE_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0.2, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(0.15, 0, 0, "XYZ")],
        // Pelvis tilts back with subtle hip drive (Y-rotation opposite to forward step)
        [BoneName.PELVIS, new THREE.Euler(-0.08, -0.03, 0, "XYZ")],
        // Spine counter-rotation for natural retreating mechanics
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0.02, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(-0.02, 0.03, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.04, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.FOOT_R, new THREE.Vector3(0, 0.08, -0.1)],
        [BoneName.PELVIS, new THREE.Vector3(0, -0.01, -0.05)],
      ]),
    },

    // Landing
    {
      time: 0.2,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0.05, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        // Hip and spine transition - reducing counter-rotation
        [BoneName.PELVIS, new THREE.Euler(-0.02, -0.02, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0.01, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(-0.01, 0.02, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.02, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.FOOT_R, new THREE.Vector3(0, 0, -0.3)],
        [BoneName.PELVIS, new THREE.Vector3(0, 0, -0.15)],
      ]),
    },

    // Stabilization
    {
      time: 0.3,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.HIP_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0, 0, 0, "XYZ")],
        // Pelvis and spine return to neutral
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.FOOT_L, new THREE.Vector3(0, 0, -0.3)],
        [BoneName.PELVIS, new THREE.Vector3(0, 0, -0.3)],
      ]),
    },
  ],
};

/**
 * LEFT STEP Animation (좌측면보법)
 *
 * Lateral step to the left maintaining guard.
 *
 * Duration: 300ms
 * Distance: 30cm left
 *
 * @korean 좌측면보법애니메이션
 */
export const STEP_LEFT_ANIMATION: SkeletalAnimation = {
  name: "step_left",
  koreanName: "좌측면보법",
  duration: 0.3,
  loop: false,
  type: "movement",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0.05, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.02, 0)],
      ]),
    },

    {
      time: 0.1,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.KNEE_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.HIP_L, new THREE.Euler(0, 0, 0.15, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(0, 0, 0.1, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0.08, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, -0.05, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.FOOT_L, new THREE.Vector3(-0.1, 0.08, 0)],
        [BoneName.PELVIS, new THREE.Vector3(-0.05, -0.01, 0)],
      ]),
    },

    {
      time: 0.2,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.HIP_L, new THREE.Euler(0, 0, 0.05, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(0, 0, -0.05, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.FOOT_L, new THREE.Vector3(-0.3, 0, 0)],
        [BoneName.PELVIS, new THREE.Vector3(-0.15, 0, 0)],
      ]),
    },

    {
      time: 0.3,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.HIP_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.FOOT_R, new THREE.Vector3(-0.3, 0, 0)],
        [BoneName.PELVIS, new THREE.Vector3(-0.3, 0, 0)],
      ]),
    },
  ],
};

/**
 * RIGHT STEP Animation (우측면보법)
 *
 * Lateral step to the right maintaining guard.
 *
 * Duration: 300ms
 * Distance: 30cm right
 *
 * @korean 우측면보법애니메이션
 */
export const STEP_RIGHT_ANIMATION: SkeletalAnimation = {
  name: "step_right",
  koreanName: "우측면보법",
  duration: 0.3,
  loop: false,
  type: "movement",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, -0.05, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.02, 0)],
      ]),
    },

    {
      time: 0.1,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.KNEE_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0, 0, -0.15, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(0, 0, -0.1, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, -0.08, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0.05, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.FOOT_R, new THREE.Vector3(0.1, 0.08, 0)],
        [BoneName.PELVIS, new THREE.Vector3(0.05, -0.01, 0)],
      ]),
    },

    {
      time: 0.2,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0, 0, -0.05, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(0, 0, 0.05, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.FOOT_R, new THREE.Vector3(0.3, 0, 0)],
        [BoneName.PELVIS, new THREE.Vector3(0.15, 0, 0)],
      ]),
    },

    {
      time: 0.3,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.HIP_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.FOOT_L, new THREE.Vector3(0.3, 0, 0)],
        [BoneName.PELVIS, new THREE.Vector3(0.3, 0, 0)],
      ]),
    },
  ],
};

/**
 * Map of all step animations by direction
 *
 * Diagonal steps use combination of cardinal animations with appropriate
 * angle adjustments in the rendering system.
 *
 * @korean 발걸음애니메이션맵
 */
export const STEP_ANIMATIONS = new Map<string, SkeletalAnimation>([
  ["step_forward", STEP_FORWARD_ANIMATION],
  ["step_back", STEP_BACK_ANIMATION],
  ["step_left", STEP_LEFT_ANIMATION],
  ["step_right", STEP_RIGHT_ANIMATION],
]);

/**
 * Get skeletal animation for step direction
 *
 * For diagonal steps, returns the primary cardinal animation.
 * The rendering system handles diagonal movement by combining animations.
 *
 * @param direction - Step direction
 * @returns Skeletal animation or undefined
 * @korean 발걸음애니메이션가져오기
 */
export function getStepAnimation(
  direction: string
): SkeletalAnimation | undefined {
  // Direct cardinal steps
  if (STEP_ANIMATIONS.has(direction)) {
    return STEP_ANIMATIONS.get(direction);
  }

  // Diagonal steps use forward/back as base
  // The rendering system (SkeletalPlayer3D) handles diagonal movement by
  // applying rotation (45° angles) while playing the cardinal animation
  if (direction.includes("forward")) {
    return STEP_FORWARD_ANIMATION;
  }
  if (direction.includes("back")) {
    return STEP_BACK_ANIMATION;
  }

  return undefined;
}
