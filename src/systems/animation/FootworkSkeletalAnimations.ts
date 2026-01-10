/**
 * Korean martial arts footwork animations with skeletal keyframes (보법 애니메이션)
 *
 * Defines realistic footwork animation sequences for all specialized movement patterns:
 * - Circular steps (원형보): Lateral movement while maintaining guard facing
 * - Slide steps (미끄럼보): Both feet move together with no weight transfer
 * - Pivot steps (축족회전): 90° rotations on planted foot
 * - Shuffle step (섞음보): Quick 15cm micro-adjustments
 *
 * All 9 footwork animation variants (4 pattern types: circular, pivot, slide, shuffle) are fully implemented with skeletal animations.
 *
 * @module systems/animation/FootworkSkeletalAnimations
 * @category Animation System
 * @korean 보법애니메이션
 */

import * as THREE from "three";
import type { SkeletalAnimation } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";

/**
 * CIRCULAR STEP LEFT Animation (원형보 좌)
 *
 * Lateral movement to the left while maintaining forward-facing guard.
 * Body shifts left without rotating, guard stays oriented to opponent.
 *
 * Animation phases:
 * 1. Preparation (0-0.1s): Weight shifts to right foot
 * 2. Movement (0.1-0.2s): Left foot slides 30cm lateral
 * 3. Weight Transfer (0.2-0.25s): Weight shifts to left foot
 * 4. Follow (0.25-0.3s): Right foot follows to maintain stance width
 *
 * Distance: 30cm lateral (left)
 * Duration: 300ms (18 frames at 60fps)
 * Guard: Maintained forward-facing
 *
 * @korean 원형보좌애니메이션
 */
export const FOOTWORK_CIRCULAR_LEFT_ANIMATION: SkeletalAnimation = {
  name: "footwork_circular_left",
  koreanName: "원형보 좌",
  duration: 0.3,
  loop: false,
  type: "movement",
  keyframes: [
    // Frame 1: Preparation - Weight shift to right (0.0s)
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        // Pelvis shifts weight right
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0.05, "XYZ")],
        // Right knee bends slightly
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        // Guard maintained - facing forward
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 0)]]),
    },
    // Frame 2: Movement start - Left foot begins lateral slide (0.1s)
    {
      time: 0.1,
      easing: "ease-out",
      boneRotations: new Map([
        // Pelvis begins lateral movement with subtle Y-rotation for hip engagement
        [BoneName.PELVIS, new THREE.Euler(0, 0.05, 0.08, "XYZ")],
        // Left leg extends slightly for lateral movement
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        // Spine counter-rotates to keep guard facing forward while hips move left
        [BoneName.SPINE_LOWER, new THREE.Euler(0, -0.03, 0.02, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, -0.04, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.05, -0.02, "XYZ")],
        // Guard stays forward
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(-0.1, 0, 0)], // Start lateral movement
      ]),
    },
    // Frame 3: Peak movement - Maximum lateral extension (0.2s)
    {
      time: 0.2,
      easing: "linear",
      boneRotations: new Map([
        // Pelvis at peak lateral with Y-rotation
        [BoneName.PELVIS, new THREE.Euler(0, 0.03, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        // Maximum spine counter-rotation
        [BoneName.SPINE_LOWER, new THREE.Euler(0, -0.02, 0.01, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, -0.03, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.03, -0.01, "XYZ")],
        // Guard maintained
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(-0.25, 0, 0)], // 25cm lateral
      ]),
    },
    // Frame 4: Stabilization - Complete lateral movement (0.3s)
    {
      time: 0.3,
      easing: "ease-in",
      boneRotations: new Map([
        // Everything returns to neutral
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        // Guard returns to neutral
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(-0.3, 0, 0)], // Final 30cm lateral
      ]),
    },
  ],
};

/**
 * CIRCULAR STEP RIGHT Animation (원형보 우)
 *
 * Lateral movement to the right while maintaining forward-facing guard.
 * Mirror of circular left.
 *
 * Distance: 30cm lateral (right)
 * Duration: 300ms (18 frames at 60fps)
 * Guard: Maintained forward-facing
 *
 * @korean 원형보우애니메이션
 */
