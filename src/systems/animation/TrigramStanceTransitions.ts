/**
 * Trigram Stance Transition System
 * 
 * Handles trigram-specific animation transitions between stances with smooth blending,
 * incorporating Korean martial arts footwork and weight transfer principles.
 * 
 * **Korean Context:**
 * - **자세 전환 (Jase Jeonhwan)**: Stance transition
 * - **발놀림 (Balnollim)**: Footwork
 * - **체중 이동 (Chejung Idong)**: Weight transfer
 * 
 * Generates all 64 stance-to-stance transitions (8×8) with proper footwork,
 * weight transfer, and guard pose blending based on authentic Korean martial arts.
 * 
 * @module systems/animation/TrigramStanceTransitions
 * @category Animation System
 * @korean 팔괘자세전환
 */

import { TrigramStance } from "../../types/common";
import type { SkeletalAnimation } from "../../types/skeletal";
import type { StanceLaterality } from "../trigram/types";
import { getGuardPoseForStance } from "./StanceGuardPoses";
import { MartialArtsAnimationBuilder } from "./MartialArtsAnimationBuilder";
import { BoneName } from "../../types/skeletal";
import * as THREE from "three";

/**
 * Order of trigram stances in the stance wheel (circular arrangement).
 * 
 * **Korean**: 팔괘 순서
 * 
 * The 8 trigrams arranged in traditional order around the Bagua octagon.
 * Adjacent stances in this array are considered "adjacent" for transition purposes.
 * 
 * @korean 팔괘순서
 */
export const TRIGRAM_STANCES_ORDER: readonly TrigramStance[] = [
  TrigramStance.GEON,  // ☰ Heaven
  TrigramStance.TAE,   // ☱ Lake
  TrigramStance.LI,    // ☲ Fire
  TrigramStance.JIN,   // ☳ Thunder
  TrigramStance.SON,   // ☴ Wind
  TrigramStance.GAM,   // ☵ Water
  TrigramStance.GAN,   // ☶ Mountain
  TrigramStance.GON,   // ☷ Earth
] as const;

/**
 * Calculate transition duration based on stance change magnitude.
 * 
 * **Korean**: 전환 시간 계산
 * 
 * Duration is based on the distance between stances on the octagonal wheel:
 * - Same stance (laterality change only): 300ms
 * - Adjacent stances (1-2 steps apart): 200ms
 * - Medium distance (3-4 steps): 300ms
 * - Opposite stances (4 steps): 400ms
 * 
 * @param from - Starting trigram stance
 * @param to - Ending trigram stance
 * @returns Transition duration in seconds
 * 
 * @example
 * ```typescript
 * calculateTransitionDuration(TrigramStance.GEON, TrigramStance.TAE); // 0.2 (adjacent)
 * calculateTransitionDuration(TrigramStance.GEON, TrigramStance.GON); // 0.4 (opposite)
 * calculateTransitionDuration(TrigramStance.GEON, TrigramStance.GEON); // 0.3 (laterality change)
 * ```
 * 
 * @public
 * @category Trigram System
 * @korean 전환시간계산
 */
export function calculateTransitionDuration(
  from: TrigramStance,
  to: TrigramStance
): number {
  // Same stance = laterality change only
  if (from === to) {
    return 0.3; // 300ms
  }
  
  const fromIndex = TRIGRAM_STANCES_ORDER.indexOf(from);
  const toIndex = TRIGRAM_STANCES_ORDER.indexOf(to);
  
  if (fromIndex === -1 || toIndex === -1) {
    console.warn(`Invalid stance in transition: ${from} -> ${to}`);
    return 0.3; // Default to medium duration
  }
  
  // Calculate shortest distance around the circular wheel
  const directDistance = Math.abs(toIndex - fromIndex);
  const wrapDistance = TRIGRAM_STANCES_ORDER.length - directDistance;
  const distance = Math.min(directDistance, wrapDistance);
  
  // Map distance to duration
  if (distance === 0) return 0.3; // Same stance
  if (distance <= 2) return 0.2;  // Adjacent stances (1-2 steps)
  if (distance <= 3) return 0.3;  // Medium distance (3 steps)
  return 0.4; // Opposite stances (4 steps)
}

