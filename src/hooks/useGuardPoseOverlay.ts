/**
 * useGuardPoseOverlay - Shared hook for stance guard pose application
 *
 * Manages guard pose overlay application on top of base animations.
 * Reduces code duplication in skeletal animation components.
 *
 * @module hooks/useGuardPoseOverlay
 * @category Hooks
 * @korean 방어자세오버레이훅
 */

import { useRef } from "react";
import * as THREE from "three";
import { getGuardPoseForStance } from "../systems/animation";
import type { StanceLaterality } from "../systems/trigram/types";
import { TrigramStance } from "../types/common";
import type { PlayerAnimation } from "../types/player-visual";
import type { SkeletalRig } from "../types/skeletal";

/**
 * Blend factor for torso rotation during guard overlay
 *
 * This value is multiplied by the main `blendFactor` argument used for the
 * stance guard overlay. For example, when `blendFactor` is 1.0 (full guard),
 * the effective torso guard influence becomes `1.0 * 0.8 = 0.8`, allowing
 * approximately 20% of the base animation (walk/idle) torso movement to show
 * through. Keep this lower than 1.0 to preserve some natural torso motion
 * while still maintaining a visible guard posture.
 *
 * @korean 방어자세가몸통에적용되는비율을줄이는추가스케일계수
 */
const TORSO_BLEND_FACTOR = 0.8;

/**
 * Base hip offset in skeleton rig (X position from pelvis center)
 * From SkeletonRig.ts: hip_L at [-0.1, ...], hip_R at [0.1, ...]
 * Increased to make stance width visually more dramatic
 * @korean 기본고관절오프셋
 */
const BASE_HIP_OFFSET_X = 0.15;

/**
 * Default stance width (neutral standing)
 * stanceWidth = 1.0 means shoulder width (standard)
 * @korean 기본자세너비
 */
const DEFAULT_STANCE_WIDTH = 1.0;

/**
 * Amplification factor for knee bend angles
 * Makes knee bends more visually pronounced
 * @korean 무릎굽힘증폭계수
 */
const KNEE_BEND_AMPLIFICATION = 1.5;

/**
 * Get dynamic guard blend factor for natural movement while maintaining stance character
 * @param animation - Current animation state
 * @returns Blend factor (0.0 = no guard, 1.0 = full guard)
 * @korean 동적방어블렌드계수가져오기
 */
const getGuardBlendFactor = (animation: PlayerAnimation): number => {
  switch (animation) {
    case "idle":
    case "block":
    case "counter":
    case "stance_change":
      return 1.0; // Full guard - maximum stance visibility when stationary/defensive

    case "walk":
    case "step_forward":
    case "step_back":
    case "step_left":
    case "step_right":
    case "step_forward_left":
    case "step_forward_right":
    case "step_back_left":
    case "step_back_right":
      return 0.7; // Partial guard - balanced movement with stance character

    case "attack":
    case "defend":
    case "hit":
    case "death":
    case "technique_execute":
      return 0.0; // No guard - technique animations have full control

    default:
      return 1.0; // Default to full guard for unknown animations
  }
};

/**
 * Helper function to apply bone rotation with lerp blending
 * Reduces code duplication for limb positioning
 *
 * @param rig - Skeletal rig
 * @param boneName - Name of bone to rotate
 * @param targetRotation - Target rotation
 * @param blend - Blend factor (0.0-1.0)
 * @param amplify - Optional amplification factor for the rotation
 * @korean 뼈회전적용
 */
const applyBoneRotation = (
  rig: SkeletalRig,
  boneName: string,
  targetRotation: THREE.Euler,
  blend: number,
  amplify: number = 1.0
): void => {
  const bone = rig.bones.get(boneName);
  if (!bone) return;

  const current = bone.rotation;
  current.x = THREE.MathUtils.lerp(
    current.x,
    targetRotation.x * amplify,
    blend
  );
  current.y = THREE.MathUtils.lerp(
    current.y,
    targetRotation.y * amplify,
    blend
  );
  current.z = THREE.MathUtils.lerp(
    current.z,
    targetRotation.z * amplify,
    blend
  );
};

