/**
 * Hand Pose Application Utilities
 *
 * Helper functions to apply hand poses to animation keyframes.
 * Used by MartialArtsAnimationBuilder to set finger bone rotations.
 *
 * 손 자세 적용 유틸리티 - 애니메이션 키프레임에 손가락 자세 적용
 *
 * @module systems/animation/HandPoseUtils
 * @category Animation System
 * @korean 손자세유틸리티
 */

import * as THREE from "three";
import type { AnimationKeyframe } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import { HAND_POSES, type HandPoseType } from "./MartialArtsConstants";

/**
 * Interface for keyframe config with rotate method
 */
export interface KeyframeConfigLike {
  rotate(bone: BoneName, x: number, y: number, z: number): this;
}

/**
 * Apply hand pose to a KeyframeConfig during keyframe building
 *
 * @param kf The keyframe config to apply the pose to
 * @param pose The hand pose definition
 * @param hand Which hand(s) to apply to
 * @korean 키프레임빌더손자세적용
 */
export function applyHandPoseToConfig(
  kf: KeyframeConfigLike,
  pose: HandPoseType,
  hand: "left" | "right" | "both"
): void {
  const applyLeft = hand === "left" || hand === "both";
  const applyRight = hand === "right" || hand === "both";

  if (applyLeft) {
    kf.rotate(
      BoneName.THUMB_META_L,
      pose.thumb_meta[0],
      pose.thumb_meta[1],
      pose.thumb_meta[2]
    );
    kf.rotate(
      BoneName.THUMB_PROX_L,
      pose.thumb_prox[0],
      pose.thumb_prox[1],
      pose.thumb_prox[2]
    );
    kf.rotate(
      BoneName.THUMB_DIST_L,
      pose.thumb_dist[0],
      pose.thumb_dist[1],
      pose.thumb_dist[2]
    );
    kf.rotate(
      BoneName.INDEX_META_L,
      pose.index_meta[0],
      pose.index_meta[1],
      pose.index_meta[2]
    );
    kf.rotate(
      BoneName.INDEX_PROX_L,
      pose.index_prox[0],
      pose.index_prox[1],
      pose.index_prox[2]
    );
    kf.rotate(
      BoneName.INDEX_INTER_L,
      pose.index_inter[0],
      pose.index_inter[1],
      pose.index_inter[2]
    );
    kf.rotate(
      BoneName.INDEX_DIST_L,
      pose.index_dist[0],
      pose.index_dist[1],
      pose.index_dist[2]
    );
    kf.rotate(
      BoneName.MIDDLE_META_L,
      pose.middle_meta[0],
      pose.middle_meta[1],
      pose.middle_meta[2]
    );
    kf.rotate(
      BoneName.MIDDLE_PROX_L,
      pose.middle_prox[0],
      pose.middle_prox[1],
      pose.middle_prox[2]
    );
    kf.rotate(
      BoneName.MIDDLE_INTER_L,
      pose.middle_inter[0],
      pose.middle_inter[1],
      pose.middle_inter[2]
    );
    kf.rotate(
      BoneName.MIDDLE_DIST_L,
      pose.middle_dist[0],
      pose.middle_dist[1],
      pose.middle_dist[2]
    );
    kf.rotate(
      BoneName.RING_META_L,
      pose.ring_meta[0],
      pose.ring_meta[1],
      pose.ring_meta[2]
    );
    kf.rotate(
      BoneName.RING_PROX_L,
      pose.ring_prox[0],
      pose.ring_prox[1],
      pose.ring_prox[2]
    );
    kf.rotate(
      BoneName.RING_INTER_L,
      pose.ring_inter[0],
      pose.ring_inter[1],
      pose.ring_inter[2]
    );
    kf.rotate(
      BoneName.RING_DIST_L,
      pose.ring_dist[0],
      pose.ring_dist[1],
      pose.ring_dist[2]
    );
    kf.rotate(
      BoneName.PINKY_META_L,
      pose.pinky_meta[0],
      pose.pinky_meta[1],
      pose.pinky_meta[2]
    );
    kf.rotate(
      BoneName.PINKY_PROX_L,
      pose.pinky_prox[0],
      pose.pinky_prox[1],
      pose.pinky_prox[2]
    );
    kf.rotate(
      BoneName.PINKY_INTER_L,
      pose.pinky_inter[0],
      pose.pinky_inter[1],
      pose.pinky_inter[2]
    );
    kf.rotate(
      BoneName.PINKY_DIST_L,
      pose.pinky_dist[0],
      pose.pinky_dist[1],
      pose.pinky_dist[2]
    );
  }

  if (applyRight) {
    kf.rotate(
      BoneName.THUMB_META_R,
      pose.thumb_meta[0],
      pose.thumb_meta[1],
      pose.thumb_meta[2]
    );
    kf.rotate(
      BoneName.THUMB_PROX_R,
      pose.thumb_prox[0],
      pose.thumb_prox[1],
      pose.thumb_prox[2]
    );
    kf.rotate(
      BoneName.THUMB_DIST_R,
      pose.thumb_dist[0],
      pose.thumb_dist[1],
      pose.thumb_dist[2]
    );
    kf.rotate(
      BoneName.INDEX_META_R,
      pose.index_meta[0],
      pose.index_meta[1],
      pose.index_meta[2]
    );
    kf.rotate(
      BoneName.INDEX_PROX_R,
      pose.index_prox[0],
      pose.index_prox[1],
      pose.index_prox[2]
    );
    kf.rotate(
      BoneName.INDEX_INTER_R,
      pose.index_inter[0],
      pose.index_inter[1],
      pose.index_inter[2]
    );
    kf.rotate(
      BoneName.INDEX_DIST_R,
      pose.index_dist[0],
      pose.index_dist[1],
      pose.index_dist[2]
    );
    kf.rotate(
      BoneName.MIDDLE_META_R,
      pose.middle_meta[0],
      pose.middle_meta[1],
      pose.middle_meta[2]
    );
    kf.rotate(
      BoneName.MIDDLE_PROX_R,
      pose.middle_prox[0],
      pose.middle_prox[1],
      pose.middle_prox[2]
    );
    kf.rotate(
      BoneName.MIDDLE_INTER_R,
      pose.middle_inter[0],
      pose.middle_inter[1],
      pose.middle_inter[2]
    );
    kf.rotate(
      BoneName.MIDDLE_DIST_R,
      pose.middle_dist[0],
      pose.middle_dist[1],
      pose.middle_dist[2]
    );
    kf.rotate(
      BoneName.RING_META_R,
      pose.ring_meta[0],
      pose.ring_meta[1],
      pose.ring_meta[2]
    );
    kf.rotate(
      BoneName.RING_PROX_R,
      pose.ring_prox[0],
      pose.ring_prox[1],
      pose.ring_prox[2]
    );
    kf.rotate(
      BoneName.RING_INTER_R,
      pose.ring_inter[0],
      pose.ring_inter[1],
      pose.ring_inter[2]
    );
    kf.rotate(
      BoneName.RING_DIST_R,
      pose.ring_dist[0],
      pose.ring_dist[1],
      pose.ring_dist[2]
    );
    kf.rotate(
      BoneName.PINKY_META_R,
      pose.pinky_meta[0],
      pose.pinky_meta[1],
      pose.pinky_meta[2]
    );
    kf.rotate(
      BoneName.PINKY_PROX_R,
      pose.pinky_prox[0],
      pose.pinky_prox[1],
      pose.pinky_prox[2]
    );
    kf.rotate(
      BoneName.PINKY_INTER_R,
      pose.pinky_inter[0],
      pose.pinky_inter[1],
      pose.pinky_inter[2]
    );
    kf.rotate(
      BoneName.PINKY_DIST_R,
      pose.pinky_dist[0],
      pose.pinky_dist[1],
      pose.pinky_dist[2]
    );
  }
}

