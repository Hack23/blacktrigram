/**
 * Animation Builder - Fluent API for creating skeletal animations
 *
 * Provides a cleaner, more maintainable way to define animations with
 * reduced boilerplate and better readability.
 *
 * @module systems/animation/AnimationBuilder
 * @category Animation System
 * @korean 애니메이션빌더
 */

import * as THREE from "three";
import type {
  AnimationKeyframe,
  SkeletalAnimation,
} from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";

/**
 * Keyframe builder for fluent keyframe construction
 * @korean 키프레임빌더
 */
class KeyframeBuilder {
  private time: number;
  private easing: string;
  private boneRotations: Map<BoneName, THREE.Euler>;
  private bonePositions: Map<BoneName, THREE.Vector3>;

  constructor(time: number, easing: string = "linear") {
    this.time = time;
    this.easing = easing;
    this.boneRotations = new Map();
    this.bonePositions = new Map();
  }

  /**
   * Add bone rotation to keyframe
   * @param bone - Bone to rotate
   * @param x - X rotation in radians
   * @param y - Y rotation in radians
   * @param z - Z rotation in radians
   * @param order - Rotation order (default: XYZ)
   * @returns This builder for chaining
   */
  rotate(
    bone: BoneName,
    x: number,
    y: number,
    z: number,
    order: THREE.EulerOrder = "XYZ"
  ): this {
    this.boneRotations.set(bone, new THREE.Euler(x, y, z, order));
    return this;
  }

  /**
   * Add bone position to keyframe
   * @param bone - Bone to position
   * @param x - X position
   * @param y - Y position
   * @param z - Z position
   * @returns This builder for chaining
   */
  position(bone: BoneName, x: number, y: number, z: number): this {
    this.bonePositions.set(bone, new THREE.Vector3(x, y, z));
    return this;
  }

  /**
   * Build the keyframe
   * @returns Complete animation keyframe
   */
  build(): AnimationKeyframe {
    return {
      time: this.time,
      easing: this.easing as "linear" | "ease-in" | "ease-out" | "ease-in-out",
      boneRotations: this.boneRotations,
      bonePositions: this.bonePositions,
    };
  }
}

/**
 * Animation builder for fluent animation construction
 * @korean 애니메이션빌더
 */
export class AnimationBuilder {
  private animationName: string;
  private koreanName: string;
  private duration: number;
  private loop: boolean;
  private type: "attack" | "defense" | "movement" | "idle";
  private keyframes: AnimationKeyframe[];

  private constructor(name: string) {
    this.animationName = name;
    this.koreanName = name;
    this.duration = 1.0;
    this.loop = false;
    this.type = "idle";
    this.keyframes = [];
  }

  /**
   * Create a new animation builder
   * @param name - Animation name
   * @returns New animation builder
   */
  static create(name: string): AnimationBuilder {
    return new AnimationBuilder(name);
  }

  /**
   * Set Korean name for animation
   * @param name - Korean name
   * @returns This builder for chaining
   */
  withKoreanName(name: string): this {
    this.koreanName = name;
    return this;
  }

  /**
   * Set animation duration
   * @param seconds - Duration in seconds
   * @returns This builder for chaining
   */
  withDuration(seconds: number): this {
    this.duration = seconds;
    return this;
  }

  /**
   * Set animation loop behavior
   * @param shouldLoop - Whether animation should loop
   * @returns This builder for chaining
   */
  withLoop(shouldLoop: boolean): this {
    this.loop = shouldLoop;
    return this;
  }

  /**
   * Set animation type
   * @param animType - Animation type
   * @returns This builder for chaining
   */
  withType(animType: "attack" | "defense" | "movement" | "idle"): this {
    this.type = animType;
    return this;
  }

  /**
   * Add a keyframe to the animation
   * @param time - Time of keyframe in seconds
   * @param easing - Easing function name
   * @returns Keyframe builder for defining keyframe contents
   */
  keyframe(time: number, easing: string = "linear"): KeyframeBuilder {
    const kfBuilder = new KeyframeBuilder(time, easing);
    const self = this;
    // Override build to add keyframe and return animation builder
    const originalBuild = kfBuilder.build.bind(kfBuilder);
    (kfBuilder.build as any) = function(): AnimationBuilder {
      const kf = originalBuild();
      self.keyframes.push(kf);
      return self;
    };
    return kfBuilder;
  }

  /**
   * Add a pre-built keyframe directly
   * @param keyframe - Complete keyframe
   * @returns This builder for chaining
   */
  addKeyframe(keyframe: AnimationKeyframe): this {
    this.keyframes.push(keyframe);
    return this;
  }