/**
 * Generate trigram stance-to-stance transition animation.
 * 
 * **Korean**: 팔괘 자세 전환 애니메이션 생성
 * 
 * Creates a complete skeletal animation transitioning from one trigram stance to another,
 * including:
 * - Footwork keyframes (weight transfer, pivot, step)
 * - Guard pose blending (arms transition smoothly)
 * - Laterality support (left/right stance)
 * - Korean martial arts principles (proper weight transfer, footwork sequencing)
 * 
 * ## Animation Phases
 * 
 * 1. **Weight Transfer (0-40% of duration)**: Shift weight off moving foot
 * 2. **Pivot/Step (40-70% of duration)**: Reposition feet to target stance width
 * 3. **Guard Blend (0-100% of duration)**: Smoothly transition guard poses
 * 4. **Settle (70-100% of duration)**: Complete transition, stabilize in new stance
 * 
 * @param from - Starting trigram stance
 * @param to - Ending trigram stance  
 * @param laterality - Laterality (applies to ending stance)
 * @returns Transition animation with footwork and guard blending
 * 
 * @example
 * ```typescript
 * // Adjacent stance transition (200ms)
 * const transition = transitionBetweenStances(
 *   TrigramStance.GEON, 
 *   TrigramStance.TAE, 
 *   "left"
 * );
 * 
 * // Opposite stance transition (400ms)
 * const longTransition = transitionBetweenStances(
 *   TrigramStance.GEON,
 *   TrigramStance.GON,
 *   "right"
 * );
 * ```
 * 
 * @public
 * @category Trigram System
 * @korean 팔괘자세전환
 */