/**
 * Apply hip position offset based on stance width
 *
 * Moves hip bones laterally to achieve wider or narrower stances.
 * stanceWidth = 1.0 is shoulder width (neutral)
 * stanceWidth > 1.0 spreads legs wider (e.g., horse stance)
 * stanceWidth < 1.0 brings legs closer (e.g., cat stance)
 *
 * The calculation uses a large visual multiplier to make stance differences
 * clearly visible even on screen.
 *
 * @param rig - Skeletal rig
 * @param stanceWidth - Stance width multiplier (0.3 to 1.5)
 * @param blend - Blend factor (0.0-1.0)
 * @korean 자세너비에따른고관절위치적용
 */
const applyHipPositionForStanceWidth = (
  rig: SkeletalRig,
  stanceWidth: number,
  blend: number
): void => {
  const leftHip = rig.bones.get("hip_L");
  const rightHip = rig.bones.get("hip_R");

  if (!leftHip || !rightHip) return;

  // Calculate target X position based on stance width
  // Use larger base offset for more dramatic visual effect
  // stanceWidth = 0.3 → very narrow (feet almost together)
  // stanceWidth = 1.0 → shoulder width (neutral)
  // stanceWidth = 1.2 → wide horse stance
  //
  // Formula: offset = BASE * stanceWidth
  // With BASE = 0.15:
  // - stanceWidth 0.3 → 0.045 (narrow, 9cm total width)
  // - stanceWidth 1.0 → 0.15 (normal, 30cm total width)
  // - stanceWidth 1.2 → 0.18 (wide, 36cm total width)
  const targetOffset = BASE_HIP_OFFSET_X * stanceWidth;

  // Lerp hip X positions (left is negative X, right is positive X)
  leftHip.position.x = THREE.MathUtils.lerp(
    leftHip.position.x,
    -targetOffset,
    blend
  );
  rightHip.position.x = THREE.MathUtils.lerp(
    rightHip.position.x,
    targetOffset,
    blend
  );

  // Also adjust Y position slightly for lower stances (wider = lower)
  // This creates a more authentic squat effect for deep stances
  const heightDrop = (stanceWidth - 1.0) * 0.05; // Drop up to 5cm for wide stances
  const restY = -0.1; // Rest Y position of hips
  const targetY = restY - heightDrop;

  leftHip.position.y = THREE.MathUtils.lerp(leftHip.position.y, targetY, blend);
  rightHip.position.y = THREE.MathUtils.lerp(
    rightHip.position.y,
    targetY,
    blend
  );
};

/**
 * Apply stance guard pose overlay on top of base animation
 *
 * Blends guard arm positions with base animation (idle/walk) to maintain
 * guard pose during movement. Only affects upper body (arms, torso) while
 * allowing legs to animate normally.
 *
 * PERFORMANCE: Directly modifies existing Euler rotation components
 * to avoid extra Euler object cloning while still using component-wise interpolation.
 *
 * @param rig - Skeletal rig to apply overlay to
 * @param stance - Current trigram stance
 * @param breathingPhase - Breathing phase 0.0-1.0 for scale oscillation
 * @param laterality - Stance laterality (left or right foot forward)
 * @param blendFactor - How much guard pose to blend (0=base animation, 1=full guard)
 *
 * @korean 자세방어포즈오버레이적용
 */
