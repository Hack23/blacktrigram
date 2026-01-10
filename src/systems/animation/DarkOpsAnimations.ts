/**
 * Dark Ops Animations Module
 *
 * Lethal assassination and incapacitation techniques (암살 기술).
 * High-precision vital point targeting for maximum effect.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * 암살자 전용 치명 기술 애니메이션 모듈
 *
 * @module systems/animation/DarkOpsAnimations
 * @korean 암살애니메이션
 */

import type { SkeletalAnimation } from "../../types/skeletal";
import { MartialArtsAnimationBuilder } from "./MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// VASCULAR ATTACKS (혈관 공격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Silent Carotid Strike - 경동맥침묵
 *
 * Silent approach and carotid artery compression.
 * Induces unconsciousness through blood flow restriction.
 *
 * @korean 경동맥침묵애니메이션
 */
export const DARKOPS_SILENT_CAROTID_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_silent_carotid", "경동맥침묵")
    .asAttack(0.7)
    .throwEntry(0.15) // Silent approach
    .clinchGrab(0.15) // Secure position
    .jointLock(0.2) // Apply compression
    .recover(0.2)
    .build();

/**
 * Jugular Strike - 경정맥타격
 *
 * Precise strike to the jugular vein.
 * Causes immediate disorientation.
 *
 * @korean 경정맥타격애니메이션
 */
export const DARKOPS_JUGULAR_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_jugular_strike", "경정맥타격")
    .asAttack(0.35)
    .punchWindup(0.08)
    .punchExtend(0.1) // Knife-hand to throat
    .recover(0.17)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// NERVE ATTACKS (신경 공격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Nerve Paralysis Strike - 신경마비
 *
 * Precision strike to motor nerve clusters.
 * Causes temporary limb paralysis.
 *
 * @korean 신경마비애니메이션
 */
export const DARKOPS_NERVE_PARALYSIS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_nerve_paralysis", "신경마비")
    .asAttack(0.38)
    .punchWindup(0.06)
    .punchExtend(0.12) // Precision fingertip strike
    .recover(0.2)
    .build();

/**
 * Brachial Plexus Strike - 상완신경총
 *
 * Strike to brachial plexus nerve bundle.
 * Causes arm numbness and weakness.
 *
 * @korean 상완신경총애니메이션
 */
export const DARKOPS_BRACHIAL_PLEXUS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_brachial_plexus", "상완신경총")
    .asAttack(0.4)
    .elbowChamber(0.1)
    .elbowStrike(0.12) // Strike to neck/shoulder junction
    .recover(0.18)
    .build();

/**
 * Femoral Nerve Strike - 대퇴신경타격
 *
 * Strike to femoral nerve in thigh.
 * Causes leg collapse.
 *
 * @korean 대퇴신경타격애니메이션
 */
export const DARKOPS_FEMORAL_NERVE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_femoral_nerve", "대퇴신경타격")
    .asAttack(0.45)
    .withClinch()
    .kneeStrike(0.15) // Knee to inner thigh
    .recover(0.3)
    .build();

/**
 * Sciatic Nerve Strike - 좌골신경타격
 *
 * Strike to sciatic nerve.
 * Causes shooting pain and leg weakness.
 *
 * @korean 좌골신경타격애니메이션
 */
