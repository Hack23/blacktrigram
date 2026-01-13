/**
 * Laterality Transform System for Animation Pipeline
 * 
 * **Korean**: 측면성 변환 시스템
 * 
 * Extends the animation system to support StanceLaterality (왼발서기/오른발서기),
 * enabling authentic Korean martial arts stance mirroring across all animations.
 * Creates 16 distinct stance configurations (8 trigrams × 2 sides).
 * 
 * Key Features:
 * - Transform skeletal animations for left/right laterality
 * - Mirror bone rotations (swap left ↔ right, negate Y/Z axes)
 * - Preserve animation timing and type information
 * - Performance optimized (<1ms transformation time)
 * 
 * Korean Terminology:
 * - **왼발서기 (Oenbal Seogi)**: Left foot forward, left guard high
 * - **오른발서기 (Oreun Bal Seogi)**: Right foot forward, right guard high
 * - **측면성 (Cheugmyeonseong)**: Laterality/sidedness in martial arts
 * 
 * @module systems/animation/LateralityTransform
 * @category Animation
 * @korean 측면성변환
 */

import * as THREE from "three";
import type { SkeletalAnimation, AnimationKeyframe } from "../../types/skeletal";
import type { StanceLaterality } from "../trigram/types";

/**
 * Apply laterality transformation to a skeletal animation.
 * 
 * **Korean**: 애니메이션 측면성 적용
 * 
 * Transforms a skeletal animation to match the specified laterality (left/right stance).
 * Right laterality returns the original animation; left laterality creates a mirrored version
 * with left/right bones swapped and lateral rotations negated.
 * 
 * Transformation Rules:
 * - Swap left ↔ right bone names (e.g., "shoulder_L" ↔ "shoulder_R")
 * - Negate Y rotation (lateral twist around vertical axis)
 * - Negate Z rotation (roll around forward-back axis)
 * - Preserve X rotation (forward/back bend)
 * - Maintain timing, duration, and easing information
 * 
 * Performance: <1ms for typical animation (verified in tests)
 * 
 * @param animation - Source skeletal animation to transform
 * @param laterality - Target laterality: "left" or "right"
 * @returns Transformed animation with mirrored bone rotations for left laterality
 * 
 * @example
 * ```typescript
 * // Get right-handed punch animation
 * const rightPunch = GEON_BONE_BREAKING_STRIKE_1;
 * 
 * // Create left-handed version
 * const leftPunch = applyLaterality(rightPunch, "left");
 * // leftPunch has left hand as striking hand, mirrored rotations
 * 
 * // Right laterality returns original (no transformation cost)
 * const sameAnimation = applyLaterality(rightPunch, "right");
 * // sameAnimation === rightPunch (same reference)
 * ```
 * 
 * @public
 * @category Animation Transform
 * @korean 애니메이션측면성적용
 */
export function applyLaterality(
  animation: SkeletalAnimation,
  laterality: StanceLaterality
): SkeletalAnimation {
  // Right laterality returns original animation (no transformation)
  if (laterality === "right") {
    return animation;
  }

  // Left laterality: mirror all keyframes
  const mirroredKeyframes = animation.keyframes.map((keyframe) =>
    mirrorAnimationKeyframe(keyframe)
  );

  // Return transformed animation with updated name
  return {
    ...animation,
    name: `${animation.name}_left`,
    koreanName: `${animation.koreanName} (왼발)`,
    keyframes: mirroredKeyframes,
  };
}

/**
 * Mirror a single animation keyframe for left laterality.
 * 
 * **Korean**: 키프레임 좌우 대칭
 * 
 * Creates a mirrored version of an animation keyframe by:
 * 1. Swapping left and right bone names
 * 2. Negating Y and Z rotations (lateral twist and roll)
 * 3. Preserving X rotation (forward/back bend)
 * 4. Maintaining timing and easing information
 * 
 * Bone Name Swapping:
 * - "_L" suffix → "_R" suffix
 * - "_R" suffix → "_L" suffix
 * - "left_" prefix → "right_" prefix
 * - "right_" prefix → "left_" prefix
 * 
 * @param keyframe - Original animation keyframe
 * @returns Mirrored keyframe with swapped bones and negated rotations
 * 
 * @internal
 * @korean 키프레임대칭
 */
