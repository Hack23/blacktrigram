/**
 * Keyframe Configuration Helper
 *
 * Helper class for configuring animation keyframes with bone rotations, positions,
 * and integrated anatomy state (hands, feet, facial expressions, muscle activations).
 * 애니메이션 키프레임 설정 헬퍼 클래스 (해부학 상태 통합)
 *
 * @module systems/animation/KeyframeConfig
 * @korean 키프레임설정
 */

import type { AnimationKeyframe, SkeletalAnimation } from "@/types/skeletal";
import { BoneName } from "@/types/skeletal";
import * as THREE from "three";
import type { GuardPositionType } from "./KoreanGuardPositions";
import { getGuardPosition } from "./KoreanGuardPositions";

/** Hand highlight mode for striking surface visualization */
export type HandHighlightMode =
  | "none"
  | "knuckles"
  | "palm"
  | "knife_edge"
  | "fingertips";

// Forward declaration for builder type
interface AnimationBuilderLike {
  _addKeyframe(kf: AnimationKeyframe): void;
  at(time: number, easing?: string): KeyframeConfig;
  build(): SkeletalAnimation;
}

/**
 * Keyframe configuration helper
 *
 * Provides a fluent API for configuring bone rotations, positions,
 * and anatomy state (hands, feet, facial expressions) within a single keyframe.
 *
 * @example
 * ```typescript
 * const kf = new KeyframeConfig();
 * kf.rotate(BoneName.SHOULDER_R, -0.5, 0, 0.3)
 *   .position(BoneName.HAND_R, 0.1, 0, 0)
 *   .setLeftHandPose("fist")
 *   .setRightHandPose("fist", "knuckles")
 *   .setFootHighlight("right", true)
 *   .setFacialExpression("focused");
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

  // ═══════════════════════════════════════════════════════════════════════════
  // ANATOMY STATE (해부학 상태) - Integrated hand, foot, and facial animation
  // ═══════════════════════════════════════════════════════════════════════════

  /** Left hand pose type */
  private _leftHandPose?: string;

  /** Right hand pose type */
  private _rightHandPose?: string;

  /** Left hand highlight mode */
  private _leftHandHighlightMode?: HandHighlightMode;

  /** Right hand highlight mode */
  private _rightHandHighlightMode?: HandHighlightMode;

  /** Left foot highlight state */
  private _leftFootHighlight?: boolean;

  /** Right foot highlight state */
  private _rightFootHighlight?: boolean;

  /** Facial expression */
  private _facialExpression?: string;

  /** Muscle activation targets */
  private _muscleActivations?: Map<string, number>;

  /**
   * Associate this keyframe with a builder for the `done()` method
   * @internal
   */
  setBuilder(
    builder: AnimationBuilderLike,
    time: number,
    easing: string,
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
   * Apply Korean guard position to arms
   *
   * Sets proper Korean martial arts guard positions (막기자세) for defensive posture.
   * Supports applying guard to one side or both sides.
   *
   * @param guardType - Type of guard ("HIGH_GUARD" | "MIDDLE_GUARD" | "LOW_GUARD")
   * @param side - Which side to apply ("left" | "right" | "both")
   * @returns this for chaining
   *
   * @example
   * ```typescript
   * // Apply middle guard to both hands
   * kf.withGuard("MIDDLE_GUARD");
   *
   * // Apply middle guard only to left hand (right hand attacks)
   * kf.withGuard("MIDDLE_GUARD", "left");
   * ```
   *
   * @korean 방어자세적용
   */
  withGuard(
    guardType: GuardPositionType,
    side: "left" | "right" | "both" = "both",
  ): this {
    const guard = getGuardPosition(guardType);

    if (side === "left" || side === "both") {
      this.rotate(
        BoneName.SHOULDER_L,
        guard.left.shoulder[0],
        guard.left.shoulder[1],
        guard.left.shoulder[2],
      );
      this.rotate(
        BoneName.ELBOW_L,
        guard.left.elbow[0],
        guard.left.elbow[1],
        guard.left.elbow[2],
      );
      this.rotate(
        BoneName.WRIST_L,
        guard.left.wrist[0],
        guard.left.wrist[1],
        guard.left.wrist[2],
      );
    }

    if (side === "right" || side === "both") {
      this.rotate(
        BoneName.SHOULDER_R,
        guard.right.shoulder[0],
        guard.right.shoulder[1],
        guard.right.shoulder[2],
      );
      this.rotate(
        BoneName.ELBOW_R,
        guard.right.elbow[0],
        guard.right.elbow[1],
        guard.right.elbow[2],
      );
      this.rotate(
        BoneName.WRIST_R,
        guard.right.wrist[0],
        guard.right.wrist[1],
        guard.right.wrist[2],
      );
    }

    return this;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ANATOMY STATE SETTERS (해부학 상태 설정)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Set left hand pose for this keyframe
   *
   * @param pose - Hand pose type (e.g., "fist", "knife_hand", "open")
   * @param highlightMode - Optional highlight mode for striking surface
   * @returns this for chaining
   *
   * @korean 왼손자세설정
   */
  setLeftHandPose(pose: string, highlightMode?: HandHighlightMode): this {
    this._leftHandPose = pose;
    if (highlightMode) {
      this._leftHandHighlightMode = highlightMode;
    }
    return this;
  }

  /**
   * Set right hand pose for this keyframe
   *
   * @param pose - Hand pose type (e.g., "fist", "knife_hand", "open")
   * @param highlightMode - Optional highlight mode for striking surface
   * @returns this for chaining
   *
   * @korean 오른손자세설정
   */
  setRightHandPose(pose: string, highlightMode?: HandHighlightMode): this {
    this._rightHandPose = pose;
    if (highlightMode) {
      this._rightHandHighlightMode = highlightMode;
    }
    return this;
  }

  /**
   * Set both hands to the same pose
   *
   * @param pose - Hand pose type for both hands
   * @returns this for chaining
   *
   * @korean 양손자세설정
   */
  setBothHandPoses(pose: string): this {
    this._leftHandPose = pose;
    this._rightHandPose = pose;
    return this;
  }

  /**
   * Set foot highlight state for kicks
   *
   * @param side - Which foot ("left" | "right" | "both")
   * @param highlighted - Whether to highlight
   * @returns this for chaining
   *
   * @korean 발강조설정
   */
  setFootHighlight(
    side: "left" | "right" | "both",
    highlighted: boolean,
  ): this {
    if (side === "left" || side === "both") {
      this._leftFootHighlight = highlighted;
    }
    if (side === "right" || side === "both") {
      this._rightFootHighlight = highlighted;
    }
    return this;
  }

  /**
   * Set facial expression for this keyframe
   *
   * @param expression - Facial expression (e.g., "neutral", "focused", "pained")
   * @returns this for chaining
   *
   * @korean 얼굴표정설정
   */
  setFacialExpression(expression: string): this {
    this._facialExpression = expression;
    return this;
  }

  /**
   * Set muscle activation target for this keyframe
   *
   * @param muscleGroup - Muscle group name (e.g., "BICEP_R", "QUAD_L")
   * @param tension - Tension level (0-1)
   * @returns this for chaining
   *
   * @korean 근육활성화설정
   */
  setMuscleActivation(muscleGroup: string, tension: number): this {
    this._muscleActivations ??= new Map();
    this._muscleActivations.set(muscleGroup, Math.max(0, Math.min(1, tension)));
    return this;
  }

  /**
   * Set multiple muscle activations at once
   *
   * @param activations - Map or object of muscle group to tension
   * @returns this for chaining
   *
   * @korean 다중근육활성화설정
   */
  setMuscleActivations(
    activations: Map<string, number> | Record<string, number>,
  ): this {
    this._muscleActivations ??= new Map();
    if (activations instanceof Map) {
      activations.forEach((tension, group) => {
        this._muscleActivations!.set(group, Math.max(0, Math.min(1, tension)));
      });
    } else {
      Object.entries(activations).forEach(([group, tension]) => {
        this._muscleActivations!.set(group, Math.max(0, Math.min(1, tension)));
      });
    }
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
      // Anatomy state
      leftHandPose: this._leftHandPose,
      rightHandPose: this._rightHandPose,
      leftHandHighlightMode: this._leftHandHighlightMode,
      rightHandHighlightMode: this._rightHandHighlightMode,
      leftFootHighlight: this._leftFootHighlight,
      rightFootHighlight: this._rightFootHighlight,
      facialExpression: this._facialExpression,
      muscleActivations: this._muscleActivations,
    });
    return this.builder as T;
  }
}