export const DARKOPS_SCIATIC_NERVE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_sciatic_nerve", "좌골신경타격")
    .asAttack(0.42)
    .lowKickChamber(0.1)
    .lowKickSweep(0.12) // Low kick to back of leg
    .recover(0.2)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ORGAN ATTACKS (장기 공격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Liver Disruption - 간장파괴
 *
 * Devastating hook to liver.
 * Causes immediate incapacitation.
 *
 * @korean 간장파괴애니메이션
 */
export const DARKOPS_LIVER_DISRUPTION_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_liver_disruption", "간장파괴")
    .asAttack(0.45)
    .uppercutCrouch(0.1) // Drop level
    .hookPunch(0.15) // Hook to liver
    .recover(0.2)
    .build();

/**
 * Kidney Strike - 신장타격
 *
 * Knee or elbow to kidney region.
 * Causes severe pain and potential organ damage.
 *
 * @korean 신장타격애니메이션
 */
export const DARKOPS_KIDNEY_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_kidney_strike", "신장타격")
    .asAttack(0.48)
    .clinchGrab(0.1)
    .withClinch()
    .kneeStrike(0.15) // Knee to lower back
    .recover(0.23)
    .build();

/**
 * Spleen Rupture Strike - 비장파열
 *
 * Powerful strike to spleen area.
 * Causes internal bleeding risk.
 *
 * @korean 비장파열애니메이션
 */
export const DARKOPS_SPLEEN_RUPTURE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_spleen_rupture", "비장파열")
    .asAttack(0.42)
    .hookWindup(0.1)
    .hookPunch(0.12) // Left hook to spleen
    .recover(0.2)
    .build();

/**
 * Solar Plexus Paralyze - 명치마비
 *
 * Strike to solar plexus nerve center.
 * Causes diaphragm spasm and breathing difficulty.
 *
 * @korean 명치마비애니메이션
 */
export const DARKOPS_SOLAR_PLEXUS_PARALYZE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "darkops_solar_plexus_paralyze",
    "명치마비"
  )
    .asAttack(0.4)
    .punchWindup(0.08)
    .palmStrike(0.12) // Palm heel to solar plexus
    .recover(0.2)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// THROAT ATTACKS (인후 공격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Throat Strike - 인후타격
 *
 * Strike to throat/trachea.
 * Causes airway obstruction.
 *
 * @korean 인후타격애니메이션
 */
export const DARKOPS_THROAT_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_throat_strike", "인후타격")
    .asAttack(0.32)
    .punchWindup(0.06)
    .punchExtend(0.1) // Spear hand to throat
    .recover(0.16)
    .build();

/**
 * Larynx Crush - 후두압박
 *
 * Grab and compress larynx.
 * Causes voice loss and panic.
 *
 * @korean 후두압박애니메이션
 */
export const DARKOPS_LARYNX_CRUSH_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_larynx_crush", "후두압박")
    .asAttack(0.55)
    .throwEntry(0.12)
    .wristGrab(0.15) // Grab throat
    .jointLock(0.15) // Compress
    .recover(0.13)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// HEAD/SKULL ATTACKS (두부 공격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Temple Strike - 관자놀이타격
 *
 * Strike to temple bone.
 * Causes concussion and disorientation.
 *
 * @korean 관자놀이타격애니메이션
 */
export const DARKOPS_TEMPLE_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_temple_strike", "관자놀이타격")
    .asAttack(0.38)
    .elbowChamber(0.08)
    .elbowStrike(0.12) // Elbow to temple
    .recover(0.18)
    .build();

/**
 * Jaw Dislocation - 턱탈구
 *
 * Uppercut to dislocate jaw.
 * Causes extreme pain and inability to speak.
 *
 * @korean 턱탈구애니메이션
 */
export const DARKOPS_JAW_DISLOCATION_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_jaw_dislocation", "턱탈구")
    .asAttack(0.42)
    .uppercutCrouch(0.1)
    .elbowUppercut(0.12) // Rising elbow to jaw
    .recover(0.2)
    .build();

/**
 * Ear Strike - 이타격
 *
 * Cupped palm strike to ear.
 * Causes tympanic membrane rupture.
 *
 * @korean 이타격애니메이션
 */
export const DARKOPS_EAR_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_ear_strike", "이타격")
    .asAttack(0.35)
    .hookWindup(0.08)
    .palmStrike(0.1) // Cupped palm to ear
    .recover(0.17)
    .build();

/**
 * Eye Gouge - 안구압박
 *
 * Finger strike to eyes.
 * Causes temporary or permanent blindness.
 *
 * @korean 안구압박애니메이션
 */
export const DARKOPS_EYE_GOUGE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_eye_gouge", "안구압박")
    .asAttack(0.3)
    .punchWindup(0.05)
    .punchExtend(0.1) // Two-finger strike
    .recover(0.15)
    .build();

/**
 * Occipital Strike - 후두골타격
 *
 * Strike to base of skull.
 * Causes unconsciousness.
 *
 * @korean 후두골타격애니메이션
 */
