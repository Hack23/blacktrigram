/**
 * Kick Phase Application Utilities
 *
 * Utilities for applying kick phase poses to keyframes with integrated
 * anatomy awareness (foot highlighting for kicks).
 * 발차기 단계 적용 유틸리티 (해부학 통합)
 *
 * @module systems/animation/KickPhaseApplicator
 * @korean 발차기단계적용기
 */

import { BoneName } from "@/types/skeletal";
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

/** Kick side for left/right leg distinction */
export type KickSide = "left" | "right";

/**
 * Apply basic kick phase to a KeyframeConfig with anatomy integration
 * Handles common kick phase bones: hip, knee, supportKnee, pelvis, ankle
 * Now includes automatic foot highlighting for kick visualization
 *
 * @param kf - KeyframeConfig to apply phase to
 * @param phase - Basic kick phase data (CHAMBER, EXTENSION, HIGH_PEAK)
 * @param options - Configuration including anatomy options
 *
 * @example
 * ```typescript
 * // Apply kick with automatic foot highlight
 * applyKickPhaseToConfig(kf, KICK_PHASES.EXTENSION, {
 *   highlightKickingFoot: true
 * });
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
    // Anatomy integration
    readonly side?: KickSide;
    readonly highlightKickingFoot?: boolean;
  } = {}
): void {
  const {
    includeAnkle = false,
    includePelvis = true,
    resetFoot = false,
    side = "right",
    highlightKickingFoot = false,
  } = options;

  // Select bones based on kicking leg
  const hipBone = side === "right" ? BoneName.HIP_R : BoneName.HIP_L;
  const kneeBone = side === "right" ? BoneName.KNEE_R : BoneName.KNEE_L;
  const footBone = side === "right" ? BoneName.FOOT_R : BoneName.FOOT_L;
  const supportKneeBone = side === "right" ? BoneName.KNEE_L : BoneName.KNEE_R;

  // Required bones for all kick phases
  kf.rotate(hipBone, phase.hip[0], phase.hip[1], phase.hip[2]);
  kf.rotate(kneeBone, phase.knee[0], phase.knee[1], phase.knee[2]);

  if (phase.supportKnee) {
    kf.rotate(
      supportKneeBone,
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
    kf.rotate(footBone, phase.ankle[0], phase.ankle[1], phase.ankle[2]);
  }

  // Reset foot position
  if (resetFoot) {
    kf.rotate(footBone, 0, 0, 0);
  }

  // Anatomy integration: Highlight kicking foot
  if (highlightKickingFoot) {
    kf.setFootHighlight(side, true);
  }
}

/**
 * Apply roundhouse-specific kick phase with anatomy integration
 * Includes pelvisY and spineY single-axis rotations
 *
 * @param kf - KeyframeConfig to apply phase to
 * @param phase - Rotational kick phase data (ROUNDHOUSE_CHAMBER)
 * @param options - Configuration including anatomy options
 *
 * @korean 돌려차기단계적용
 */
export function applyRoundhousePhaseToConfig(
  kf: KeyframeConfig,
  phase: RotationalKickPhase,
  options: {
    readonly side?: KickSide;
    readonly highlightKickingFoot?: boolean;
  } = {}
): void {
  const { side = "right", highlightKickingFoot = false } = options;

  const hipBone = side === "right" ? BoneName.HIP_R : BoneName.HIP_L;
  const kneeBone = side === "right" ? BoneName.KNEE_R : BoneName.KNEE_L;

  kf.rotate(hipBone, phase.hip[0], phase.hip[1], phase.hip[2]);
  kf.rotate(kneeBone, phase.knee[0], phase.knee[1], phase.knee[2]);

  // Y-axis only rotations for roundhouse
  if (phase.pelvisY !== undefined) {
    kf.rotate(BoneName.PELVIS, 0, phase.pelvisY, 0);
  }
  if (phase.spineY !== undefined) {
    kf.rotate(BoneName.SPINE_UPPER, 0, phase.spineY, 0);
  }

  // Anatomy integration
  if (highlightKickingFoot) {
    kf.setFootHighlight(side, true);
  }
}

/**
 * Apply side kick phase with anatomy integration
 * Includes pelvisY, spineY, and spineLean
 *
 * @param kf - KeyframeConfig to apply phase to
 * @param phase - Rotational kick phase data (SIDE_CHAMBER)
 * @param options - Configuration including anatomy options
 *
 * @korean 옆차기단계적용
 */
export function applySideKickPhaseToConfig(
  kf: KeyframeConfig,
  phase: RotationalKickPhase,
  options: {
    readonly side?: KickSide;
    readonly highlightKickingFoot?: boolean;
  } = {}
): void {
  const { side = "right", highlightKickingFoot = false } = options;

  const hipBone = side === "right" ? BoneName.HIP_R : BoneName.HIP_L;
  const kneeBone = side === "right" ? BoneName.KNEE_R : BoneName.KNEE_L;

  kf.rotate(hipBone, phase.hip[0], phase.hip[1], phase.hip[2]);
  kf.rotate(kneeBone, phase.knee[0], phase.knee[1], phase.knee[2]);

  // Side kick specific rotations
  if (phase.pelvisY !== undefined) {
    kf.rotate(BoneName.PELVIS, 0, phase.pelvisY, 0);
  }
  if (phase.spineY !== undefined) {
    const lean = phase.spineLean ?? 0;
    kf.rotate(BoneName.SPINE_LOWER, 0, phase.spineY, 0);
    kf.rotate(BoneName.SPINE_UPPER, 0, phase.spineY, lean);
  }

  // Anatomy integration
  if (highlightKickingFoot) {
    kf.setFootHighlight(side, true);
  }
}

/**
 * Apply high peak phase (axe kick rise) with anatomy integration
 * Includes full pelvis tuple and support knee
 *
 * @param kf - KeyframeConfig to apply phase to
 * @param phase - Basic kick phase data (HIGH_PEAK)
 * @param options - Configuration including anatomy options
 *
 * @korean 높이올리기단계적용
 */
export function applyHighPeakPhaseToConfig(
  kf: KeyframeConfig,
  phase: BasicKickPhase,
  options: {
    readonly side?: KickSide;
    readonly highlightKickingFoot?: boolean;
  } = {}
): void {
  const { side = "right", highlightKickingFoot = false } = options;

  const hipBone = side === "right" ? BoneName.HIP_R : BoneName.HIP_L;
  const kneeBone = side === "right" ? BoneName.KNEE_R : BoneName.KNEE_L;
  const footBone = side === "right" ? BoneName.FOOT_R : BoneName.FOOT_L;
  const supportKneeBone = side === "right" ? BoneName.KNEE_L : BoneName.KNEE_R;

  kf.rotate(hipBone, phase.hip[0], phase.hip[1], phase.hip[2]);
  kf.rotate(kneeBone, phase.knee[0], phase.knee[1], phase.knee[2]);

  if (phase.ankle) {
    kf.rotate(footBone, phase.ankle[0], phase.ankle[1], phase.ankle[2]);
  }
  if (phase.supportKnee) {
    kf.rotate(
      supportKneeBone,
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

  // Anatomy integration
  if (highlightKickingFoot) {
    kf.setFootHighlight(side, true);
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
