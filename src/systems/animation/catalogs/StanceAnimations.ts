/**
 * Stance-Specific Animations Module
 *
 * Unique animations for each of the eight trigram stances (팔괘).
 * These animations are specific to stance philosophy and fighting style.
 * Uses MartialArtsAnimationBuilder for readable, martial arts expert-friendly code.
 *
 * 팔괘 자세별 고유 애니메이션 모듈
 *
 * @module systems/animation/StanceAnimations
 * @korean 자세애니메이션
 */

import type { SkeletalAnimation } from "@/types/skeletal";
import { BoneName } from "@/types/skeletal";
import { toRadians } from "@/utils/math";
import {
  MartialArtsAnimationBuilder,
  TECHNIQUE_TIMING,
} from "../builders/MartialArtsAnimationBuilder";
import {
  KOREAN_STANCE_BIOMECHANICS,
  calculateFootPositions,
} from "../builders/MartialArtsConstants";
import {
  GAM_WATER_GUARD_POSE,
  GAN_MOUNTAIN_GUARD_POSE,
  GEON_HIGH_GUARD_POSE,
  GON_EARTH_GUARD_POSE,
  JIN_THUNDER_GUARD_POSE,
  LI_FIRE_GUARD_POSE,
  SON_WIND_GUARD_POSE,
  TAE_FLUID_GUARD_POSE,
} from "./StanceGuardPoses";

// Import Li (Fire) enhanced animations
import {
  LI_DIAGONAL_DART_STEP,
  LI_FORWARD_TARGETING_GUARD,
  LI_IDLE_TARGETING,
  LI_LINEAR_PIERCE_STEP,
} from "./LiStanceAnimations";
import {
  LI_FIRE_SPEAR_ANIMATION,
  LI_NERVE_STRIKE_COMBO,
} from "./LiTechniqueAnimations";
// Import enhanced Jin animations
import {
  JIN_EXPLOSIVE_BURST,
  JIN_IDLE_COILED,
  JIN_JUMPING_ADVANCE,
} from "./JinStanceAnimations";

// Import Jin technique animations
import {
  JIN_JUMPING_KNEE_STRIKE,
  JIN_THUNDER_FLASH_ANIMATION,
} from "./JinTechniqueAnimations";

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT SHOULDER WIDTH CONSTANT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default shoulder width for stance calculations
 *
 * Uses average shoulder width across all archetypes:
 * - Musa: 46cm
 * - Amsalja: 44cm
 * - Hacker: 43cm
 * - Jeongbo: 45cm
 * - Jojik: 54cm
 *
 * Average: (46 + 44 + 43 + 45 + 54) / 5 = 46.4cm ≈ 46cm
 *
 * This provides neutral baseline for animations. Actual runtime will scale
 * based on fighter's specific shoulder width from physical attributes.
 *
 * @korean 기본어깨너비
 */
const DEFAULT_SHOULDER_WIDTH_CM = 46;

// ═══════════════════════════════════════════════════════════════════════════
// ☰ GEON (건) - HEAVEN: Direct Force (태권도 타격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Geon Heaven Strike - 건천격
 *
 * Powerful downward strike representing heaven's authority.
 * Full body commitment with vertical power line.
 *
 * @korean 건천격애니메이션
 */
export const GEON_HEAVEN_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("geon_heaven_strike", "건천격")
    .asAttack(0.5)
    .withHighGuard()
    .overhandPunch(0.18) // Descending strike
    .recover(0.32)
    .build();

/**
 * Geon Heavenly Fist - 건천권
 *
 * Lead straight punch with divine authority.
 * Extends through target with unwavering focus.
 *
 * @korean 건천권애니메이션
 */
export const GEON_HEAVENLY_FIST_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("geon_heavenly_fist", "건천권")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .punchWindup(TECHNIQUE_TIMING.FAST.chamber)
    .punchExtend(
      TECHNIQUE_TIMING.FAST.extend + TECHNIQUE_TIMING.FAST.peak,
    )
    .recover(
      TECHNIQUE_TIMING.FAST.retract +
        TECHNIQUE_TIMING.FAST.recover,
    )
    .build();

/**
 * Geon Frontal Kick - 건앞차기
 *
 * Direct front kick with heaven's penetrating force.
 * Snapping kick targeting solar plexus.
 *
 * @korean 건앞차기애니메이션
 */
export const GEON_FRONTAL_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("geon_frontal_kick", "건앞차기")
    .asAttack(0.5)
    .chamber(0.1)
    .withHighGuard()
    .extend(0.12)
    .retract(0.13)
    .setDown(0.15)
    .build();

/**
 * Geon Roundhouse - 건돌려차기
 *
 * Heaven's circular force roundhouse kick.
 * Maximum power generation through hip rotation.
 *
 * @korean 건돌려차기애니메이션
 */
export const GEON_ROUNDHOUSE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("geon_roundhouse", "건돌려차기")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .roundhouseChamber(0.12)
    .withHighGuard()
    .roundhouseExtend(0.15)
    .retract(0.13)
    .recover(0.15)
    .build();

/**
 * Geon Axe Kick - 건내려차기
 *
 * Heaven descending axe kick.
 * Heel crashes down like divine judgment.
 *
 * @korean 건내려차기애니메이션
 */
export const GEON_AXE_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("geon_axe_kick", "건내려차기")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .axeKickRise(0.2)
    .withHighGuard()
    .axeKickChop(0.15)
    .setDown(0.12)
    .recover(0.13)
    .build();

/**
 * Geon Palm Strike - 건장권
 *
 * Heaven's pushing palm strike.
 * Open palm drives through target.
 *
 * @korean 건장권애니메이션
 */
export const GEON_PALM_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("geon_palm_strike", "건장권")
    .asAttack(0.4)
    .punchWindup(0.1)
    .palmStrike(0.12)
    .recover(0.18)
    .build();

/**
 * Geon Elbow Smash - 건팔꿈치
 *
 * Heaven's crushing elbow strike.
 * Close-range devastation.
 *
 * @korean 건팔꿈치애니메이션
 */
export const GEON_ELBOW_SMASH_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("geon_elbow_smash", "건팔꿈치")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .elbowChamber(TECHNIQUE_TIMING.FAST.chamber)
    .elbowStrike(
      TECHNIQUE_TIMING.FAST.extend + TECHNIQUE_TIMING.FAST.peak,
    )
    .recover(
      TECHNIQUE_TIMING.FAST.retract +
        TECHNIQUE_TIMING.FAST.recover,
    )
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☱ TAE (태) - LAKE: Fluid Joint Manipulation (합기도)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tae Flowing Strikes - 태유권
 *
 * Lake's flowing water-like strikes.
 * Continuous motion between techniques.
 *
 * @korean 태유권애니메이션
 */
export const TAE_FLOWING_STRIKES_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_flowing_strikes", "태유권")
    .asAttack(0.5)
    .punchWindup(0.08)
    .crossPunch(0.1)
    .hookPunch(0.12)
    .recover(0.2)
    .build();

/**
 * Tae Wrist Lock - 태손목꺾기
 *
 * Lake's water-like wrist manipulation.
 * Flows into joint control.
 *
 * @korean 태손목꺾기애니메이션
 */
export const TAE_WRIST_LOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_wrist_lock", "태손목꺾기")
    .asAttack(0.65)
    .parry(0.12) // Receive attack
    .wristGrab(0.15) // Capture wrist
    .wristTwist(0.2) // Apply lock
    .recover(0.18)
    .build();

/**
 * Tae Small Circle - 태소원
 *
 * Lake's small circle joint manipulation.
 * Minimal motion, maximum control.
 *
 * @korean 태소원애니메이션
 */
export const TAE_SMALL_CIRCLE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_small_circle", "태소원")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .wristGrab(0.12)
    .jointLock(0.2)
    .recover(0.23)
    .build();

/**
 * Tae Finger Lock - 태손가락꺾기
 *
 * Lake's precise finger manipulation.
 * Small joint control.
 *
 * @korean 태손가락꺾기애니메이션
 */