function mirrorAnimationKeyframe(keyframe: AnimationKeyframe): AnimationKeyframe {
  // Mirror bone rotations
  const mirroredRotations = new Map<string, THREE.Euler>();
  
  keyframe.boneRotations.forEach((rotation, boneName) => {
    const mirroredBoneName = mirrorBoneName(boneName);
    const mirroredRotation = mirrorEuler(rotation);
    mirroredRotations.set(mirroredBoneName, mirroredRotation);
  });

  // Mirror bone positions (if present)
  const mirroredPositions = new Map<string, THREE.Vector3>();
  
  if (keyframe.bonePositions) {
    keyframe.bonePositions.forEach((position, boneName) => {
      const mirroredBoneName = mirrorBoneName(boneName);
      const mirroredPosition = mirrorPosition(position);
      mirroredPositions.set(mirroredBoneName, mirroredPosition);
    });
  }

  return {
    time: keyframe.time,
    boneRotations: mirroredRotations,
    bonePositions: mirroredPositions,
    easing: keyframe.easing,
  };
}

/**
 * Mirror a bone name by swapping left/right suffixes and prefixes.
 * 
 * **Korean**: 뼈 이름 대칭
 * 
 * Transforms bone names to their mirrored counterparts:
 * - "shoulder_L" → "shoulder_R"
 * - "upper_arm_R" → "upper_arm_L"
 * - "left_hand" → "right_hand"
 * - "right_foot" → "left_foot"
 * 
 * If bone has no laterality marker (e.g., "spine", "pelvis"),
 * returns the original name unchanged.
 * 
 * @param boneName - Original bone name
 * @returns Mirrored bone name with swapped left/right markers
 * 
 * @example
 * ```typescript
 * mirrorBoneName("shoulder_L")    // → "shoulder_R"
 * mirrorBoneName("upper_arm_R")   // → "upper_arm_L"
 * mirrorBoneName("left_hand")     // → "right_hand"
 * mirrorBoneName("spine_upper")   // → "spine_upper" (no change)
 * ```
 * 
 * @internal
 * @korean 뼈이름대칭
 */
function mirrorBoneName(boneName: string): string {
  // Handle _L and _R suffixes (most common pattern)
  if (boneName.endsWith("_L")) {
    return boneName.slice(0, -2) + "_R";
  }
  if (boneName.endsWith("_R")) {
    return boneName.slice(0, -2) + "_L";
  }

  // Handle left_ and right_ prefixes
  if (boneName.startsWith("left_")) {
    return "right_" + boneName.slice(5);
  }
  if (boneName.startsWith("right_")) {
    return "left_" + boneName.slice(6);
  }

  // No laterality marker - return unchanged (e.g., spine, pelvis, neck)
  return boneName;
}

/**
 * Mirror a bone rotation by negating Y and Z axes.
 * 
 * **Korean**: 뼈 회전 대칭
 * 
 * Transforms rotation for left/right mirroring:
 * - X rotation: Preserved (forward/back bend is symmetric)
 * - Y rotation: Negated (lateral twist direction reverses)
 * - Z rotation: Negated (roll direction reverses)
 * 
 * This creates anatomically correct mirrored poses where:
 * - Right arm punch becomes left arm punch
 * - Left leg kick becomes right leg kick
 * - Torso twist direction reverses appropriately
 * 
 * @param euler - Original bone rotation
 * @returns Mirrored rotation with negated Y and Z axes
 * 
 * @example
 * ```typescript
 * // Right arm forward punch: shoulder rotates forward and inward
 * const rightPunch = new THREE.Euler(-1.2, 0.5, 0.6);
 * const leftPunch = mirrorEuler(rightPunch);
 * // leftPunch: (-1.2, -0.5, -0.6) - forward bend preserved, twist/roll negated
 * ```
 * 
 * @internal
 * @korean 뼈회전대칭
 */
