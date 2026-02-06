/**
 * Punch Phase Application Utilities
 *
 * Utilities for applying punch phase poses to keyframes with integrated
 * anatomy awareness (hand poses and highlighting for strikes).
 * 주먹 단계 적용 유틸리티 (해부학 통합)
 *
 * @module systems/animation/PunchPhaseApplicator
 * @korean 주먹단계적용기
 */

import { BoneName } from "@/types/skeletal";
import type { HandHighlightMode, KeyframeConfig } from "./KeyframeConfig";
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

/** Punch hand side */
export type PunchSide = "left" | "right";

/**
 * Apply punch phase to a KeyframeConfig with Korean martial arts biomechanics
 * and anatomy integration (hand poses, highlighting).
 *
 * Handles common punch phase bones: shoulder, elbow, wrist, spine, pelvis
 * Now includes opposite arm hikite (당기기) and automatic hand pose/highlight
 *
 * @param kf - KeyframeConfig to apply phase to
 * @param phase - Punch phase data from PUNCH_PHASES
 * @param hand - Which hand is punching ("left" | "right")
 * @param options - Configuration including anatomy options
 *
 * @example
 * ```typescript
 * // Apply extension with automatic fist pose and knuckle highlight
 * applyPunchPhaseToConfig(kf, PUNCH_PHASES.EXTENSION, "right", {
 *   handPose: "fist",
 *   handHighlightMode: "knuckles",
 *   includeOppositeArm: true
 * });
 * ```
 *
 * @korean KeyframeConfig에주먹단계적용
 */
export function applyPunchPhaseToConfig(
  kf: KeyframeConfig,
  phase: PunchPhase,
  hand: PunchSide = "right",
  options: {
    readonly includeWrist?: boolean;
    readonly includeSpineMiddle?: boolean;
    readonly includeOppositeArm?: boolean;
    // Anatomy integration
    readonly handPose?: string;
    readonly handHighlightMode?: HandHighlightMode;
    readonly oppositeHandPose?: string;
  } = {},
): void {
  const {
    includeWrist = false,
    includeSpineMiddle = false,
    includeOppositeArm = true,
    handPose,
    handHighlightMode,
    oppositeHandPose,
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

  // ═══════════════════════════════════════════════════════════════════════════
  // ARM MIRRORING (팔 좌우 반전)
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // PUNCH_PHASES arm values use LEFT-arm convention:
  //   Left arm: negative Z = flexion (toward body), negative Z shoulder = pulled back
  //   Right arm: positive Z = flexion (toward body), positive Z shoulder = pulled back
  //
  // PUNCH_PHASES opposite arm values use RIGHT-arm convention.
  //
  // When applying to the opposite side, Y and Z must be negated to mirror correctly.
  // The X axis (elevation/flexion) stays the same for both sides.
  //
  // 한국 무술 생체역학: 좌우 대칭 반전으로 정확한 자세 구현
  const armMirror = hand === "right" ? -1 : 1;

  // Apply punching arm shoulder rotation (with mirroring)
  if (phase.shoulder) {
    kf.rotate(
      shoulderBone,
      phase.shoulder[0],
      phase.shoulder[1] * armMirror,
      phase.shoulder[2] * armMirror,
    );
  }

  // Apply punching arm elbow rotation (with mirroring)
  if (phase.elbow) {
    kf.rotate(
      elbowBone,
      phase.elbow[0],
      phase.elbow[1],
      phase.elbow[2] * armMirror,
    );
  }

  // Optional punching arm wrist rotation (with mirroring)
  if (includeWrist && phase.wrist) {
    kf.rotate(
      wristBone,
      phase.wrist[0],
      phase.wrist[1],
      phase.wrist[2] * armMirror,
    );
  }

  // Apply opposite arm hikite (당기기 - pulling hand for power generation)
  // Opposite arm values are in RIGHT convention; mirror when applying to LEFT arm
  if (includeOppositeArm) {
    if (phase.oppositeShoulder) {
      kf.rotate(
        oppositeShoulderBone,
        phase.oppositeShoulder[0],
        phase.oppositeShoulder[1] * armMirror,
        phase.oppositeShoulder[2] * armMirror,
      );
    }

    if (phase.oppositeElbow) {
      kf.rotate(
        oppositeElbowBone,
        phase.oppositeElbow[0],
        phase.oppositeElbow[1],
        phase.oppositeElbow[2] * armMirror,
      );
    }

    if (includeWrist && phase.oppositeWrist) {
      kf.rotate(
        oppositeWristBone,
        phase.oppositeWrist[0],
        phase.oppositeWrist[1],
        phase.oppositeWrist[2] * armMirror,
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SPINE/PELVIS Y-AXIS MIRRORING (척추/골반 회전 반전)
  // ═══════════════════════════════════════════════════════════════════════════
  //
  // PUNCH_PHASES spine/pelvis Y values use RIGHT-hand convention:
  //   Positive Y = counter-clockwise from above = drives RIGHT shoulder forward
  //   For LEFT-hand punches, Y must be negated to drive LEFT shoulder forward
  //
  // 한국 무술: 허리비틀기 (Hip rotation) 좌우 반전
  const spineFlip = hand === "right" ? 1 : -1;

  if (phase.spineY !== undefined) {
    kf.rotate(BoneName.SPINE_UPPER, 0, phase.spineY * spineFlip, 0);
    if (includeSpineMiddle) {
      kf.rotate(BoneName.SPINE_MIDDLE, 0, phase.spineY * 0.7 * spineFlip, 0);
    }
  }
  if (phase.pelvisY !== undefined) {
    kf.rotate(BoneName.PELVIS, 0, phase.pelvisY * spineFlip, 0);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ANATOMY INTEGRATION (해부학 통합)
  // ═══════════════════════════════════════════════════════════════════════════

  // Set punching hand pose and highlight
  if (handPose) {
    if (hand === "right") {
      kf.setRightHandPose(handPose, handHighlightMode);
    } else {
      kf.setLeftHandPose(handPose, handHighlightMode);
    }
  }

  // Set opposite hand pose (guard position)
  if (oppositeHandPose) {
    if (hand === "right") {
      kf.setLeftHandPose(oppositeHandPose);
    } else {
      kf.setRightHandPose(oppositeHandPose);
    }
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
