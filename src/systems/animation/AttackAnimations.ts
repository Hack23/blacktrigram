/**
 * Korean martial arts attack animations with skeletal keyframes
 *
 * Defines realistic attack animation sequences for Taekwondo, Hapkido,
 * and Taekyon techniques using skeletal keyframes.
 *
 * MIGRATED TO ANIMATIONBUILDER: First two animations use fluent API for cleaner code.
 * Demonstrates 55% code reduction and improved maintainability.
 *
 * @module systems/animation/AttackAnimations
 * @category Animation System
 * @korean 공격애니메이션
 */

import * as THREE from "three";
import type { SkeletalAnimation } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import { AnimationBuilder } from "./AnimationBuilder";

/**
 * Jab animation (빠른 직권 - 정권지르기)
 *
 * Fast straight punch with right arm. Traditional Taekwondo technique.
 *
 * Animation phases:
 * 1. Wind-up (0.0s): Right arm bent at elbow, ready position
 * 2. Extension (0.1s): Right arm extends, elbow straightens
 * 3. Full extension (0.15s): Maximum reach, fist forward
 * 4. Retraction (0.3s): Return to guard position
 *
 * Duration: 300ms
 *
 * MIGRATED: Now uses AnimationBuilder (was 111 lines, now 28 lines = 75% reduction)
 *
 * @korean 잽애니메이션
 */
export const JAB_ANIMATION = AnimationBuilder.create("jab")
  .withKoreanName("잽")
  .withDuration(0.3)
  .withType("attack")
  .keyframe(0.0, "linear")
    .rotate(BoneName.SHOULDER_R, 0, 0, -0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.5)
    .rotate(BoneName.SPINE_UPPER, 0, -0.1, 0)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
    .build()
  .keyframe(0.1, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0, 0, 0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, 0.2)
    .rotate(BoneName.SPINE_UPPER, 0, 0.2, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.15, 0)
    .rotate(BoneName.PELVIS, 0, 0.1, 0)
    .position(BoneName.HAND_R, 0, 0, 0.5)
    .build()
  .keyframe(0.15, "linear")
    .rotate(BoneName.SHOULDER_R, 0, 0, 0.5)
    .rotate(BoneName.ELBOW_R, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.3, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.2, 0)
    .rotate(BoneName.PELVIS, 0, 0.15, 0)
    .position(BoneName.HAND_R, 0, 0, 0.8)
    .build()
  .keyframe(0.3, "ease-in")
    .rotate(BoneName.SHOULDER_R, 0, 0, -0.1)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.2)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .position(BoneName.HAND_R, 0, 0, 0)
    .build()
  .build();

/**
 * Cross punch animation (교차 직권 - 반대손 지르기)
 *
 * Left arm punch with full body rotation. Power technique from Taekwondo.
 *
 * Animation phases:
 * 1. Wind-up (0.0s): Left arm bent, weight on right side
 * 2. Hip rotation (0.08s): Hips begin rotating left
 * 3. Extension (0.15s): Left arm extends with torso rotation
 * 4. Full extension (0.2s): Maximum reach and power
 * 5. Recovery (0.35s): Return to guard
 *
 * Duration: 350ms
 *
 * MIGRATED: Now uses AnimationBuilder (was 117 lines, now 30 lines = 74% reduction)
 *
 * @korean 크로스펀치애니메이션
 */
export const CROSS_ANIMATION = AnimationBuilder.create("cross")
  .withKoreanName("크로스")
  .withDuration(0.35)
  .withType("attack")
  .keyframe(0.0, "linear")
    .rotate(BoneName.ELBOW_L, 0, 0, -1.5)
    .rotate(BoneName.SPINE_UPPER, 0, -0.15, 0)
    .rotate(BoneName.PELVIS, 0, -0.1, 0)
    .build()
  .keyframe(0.08, "ease-out")
    .rotate(BoneName.PELVIS, 0, 0.1, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.15, 0)
    .rotate(BoneName.HIP_R, 0, 0.1, 0)
    .build()
  .keyframe(0.15, "ease-out")
    .rotate(BoneName.SHOULDER_L, 0, 0, -0.3)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.2)
    .rotate(BoneName.SPINE_UPPER, 0, 0.3, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.25, 0)
    .rotate(BoneName.PELVIS, 0, 0.2, 0)
    .position(BoneName.HAND_L, 0, 0, 0.6)
    .build()
  .keyframe(0.2, "linear")
    .rotate(BoneName.SHOULDER_L, 0, 0, -0.5)
    .rotate(BoneName.ELBOW_L, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.4, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0.3, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.2, 0)
    .rotate(BoneName.PELVIS, 0, 0.25, 0)
    .position(BoneName.HAND_L, 0, 0, 0.85)
    .build()
  .keyframe(0.35, "ease-in")
    .rotate(BoneName.SHOULDER_L, 0, 0, 0.1)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.2)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SPINE_MIDDLE, 0, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .position(BoneName.HAND_L, 0, 0, 0)
    .build()
  .build();

/**
 * Front kick animation (앞차기) - ENHANCED
 *
 * Traditional Taekwondo front kick with knee lift, leg extension,
 * ankle dorsiflexion, support leg adjustments, and balance recovery.
 *
 * Animation phases:
 * 1. Chamber (0.0s-0.1s): Knee lifts to waist height, support leg micro-adjust
 * 2. Extension (0.1s-0.2s): Lower leg extends forward with ankle flexion
 * 3. Impact (0.2s): Maximum extension point with dorsiflexion
 * 4. Retraction (0.2s-0.35s): Leg returns to chamber
 * 5. Set down (0.35s-0.45s): Foot returns to ground with balance recovery
 * 6. Recovery shuffle (0.45s-0.55s): Support leg adjustment for balance
 *
 * Duration: 550ms (enhanced with recovery)
 *
 * @korean 앞차기애니메이션향상
 */