export const applyStanceGuardOverlay = (
  rig: SkeletalRig,
  stance: TrigramStance | string,
  breathingPhase: number,
  laterality: StanceLaterality = "right",
  blendFactor: number = 1.0
): void => {
  const guardPose = getGuardPoseForStance(stance as TrigramStance, laterality);
  if (!guardPose) return;

  // Blend left arm rotations with current pose
  const leftShoulder = rig.bones.get("shoulder_L");
  if (leftShoulder) {
    const current = leftShoulder.rotation;
    const target = guardPose.leftArm.shoulder;
    current.x = THREE.MathUtils.lerp(current.x, target.x, blendFactor);
    current.y = THREE.MathUtils.lerp(current.y, target.y, blendFactor);
    current.z = THREE.MathUtils.lerp(current.z, target.z, blendFactor);
  }

  const leftElbow = rig.bones.get("elbow_L");
  if (leftElbow) {
    const current = leftElbow.rotation;
    const target = guardPose.leftArm.elbow;
    current.x = THREE.MathUtils.lerp(current.x, target.x, blendFactor);
    current.y = THREE.MathUtils.lerp(current.y, target.y, blendFactor);
    current.z = THREE.MathUtils.lerp(current.z, target.z, blendFactor);
  }

  const leftWrist = rig.bones.get("wrist_L");
  if (leftWrist) {
    const current = leftWrist.rotation;
    const target = guardPose.leftArm.wrist;
    current.x = THREE.MathUtils.lerp(current.x, target.x, blendFactor);
    current.y = THREE.MathUtils.lerp(current.y, target.y, blendFactor);
    current.z = THREE.MathUtils.lerp(current.z, target.z, blendFactor);
  }

  // Blend right arm rotations with current pose
  const rightShoulder = rig.bones.get("shoulder_R");
  if (rightShoulder) {
    const current = rightShoulder.rotation;
    const target = guardPose.rightArm.shoulder;
    current.x = THREE.MathUtils.lerp(current.x, target.x, blendFactor);
    current.y = THREE.MathUtils.lerp(current.y, target.y, blendFactor);
    current.z = THREE.MathUtils.lerp(current.z, target.z, blendFactor);
  }

  const rightElbow = rig.bones.get("elbow_R");
  if (rightElbow) {
    const current = rightElbow.rotation;
    const target = guardPose.rightArm.elbow;
    current.x = THREE.MathUtils.lerp(current.x, target.x, blendFactor);
    current.y = THREE.MathUtils.lerp(current.y, target.y, blendFactor);
    current.z = THREE.MathUtils.lerp(current.z, target.z, blendFactor);
  }

  const rightWrist = rig.bones.get("wrist_R");
  if (rightWrist) {
    const current = rightWrist.rotation;
    const target = guardPose.rightArm.wrist;
    current.x = THREE.MathUtils.lerp(current.x, target.x, blendFactor);
    current.y = THREE.MathUtils.lerp(current.y, target.y, blendFactor);
    current.z = THREE.MathUtils.lerp(current.z, target.z, blendFactor);
  }

  // Blend torso rotation with current pose
  const spine = rig.bones.get("spine_upper");
  if (spine) {
    const current = spine.rotation;
    const target = guardPose.torso;
    const torsoBlend = blendFactor * TORSO_BLEND_FACTOR;
    current.x = THREE.MathUtils.lerp(current.x, target.x, torsoBlend);
    current.y = THREE.MathUtils.lerp(current.y, target.y, torsoBlend);
    current.z = THREE.MathUtils.lerp(current.z, target.z, torsoBlend);
  }

  // Also apply some rotation to lower spine for more natural side stance
  const spineLower = rig.bones.get("spine_lower");
  if (spineLower) {
    const current = spineLower.rotation;
    // Lower spine follows pelvis rotation partially for natural look
    const pelvisY = guardPose.pelvis.y * 0.3; // 30% of pelvis rotation
    current.y = THREE.MathUtils.lerp(current.y, pelvisY, blendFactor);
  }

  // Blend leg rotations for authentic stance positioning
  // Hip rotations are amplified for more visible side stances
  applyBoneRotation(rig, "hip_L", guardPose.leftLeg.hip, blendFactor, 1.3);
  applyBoneRotation(
    rig,
    "knee_L",
    guardPose.leftLeg.knee,
    blendFactor,
    KNEE_BEND_AMPLIFICATION
  );
  applyBoneRotation(rig, "foot_L", guardPose.leftLeg.ankle, blendFactor);

  applyBoneRotation(rig, "hip_R", guardPose.rightLeg.hip, blendFactor, 1.3);
  applyBoneRotation(
    rig,
    "knee_R",
    guardPose.rightLeg.knee,
    blendFactor,
    KNEE_BEND_AMPLIFICATION
  );
  applyBoneRotation(rig, "foot_R", guardPose.rightLeg.ankle, blendFactor);

  // Blend pelvis rotation for proper stance base (side stance rotation)
  // Amplify pelvis Y rotation for more visible side stances
  applyBoneRotation(rig, "pelvis", guardPose.pelvis, blendFactor, 1.2);

  // Apply hip positions based on stance width (spreads or narrows legs)
  // This is crucial for authentic Korean martial arts stances
  const stanceWidth = guardPose.stanceWidth ?? DEFAULT_STANCE_WIDTH;
  applyHipPositionForStanceWidth(rig, stanceWidth, blendFactor);

  // Apply breathing animation scale (chest/shoulder expansion)
  const breathingScale = THREE.MathUtils.lerp(
    guardPose.breathingRange.min,
    guardPose.breathingRange.max,
    (Math.sin(breathingPhase * Math.PI * 2) + 1) / 2 // Sine wave 0-1
  );

  // Apply breathing to upper torso
  const chest = rig.bones.get("spine_middle");
  if (chest) {
    chest.scale.setScalar(breathingScale);
  }

  const neck = rig.bones.get("neck");
  if (neck) {
    neck.scale.y = breathingScale;
  }
};

