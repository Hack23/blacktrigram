/**
 * Trigram Guard Applicator
 *
 * Applies full trigram-specific guard poses to animation keyframes.
 * Unlike the generic `withGuard()` method that only sets arm positions,
 * this applicator sets the complete body position including:
 * - Arms (shoulder, elbow, wrist)
 * - Legs (hip, knee, ankle)
 * - Torso and pelvis rotation
 *
 * This ensures that walk/run/idle animations maintain proper
 * trigram-specific guard positions for authentic Korean martial arts movement.
 *
 * @module systems/animation/builders/TrigramGuardApplicator
 * @korean 팔괘방어자세적용기
 */

import { TrigramStance } from "@/types/common";
import type { StanceGuardPose } from "@/types/skeletal";
import { BoneName } from "@/types/skeletal";
import type { StanceLaterality } from "../../trigram/types";
import {
  GAM_WATER_GUARD_POSE,
  GAN_MOUNTAIN_GUARD_POSE,
  GEON_HIGH_GUARD_POSE,
  getGuardPoseForStance,
  GON_EARTH_GUARD_POSE,
  JIN_THUNDER_GUARD_POSE,
  LI_FIRE_GUARD_POSE,
  SON_WIND_GUARD_POSE,
  TAE_FLUID_GUARD_POSE,
} from "../catalogs/StanceGuardPoses";
import type { KeyframeConfig } from "./KeyframeConfig";

// ═══════════════════════════════════════════════════════════════════════════
// DIRECT GUARD POSE ACCESS MAP (For performance in locomotion)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Direct access to guard poses by trigram stance name
 * Avoids repeated function calls in animation loops
 *
 * @korean 방어자세직접접근맵
 */
export const TRIGRAM_GUARD_POSES: Readonly<
  Record<TrigramStance, StanceGuardPose>
