/**
 * Punch Phase Application Utilities
 *
 * Utilities for applying punch phase poses to keyframes.
 * 주먹 단계 적용 유틸리티
 *
 * @module systems/animation/PunchPhaseApplicator
 * @korean 주먹단계적용기
 */

import { BoneName } from "../../types/skeletal";
import type { KeyframeConfig } from "./KeyframeConfig";
import { PUNCH_PHASES } from "./MartialArtsConstants";

/**
 * Interface for punch phases with Korean martial arts biomechanics
 * Includes opposite arm hikite (당기기) for power generation
 */
interface PunchPhase {
  readonly shoulder: readonly [number, number, number];
  readonly elbow: readonly [number, number, number];
  readonly wrist?: readonly [number, number, number];
  readonly spineY?: number;
  readonly pelvisY?: number;
  // Opposite arm for hikite (pulling hand) - 당기기
  readonly oppositeShoulder?: readonly [number, number, number];
  readonly oppositeElbow?: readonly [number, number, number];
  readonly oppositeWrist?: readonly [number, number, number];
}

/** Phase name keys */
export type PunchPhaseName = keyof typeof PUNCH_PHASES;

/**
 * Apply punch phase to a KeyframeConfig with Korean martial arts biomechanics
 * Handles common punch phase bones: shoulder, elbow, wrist, spine, pelvis
 * Now includes opposite arm hikite (당기기) for authentic Korean martial arts form
 *
 * @param kf - KeyframeConfig to apply phase to
 * @param phase - Punch phase data from PUNCH_PHASES
 * @param hand - Which hand is punching ("left" | "right")
 * @param options - Optional configuration
 *
 * @example
 * ```typescript
 * // Apply chamber position with opposite arm guard
 * applyPunchPhaseToConfig(kf, PUNCH_PHASES.CHAMBER, "right", { 
 *   includeWrist: true, 
 *   includeOppositeArm: true 
 * });
 * 
 * // Apply extension with hip rotation and hikite
 * applyPunchPhaseToConfig(kf, PUNCH_PHASES.EXTENSION, "right", { 
 *   includeWrist: true,
 *   includeOppositeArm: true,
 *   includeSpineMiddle: true 
 * });
 * ```
 *
 * @korean KeyframeConfig에주먹단계적용
 */
export function applyPunchPhaseToConfig(
  kf: KeyframeConfig,
  phase: PunchPhase,
  hand: "left" | "right" = "right",
  options: {
    readonly includeWrist?: boolean;
    readonly includeSpineMiddle?: boolean;
    readonly includeOppositeArm?: boolean;
  } = {}
): void {
  const { 
    includeWrist = false, 
    includeSpineMiddle = false,
    includeOppositeArm = true, // Default to true for authentic Korean martial arts
  } = options;

  // Select bones based on punching hand
  const shoulderBone =
    hand === "right" ? BoneName.SHOULDER_R : BoneName.SHOULDER_L;
  const elbowBone = hand === "right" ? BoneName.ELBOW_R : BoneName.ELBOW_L;
  const wristBone = hand === "right" ? BoneName.WRIST_R : BoneName.WRIST_L;

  // Opposite hand bones for hikite (당기기)
  const oppositeShoulderBone =
    hand === "right" ? BoneName.SHOULDER_L : BoneName.SHOULDER_R;
  const oppositeElbowBone =
    hand === "right" ? BoneName.ELBOW_L : BoneName.ELBOW_R;
  const oppositeWristBone =
    hand === "right" ? BoneName.WRIST_L : BoneName.WRIST_R;

  // Apply punching arm shoulder rotation
  if (phase.shoulder) {
    kf.rotate(
      shoulderBone,
      phase.shoulder[0],
      phase.shoulder[1],
      phase.shoulder[2]
    );
  }

  // Apply punching arm elbow rotation
  if (phase.elbow) {
    kf.rotate(elbowBone, phase.elbow[0], phase.elbow[1], phase.elbow[2]);
  }

  // Optional punching arm wrist rotation (for fist rotation)
  if (includeWrist && phase.wrist) {
    kf.rotate(wristBone, phase.wrist[0], phase.wrist[1], phase.wrist[2]);
  }

  // Apply opposite arm hikite (당기기 - pulling hand for power generation)
  if (includeOppositeArm) {
    if (phase.oppositeShoulder) {
      kf.rotate(
        oppositeShoulderBone,
        phase.oppositeShoulder[0],
        phase.oppositeShoulder[1],
        phase.oppositeShoulder[2]
      );
    }

    if (phase.oppositeElbow) {
      kf.rotate(
        oppositeElbowBone,
        phase.oppositeElbow[0],
        phase.oppositeElbow[1],
        phase.oppositeElbow[2]
      );
    }

    if (includeWrist && phase.oppositeWrist) {
      kf.rotate(
        oppositeWristBone,
        phase.oppositeWrist[0],
        phase.oppositeWrist[1],
        phase.oppositeWrist[2]
      );
    }
  }

  // Spine and pelvis Y-axis rotations for hip/shoulder engagement
  if (phase.spineY !== undefined) {
    kf.rotate(BoneName.SPINE_UPPER, 0, phase.spineY, 0);
    if (includeSpineMiddle) {
      kf.rotate(BoneName.SPINE_MIDDLE, 0, phase.spineY * 0.7, 0);
    }
  }
  if (phase.pelvisY !== undefined) {
    kf.rotate(BoneName.PELVIS, 0, phase.pelvisY, 0);
  }
}

/**
 * Get a punch phase by name
 *
 * @param phaseName - Name of the phase from PUNCH_PHASES
 * @returns The punch phase data
 *
 * @korean 주먹단계가져오기
 */
export function getPunchPhase(phaseName: PunchPhaseName): PunchPhase {
  return PUNCH_PHASES[phaseName];
}