export function transitionBetweenStances(
  from: TrigramStance,
  to: TrigramStance,
  laterality: StanceLaterality
): SkeletalAnimation {
  const duration = calculateTransitionDuration(from, to);
  
  // Get guard poses for blending (laterality applies to both from and to)
  const fromGuard = getGuardPoseForStance(from, laterality);
  const toGuard = getGuardPoseForStance(to, laterality);
  
  if (!fromGuard || !toGuard) {
    throw new Error(`Guard pose not found for transition: ${from} (${laterality}) -> ${to} (${laterality})`);
  }
  
  // Build transition animation  
  const builder = MartialArtsAnimationBuilder
    .create(
      `${from}_to_${to}_${laterality}`,
      `${from}에서${to}로_${laterality === "left" ? "왼" : "오른"}`
    )
    .asMovement(duration, false);
  
  // Keyframe 1: Start from original guard pose (0% - t=0)
  const startTime = 0;
  const fromHalfWidth = fromGuard.stanceWidth / 2;
  
  builder.at(startTime, "ease-out")
    .rotate(BoneName.SHOULDER_L, ...fromGuard.leftArm.shoulder.toArray() as [number, number, number])
    .rotate(BoneName.ELBOW_L, ...fromGuard.leftArm.elbow.toArray() as [number, number, number])
    .rotate(BoneName.WRIST_L, ...fromGuard.leftArm.wrist.toArray() as [number, number, number])
    .rotate(BoneName.SHOULDER_R, ...fromGuard.rightArm.shoulder.toArray() as [number, number, number])
    .rotate(BoneName.ELBOW_R, ...fromGuard.rightArm.elbow.toArray() as [number, number, number])
    .rotate(BoneName.WRIST_R, ...fromGuard.rightArm.wrist.toArray() as [number, number, number])
    .rotate(BoneName.HIP_L, ...fromGuard.leftLeg.hip.toArray() as [number, number, number])
    .rotate(BoneName.KNEE_L, ...fromGuard.leftLeg.knee.toArray() as [number, number, number])
    .rotate(BoneName.FOOT_L, ...fromGuard.leftLeg.ankle.toArray() as [number, number, number])
    .rotate(BoneName.HIP_R, ...fromGuard.rightLeg.hip.toArray() as [number, number, number])
    .rotate(BoneName.KNEE_R, ...fromGuard.rightLeg.knee.toArray() as [number, number, number])
    .rotate(BoneName.FOOT_R, ...fromGuard.rightLeg.ankle.toArray() as [number, number, number])
    .rotate(BoneName.SPINE_UPPER, ...fromGuard.torso.toArray() as [number, number, number])
    .rotate(BoneName.PELVIS, ...fromGuard.pelvis.toArray() as [number, number, number])
    .position(BoneName.FOOT_L, -fromHalfWidth, 0, 0)
    .position(BoneName.FOOT_R, fromHalfWidth, 0, 0)
    .done<typeof builder>();
  
  // Helper function for blending Euler rotations
  const blendRotation = (fromEuler: THREE.Euler, toEuler: THREE.Euler, blend: number): [number, number, number] => {
    return [
      fromEuler.x + (toEuler.x - fromEuler.x) * blend,
      fromEuler.y + (toEuler.y - fromEuler.y) * blend,
      fromEuler.z + (toEuler.z - fromEuler.z) * blend,
    ];
  };
  
  // Keyframe 2: Weight transfer phase (40% of duration)
  const weightTransferTime = duration * 0.4;
  builder.at(weightTransferTime, "linear")
    .rotate(BoneName.KNEE_L, Math.min(fromGuard.leftLeg.knee.x + 0.1, 0.6), 0, 0)
    .rotate(BoneName.KNEE_R, Math.min(fromGuard.rightLeg.knee.x + 0.1, 0.6), 0, 0)
    .rotate(BoneName.PELVIS, fromGuard.pelvis.x, fromGuard.pelvis.y + (toGuard.pelvis.y - fromGuard.pelvis.y) * 0.3, fromGuard.pelvis.z)
    .rotate(BoneName.SHOULDER_L, ...blendRotation(fromGuard.leftArm.shoulder, toGuard.leftArm.shoulder, 0.2))
    .rotate(BoneName.ELBOW_L, ...blendRotation(fromGuard.leftArm.elbow, toGuard.leftArm.elbow, 0.2))
    .done<typeof builder>();
  
  // Keyframe 3: Guard blend phase (70% of duration)
  const guardBlendTime = duration * 0.7;
  const blendedHalfWidth = fromHalfWidth + ((toGuard.stanceWidth / 2) - fromHalfWidth) * 0.7;
  
  builder.at(guardBlendTime, "ease-in-out")
    .rotate(BoneName.SHOULDER_L, ...blendRotation(fromGuard.leftArm.shoulder, toGuard.leftArm.shoulder, 0.7))
    .rotate(BoneName.ELBOW_L, ...blendRotation(fromGuard.leftArm.elbow, toGuard.leftArm.elbow, 0.7))
    .rotate(BoneName.WRIST_L, ...blendRotation(fromGuard.leftArm.wrist, toGuard.leftArm.wrist, 0.7))
    .rotate(BoneName.SHOULDER_R, ...blendRotation(fromGuard.rightArm.shoulder, toGuard.rightArm.shoulder, 0.7))
    .rotate(BoneName.ELBOW_R, ...blendRotation(fromGuard.rightArm.elbow, toGuard.rightArm.elbow, 0.7))
    .rotate(BoneName.WRIST_R, ...blendRotation(fromGuard.rightArm.wrist, toGuard.rightArm.wrist, 0.7))
    .rotate(BoneName.HIP_L, ...blendRotation(fromGuard.leftLeg.hip, toGuard.leftLeg.hip, 0.6))
    .rotate(BoneName.KNEE_L, ...blendRotation(fromGuard.leftLeg.knee, toGuard.leftLeg.knee, 0.6))
    .rotate(BoneName.FOOT_L, ...blendRotation(fromGuard.leftLeg.ankle, toGuard.leftLeg.ankle, 0.6))
    .rotate(BoneName.HIP_R, ...blendRotation(fromGuard.rightLeg.hip, toGuard.rightLeg.hip, 0.6))
    .rotate(BoneName.KNEE_R, ...blendRotation(fromGuard.rightLeg.knee, toGuard.rightLeg.knee, 0.6))
    .rotate(BoneName.FOOT_R, ...blendRotation(fromGuard.rightLeg.ankle, toGuard.rightLeg.ankle, 0.6))
    .rotate(BoneName.SPINE_UPPER, ...blendRotation(fromGuard.torso, toGuard.torso, 0.7))
    .rotate(BoneName.PELVIS, ...blendRotation(fromGuard.pelvis, toGuard.pelvis, 0.7))
    .position(BoneName.FOOT_L, -blendedHalfWidth, 0, 0)
    .position(BoneName.FOOT_R, blendedHalfWidth, 0, 0)
    .done<typeof builder>();
  
  // Keyframe 4: Complete transition to target guard pose (100% - t=duration)
  const endTime = duration;
  const toHalfWidth = toGuard.stanceWidth / 2;
  
  builder.at(endTime, "ease-in")
    .rotate(BoneName.SHOULDER_L, ...toGuard.leftArm.shoulder.toArray() as [number, number, number])
    .rotate(BoneName.ELBOW_L, ...toGuard.leftArm.elbow.toArray() as [number, number, number])
    .rotate(BoneName.WRIST_L, ...toGuard.leftArm.wrist.toArray() as [number, number, number])
    .rotate(BoneName.SHOULDER_R, ...toGuard.rightArm.shoulder.toArray() as [number, number, number])
    .rotate(BoneName.ELBOW_R, ...toGuard.rightArm.elbow.toArray() as [number, number, number])
    .rotate(BoneName.WRIST_R, ...toGuard.rightArm.wrist.toArray() as [number, number, number])
    .rotate(BoneName.HIP_L, ...toGuard.leftLeg.hip.toArray() as [number, number, number])
    .rotate(BoneName.KNEE_L, ...toGuard.leftLeg.knee.toArray() as [number, number, number])
    .rotate(BoneName.FOOT_L, ...toGuard.leftLeg.ankle.toArray() as [number, number, number])
    .rotate(BoneName.HIP_R, ...toGuard.rightLeg.hip.toArray() as [number, number, number])
    .rotate(BoneName.KNEE_R, ...toGuard.rightLeg.knee.toArray() as [number, number, number])
    .rotate(BoneName.FOOT_R, ...toGuard.rightLeg.ankle.toArray() as [number, number, number])
    .rotate(BoneName.SPINE_UPPER, ...toGuard.torso.toArray() as [number, number, number])
    .rotate(BoneName.PELVIS, ...toGuard.pelvis.toArray() as [number, number, number])
    .position(BoneName.FOOT_L, -toHalfWidth, 0, 0)
    .position(BoneName.FOOT_R, toHalfWidth, 0, 0)
    .done<typeof builder>();
  
  return builder.build();
}