/**
 * Apply hand pose directly to an AnimationKeyframe
 *
 * @param kf The keyframe to modify
 * @param pose The hand pose definition
 * @param hand Which hand(s) to apply to
 * @korean 키프레임손자세적용
 */
export function applyHandPoseToKeyframe(
  kf: AnimationKeyframe,
  pose: HandPoseType,
  hand: "left" | "right" | "both"
): void {
  const applyLeft = hand === "left" || hand === "both";
  const applyRight = hand === "right" || hand === "both";

  if (applyLeft) {
    kf.boneRotations.set(
      BoneName.THUMB_META_L,
      new THREE.Euler(
        pose.thumb_meta[0],
        pose.thumb_meta[1],
        pose.thumb_meta[2]
      )
    );
    kf.boneRotations.set(
      BoneName.THUMB_PROX_L,
      new THREE.Euler(
        pose.thumb_prox[0],
        pose.thumb_prox[1],
        pose.thumb_prox[2]
      )
    );
    kf.boneRotations.set(
      BoneName.THUMB_DIST_L,
      new THREE.Euler(
        pose.thumb_dist[0],
        pose.thumb_dist[1],
        pose.thumb_dist[2]
      )
    );
    kf.boneRotations.set(
      BoneName.INDEX_META_L,
      new THREE.Euler(
        pose.index_meta[0],
        pose.index_meta[1],
        pose.index_meta[2]
      )
    );
    kf.boneRotations.set(
      BoneName.INDEX_PROX_L,
      new THREE.Euler(
        pose.index_prox[0],
        pose.index_prox[1],
        pose.index_prox[2]
      )
    );
    kf.boneRotations.set(
      BoneName.INDEX_INTER_L,
      new THREE.Euler(
        pose.index_inter[0],
        pose.index_inter[1],
        pose.index_inter[2]
      )
    );
    kf.boneRotations.set(
      BoneName.INDEX_DIST_L,
      new THREE.Euler(
        pose.index_dist[0],
        pose.index_dist[1],
        pose.index_dist[2]
      )
    );
    kf.boneRotations.set(
      BoneName.MIDDLE_META_L,
      new THREE.Euler(
        pose.middle_meta[0],
        pose.middle_meta[1],
        pose.middle_meta[2]
      )
    );
    kf.boneRotations.set(
      BoneName.MIDDLE_PROX_L,
      new THREE.Euler(
        pose.middle_prox[0],
        pose.middle_prox[1],
        pose.middle_prox[2]
      )
    );
    kf.boneRotations.set(
      BoneName.MIDDLE_INTER_L,
      new THREE.Euler(
        pose.middle_inter[0],
        pose.middle_inter[1],
        pose.middle_inter[2]
      )
    );
    kf.boneRotations.set(
      BoneName.MIDDLE_DIST_L,
      new THREE.Euler(
        pose.middle_dist[0],
        pose.middle_dist[1],
        pose.middle_dist[2]
      )
    );
    kf.boneRotations.set(
      BoneName.RING_META_L,
      new THREE.Euler(pose.ring_meta[0], pose.ring_meta[1], pose.ring_meta[2])
    );
    kf.boneRotations.set(
      BoneName.RING_PROX_L,
      new THREE.Euler(pose.ring_prox[0], pose.ring_prox[1], pose.ring_prox[2])
    );
    kf.boneRotations.set(
      BoneName.RING_INTER_L,
      new THREE.Euler(
        pose.ring_inter[0],
        pose.ring_inter[1],
        pose.ring_inter[2]
      )
    );
    kf.boneRotations.set(
      BoneName.RING_DIST_L,
      new THREE.Euler(pose.ring_dist[0], pose.ring_dist[1], pose.ring_dist[2])
    );
    kf.boneRotations.set(
      BoneName.PINKY_META_L,
      new THREE.Euler(
        pose.pinky_meta[0],
        pose.pinky_meta[1],
        pose.pinky_meta[2]
      )
    );
    kf.boneRotations.set(
      BoneName.PINKY_PROX_L,
      new THREE.Euler(
        pose.pinky_prox[0],
        pose.pinky_prox[1],
        pose.pinky_prox[2]
      )
    );
    kf.boneRotations.set(
      BoneName.PINKY_INTER_L,
      new THREE.Euler(
        pose.pinky_inter[0],
        pose.pinky_inter[1],
        pose.pinky_inter[2]
      )
    );
    kf.boneRotations.set(
      BoneName.PINKY_DIST_L,
      new THREE.Euler(
        pose.pinky_dist[0],
        pose.pinky_dist[1],
        pose.pinky_dist[2]
      )
    );
  }

  if (applyRight) {
    kf.boneRotations.set(
      BoneName.THUMB_META_R,
      new THREE.Euler(
        pose.thumb_meta[0],
        pose.thumb_meta[1],
        pose.thumb_meta[2]
      )
    );
    kf.boneRotations.set(
      BoneName.THUMB_PROX_R,
      new THREE.Euler(
        pose.thumb_prox[0],
        pose.thumb_prox[1],
        pose.thumb_prox[2]
      )
    );
    kf.boneRotations.set(
      BoneName.THUMB_DIST_R,
      new THREE.Euler(
        pose.thumb_dist[0],
        pose.thumb_dist[1],
        pose.thumb_dist[2]
      )
    );
    kf.boneRotations.set(
      BoneName.INDEX_META_R,
      new THREE.Euler(
        pose.index_meta[0],
        pose.index_meta[1],
        pose.index_meta[2]
      )
    );
    kf.boneRotations.set(
      BoneName.INDEX_PROX_R,
      new THREE.Euler(
        pose.index_prox[0],
        pose.index_prox[1],
        pose.index_prox[2]
      )
    );
    kf.boneRotations.set(
      BoneName.INDEX_INTER_R,
      new THREE.Euler(
        pose.index_inter[0],
        pose.index_inter[1],
        pose.index_inter[2]
      )
    );
    kf.boneRotations.set(
      BoneName.INDEX_DIST_R,
      new THREE.Euler(
        pose.index_dist[0],
        pose.index_dist[1],
        pose.index_dist[2]
      )
    );
    kf.boneRotations.set(
      BoneName.MIDDLE_META_R,
      new THREE.Euler(
        pose.middle_meta[0],
        pose.middle_meta[1],
        pose.middle_meta[2]
      )
    );
    kf.boneRotations.set(
      BoneName.MIDDLE_PROX_R,
      new THREE.Euler(
        pose.middle_prox[0],
        pose.middle_prox[1],
        pose.middle_prox[2]
      )
    );
    kf.boneRotations.set(
      BoneName.MIDDLE_INTER_R,
      new THREE.Euler(
        pose.middle_inter[0],
        pose.middle_inter[1],
        pose.middle_inter[2]
      )
    );
    kf.boneRotations.set(
      BoneName.MIDDLE_DIST_R,
      new THREE.Euler(
        pose.middle_dist[0],
        pose.middle_dist[1],
        pose.middle_dist[2]
      )
    );
    kf.boneRotations.set(
      BoneName.RING_META_R,
      new THREE.Euler(pose.ring_meta[0], pose.ring_meta[1], pose.ring_meta[2])
    );
    kf.boneRotations.set(
      BoneName.RING_PROX_R,
      new THREE.Euler(pose.ring_prox[0], pose.ring_prox[1], pose.ring_prox[2])
    );
    kf.boneRotations.set(
      BoneName.RING_INTER_R,
      new THREE.Euler(
        pose.ring_inter[0],
        pose.ring_inter[1],
        pose.ring_inter[2]
      )
    );
    kf.boneRotations.set(
      BoneName.RING_DIST_R,
      new THREE.Euler(pose.ring_dist[0], pose.ring_dist[1], pose.ring_dist[2])
    );
    kf.boneRotations.set(
      BoneName.PINKY_META_R,
      new THREE.Euler(
        pose.pinky_meta[0],
        pose.pinky_meta[1],
        pose.pinky_meta[2]
      )
    );
    kf.boneRotations.set(
      BoneName.PINKY_PROX_R,
      new THREE.Euler(
        pose.pinky_prox[0],
        pose.pinky_prox[1],
        pose.pinky_prox[2]
      )
    );
    kf.boneRotations.set(
      BoneName.PINKY_INTER_R,
      new THREE.Euler(
        pose.pinky_inter[0],
        pose.pinky_inter[1],
        pose.pinky_inter[2]
      )
    );
    kf.boneRotations.set(
      BoneName.PINKY_DIST_R,
      new THREE.Euler(
        pose.pinky_dist[0],
        pose.pinky_dist[1],
        pose.pinky_dist[2]
      )
    );
  }
}

/**
 * Get a hand pose by name
 * @param name The pose name
 * @returns The hand pose definition
 * @korean 이름으로손자세가져오기
 */
export function getHandPose(name: keyof typeof HAND_POSES): HandPoseType {
  return HAND_POSES[name];
}