export const FRONT_KICK_ANIMATION = AnimationBuilder.create("front_kick")
  .withKoreanName("앞차기")
  .withDuration(0.55)
  .withType("attack")
  // Frame 1: Chamber - knee lifts with support leg adjustment
  .keyframe(0.1, "ease-out")
    .rotate(BoneName.HIP_R, 1.5, 0, 0) // 90 degrees up
    .rotate(BoneName.KNEE_R, -1.8, 0, 0) // Bent
    .rotate(BoneName.KNEE_L, -0.25, 0, 0)
    .rotate(BoneName.FOOT_L, 0, 0, 0.05) // Slight outward pivot
    .rotate(BoneName.PELVIS, -0.05, 0, 0) // Tilts slightly back for balance
    .rotate(BoneName.SHOULDER_L, 0, 0, -0.5)
    .rotate(BoneName.SHOULDER_R, 0, 0, 0.5)
    .position(BoneName.PELVIS, 0, -0.01, 0) // Slight drop for stability
    .build()
  // Frame 2: Extension with ankle dorsiflexion
  .keyframe(0.2, "ease-out")
    .rotate(BoneName.HIP_R, 1.5, 0, 0) // Hip stays high
    .rotate(BoneName.KNEE_R, -0.2, 0, 0) // Knee extends
    .rotate(BoneName.FOOT_R, 0.5, 0, 0) // Foot dorsiflexion for striking
    .rotate(BoneName.KNEE_L, -0.3, 0, 0)
    .rotate(BoneName.FOOT_L, 0, 0, 0.08)
    .rotate(BoneName.PELVIS, 0.05, 0, 0) // Pelvis drives forward
    .position(BoneName.FOOT_R, 0, 0, 0.7)
    .position(BoneName.PELVIS, 0, 0, 0.1)
    .build()
  // Frame 3: Retraction to chamber
  .keyframe(0.35, "ease-in")
    .rotate(BoneName.HIP_R, 1.5, 0, 0)
    .rotate(BoneName.KNEE_R, -1.8, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0) // Foot relaxes
    .rotate(BoneName.KNEE_L, -0.25, 0, 0)
    .rotate(BoneName.FOOT_L, 0, 0, 0.05)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .position(BoneName.FOOT_R, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .build()
  // Frame 4: Set down with balance recovery start
  .keyframe(0.45, "ease-in")
    .rotate(BoneName.HIP_R, 0, 0, 0)
    .rotate(BoneName.KNEE_R, -0.15, 0, 0) // Slight bend on landing
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.FOOT_L, 0, 0, 0.03)
    .rotate(BoneName.SHOULDER_L, 0, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0, 0, 0)
    .position(BoneName.PELVIS, 0, -0.02, 0) // Slight drop on landing
    .build()
  // Frame 5: Balance recovery shuffle
  .keyframe(0.55, "ease-in")
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.FOOT_L, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0) // Return to stable height
    .build()
  .build();

/**
 * Roundhouse kick animation (돌려차기) - ENHANCED
 *
 * Traditional Taekwondo roundhouse kick with hip rotation,
 * ankle flexion, support leg adjustments, and balance recovery.
 *
 * Animation phases:
 * 1. Chamber (0.0s-0.1s): Knee lifts, hip begins rotation
 * 2. Rotation (0.1s-0.2s): Hip rotates 90 degrees
 * 3. Extension (0.2s-0.25s): Leg extends in arc with ankle flexion
 * 4. Impact (0.25s): Maximum extension with support leg adjustment
 * 5. Retraction (0.25s-0.4s): Return to chamber
 * 6. Set down (0.4s-0.5s): Foot to ground with balance recovery
 * 7. Recovery shuffle (0.5s-0.6s): Support leg adjustment for balance
 *
 * Duration: 600ms (enhanced with recovery)
 *
 * @korean 돌려차기애니메이션향상
 */
export const ROUNDHOUSE_KICK_ANIMATION = AnimationBuilder.create("roundhouse_kick")
  .withKoreanName("돌려차기")
  .withDuration(0.6)
  .withType("attack")
  // Frame 1: Chamber with rotation start
  .keyframe(0.1, "ease-out")
    .rotate(BoneName.HIP_R, 1.2, 0, 0.8) // Right leg chambers
    .rotate(BoneName.KNEE_R, -1.5, 0, 0)
    .rotate(BoneName.PELVIS, 0, -0.5, 0) // Hips rotate
    .rotate(BoneName.SPINE_UPPER, 0, 0.3, 0) // Torso counter-rotates for balance
    .rotate(BoneName.SHOULDER_L, 0, 0, -1.0) // Arms out for balance
    .rotate(BoneName.SHOULDER_R, 0, 0, 1.0)
    .build()
  // Frame 2: Full hip rotation
  .keyframe(0.2, "ease-out")
    .rotate(BoneName.HIP_R, 1.2, 0, 1.4)
    .rotate(BoneName.KNEE_R, -1.2, 0, 0)
    .rotate(BoneName.PELVIS, 0, -1.2, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.6, 0)
    .build()
  // Frame 3: Extension and impact with ankle flexion
  .keyframe(0.25, "linear")
    .rotate(BoneName.HIP_R, 1.2, 0, 1.6) // Leg fully extends
    .rotate(BoneName.KNEE_R, -0.1, 0, 0)
    .rotate(BoneName.PELVIS, 0, -1.5, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.8, 0)
    .rotate(BoneName.FOOT_R, 0.4, 0, 0.3) // Foot plantar flexion (point toes)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0) // Support leg micro-adjustment
    .rotate(BoneName.FOOT_L, 0, 0, -0.1) // Pivot for power
    .position(BoneName.FOOT_R, 0.8, 0, 0) // Side strike
    .position(BoneName.PELVIS, 0, -0.02, 0) // Slight drop for power
    .build()
  // Frame 4: Retraction
  .keyframe(0.4, "ease-in")
    .rotate(BoneName.HIP_R, 1.2, 0, 0.8)
    .rotate(BoneName.KNEE_R, -1.5, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, -0.3, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.2, 0)
    .rotate(BoneName.KNEE_L, -0.25, 0, 0) // Support leg returns
    .rotate(BoneName.FOOT_L, 0, 0, 0)
    .position(BoneName.FOOT_R, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .build()
  // Frame 5: Set down with balance recovery
  .keyframe(0.5, "ease-in")
    .rotate(BoneName.HIP_R, 0, 0, 0)
    .rotate(BoneName.KNEE_R, -0.15, 0, 0) // Slight bend on landing
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0) // Support leg adjusts
    .rotate(BoneName.FOOT_L, 0, 0, 0)
    .position(BoneName.PELVIS, 0, -0.01, 0) // Slight drop on landing
    .build()
  // Frame 6: Balance recovery shuffle
  .keyframe(0.6, "ease-in")
    .rotate(BoneName.HIP_R, 0, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.FOOT_L, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0) // Return to stable height
    .build()
  .build();