export const TAE_FINGER_LOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_finger_lock", "태손가락꺾기")
    .asAttack(0.5)
    .wristGrab(0.12)
    .wristTwist(0.15)
    .recover(0.23)
    .build();

/**
 * Tae Elbow Lock - 태팔꿈치꺾기
 *
 * Lake's elbow joint control.
 * Hyperextension threat.
 *
 * @korean 태팔꿈치꺾기애니메이션
 */
export const TAE_ELBOW_LOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_elbow_lock", "태팔꿈치꺾기")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .armBarEntry(0.15)
    .jointLock(0.22)
    .recover(0.23)
    .build();

/**
 * Tae Shoulder Lock - 태어깨꺾기
 *
 * Lake's shoulder joint manipulation.
 * Rotational pressure.
 *
 * @korean 태어깨꺾기애니메이션
 */
export const TAE_SHOULDER_LOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_shoulder_lock", "태어깨꺾기")
    .asAttack(0.65)
    .wristGrab(0.12)
    .armBarEntry(0.15)
    .jointLock(0.2)
    .recover(0.18)
    .build();

/**
 * Tae Arm Bar - 태팔꺾기
 *
 * Lake's standing arm bar.
 * Flowing into submission.
 *
 * @korean 태팔꺾기애니메이션
 */