export const DARKOPS_OCCIPITAL_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_occipital_strike", "후두골타격")
    .asAttack(0.4)
    .overhandPunch(0.15) // Hammer fist to back of head
    .recover(0.25)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SPINAL ATTACKS (척추 공격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Spinal Strike - 척추타격
 *
 * Strike to spinal column.
 * Causes pain and potential paralysis.
 *
 * @korean 척추타격애니메이션
 */
export const DARKOPS_SPINAL_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_spinal_strike", "척추타격")
    .asAttack(0.45)
    .elbowChamber(0.1)
    .elbowStrike(0.12) // Elbow to spine
    .recover(0.23)
    .build();

/**
 * Cervical Twist - 경추비틀기
 *
 * Neck manipulation technique.
 * Dangerous cervical vertebrae pressure.
 *
 * @korean 경추비틀기애니메이션
 */
export const DARKOPS_CERVICAL_TWIST_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_cervical_twist", "경추비틀기")
    .asAttack(0.65)
    .clinchGrab(0.15)
    .wristTwist(0.2) // Neck rotation
    .recover(0.3)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// CHOKE ATTACKS (교살 공격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Rear Naked Choke - 후방나체교살
 *
 * Classic rear chokehold.
 * Blood choke causing unconsciousness.
 *
 * @korean 후방나체교살애니메이션
 */
export const DARKOPS_REAR_CHOKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_rear_choke", "후방나체교살")
    .asAttack(0.7)
    .throwEntry(0.15) // Get behind opponent
    .clinchGrab(0.15) // Secure position
    .jointLock(0.22) // Apply choke
    .recover(0.18)
    .build();

/**
 * Guillotine Choke - 길로틴초크
 *
 * Front headlock choke.
 * Air and blood choke combined.
 *
 * @korean 길로틴초크애니메이션
 */
export const DARKOPS_GUILLOTINE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_guillotine", "길로틴초크")
    .asAttack(0.65)
    .parry(0.1) // Catch head
    .clinchGrab(0.12)
    .jointLock(0.2) // Apply guillotine
    .recover(0.23)
    .build();

/**
 * Triangle Choke - 삼각조르기
 *
 * Leg triangle choke.
 * Blood choke using legs.
 *
 * @korean 삼각조르기애니메이션
 */
export const DARKOPS_TRIANGLE_CHOKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_triangle_choke", "삼각조르기")
    .asAttack(0.75)
    .sweep(0.15) // Get to ground
    .chamber(0.12) // Position legs
    .jointLock(0.25) // Apply triangle
    .recover(0.23)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// LIMB DESTRUCTION (사지 파괴)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Achilles Sever - 아킬레스건절단
 *
 * Attack to Achilles tendon.
 * Causes inability to walk.
 *
 * @korean 아킬레스건절단애니메이션
 */
export const DARKOPS_ACHILLES_SEVER_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_achilles_sever", "아킬레스건절단")
    .asAttack(0.5)
    .sweep(0.18) // Low sweeping attack
    .recover(0.32)
    .build();

/**
 * Kneecap Strike - 슬개골타격
 *
 * Oblique kick to knee.
 * Hyperextends or dislocates knee.
 *
 * @korean 슬개골타격애니메이션
 */
export const DARKOPS_KNEECAP_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_kneecap_strike", "슬개골타격")
    .asAttack(0.45)
    .pushKickChamber(0.1)
    .pushKickThrust(0.12) // Stomp to knee
    .recover(0.23)
    .build();

/**
 * Elbow Hyperextension - 팔꿈치과신전
 *
 * Standing arm bar hyperextension.
 * Breaks or dislocates elbow.
 *
 * @korean 팔꿈치과신전애니메이션
 */
export const DARKOPS_ELBOW_HYPEREXTEND_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create(
    "darkops_elbow_hyperextend",
    "팔꿈치과신전"
  )
    .asAttack(0.6)
    .wristGrab(0.12)
    .armBarEntry(0.15)
    .armBarDrop(0.15) // Hyperextend
    .recover(0.18)
    .build();

/**
 * Finger Break - 손가락파괴
 *
 * Small joint manipulation to fingers.
 * Breaks or dislocates fingers.
 *
 * @korean 손가락파괴애니메이션
 */
export const DARKOPS_FINGER_BREAK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_finger_break", "손가락파괴")
    .asAttack(0.45)
    .wristGrab(0.12)
    .wristTwist(0.15) // Finger manipulation
    .recover(0.18)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// SILENT TAKEDOWNS (무음제압)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Silent Takedown - 무음제압
 *
 * Silent approach and takedown.
 * No sound, instant incapacitation.
 *
 * @korean 무음제압애니메이션
 */
export const DARKOPS_SILENT_TAKEDOWN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_silent_takedown", "무음제압")
    .asAttack(0.75)
    .throwEntry(0.2) // Silent approach
    .clinchGrab(0.15) // Secure
    .slamDown(0.2) // Take down silently
    .recover(0.2)
    .build();

/**
 * Sleeper Hold - 수면유도
 *
 * Blood choke to induce sleep.
 * Gentle unconsciousness induction.
 *
 * @korean 수면유도애니메이션
 */
export const DARKOPS_SLEEPER_HOLD_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("darkops_sleeper_hold", "수면유도")
    .asAttack(0.7)
    .throwEntry(0.15)
    .clinchGrab(0.12)
    .jointLock(0.25) // Sustained pressure
    .recover(0.18)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT DARK OPS ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all dark ops animations for easy access
 * 암살 애니메이션 맵
 */
export const DARKOPS_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    // Vascular
    ["darkops_silent_carotid", DARKOPS_SILENT_CAROTID_ANIMATION],
    ["darkops_jugular_strike", DARKOPS_JUGULAR_STRIKE_ANIMATION],

    // Nerve
    ["darkops_nerve_paralysis", DARKOPS_NERVE_PARALYSIS_ANIMATION],
    ["darkops_brachial_plexus_strike", DARKOPS_BRACHIAL_PLEXUS_ANIMATION],
    ["darkops_femoral_nerve_strike", DARKOPS_FEMORAL_NERVE_ANIMATION],
    ["darkops_sciatic_nerve", DARKOPS_SCIATIC_NERVE_ANIMATION],

    // Organ
    ["darkops_liver_disruption", DARKOPS_LIVER_DISRUPTION_ANIMATION],
    ["darkops_kidney_strike", DARKOPS_KIDNEY_STRIKE_ANIMATION],
    ["darkops_spleen_rupture", DARKOPS_SPLEEN_RUPTURE_ANIMATION],
    ["darkops_solar_plexus_paralyze", DARKOPS_SOLAR_PLEXUS_PARALYZE_ANIMATION],

    // Throat
    ["darkops_throat_strike", DARKOPS_THROAT_STRIKE_ANIMATION],
    ["darkops_larynx_crush", DARKOPS_LARYNX_CRUSH_ANIMATION],

    // Head/Skull
    ["darkops_temple_strike", DARKOPS_TEMPLE_STRIKE_ANIMATION],
    ["darkops_jaw_dislocation", DARKOPS_JAW_DISLOCATION_ANIMATION],
    ["darkops_ear_strike", DARKOPS_EAR_STRIKE_ANIMATION],
    ["darkops_eye_gouge", DARKOPS_EYE_GOUGE_ANIMATION],
    ["darkops_occipital_strike", DARKOPS_OCCIPITAL_STRIKE_ANIMATION],

    // Spinal
    ["darkops_spinal_strike", DARKOPS_SPINAL_STRIKE_ANIMATION],
    ["darkops_cervical_twist", DARKOPS_CERVICAL_TWIST_ANIMATION],

    // Chokes
    ["darkops_rear_choke", DARKOPS_REAR_CHOKE_ANIMATION],
    ["darkops_guillotine", DARKOPS_GUILLOTINE_ANIMATION],
    ["darkops_triangle_choke", DARKOPS_TRIANGLE_CHOKE_ANIMATION],

    // Limb Destruction
    ["darkops_achilles_sever", DARKOPS_ACHILLES_SEVER_ANIMATION],
    ["darkops_kneecap_strike", DARKOPS_KNEECAP_STRIKE_ANIMATION],
    ["darkops_elbow_hyperextend", DARKOPS_ELBOW_HYPEREXTEND_ANIMATION],
    ["darkops_finger_break", DARKOPS_FINGER_BREAK_ANIMATION],

    // Silent Takedowns
    ["darkops_silent_takedown", DARKOPS_SILENT_TAKEDOWN_ANIMATION],
    ["darkops_sleeper_hold", DARKOPS_SLEEPER_HOLD_ANIMATION],
  ]);