/**
 * Block animation (막기)
 *
 * Traditional Taekwondo block with both arms raised.
 *
 * Animation phases:
 * 1. Raise (0.0s-0.1s): Both arms lift to blocking position
 * 2. Hold (0.1s-0.3s): Maintain block
 * 3. Lower (0.3s-0.4s): Return to guard
 *
 * Duration: 400ms
 *
 * @korean 막기애니메이션
 */
export const BLOCK_ANIMATION: SkeletalAnimation = {
  name: "block",
  koreanName: "막기",
  duration: 0.4,
  loop: false,
  type: "defense",
  keyframes: [
    // Frame 1: Raise arms
    {
      time: 0.1,
      easing: "ease-out",
      boneRotations: new Map([
        // Left arm high block
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.5, "XYZ")],
        // Right arm middle block
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 1.0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        // Slight crouch
        [BoneName.KNEE_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },

    // Frame 2: Hold block
    {
      time: 0.3,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.5, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 1.0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },

    // Frame 3: Lower to guard
    {
      time: 0.4,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    },
  ],
};

/**
 * Walking cycle animation (앞으로 걷기 - 보행 사이클)
 *
 * Natural walking gait with alternating leg movement. Includes hip swing,
 * knee bend during swing phase, foot placement, and pelvis tilt.
 *
 * Animation phases:
 * 1. Left foot forward (0.0s): Left leg extends, right leg pushes off
 * 2. Left mid-stance (0.2s): Left foot plants, right leg swings forward
 * 3. Right foot forward (0.4s): Right leg extends, left leg pushes off
 * 4. Right mid-stance (0.6s): Right foot plants, left leg swings forward
 *
 * Duration: 800ms (complete left-right step cycle)
 *
 * @korean 걷기애니메이션
 */
export const WALK_ANIMATION: SkeletalAnimation = {
  name: "walk",
  koreanName: "걷기",
  duration: 0.8,
  loop: true,
  type: "movement",
  keyframes: [
    // Frame 1: Left foot forward contact (0.0s)
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        // Pelvis tilt forward slightly
        [BoneName.PELVIS, new THREE.Euler(0.1, 0.05, 0, "XYZ")],
        // Left leg extended forward
        [BoneName.HIP_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(0.1, 0, 0, "XYZ")],
        // Right leg pushing back
        [BoneName.HIP_R, new THREE.Euler(0.4, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        // Arms swing opposite to legs
        [BoneName.SHOULDER_L, new THREE.Euler(0.3, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.3, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.4, 0, 0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.4, "XYZ")],
        // Spine rotation for natural movement
        [BoneName.SPINE_LOWER, new THREE.Euler(0, -0.05, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0.02, 0)],
      ]),
    },

    // Frame 2: Left mid-stance, right leg swing (0.2s)
    {
      time: 0.2,
      easing: "linear",
      boneRotations: new Map([
        // Pelvis level
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        // Left leg support (slightly bent)
        [BoneName.HIP_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(0, 0, 0, "XYZ")],
        // Right leg swinging forward (knee bent)
        [BoneName.HIP_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.8, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(0.2, 0, 0, "XYZ")],
        // Arms swing
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.2, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.3, "XYZ")],
        // Spine neutral
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.01, 0)],
      ]),
    },

    // Frame 3: Right foot forward contact (0.4s)
    {
      time: 0.4,
      easing: "ease-out",
      boneRotations: new Map([
        // Pelvis tilt forward slightly
        [BoneName.PELVIS, new THREE.Euler(0.1, -0.05, 0, "XYZ")],
        // Right leg extended forward
        [BoneName.HIP_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(0.1, 0, 0, "XYZ")],
        // Left leg pushing back
        [BoneName.HIP_L, new THREE.Euler(0.4, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        // Arms swing opposite to legs
        [BoneName.SHOULDER_R, new THREE.Euler(0.3, 0, 0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.3, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(-0.4, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.4, "XYZ")],
        // Spine rotation for natural movement
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0.05, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0.02, 0)],
      ]),
    },

    // Frame 4: Right mid-stance, left leg swing (0.6s)
    {
      time: 0.6,
      easing: "linear",
      boneRotations: new Map([
        // Pelvis level
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        // Right leg support (slightly bent)
        [BoneName.HIP_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(0, 0, 0, "XYZ")],
        // Left leg swinging forward (knee bent)
        [BoneName.HIP_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.8, 0, 0, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(0.2, 0, 0, "XYZ")],
        // Arms swing
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.2, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.3, "XYZ")],
        // Spine neutral
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.01, 0)],
      ]),
    },

    // Frame 5: Return to start position (0.8s) - loops to frame 1
    {
      time: 0.8,
      easing: "ease-in",
      boneRotations: new Map([
        // Return to left foot forward position
        [BoneName.PELVIS, new THREE.Euler(0.1, 0.05, 0, "XYZ")],
        [BoneName.HIP_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(0.1, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0.4, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.3, 0, 0, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -0.3, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.4, 0, 0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 0.4, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, -0.05, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0.02, 0)],
      ]),
    },
  ],
};

