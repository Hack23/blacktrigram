/**
 * Specialized Punch Animations Module
 *
 * Unique punch variant animations for different martial arts techniques.
 * Each animation has distinct biomechanics to visually differentiate techniques.
 *
 * 특수 주먹 기술 애니메이션 모듈 - 각 기술마다 고유한 동작
 *
 * @module systems/animation/SpecializedPunchAnimations
 * @korean 특수주먹애니메이션
 */

import type { SkeletalAnimation } from "@/types/skeletal";
import { BoneName } from "@/types/skeletal";
import {
  MartialArtsAnimationBuilder,
  TECHNIQUE_TIMING,
} from "../builders/MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// SPEAR HAND STRIKES (관수) - Finger Thrust Techniques
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spear Hand Strike - 관수 (Gwansu)
 *
 * Extended finger thrust targeting soft tissue.
 * Li stance technique for precise nerve/pressure point attacks.
 *
 * Distinct from jab:
 * - Fingers extended, not fist
 * - Thrust trajectory (linear), not punch arc
 * - Targets throat, eyes, solar plexus
 *
 * @korean 관수애니메이션
 */
export const SPEAR_HAND_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("spear_hand_strike", "관수")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .at(0.1, "ease-in")
    .rotate(BoneName.SHOULDER_R, -0.2, 0, -0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.2)
    .rotate(BoneName.WRIST_R, -0.3, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.25, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.15, 0, 0.1)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.05)
    .rotate(BoneName.WRIST_R, -0.2, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.3, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.35, "linear")
    .rotate(BoneName.SHOULDER_R, 0.2, 0, 0.15)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.02)
    .rotate(BoneName.WRIST_R, -0.15, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.FAST.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// NERVE STRIKES (신경타격) - Pressure Point Attacks
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Nerve Strike - 신경타격
 *
 * Precise single-knuckle strike to nerve clusters.
 * Li stance precision technique.
 *
 * Distinct from jab:
 * - Single knuckle formation (phoenix eye fist)
 * - Shorter range, more precise
 * - Snap motion, not power punch
 *
 * @korean 신경타격애니메이션
 */
export const NERVE_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("nerve_strike", "신경타격")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .at(0.08, "ease-in")
    .rotate(BoneName.SHOULDER_R, -0.1, 0, -0.15)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.4)
    .rotate(BoneName.WRIST_R, 0.2, 0, 0.3)
    .done<MartialArtsAnimationBuilder>()
    .at(0.2, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.1, 0, 0.05)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.15)
    .rotate(BoneName.WRIST_R, 0.15, 0, 0.25)
    .rotate(BoneName.SPINE_UPPER, 0, 0.2, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.28, "linear")
    .rotate(BoneName.SHOULDER_R, 0.12, 0, 0.08)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.1)
    .rotate(BoneName.WRIST_R, 0.1, 0, 0.2)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.FAST.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Pressure Point Strike - 급소타격
 *
 * Targeted strike to pressure points.
 * Uses thumb or knuckle for precision.
 *
 * @korean 급소타격애니메이션
 */