export const TAE_ARM_BAR_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("tae_arm_bar", "태팔꺾기")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .armBarEntry(0.18)
    .armBarDrop(0.22)
    .recover(0.3)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☲ LI (리) - FIRE: Precision Nerve Strikes (정밀 타격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Li Flame Spear - 리화창
 *
 * Fire's penetrating spear-hand strike.
 * Precision targeting vital points with fingertip thrust.
 *
 * Duration: 460ms (Fast spear-hand thrust)
 *
 * @korean 리화창애니메이션
 */
export const LI_FLAME_SPEAR_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("li_flame_spear", "리화창")
    .asAttack(0.46)
    .elbowChamber(0.07) // Compact spear setup
    .throatStrike(0.13) // Spear-hand to throat
    .punchPeak(0.05)
    .recover(0.21)
    .withSpearHand("right")
    .build();

/**
 * Li Temple Strike - 리관자놀이
 *
 * Fire's precision temple attack.
 * Targeting temporal region.
 *
 * @korean 리관자놀이애니메이션
 */
export const LI_TEMPLE_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("li_temple_strike", "리관자놀이")
    .asAttack(0.4)
    .elbowChamber(0.08)
    .hookPunch(0.12) // Curved to temple
    .recover(0.2)
    .build();

/**
 * Li Nerve Strike - 리신경타격
 *
 * Fire's nerve targeting strike.
 * Precise pressure point attack.
 *
 * Duration: 620ms (Deliberate precision strike)
 *
 * @korean 리신경타격애니메이션
 */
export const LI_NERVE_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("li_nerve_strike", "리신경타격")
    .asAttack(0.62)
    .punchWindup(0.12) // Careful positioning
    .nerveStrike(0.16) // Precise nerve cluster targeting
    .punchPeak(0.06) // Hold for accuracy
    .recover(0.28)
    .build();

/**
 * Li Side Kick - 리옆차기
 *
 * Fire's precise side kick.
 * Targeting ribs with surgical precision.
 *
 * @korean 리옆차기애니메이션
 */
export const LI_SIDEKICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("li_sidekick", "리옆차기")
    .asAttack(0.5)
    .sideKickChamber(0.1)
    .withHighGuard()
    .sideKickExtend(0.12)
    .retract(0.13)
    .recover(0.15)
    .build();

/**
 * Li Pressure Point - 리급소
 *
 * Fire's pressure point strike.
 * Single finger or knuckle attack with precision targeting.
 *
 * Duration: 470ms (Fast finger strike with hold)
 *
 * @korean 리급소애니메이션
 */
export const LI_PRESSURE_POINT_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("li_pressure_point", "리급소")
    .asAttack(0.47)
    .punchWindup(0.08) // Setup
    .punchExtend(0.13) // Finger strike
    .punchPeak(0.05) // Hold on pressure point
    .recover(0.21)
    .withSpearHand("right") // Single finger extension
    .build();

/**
 * Li Solar Plexus Strike - 리명치
 *
 * Fire's solar plexus targeting palm.
 * Diaphragm disruption technique.
 *
 * @korean 리명치애니메이션
 */
export const LI_SOLAR_PLEXUS_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("li_solar_plexus", "리명치")
    .asAttack(0.4)
    .punchWindup(0.08)
    .palmStrike(0.12)
    .recover(0.2)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☳ JIN (진) - THUNDER: Explosive Power (폭발력)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Jin Lightning Flash - 진전광
 *
 * Thunder's lightning-fast straight punch.
 * Explosive acceleration with proper technique phases.
 *
 * Duration: 520ms (Explosive fast punch)
 *
 * @korean 진전광애니메이션
 */
export const JIN_LIGHTNING_FLASH_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jin_lightning_flash", "진전광")
    .asAttack(0.52)
    .punchWindup(0.1) // Lightning prep
    .punchExtend(0.14) // Explosive speed
    .punchPeak(0.05) // Thunder impact
    .recover(0.23)
    .build();

/**
 * Jin Jumping Front Kick - 진뛰어앞차기
 *
 * Thunder's explosive jumping front kick.
 * Airborne striking power.
 *
 * @korean 진뛰어앞차기애니메이션
 */
export const JIN_JUMPING_FRONT_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jin_jumping_front_kick", "진뛰어앞차기")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .chamber(0.08) // Jump prep
    .extend(0.15) // Kick in air
    .retract(0.12)
    .recover(0.2)
    .build();

/**
 * Jin Tornado Kick - 진회전차기
 *
 * Thunder's devastating tornado kick.
 * Full rotation with explosive power.
 *
 * @korean 진회전차기애니메이션
 */
export const JIN_TORNADO_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jin_tornado_kick", "진회전차기")
    .asAttack(0.65)
    .chamber(0.08)
    .backKickSpin(0.15)
    .roundhouseExtend(0.15)
    .spinRecover(0.27)
    .build();

/**
 * Jin Flying Sidekick - 진뛰어옆차기
 *
 * Thunder's airborne side kick.
 * Maximum height and distance.
 *
 * @korean 진뛰어옆차기애니메이션
 */
export const JIN_FLYING_SIDEKICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jin_flying_sidekick", "진뛰어옆차기")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .chamber(0.1)
    .sideKickChamber(0.1)
    .sideKickExtend(0.15)
    .recover(0.25)
    .build();

/**
 * Jin Back Kick - 진뒤차기
 *
 * Thunder's explosive back kick.
 * Spinning with thunderous power.
 *
 * @korean 진뒤차기애니메이션
 */
export const JIN_BACK_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jin_back_kick", "진뒤차기")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .backKickSpin(0.15)
    .backKickThrust(0.15)
    .spinRecover(0.3)
    .build();

/**
 * Jin Knee Strike - 진무릎차기
 *
 * Thunder's explosive knee strike.
 * Rising knee with devastating power.
 *
 * @korean 진무릎차기애니메이션
 */
export const JIN_KNEE_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("jin_knee_strike", "진무릎차기")
    .asAttack(0.45)
    .clinchGrab(0.1)
    .withClinch()
    .kneeStrike(0.15)
    .recover(0.2)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☴ SON (손) - WIND: Continuous Pressure (지속 공격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Son Whirlwind Barrage - 손선풍연격
 *
 * Wind's continuous whirlwind of strikes.
 * Rapid combination attacks.
 *
 * @korean 손선풍연격애니메이션
 */
export const SON_WHIRLWIND_BARRAGE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("son_whirlwind_barrage", "손선풍연격")
    .asAttack(0.68)
    .punchWindup(0.09) // Setup
    .punchExtend(0.1) // First jab
    .punchWindup(0.05) // Quick reset
    .punchExtend(0.1) // Second jab
    .punchPeak(0.04) // Hold
    .hookWindup(0.1) // Hook chamber
    .hookPunch(0.14) // Hook follow-up
    .recover(0.06)
    .build();

/**
 * Son Sweeping Low Kick - 손하단차기
 *
 * Wind's sweeping low leg kick.
 * Continuous pressure on legs.
 *
 * @korean 손하단차기애니메이션
 */
export const SON_SWEEPING_LOW_KICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("son_sweeping_low_kick", "손하단차기")
    .asAttack(0.42)
    .lowKickChamber(0.08)
    .withGuard()
    .lowKickSweep(0.12)
    .recover(0.22)
    .build();

/**
 * Son Rhythmic Strikes - 손리듬격
 *
 * Wind's rhythmic striking pattern.
 * Unpredictable timing variations.
 *
 * @korean 손리듬격애니메이션
 */
export const SON_RHYTHMIC_STRIKES_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("son_rhythmic_strikes", "손리듬격")
    .asAttack(0.48)
    .punchWindup(0.06)
    .punchExtend(0.1)
    .crossPunch(0.12)
    .recover(0.2)
    .build();

/**
 * Son Flowing Push - 손유수
 *
 * Wind's flowing push technique.
 * Continuous forward pressure.
 *
 * @korean 손유수애니메이션
 */
export const SON_FLOWING_PUSH_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("son_flowing_push", "손유수")
    .asAttack(0.4)
    .punchWindup(0.08)
    .palmStrike(0.12)
    .recover(0.2)
    .build();

/**
 * Son Spinning Elbow - 손회전팔꿈치
 *
 * Wind's spinning elbow attack.
 * Rotational momentum.
 *
 * @korean 손회전팔꿈치애니메이션
 */
export const SON_SPINNING_ELBOW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("son_spinning_elbow", "손회전팔꿈치")
    .asAttack(0.48)
    .backKickSpin(0.15)
    .elbowStrike(0.12)
    .spinRecover(0.21)
    .build();

/**
 * Son Rapid Footwork - 손발놀림
 *
 * Wind's rapid footwork movement.
 * Evasive positioning.
 *
 * @korean 손발놀림애니메이션
 */
export const SON_RAPID_FOOTWORK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("son_rapid_footwork", "손발놀림")
    .asMovement(0.35)
    .withGuard()
    .recover(0.35)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☵ GAM (감) - WATER: Flow & Adaptation (유동 반격)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gam Water Counter - 감수반격
 *
 * Water's flowing counter technique.
 * Redirecting force into counter.
 *
 * @korean 감수반격애니메이션
 */
export const GAM_WATER_COUNTER_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gam_water_counter", "감수반격")
    .asAttack(0.48)
    .counterParry(0.1)
    .counterStrike(0.15)
    .recover(0.23)
    .build();

/**
 * Gam Redirect Throw - 감유도던지기
 *
 * Water's redirecting throw.
 * Using opponent's momentum.
 *
 * @korean 감유도던지기애니메이션
 */
export const GAM_REDIRECT_THROW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gam_redirect_throw", "감유도던지기")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .parry(0.12)
    .throwEntry(0.15)
    .throwExecute(0.18)
    .recover(0.15)
    .build();

/**
 * Gam Flowing Block - 감유막기
 *
 * Water's flowing defensive block.
 * Soft absorption of force.
 *
 * @korean 감유막기애니메이션
 */
export const GAM_FLOWING_BLOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gam_flowing_block", "감유막기")
    .asDefense(TECHNIQUE_TIMING.FAST.total)
    .parry(
      TECHNIQUE_TIMING.FAST.chamber +
        TECHNIQUE_TIMING.FAST.extend,
    )
    .recover(
      TECHNIQUE_TIMING.FAST.peak +
        TECHNIQUE_TIMING.FAST.retract +
        TECHNIQUE_TIMING.FAST.recover,
    )
    .build();

/**
 * Gam Circular Parry - 감원막기
 *
 * Water's circular parrying motion.
 * Redirecting attacks in circles.
 *
 * @korean 감원막기애니메이션
 */
export const GAM_CIRCULAR_PARRY_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gam_circular_parry", "감원막기")
    .asDefense(TECHNIQUE_TIMING.FAST.total)
    .parry(
      TECHNIQUE_TIMING.FAST.chamber +
        TECHNIQUE_TIMING.FAST.extend * 0.5,
    )
    .counterParry(
      TECHNIQUE_TIMING.FAST.extend * 0.5 +
        TECHNIQUE_TIMING.FAST.peak,
    )
    .recover(
      TECHNIQUE_TIMING.FAST.retract +
        TECHNIQUE_TIMING.FAST.recover,
    )
    .build();

/**
 * Gam Hip Throw - 감허리치기
 *
 * Water's flowing hip throw.
 * Gentle redirection into throw.
 *
 * @korean 감허리치기애니메이션
 */
export const GAM_HIP_THROW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gam_hip_throw", "감허리치기")
    .asAttack(0.65)
    .throwEntry(0.2)
    .throwExecute(0.22)
    .recover(0.23)
    .build();

/**
 * Gam Wrist Twist Counter - 감손목비틀기
 *
 * Water's wrist twist counter.
 * Flowing into joint control.
 *
 * @korean 감손목비틀기애니메이션
 */
export const GAM_WRIST_TWIST_COUNTER_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gam_wrist_twist_counter", "감손목비틀기")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .parry(0.1)
    .wristGrab(0.12)
    .wristTwist(0.15)
    .recover(0.18)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☶ GAN (간) - MOUNTAIN: Defensive Mastery (방어 마스터리)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gan Rock Defense (Legacy) - 간암방어
 *
 * Mountain's immovable rock defense.
 * Absorbing attacks like a mountain.
 *
 * @deprecated This is a legacy simplified animation. Use the comprehensive
 * `GAN_ROCK_DEFENSE_ANIMATION` from `GanTechniqueAnimations.ts` instead,
 * which provides detailed block-absorb-counter mechanics with authentic
 * Hapkido defensive techniques (반석방어).
 *
 * @korean 간암방어애니메이션
 */
export const GAN_ROCK_DEFENSE_ANIMATION_LEGACY: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gan_rock_defense_legacy", "간암방어")
    .asDefense(0.4)
    .withHighGuard()
    .parry(0.18)
    .recover(0.22)
    .build();

/**
 * Gan Immovable Stance - 간부동자세
 *
 * Mountain's immovable fighting stance.
 * Rooted and unshakeable defensive posture.
 *
 * Characteristics:
 * - Deep rooted stance with minimal movement
 * - High solid guard protecting head/torso
 * - Weight evenly distributed for maximum stability
 * - Slight breathing cycle for realism
 *
 * @korean 간부동자세애니메이션
 */
export const GAN_IMMOVABLE_STANCE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gan_immovable_stance", "간부동자세")
    .asIdle(2.0, true)
    // Keyframe 0: Immovable rooted position
    .at(0)
    .rotate(BoneName.PELVIS, 0, 0, 0) // Neutral, grounded
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Stable core
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0) // Solid upper body
    .rotate(BoneName.KNEE_L, -0.314, 0, 0) // -18° deep bend for stability
    .rotate(BoneName.KNEE_R, -0.314, 0, 0) // -18° deep bend for stability
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44) // -20°, 0°, -25° (high guard)
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44) // -20°, 0°, 25° (high guard)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92) // -110° (reinforced)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92) // 110° (reinforced)
    .rotate(BoneName.WRIST_L, 0, 0, 0) // Neutral
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.HEAD, 0, 0, 0) // Focused forward
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 1.0s: Slight breath (mountain stillness)
    .at(1.0)
    .rotate(BoneName.SPINE_UPPER, -0.026, 0, 0) // -1.5° tiny chest expansion
    .rotate(BoneName.SHOULDER_L, -0.366, 0, -0.453) // Slight shoulder adjust
    .rotate(BoneName.SHOULDER_R, -0.366, 0, 0.453)
    .rotate(BoneName.KNEE_L, -0.331, 0, 0) // -19° slightly deeper
    .rotate(BoneName.KNEE_R, -0.331, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0) // No movement
    .done<MartialArtsAnimationBuilder>()
    // Keyframe 2.0s: Return to start
    .at(2.0)
    .rotate(BoneName.PELVIS, 0, 0, 0)
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0)
    .rotate(BoneName.SPINE_UPPER, 0, 0, 0)
    .rotate(BoneName.KNEE_L, -0.314, 0, 0)
    .rotate(BoneName.KNEE_R, -0.314, 0, 0)
    .rotate(BoneName.SHOULDER_L, -0.35, 0, -0.44)
    .rotate(BoneName.SHOULDER_R, -0.35, 0, 0.44)
    .rotate(BoneName.ELBOW_L, 0, 0, -1.92)
    .rotate(BoneName.ELBOW_R, 0, 0, 1.92)
    .rotate(BoneName.WRIST_L, 0, 0, 0)
    .rotate(BoneName.WRIST_R, 0, 0, 0)
    .rotate(BoneName.HEAD, 0, 0, 0)
    .position(BoneName.PELVIS, 0, 0, 0)
    .done<MartialArtsAnimationBuilder>()
    .build();