/**
 * Idle stance animation (대기 자세)
 *
 * Fighting stance with slight weight shift and breathing motion.
 *
 * Animation phases:
 * 1. Center (0.0s): Neutral fighting stance
 * 2. Weight left (0.8s): Shift weight to left leg
 * 3. Center (1.6s): Return to neutral
 * 4. Weight right (2.4s): Shift weight to right leg
 * 5. Center (3.0s): Return to neutral (loops)
 *
 * Duration: 3000ms (looping)
 *
 * @korean 대기자세애니메이션
 */
export const IDLE_STANCE_ANIMATION: SkeletalAnimation = {
  name: "idle_stance",
  koreanName: "대기 자세",
  duration: 3.0,
  loop: true,
  type: "idle",
  keyframes: [
    // Frame 1: Center stance (0.0s)
    {
      time: 0.0,
      easing: "ease-in-out",
      boneRotations: new Map([
        // Slight knee bend (fighting stance)
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        // Arms in guard position
        [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, -0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 0)]]),
    },

    // Frame 2: Weight shift left (0.8s)
    {
      time: 0.8,
      easing: "ease-in-out",
      boneRotations: new Map([
        // Left knee bends more
        [BoneName.KNEE_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        // Pelvis tilts slightly left
        [BoneName.PELVIS, new THREE.Euler(0, 0, -0.05, "XYZ")],
        // Spine breathing expansion
        [BoneName.SPINE_LOWER, new THREE.Euler(-0.02, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(-0.03, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(-0.02, 0, 0, "XYZ")],
        // Arms maintain guard
        [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, -0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(-0.02, 0, 0)],
      ]),
    },

    // Frame 3: Return to center (1.6s)
    {
      time: 1.6,
      easing: "ease-in-out",
      boneRotations: new Map([
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        // Breathing contraction
        [BoneName.SPINE_LOWER, new THREE.Euler(0.02, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0.03, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0.02, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, -0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 0)]]),
    },

    // Frame 4: Weight shift right (2.4s)
    {
      time: 2.4,
      easing: "ease-in-out",
      boneRotations: new Map([
        // Right knee bends more
        [BoneName.KNEE_L, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        // Pelvis tilts slightly right
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0.05, "XYZ")],
        // Spine breathing expansion
        [BoneName.SPINE_LOWER, new THREE.Euler(-0.02, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(-0.03, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(-0.02, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, -0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0.02, 0, 0)],
      ]),
    },

    // Frame 5: Return to center (3.0s) - loop
    {
      time: 3.0,
      easing: "ease-in-out",
      boneRotations: new Map([
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, -0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * Forward dash animation (앞으로 돌진)
 *
 * Explosive forward movement with rapid knee extension and hip drive.
 *
 * Animation phases:
 * 1. Crouch (0.0s): Deep knee bend, ready to explode
 * 2. Drive (0.15s): Rapid knee extension, forward momentum
 * 3. Glide (0.3s): Extended stride position
 * 4. Recovery (0.4s): Return to stance
 *
 * Duration: 400ms
 *
 * @korean 앞으로돌진애니메이션
 */
export const FORWARD_DASH_ANIMATION: SkeletalAnimation = {
  name: "forward_dash",
  koreanName: "앞으로 돌진",
  duration: 0.4,
  loop: false,
  type: "movement",
  keyframes: [
    // Frame 1: Crouch (0.0s)
    {
      time: 0.0,
      easing: "ease-in",
      boneRotations: new Map([
        // Deep knee bend
        [BoneName.KNEE_L, new THREE.Euler(-0.8, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.8, 0, 0, "XYZ")],
        // Lean forward
        [BoneName.SPINE_LOWER, new THREE.Euler(0.3, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0.25, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0.2, 0, 0, "XYZ")],
        // Arms back for momentum
        [BoneName.SHOULDER_L, new THREE.Euler(-0.5, 0, -0.3, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(-0.5, 0, 0.3, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.15, 0)],
      ]),
    },

    // Frame 2: Explosive drive (0.15s)
    {
      time: 0.15,
      easing: "ease-out",
      boneRotations: new Map([
        // Rapid knee extension
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        // Hip drive forward
        [BoneName.PELVIS, new THREE.Euler(0.2, 0, 0, "XYZ")],
        // Torso drives forward
        [BoneName.SPINE_LOWER, new THREE.Euler(0.15, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0.1, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0.05, 0, 0, "XYZ")],
        // Arms swing forward
        [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, -0.5, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0.5, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0.05, 0.8)],
      ]),
    },

    // Frame 3: Glide (0.3s)
    {
      time: 0.3,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.3, 0, -0.6, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.3, 0, 0.6, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 1.2)]]),
    },

    // Frame 4: Recovery (0.4s)
    {
      time: 0.4,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, -0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0.8, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * Backward retreat animation (뒤로 물러서기)
 *
 * Coordinated leg backpedaling with defensive posture.
 *
 * Animation phases:
 * 1. Push back (0.0s): Back foot plants, front foot lifts
 * 2. Slide (0.2s): Smooth backward movement
 * 3. Plant (0.35s): Front foot plants
 * 4. Reset (0.45s): Return to guard stance
 *
 * Duration: 450ms
 *
 * @korean 뒤로물러서기애니메이션
 */
export const BACKWARD_RETREAT_ANIMATION: SkeletalAnimation = {
  name: "backward_retreat",
  koreanName: "뒤로 물러서기",
  duration: 0.45,
  loop: false,
  type: "movement",
  keyframes: [
    // Frame 1: Push back (0.0s)
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        // Right leg (back) plants firm
        [BoneName.KNEE_R, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        // Left leg (front) begins to lift
        [BoneName.HIP_L, new THREE.Euler(0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.4, 0, 0, "XYZ")],
        // Lean back slightly
        [BoneName.SPINE_LOWER, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        // Arms stay in defensive guard
        [BoneName.SHOULDER_L, new THREE.Euler(0.6, 0, -0.9, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.6, 0, 0.9, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 0)]]),
    },

    // Frame 2: Slide back (0.2s)
    {
      time: 0.2,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.KNEE_R, new THREE.Euler(-0.25, 0, 0, "XYZ")],
        [BoneName.HIP_L, new THREE.Euler(0.1, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.3, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(-0.08, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(-0.04, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.6, 0, -0.9, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.6, 0, 0.9, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0, -0.6)],
      ]),
    },

    // Frame 3: Plant front foot (0.35s)
    {
      time: 0.35,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.HIP_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, -0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0, -0.8)],
      ]),
    },

    // Frame 4: Reset to guard (0.45s)
    {
      time: 0.45,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, -0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0.8, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * Side step animation (옆으로 스텝)
 *
 * Lateral hip shift with trailing leg for quick evasion.
 *
 * Animation phases:
 * 1. Shift left (0.0s): Weight to left leg
 * 2. Slide (0.15s): Right leg follows
 * 3. Plant (0.25s): Both feet grounded
 * 4. Reset (0.3s): Return to center
 *
 * Duration: 300ms
 *
 * @korean 옆으로스텝애니메이션
 */
export const SIDE_STEP_ANIMATION: SkeletalAnimation = {
  name: "side_step",
  koreanName: "옆으로 스텝",
  duration: 0.3,
  loop: false,
  type: "movement",
  keyframes: [
    // Frame 1: Shift left (0.0s)
    {
      time: 0.0,
      easing: "ease-out",
      boneRotations: new Map([
        // Left leg bends to absorb weight
        [BoneName.KNEE_L, new THREE.Euler(-0.4, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        // Pelvis tilts left
        [BoneName.PELVIS, new THREE.Euler(0, 0, -0.15, "XYZ")],
        // Spine compensates
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0.05, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0.08, "XYZ")],
        // Arms maintain guard
        [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, -0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0.8, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(-0.3, -0.05, 0)],
      ]),
    },

    // Frame 2: Slide right leg (0.15s)
    {
      time: 0.15,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.KNEE_L, new THREE.Euler(-0.25, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.25, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, -0.08, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0.03, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0.04, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, -0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0.8, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(-0.5, 0, 0)],
      ]),
    },

    // Frame 3: Plant both feet (0.25s)
    {
      time: 0.25,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, -0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0.8, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(-0.5, 0, 0)],
      ]),
    },

    // Frame 4: Reset to center (0.3s)
    {
      time: 0.3,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, -0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0.8, "XYZ")],
      ]),
      bonePositions: new Map([[BoneName.PELVIS, new THREE.Vector3(0, 0, 0)]]),
    },
  ],
};