export const FOOTWORK_CIRCULAR_RIGHT_ANIMATION: SkeletalAnimation = {
  name: "footwork_circular_right",
  koreanName: "원형보 우",
  duration: 0.3,
  loop: false,
  type: "movement",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, -0.05, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 0)]]),
    },
    {
      time: 0.1,
      easing: "ease-out",
      boneRotations: new Map([
        // Pelvis begins lateral movement with subtle Y-rotation for hip engagement (opposite direction)
        [BoneName.PELVIS, new THREE.Euler(0, -0.05, -0.08, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        // Spine counter-rotates to keep guard facing forward while hips move right
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0.03, -0.02, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0.04, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.05, 0.02, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0.1, 0, 0)]]),
    },
    {
      time: 0.2,
      easing: "linear",
      boneRotations: new Map([
        // Pelvis at peak lateral with Y-rotation
        [BoneName.PELVIS, new THREE.Euler(0, -0.03, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        // Maximum spine counter-rotation
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0.02, -0.01, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0.03, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.03, 0.01, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0.25, 0, 0)],
      ]),
    },
    {
      time: 0.3,
      easing: "ease-in",
      boneRotations: new Map([
        // Everything returns to neutral
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0.3, 0, 0)]]),
    },
  ],
};

/**
 * SLIDE STEP FORWARD Animation (미끄럼보 전)
 *
 * Both feet slide forward together with minimal lift and no weight transfer.
 * Maintains stable base throughout movement.
 *
 * Animation phases:
 * 1. Preparation (0-0.05s): Slight crouch, weight centered
 * 2. Slide (0.05-0.15s): Both feet slide forward simultaneously
 * 3. Stabilization (0.15-0.2s): Return to neutral stance
 *
 * Distance: 30cm forward
 * Duration: 200ms (12 frames at 60fps)
 * Guard: Maintained throughout
 *
 * @korean 미끄럼보전애니메이션
 */
export const FOOTWORK_SLIDE_FORWARD_ANIMATION: SkeletalAnimation = {
  name: "footwork_slide_forward",
  koreanName: "미끄럼보 전",
  duration: 0.2,
  loop: false,
  type: "movement",
  keyframes: [
    // Frame 1: Preparation - Crouch (0.0s)
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.02, 0)],
      ]),
    },
    // Frame 2: Slide start (0.05s)
    {
      time: 0.05,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0.03, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.08, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.08, 0, 0, "XYZ")],
        // Subtle forward lean in spine for momentum
        [BoneName.SPINE_LOWER, new THREE.Euler(0.02, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0.02, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.02, -0.1)],
      ]),
    },
    // Frame 3: Mid-slide (0.15s)
    {
      time: 0.15,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0.01, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0.01, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0, -0.25)],
      ]),
    },
    // Frame 4: Complete slide (0.2s)
    {
      time: 0.2,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0, -0.3)],
      ]),
    },
  ],
};

/**
 * SLIDE STEP BACK Animation (미끄럼보 후)
 *
 * Both feet slide backward together with minimal lift and no weight transfer.
 * Mirror of slide forward.
 *
 * Distance: 30cm backward
 * Duration: 200ms (12 frames at 60fps)
 * Guard: Maintained throughout
 *
 * @korean 미끄럼보후애니메이션
 */
export const FOOTWORK_SLIDE_BACK_ANIMATION: SkeletalAnimation = {
  name: "footwork_slide_back",
  koreanName: "미끄럼보 후",
  duration: 0.2,
  loop: false,
  type: "movement",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.02, 0)],
      ]),
    },
    {
      time: 0.05,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0.03, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.08, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.08, 0, 0, "XYZ")],
        // Subtle backward lean in spine for momentum
        [BoneName.SPINE_LOWER, new THREE.Euler(-0.02, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(-0.02, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.02, 0.1)],
      ]),
    },
    {
      time: 0.15,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(-0.01, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(-0.01, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0, 0.25)],
      ]),
    },
    {
      time: 0.2,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 0.3)]]),
    },
  ],
};