/**
 * Stance transition matrix containing all 64 transitions (8x8).
 * 
 * **Korean**: 팔괘 전환 행렬
 * 
 * Maps from every stance to every other stance for both left and right laterality.
 * Key format: "from_to_laterality" (e.g., "geon_tae_left")
 * 
 * Total transitions: 128 (8 source × 8 target × 2 laterality)
 * - 16 same-stance transitions (laterality changes, 300ms)
 * - ~48 adjacent transitions (200ms)
 * - ~64 indirect transitions (300-400ms)
 * 
 * @korean 팔괘전환행렬
 */
export const STANCE_TRANSITIONS: Map<string, SkeletalAnimation> = new Map();

/**
 * Initialize the stance transition matrix.
 * 
 * **Korean**: 전환 행렬 초기화
 * 
 * Generates all 128 stance transitions (8 from × 8 to × 2 laterality) and populates the transition map.
 * Call this during system initialization.
 * 
 * @korean 전환행렬초기화
 */
export function initializeStanceTransitions(): void {
  // Generate all transitions for both lateralities
  for (const from of TRIGRAM_STANCES_ORDER) {
    for (const to of TRIGRAM_STANCES_ORDER) {
      for (const laterality of ["left", "right"] as const) {
        const key = `${from}_${to}_${laterality}`;
        const transition = transitionBetweenStances(from, to, laterality);
        STANCE_TRANSITIONS.set(key, transition);
      }
    }
  }
  
  if (process.env.NODE_ENV === "development") {
    console.log(`[TrigramStanceTransitions] Initialized ${STANCE_TRANSITIONS.size} stance transitions`);
  }
}

/**
 * Get stance transition animation.
 * 
 * **Korean**: 자세 전환 가져오기
 * 
 * Retrieves the transition animation for moving from one stance to another with specific laterality.
 * 
 * @param from - Source stance
 * @param to - Target stance
 * @param laterality - Stance laterality (left/right)
 * @returns Transition animation, or undefined if not found
 * 
 * @example
 * ```typescript
 * const transition = getStanceTransition(
 *   TrigramStance.GEON, 
 *   TrigramStance.TAE,
 *   "right"
 * );
 * console.log(transition.duration); // 0.2
 * console.log(transition.keyframes.length); // 4
 * ```
 * 
 * @korean 자세전환가져오기
 */
export function getStanceTransition(
  from: TrigramStance,
  to: TrigramStance,
  laterality: StanceLaterality
): SkeletalAnimation | undefined {
  const key = `${from}_${to}_${laterality}`;
  return STANCE_TRANSITIONS.get(key);
}

// Initialize transitions on module load for convenience
// For production use, consider calling initializeStanceTransitions()
// during application startup to avoid blocking the main thread.
if (typeof window !== 'undefined') {
  // Only initialize in browser context (not during SSR or build)
  initializeStanceTransitions();
}