export const PRESSURE_POINT_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("pressure_point_strike", "급소타격")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .at(0.1, "ease-in")
    .rotate(BoneName.SHOULDER_R, -0.05, -0.1, -0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.3)
    .rotate(BoneName.WRIST_R, 0.3, 0.1, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.25, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.05, 0.1, 0.1)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.2)
    .rotate(BoneName.WRIST_R, 0.2, 0.05, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.15, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.35, "linear")
    .rotate(BoneName.SHOULDER_R, 0.08, 0.12, 0.12)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.15)
    .rotate(BoneName.WRIST_R, 0.15, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.FAST.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// LIGHTNING/THUNDER STRIKES (번개/천둥타격) - Explosive Power
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Lightning Strike - 번개타격
 *
 * Jin stance explosive straight punch.
 * Maximum speed with electric-fast execution.
 *
 * Distinct from jab:
 * - Full body commitment
 * - Explosive hip rotation
 * - Longer wind-up for power
 *
 * @korean 번개타격애니메이션
 */
export const LIGHTNING_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("lightning_strike", "번개타격")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .at(0.12, "ease-in")
    .rotate(BoneName.SHOULDER_R, -0.2, 0, -0.35)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.5)
    .rotate(BoneName.PELVIS, 0, -0.2, 0)
    .rotate(BoneName.SPINE_LOWER, 0, -0.15, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.25, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.08)
    .rotate(BoneName.PELVIS, 0, 0.35, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0.25, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.45, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.32, "linear")
    .rotate(BoneName.SHOULDER_R, 0.35, 0, 0.25)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.03)
    .rotate(BoneName.PELVIS, 0, 0.4, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.5, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.FAST_MEDIUM.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Heaven Strike - 천격
 *
 * Geon stance descending power strike.
 * Downward trajectory with gravitational force.
 *
 * Distinct from cross:
 * - Descending arc trajectory
 * - More vertical shoulder rotation
 * - Hammer-like impact
 *
 * @korean 천격애니메이션
 */
export const HEAVEN_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("heaven_strike", "천격")
    .asAttack(TECHNIQUE_TIMING.MEDIUM.total)
    .at(0.15, "ease-in")
    .rotate(BoneName.SHOULDER_R, -0.5, 0, -0.4)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.8)
    .rotate(BoneName.SPINE_UPPER, -0.1, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.35, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.4, 0, 0.3)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.1)
    .rotate(BoneName.SPINE_UPPER, 0.15, 0.3, 0)
    .rotate(BoneName.PELVIS, 0, 0.25, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.45, "linear")
    .rotate(BoneName.SHOULDER_R, 0.5, 0, 0.35)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.05)
    .rotate(BoneName.SPINE_UPPER, 0.2, 0.35, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.MEDIUM.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// FLOWING STRIKES (유수타격) - Circular/Continuous Motion
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Flowing Cross - 유수교차
 *
 * Tae/Gam stance circular cross punch.
 * Uses opponent's energy with redirection.
 *
 * Distinct from cross:
 * - Circular trajectory instead of linear
 * - Less hip commitment, more arm flow
 * - Can chain into grappling
 *
 * @korean 유수교차애니메이션
 */
export const FLOWING_CROSS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("flowing_cross", "유수교차")
    .asAttack(TECHNIQUE_TIMING.MEDIUM.total)
    .at(0.12, "ease-in")
    .rotate(BoneName.SHOULDER_R, -0.1, -0.2, -0.25)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.3)
    .rotate(BoneName.SPINE_UPPER, 0, -0.2, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.3, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.15, 0.15, 0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.2)
    .rotate(BoneName.WRIST_R, 0, -0.2, 0.1)
    .rotate(BoneName.SPINE_UPPER, 0, 0.25, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.45, "linear")
    .rotate(BoneName.SHOULDER_R, 0.2, 0.1, 0.15)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.15)
    .rotate(BoneName.SPINE_UPPER, 0, 0.3, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.MEDIUM.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Rapid Barrage - 연타
 *
 * Son stance multiple rapid punches.
 * Continuous wind-like pressure.
 *
 * @korean 연타애니메이션
 */
export const RAPID_BARRAGE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("rapid_barrage", "연타")
    .asAttack(TECHNIQUE_TIMING.MEDIUM.total)
    .at(0.08, "ease-out")
    .rotate(BoneName.SHOULDER_L, 0.2, 0, 0.1)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.1)
    .done<MartialArtsAnimationBuilder>()
    .at(0.16, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.2, 0, 0.1)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.1)
    .rotate(BoneName.SHOULDER_L, -0.1, 0, -0.2)
    .done<MartialArtsAnimationBuilder>()
    .at(0.24, "ease-out")
    .rotate(BoneName.SHOULDER_L, 0.25, 0, 0.15)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.08)
    .rotate(BoneName.SHOULDER_R, -0.1, 0, -0.2)
    .done<MartialArtsAnimationBuilder>()
    .at(0.32, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.25, 0, 0.15)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.08)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.MEDIUM.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Rhythmic Strikes - 리듬타격
 *
 * Son stance patterned strikes.
 * Alternating rhythm for unpredictability.
 *
 * @korean 리듬타격애니메이션
 */