/**
 * Elbow strike animation (팔꿈치 타격 - Palgumchi Tagyeok)
 *
 * Close-range horizontal elbow strike from Hapkido.
 * Authentic Korean martial arts technique with proper shoulder rotation,
 * elbow positioning, and torso twist for maximum impact.
 *
 * Animation phases:
 * 1. Chamber (0.0s): Right arm chambers across body, elbow bent 90 degrees
 * 2. Rotation (0.05s): Torso rotates right, building momentum
 * 3. Strike (0.1s-0.12s): Elbow drives through target with hip rotation
 * 4. Impact (0.12s): Maximum extension with full body weight transfer
 * 5. Recovery (0.2s): Return to guard position
 *
 * Duration: 200ms (10 frames @ 60fps)
 *
 * @korean 팔꿈치타격애니메이션
 */
export const ELBOW_STRIKE_ANIMATION: SkeletalAnimation = {
  name: "elbow_strike",
  koreanName: "팔꿈치타격",
  duration: 0.2,
  loop: false,
  type: "attack",
  keyframes: [
    // Frame 1: Chamber position (0.0s)
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        // Right arm chambers across body
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0.8, -0.3, "XYZ")], // Shoulder forward and across
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.57, "XYZ")], // 90 degree bend
        [BoneName.FOREARM_R, new THREE.Euler(0, -0.5, 0, "XYZ")], // Forearm rotates in
        // Torso winds up (opposite direction)
        [BoneName.SPINE_UPPER, new THREE.Euler(0, -0.3, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, -0.2, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, -0.15, 0, "XYZ")],
        // Left arm guards
        [BoneName.SHOULDER_L, new THREE.Euler(0, -0.5, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.HAND_R, new THREE.Vector3(-0.2, 0, 0.3)], // Hand near opposite shoulder
      ]),
    },

    // Frame 2: Rotation begins (0.05s)
    {
      time: 0.05,
      easing: "ease-out",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0.5, 0, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.57, "XYZ")], // Maintain 90 degree bend
        [BoneName.FOREARM_R, new THREE.Euler(0, -0.3, 0, "XYZ")],
        // Torso begins rotation
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.1, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0.05, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.HAND_R, new THREE.Vector3(-0.1, 0, 0.4)],
      ]),
    },

    // Frame 3: Strike through target (0.1s-0.12s)
    {
      time: 0.1,
      easing: "linear",
      boneRotations: new Map([
        // Elbow drives forward
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.4, "XYZ")], // Slightly opens for power
        [BoneName.FOREARM_R, new THREE.Euler(0, 0, 0, "XYZ")],
        // Full torso rotation
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.5, 0.1, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0.4, 0.05, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0.3, 0, "XYZ")],
        // Hip engagement
        [BoneName.HIP_R, new THREE.Euler(0, 0.2, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.ELBOW_R, new THREE.Vector3(0, 0, 0.6)], // Elbow extends forward
      ]),
    },

    // Frame 4: Impact point (0.12s)
    {
      time: 0.12,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0.5, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
        [BoneName.FOREARM_R, new THREE.Euler(0, 0.1, 0, "XYZ")],
        // Maximum rotation
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0.6, 0.15, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0.5, 0.1, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0.4, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0, 0.3, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.ELBOW_R, new THREE.Vector3(0, 0, 0.7)],
        [BoneName.PELVIS, new THREE.Vector3(0, 0, 0.1)], // Weight shift forward
      ]),
    },

    // Frame 5: Recovery (0.2s)
    {
      time: 0.2,
      easing: "ease-in",
      boneRotations: new Map([
        // Return to guard
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, -0.1, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        [BoneName.FOREARM_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.ELBOW_R, new THREE.Vector3(0, 0, 0)],
        [BoneName.HAND_R, new THREE.Vector3(0, 0, 0)],
        [BoneName.PELVIS, new THREE.Vector3(0, 0, 0)],
      ]),
    },
  ],
};

