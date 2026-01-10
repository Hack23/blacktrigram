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
 * Interface for punch phases
 */
interface PunchPhase {
  readonly shoulder: readonly [number, number, number];
  readonly elbow: readonly [number, number, number];
  readonly wrist?: readonly [number, number, number];
  readonly spineY?: number;
  readonly pelvisY?: number;
}

/** Phase name keys */
export type PunchPhaseName = keyof typeof PUNCH_PHASES;

/**
 * Apply punch phase to a KeyframeConfig
 * Handles common punch phase bones: shoulder, elbow, wrist, spine, pelvis
 *
 * @param kf - KeyframeConfig to apply phase to
 * @param phase - Punch phase data from PUNCH_PHASES
 * @param hand - Which hand is punching ("left" | "right")
 * @param options - Optional configuration
 *
 * @example
 * ```typescript
 * applyPunchPhaseToConfig(kf, PUNCH_PHASES.WINDUP, "right");
 * applyPunchPhaseToConfig(kf, PUNCH_PHASES.EXTENSION, "right", { includeWrist: true });
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
  } = {}
): void {
  const { includeWrist = false, includeSpineMiddle = false } = options;

  // Select bones based on hand
  const shoulderBone =
    hand === "right" ? BoneName.SHOULDER_R : BoneName.SHOULDER_L;
  const elbowBone = hand === "right" ? BoneName.ELBOW_R : BoneName.ELBOW_L;
  const wristBone = hand === "right" ? BoneName.WRIST_R : BoneName.WRIST_L;

  // Apply shoulder rotation
  if (phase.shoulder) {
    kf.rotate(
      shoulderBone,
      phase.shoulder[0],
      phase.shoulder[1],
      phase.shoulder[2]
    );
  }

  // Apply elbow rotation
  if (phase.elbow) {
    kf.rotate(elbowBone, phase.elbow[0], phase.elbow[1], phase.elbow[2]);
  }

  // Optional wrist rotation
  if (includeWrist && phase.wrist) {
    kf.rotate(wristBone, phase.wrist[0], phase.wrist[1], phase.wrist[2]);
  }

  // Spine and pelvis Y-axis rotations
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
