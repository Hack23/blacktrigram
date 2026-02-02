/**
 * Animation Mirroring Utility - Left/Right Stance Reflection
 *
 * Provides utilities to mirror skeletal animations for left/right foot forward stances.
 * This enables single animation definitions to work for both orthodox and southpaw fighters.
 *
 * Mirror Operations:
 * - Swaps left/right bone rotations (HIP_L ↔ HIP_R, SHOULDER_L ↔ SHOULDER_R, etc.)
 * - Negates Y rotation for pelvis (facing direction)
 * - Negates Z rotation for lateral movements
 * - Inverts X-axis positions for root motion
 *
 * @module systems/animation/utils/AnimationMirror
 * @korean 애니메이션반전유틸리티
 */

import * as THREE from "three";
import {
  BoneName,
  type AnimationKeyframe,
  type SkeletalAnimation,
} from "../../../types/skeletal";

// ═══════════════════════════════════════════════════════════════════════════
// BONE PAIR MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Mapping of left-side bones to their right-side counterparts
 *
 * @korean 좌측뼈대우측뼈대매핑
 */
const LEFT_TO_RIGHT_BONE_MAP: ReadonlyMap<BoneName, BoneName> = new Map([
  [BoneName.SHOULDER_L, BoneName.SHOULDER_R],
  [BoneName.ELBOW_L, BoneName.ELBOW_R],
  [BoneName.WRIST_L, BoneName.WRIST_R],
  [BoneName.HAND_L, BoneName.HAND_R],
  [BoneName.HIP_L, BoneName.HIP_R],
  [BoneName.KNEE_L, BoneName.KNEE_R],
  [BoneName.SHIN_L, BoneName.SHIN_R],
  [BoneName.FOOT_L, BoneName.FOOT_R],
]);

/**
 * Mapping of right-side bones to their left-side counterparts
 *
 * @korean 우측뼈대좌측뼈대매핑
 */
const RIGHT_TO_LEFT_BONE_MAP: ReadonlyMap<BoneName, BoneName> = new Map(
  Array.from(LEFT_TO_RIGHT_BONE_MAP.entries()).map(([left, right]) => [
    right,
    left,
  ]),
);

/**
 * Center bones that need Y/Z rotation negation when mirroring
 *
 * @korean 중앙뼈대
 */
const CENTER_BONES: ReadonlySet<BoneName> = new Set([
  BoneName.PELVIS,
  BoneName.SPINE_LOWER,
  BoneName.SPINE_UPPER,
  BoneName.NECK,
  BoneName.HEAD,
]);

// ═══════════════════════════════════════════════════════════════════════════
// STANCE TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lead foot indicator for stance side
 *
 * Orthodox: Left foot forward (traditional right-handed stance)
 * Southpaw: Right foot forward (traditional left-handed stance)
 *
 * @korean 선발발
 */
export type LeadFoot = "left" | "right";

/**
 * Stance side for combat positioning
 *
 * @korean 자세방향
 */
export type StanceSide = "orthodox" | "southpaw";

// ═══════════════════════════════════════════════════════════════════════════
// MIRRORING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get the mirrored bone name (left ↔ right)
 *
 * @param bone - Original bone name
 * @returns Mirrored bone name (or same if center bone)
 *
 * @korean 반전된뼈대이름가져오기
 */
export function getMirroredBone(bone: BoneName): BoneName {
  const leftToRight = LEFT_TO_RIGHT_BONE_MAP.get(bone);
  if (leftToRight) return leftToRight;

  const rightToLeft = RIGHT_TO_LEFT_BONE_MAP.get(bone);
  if (rightToLeft) return rightToLeft;

  return bone; // Center bones remain unchanged
}

/**
 * Mirror an Euler rotation for the opposite side
 *
 * For lateral bones (limbs):
 * - X rotation is preserved (flexion/extension)
 * - Y rotation is negated (internal/external rotation)
 * - Z rotation is negated (abduction/adduction)
 *
 * For center bones (spine, pelvis):
 * - X rotation is preserved (forward/back tilt)
 * - Y rotation is negated (left/right rotation)
 * - Z rotation is negated (side bend)
 *
 * @param rotation - Original rotation as Euler
 * @param bone - The bone this rotation belongs to
 * @returns Mirrored rotation
 *
 * @korean 회전반전
 */
export function mirrorRotation(
  rotation: THREE.Euler,
  bone: BoneName,
): THREE.Euler {
  const isCenterBone = CENTER_BONES.has(bone);

  if (isCenterBone) {
    // Center bones: negate Y and Z for bilateral symmetry
    return new THREE.Euler(
      rotation.x, // Preserve forward/back tilt
      -rotation.y, // Negate left/right rotation
      -rotation.z, // Negate side bend
      rotation.order,
    );
  } else {
    // Limb bones: preserve X (flexion), negate Y and Z
    return new THREE.Euler(
      rotation.x, // Preserve flexion/extension
      -rotation.y, // Negate internal/external rotation
      -rotation.z, // Negate abduction/adduction
      rotation.order,
    );
  }
}

/**
 * Mirror a position vector for the opposite side
 *
 * @param position - Original position
 * @returns Mirrored position (X negated for lateral mirror)
 *
 * @korean 위치반전
 */
export function mirrorPosition(position: THREE.Vector3): THREE.Vector3 {
  return new THREE.Vector3(
    -position.x, // Negate lateral position
    position.y, // Preserve vertical
    position.z, // Preserve depth
  );
}