export const RHYTHMIC_STRIKES_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("rhythmic_strikes", "리듬타격")
    .asAttack(TECHNIQUE_TIMING.MEDIUM.total)
    .at(0.1, "ease-out")
    .rotate(BoneName.SHOULDER_L, 0.2, 0, 0.1)
    .rotate(BoneName.ELBOW_L, 0, 0, -0.1)
    .done<MartialArtsAnimationBuilder>()
    .at(0.2, "linear")
    .rotate(BoneName.SHOULDER_L, 0.1, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.1, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.4, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.05)
    .rotate(BoneName.SPINE_UPPER, 0, 0.4, 0)
    .rotate(BoneName.PELVIS, 0, 0.3, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.MEDIUM.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// PALM STRIKE VARIANTS (장권변형)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Solar Plexus Strike - 명치타격
 *
 * Li stance precision palm to solar plexus.
 * Targets diaphragm for wind knockout.
 *
 * @korean 명치타격애니메이션
 */
export const SOLAR_PLEXUS_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("solar_plexus_strike", "명치타격")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .at(0.1, "ease-in")
    .rotate(BoneName.SHOULDER_R, -0.15, 0, -0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.4)
    .rotate(BoneName.WRIST_R, -0.4, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.25, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.2, 0, 0.15)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.1)
    .rotate(BoneName.WRIST_R, -0.5, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.25, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.35, "linear")
    .rotate(BoneName.SHOULDER_R, 0.25, 0, 0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.05)
    .rotate(BoneName.WRIST_R, -0.6, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.FAST_MEDIUM.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Flowing Push - 유수밀기
 *
 * Gam/Son stance redirecting palm.
 * Uses attacker's energy against them.
 *
 * @korean 유수밀기애니메이션
 */
export const FLOWING_PUSH_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("flowing_push", "유수밀기")
    .asAttack(TECHNIQUE_TIMING.MEDIUM.total)
    .at(0.15, "ease-in")
    .rotate(BoneName.SHOULDER_R, -0.05, -0.15, 0)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.0)
    .rotate(BoneName.WRIST_R, -0.3, -0.1, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.35, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.15, 0.1, 0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.3)
    .rotate(BoneName.WRIST_R, -0.4, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0.2, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.5, "linear")
    .rotate(BoneName.SHOULDER_R, 0.2, 0.15, 0.25)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.15)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.MEDIUM.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// DARK OPS STRIKE VARIANTS (암살타격변형)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Throat Strike - 인후타격
 *
 * Dark ops precise strike to trachea.
 * Causes immediate breathing difficulty.
 *
 * @korean 인후타격애니메이션
 */
export const THROAT_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("throat_strike", "인후타격")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .at(0.08, "ease-in")
    .rotate(BoneName.SHOULDER_R, -0.1, 0, -0.15)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.3)
    .rotate(BoneName.WRIST_R, 0, 0, 0.3)
    .done<MartialArtsAnimationBuilder>()
    .at(0.2, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.15, 0, 0.1)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.1)
    .rotate(BoneName.WRIST_R, 0, 0, 0.25)
    .done<MartialArtsAnimationBuilder>()
    .at(0.28, "linear")
    .rotate(BoneName.SHOULDER_R, 0.2, 0, 0.15)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.05)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.FAST.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Eye Gouge - 안구공격
 *
 * Dark ops vision attack.
 * Uses extended fingers.
 *
 * @korean 안구공격애니메이션
 */
export const EYE_GOUGE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("eye_gouge", "안구공격")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .at(0.06, "ease-in")
    .rotate(BoneName.SHOULDER_R, -0.08, 0, -0.1)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.2)
    .rotate(BoneName.WRIST_R, -0.2, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.15, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.25, 0, 0.15)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.1)
    .rotate(BoneName.WRIST_R, -0.3, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.22, "linear")
    .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.05)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.FAST.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Nerve Paralysis Strike - 신경마비타격
 *
 * Dark ops debilitating nerve attack.
 * Targets brachial plexus or sciatic nerve.
 *
 * @korean 신경마비타격애니메이션
 */
