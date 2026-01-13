/**
 * Laterality Transform System
 *
 * Applies left/right laterality transformations to skeletal animations.
 * Mirrors animations for opposite-side techniques (e.g., left punch vs right punch).
 *
 * **Korean**: 측면성 변환 (Laterality Transformation)
 *
 * In authentic Korean martial arts (태권도, 합기도, 택견), techniques can be executed
 * from both left and right stances. This module provides automatic mirroring of
 * animations to support both lateralities without duplicating animation data.
 *
 * @module systems/animation/LateralityTransform
 * @category Animation
 * @korean 측면성변환
 */

import * as THREE from "three";
import type { SkeletalAnimation, AnimationKeyframe } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import type { StanceLaterality } from "../trigram/types";

/**
 * Bone name mirroring map for left/right symmetry.
 *
 * **Korean**: 좌우 대칭 뼈 매핑
 *
 * Maps right-side bones to their left-side counterparts and vice versa.
 * Used for automatic animation mirroring.
 *
 * @internal
 * @korean 좌우대칭뼈맵
 */
const BONE_MIRROR_MAP: Map<BoneName, BoneName> = new Map([
  // Arms
  [BoneName.SHOULDER_L, BoneName.SHOULDER_R],
  [BoneName.SHOULDER_R, BoneName.SHOULDER_L],
  [BoneName.UPPER_ARM_L, BoneName.UPPER_ARM_R],
  [BoneName.UPPER_ARM_R, BoneName.UPPER_ARM_L],
  [BoneName.ELBOW_L, BoneName.ELBOW_R],
  [BoneName.ELBOW_R, BoneName.ELBOW_L],
  [BoneName.FOREARM_L, BoneName.FOREARM_R],
  [BoneName.FOREARM_R, BoneName.FOREARM_L],
  [BoneName.WRIST_L, BoneName.WRIST_R],
  [BoneName.WRIST_R, BoneName.WRIST_L],
  [BoneName.HAND_L, BoneName.HAND_R],
  [BoneName.HAND_R, BoneName.HAND_L],

  // Legs
  [BoneName.HIP_L, BoneName.HIP_R],
  [BoneName.HIP_R, BoneName.HIP_L],
  [BoneName.THIGH_L, BoneName.THIGH_R],
  [BoneName.THIGH_R, BoneName.THIGH_L],
  [BoneName.KNEE_L, BoneName.KNEE_R],
  [BoneName.KNEE_R, BoneName.KNEE_L],
  [BoneName.SHIN_L, BoneName.SHIN_R],
  [BoneName.SHIN_R, BoneName.SHIN_L],
  [BoneName.FOOT_L, BoneName.FOOT_R],
  [BoneName.FOOT_R, BoneName.FOOT_L],
]);

/**
 * Mirror a bone name from left to right or vice versa.
 *
 * **Korean**: 뼈 이름 좌우 반전
 *
 * @param boneName - Bone name to mirror
 * @returns Mirrored bone name, or original if bone has no mirror (e.g., spine)
 *
 * @internal
 * @korean 뼈이름반전
 */
function mirrorBoneName(boneName: BoneName): BoneName {
  return BONE_MIRROR_MAP.get(boneName) ?? boneName;
}

/**
 * Mirror a rotation for left/right symmetry.
 *
 * **Korean**: 회전 좌우 반전
 *
 * Mirrors rotation by negating Y and Z axes while keeping X axis.
 * This creates a proper left-right reflection for skeletal rotations.
 *
 * @param rotation - Original rotation
 * @returns Mirrored rotation
 *
 * @internal
 * @korean 회전반전
 */
function mirrorRotation(rotation: THREE.Euler): THREE.Euler {
  return new THREE.Euler(
    rotation.x,   // X axis: keep (forward/back tilt)
    -rotation.y,  // Y axis: negate (left/right rotation)
    -rotation.z,  // Z axis: negate (twist)
    rotation.order
  );
}

/**
 * Mirror a position for left/right symmetry.
 *
 * **Korean**: 위치 좌우 반전
 *
 * Mirrors position by negating the X component (left-right axis).
 *
 * @param position - Original position
 * @returns Mirrored position
 *
 * @internal
 * @korean 위치반전
 */
function mirrorPosition(position: THREE.Vector3): THREE.Vector3 {
  return new THREE.Vector3(-position.x, position.y, position.z);
}

/**
 * Mirror a keyframe for left/right symmetry.
 *
 * **Korean**: 키프레임 좌우 반전
 *
 * Creates a new keyframe with all bone transformations mirrored.
 * Left-side bones become right-side and vice versa, with appropriate
 * rotation and position mirroring.
 *
 * @param keyframe - Original keyframe
 * @returns Mirrored keyframe
 *
 * @internal
 * @korean 키프레임반전
 */