/**
 * Gan Iron Block - 간철방어
 *
 * Mountain's iron-like blocking technique.
 * Hard blocking against attacks.
 *
 * @korean 간철방어애니메이션
 */
export const GAN_IRON_BLOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gan_iron_block", "간철방어")
    .asDefense(TECHNIQUE_TIMING.FAST.total)
    .withHighGuard()
    .parry(
      TECHNIQUE_TIMING.FAST.chamber +
        TECHNIQUE_TIMING.FAST.extend,
    )
    .recover(
      TECHNIQUE_TIMING.FAST.peak +
        TECHNIQUE_TIMING.FAST.retract +
        TECHNIQUE_TIMING.FAST.recover,
    )
    .build();

/**
 * Gan Counter Strike - 간반격
 *
 * Mountain's powerful counter strike.
 * Patience followed by devastation.
 *
 * @korean 간반격애니메이션
 */
export const GAN_COUNTER_STRIKE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gan_counter_strike", "간반격")
    .asAttack(0.5)
    .counterParry(0.12)
    .counterStrike(0.15)
    .recover(0.23)
    .build();

/**
 * Gan Mountain Stance Lock - 간산악잠금
 *
 * Mountain's immovable joint lock.
 * Trapping opponent in static lock.
 *
 * @korean 간산악잠금애니메이션
 */
export const GAN_MOUNTAIN_STANCE_LOCK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gan_mountain_stance_lock", "간산악잠금")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .wristGrab(0.15)
    .jointLock(0.22)
    .recover(0.23)
    .build();

/**
 * Gan Reversal Technique - 간역전기
 *
 * Mountain's reversal technique.
 * Turning defense into offense.
 *
 * @korean 간역전기애니메이션
 */
