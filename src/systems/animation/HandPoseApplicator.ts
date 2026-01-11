/**
 * Hand Pose Application Utilities
 *
 * Utilities for applying hand poses to animation keyframes.
 * 손 모양 적용 유틸리티
 *
 * @module systems/animation/HandPoseApplicator
 * @korean 손모양적용기
 */

import * as THREE from "three";
import type { AnimationKeyframe } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import type { KeyframeConfig } from "./KeyframeConfig";
import { HAND_POSES } from "./MartialArtsConstants";

/** Hand pose type from HAND_POSES constant */
export type HandPose = (typeof HAND_POSES)[keyof typeof HAND_POSES];

/** Which hand(s) to apply a pose to */
export type HandSelection = "left" | "right" | "both";

/**
 * Finger bone mapping for a hand
 * @internal
 */
interface FingerBoneMapping {
  readonly thumb_meta: BoneName;
  readonly thumb_prox: BoneName;
  readonly thumb_dist: BoneName;
  readonly index_meta: BoneName;
  readonly index_prox: BoneName;
  readonly index_inter: BoneName;
  readonly index_dist: BoneName;
  readonly middle_meta: BoneName;
  readonly middle_prox: BoneName;
  readonly middle_inter: BoneName;
  readonly middle_dist: BoneName;
  readonly ring_meta: BoneName;
  readonly ring_prox: BoneName;
  readonly ring_inter: BoneName;
  readonly ring_dist: BoneName;
  readonly pinky_meta: BoneName;
  readonly pinky_prox: BoneName;
  readonly pinky_inter: BoneName;
  readonly pinky_dist: BoneName;
}

/** Left hand bone mapping */
const LEFT_HAND_BONES: FingerBoneMapping = {
  thumb_meta: BoneName.THUMB_META_L,
  thumb_prox: BoneName.THUMB_PROX_L,
  thumb_dist: BoneName.THUMB_DIST_L,
  index_meta: BoneName.INDEX_META_L,
  index_prox: BoneName.INDEX_PROX_L,
  index_inter: BoneName.INDEX_INTER_L,
  index_dist: BoneName.INDEX_DIST_L,
  middle_meta: BoneName.MIDDLE_META_L,
  middle_prox: BoneName.MIDDLE_PROX_L,
  middle_inter: BoneName.MIDDLE_INTER_L,
  middle_dist: BoneName.MIDDLE_DIST_L,
  ring_meta: BoneName.RING_META_L,
  ring_prox: BoneName.RING_PROX_L,
  ring_inter: BoneName.RING_INTER_L,
  ring_dist: BoneName.RING_DIST_L,
  pinky_meta: BoneName.PINKY_META_L,
  pinky_prox: BoneName.PINKY_PROX_L,
  pinky_inter: BoneName.PINKY_INTER_L,
  pinky_dist: BoneName.PINKY_DIST_L,
};

/** Right hand bone mapping */
const RIGHT_HAND_BONES: FingerBoneMapping = {
  thumb_meta: BoneName.THUMB_META_R,
  thumb_prox: BoneName.THUMB_PROX_R,
  thumb_dist: BoneName.THUMB_DIST_R,
  index_meta: BoneName.INDEX_META_R,
  index_prox: BoneName.INDEX_PROX_R,
  index_inter: BoneName.INDEX_INTER_R,
  index_dist: BoneName.INDEX_DIST_R,
  middle_meta: BoneName.MIDDLE_META_R,
  middle_prox: BoneName.MIDDLE_PROX_R,
  middle_inter: BoneName.MIDDLE_INTER_R,
  middle_dist: BoneName.MIDDLE_DIST_R,
  ring_meta: BoneName.RING_META_R,
  ring_prox: BoneName.RING_PROX_R,
  ring_inter: BoneName.RING_INTER_R,
  ring_dist: BoneName.RING_DIST_R,
  pinky_meta: BoneName.PINKY_META_R,
  pinky_prox: BoneName.PINKY_PROX_R,
  pinky_inter: BoneName.PINKY_INTER_R,
  pinky_dist: BoneName.PINKY_DIST_R,
};

/** Finger bone keys in the pose object */
const FINGER_KEYS = [
  "thumb_meta",
  "thumb_prox",
  "thumb_dist",
  "index_meta",
  "index_prox",
  "index_inter",
  "index_dist",
  "middle_meta",
  "middle_prox",
  "middle_inter",
  "middle_dist",
  "ring_meta",
  "ring_prox",
  "ring_inter",
  "ring_dist",
  "pinky_meta",
  "pinky_prox",
  "pinky_inter",
  "pinky_dist",
] as const;

/**
 * Apply hand pose to a KeyframeConfig (builder pattern)
 *
 * @param kf - KeyframeConfig to apply pose to
 * @param pose - Hand pose data from HAND_POSES
 * @param hand - Which hand(s) to apply ("left" | "right" | "both")
 *
 * @example
 * ```typescript
 * applyHandPoseToConfig(kf, HAND_POSES.FIST, "right");
 * ```
 *
 * @korean KeyframeConfig에손모양적용
 */
export function applyHandPoseToConfig(
  kf: KeyframeConfig,
  pose: HandPose,
  hand: HandSelection
): void {
  const applyToHand = (bones: FingerBoneMapping) => {
    for (const key of FINGER_KEYS) {
      const rotation = pose[key];
      kf.rotate(bones[key], rotation[0], rotation[1], rotation[2]);
    }
  };

  if (hand === "left" || hand === "both") {
    applyToHand(LEFT_HAND_BONES);
  }
  if (hand === "right" || hand === "both") {
    applyToHand(RIGHT_HAND_BONES);
  }
}

/**
 * Apply hand pose to an AnimationKeyframe (direct mutation)
 *
 * @param kf - AnimationKeyframe to apply pose to
 * @param pose - Hand pose data from HAND_POSES
 * @param hand - Which hand(s) to apply ("left" | "right" | "both")
 *
 * @example
 * ```typescript
 * applyHandPoseToKeyframe(animKeyframe, HAND_POSES.GRAB, "both");
 * ```
 *
 * @korean AnimationKeyframe에손모양적용
 */
export function applyHandPoseToKeyframe(
  kf: AnimationKeyframe,
  pose: HandPose,
  hand: HandSelection
): void {
  const applyToHand = (bones: FingerBoneMapping) => {
    for (const key of FINGER_KEYS) {
      const rotation = pose[key];
      kf.boneRotations.set(
        bones[key],
        new THREE.Euler(rotation[0], rotation[1], rotation[2])
      );
    }
  };

  if (hand === "left" || hand === "both") {
    applyToHand(LEFT_HAND_BONES);
  }
  if (hand === "right" || hand === "both") {
    applyToHand(RIGHT_HAND_BONES);
  }
}

/**
 * Get a hand pose by name
 *
 * @param poseName - Name of the pose from HAND_POSES
 * @returns The hand pose data
 *
 * @korean 손모양가져오기
 */
export function getHandPose(poseName: keyof typeof HAND_POSES): HandPose {
  return HAND_POSES[poseName];
}