  /**
   * Build the complete animation
   * @returns Complete skeletal animation
   */
  build(): SkeletalAnimation {
    return {
      name: this.animationName,
      koreanName: this.koreanName,
      duration: this.duration,
      loop: this.loop,
      type: this.type,
      keyframes: this.keyframes,
    };
  }
}

/**
 * Common keyframe factories for reusable animation patterns
 * @korean 키프레임팩토리
 */
export class KeyframeFactories {
  /**
   * Create a guard return keyframe (return to defensive position)
   * @param time - Time of keyframe
   * @returns Guard position keyframe
   */
  static guardReturn(time: number): AnimationKeyframe {
    return {
      time,
      easing: "ease-in",
      boneRotations: new Map([
        [BoneName.SHOULDER_R, new THREE.Euler(-0.2, -0.3, -0.3, "XYZ")],
        [BoneName.SHOULDER_L, new THREE.Euler(-0.2, 0.3, 0.3, "XYZ")],
        [BoneName.ELBOW_R, new THREE.Euler(0, 0, 1.2, "XYZ")],
        [BoneName.ELBOW_L, new THREE.Euler(0, 0, -1.2, "XYZ")],
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map([
        [BoneName.HAND_R, new THREE.Vector3(0, 0, 0)],
        [BoneName.HAND_L, new THREE.Vector3(0, 0, 0)],
      ]),
    };
  }

  /**
   * Create a neutral stance keyframe
   * @param time - Time of keyframe
   * @returns Neutral stance keyframe
   */
  static neutralStance(time: number): AnimationKeyframe {
    return {
      time,
      easing: "linear",
      boneRotations: new Map([
        [BoneName.SPINE_UPPER, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.HIP_L, new THREE.Euler(0, 0, 0, "XYZ")],
        [BoneName.HIP_R, new THREE.Euler(0, 0, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    };
  }

  /**
   * Create a torso rotation keyframe
   * @param time - Time of keyframe
   * @param angle - Rotation angle in radians (positive = clockwise)
   * @param easing - Easing function
   * @returns Torso rotation keyframe
   */
  static rotateTorso(
    time: number,
    angle: number,
    easing: "linear" | "ease-in" | "ease-out" | "ease-in-out" = "linear"
  ): AnimationKeyframe {
    return {
      time,
      easing,
      boneRotations: new Map([
        [BoneName.SPINE_UPPER, new THREE.Euler(0, angle, 0, "XYZ")],
        [BoneName.SPINE_MIDDLE, new THREE.Euler(0, angle * 0.75, 0, "XYZ")],
        [BoneName.PELVIS, new THREE.Euler(0, angle * 0.5, 0, "XYZ")],
      ]),
      bonePositions: new Map(),
    };
  }
}

/**
 * Bone rotation helper utilities
 * @korean 뼈회전헬퍼
 */
export class BoneRotationHelpers {
  /**
   * Create shoulder rotation for arm extension
   * @param side - "L" or "R"
   * @param forward - Forward rotation amount
   * @param up - Upward rotation amount
   * @returns Euler rotation
   */
  static shoulderExtension(
    side: "L" | "R",
    forward: number,
    up: number = 0
  ): THREE.Euler {
    const sign = side === "L" ? -1 : 1;
    return new THREE.Euler(up, 0, forward * sign, "XYZ");
  }

  /**
   * Create elbow rotation for arm bend
   * @param side - "L" or "R"
   * @param bend - Bend amount (0 = straight, PI/2 = 90 degrees)
   * @returns Euler rotation
   */
  static elbowBend(side: "L" | "R", bend: number): THREE.Euler {
    const sign = side === "L" ? -1 : 1;
    return new THREE.Euler(0, 0, bend * sign, "XYZ");
  }

  /**
   * Create hip rotation for leg movement
   * @param _side - "L" or "R" (reserved for future asymmetric animations)
   * @param forward - Forward rotation (positive = leg forward)
   * @param outward - Outward rotation (positive = leg out)
   * @returns Euler rotation
   */
  static hipRotation(
    _side: "L" | "R",
    forward: number,
    outward: number = 0
  ): THREE.Euler {
    return new THREE.Euler(forward, outward, 0, "XYZ");
  }

  /**
   * Create knee rotation for leg bend
   * @param _side - "L" or "R" (reserved for future asymmetric animations)
   * @param bend - Bend amount (positive = knee bends)
   * @returns Euler rotation
   */
  static kneeBend(_side: "L" | "R", bend: number): THREE.Euler {
    return new THREE.Euler(0, 0, bend, "XYZ");
  }
}