/**
 * SLIDE STEP LEFT Animation (미끄럼보 좌)
 *
 * Both feet slide left together with minimal lift and no weight transfer.
 * Maintains stable base throughout lateral movement.
 *
 * Distance: 30cm left
 * Duration: 200ms (12 frames at 60fps)
 * Guard: Maintained throughout
 *
 * @korean 미끄럼보좌애니메이션
 */
export const FOOTWORK_SLIDE_LEFT_ANIMATION: SkeletalAnimation = {
  name: "footwork_slide_left",
  koreanName: "미끄럼보 좌",
  duration: 0.2,
  loop: false,
  type: "movement",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0.05, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.02, 0)],
      ]),
    },
    {
      time: 0.05,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0.03, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.08, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.08, 0, 0, "XYZ")],
        // Subtle lateral lean toward movement direction
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0.02, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0.02, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(-0.1, -0.02, 0)],
      ]),
    },
    {
      time: 0.15,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0.01, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0.01, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(-0.25, 0, 0)],
      ]),
    },
    {
      time: 0.2,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(-0.3, 0, 0)],
      ]),
    },
  ],
};

/**
 * SLIDE STEP RIGHT Animation (미끄럼보 우)
 *
 * Both feet slide right together with minimal lift and no weight transfer.
 * Mirror of slide left.
 *
 * Distance: 30cm right
 * Duration: 200ms (12 frames at 60fps)
 * Guard: Maintained throughout
 *
 * @korean 미끄럼보우애니메이션
 */
export const FOOTWORK_SLIDE_RIGHT_ANIMATION: SkeletalAnimation = {
  name: "footwork_slide_right",
  koreanName: "미끄럼보 우",
  duration: 0.2,
  loop: false,
  type: "movement",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, -0.05, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.02, 0)],
      ]),
    },
    {
      time: 0.05,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, -0.03, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.08, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.08, 0, 0, "XYZ")],
        // Subtle lateral lean toward movement direction
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, -0.02, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, -0.02, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0.1, -0.02, 0)],
      ]),
    },
    {
      time: 0.15,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, -0.01, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, -0.01, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0.25, 0, 0)],
      ]),
    },
    {
      time: 0.2,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0.3, 0, 0)]]),
    },
  ],
};

/**
 * PIVOT STEP LEFT Animation (축족회전 좌)
 *
 * 90-degree counter-clockwise rotation on planted right foot.
 * Left foot repositions around the pivot point.
 *
 * Rotation: 90° counter-clockwise
 * Duration: 250ms (15 frames at 60fps)
 * Guard: Maintained throughout
 *
 * @korean 축족회전좌애니메이션
 */