export const GAN_REVERSAL_TECHNIQUE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gan_reversal_technique", "간역전기")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .parry(0.12)
    .counterParry(0.1)
    .counterStrike(0.15)
    .recover(0.18)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON (곤) - EARTH: Grounding & Takedowns (넘어뜨리기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gon Earth Embrace - 곤대지포옹
 *
 * Earth's embracing grapple.
 * Full body clinch control.
 *
 * @korean 곤대지포옹애니메이션
 */
export const GON_EARTH_EMBRACE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gon_earth_embrace", "곤대지포옹")
    .asAttack(TECHNIQUE_TIMING.FAST_MEDIUM.total)
    .clinchGrab(0.15)
    .withClinch()
    .jointLock(0.2)
    .recover(0.25)
    .build();

/**
 * Gon Leg Sweep - 곤걸기
 *
 * Earth's grounding leg sweep.
 * Taking opponent to ground.
 *
 * @korean 곤걸기애니메이션
 */
export const GON_LEG_SWEEP_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gon_leg_sweep", "곤걸기")
    .asAttack(TECHNIQUE_TIMING.FAST.total)
    .sweep(0.2)
    .recover(0.35)
    .build();

/**
 * Gon Ssireum Throw - 곤씨름던지기
 *
 * Earth's traditional Ssireum throw.
 * Korean wrestling technique.
 *
 * @korean 곤씨름던지기애니메이션
 */
export const GON_SSIREUM_THROW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gon_ssireum_throw", "곤씨름던지기")
    .asAttack(0.65)
    .clinchGrab(0.12)
    .throwEntry(0.15)
    .throwExecute(0.2)
    .recover(0.18)
    .build();

/**
 * Gon Ground Pound - 곤땅내리기
 *
 * Earth's ground pound slam.
 * Driving opponent into earth.
 *
 * @korean 곤땅내리기애니메이션
 */
export const GON_GROUND_POUND_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gon_ground_pound", "곤땅내리기")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .slamLift(0.22)
    .slamDown(0.2)
    .recover(0.28)
    .build();

/**
 * Gon Ankle Pick - 곤발목잡기
 *
 * Earth's ankle pick takedown.
 * Low level attack on base.
 *
 * @korean 곤발목잡기애니메이션
 */
export const GON_ANKLE_PICK_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gon_ankle_pick", "곤발목잡기")
    .asAttack(0.5)
    .sweep(0.18)
    .recover(0.32)
    .build();

/**
 * Gon Body Lock Takedown - 곤바디락
 *
 * Earth's body lock takedown.
 * Bear hug to ground.
 *
 * @korean 곤바디락애니메이션
 */
export const GON_BODY_LOCK_TAKEDOWN_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gon_body_lock_takedown", "곤바디락")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_LIGHT.total)
    .clinchGrab(0.15)
    .slamLift(0.2)
    .slamDown(0.18)
    .recover(0.17)
    .build();

/**
 * Gon Sacrifice Throw - 곤희생던지기
 *
 * Earth's sacrifice throw.
 * Going to ground to throw opponent.
 *
 * @korean 곤희생던지기애니메이션
 */
export const GON_SACRIFICE_THROW_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("gon_sacrifice_throw", "곤희생던지기")
    .asAttack(TECHNIQUE_TIMING.MEDIUM_HEAVY.total)
    .clinchGrab(0.12)
    .throwEntry(0.18)
    .throwExecute(0.2)
    .recover(0.25)
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// STANCE IDLE ANIMATIONS (자세 대기 애니메이션)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Stance Idle Animations
 *
 * Idle/stance animations for each of the eight trigram stances (팔괘 자세).
 * These animations define the resting position for each stance, incorporating
 * authentic Korean martial arts biomechanics including proper knee bend angles,
 * weight distribution, and leg alignment.
 *
 * Each stance animation uses the KOREAN_STANCE_BIOMECHANICS constants to ensure
 * anatomically accurate positioning based on traditional Korean martial arts
 * (Taekwondo 태권도, Hapkido 합기도, Taekyon 택견, Ssireum 씨름).
 *
 * @module systems/animation/StanceAnimations
 * @korean 자세대기애니메이션
 */

/**
 * ☰ Geon Heaven Stance - 건 하늘 자세
 *
 * Forward stance (앞서기) from Taekwondo with deep front knee bend
 * for powerful direct force techniques.
 *
 * Characteristics:
 * - 70° front knee bend (deep flexion)
 * - 160° back leg (extended)
 * - 60/40 weight distribution
 * - 1.2x shoulder width stance
 *
 * @korean 건천자세
 */
export const createGeonStance = (): SkeletalAnimation => {
  const biomech = KOREAN_STANCE_BIOMECHANICS.GEON_HEAVEN;
  const guard = GEON_HIGH_GUARD_POSE;

  // Calculate knee rotation from flexion angle
  // 180° = straight, 90° = right angle bend
  // Rotation = -(180 - angle) converts to forward bend
  const frontKneeRotation = toRadians(-(180 - biomech.frontKneeBend));
  const backKneeRotation = toRadians(-(180 - biomech.backKneeBend));

  // Hip height adjustment (lower = more forward lean)
  const hipYOffset = -0.15 * (1.0 - biomech.hipHeight);
  const hipZOffset = 0.1 * biomech.weightDistribution.front;

  // Calculate foot positions based on stance width (발너비)
  const footPositions = calculateFootPositions(
    biomech.stanceWidth,
    DEFAULT_SHOULDER_WIDTH_CM,
  );

  return (
    MartialArtsAnimationBuilder.create("stance_geon", "건 자세")
      .asIdle(1.0, true)
      .at(0)
      // === ARM POSITIONS (from StanceGuardPoses) ===
      // Left arm - high guard protecting temple
      .rotate(
        BoneName.SHOULDER_L,
        guard.leftArm.shoulder.x,
        guard.leftArm.shoulder.y,
        guard.leftArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_L,
        guard.leftArm.elbow.x,
        guard.leftArm.elbow.y,
        guard.leftArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_L,
        guard.leftArm.wrist.x,
        guard.leftArm.wrist.y,
        guard.leftArm.wrist.z,
      )
      // Right arm - high guard protecting temple
      .rotate(
        BoneName.SHOULDER_R,
        guard.rightArm.shoulder.x,
        guard.rightArm.shoulder.y,
        guard.rightArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_R,
        guard.rightArm.elbow.x,
        guard.rightArm.elbow.y,
        guard.rightArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_R,
        guard.rightArm.wrist.x,
        guard.rightArm.wrist.y,
        guard.rightArm.wrist.z,
      )
      // Torso rotation for proper stance
      .rotate(BoneName.SPINE_UPPER, guard.torso.x, guard.torso.y, guard.torso.z)

      // === LEG POSITIONS (from biomechanics) ===
      // Front leg (right): Deep knee bend for forward stance
      .rotate(BoneName.HIP_R, frontKneeRotation, 0, 0)
      .rotate(BoneName.KNEE_R, frontKneeRotation - 0.1, 0, 0)

      // Back leg (left): Extended for power base
      .rotate(BoneName.HIP_L, backKneeRotation, 0, 0)
      .rotate(BoneName.KNEE_L, backKneeRotation + 0.1, 0, 0)

      // === FOOT POSITIONING (Stance Width: 1.35x shoulder width) ===
      .position(BoneName.FOOT_L, footPositions.leftFootX, 0, 0)
      .position(BoneName.FOOT_R, footPositions.rightFootX, 0, 0)

      // Hip position for weight distribution and height
      .position(BoneName.PELVIS, 0, hipYOffset, hipZOffset)
      .done<MartialArtsAnimationBuilder>()
      .build()
  );
};

/**
 * ☱ Tae Lake Stance - 태 호수 자세
 *
 * Cat stance (고양이서기) from Hapkido with 90/10 weight distribution
 * for fluid joint manipulation techniques.
 *
 * Characteristics:
 * - 170° front leg (nearly straight, light)
 * - 120° back knee (bent for spring loading)
 * - 10/90 weight distribution (back-heavy)
 * - 0.8x shoulder width (narrow)
 *
 * @korean 태호수자세
 */
export const createTaeStance = (): SkeletalAnimation => {
  const biomech = KOREAN_STANCE_BIOMECHANICS.TAE_LAKE;
  const guard = TAE_FLUID_GUARD_POSE;

  const frontKneeRotation = toRadians(-(180 - biomech.frontKneeBend));
  const backKneeRotation = toRadians(-(180 - biomech.backKneeBend));

  const hipYOffset = -0.1 * (1.0 - biomech.hipHeight);
  const hipZOffset = -0.08 * biomech.weightDistribution.back; // Back-weighted

  // Calculate foot positions based on stance width (발너비)
  const footPositions = calculateFootPositions(
    biomech.stanceWidth,
    DEFAULT_SHOULDER_WIDTH_CM,
  );

  return (
    MartialArtsAnimationBuilder.create("stance_tae", "태 자세")
      .asIdle(1.0, true)
      .at(0)
      // === ARM POSITIONS (from StanceGuardPoses) ===
      .rotate(
        BoneName.SHOULDER_L,
        guard.leftArm.shoulder.x,
        guard.leftArm.shoulder.y,
        guard.leftArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_L,
        guard.leftArm.elbow.x,
        guard.leftArm.elbow.y,
        guard.leftArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_L,
        guard.leftArm.wrist.x,
        guard.leftArm.wrist.y,
        guard.leftArm.wrist.z,
      )
      .rotate(
        BoneName.SHOULDER_R,
        guard.rightArm.shoulder.x,
        guard.rightArm.shoulder.y,
        guard.rightArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_R,
        guard.rightArm.elbow.x,
        guard.rightArm.elbow.y,
        guard.rightArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_R,
        guard.rightArm.wrist.x,
        guard.rightArm.wrist.y,
        guard.rightArm.wrist.z,
      )
      .rotate(BoneName.SPINE_UPPER, guard.torso.x, guard.torso.y, guard.torso.z)

      // === LEG POSITIONS (from biomechanics) ===
      // Front leg (right): Nearly straight, light weight
      .rotate(BoneName.HIP_R, frontKneeRotation, 0, 0)
      .rotate(BoneName.KNEE_R, frontKneeRotation - 0.05, 0, 0)

      // Back leg (left): Bent for spring-loaded movement
      .rotate(BoneName.HIP_L, backKneeRotation, 0, 0)
      .rotate(BoneName.KNEE_L, backKneeRotation + 0.15, 0, 0)

      // === FOOT POSITIONING (Stance Width: 0.9x shoulder width) ===
      .position(BoneName.FOOT_L, footPositions.leftFootX, 0, 0)
      .position(BoneName.FOOT_R, footPositions.rightFootX, 0, 0)

      // Hip position - back-weighted, higher
      .position(BoneName.PELVIS, 0, hipYOffset, hipZOffset)
      .done<MartialArtsAnimationBuilder>()
      .build()
  );
};

/**
 * ☲ Li Fire Stance - 리 화염 자세
 *
 * Fighting stance (전투서기) from Taekwondo with balanced 50/50 weight
 * for precision nerve strikes.
 *
 * Characteristics:
 * - 135° both knees (moderate bend)
 * - 50/50 weight distribution (balanced)
 * - 1.0x shoulder width (standard)
 * - Medium hip height
 *
 * @korean 리화염자세
 */
export const createLiStance = (): SkeletalAnimation => {
  const biomech = KOREAN_STANCE_BIOMECHANICS.LI_FIRE;
  const guard = LI_FIRE_GUARD_POSE;

  const kneeRotation = toRadians(-(180 - biomech.frontKneeBend));

  const hipYOffset = -0.12 * (1.0 - biomech.hipHeight);

  // Calculate foot positions based on stance width (발너비)
  const footPositions = calculateFootPositions(
    biomech.stanceWidth,
    DEFAULT_SHOULDER_WIDTH_CM,
  );

  return (
    MartialArtsAnimationBuilder.create("stance_li", "리 자세")
      .asIdle(1.0, true)
      .at(0)
      // === ARM POSITIONS (from StanceGuardPoses) ===
      .rotate(
        BoneName.SHOULDER_L,
        guard.leftArm.shoulder.x,
        guard.leftArm.shoulder.y,
        guard.leftArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_L,
        guard.leftArm.elbow.x,
        guard.leftArm.elbow.y,
        guard.leftArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_L,
        guard.leftArm.wrist.x,
        guard.leftArm.wrist.y,
        guard.leftArm.wrist.z,
      )
      .rotate(
        BoneName.SHOULDER_R,
        guard.rightArm.shoulder.x,
        guard.rightArm.shoulder.y,
        guard.rightArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_R,
        guard.rightArm.elbow.x,
        guard.rightArm.elbow.y,
        guard.rightArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_R,
        guard.rightArm.wrist.x,
        guard.rightArm.wrist.y,
        guard.rightArm.wrist.z,
      )
      .rotate(BoneName.SPINE_UPPER, guard.torso.x, guard.torso.y, guard.torso.z)

      // === LEG POSITIONS (from biomechanics) ===
      // Both legs: Equal moderate bend for balance
      .rotate(BoneName.HIP_R, kneeRotation, 0, 0)
      .rotate(BoneName.KNEE_R, kneeRotation - 0.08, 0, 0)
      .rotate(BoneName.HIP_L, kneeRotation, 0, 0)
      .rotate(BoneName.KNEE_L, kneeRotation - 0.08, 0, 0)

      // === FOOT POSITIONING (Stance Width: 1.1x shoulder width) ===
      .position(BoneName.FOOT_L, footPositions.leftFootX, 0, 0)
      .position(BoneName.FOOT_R, footPositions.rightFootX, 0, 0)

      // Hip position - centered, medium height
      .position(BoneName.PELVIS, 0, hipYOffset, 0)
      .done<MartialArtsAnimationBuilder>()
      .build()
  );
};

/**
 * ☳ Jin Thunder Stance - 진 천둥 자세
 *
 * Horse stance (기마서기) from Taekwondo with deep knee bend
 * for explosive power techniques.
 *
 * Characteristics:
 * - 90° both knees (deep right angle bend)
 * - 50/50 weight distribution (power base)
 * - 1.5x shoulder width (very wide)
 * - Very low hip height
 *
 * @korean 진천둥자세
 */
export const createJinStance = (): SkeletalAnimation => {
  const biomech = KOREAN_STANCE_BIOMECHANICS.JIN_THUNDER;
  const guard = JIN_THUNDER_GUARD_POSE;

  const kneeRotation = toRadians(-(180 - biomech.frontKneeBend));

  const hipYOffset = -0.25 * (1.0 - biomech.hipHeight);

  // Calculate foot positions based on stance width (발너비)
  // Jin Thunder has widest stance: 2.0x shoulder width
  const footPositions = calculateFootPositions(
    biomech.stanceWidth,
    DEFAULT_SHOULDER_WIDTH_CM,
  );

  return (
    MartialArtsAnimationBuilder.create("stance_jin", "진 자세")
      .asIdle(1.0, true)
      .at(0)
      // === ARM POSITIONS (from StanceGuardPoses) ===
      .rotate(
        BoneName.SHOULDER_L,
        guard.leftArm.shoulder.x,
        guard.leftArm.shoulder.y,
        guard.leftArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_L,
        guard.leftArm.elbow.x,
        guard.leftArm.elbow.y,
        guard.leftArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_L,
        guard.leftArm.wrist.x,
        guard.leftArm.wrist.y,
        guard.leftArm.wrist.z,
      )
      .rotate(
        BoneName.SHOULDER_R,
        guard.rightArm.shoulder.x,
        guard.rightArm.shoulder.y,
        guard.rightArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_R,
        guard.rightArm.elbow.x,
        guard.rightArm.elbow.y,
        guard.rightArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_R,
        guard.rightArm.wrist.x,
        guard.rightArm.wrist.y,
        guard.rightArm.wrist.z,
      )
      .rotate(BoneName.SPINE_UPPER, guard.torso.x, guard.torso.y, guard.torso.z)

      // === LEG POSITIONS (from biomechanics) ===
      // Both legs: Deep bend for explosive power
      .rotate(BoneName.HIP_R, kneeRotation, 0, 0)
      .rotate(BoneName.KNEE_R, kneeRotation - 0.12, 0, 0)
      .rotate(BoneName.HIP_L, kneeRotation, 0, 0)
      .rotate(BoneName.KNEE_L, kneeRotation - 0.12, 0, 0)

      // === FOOT POSITIONING (Stance Width: 2.0x shoulder width - WIDEST) ===
      .position(BoneName.FOOT_L, footPositions.leftFootX, 0, 0)
      .position(BoneName.FOOT_R, footPositions.rightFootX, 0, 0)

      // Hip position - very low for ground stability
      .position(BoneName.PELVIS, 0, hipYOffset, 0)
      .done<MartialArtsAnimationBuilder>()
      .build()
  );
};

/**
 * ☴ Son Wind Stance - 손 바람 자세
 *
 * Crane stance (학서기) from Taekyon with single-leg balance
 * for continuous pressure attacks.
 *
 * Characteristics:
 * - 170° standing leg (nearly straight)
 * - 45° raised leg (deeply bent)
 * - 100/0 weight distribution (one leg)
 * - 0.0 stance width (single leg)
 *
 * @korean 손바람자세
 */
export const createSonStance = (): SkeletalAnimation => {
  const biomech = KOREAN_STANCE_BIOMECHANICS.SON_WIND;
  const guard = SON_WIND_GUARD_POSE;

  const standingLegRotation = toRadians(-(180 - biomech.frontKneeBend));
  const raisedLegRotation = toRadians(90); // Knee up

  const hipYOffset = -0.08 * (1.0 - biomech.hipHeight);

  // Calculate foot positions based on stance width (발너비)
  // Son Wind has zero width: 0.0x shoulder width (single leg crane stance)
  const footPositions = calculateFootPositions(
    biomech.stanceWidth,
    DEFAULT_SHOULDER_WIDTH_CM,
  );

  return (
    MartialArtsAnimationBuilder.create("stance_son", "손 자세")
      .asIdle(1.0, true)
      .at(0)
      // === ARM POSITIONS (from StanceGuardPoses) ===
      .rotate(
        BoneName.SHOULDER_L,
        guard.leftArm.shoulder.x,
        guard.leftArm.shoulder.y,
        guard.leftArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_L,
        guard.leftArm.elbow.x,
        guard.leftArm.elbow.y,
        guard.leftArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_L,
        guard.leftArm.wrist.x,
        guard.leftArm.wrist.y,
        guard.leftArm.wrist.z,
      )
      .rotate(
        BoneName.SHOULDER_R,
        guard.rightArm.shoulder.x,
        guard.rightArm.shoulder.y,
        guard.rightArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_R,
        guard.rightArm.elbow.x,
        guard.rightArm.elbow.y,
        guard.rightArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_R,
        guard.rightArm.wrist.x,
        guard.rightArm.wrist.y,
        guard.rightArm.wrist.z,
      )
      .rotate(BoneName.SPINE_UPPER, guard.torso.x, guard.torso.y, guard.torso.z)

      // === LEG POSITIONS (from biomechanics) ===
      // Standing leg (right): Straight for balance
      .rotate(BoneName.HIP_R, standingLegRotation, 0, 0)
      .rotate(BoneName.KNEE_R, standingLegRotation - 0.05, 0, 0)

      // Raised leg (left): Knee up, deeply bent
      .rotate(BoneName.HIP_L, raisedLegRotation, 0, 0)
      .rotate(BoneName.KNEE_L, toRadians(-(180 - biomech.backKneeBend)), 0, 0)

      // === FOOT POSITIONING (Stance Width: 0.0x - ZERO WIDTH CRANE STANCE) ===
      // Both feet at center for single-leg balance
      .position(BoneName.FOOT_L, footPositions.leftFootX, 0, 0)
      .position(BoneName.FOOT_R, footPositions.rightFootX, 0, 0)

      // Hip position - high for balance and mobility
      .position(BoneName.PELVIS, 0, hipYOffset, 0)
      .done<MartialArtsAnimationBuilder>()
      .build()
  );
};

/**
 * ☵ Gam Water Stance - 감 물 자세
 *
 * Back stance (뒤서기) from Hapkido with back-weighted position
 * for flow and adaptation techniques.
 *
 * Characteristics:
 * - 150° front leg (extended)
 * - 100° back knee (deep bend)
 * - 30/70 weight distribution (back-heavy)
 * - 1.1x shoulder width (medium-wide)
 *
 * @korean 감물자세
 */
export const createGamStance = (): SkeletalAnimation => {
  const biomech = KOREAN_STANCE_BIOMECHANICS.GAM_WATER;
  const guard = GAM_WATER_GUARD_POSE;

  const frontKneeRotation = toRadians(-(180 - biomech.frontKneeBend));
  const backKneeRotation = toRadians(-(180 - biomech.backKneeBend));

  const hipYOffset = -0.18 * (1.0 - biomech.hipHeight);
  const hipZOffset = -0.12 * biomech.weightDistribution.back;

  // Calculate foot positions based on stance width (발너비)
  const footPositions = calculateFootPositions(
    biomech.stanceWidth,
    DEFAULT_SHOULDER_WIDTH_CM,
  );

  return (
    MartialArtsAnimationBuilder.create("stance_gam", "감 자세")
      .asIdle(1.0, true)
      .at(0)
      // === ARM POSITIONS (from StanceGuardPoses) ===
      .rotate(
        BoneName.SHOULDER_L,
        guard.leftArm.shoulder.x,
        guard.leftArm.shoulder.y,
        guard.leftArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_L,
        guard.leftArm.elbow.x,
        guard.leftArm.elbow.y,
        guard.leftArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_L,
        guard.leftArm.wrist.x,
        guard.leftArm.wrist.y,
        guard.leftArm.wrist.z,
      )
      .rotate(
        BoneName.SHOULDER_R,
        guard.rightArm.shoulder.x,
        guard.rightArm.shoulder.y,
        guard.rightArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_R,
        guard.rightArm.elbow.x,
        guard.rightArm.elbow.y,
        guard.rightArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_R,
        guard.rightArm.wrist.x,
        guard.rightArm.wrist.y,
        guard.rightArm.wrist.z,
      )
      .rotate(BoneName.SPINE_UPPER, guard.torso.x, guard.torso.y, guard.torso.z)

      // === LEG POSITIONS (from biomechanics) ===
      // Front leg (right): Extended, light weight
      .rotate(BoneName.HIP_R, frontKneeRotation, 0, 0)
      .rotate(BoneName.KNEE_R, frontKneeRotation - 0.06, 0, 0)

      // Back leg (left): Deep bend for absorption
      .rotate(BoneName.HIP_L, backKneeRotation, 0, 0)
      .rotate(BoneName.KNEE_L, backKneeRotation + 0.15, 0, 0)

      // === FOOT POSITIONING (Stance Width: 1.15x shoulder width) ===
      .position(BoneName.FOOT_L, footPositions.leftFootX, 0, 0)
      .position(BoneName.FOOT_R, footPositions.rightFootX, 0, 0)

      // Hip position - back-weighted, medium-low
      .position(BoneName.PELVIS, 0, hipYOffset, hipZOffset)
      .done<MartialArtsAnimationBuilder>()
      .build()
  );
};

/**
 * ☶ Gan Mountain Stance - 간 산 자세
 *
 * Defensive stance (방어서기) from Hapkido with immovable position
 * for defensive mastery.
 *
 * Characteristics:
 * - 120° both knees (moderate bend)
 * - 40/60 weight distribution (slightly back)
 * - 1.0x shoulder width (standard)
 * - Medium-high hip height
 *
 * @korean 간산자세
 */
export const createGanStance = (): SkeletalAnimation => {
  const biomech = KOREAN_STANCE_BIOMECHANICS.GAN_MOUNTAIN;
  const guard = GAN_MOUNTAIN_GUARD_POSE;

  const kneeRotation = toRadians(-(180 - biomech.frontKneeBend));

  const hipYOffset = -0.13 * (1.0 - biomech.hipHeight);
  const hipZOffset = -0.06 * (biomech.weightDistribution.back - 0.5);

  // Calculate foot positions based on stance width (발너비)
  const footPositions = calculateFootPositions(
    biomech.stanceWidth,
    DEFAULT_SHOULDER_WIDTH_CM,
  );

  return (
    MartialArtsAnimationBuilder.create("stance_gan", "간 자세")
      .asIdle(1.0, true)
      .at(0)
      // === ARM POSITIONS (from StanceGuardPoses) ===
      .rotate(
        BoneName.SHOULDER_L,
        guard.leftArm.shoulder.x,
        guard.leftArm.shoulder.y,
        guard.leftArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_L,
        guard.leftArm.elbow.x,
        guard.leftArm.elbow.y,
        guard.leftArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_L,
        guard.leftArm.wrist.x,
        guard.leftArm.wrist.y,
        guard.leftArm.wrist.z,
      )
      .rotate(
        BoneName.SHOULDER_R,
        guard.rightArm.shoulder.x,
        guard.rightArm.shoulder.y,
        guard.rightArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_R,
        guard.rightArm.elbow.x,
        guard.rightArm.elbow.y,
        guard.rightArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_R,
        guard.rightArm.wrist.x,
        guard.rightArm.wrist.y,
        guard.rightArm.wrist.z,
      )
      .rotate(BoneName.SPINE_UPPER, guard.torso.x, guard.torso.y, guard.torso.z)

      // === LEG POSITIONS (from biomechanics) ===
      // Both legs: Moderate bend for solid defense
      .rotate(BoneName.HIP_R, kneeRotation, 0, 0)
      .rotate(BoneName.KNEE_R, kneeRotation - 0.09, 0, 0)
      .rotate(BoneName.HIP_L, kneeRotation, 0, 0)
      .rotate(BoneName.KNEE_L, kneeRotation - 0.09, 0, 0)

      // === FOOT POSITIONING (Stance Width: 1.45x shoulder width) ===
      .position(BoneName.FOOT_L, footPositions.leftFootX, 0, 0)
      .position(BoneName.FOOT_R, footPositions.rightFootX, 0, 0)

      // Hip position - slightly back, medium-high
      .position(BoneName.PELVIS, 0, hipYOffset, hipZOffset)
      .done<MartialArtsAnimationBuilder>()
      .build()
  );
};

/**
 * ☷ Gon Earth Stance - 곤 땅 자세
 *
 * Low stance (낮은서기) from Ssireum/Hapkido with very low position
 * for grounding and takedown techniques.
 *
 * Characteristics:
 * - 80° both knees (very deep bend)
 * - 50/50 weight distribution (grounded)
 * - 1.3x shoulder width (wide for grappling)
 * - Very low hip height
 *
 * @korean 곤땅자세
 */
export const createGonStance = (): SkeletalAnimation => {
  const biomech = KOREAN_STANCE_BIOMECHANICS.GON_EARTH;
  const guard = GON_EARTH_GUARD_POSE;

  const kneeRotation = toRadians(-(180 - biomech.frontKneeBend));

  const hipYOffset = -0.28 * (1.0 - biomech.hipHeight);

  // Calculate foot positions based on stance width (발너비)
  // Gon Earth has second-widest stance: 1.8x shoulder width
  const footPositions = calculateFootPositions(
    biomech.stanceWidth,
    DEFAULT_SHOULDER_WIDTH_CM,
  );

  return (
    MartialArtsAnimationBuilder.create("stance_gon", "곤 자세")
      .asIdle(1.0, true)
      .at(0)
      // === ARM POSITIONS (from StanceGuardPoses) ===
      .rotate(
        BoneName.SHOULDER_L,
        guard.leftArm.shoulder.x,
        guard.leftArm.shoulder.y,
        guard.leftArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_L,
        guard.leftArm.elbow.x,
        guard.leftArm.elbow.y,
        guard.leftArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_L,
        guard.leftArm.wrist.x,
        guard.leftArm.wrist.y,
        guard.leftArm.wrist.z,
      )
      .rotate(
        BoneName.SHOULDER_R,
        guard.rightArm.shoulder.x,
        guard.rightArm.shoulder.y,
        guard.rightArm.shoulder.z,
      )
      .rotate(
        BoneName.ELBOW_R,
        guard.rightArm.elbow.x,
        guard.rightArm.elbow.y,
        guard.rightArm.elbow.z,
      )
      .rotate(
        BoneName.WRIST_R,
        guard.rightArm.wrist.x,
        guard.rightArm.wrist.y,
        guard.rightArm.wrist.z,
      )
      .rotate(BoneName.SPINE_UPPER, guard.torso.x, guard.torso.y, guard.torso.z)

      // === LEG POSITIONS (from biomechanics) ===
      // Both legs: Very deep bend for takedowns
      .rotate(BoneName.HIP_R, kneeRotation, 0, 0)
      .rotate(BoneName.KNEE_R, kneeRotation - 0.15, 0, 0)
      .rotate(BoneName.HIP_L, kneeRotation, 0, 0)
      .rotate(BoneName.KNEE_L, kneeRotation - 0.15, 0, 0)

      // === FOOT POSITIONING (Stance Width: 1.8x shoulder width - SECOND WIDEST) ===
      .position(BoneName.FOOT_L, footPositions.leftFootX, 0, 0)
      .position(BoneName.FOOT_R, footPositions.rightFootX, 0, 0)

      // Hip position - very low for ground control
      .position(BoneName.PELVIS, 0, hipYOffset, 0)
      .done<MartialArtsAnimationBuilder>()
      .build()
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT STANCE ANIMATION MAP
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all stance-specific animations for easy access
 * 자세별 애니메이션 맵
 */
export const STANCE_ANIMATIONS: ReadonlyMap<string, SkeletalAnimation> =
  new Map([
    // Stance Idles (자세 대기)
    ["stance_geon", createGeonStance()],
    ["stance_tae", createTaeStance()],
    ["stance_li", createLiStance()],
    ["stance_jin", createJinStance()],
    ["stance_son", createSonStance()],
    ["stance_gam", createGamStance()],
    ["stance_gan", createGanStance()],
    ["stance_gon", createGonStance()],

    // Geon (건) - Heaven
    ["geon_heaven_strike", GEON_HEAVEN_STRIKE_ANIMATION],
    ["geon_heavenly_fist", GEON_HEAVENLY_FIST_ANIMATION],
    ["geon_frontal_kick", GEON_FRONTAL_KICK_ANIMATION],
    ["geon_roundhouse_kick", GEON_ROUNDHOUSE_ANIMATION],
    ["geon_axe_kick", GEON_AXE_KICK_ANIMATION],
    ["geon_palm_strike", GEON_PALM_STRIKE_ANIMATION],
    ["geon_elbow_smash", GEON_ELBOW_SMASH_ANIMATION],

    // Tae (태) - Lake
    ["tae_flowing_strikes", TAE_FLOWING_STRIKES_ANIMATION],
    ["tae_wrist_lock", TAE_WRIST_LOCK_ANIMATION],
    ["tae_small_circle", TAE_SMALL_CIRCLE_ANIMATION],
    ["tae_finger_lock", TAE_FINGER_LOCK_ANIMATION],
    ["tae_elbow_lock", TAE_ELBOW_LOCK_ANIMATION],
    ["tae_shoulder_lock", TAE_SHOULDER_LOCK_ANIMATION],
    ["tae_arm_bar", TAE_ARM_BAR_ANIMATION],

    // Li (리) - Fire
    // Enhanced Li animations from LiStanceAnimations and LiTechniqueAnimations
    ["li_idle_targeting", LI_IDLE_TARGETING],
    ["li_diagonal_dart_step", LI_DIAGONAL_DART_STEP],
    ["li_linear_pierce_step", LI_LINEAR_PIERCE_STEP],
    ["li_forward_targeting_guard", LI_FORWARD_TARGETING_GUARD],
    ["li_fire_spear", LI_FIRE_SPEAR_ANIMATION],
    ["li_nerve_strike_combo", LI_NERVE_STRIKE_COMBO],
    // Original Li animations
    ["li_flame_spear", LI_FLAME_SPEAR_ANIMATION],
    ["li_temple_strike", LI_TEMPLE_STRIKE_ANIMATION],
    ["li_nerve_strike", LI_NERVE_STRIKE_ANIMATION],
    ["li_sidekick", LI_SIDEKICK_ANIMATION],
    ["li_pressure_point", LI_PRESSURE_POINT_ANIMATION],
    ["li_solar_plexus_strike", LI_SOLAR_PLEXUS_ANIMATION],

    // Jin (진) - Thunder
    ["jin_idle_coiled", JIN_IDLE_COILED],
    ["jin_explosive_burst", JIN_EXPLOSIVE_BURST],
    ["jin_jumping_advance", JIN_JUMPING_ADVANCE],
    ["jin_thunder_flash", JIN_THUNDER_FLASH_ANIMATION],
    ["jin_jumping_knee_strike", JIN_JUMPING_KNEE_STRIKE],
    ["jin_lightning_flash", JIN_LIGHTNING_FLASH_ANIMATION],
    ["jin_jumping_front_kick", JIN_JUMPING_FRONT_KICK_ANIMATION],
    ["jin_tornado_kick", JIN_TORNADO_KICK_ANIMATION],
    ["jin_flying_sidekick", JIN_FLYING_SIDEKICK_ANIMATION],
    ["jin_back_kick", JIN_BACK_KICK_ANIMATION],
    ["jin_knee_strike", JIN_KNEE_STRIKE_ANIMATION],

    // Son (손) - Wind
    ["son_whirlwind_barrage", SON_WHIRLWIND_BARRAGE_ANIMATION],
    ["son_sweeping_low_kick", SON_SWEEPING_LOW_KICK_ANIMATION],
    ["son_rhythmic_strikes", SON_RHYTHMIC_STRIKES_ANIMATION],
    ["son_flowing_push", SON_FLOWING_PUSH_ANIMATION],
    ["son_spinning_elbow", SON_SPINNING_ELBOW_ANIMATION],
    ["son_rapid_footwork", SON_RAPID_FOOTWORK_ANIMATION],

    // Gam (감) - Water
    ["gam_water_counter", GAM_WATER_COUNTER_ANIMATION],
    ["gam_redirect_throw", GAM_REDIRECT_THROW_ANIMATION],
    ["gam_flowing_block", GAM_FLOWING_BLOCK_ANIMATION],
    ["gam_circular_parry", GAM_CIRCULAR_PARRY_ANIMATION],
    ["gam_hip_throw", GAM_HIP_THROW_ANIMATION],
    ["gam_wrist_twist_counter", GAM_WRIST_TWIST_COUNTER_ANIMATION],

    // Gan (간) - Mountain
    ["gan_rock_defense_legacy", GAN_ROCK_DEFENSE_ANIMATION_LEGACY],
    ["gan_immovable_stance", GAN_IMMOVABLE_STANCE_ANIMATION],
    ["gan_iron_block", GAN_IRON_BLOCK_ANIMATION],
    ["gan_counter_strike", GAN_COUNTER_STRIKE_ANIMATION],
    ["gan_mountain_stance_lock", GAN_MOUNTAIN_STANCE_LOCK_ANIMATION],
    ["gan_reversal_technique", GAN_REVERSAL_TECHNIQUE_ANIMATION],

    // Gon (곤) - Earth
    ["gon_earth_embrace", GON_EARTH_EMBRACE_ANIMATION],
    ["gon_leg_sweep", GON_LEG_SWEEP_ANIMATION],
    ["gon_ssireum_throw", GON_SSIREUM_THROW_ANIMATION],
    ["gon_ground_pound", GON_GROUND_POUND_ANIMATION],
    ["gon_ankle_pick", GON_ANKLE_PICK_ANIMATION],
    ["gon_body_lock_takedown", GON_BODY_LOCK_TAKEDOWN_ANIMATION],
    ["gon_sacrifice_throw", GON_SACRIFICE_THROW_ANIMATION],
  ]);