/**
 * Mirror a single animation keyframe
 *
 * Swaps left/right bone rotations and mirrors center bone rotations.
 *
 * @param keyframe - Original keyframe
 * @returns Mirrored keyframe
 *
 * @korean 키프레임반전
 */
export function mirrorKeyframe(keyframe: AnimationKeyframe): AnimationKeyframe {
  // Process bone rotations - return empty Map if source is undefined
  const mirroredRotations = new Map<string, THREE.Euler>();
  if (keyframe.boneRotations) {
    keyframe.boneRotations.forEach((rotation, bone) => {
      const mirroredBone = getMirroredBone(bone as BoneName);
      const mirroredRotation = mirrorRotation(rotation, bone as BoneName);
      mirroredRotations.set(mirroredBone, mirroredRotation);
    });
  }

  // Process bone positions - return empty Map if source is undefined
  const mirroredPositions = new Map<string, THREE.Vector3>();
  if (keyframe.bonePositions) {
    keyframe.bonePositions.forEach((position, bone) => {
      const mirroredBone = getMirroredBone(bone as BoneName);
      const mirroredPos = mirrorPosition(position);
      mirroredPositions.set(mirroredBone, mirroredPos);
    });
  }

  // Copy other keyframe properties
  const result: AnimationKeyframe = {
    time: keyframe.time,
    easing: keyframe.easing,
    boneRotations: mirroredRotations,
    bonePositions: mirroredPositions,
  };

  // Copy hand pose properties if they exist (swap left/right)
  if (keyframe.leftHandPose || keyframe.rightHandPose) {
    return {
      ...result,
      leftHandPose: keyframe.rightHandPose,
      rightHandPose: keyframe.leftHandPose,
    };
  }

  return result;
}

/**
 * Mirror an entire skeletal animation for the opposite stance side
 *
 * Creates a new animation with all keyframes mirrored left-to-right.
 * Useful for creating southpaw variants from orthodox animations.
 *
 * @param animation - Original animation (assumed orthodox/left-foot-forward)
 * @param options - Mirroring options
 * @returns New animation with mirrored keyframes
 *
 * @example
 * ```typescript
 * // Create southpaw jab from orthodox jab
 * const southpawJab = mirrorAnimation(JAB_ANIMATION, {
 *   nameSuffix: '_southpaw',
 *   koreanNameSuffix: '(사우스포)'
 * });
 * ```
 *
 * @korean 애니메이션반전
 */
export function mirrorAnimation(
  animation: SkeletalAnimation,
  options: {
    readonly nameSuffix?: string;
    readonly koreanNameSuffix?: string;
  } = {},
): SkeletalAnimation {
  const { nameSuffix = "_mirrored", koreanNameSuffix = "(반전)" } = options;

  const mirroredKeyframes = animation.keyframes.map((kf) => mirrorKeyframe(kf));

  return {
    ...animation,
    name: `${animation.name}${nameSuffix}`,
    koreanName: `${animation.koreanName || animation.name}${koreanNameSuffix}`,
    keyframes: mirroredKeyframes,
  };
}

/**
 * Get animation for specified stance side
 *
 * If the animation is already in the correct stance, returns as-is.
 * If not, mirrors the animation.
 *
 * @param animation - Base animation (orthodox)
 * @param leadFoot - Which foot should be forward
 * @param cache - Optional cache for mirrored animations
 * @returns Animation for the specified stance
 *
 * @korean 자세별애니메이션가져오기
 */
export function getAnimationForStance(
  animation: SkeletalAnimation,
  leadFoot: LeadFoot,
  cache?: Map<string, SkeletalAnimation>,
): SkeletalAnimation {
  // Orthodox stance (left foot forward) - use original
  if (leadFoot === "left") {
    return animation;
  }

  // Southpaw stance (right foot forward) - need mirrored version
  const cacheKey = `${animation.name}_southpaw`;

  if (cache?.has(cacheKey)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- checked with has() above
    return cache.get(cacheKey)!;
  }

  const mirrored = mirrorAnimation(animation, {
    nameSuffix: "_southpaw",
    koreanNameSuffix: "(사우스포)",
  });

  cache?.set(cacheKey, mirrored);

  return mirrored;
}

// ═══════════════════════════════════════════════════════════════════════════
// STANCE UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Convert lead foot to stance side
 *
 * @param leadFoot - Which foot is forward
 * @returns Stance side name
 *
 * @korean 선발발에서자세방향변환
 */
export function leadFootToStanceSide(leadFoot: LeadFoot): StanceSide {
  return leadFoot === "left" ? "orthodox" : "southpaw";
}

/**
 * Convert stance side to lead foot
 *
 * @param stanceSide - Stance side name
 * @returns Which foot is forward
 *
 * @korean 자세방향에서선발발변환
 */
export function stanceSideToLeadFoot(stanceSide: StanceSide): LeadFoot {
  return stanceSide === "orthodox" ? "left" : "right";
}

/**
 * Get the opposite lead foot
 *
 * @param leadFoot - Current lead foot
 * @returns Opposite lead foot
 *
 * @korean 반대선발발가져오기
 */
export function getOppositeLeadFoot(leadFoot: LeadFoot): LeadFoot {
  return leadFoot === "left" ? "right" : "left";
}

/**
 * Get the rear foot based on lead foot
 *
 * @param leadFoot - Which foot is forward
 * @returns Which foot is in the rear
 *
 * @korean 후발발가져오기
 */
export function getRearFoot(leadFoot: LeadFoot): LeadFoot {
  return getOppositeLeadFoot(leadFoot);
}
