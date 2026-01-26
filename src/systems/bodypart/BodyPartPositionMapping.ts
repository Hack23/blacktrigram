/**
 * Body Part Position Mapping Utilities
 * 
 * **Korean**: 신체 부위 위치 매핑 유틸리티
 * 
 * Maps body regions and body parts to 3D positions on character models
 * for accurate trauma visualization placement.
 * 
 * @module systems/bodypart/BodyPartPositionMapping
 * @category Body Part System
 * @korean 신체부위위치매핑
 */

import * as THREE from "three";
import { BodyPart } from "./types";
import { BodyRegion } from "../../types/common";

/**
 * Standard character model dimensions.
 * 
 * Based on average human proportions scaled for game character.
 * Character center is at [0, 0, 0], standing upright.
 */
export const CHARACTER_DIMENSIONS = {
  /** Total height from feet to head */
  HEIGHT: 2.0,
  /** Width at shoulders */
  SHOULDER_WIDTH: 0.6,
  /** Torso height */
  TORSO_HEIGHT: 0.8,
  /** Leg length */
  LEG_LENGTH: 1.0,
  /** Arm length */
  ARM_LENGTH: 0.7,
  /** Head height */
  HEAD_HEIGHT: 0.3,
} as const;

/**
 * Get 3D position for a body part on character model.
 * 
 * **Korean**: 신체 부위 3D 위치 가져오기
 * 
 * Returns center position of the body part relative to character origin.
 * Character is centered at [0, 0, 0] standing upright.
 * Positions are calculated from CHARACTER_DIMENSIONS for consistency.
 * 
 * @param bodyPart - Body part to get position for
 * @returns 3D position vector
 * 
 * @public
 */
export function getBodyPartPosition(bodyPart: BodyPart): THREE.Vector3 {
  // Calculate positions from CHARACTER_DIMENSIONS
  const headY = CHARACTER_DIMENSIONS.HEIGHT - CHARACTER_DIMENSIONS.HEAD_HEIGHT / 2;
  const neckY = CHARACTER_DIMENSIONS.HEIGHT - CHARACTER_DIMENSIONS.HEAD_HEIGHT;
  const torsoTop = neckY - CHARACTER_DIMENSIONS.TORSO_HEIGHT / 3;
  const torsoBottom = neckY - (2 * CHARACTER_DIMENSIONS.TORSO_HEIGHT) / 3;
  const armY = neckY - CHARACTER_DIMENSIONS.TORSO_HEIGHT / 3;
  const legY = CHARACTER_DIMENSIONS.LEG_LENGTH / 2;
  
  switch (bodyPart) {
    case BodyPart.HEAD:
      return new THREE.Vector3(0, headY, 0);

    case BodyPart.NECK:
      return new THREE.Vector3(0, neckY, 0);

    case BodyPart.TORSO_UPPER:
      return new THREE.Vector3(0, torsoTop, 0);

    case BodyPart.TORSO_LOWER:
      return new THREE.Vector3(0, torsoBottom, 0);

    case BodyPart.ARM_LEFT:
      return new THREE.Vector3(-CHARACTER_DIMENSIONS.SHOULDER_WIDTH / 2, armY, 0);

    case BodyPart.ARM_RIGHT:
      return new THREE.Vector3(CHARACTER_DIMENSIONS.SHOULDER_WIDTH / 2, armY, 0);

    case BodyPart.LEG_LEFT:
      return new THREE.Vector3(-CHARACTER_DIMENSIONS.SHOULDER_WIDTH / 4, legY, 0);

    case BodyPart.LEG_RIGHT:
      return new THREE.Vector3(CHARACTER_DIMENSIONS.SHOULDER_WIDTH / 4, legY, 0);

    default:
      // Default to torso center
      return new THREE.Vector3(0, CHARACTER_DIMENSIONS.HEIGHT / 2, 0);
  }
}

/**
 * Get 3D position for a body region on character model.
 * 
 * **Korean**: 신체 영역 3D 위치 가져오기
 * 
 * @param bodyRegion - Body region to get position for
 * @returns 3D position vector
 * 
 * @public
 */
