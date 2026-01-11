/**
 * Keyframe Configuration Helper
 *
 * Helper class for configuring animation keyframes with bone rotations and positions.
 * 애니메이션 키프레임 설정 헬퍼 클래스
 *
 * @module systems/animation/KeyframeConfig
 * @korean 키프레임설정
 */

import * as THREE from "three";
import type { AnimationKeyframe } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";

// Forward declaration for builder type
interface AnimationBuilderLike {
  _addKeyframe(kf: AnimationKeyframe): void;
}

/**
 * Keyframe configuration helper
 *
 * Provides a fluent API for configuring bone rotations and positions
 * within a single keyframe.
 *
 * @example
 * ```typescript
 * const kf = new KeyframeConfig();
 * kf.rotate(BoneName.SHOULDER_R, -0.5, 0, 0.3)
 *   .position(BoneName.HAND_R, 0.1, 0, 0);
 * ```
 *
 * @korean 키프레임설정헬퍼
 */
export class KeyframeConfig {
  /** Bone rotation data (bone -> euler rotation) */
  rotations = new Map<BoneName, THREE.Euler>();

  /** Bone position data (bone -> position offset) */
  positions = new Map<BoneName, THREE.Vector3>();

  /** Parent builder reference for fluent chaining */
  private builder: AnimationBuilderLike | null = null;

  /** Keyframe time */
  private time: number = 0;

  /** Keyframe easing function */
  private easing: string = "linear";

  /**
   * Associate this keyframe with a builder for the `done()` method
   * @internal
   */
  setBuilder(
    builder: AnimationBuilderLike,
    time: number,
    easing: string
  ): void {
    this.builder = builder;
    this.time = time;
    this.easing = easing;
  }

  /**
   * Set bone rotation (euler angles in radians)
   *
   * @param bone - Target bone name
   * @param x - X rotation (radians)
   * @param y - Y rotation (radians)
   * @param z - Z rotation (radians)
   * @returns this for chaining
   *
   * @example
   * ```typescript
   * kf.rotate(BoneName.SHOULDER_R, -0.5, 0, 0.3);
   * ```
   *
   * @korean 뼈회전설정
   */
  rotate(bone: BoneName, x: number, y: number, z: number): this {
    this.rotations.set(bone, new THREE.Euler(x, y, z));
    return this;
  }

  /**
   * Set bone position offset
   *
   * @param bone - Target bone name
   * @param x - X position offset
   * @param y - Y position offset
   * @param z - Z position offset
   * @returns this for chaining
   *
   * @example
   * ```typescript
   * kf.position(BoneName.FOOT_R, 0, 0.5, 0.3);
   * ```
   *
   * @korean 뼈위치설정
   */
  position(bone: BoneName, x: number, y: number, z: number): this {
    this.positions.set(bone, new THREE.Vector3(x, y, z));
    return this;
  }

  /**
   * Complete keyframe configuration and return to builder
   *
   * @returns Parent builder for method chaining
   * @throws Error if not associated with a builder
   *
   * @korean 키프레임완료
   */
  done<T extends AnimationBuilderLike>(): T {
    if (!this.builder) {
      throw new Error("KeyframeConfig not associated with builder");
    }
    this.builder._addKeyframe({
      time: this.time,
      easing: this.easing as "linear" | "ease-in" | "ease-out" | "ease-in-out",
      boneRotations: this.rotations,
      bonePositions: this.positions,
    });
    return this.builder as T;
  }
}