function mirrorEuler(euler: THREE.Euler): THREE.Euler {
  return new THREE.Euler(
    euler.x,   // Preserve forward/back bend
    -euler.y,  // Negate lateral twist
    -euler.z,  // Negate roll
    euler.order // Preserve rotation order
  );
}

/**
 * Mirror a bone position by negating the Y coordinate.
 * 
 * **Korean**: 뼈 위치 대칭
 * 
 * Mirrors position across the YZ plane (body centerline):
 * - X coordinate: Preserved (forward/back)
 * - Y coordinate: Negated (left/right - this is what we mirror)
 * - Z coordinate: Preserved (up/down)
 * 
 * Used for IK targets and special move positioning where
 * absolute bone positions are specified.
 * 
 * @param position - Original bone position offset
 * @returns Mirrored position with negated Y coordinate
 * 
 * @example
 * ```typescript
 * // Right hand extends to the right (+Y)
 * const rightHandPos = new THREE.Vector3(0.3, 0.5, 0);
 * const leftHandPos = mirrorPosition(rightHandPos);
 * // leftHandPos: (0.3, -0.5, 0) - extends to the left (-Y)
 * ```
 * 
 * @internal
 * @korean 뼈위치대칭
 */
function mirrorPosition(position: THREE.Vector3): THREE.Vector3 {
  return new THREE.Vector3(
    position.x,   // Preserve forward/back
    -position.y,  // Negate left/right
    position.z    // Preserve up/down
  );
}

/**
 * Get the laterality identifier for an animation.
 * 
 * **Korean**: 애니메이션 측면성 식별
 * 
 * Determines if an animation is configured for left or right laterality
 * based on its name suffix.
 * 
 * @param animation - Skeletal animation to inspect
 * @returns "left" if animation has "_left" suffix, otherwise "right"
 * 
 * @example
 * ```typescript
 * const rightAnim = { name: "geon_punch", ... };
 * const leftAnim = { name: "geon_punch_left", ... };
 * 
 * getAnimationLaterality(rightAnim); // → "right"
 * getAnimationLaterality(leftAnim);  // → "left"
 * ```
 * 
 * @public
 * @category Animation Query
 * @korean 애니메이션측면성식별
 */
export function getAnimationLaterality(
  animation: SkeletalAnimation
): StanceLaterality {
  return animation.name.endsWith("_left") ? "left" : "right";
}

/**
 * Check if two animations are laterality variants of each other.
 * 
 * **Korean**: 애니메이션 측면성 변형 확인
 * 
 * Determines if two animations represent the same technique but
 * with different laterality (left vs right stance).
 * 
 * @param anim1 - First animation
 * @param anim2 - Second animation
 * @returns True if animations are laterality variants of the same base animation
 * 
 * @example
 * ```typescript
 * const rightPunch = { name: "geon_punch", ... };
 * const leftPunch = { name: "geon_punch_left", ... };
 * const otherMove = { name: "tae_throw", ... };
 * 
 * areLateralityVariants(rightPunch, leftPunch);  // → true
 * areLateralityVariants(rightPunch, otherMove);  // → false
 * ```
 * 
 * @public
 * @category Animation Query
 * @korean 애니메이션측면성변형확인
 */
export function areLateralityVariants(
  anim1: SkeletalAnimation,
  anim2: SkeletalAnimation
): boolean {
  // Get base names (remove _left suffix if present)
  const baseName1 = anim1.name.replace(/_left$/, "");
  const baseName2 = anim2.name.replace(/_left$/, "");
  
  // Check if base names match and laterality differs
  return (
    baseName1 === baseName2 &&
    getAnimationLaterality(anim1) !== getAnimationLaterality(anim2)
  );
}