export function getBodyRegionPosition(bodyRegion: BodyRegion): THREE.Vector3 {
  switch (bodyRegion) {
    case BodyRegion.HEAD:
      return new THREE.Vector3(0, 1.8, 0);

    case BodyRegion.NECK:
      return new THREE.Vector3(0, 1.6, 0);

    case BodyRegion.TORSO:
      return new THREE.Vector3(0, 1.2, 0);

    case BodyRegion.CORE:
      return new THREE.Vector3(0, 0.9, 0);

    case BodyRegion.LEFT_ARM:
      return new THREE.Vector3(-0.4, 1.2, 0);

    case BodyRegion.RIGHT_ARM:
      return new THREE.Vector3(0.4, 1.2, 0);

    case BodyRegion.LEFT_LEG:
      return new THREE.Vector3(-0.15, 0.4, 0);

    case BodyRegion.RIGHT_LEG:
      return new THREE.Vector3(0.15, 0.4, 0);

    default:
      // Default to torso center
      return new THREE.Vector3(0, 1.0, 0);
  }
}

/**
 * Map BodyRegion to corresponding BodyPart.
 * 
 * **Korean**: 신체 영역을 신체 부위로 매핑
 * 
 * @param bodyRegion - Body region to map
 * @returns Corresponding body part
 * 
 * @public
 */
export function mapBodyRegionToBodyPart(bodyRegion: BodyRegion): BodyPart {
  switch (bodyRegion) {
    case BodyRegion.HEAD:
      return BodyPart.HEAD;

    case BodyRegion.NECK:
      return BodyPart.NECK;

    case BodyRegion.TORSO:
      return BodyPart.TORSO_UPPER;

    case BodyRegion.CORE:
      return BodyPart.TORSO_LOWER;

    case BodyRegion.LEFT_ARM:
      return BodyPart.ARM_LEFT;

    case BodyRegion.RIGHT_ARM:
      return BodyPart.ARM_RIGHT;

    case BodyRegion.LEFT_LEG:
      return BodyPart.LEG_LEFT;

    case BodyRegion.RIGHT_LEG:
      return BodyPart.LEG_RIGHT;

    default:
      // Default to upper torso
      return BodyPart.TORSO_UPPER;
  }
}

/**
 * Add random offset to position for varied injury placement.
 * 
 * **Korean**: 부상 위치에 무작위 오프셋 추가
 * 
 * Adds slight randomness to injury positions to avoid exact overlap
 * and create more realistic trauma distribution.
 * 
 * @param basePosition - Base position to offset from
 * @param maxOffset - Maximum offset in any direction (default: 0.1)
 * @returns New position with random offset
 * 
 * @public
 */
export function addRandomOffset(
  basePosition: THREE.Vector3,
  maxOffset: number = 0.1
): THREE.Vector3 {
  const offset = new THREE.Vector3(
    (Math.random() - 0.5) * maxOffset * 2,
    (Math.random() - 0.5) * maxOffset * 2,
    (Math.random() - 0.5) * maxOffset * 2
  );

  return basePosition.clone().add(offset);
}

/**
 * Get injury position with slight randomization.
 * 
 * **Korean**: 무작위 오프셋이 포함된 부상 위치 가져오기
 * 
 * Convenience function that combines region-to-position mapping
 * with random offset for natural injury placement.
 * 
 * @param bodyRegion - Body region that was hit
 * @param maxOffset - Maximum offset for randomization
 * @returns Position with random offset
 * 
 * @public
 */
export function getInjuryPositionWithOffset(
  bodyRegion: BodyRegion,
  maxOffset: number = 0.1
): THREE.Vector3 {
  const basePosition = getBodyRegionPosition(bodyRegion);
  return addRandomOffset(basePosition, maxOffset);
}

/**
 * Check if position is within body part bounds.
 * 
 * **Korean**: 위치가 신체 부위 경계 내에 있는지 확인
 * 
 * @param position - Position to check
 * @param bodyPart - Body part to check against
 * @param tolerance - Distance tolerance (default: 0.3)
 * @returns Whether position is within body part bounds
 * 
 * @public
 */
export function isPositionInBodyPart(
  position: THREE.Vector3,
  bodyPart: BodyPart,
  tolerance: number = 0.3
): boolean {
  const partPosition = getBodyPartPosition(bodyPart);
  const distance = position.distanceTo(partPosition);
  return distance <= tolerance;
}