/**
 * Knee strike animation (무릎 타격 - Mureup Tagyeok)
 *
 * Close-range knee strike from Muay Thai-influenced Korean martial arts.
 * Clinch position with explosive knee drive and proper hip engagement.
 *
 * Animation phases:
 * 1. Clinch setup (0.0s): Arms position for control, weight on support leg
 * 2. Chamber (0.05s): Knee begins to lift, hip flexes
 * 3. Drive (0.1s-0.12s): Knee drives upward with hip thrust
 * 4. Impact (0.12s): Maximum extension with full body weight
 * 5. Retraction (0.15s): Knee returns to chamber
 * 6. Recovery (0.2s): Return to fighting stance
 *
 * Duration: 200ms (10 frames @ 60fps)
 *
 * @korean 무릎타격애니메이션
 */
export const KNEE_STRIKE_ANIMATION: SkeletalAnimation = {
  name: "knee_strike",
  koreanName: "무릎타격",
  duration: 0.2,
  loop: false,
  type: "attack",
  keyframes: [
    // Frame 1: Clinch setup (0.0s)
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        // Arms in clinch position
        [BoneName.SHOULDER_L, new THREE.Euler(0.8, 0, -0.5, "XYZ")], // Arms forward
        [BoneName.SHOULDER_R, new THREE.Euler(0.8, 0, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.3, "XYZ")], // Bent for control
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.3, "XYZ")],
        // Support leg stabilizes
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(0, 0, 0.03, "XYZ")],
        // Striking leg neutral
        [BoneName.HIP_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.01, 0)],
      ]),
    },

    // Frame 2: Chamber begins (0.05s)
    {
      time: 0.05,
      easing: "ease-out",
      boneRotations: new Map([
        // Arms pull opponent down (simulation)
        [BoneName.SHOULDER_L, new THREE.Euler(0.5, 0, -0.6, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 0.6, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.4, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.4, "XYZ")],
        // Right knee chambers
        [BoneName.HIP_R, new THREE.Euler(1.0, 0, 0, "XYZ")], // Hip flexes
        [BoneName.KNEE_R, new THREE.Euler(-1.3, 0, 0, "XYZ")], // Knee bends tight
        // Support leg adjusts
        [BoneName.KNEE_L, new THREE.Euler(-0.25, 0, 0, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(0, 0, 0.05, "XYZ")],
        // Torso leans back slightly
        [BoneName.SPINE_UPPER, new THREE.Euler(-0.1, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.02, -0.05)],
      ]),
    },

    // Frame 3: Knee drive begins (0.1s)
    {
      time: 0.1,
      easing: "ease-out",
      boneRotations: new Map([
        // Arms maintain clinch
        [BoneName.SHOULDER_L, new THREE.Euler(0.3, 0, -0.7, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.3, 0, 0.7, "XYZ")],
        // Knee drives upward
        [BoneName.HIP_R, new THREE.Euler(1.3, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.8, 0, 0, "XYZ")], // Opens slightly
        [BoneName.FOOT_R, new THREE.Euler(0.3, 0, 0, "XYZ")], // Ankle plantarflexion
        // Hip thrust
        [BoneName.PELVIS, new THREE.Euler(0.15, 0, 0, "XYZ")], // Forward thrust
        [BoneName.SPINE_LOWER, new THREE.Euler(0.1, 0, 0, "XYZ")],
        // Support leg extends
        [BoneName.KNEE_L, new THREE.Euler(-0.15, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.KNEE_R, new THREE.Vector3(0, 0.3, 0.4)], // Knee rises forward
        [BoneName.PELVIS, new THREE.Vector3(0, 0, 0.15)], // Hip drives forward
      ]),
    },

    // Frame 4: Impact point (0.12s)
    {
      time: 0.12,
      easing: "linear",
      boneRotations: new Map([
        // Maximum pull down
        [BoneName.SHOULDER_L, new THREE.Euler(0.2, 0, -0.8, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0.2, 0, 0.8, "XYZ")],
        // Maximum knee extension
        [BoneName.HIP_R, new THREE.Euler(1.4, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.5, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(0.4, 0, 0, "XYZ")],
        // Full hip thrust
        [BoneName.PELVIS, new THREE.Euler(0.2, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0.15, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0.05, 0, 0, "XYZ")],
        // Support leg fully extended
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.KNEE_R, new THREE.Vector3(0, 0.4, 0.5)],
        [BoneName.PELVIS, new THREE.Vector3(0, 0.02, 0.2)],
      ]),
    },

    // Frame 5: Retraction (0.15s)
    {
      time: 0.15,
      easing: "ease-in",
      boneRotations: new Map([
        // Return to chamber
        [BoneName.HIP_R, new THREE.Euler(1.0, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-1.3, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.KNEE_R, new THREE.Vector3(0, 0.2, 0.2)],
        [BoneName.PELVIS, new THREE.Vector3(0, -0.01, 0)],
      ]),
    },

    // Frame 6: Recovery (0.2s)
    {
      time: 0.2,
      easing: "ease-in",
      boneRotations: new Map([
        // Arms return to guard
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, 0.5, "XYZ")],
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, -0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        // Leg returns to stance
        [BoneName.HIP_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.FOOT_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.FOOT_L, new THREE.Euler(0, 0, 0, "XYZ")],
        // Body neutral
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.KNEE_R, new THREE.Vector3(0, 0, 0)],
        [BoneName.PELVIS, new THREE.Vector3(0, 0, 0)],
      ]),
    },
  ],
};