function mirrorKeyframe(keyframe: AnimationKeyframe): AnimationKeyframe {
  const mirroredRotations = new Map<string, THREE.Euler>();
  const mirroredPositions = new Map<string, THREE.Vector3>();

  // Mirror bone rotations
  for (const [boneName, rotation] of keyframe.boneRotations.entries()) {
    const mirroredBone = mirrorBoneName(boneName as BoneName);
    const mirroredRot = mirrorRotation(rotation);
    mirroredRotations.set(mirroredBone, mirroredRot);
  }

  // Mirror bone positions
  for (const [boneName, position] of keyframe.bonePositions.entries()) {
    const mirroredBone = mirrorBoneName(boneName as BoneName);
    const mirroredPos = mirrorPosition(position);
    mirroredPositions.set(mirroredBone, mirroredPos);
  }

  return {
    time: keyframe.time,
    easing: keyframe.easing,
    boneRotations: mirroredRotations,
    bonePositions: mirroredPositions,
  };
}

/**
 * Apply laterality transformation to a skeletal animation.
 *
 * **Korean**: 애니메이션에 측면성 적용
 *
 * Creates a new animation with laterality applied:
 * - **"right"**: Returns the original animation unchanged
 * - **"left"**: Returns a mirrored version of the animation
 *
 * This allows a single right-sided animation to be used for both
 * left and right techniques without duplicating data.
 *
 * ## Performance
 *
 * - Right laterality: O(1) - returns original animation
 * - Left laterality: O(n*m) where n=keyframes, m=bones - creates mirrored copy
 *
 * @param animation - Base animation (typically right-sided)
 * @param laterality - Desired laterality ("left" or "right")
 * @returns Animation with laterality applied
 *
 * @example
 * ```typescript
 * const rightPunch = GEON_BONE_BREAKING_STRIKE_1;
 * const leftPunch = applyLaterality(rightPunch, "left");
 *
 * console.log(rightPunch.name); // "geon_bone_breaking_strike_1"
 * console.log(leftPunch.name);  // "geon_bone_breaking_strike_1_left"
 * ```
 *
 * @public
 * @korean 측면성적용
 */
export function applyLaterality(
  animation: SkeletalAnimation,
  laterality: StanceLaterality
): SkeletalAnimation {
  // Right laterality: return original animation unchanged
  if (laterality === "right") {
    return animation;
  }

  // Left laterality: create mirrored animation
  const mirroredKeyframes = animation.keyframes.map(mirrorKeyframe);

  return {
    name: `${animation.name}_left`,
    koreanName: `${animation.koreanName} (왼쪽)`,
    keyframes: mirroredKeyframes,
    duration: animation.duration,
    loop: animation.loop,
    type: animation.type,
  };
}

/**
 * Get laterality suffix for animation name patterns.
 *
 * **Korean**: 측면성 접미사
 *
 * Returns the appropriate suffix for laterality-aware animation naming:
 * - "right" → "" (no suffix, right is default)
 * - "left" → "_left"
 *
 * @param laterality - Laterality
 * @returns Suffix string
 *
 * @example
 * ```typescript
 * const suffix = getLateralitySuffix("left");
 * const animName = `geon_punch${suffix}`; // "geon_punch_left"
 * ```
 *
 * @public
 * @korean 측면성접미사
 */
export function getLateralitySuffix(laterality: StanceLaterality): string {
  return laterality === "left" ? "_left" : "";
}

/**
 * Check if an animation name includes laterality information.
 *
 * **Korean**: 애니메이션 측면성 포함 여부
 *
 * @param animationName - Animation name to check
 * @returns True if animation name includes "_left" or "_right"
 *
 * @example
 * ```typescript
 * hasLaterality("geon_punch_left"); // true
 * hasLaterality("geon_punch"); // false
 * ```
 *
 * @public
 * @korean 측면성포함여부
 */
export function hasLaterality(animationName: string): boolean {
  return animationName.endsWith("_left") || animationName.endsWith("_right");
}

/**
 * Extract laterality from animation name.
 *
 * **Korean**: 애니메이션 이름에서 측면성 추출
 *
 * @param animationName - Animation name
 * @returns Laterality if present, null otherwise
 *
 * @example
 * ```typescript
 * extractLaterality("geon_punch_left"); // "left"
 * extractLaterality("geon_punch"); // null
 * ```
 *
 * @public
 * @korean 측면성추출
 */
export function extractLaterality(
  animationName: string
): StanceLaterality | null {
  if (animationName.endsWith("_left")) {
    return "left";
  }
  if (animationName.endsWith("_right")) {
    return "right";
  }
  return null;
}
