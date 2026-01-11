/**
 * Kick Phase Application Utilities
 *
 * Utilities for applying kick phase poses to keyframes.
 * 발차기 단계 적용 유틸리티
 *
 * @module systems/animation/KickPhaseApplicator
 * @korean 발차기단계적용기
 */

import { BoneName } from "../../types/skeletal";
import type { KeyframeConfig } from "./KeyframeConfig";
import { KICK_PHASES } from "./MartialArtsConstants";

/**
 * Interface for basic kick phases (CHAMBER, EXTENSION, HIGH_PEAK)
 * These phases have pelvis as a tuple [x, y, z]
 */
interface BasicKickPhase {
  readonly hip: readonly [number, number, number];
  readonly knee: readonly [number, number, number];
  readonly ankle?: readonly [number, number, number];
  readonly supportKnee?: readonly [number, number, number];
  readonly pelvis?: readonly [number, number, number];
}

/**
 * Interface for rotational kick phases (ROUNDHOUSE_CHAMBER, SIDE_CHAMBER)
 * These phases have pelvisY as a single Y-axis value
 */
interface RotationalKickPhase {
  readonly hip: readonly [number, number, number];
  readonly knee: readonly [number, number, number];
  readonly pelvisY?: number;
  readonly spineY?: number;
  readonly spineLean?: number;
}

/** Phase name keys */
export type KickPhaseName = keyof typeof KICK_PHASES;

/**
 * Apply basic kick phase to a KeyframeConfig
 * Handles common kick phase bones: hip, knee, supportKnee, pelvis, ankle
 * Use this for CHAMBER, EXTENSION, HIGH_PEAK phases
 *
 * @param kf - KeyframeConfig to apply phase to
 * @param phase - Basic kick phase data (CHAMBER, EXTENSION, HIGH_PEAK)
 * @param options - Optional overrides for specific bones
 *
 * @example
 * ```typescript
 * applyKickPhaseToConfig(kf, KICK_PHASES.CHAMBER);
 * applyKickPhaseToConfig(kf, KICK_PHASES.EXTENSION, { includeAnkle: true });
 * ```
 *
 * @korean KeyframeConfig에발차기단계적용
 */
export function applyKickPhaseToConfig(
  kf: KeyframeConfig,
  phase: BasicKickPhase,
  options: {
    readonly includeAnkle?: boolean;
    readonly includePelvis?: boolean;
    readonly resetFoot?: boolean;
  } = {}
): void {
  const {
    includeAnkle = false,
    includePelvis = true,
    resetFoot = false,
  } = options;

  // Required bones for all kick phases
  kf.rotate(BoneName.HIP_R, phase.hip[0], phase.hip[1], phase.hip[2]);
  kf.rotate(BoneName.KNEE_R, phase.knee[0], phase.knee[1], phase.knee[2]);

  if (phase.supportKnee) {
    kf.rotate(
      BoneName.KNEE_L,
      phase.supportKnee[0],
      phase.supportKnee[1],
      phase.supportKnee[2]
    );
  }

  // Optional pelvis
  if (includePelvis && phase.pelvis) {
    kf.rotate(
      BoneName.PELVIS,
      phase.pelvis[0],
      phase.pelvis[1],
      phase.pelvis[2]
    );
  }

  // Optional ankle
  if (includeAnkle && phase.ankle) {
    kf.rotate(BoneName.FOOT_R, phase.ankle[0], phase.ankle[1], phase.ankle[2]);
  }

  // Reset foot position
  if (resetFoot) {
    kf.rotate(BoneName.FOOT_R, 0, 0, 0);
  }
}

/**
 * Apply roundhouse-specific kick phase
 * Includes pelvisY and spineY single-axis rotations
 * Use this for ROUNDHOUSE_CHAMBER phase
 *
 * @param kf - KeyframeConfig to apply phase to
 * @param phase - Rotational kick phase data (ROUNDHOUSE_CHAMBER)
 *
 * @korean 돌려차기단계적용
 */
export function applyRoundhousePhaseToConfig(
  kf: KeyframeConfig,
  phase: RotationalKickPhase
): void {
  kf.rotate(BoneName.HIP_R, phase.hip[0], phase.hip[1], phase.hip[2]);
  kf.rotate(BoneName.KNEE_R, phase.knee[0], phase.knee[1], phase.knee[2]);

  // Y-axis only rotations for roundhouse
  if (phase.pelvisY !== undefined) {
    kf.rotate(BoneName.PELVIS, 0, phase.pelvisY, 0);
  }
  if (phase.spineY !== undefined) {
    kf.rotate(BoneName.SPINE_UPPER, 0, phase.spineY, 0);
  }
}

/**
 * Apply side kick phase
 * Includes pelvisY, spineY, and spineLean
 * Use this for SIDE_CHAMBER phase
 *
 * @param kf - KeyframeConfig to apply phase to
 * @param phase - Rotational kick phase data (SIDE_CHAMBER)
 *
 * @korean 옆차기단계적용
 */
export function applySideKickPhaseToConfig(
  kf: KeyframeConfig,
  phase: RotationalKickPhase
): void {
  kf.rotate(BoneName.HIP_R, phase.hip[0], phase.hip[1], phase.hip[2]);
  kf.rotate(BoneName.KNEE_R, phase.knee[0], phase.knee[1], phase.knee[2]);

  // Side kick specific rotations
  if (phase.pelvisY !== undefined) {
    kf.rotate(BoneName.PELVIS, 0, phase.pelvisY, 0);
  }
  if (phase.spineY !== undefined) {
    const lean = phase.spineLean ?? 0;
    kf.rotate(BoneName.SPINE_LOWER, 0, phase.spineY, 0);
    kf.rotate(BoneName.SPINE_UPPER, 0, phase.spineY, lean);
  }
}

/**
 * Apply high peak phase (axe kick rise)
 * Includes full pelvis tuple and support knee
 * Use this for HIGH_PEAK phase
 *
 * @param kf - KeyframeConfig to apply phase to
 * @param phase - Basic kick phase data (HIGH_PEAK)
 *
 * @korean 높이올리기단계적용
 */
export function applyHighPeakPhaseToConfig(
  kf: KeyframeConfig,
  phase: BasicKickPhase
): void {
  kf.rotate(BoneName.HIP_R, phase.hip[0], phase.hip[1], phase.hip[2]);
  kf.rotate(BoneName.KNEE_R, phase.knee[0], phase.knee[1], phase.knee[2]);

  if (phase.ankle) {
    kf.rotate(BoneName.FOOT_R, phase.ankle[0], phase.ankle[1], phase.ankle[2]);
  }
  if (phase.supportKnee) {
    kf.rotate(
      BoneName.KNEE_L,
      phase.supportKnee[0],
      phase.supportKnee[1],
      phase.supportKnee[2]
    );
  }
  if (phase.pelvis) {
    kf.rotate(
      BoneName.PELVIS,
      phase.pelvis[0],
      phase.pelvis[1],
      phase.pelvis[2]
    );
  }
}

/** Union type for any kick phase from KICK_PHASES */
export type KickPhase = (typeof KICK_PHASES)[keyof typeof KICK_PHASES];

/**
 * Get a kick phase by name
 *
 * @param phaseName - Name of the phase from KICK_PHASES
 * @returns The kick phase data
 *
 * @korean 발차기단계가져오기
 */
export function getKickPhase(phaseName: KickPhaseName): KickPhase {
  return KICK_PHASES[phaseName];
}