export const NERVE_PARALYSIS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("nerve_paralysis", "신경마비")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .at(0.1, "ease-in")
    .rotate(BoneName.SHOULDER_R, -0.15, -0.1, -0.2)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.4)
    .rotate(BoneName.WRIST_R, 0.2, 0.1, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.25, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.1, 0.15, 0.15)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.2)
    .rotate(BoneName.WRIST_R, 0.15, 0.05, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.38, "linear")
    .rotate(BoneName.SHOULDER_R, 0.12, 0.18, 0.18)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.15)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.FAST_MEDIUM.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Liver Disruption - 간장타격
 *
 * Dark ops organ attack.
 * Palm strike under ribs.
 *
 * @korean 간장타격애니메이션
 */
export const LIVER_DISRUPTION_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("liver_disruption", "간장타격")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .at(0.1, "ease-in")
    .rotate(BoneName.SHOULDER_R, -0.2, 0, -0.25)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.5)
    .rotate(BoneName.SPINE_UPPER, 0.1, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.28, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.3, 0, 0.25)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.15)
    .rotate(BoneName.WRIST_R, -0.5, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0.15, 0.2, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.38, "linear")
    .rotate(BoneName.SHOULDER_R, 0.35, 0, 0.3)
    .rotate(BoneName.WRIST_R, -0.6, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.FAST_MEDIUM.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Ear Strike - 이타격
 *
 * Dark ops concussive palm cupping strike.
 * Targets ear for vestibular disruption.
 *
 * @korean 이타격애니메이션
 */
export const EAR_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("ear_strike", "이타격")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .at(0.1, "ease-in")
    .rotate(BoneName.SHOULDER_R, -0.1, 0, -0.4)
    .rotate(BoneName.ELBOW_R, 0, 0, -1.2)
    .rotate(BoneName.WRIST_R, 0, 0, -0.2)
    .done<MartialArtsAnimationBuilder>()
    .at(0.28, "ease-out")
    .rotate(BoneName.SHOULDER_R, 0.1, 0.3, 0.35)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.8)
    .rotate(BoneName.SPINE_UPPER, 0, 0.35, 0)
    .done<MartialArtsAnimationBuilder>()
    .at(0.38, "linear")
    .rotate(BoneName.SHOULDER_R, 0.15, 0.35, 0.4)
    .rotate(BoneName.ELBOW_R, 0, 0, -0.7)
    .done<MartialArtsAnimationBuilder>()
    .at(TECHNIQUE_TIMING.FAST_MEDIUM.total, "ease-in")
    .withGuard("MIDDLE_GUARD")
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all specialized punch animations
 * 특수 주먹 애니메이션 맵
 */
export const SPECIALIZED_PUNCH_ANIMATIONS: ReadonlyMap<
  string,
  SkeletalAnimation
> = new Map([
  // Spear/finger strikes
  ["spear_hand_strike", SPEAR_HAND_STRIKE_ANIMATION],

  // Nerve/pressure point strikes
  ["nerve_strike", NERVE_STRIKE_ANIMATION],
  ["pressure_point_strike", PRESSURE_POINT_STRIKE_ANIMATION],

  // Lightning/thunder strikes
  ["lightning_strike", LIGHTNING_STRIKE_ANIMATION],
  ["heaven_strike", HEAVEN_STRIKE_ANIMATION],

  // Flowing strikes
  ["flowing_cross", FLOWING_CROSS_ANIMATION],
  ["rapid_barrage", RAPID_BARRAGE_ANIMATION],
  ["rhythmic_strikes", RHYTHMIC_STRIKES_ANIMATION],

  // Palm variants
  ["solar_plexus_strike", SOLAR_PLEXUS_STRIKE_ANIMATION],
  ["flowing_push", FLOWING_PUSH_ANIMATION],

  // Dark ops strikes
  ["throat_strike", THROAT_STRIKE_ANIMATION],
  ["eye_gouge", EYE_GOUGE_ANIMATION],
  ["nerve_paralysis", NERVE_PARALYSIS_ANIMATION],
  ["liver_disruption", LIVER_DISRUPTION_ANIMATION],
  ["ear_strike", EAR_STRIKE_ANIMATION],
]);