/**
 * Side kick animation (옆차기 - Yeopchagi)
 *
 * Traditional Taekwondo side kick with lateral hip rotation,
 * leg extension to the side, and proper chamber-drive-retract sequence.
 *
 * Animation phases:
 * 1. Chamber (0.0s-0.1s): Knee lifts with hip turning sideways
 * 2. Drive (0.1s-0.15s): Leg drives laterally with hip thrust
 * 3. Extension (0.15s-0.2s): Full extension with heel strike
 * 4. Impact (0.2s): Maximum lateral extension
 * 5. Retraction (0.2s-0.35s): Return to chamber
 * 6. Recovery (0.35s-0.5s): Foot returns to ground, stance reset
 *
 * Duration: 500ms (30 frames @ 60fps)
 *
 * @korean 옆차기애니메이션
 */
export const SIDE_KICK_ANIMATION = AnimationBuilder.create("side_kick")
  .withKoreanName("옆차기")
  .withDuration(0.5)
  .withType("attack")
  // Frame 1: Chamber with sideways turn
  .keyframe(0.1, "ease-out")
    .rotate(BoneName.HIP_R, 1.3, 0, 0.3) // Lift and turn
    .rotate(BoneName.KNEE_R, -1.6, 0, 0) // Tight chamber
    .rotate(BoneName.PELVIS, 0, -1.57, 0) // Turn left (90 degrees)
    .rotate(BoneName.SPINE_LOWER, 0, -1.4, 0)
    .rotate(BoneName.SPINE_UPPER, 0, -1.2, 0.2) // Lean away
    .rotate(BoneName.KNEE_L, -0.3, 0, 0) // Support leg adjusts
    .rotate(BoneName.FOOT_L, 0, 0, 0.1)
    .rotate(BoneName.SHOULDER_L, 0, 0, -1.2) // Arms for balance
    .rotate(BoneName.SHOULDER_R, 0, 0, 0.8)
    .position(BoneName.PELVIS, 0, -0.02, 0)
    .build()
  // Frame 2: Drive begins
  .keyframe(0.15, "ease-out")
    .rotate(BoneName.HIP_R, 1.3, 0, 0.5) // Leg begins lateral extension
    .rotate(BoneName.KNEE_R, -1.0, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0.3, 0) // Heel positioning
    .rotate(BoneName.PELVIS, 0, -1.57, 0) // Hip thrust lateral
    .rotate(BoneName.SPINE_LOWER, 0, -1.4, 0)
    .rotate(BoneName.SPINE_UPPER, 0, -1.2, 0.3)
    .rotate(BoneName.KNEE_L, -0.25, 0, 0) // Support leg stabilizes
    .position(BoneName.FOOT_R, 0.4, 0, 0) // Lateral movement
    .build()
  // Frame 3: Full extension and impact
  .keyframe(0.2, "linear")
    .rotate(BoneName.HIP_R, 1.3, 0, 0.7) // Maximum lateral extension
    .rotate(BoneName.KNEE_R, -0.1, 0, 0) // Nearly straight
    .rotate(BoneName.FOOT_R, 0, 0.4, 0) // Heel strike position
    .rotate(BoneName.PELVIS, 0, -1.57, 0) // Maximum hip drive
    .rotate(BoneName.SPINE_LOWER, 0, -1.4, 0)
    .rotate(BoneName.SPINE_UPPER, 0, -1.2, 0.4) // Maximum lean
    .rotate(BoneName.KNEE_L, -0.15, 0, 0) // Support leg extends
    .position(BoneName.FOOT_R, 0.7, 0, 0) // Maximum reach
    .position(BoneName.PELVIS, 0.1, 0, 0) // Slight lateral shift
    .build()
  // Frame 4: Retraction
  .keyframe(0.35, "ease-in")
    .rotate(BoneName.HIP_R, 1.3, 0, 0.3) // Return to chamber
    .rotate(BoneName.KNEE_R, -1.6, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, -1.2, 0) // Begin turning back
    .rotate(BoneName.SPINE_LOWER, 0, -1.0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, -0.8, 0.2)
    .position(BoneName.FOOT_R, 0.3, 0, 0)
    .position(BoneName.PELVIS, 0, -0.01, 0)
    .build()
  // Frame 5: Recovery
  .keyframe(0.5, "ease-in")
    .rotate(BoneName.HIP_R, 0, 0, 0) // Return to neutral stance
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.FOOT_R, 0, 0, 0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.FOOT_L, 0, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0, 0, 0.5)
    .rotate(BoneName.SHOULDER_R, 0, 0, -0.5)
    .position(BoneName.FOOT_R, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .build()
  .build();

/**
 * Elbow uppercut animation (팔꿈치 올려치기 - Palgumchi Ollyeochigi)
 *
 * Upward elbow strike from Hapkido, targeting chin/jaw area.
 * Close-range technique with explosive upward drive and leg spring.
 *
 * Animation phases:
 * 1. Crouch (0.0s): Lower stance, elbow chambers low
 * 2. Spring (0.05s): Legs drive upward with explosive force
 * 3. Drive (0.1s-0.12s): Elbow drives upward with hip thrust
 * 4. Impact (0.12s): Maximum upward extension at chin level
 * 5. Recovery (0.18s): Return to guard position
 *
 * Duration: 180ms (11 frames @ 60fps)
 *
 * @korean 팔꿈치올려치기애니메이션
 */
export const ELBOW_UPPERCUT_ANIMATION: SkeletalAnimation = {
  name: "elbow_uppercut",
  koreanName: "팔꿈치올려치기",
  duration: 0.18,
  loop: false,
  type: "attack",
  keyframes: [
    // Frame 1: Crouch position (0.0s)
    {
      time: 0.0,
      easing: "linear",
      boneRotations: new Map([
        // Right arm chambers low
        [BoneName.SHOULDER_R, new THREE.Euler(-0.3, 0, 0.5, "XYZ")], // Down and forward
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 2.0, "XYZ")], // Tight bend
        [BoneName.FOREARM_R, new THREE.Euler(0, -0.8, 0, "XYZ")],
        // Legs bend for spring
        [BoneName.KNEE_L, new THREE.Euler(-0.5, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.5, 0, 0, "XYZ")],
        // Torso leans slightly forward
        [BoneName.SPINE_UPPER, new THREE.Euler(0.2, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0.15, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0.1, 0, 0, "XYZ")],
        // Left arm guards
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.1, 0)], // Lower stance
      ]),
    },

    // Frame 2: Spring upward (0.05s)
    {
      time: 0.05,
      easing: "ease-out",
      boneRotations: new Map([
        // Arm begins upward drive
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, 0.8, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.8, "XYZ")],
        [BoneName.FOREARM_R, new THREE.Euler(0, -0.5, 0, "XYZ")],
        // Legs extend explosively
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        // Torso straightens
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, -0.02, 0)],
        [BoneName.ELBOW_R, new THREE.Vector3(0, 0.2, 0.3)], // Rising
      ]),
    },

    // Frame 3: Upward drive (0.1s)
    {
      time: 0.1,
      easing: "ease-out",
      boneRotations: new Map([
        // Elbow drives upward
        [BoneName.SHOULDER_R, new THREE.Euler(0.5, 0, 1.0, "XYZ")], // Up and forward
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.5, "XYZ")],
        [BoneName.FOREARM_R, new THREE.Euler(0, -0.2, 0, "XYZ")],
        // Full leg extension
        [BoneName.KNEE_L, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        // Hip thrust upward
        [BoneName.PELVIS, new THREE.Euler(-0.1, 0, 0, "XYZ")], // Thrust up
        [BoneName.SPINE_LOWER, new THREE.Euler(-0.05, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0.05, 0.1)], // Rising forward
        [BoneName.ELBOW_R, new THREE.Vector3(0, 0.5, 0.4)],
      ]),
    },

    // Frame 4: Impact at chin level (0.12s)
    {
      time: 0.12,
      easing: "linear",
      boneRotations: new Map([
        // Maximum upward extension
        [BoneName.SHOULDER_R, new THREE.Euler(0.8, 0, 1.2, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.4, "XYZ")],
        [BoneName.FOREARM_R, new THREE.Euler(0, 0, 0, "XYZ")],
        // Legs fully extended
        [BoneName.KNEE_L, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.05, 0, 0, "XYZ")],
        // Maximum upward thrust
        [BoneName.PELVIS, new THREE.Euler(-0.15, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(-0.1, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(-0.05, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0.08, 0.15)],
        [BoneName.ELBOW_R, new THREE.Vector3(0, 0.7, 0.5)], // Chin level
      ]),
    },

    // Frame 5: Recovery (0.18s)
    {
      time: 0.18,
      easing: "ease-in",
      boneRotations: new Map([
        // Return to guard
        [BoneName.SHOULDER_R, new THREE.Euler(0, 0, -0.1, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        [BoneName.FOREARM_R, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.KNEE_L, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.KNEE_R, new THREE.Euler(-0.2, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_LOWER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(0, 0, 0.5, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.PELVIS, new THREE.Vector3(0, 0, 0)],
        [BoneName.ELBOW_R, new THREE.Vector3(0, 0, 0)],
      ]),
    },
  ],
};

/**
 * All skeletal animations mapped by name
 *
 * Includes attack, defense, movement, and idle animations.
 *
 * @korean 모든골격애니메이션
 */
export const ATTACK_ANIMATIONS = new Map<string, SkeletalAnimation>([
  ["jab", JAB_ANIMATION],
  ["cross", CROSS_ANIMATION],
  ["front_kick", FRONT_KICK_ANIMATION],
  ["roundhouse_kick", ROUNDHOUSE_KICK_ANIMATION],
  ["side_kick", SIDE_KICK_ANIMATION],
  ["elbow_strike", ELBOW_STRIKE_ANIMATION],
  ["elbow_uppercut", ELBOW_UPPERCUT_ANIMATION],
  ["knee_strike", KNEE_STRIKE_ANIMATION],
  ["block", BLOCK_ANIMATION],
  ["walk", WALK_ANIMATION],
  ["idle_stance", IDLE_STANCE_ANIMATION],
  ["forward_dash", FORWARD_DASH_ANIMATION],
  ["backward_retreat", BACKWARD_RETREAT_ANIMATION],
  ["side_step", SIDE_STEP_ANIMATION],
]);

/**
 * Get animation by name
 *
 * @param name - Animation name
 * @returns Skeletal animation or undefined
 *
 * @korean 애니메이션가져오기
 */
export const getAnimation = (name: string): SkeletalAnimation | undefined => {
  return ATTACK_ANIMATIONS.get(name);
};

/**
 * Maps technique keywords to animation names
 *
 * Used to determine which skeletal animation to play based on
 * technique name, ID, or description keywords.
 *
 * NOTE: Order matters! More specific patterns must come first.
 *
 * @korean 기술애니메이션매핑
 */
const TECHNIQUE_ANIMATION_MAP: ReadonlyArray<readonly [RegExp, string]> = [
  // Kicks (차기) - more specific patterns first
  [/front.?kick|앞차기|snap.?kick/i, "front_kick"],
  [/kick|차기|roundhouse|돌려차기/i, "roundhouse_kick"],
  // Punches (주먹)
  [/cross|십자|교차/i, "cross"],
  [/jab|잽|직권|찌르기|punch|주먹|권|strike|격/i, "jab"],
  // Default to jab for any other attack
] as const;

/**
 * Get animation name for a technique
 *
 * Analyzes technique name/ID to determine the appropriate skeletal animation.
 * Falls back to "jab" for unmatched techniques.
 *
 * @param techniqueNameOrId - Technique name, ID, or Korean name
 * @returns Animation name from ATTACK_ANIMATIONS map
 *
 * @example
 * ```typescript
 * getAnimationForTechnique("thunder_strike") // "jab"
 * getAnimationForTechnique("roundhouse_kick") // "roundhouse_kick"
 * getAnimationForTechnique("앞차기") // "front_kick"
 * ```
 *
 * @korean 기술에맞는애니메이션가져오기
 */
export const getAnimationForTechnique = (techniqueNameOrId: string): string => {
  for (const [pattern, animationName] of TECHNIQUE_ANIMATION_MAP) {
    if (pattern.test(techniqueNameOrId)) {
      return animationName;
    }
  }
  // Default to jab for any unmatched technique
  return "jab";
};