> = {
  [TrigramStance.GEON]: GEON_HIGH_GUARD_POSE,
  [TrigramStance.TAE]: TAE_FLUID_GUARD_POSE,
  [TrigramStance.LI]: LI_FIRE_GUARD_POSE,
  [TrigramStance.JIN]: JIN_THUNDER_GUARD_POSE,
  [TrigramStance.SON]: SON_WIND_GUARD_POSE,
  [TrigramStance.GAM]: GAM_WATER_GUARD_POSE,
  [TrigramStance.GAN]: GAN_MOUNTAIN_GUARD_POSE,
  [TrigramStance.GON]: GON_EARTH_GUARD_POSE,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// APPLICATION OPTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Options for applying trigram guard pose
 *
 * @korean 팔괘방어자세적용옵션
 */
export interface TrigramGuardOptions {
  /** Apply arm positions (shoulder, elbow, wrist) */
  readonly includeArms?: boolean;
  /** Apply leg positions (hip, knee, ankle) */
  readonly includeLegs?: boolean;
  /** Apply torso rotation */
  readonly includeTorso?: boolean;
  /** Apply pelvis rotation */
  readonly includePelvis?: boolean;
  /** Blend factor 0-1 for partial application (locomotion blending) */
  readonly blendFactor?: number;
  /** Stance laterality ("left" or "right") */
  readonly laterality?: StanceLaterality;
}

/**
 * Default options for full guard pose application
 */
const DEFAULT_OPTIONS: Required<TrigramGuardOptions> = {
  includeArms: true,
  includeLegs: true,
  includeTorso: true,
  includePelvis: true,
  blendFactor: 1.0,
  laterality: "right",
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CORE APPLICATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Apply trigram-specific guard pose to a KeyframeConfig
 *
 * Sets the complete body position for the specified trigram stance,
 * including arms, legs, torso, and pelvis. This creates authentic
 * Korean martial arts posture for each of the eight trigram stances.
 *
 * @param config - KeyframeConfig to apply guard pose to
 * @param stance - Trigram stance (e.g., TrigramStance.GEON)
 * @param options - Application options
 *
 * @example
 * ```typescript
 * // Full guard pose application
 * applyTrigramGuardToConfig(kf, TrigramStance.GEON);
 *
 * // Arms only (for locomotion that sets its own leg positions)
 * applyTrigramGuardToConfig(kf, TrigramStance.GEON, {
 *   includeLegs: false,
 *   includePelvis: false
 * });
 *
 * // Blended for walk cycle transitions
 * applyTrigramGuardToConfig(kf, TrigramStance.TAE, {
 *   blendFactor: 0.7
 * });
 * ```
 *
 * @korean 팔괘방어자세설정적용
 */
export function applyTrigramGuardToConfig(
  config: KeyframeConfig,
  stance: TrigramStance,
  options: TrigramGuardOptions = {},
): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Get guard pose for stance and laterality
  const guardPose =
    opts.laterality === "right"
      ? TRIGRAM_GUARD_POSES[stance]
      : getGuardPoseForStance(stance, opts.laterality);

  if (!guardPose) {
    console.warn(
      `[TrigramGuardApplicator] No guard pose found for stance: ${stance}`,
    );
    return;
  }

  const blend = opts.blendFactor;

  // Apply arm positions
  if (opts.includeArms) {
    applyArmsToConfig(config, guardPose, blend);
  }

  // Apply leg positions
  if (opts.includeLegs) {
    applyLegsToConfig(config, guardPose, blend);
  }

  // Apply torso rotation
  if (opts.includeTorso) {
    config.rotate(
      BoneName.SPINE_UPPER,
      guardPose.torso.x * blend,
      guardPose.torso.y * blend,
      guardPose.torso.z * blend,
    );
  }

  // Apply pelvis rotation
  if (opts.includePelvis) {
    config.rotate(
      BoneName.PELVIS,
      guardPose.pelvis.x * blend,
      guardPose.pelvis.y * blend,
      guardPose.pelvis.z * blend,
    );
  }
}

/**
 * Apply arm positions from guard pose to config
 */
function applyArmsToConfig(
  config: KeyframeConfig,
  guardPose: StanceGuardPose,
  blend: number,
): void {
  // Left arm
  config.rotate(
    BoneName.SHOULDER_L,
    guardPose.leftArm.shoulder.x * blend,
    guardPose.leftArm.shoulder.y * blend,
    guardPose.leftArm.shoulder.z * blend,
  );
  config.rotate(
    BoneName.ELBOW_L,
    guardPose.leftArm.elbow.x * blend,
    guardPose.leftArm.elbow.y * blend,
    guardPose.leftArm.elbow.z * blend,
  );
  config.rotate(
    BoneName.WRIST_L,
    guardPose.leftArm.wrist.x * blend,
    guardPose.leftArm.wrist.y * blend,
    guardPose.leftArm.wrist.z * blend,
  );

  // Right arm
  config.rotate(
    BoneName.SHOULDER_R,
    guardPose.rightArm.shoulder.x * blend,
    guardPose.rightArm.shoulder.y * blend,
    guardPose.rightArm.shoulder.z * blend,
  );
  config.rotate(
    BoneName.ELBOW_R,
    guardPose.rightArm.elbow.x * blend,
    guardPose.rightArm.elbow.y * blend,
    guardPose.rightArm.elbow.z * blend,
  );
  config.rotate(
    BoneName.WRIST_R,
    guardPose.rightArm.wrist.x * blend,
    guardPose.rightArm.wrist.y * blend,
    guardPose.rightArm.wrist.z * blend,
  );
}

/**
 * Apply leg positions from guard pose to config
 */
function applyLegsToConfig(
  config: KeyframeConfig,
  guardPose: StanceGuardPose,
  blend: number,
): void {
  // Left leg
  config.rotate(
    BoneName.HIP_L,
    guardPose.leftLeg.hip.x * blend,
    guardPose.leftLeg.hip.y * blend,
    guardPose.leftLeg.hip.z * blend,
  );
  config.rotate(
    BoneName.KNEE_L,
    guardPose.leftLeg.knee.x * blend,
    guardPose.leftLeg.knee.y * blend,
    guardPose.leftLeg.knee.z * blend,
  );
  config.rotate(
    BoneName.FOOT_L,
    guardPose.leftLeg.ankle.x * blend,
    guardPose.leftLeg.ankle.y * blend,
    guardPose.leftLeg.ankle.z * blend,
  );

  // Right leg
  config.rotate(
    BoneName.HIP_R,
    guardPose.rightLeg.hip.x * blend,
    guardPose.rightLeg.hip.y * blend,
    guardPose.rightLeg.hip.z * blend,
  );
  config.rotate(
    BoneName.KNEE_R,
    guardPose.rightLeg.knee.x * blend,
    guardPose.rightLeg.knee.y * blend,
    guardPose.rightLeg.knee.z * blend,
  );
  config.rotate(
    BoneName.FOOT_R,
    guardPose.rightLeg.ankle.x * blend,
    guardPose.rightLeg.ankle.y * blend,
    guardPose.rightLeg.ankle.z * blend,
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// GUARD ARM HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get guard arm base rotations without swing for a trigram
 *
 * Returns the base arm position for the trigram's guard pose.
 * Use this when you want to manually add swing offsets.
 *
 * @param stance - Trigram stance
 * @returns Left and right arm base rotations
 *
 * @korean 팔자세베이스가져오기
 */
export function getGuardArmBase(stance: TrigramStance): {
  left: {
    shoulder: [number, number, number];
    elbow: [number, number, number];
  };
  right: {
    shoulder: [number, number, number];
    elbow: [number, number, number];
  };
} {
  const guardPose = TRIGRAM_GUARD_POSES[stance];
  if (!guardPose) {
    // Fallback neutral guard
    return {
      left: { shoulder: [-0.6, 0.4, 0.3], elbow: [0, 0, -1.6] },
      right: { shoulder: [-0.6, -0.4, -0.3], elbow: [0, 0, 1.6] },
    };
  }

  return {
    left: {
      shoulder: [
        guardPose.leftArm.shoulder.x,
        guardPose.leftArm.shoulder.y,
        guardPose.leftArm.shoulder.z,
      ],
      elbow: [
        guardPose.leftArm.elbow.x,
        guardPose.leftArm.elbow.y,
        guardPose.leftArm.elbow.z,
      ],
    },
    right: {
      shoulder: [
        guardPose.rightArm.shoulder.x,
        guardPose.rightArm.shoulder.y,
        guardPose.rightArm.shoulder.z,
      ],
      elbow: [
        guardPose.rightArm.elbow.x,
        guardPose.rightArm.elbow.y,
        guardPose.rightArm.elbow.z,
      ],
    },
  };
}