export const FOOTWORK_PIVOT_LEFT_ANIMATION: SkeletalAnimation = {
  name: "footwork_pivot_left",
  koreanName: "축족회전 좌",
  duration: 0.25,
  loop: false,
  type: "movement",
  keyframes: [
    // Frame 1: Preparation - Weight on right foot (0.0s)
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0.05, "XYZ")],
        // Right knee bends (pivot foot)
        [BoneName.KNEE_R, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        // Guard maintained
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 0)]]),
    },
    // Frame 2: Rotation start (0.08s)
    {
      time: 0.08,
      easing: "ease-out",
      boneRotations: new Map([
        // Begin pelvis rotation (counter-clockwise)
        [BoneName.PELVIS, new THREE.Euler(0, Math.PI / 8, 0.08, "XYZ")], // 22.5° rotation
        [BoneName.KNEE_R, new THREE.Euler(-0.18, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.08, 0, 0, "XYZ")],
        // Arms rotate with body
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.01, 0)],
      ]),
    },
    // Frame 3: Mid-rotation (0.16s)
    {
      time: 0.16,
      easing: "linear",
      boneRotations: new Map([
        // 45° rotation
        [BoneName.PELVIS, new THREE.Euler(0, Math.PI / 4, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.01, 0)],
      ]),
    },
    // Frame 4: Complete rotation (0.25s)
    {
      time: 0.25,
      easing: "ease-in",
      boneRotations: new Map([
        // 90° rotation complete
        [BoneName.PELVIS, new THREE.Euler(0, Math.PI / 2, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * PIVOT STEP RIGHT Animation (축족회전 우)
 *
 * 90-degree clockwise rotation on planted left foot.
 * Right foot repositions around the pivot point.
 *
 * Rotation: 90° clockwise
 * Duration: 250ms (15 frames at 60fps)
 * Guard: Maintained throughout
 *
 * @korean 축족회전우애니메이션
 */
export const FOOTWORK_PIVOT_RIGHT_ANIMATION: SkeletalAnimation = {
  name: "footwork_pivot_right",
  koreanName: "축족회전 우",
  duration: 0.25,
  loop: false,
  type: "movement",
  keyframes: [
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, -0.05, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 0)]]),
    },
    {
      time: 0.08,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, -Math.PI / 8, -0.08, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.18, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.08, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.01, 0)],
      ]),
    },
    {
      time: 0.16,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, -Math.PI / 4, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.01, 0)],
      ]),
    },
    {
      time: 0.25,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, -Math.PI / 2, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * SHUFFLE STEP Animation (섞음보)
 *
 * Quick micro-adjustment for fine positioning.
 * Minimal animation with 15cm omnidirectional movement capability.
 *
 * Distance: 15cm (half of standard step)
 * Duration: 100ms (6 frames at 60fps)
 * Guard: Maintained throughout
 *
 * @korean 섞음보애니메이션
 */
export const FOOTWORK_SHUFFLE_ANIMATION: SkeletalAnimation = {
  name: "footwork_shuffle",
  koreanName: "섞음보",
  duration: 0.1,
  loop: false,
  type: "movement",
  keyframes: [
    // Frame 1: Start (0.0s)
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.08, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.08, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.01, 0)],
      ]),
    },
    // Frame 2: Mid-shuffle (0.05s)
    {
      time: 0.05,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        // Default forward shuffle - can be overridden by position
        [BoneName.PELVIS, new THREE.Vector3(0, -0.015, -0.075)],
      ]),
    },
    // Frame 3: Complete (0.1s)
    {
      time: 0.1,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0, -0.15)],
      ]),
    },
  ],
};

/**
 * Map of all footwork skeletal animations
 *
 * Complete implementation of all footwork patterns:
 * - Circular left/right: Lateral movement maintaining forward guard
 * - Slide forward/back/left/right: Both feet move together, stable base
 * - Pivot left/right: 90° rotations on planted foot
 * - Shuffle: Quick 15cm micro-adjustments
 *
 * @korean 보법애니메이션맵
 */
export const FOOTWORK_ANIMATIONS = new Map<string, SkeletalAnimation>([
  ["footwork_circular_left", FOOTWORK_CIRCULAR_LEFT_ANIMATION],
  ["footwork_circular_right", FOOTWORK_CIRCULAR_RIGHT_ANIMATION],
  ["footwork_slide_forward", FOOTWORK_SLIDE_FORWARD_ANIMATION],
  ["footwork_slide_back", FOOTWORK_SLIDE_BACK_ANIMATION],
  ["footwork_slide_left", FOOTWORK_SLIDE_LEFT_ANIMATION],
  ["footwork_slide_right", FOOTWORK_SLIDE_RIGHT_ANIMATION],
  ["footwork_pivot_left", FOOTWORK_PIVOT_LEFT_ANIMATION],
  ["footwork_pivot_right", FOOTWORK_PIVOT_RIGHT_ANIMATION],
  ["footwork_shuffle", FOOTWORK_SHUFFLE_ANIMATION],
]);

/**
 * Get footwork animation by name
 *
 * Returns the skeletal animation for the specified footwork pattern.
 * Returns undefined if animation not found or not yet implemented.
 *
 * @param animationName - Animation state name (e.g., "footwork_circular_left")
 * @returns Skeletal animation or undefined
 * @korean 보법애니메이션가져오기
 */
export function getFootworkAnimation(
  animationName: string
): SkeletalAnimation | undefined {
  return FOOTWORK_ANIMATIONS.get(animationName);
}