/**
 * Options for useGuardPoseOverlay hook
 * @korean 방어자세오버레이훅옵션
 */
export interface UseGuardPoseOverlayOptions {
  /** Current stance */
  readonly stance: TrigramStance | string;
  /** Stance laterality (left or right foot forward) */
  readonly laterality?: StanceLaterality;
  /** Current animation name */
  readonly currentAnimation: PlayerAnimation;
}

/**
 * Return type for useGuardPoseOverlay hook
 * @korean 방어자세오버레이훅반환타입
 */
export interface UseGuardPoseOverlayReturn {
  /** Apply guard pose overlay to rig (call in useFrame) */
  readonly applyGuardOverlay: (rig: SkeletalRig, delta: number) => void;
}

/**
 * useGuardPoseOverlay hook
 *
 * Manages guard pose overlay application on top of base animations.
 * Handles breathing animation and dynamic blend factors based on movement.
 *
 * @param options - Guard pose options
 * @returns Guard overlay application function
 *
 * @example
 * ```tsx
 * const { applyGuardOverlay } = useGuardPoseOverlay({
 *   stance: "geon",
 *   laterality: "right",
 *   currentAnimation: "idle",
 * });
 *
 * // In useFrame callback (after base animation is applied)
 * useFrame((_, delta) => {
 *   // Apply base animation first
 *   updateRigAnimation(rig, delta);
 *   // Then apply guard overlay
 *   applyGuardOverlay(rig, delta);
 * });
 * ```
 *
 * @korean 방어자세오버레이훅
 */
export function useGuardPoseOverlay(
  options: UseGuardPoseOverlayOptions
): UseGuardPoseOverlayReturn {
  const { stance, laterality = "right", currentAnimation } = options;

  // Breathing phase ref for guard poses (0-1 cycle)
  const breathingPhaseRef = useRef(0);

  // Apply guard pose overlay (called at 60fps in useFrame)
  const applyGuardOverlay = (rig: SkeletalRig, delta: number): void => {
    // Only apply guard for animations that allow it
    const shouldApplyGuard =
      currentAnimation !== "attack" &&
      currentAnimation !== "defend" &&
      currentAnimation !== "hit" &&
      currentAnimation !== "death";

    if (!shouldApplyGuard) {
      return;
    }

    // Update breathing phase for guard poses
    breathingPhaseRef.current += delta * 0.5; // 0.5 Hz = 2 seconds per breath cycle
    if (breathingPhaseRef.current > 1.0) {
      breathingPhaseRef.current -= 1.0;
    }

    // Get dynamic blend factor based on animation type
    const blendFactor = getGuardBlendFactor(currentAnimation);

    // Apply guard pose overlay
    applyStanceGuardOverlay(
      rig,
      stance,
      breathingPhaseRef.current,
      laterality,
      blendFactor
    );
  };

  return {
    applyGuardOverlay,
  };
}
