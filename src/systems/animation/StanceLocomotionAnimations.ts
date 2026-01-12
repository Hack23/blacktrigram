/**
 * Stance-Specific Locomotion Animations Module
 *
 * Trigram-specific idle, walk, and run animations for each of the eight stances.
 * Each trigram has unique movement characteristics reflecting its philosophy:
 *
 * ☰ Geon (Heaven): Direct, powerful movements
 * ☱ Tae (Lake): Fluid, adaptive movements
 * ☲ Li (Fire): Quick, precise movements
 * ☳ Jin (Thunder): Explosive, sudden movements
 * ☴ Son (Wind): Continuous, flowing movements
 * ☵ Gam (Water): Adaptive, redirecting movements
 * ☶ Gan (Mountain): Stable, grounded movements
 * ☷ Gon (Earth): Heavy, rooted movements
 *
 * @module systems/animation/StanceLocomotionAnimations
 * @korean 자세별이동애니메이션
 */

import type { SkeletalAnimation } from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";
import { MartialArtsAnimationBuilder } from "./MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// ☰ GEON (건) - HEAVEN: Direct, Powerful Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Geon Walk - 건보법
 * Forward-weighted walk with high guard, authoritative stride
 */
export const GEON_WALK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("walk_geon", "건보법")
    .asMovement(0.75, true)
    // Start: Right foot forward, left arm forward (high guard maintained)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.1, 0.05, 0)
    .rotate(BoneName.HIP_L, -0.25, 0, 0)
    .rotate(BoneName.KNEE_L, -0.15, 0, 0)
    .rotate(BoneName.HIP_R, 0.35, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    // High guard arms - minimal swing
    .rotate(BoneName.SHOULDER_L, -0.4, 0, -0.3)
    .rotate(BoneName.ELBOW_L, -1.2, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.5, 0, 0.3)
    .rotate(BoneName.ELBOW_R, -1.0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.05, 0, 0)
    .position(BoneName.PELVIS, 0, 0.02, 0.02)
    .done<MartialArtsAnimationBuilder>()
    // Mid stride
    .at(0.375, "linear")
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.HIP_L, 0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.6, 0, 0)
    .rotate(BoneName.HIP_R, -0.1, 0, 0)
    .rotate(BoneName.KNEE_R, -0.15, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.3)
    .rotate(BoneName.SHOULDER_R, -0.45, 0, 0.3)
    .position(BoneName.PELVIS, 0, 0.04, 0.02)
    .done<MartialArtsAnimationBuilder>()
    // Left foot forward
    .at(0.75, "ease-out")
    .rotate(BoneName.PELVIS, 0.1, -0.05, 0)
    .rotate(BoneName.HIP_R, -0.25, 0, 0)
    .rotate(BoneName.KNEE_R, -0.15, 0, 0)
    .rotate(BoneName.HIP_L, 0.35, 0, 0)
    .rotate(BoneName.KNEE_L, -0.25, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.4, 0, 0.3)
    .rotate(BoneName.SHOULDER_L, -0.5, 0, -0.3)
    .position(BoneName.PELVIS, 0, 0.02, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Geon Run - 건질주
 * Powerful forward charge with aggressive posture
 */
export const GEON_RUN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("run_geon", "건질주")
    .asMovement(0.45, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.2, 0.08, 0)
    .rotate(BoneName.HIP_L, -0.5, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.HIP_R, 0.7, 0, 0)
    .rotate(BoneName.KNEE_R, -1.0, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.4, 0, 0)
    .rotate(BoneName.ELBOW_L, -1.5, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.6, 0, 0)
    .rotate(BoneName.ELBOW_R, -1.3, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.15, 0, 0)
    .position(BoneName.PELVIS, 0, 0.05, 0.05)
    .done<MartialArtsAnimationBuilder>()
    .at(0.225, "linear")
    .rotate(BoneName.PELVIS, 0.15, 0, 0)
    .rotate(BoneName.HIP_L, 0.2, 0, 0)
    .rotate(BoneName.KNEE_L, -1.2, 0, 0)
    .rotate(BoneName.HIP_R, -0.3, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .position(BoneName.PELVIS, 0, 0.08, 0.05)
    .done<MartialArtsAnimationBuilder>()
    .at(0.45, "ease-out")
    .rotate(BoneName.PELVIS, 0.2, -0.08, 0)
    .rotate(BoneName.HIP_R, -0.5, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.HIP_L, 0.7, 0, 0)
    .rotate(BoneName.KNEE_L, -1.0, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.4, 0, 0)
    .rotate(BoneName.ELBOW_R, -1.5, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.6, 0, 0)
    .rotate(BoneName.ELBOW_L, -1.3, 0, 0)
    .position(BoneName.PELVIS, 0, 0.05, 0.05)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☱ TAE (태) - LAKE: Fluid, Adaptive Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tae Walk - 태보법
 * Light, cat-like walk with 90/10 weight on back foot
 */
export const TAE_WALK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("walk_tae", "태보법")
    .asMovement(0.85, true)
    .at(0.0, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.05, 0.08, 0)
    .rotate(BoneName.HIP_L, -0.15, 0, -0.1)
    .rotate(BoneName.KNEE_L, -0.4, 0, 0)
    .rotate(BoneName.HIP_R, 0.2, 0, 0.1)
    .rotate(BoneName.KNEE_R, -0.1, 0, 0)
    .rotate(BoneName.FOOT_R, 0.2, 0, 0)
    // Fluid guard - hands ready for grappling
    .rotate(BoneName.SHOULDER_L, -0.2, 0, -0.4)
    .rotate(BoneName.ELBOW_L, -0.8, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.3, 0, 0.4)
    .rotate(BoneName.ELBOW_R, -0.9, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.05, 0)
    .position(BoneName.PELVIS, 0, -0.02, -0.02)
    .done<MartialArtsAnimationBuilder>()
    .at(0.425, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.03, 0, 0)
    .rotate(BoneName.HIP_L, 0.15, 0, 0)
    .rotate(BoneName.KNEE_L, -0.5, 0, 0)
    .rotate(BoneName.HIP_R, -0.1, 0, 0)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .position(BoneName.PELVIS, 0, 0.01, -0.02)
    .done<MartialArtsAnimationBuilder>()
    .at(0.85, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.05, -0.08, 0)
    .rotate(BoneName.HIP_R, -0.15, 0, 0.1)
    .rotate(BoneName.KNEE_R, -0.4, 0, 0)
    .rotate(BoneName.HIP_L, 0.2, 0, -0.1)
    .rotate(BoneName.KNEE_L, -0.1, 0, 0)
    .rotate(BoneName.FOOT_L, 0.2, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, -0.05, 0)
    .position(BoneName.PELVIS, 0, -0.02, -0.02)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Tae Run - 태질주
 * Flowing, evasive run with quick direction changes
 */
export const TAE_RUN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("run_tae", "태질주")
    .asMovement(0.5, true)
    .at(0.0, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.12, 0.1, 0)
    .rotate(BoneName.HIP_L, -0.4, 0, 0)
    .rotate(BoneName.KNEE_L, -0.3, 0, 0)
    .rotate(BoneName.HIP_R, 0.6, 0, 0)
    .rotate(BoneName.KNEE_R, -0.8, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.2, 0, -0.3)
    .rotate(BoneName.ELBOW_L, -1.0, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.4, 0, 0.3)
    .rotate(BoneName.ELBOW_R, -0.9, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.05, 0.05, 0)
    .position(BoneName.PELVIS, 0, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.25, "linear")
    .rotate(BoneName.PELVIS, 0.1, 0, 0)
    .rotate(BoneName.HIP_L, 0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -1.0, 0, 0)
    .rotate(BoneName.HIP_R, -0.2, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .position(BoneName.PELVIS, 0, 0.06, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.5, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.12, -0.1, 0)
    .rotate(BoneName.HIP_R, -0.4, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .rotate(BoneName.HIP_L, 0.6, 0, 0)
    .rotate(BoneName.KNEE_L, -0.8, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.2, 0, 0.3)
    .rotate(BoneName.SHOULDER_L, -0.4, 0, -0.3)
    .rotate(BoneName.SPINE_UPPER, 0.05, -0.05, 0)
    .position(BoneName.PELVIS, 0, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☲ LI (리) - FIRE: Quick, Precise Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Li Walk - 리보법
 * Quick, bouncy walk with rapid foot placement
 */
export const LI_WALK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("walk_li", "리보법")
    .asMovement(0.65, true)
    .at(0.0, "linear")
    .rotate(BoneName.PELVIS, 0.08, 0.06, 0)
    .rotate(BoneName.HIP_L, -0.2, 0, 0)
    .rotate(BoneName.KNEE_L, -0.15, 0, 0)
    .rotate(BoneName.HIP_R, 0.3, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.15, 0, -0.2)
    .rotate(BoneName.ELBOW_L, -0.6, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.2, 0, 0.2)
    .rotate(BoneName.ELBOW_R, -0.7, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.03, 0, 0)
    .position(BoneName.PELVIS, 0, 0.03, 0.01)
    .done<MartialArtsAnimationBuilder>()
    .at(0.325, "linear")
    .rotate(BoneName.PELVIS, 0.05, 0, 0)
    .rotate(BoneName.HIP_L, 0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.5, 0, 0)
    .rotate(BoneName.HIP_R, -0.1, 0, 0)
    .rotate(BoneName.KNEE_R, -0.12, 0, 0)
    .position(BoneName.PELVIS, 0, 0.05, 0.01)
    .done<MartialArtsAnimationBuilder>()
    .at(0.65, "linear")
    .rotate(BoneName.PELVIS, 0.08, -0.06, 0)
    .rotate(BoneName.HIP_R, -0.2, 0, 0)
    .rotate(BoneName.KNEE_R, -0.15, 0, 0)
    .rotate(BoneName.HIP_L, 0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.15, 0, 0.2)
    .rotate(BoneName.SHOULDER_L, -0.2, 0, -0.2)
    .position(BoneName.PELVIS, 0, 0.03, 0.01)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Li Run - 리질주
 * Explosive sprint with precision footwork
 */
export const LI_RUN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("run_li", "리질주")
    .asMovement(0.4, true)
    .at(0.0, "linear")
    .rotate(BoneName.PELVIS, 0.18, 0.08, 0)
    .rotate(BoneName.HIP_L, -0.45, 0, 0)
    .rotate(BoneName.KNEE_L, -0.25, 0, 0)
    .rotate(BoneName.HIP_R, 0.65, 0, 0)
    .rotate(BoneName.KNEE_R, -0.95, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.35, 0, 0)
    .rotate(BoneName.ELBOW_L, -1.3, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.5, 0, 0)
    .rotate(BoneName.ELBOW_R, -1.2, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.12, 0, 0)
    .position(BoneName.PELVIS, 0, 0.06, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .at(0.2, "linear")
    .rotate(BoneName.PELVIS, 0.12, 0, 0)
    .rotate(BoneName.HIP_L, 0.25, 0, 0)
    .rotate(BoneName.KNEE_L, -1.15, 0, 0)
    .rotate(BoneName.HIP_R, -0.25, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .position(BoneName.PELVIS, 0, 0.09, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .at(0.4, "linear")
    .rotate(BoneName.PELVIS, 0.18, -0.08, 0)
    .rotate(BoneName.HIP_R, -0.45, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.HIP_L, 0.65, 0, 0)
    .rotate(BoneName.KNEE_L, -0.95, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.35, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.5, 0, 0)
    .position(BoneName.PELVIS, 0, 0.06, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☳ JIN (진) - THUNDER: Explosive, Sudden Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jin Walk - 진보법
 * Explosive step-and-ready walk, prepared to strike
 */
export const JIN_WALK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("walk_jin", "진보법")
    .asMovement(0.7, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.12, 0.06, 0)
    .rotate(BoneName.HIP_L, -0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -0.2, 0, 0)
    .rotate(BoneName.HIP_R, 0.4, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.1, 0, -0.5)
    .rotate(BoneName.ELBOW_L, -0.9, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.2, 0, 0.5)
    .rotate(BoneName.ELBOW_R, -1.1, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.08, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.05, 0, 0)
    .position(BoneName.PELVIS, 0, -0.01, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .at(0.35, "ease-in")
    .rotate(BoneName.PELVIS, 0.08, 0, 0)
    .rotate(BoneName.HIP_L, 0.15, 0, 0)
    .rotate(BoneName.KNEE_L, -0.6, 0, 0)
    .rotate(BoneName.HIP_R, -0.15, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .position(BoneName.PELVIS, 0, 0.02, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .at(0.7, "ease-out")
    .rotate(BoneName.PELVIS, 0.12, -0.06, 0)
    .rotate(BoneName.HIP_R, -0.3, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .rotate(BoneName.HIP_L, 0.4, 0, 0)
    .rotate(BoneName.KNEE_L, -0.3, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.1, 0, 0.5)
    .rotate(BoneName.SHOULDER_L, 0.2, 0, -0.5)
    .position(BoneName.PELVIS, 0, -0.01, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Jin Run - 진질주
 * Thunderous charge with explosive power
 */
export const JIN_RUN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("run_jin", "진질주")
    .asMovement(0.42, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.22, 0.1, 0)
    .rotate(BoneName.HIP_L, -0.55, 0, 0)
    .rotate(BoneName.KNEE_L, -0.3, 0, 0)
    .rotate(BoneName.HIP_R, 0.75, 0, 0)
    .rotate(BoneName.KNEE_R, -1.1, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.5, 0, 0)
    .rotate(BoneName.ELBOW_L, -1.6, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.7, 0, 0)
    .rotate(BoneName.ELBOW_R, -1.4, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.18, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0)
    .position(BoneName.PELVIS, 0, 0.04, 0.06)
    .done<MartialArtsAnimationBuilder>()
    .at(0.21, "linear")
    .rotate(BoneName.PELVIS, 0.16, 0, 0)
    .rotate(BoneName.HIP_L, 0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -1.25, 0, 0)
    .rotate(BoneName.HIP_R, -0.35, 0, 0)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .position(BoneName.PELVIS, 0, 0.08, 0.06)
    .done<MartialArtsAnimationBuilder>()
    .at(0.42, "ease-out")
    .rotate(BoneName.PELVIS, 0.22, -0.1, 0)
    .rotate(BoneName.HIP_R, -0.55, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .rotate(BoneName.HIP_L, 0.75, 0, 0)
    .rotate(BoneName.KNEE_L, -1.1, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.5, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.7, 0, 0)
    .position(BoneName.PELVIS, 0, 0.04, 0.06)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☴ SON (손) - WIND: Continuous, Flowing Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Son Walk - 손보법
 * Gentle, continuous flow walk like wind through trees
 */
export const SON_WALK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("walk_son", "손보법")
    .asMovement(0.9, true)
    .at(0.0, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.06, 0.04, 0)
    .rotate(BoneName.HIP_L, -0.18, 0, 0)
    .rotate(BoneName.KNEE_L, -0.12, 0, 0)
    .rotate(BoneName.HIP_R, 0.25, 0, 0)
    .rotate(BoneName.KNEE_R, -0.15, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.2, 0.1, -0.3)
    .rotate(BoneName.ELBOW_L, -0.5, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.25, -0.1, 0.3)
    .rotate(BoneName.ELBOW_R, -0.6, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.02, 0.03, 0)
    .position(BoneName.PELVIS, 0, 0.01, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.45, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.04, 0, 0)
    .rotate(BoneName.HIP_L, 0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.4, 0, 0)
    .rotate(BoneName.HIP_R, -0.08, 0, 0)
    .rotate(BoneName.KNEE_R, -0.1, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.1, 0, -0.3)
    .rotate(BoneName.SHOULDER_R, -0.15, 0, 0.3)
    .position(BoneName.PELVIS, 0, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.9, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.06, -0.04, 0)
    .rotate(BoneName.HIP_R, -0.18, 0, 0)
    .rotate(BoneName.KNEE_R, -0.12, 0, 0)
    .rotate(BoneName.HIP_L, 0.25, 0, 0)
    .rotate(BoneName.KNEE_L, -0.15, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.2, -0.1, 0.3)
    .rotate(BoneName.SHOULDER_L, -0.25, 0.1, -0.3)
    .rotate(BoneName.SPINE_UPPER, 0.02, -0.03, 0)
    .position(BoneName.PELVIS, 0, 0.01, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Son Run - 손질주
 * Swift, gliding run like wind rushing
 */
export const SON_RUN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("run_son", "손질주")
    .asMovement(0.48, true)
    .at(0.0, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.14, 0.08, 0)
    .rotate(BoneName.HIP_L, -0.4, 0, 0)
    .rotate(BoneName.KNEE_L, -0.25, 0, 0)
    .rotate(BoneName.HIP_R, 0.6, 0, 0)
    .rotate(BoneName.KNEE_R, -0.85, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.35, 0.1, 0)
    .rotate(BoneName.ELBOW_L, -1.2, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.45, -0.1, 0)
    .rotate(BoneName.ELBOW_R, -1.1, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.08, 0.04, 0)
    .position(BoneName.PELVIS, 0, 0.04, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .at(0.24, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.1, 0, 0)
    .rotate(BoneName.HIP_L, 0.2, 0, 0)
    .rotate(BoneName.KNEE_L, -1.0, 0, 0)
    .rotate(BoneName.HIP_R, -0.2, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .position(BoneName.PELVIS, 0, 0.07, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .at(0.48, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.14, -0.08, 0)
    .rotate(BoneName.HIP_R, -0.4, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.HIP_L, 0.6, 0, 0)
    .rotate(BoneName.KNEE_L, -0.85, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.35, -0.1, 0)
    .rotate(BoneName.SHOULDER_L, -0.45, 0.1, 0)
    .rotate(BoneName.SPINE_UPPER, 0.08, -0.04, 0)
    .position(BoneName.PELVIS, 0, 0.04, 0.02)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☵ GAM (감) - WATER: Adaptive, Redirecting Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gam Walk - 감보법
 * Flowing, adaptive walk that goes around obstacles
 */
export const GAM_WALK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("walk_gam", "감보법")
    .asMovement(0.88, true)
    .at(0.0, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.05, 0.06, 0.02)
    .rotate(BoneName.HIP_L, -0.2, 0, -0.05)
    .rotate(BoneName.KNEE_L, -0.15, 0, 0)
    .rotate(BoneName.HIP_R, 0.28, 0, 0.05)
    .rotate(BoneName.KNEE_R, -0.18, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.15, 0.15, -0.35)
    .rotate(BoneName.ELBOW_L, -0.7, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.2, -0.15, 0.35)
    .rotate(BoneName.ELBOW_R, -0.8, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.04, 0.02)
    .position(BoneName.PELVIS, 0.01, 0, -0.01)
    .done<MartialArtsAnimationBuilder>()
    .at(0.44, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.03, 0, 0)
    .rotate(BoneName.HIP_L, 0.12, 0, 0)
    .rotate(BoneName.KNEE_L, -0.45, 0, 0)
    .rotate(BoneName.HIP_R, -0.1, 0, 0)
    .rotate(BoneName.KNEE_R, -0.12, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0.02, -0.01)
    .done<MartialArtsAnimationBuilder>()
    .at(0.88, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.05, -0.06, -0.02)
    .rotate(BoneName.HIP_R, -0.2, 0, 0.05)
    .rotate(BoneName.KNEE_R, -0.15, 0, 0)
    .rotate(BoneName.HIP_L, 0.28, 0, -0.05)
    .rotate(BoneName.KNEE_L, -0.18, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.15, -0.15, 0.35)
    .rotate(BoneName.SHOULDER_L, -0.2, 0.15, -0.35)
    .rotate(BoneName.SPINE_UPPER, 0, -0.04, -0.02)
    .position(BoneName.PELVIS, -0.01, 0, -0.01)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Gam Run - 감질주
 * Fluid run that flows like water around obstacles
 */
export const GAM_RUN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("run_gam", "감질주")
    .asMovement(0.52, true)
    .at(0.0, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.12, 0.1, 0.03)
    .rotate(BoneName.HIP_L, -0.38, 0, 0)
    .rotate(BoneName.KNEE_L, -0.28, 0, 0)
    .rotate(BoneName.HIP_R, 0.58, 0, 0)
    .rotate(BoneName.KNEE_R, -0.82, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.3, 0.1, 0)
    .rotate(BoneName.ELBOW_L, -1.1, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.4, -0.1, 0)
    .rotate(BoneName.ELBOW_R, -1.0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.06, 0.05, 0.02)
    .position(BoneName.PELVIS, 0.02, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.26, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.08, 0, 0)
    .rotate(BoneName.HIP_L, 0.22, 0, 0)
    .rotate(BoneName.KNEE_L, -0.95, 0, 0)
    .rotate(BoneName.HIP_R, -0.18, 0, 0)
    .rotate(BoneName.KNEE_R, -0.22, 0, 0)
    .position(BoneName.PELVIS, 0, 0.06, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.52, "ease-in-out")
    .rotate(BoneName.PELVIS, 0.12, -0.1, -0.03)
    .rotate(BoneName.HIP_R, -0.38, 0, 0)
    .rotate(BoneName.KNEE_R, -0.28, 0, 0)
    .rotate(BoneName.HIP_L, 0.58, 0, 0)
    .rotate(BoneName.KNEE_L, -0.82, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.3, -0.1, 0)
    .rotate(BoneName.SHOULDER_L, -0.4, 0.1, 0)
    .rotate(BoneName.SPINE_UPPER, 0.06, -0.05, -0.02)
    .position(BoneName.PELVIS, -0.02, 0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☶ GAN (간) - MOUNTAIN: Stable, Grounded Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gan Walk - 간보법
 * Solid, immovable walk with defensive posture
 */
export const GAN_WALK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("walk_gan", "간보법")
    .asMovement(0.95, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.08, 0.04, 0)
    .rotate(BoneName.HIP_L, -0.22, 0, 0)
    .rotate(BoneName.KNEE_L, -0.25, 0, 0)
    .rotate(BoneName.HIP_R, 0.3, 0, 0)
    .rotate(BoneName.KNEE_R, -0.28, 0, 0)
    // Defensive arms close to body
    .rotate(BoneName.SHOULDER_L, -0.3, 0, -0.5)
    .rotate(BoneName.ELBOW_L, -1.3, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.5)
    .rotate(BoneName.ELBOW_R, -1.4, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.04, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.06, 0, 0)
    .position(BoneName.PELVIS, 0, -0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.475, "linear")
    .rotate(BoneName.PELVIS, 0.06, 0, 0)
    .rotate(BoneName.HIP_L, 0.08, 0, 0)
    .rotate(BoneName.KNEE_L, -0.5, 0, 0)
    .rotate(BoneName.HIP_R, -0.05, 0, 0)
    .rotate(BoneName.KNEE_R, -0.2, 0, 0)
    .position(BoneName.PELVIS, 0, -0.01, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.95, "ease-out")
    .rotate(BoneName.PELVIS, 0.08, -0.04, 0)
    .rotate(BoneName.HIP_R, -0.22, 0, 0)
    .rotate(BoneName.KNEE_R, -0.25, 0, 0)
    .rotate(BoneName.HIP_L, 0.3, 0, 0)
    .rotate(BoneName.KNEE_L, -0.28, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.3, 0, 0.5)
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.5)
    .position(BoneName.PELVIS, 0, -0.03, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Gan Run - 간질주
 * Heavy, unstoppable charge like an avalanche
 */
export const GAN_RUN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("run_gan", "간질주")
    .asMovement(0.55, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.18, 0.08, 0)
    .rotate(BoneName.HIP_L, -0.45, 0, 0)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0)
    .rotate(BoneName.HIP_R, 0.65, 0, 0)
    .rotate(BoneName.KNEE_R, -0.9, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.3, 0, -0.3)
    .rotate(BoneName.ELBOW_L, -1.4, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.5, 0, 0.3)
    .rotate(BoneName.ELBOW_R, -1.3, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.12, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0)
    .position(BoneName.PELVIS, 0, 0.02, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .at(0.275, "linear")
    .rotate(BoneName.PELVIS, 0.14, 0, 0)
    .rotate(BoneName.HIP_L, 0.2, 0, 0)
    .rotate(BoneName.KNEE_L, -1.05, 0, 0)
    .rotate(BoneName.HIP_R, -0.25, 0, 0)
    .rotate(BoneName.KNEE_R, -0.3, 0, 0)
    .position(BoneName.PELVIS, 0, 0.05, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .at(0.55, "ease-out")
    .rotate(BoneName.PELVIS, 0.18, -0.08, 0)
    .rotate(BoneName.HIP_R, -0.45, 0, 0)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .rotate(BoneName.HIP_L, 0.65, 0, 0)
    .rotate(BoneName.KNEE_L, -0.9, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.3)
    .rotate(BoneName.SHOULDER_L, -0.5, 0, -0.3)
    .position(BoneName.PELVIS, 0, 0.02, 0.04)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON (곤) - EARTH: Heavy, Rooted Movements
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Walk - 곤보법
 * Heavy, rooted walk with low center of gravity
 */
export const GON_WALK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("walk_gon", "곤보법")
    .asMovement(1.0, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.1, 0.05, 0)
    .rotate(BoneName.HIP_L, -0.25, 0, -0.08)
    .rotate(BoneName.KNEE_L, -0.35, 0, 0)
    .rotate(BoneName.HIP_R, 0.35, 0, 0.08)
    .rotate(BoneName.KNEE_R, -0.38, 0, 0)
    // Low, wide guard
    .rotate(BoneName.SHOULDER_L, -0.1, 0, -0.6)
    .rotate(BoneName.ELBOW_L, -1.0, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.15, 0, 0.6)
    .rotate(BoneName.ELBOW_R, -1.1, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.06, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.1, 0, 0)
    .position(BoneName.PELVIS, 0, -0.06, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.5, "linear")
    .rotate(BoneName.PELVIS, 0.08, 0, 0)
    .rotate(BoneName.HIP_L, 0.1, 0, 0)
    .rotate(BoneName.KNEE_L, -0.55, 0, 0)
    .rotate(BoneName.HIP_R, -0.08, 0, 0)
    .rotate(BoneName.KNEE_R, -0.28, 0, 0)
    .position(BoneName.PELVIS, 0, -0.04, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(1.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.1, -0.05, 0)
    .rotate(BoneName.HIP_R, -0.25, 0, 0.08)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .rotate(BoneName.HIP_L, 0.35, 0, -0.08)
    .rotate(BoneName.KNEE_L, -0.38, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.1, 0, 0.6)
    .rotate(BoneName.SHOULDER_L, -0.15, 0, -0.6)
    .position(BoneName.PELVIS, 0, -0.06, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Gon Run - 곤질주
 * Powerful, earthshaking run
 */
export const GON_RUN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("run_gon", "곤질주")
    .asMovement(0.58, true)
    .at(0.0, "ease-out")
    .rotate(BoneName.PELVIS, 0.2, 0.1, 0)
    .rotate(BoneName.HIP_L, -0.5, 0, 0)
    .rotate(BoneName.KNEE_L, -0.4, 0, 0)
    .rotate(BoneName.HIP_R, 0.7, 0, 0)
    .rotate(BoneName.KNEE_R, -0.95, 0, 0)
    .rotate(BoneName.SHOULDER_L, 0.35, 0, -0.4)
    .rotate(BoneName.ELBOW_L, -1.3, 0, 0)
    .rotate(BoneName.SHOULDER_R, -0.55, 0, 0.4)
    .rotate(BoneName.ELBOW_R, -1.2, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.14, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0.12, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0.05)
    .done<MartialArtsAnimationBuilder>()
    .at(0.29, "linear")
    .rotate(BoneName.PELVIS, 0.16, 0, 0)
    .rotate(BoneName.HIP_L, 0.25, 0, 0)
    .rotate(BoneName.KNEE_L, -1.1, 0, 0)
    .rotate(BoneName.HIP_R, -0.3, 0, 0)
    .rotate(BoneName.KNEE_R, -0.35, 0, 0)
    .position(BoneName.PELVIS, 0, 0.04, 0.05)
    .done<MartialArtsAnimationBuilder>()
    .at(0.58, "ease-out")
    .rotate(BoneName.PELVIS, 0.2, -0.1, 0)
    .rotate(BoneName.HIP_R, -0.5, 0, 0)
    .rotate(BoneName.KNEE_R, -0.4, 0, 0)
    .rotate(BoneName.HIP_L, 0.7, 0, 0)
    .rotate(BoneName.KNEE_L, -0.95, 0, 0)
    .rotate(BoneName.SHOULDER_R, 0.35, 0, 0.4)
    .rotate(BoneName.SHOULDER_L, -0.55, 0, -0.4)
    .position(BoneName.PELVIS, 0, 0, 0.05)
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION MAPS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all stance-specific walk animations
 * @korean 자세별걷기애니메이션맵
 */
export const STANCE_WALK_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    ["walk_geon", GEON_WALK_ANIMATION],
    ["walk_tae", TAE_WALK_ANIMATION],
    ["walk_li", LI_WALK_ANIMATION],
    ["walk_jin", JIN_WALK_ANIMATION],
    ["walk_son", SON_WALK_ANIMATION],
    ["walk_gam", GAM_WALK_ANIMATION],
    ["walk_gan", GAN_WALK_ANIMATION],
    ["walk_gon", GON_WALK_ANIMATION],
  ]);

/**
 * Map of all stance-specific run animations
 * @korean 자세별달리기애니메이션맵
 */
export const STANCE_RUN_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    ["run_geon", GEON_RUN_ANIMATION],
    ["run_tae", TAE_RUN_ANIMATION],
    ["run_li", LI_RUN_ANIMATION],
    ["run_jin", JIN_RUN_ANIMATION],
    ["run_son", SON_RUN_ANIMATION],
    ["run_gam", GAM_RUN_ANIMATION],
    ["run_gan", GAN_RUN_ANIMATION],
    ["run_gon", GON_RUN_ANIMATION],
  ]);

/**
 * Combined map of all stance locomotion animations
 * @korean 자세별이동애니메이션통합맵
 */
export const STANCE_LOCOMOTION_ANIMATIONS: ReadonlyMap<
  string,
  SkeletalAnimation
> = new Map([...STANCE_WALK_ANIMATIONS, ...STANCE_RUN_ANIMATIONS]);

/**
 * Get stance-specific walk animation
 * @param stance - Trigram stance name (geon, tae, li, etc.)
 * @returns Walk animation for that stance
 */
export function getStanceWalkAnimation(
  stance: string
): SkeletalAnimation | undefined {
  return STANCE_WALK_ANIMATIONS.get(`walk_${stance}`);
}

/**
 * Get stance-specific run animation
 * @param stance - Trigram stance name (geon, tae, li, etc.)
 * @returns Run animation for that stance
 */
export function getStanceRunAnimation(
  stance: string
): SkeletalAnimation | undefined {
  return STANCE_RUN_ANIMATIONS.get(`run_${stance}`);
}
