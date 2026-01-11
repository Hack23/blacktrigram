/**
 * Martial Pose Application Utilities
 *
 * Utilities for applying martial arts poses (guards, stances) to keyframes.
 * 무술 자세 적용 유틸리티
 *
 * @module systems/animation/MartialPoseApplicator
 * @korean 무술자세적용기
 */

import * as THREE from "three";
import type { AnimationKeyframe } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import type { KeyframeConfig } from "./KeyframeConfig";
import { MARTIAL_POSES } from "./MartialArtsConstants";

/** Martial pose type from MARTIAL_POSES constant */
export type MartialPose = (typeof MARTIAL_POSES)[keyof typeof MARTIAL_POSES];

/** Pose name keys */
export type MartialPoseName = keyof typeof MARTIAL_POSES;

/**
 * Bone mapping for upper body martial poses
 * @internal
 */
interface UpperBodyBoneMapping {
  readonly poseKey: keyof MartialPose;
  readonly boneName: BoneName;
}

/** Upper body bone mappings for martial poses */
const UPPER_BODY_BONES: readonly UpperBodyBoneMapping[] = [
  { poseKey: "leftShoulder", boneName: BoneName.SHOULDER_L },
  { poseKey: "leftElbow", boneName: BoneName.ELBOW_L },
  { poseKey: "rightShoulder", boneName: BoneName.SHOULDER_R },
  { poseKey: "rightElbow", boneName: BoneName.ELBOW_R },
] as const;

/**
 * Apply martial pose to a KeyframeConfig (builder pattern)
 *
 * @param kf - KeyframeConfig to apply pose to
 * @param pose - Martial pose data from MARTIAL_POSES
 *
 * @example
 * ```typescript
 * applyMartialPoseToConfig(kf, MARTIAL_POSES.GUARD);
 * ```
 *
 * @korean KeyframeConfig에무술자세적용
 */
export function applyMartialPoseToConfig(
  kf: KeyframeConfig,
  pose: MartialPose
): void {
  for (const mapping of UPPER_BODY_BONES) {
    const rotation = pose[mapping.poseKey] as readonly [number, number, number];
    if (rotation) {
      kf.rotate(mapping.boneName, rotation[0], rotation[1], rotation[2]);
    }
  }
}

/**
 * Apply martial pose to an AnimationKeyframe (direct mutation)
 *
 * @param kf - AnimationKeyframe to apply pose to
 * @param pose - Martial pose data from MARTIAL_POSES
 *
 * @example
 * ```typescript
 * applyMartialPoseToKeyframe(animKeyframe, MARTIAL_POSES.HIGH_GUARD);
 * ```
 *
 * @korean AnimationKeyframe에무술자세적용
 */
export function applyMartialPoseToKeyframe(
  kf: AnimationKeyframe,
  pose: MartialPose
): void {
  for (const mapping of UPPER_BODY_BONES) {
    const rotation = pose[mapping.poseKey] as readonly [number, number, number];
    if (rotation) {
      kf.boneRotations.set(
        mapping.boneName,
        new THREE.Euler(rotation[0], rotation[1], rotation[2])
      );
    }
  }
}

/**
 * Get a martial pose by name
 *
 * @param poseName - Name of the pose from MARTIAL_POSES
 * @returns The martial pose data
 *
 * @korean 무술자세가져오기
 */
export function getMartialPose(poseName: MartialPoseName): MartialPose {
  return MARTIAL_POSES[poseName];
}
