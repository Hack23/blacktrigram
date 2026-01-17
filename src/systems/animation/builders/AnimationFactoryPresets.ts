/**
 * Animation Factory Presets
 *
 * Reusable factory functions to reduce code duplication across animation files.
 * Provides preset configurations for common animation patterns.
 *
 * 애니메이션 팩토리 프리셋 - 코드 중복 감소를 위한 재사용 가능한 팩토리 함수
 *
 * @module systems/animation/builders/AnimationFactoryPresets
 * @korean 애니메이션팩토리프리셋
 */

import type { TrigramStance } from "../../../types/common";
import type { SkeletalAnimation } from "../../../types/skeletal";
import type { LeadFoot } from "../utils/AnimationMirror";
import {
  getAnimationForStance,
  mirrorAnimation,
} from "../utils/AnimationMirror";
import {
  MartialArtsAnimationBuilder,
  TECHNIQUE_TIMING,
} from "./MartialArtsAnimationBuilder";

// ═══════════════════════════════════════════════════════════════════════════
// TIMING PRESETS (타이밍 프리셋)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Standard timing configurations for different technique speeds
 * 다양한 기술 속도에 대한 표준 타이밍 구성
 */
export const TIMING_PRESETS = {
  /** Fast techniques (550ms) - Jabs, quick strikes */
  FAST: TECHNIQUE_TIMING.FAST,
  /** Fast-Medium techniques (600ms) - Low kicks, lead hooks */
  FAST_MEDIUM: TECHNIQUE_TIMING.FAST_MEDIUM,
  /** Medium-Light techniques (700ms) - Front kicks, uppercuts */
  MEDIUM_LIGHT: TECHNIQUE_TIMING.MEDIUM_LIGHT,
  /** Medium techniques (730ms) - Crosses, roundhouse kicks */
  MEDIUM: TECHNIQUE_TIMING.MEDIUM,
  /** Medium-Heavy techniques (750ms) - Side kicks */
  MEDIUM_HEAVY: TECHNIQUE_TIMING.MEDIUM_HEAVY,
  /** Heavy-Light techniques (800ms) - Spinning kicks */
  HEAVY_LIGHT: TECHNIQUE_TIMING.HEAVY_LIGHT,
  /** Heavy-Medium techniques (850ms) - Crescent kicks */
  HEAVY_MEDIUM: TECHNIQUE_TIMING.HEAVY_MEDIUM,
  /** Heavy techniques (1000ms) - Jumping techniques */
  HEAVY: TECHNIQUE_TIMING.HEAVY,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// KICK FACTORY (발차기 팩토리)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configuration for kick animation creation
 * 발차기 애니메이션 생성 설정
 */
/**
 * Timing configuration for technique animations
 */
interface TechniqueTiming {
  readonly chamber: number;
  readonly extend: number;
  readonly peak: number;
  readonly retract: number;
  readonly recover: number;
  readonly total: number;
}

export interface KickConfig {
  readonly name: string;
  readonly koreanName: string;
  readonly timing: TechniqueTiming;
  readonly kickType:
    | "front"
    | "roundhouse"
    | "side"
    | "axe"
    | "back"
    | "low"
    | "crescent"
    | "spin";
  readonly guardDuringKick?: "middle" | "high";
  readonly guardAtPeak?: "middle" | "high";
}

/**
 * Create a standard kick animation with proper phases
 *
 * All kicks follow the Korean martial arts pattern:
 * 1. 기본자세 (Stance) - Fighting stance at t=0
 * 2. 준비 (Chamber) - Knee lifts
 * 3. 차기 (Extension) - Leg extends
 * 4. 정점 (Peak) - Hold at extension
 * 5. 회수 (Retraction) - Return through chamber
 * 6. 복귀 (Recovery) - Return to stance
 *
 * @param config - Kick configuration
 * @returns Complete kick animation
 *
 * @korean 표준발차기애니메이션생성
 */
export function createKickAnimation(config: KickConfig): SkeletalAnimation {
  const {
    name,
    koreanName,
    timing,
    kickType,
    guardDuringKick = "middle",
    guardAtPeak = "middle",
  } = config;

  const builder = MartialArtsAnimationBuilder.create(name, koreanName)
    .asAttack(timing.total)
    .stance()
    .withKoreanMiddleGuard();

  // Helper to apply guard based on type
  const applyGuard = (type: "middle" | "high") => {
    if (type === "high") {
      builder.withKoreanHighGuard();
    } else {
      builder.withKoreanMiddleGuard();
    }
  };

  // Apply kick-type specific chamber and extension
  switch (kickType) {
    case "front":
      builder
        .chamber(timing.chamber)
        .withKoreanMiddleGuard()
        .extend(timing.extend);
      applyGuard(guardDuringKick);
      builder.extend(timing.peak);
      applyGuard(guardAtPeak);
      break;

    case "roundhouse":
      builder
        .roundhouseChamber(timing.chamber)
        .withKoreanMiddleGuard()
        .roundhouseExtend(timing.extend);
      applyGuard(guardDuringKick);
      builder.roundhouseExtend(timing.peak);
      applyGuard(guardAtPeak);
      break;

    case "side":
      builder
        .sideKickChamber(timing.chamber)
        .withKoreanHighGuard()
        .sideKickExtend(timing.extend);
      applyGuard(guardDuringKick);
      builder.sideKickExtend(timing.peak);
      applyGuard(guardAtPeak);
      break;

    case "axe":
      builder
        .axeKickRise(timing.chamber)
        .withKoreanHighGuard()
        .axeKickChop(timing.extend);
      applyGuard(guardDuringKick);
      builder.axeKick(timing.peak);
      applyGuard(guardAtPeak);
      break;

    case "back":
      builder
        .backKickSpin(timing.chamber)
        .withKoreanHighGuard()
        .backKickThrust(timing.extend);
      applyGuard(guardDuringKick);
      builder.backKickThrust(timing.peak);
      applyGuard(guardAtPeak);
      break;

    case "low":
      builder
        .lowKickChamber(timing.chamber)
        .withKoreanMiddleGuard()
        .lowKickSweep(timing.extend);
      applyGuard(guardDuringKick);
      builder.lowKickSweep(timing.peak);
      applyGuard(guardAtPeak);
      break;

    case "crescent":
      builder
        .crescentKickChamber(timing.chamber)
        .withKoreanHighGuard()
        .crescentKickArc(timing.extend);
      applyGuard(guardDuringKick);
      builder.crescentKickArc(timing.peak);
      applyGuard(guardAtPeak);
      break;

    case "spin":
      builder
        .spin(timing.chamber)
        .withKoreanHighGuard()
        .spinKick(timing.extend);
      applyGuard(guardDuringKick);
      builder.spinKick(timing.peak);
      applyGuard(guardAtPeak);
      break;
  }

  // Common recovery for all kicks
  builder
    .retract(timing.retract)
    .recover(timing.recover)
    .withKoreanMiddleGuard();

  return builder.build();
}

// ═══════════════════════════════════════════════════════════════════════════
// PUNCH FACTORY (주먹 팩토리)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configuration for punch animation creation
 * 주먹 애니메이션 생성 설정
 */
export interface PunchConfig {
  readonly name: string;
  readonly koreanName: string;
  readonly timing: TechniqueTiming;
  readonly punchType:
    | "jab"
    | "cross"
    | "hook"
    | "uppercut"
    | "palm"
    | "backfist";
  readonly hand: "left" | "right";
  readonly guardHand?: "left" | "right";
}

/**
 * Create a standard punch animation with proper phases
 *
 * All punches follow Korean martial arts pattern:
 * 1. 준비 (Chamber) - Fist at hip
 * 2. 지르기 (Extension) - Arm extends with rotation
 * 3. 정점 (Peak) - Maximum reach
 * 4. 복귀 (Recovery) - Return to guard
 *
 * @param config - Punch configuration
 * @returns Complete punch animation
 *
 * @korean 표준주먹애니메이션생성
 */
export function createPunchAnimation(config: PunchConfig): SkeletalAnimation {
  const {
    name,
    koreanName,
    timing,
    punchType,
    hand,
    guardHand = hand === "left" ? "right" : "left",
  } = config;

  const builder = MartialArtsAnimationBuilder.create(name, koreanName).asAttack(
    timing.total,
  );

  // Apply punch-type specific phases
  switch (punchType) {
    case "jab":
    case "cross":
      builder
        .punchChamber(timing.chamber, hand)
        .withKoreanMiddleGuard(guardHand)
        .punchExtend(timing.extend, hand)
        .withKoreanMiddleGuard(guardHand)
        .punchPeak(timing.peak, hand)
        .withKoreanMiddleGuard(guardHand);
      break;

    case "hook":
      builder
        .hookWindup(timing.chamber, hand)
        .withKoreanMiddleGuard(guardHand)
        .hookPunch(timing.extend + timing.peak, hand)
        .withKoreanMiddleGuard(guardHand);
      break;

    case "uppercut":
      builder
        .uppercutCrouch(timing.chamber)
        .withKoreanMiddleGuard(guardHand)
        .uppercutPunch(timing.extend + timing.peak)
        .withKoreanMiddleGuard(guardHand);
      break;

    case "palm":
      builder
        .punchWindup(timing.chamber)
        .palmStrike(timing.extend)
        .palmStrike(timing.peak);
      break;

    case "backfist":
      // Use standard punch mechanics for backfist
      builder
        .punchChamber(timing.chamber, hand)
        .withKoreanMiddleGuard(guardHand)
        .withBackfist(hand)
        .punchExtend(timing.extend, hand)
        .withKoreanMiddleGuard(guardHand)
        .withBackfist(hand)
        .punchPeak(timing.peak, hand)
        .withKoreanMiddleGuard(guardHand);
      break;
  }

  // Common recovery
  builder.recover(timing.retract + timing.recover).withKoreanMiddleGuard();

  return builder.build();
}

// ═══════════════════════════════════════════════════════════════════════════
// LOCOMOTION FACTORY (이동 팩토리)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configuration for locomotion animations
 * 이동 애니메이션 설정
 */
export interface LocomotionConfig {
  readonly stance: TrigramStance;
  readonly type: "walk" | "run" | "idle";
  readonly duration?: number;
}

/**
 * Standard locomotion durations
 */
const LOCOMOTION_DURATIONS = {
  walk: 1.0, // 1 second per step cycle
  run: 0.6, // Faster for running
  idle: 3.0, // Breathing cycle
} as const;

/**
 * Create a trigram-specific locomotion animation
 *
 * Note: Uses basic locomotion with trigram guard applied.
 * For more complex trigram-specific locomotion patterns,
 * use the dedicated StanceLocomotionAnimations module.
 *
 * @param config - Locomotion configuration
 * @returns Complete locomotion animation with trigram styling
 *
 * @korean 팔괘별이동애니메이션생성
 */
export function createTrigramLocomotion(
  config: LocomotionConfig,
): SkeletalAnimation {
  const { stance, type, duration = LOCOMOTION_DURATIONS[type] } = config;

  const builder = MartialArtsAnimationBuilder.create(
    `${stance.toLowerCase()}_${type}`,
    `${stance} ${type === "walk" ? "걷기" : type === "run" ? "달리기" : "대기"}`,
  );

  switch (type) {
    case "walk":
      builder
        .asMovement(duration, true)
        .stance()
        .withTrigramGuard(stance)
        .step(duration * 0.5)
        .withTrigramGuard(stance);
      break;

    case "run":
      builder
        .asMovement(duration, true)
        .stance()
        .withTrigramGuard(stance)
        .step(duration * 0.3)
        .withTrigramGuard(stance);
      break;

    case "idle":
      builder.asIdle(duration, true).stance().withTrigramGuard(stance);
      break;
  }

  return builder.build();
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFENSIVE ANIMATION FACTORY (방어 애니메이션 팩토리)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configuration for defensive animations
 * 방어 애니메이션 설정
 */
export interface DefenseConfig {
  readonly name: string;
  readonly koreanName: string;
  readonly timing: TechniqueTiming;
  readonly defenseType: "block" | "parry" | "slip" | "bob" | "weave";
  readonly height: "high" | "middle" | "low";
}

/**
 * Create a defensive animation
 *
 * @param config - Defense configuration
 * @returns Complete defensive animation
 *
 * @korean 방어애니메이션생성
 */
export function createDefenseAnimation(
  config: DefenseConfig,
): SkeletalAnimation {
  const { name, koreanName, timing, defenseType, height } = config;

  const builder = MartialArtsAnimationBuilder.create(name, koreanName)
    .asDefense(timing.total)
    .stance()
    .withKoreanMiddleGuard();

  switch (defenseType) {
    case "block":
      if (height === "high") {
        builder.blockHigh(timing.chamber + timing.extend).withKoreanHighGuard();
      } else if (height === "low") {
        builder.blockLow(timing.chamber + timing.extend).withKoreanLowGuard();
      } else {
        // Middle block - use parry mechanics with high guard
        builder.parry(timing.chamber + timing.extend).withKoreanMiddleGuard();
      }
      break;

    case "parry":
      builder.parry(timing.chamber + timing.extend);
      break;

    case "slip":
      builder.duck(timing.chamber + timing.extend);
      break;

    case "bob":
      builder.bob(timing.chamber + timing.extend);
      break;

    case "weave":
      builder.weave(timing.chamber + timing.extend);
      break;
  }

  builder.recover(timing.retract + timing.recover).withKoreanMiddleGuard();

  return builder.build();
}

// ═══════════════════════════════════════════════════════════════════════════
// STANCE MIRRORING UTILITIES (자세 반전 유틸리티)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create both orthodox and southpaw versions of an animation
 *
 * Useful for creating complete animation sets that work for both stance sides.
 *
 * @param baseAnimation - Base animation (assumed orthodox/left-foot-forward)
 * @returns Object with both stance versions
 *
 * @korean 양자세애니메이션생성
 */
export function createBothStances(baseAnimation: SkeletalAnimation): {
  readonly orthodox: SkeletalAnimation;
  readonly southpaw: SkeletalAnimation;
} {
  return {
    orthodox: baseAnimation,
    southpaw: mirrorAnimation(baseAnimation, {
      nameSuffix: "_southpaw",
      koreanNameSuffix: "(사우스포)",
    }),
  };
}

/**
 * Get animation for player's current stance side
 *
 * @param baseAnimation - Base animation (orthodox)
 * @param leadFoot - Player's current lead foot
 * @param cache - Optional cache for mirrored animations
 * @returns Animation matching player's stance
 *
 * @korean 자세에맞는애니메이션선택
 */
export { getAnimationForStance };

// ═══════════════════════════════════════════════════════════════════════════
// COMBO FACTORY (콤보 팩토리)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a combo animation from a sequence of techniques
 *
 * @param name - Combo name
 * @param koreanName - Korean name
 * @param techniques - Array of technique names to chain
 * @returns Complete combo animation
 *
 * @korean 콤보애니메이션생성
 */
export function createComboAnimation(
  name: string,
  koreanName: string,
  techniques: readonly string[],
): SkeletalAnimation {
  const timing = TECHNIQUE_TIMING.COMBO_FAST;
  const totalDuration = timing.total * techniques.length;

  const builder = MartialArtsAnimationBuilder.create(name, koreanName)
    .asAttack(totalDuration)
    .stance()
    .withKoreanMiddleGuard();

  // Chain techniques with fast transitions
  techniques.forEach((technique, _index) => {
    switch (technique) {
      case "jab":
        builder
          .punchChamber(timing.chamber, "left")
          .punchExtend(timing.extend, "left")
          .punchPeak(timing.peak, "left");
        break;
      case "cross":
        builder
          .punchChamber(timing.chamber, "right")
          .punchExtend(timing.extend, "right")
          .punchPeak(timing.peak, "right");
        break;
      case "hook":
        builder
          .hookWindup(timing.chamber, "left")
          .hookPunch(timing.extend + timing.peak, "left");
        break;
      case "uppercut":
        builder
          .uppercutCrouch(timing.chamber)
          .uppercutPunch(timing.extend + timing.peak);
        break;
      case "front_kick":
        builder.chamber(timing.chamber).extend(timing.extend);
        break;
      case "roundhouse":
        builder
          .roundhouseChamber(timing.chamber)
          .roundhouseExtend(timing.extend);
        break;
    }

    // Quick recovery between techniques (except last)
    if (_index < techniques.length - 1) {
      builder.recover(timing.recover * 0.5);
    }
  });

  // Final recovery
  builder.recover(timing.recover).withKoreanMiddleGuard();

  return builder.build();
}

// ═══════════════════════════════════════════════════════════════════════════
// PRESET ANIMATIONS (프리셋 애니메이션)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Pre-built kick animations using factory
 * 팩토리를 사용한 사전 빌드 발차기 애니메이션
 */
export const PRESET_KICKS = {
  FRONT_KICK: createKickAnimation({
    name: "front_kick",
    koreanName: "앞차기",
    timing: TIMING_PRESETS.MEDIUM_LIGHT,
    kickType: "front",
  }),

  ROUNDHOUSE_KICK: createKickAnimation({
    name: "roundhouse_kick",
    koreanName: "돌려차기",
    timing: TIMING_PRESETS.HEAVY_LIGHT,
    kickType: "roundhouse",
    guardDuringKick: "high",
    guardAtPeak: "high",
  }),

  SIDE_KICK: createKickAnimation({
    name: "side_kick",
    koreanName: "옆차기",
    timing: TIMING_PRESETS.MEDIUM_HEAVY,
    kickType: "side",
    guardDuringKick: "high",
    guardAtPeak: "high",
  }),

  LOW_KICK: createKickAnimation({
    name: "low_kick",
    koreanName: "하단차기",
    timing: TIMING_PRESETS.FAST_MEDIUM,
    kickType: "low",
  }),
} as const;

/**
 * Pre-built punch animations using factory
 * 팩토리를 사용한 사전 빌드 주먹 애니메이션
 */
export const PRESET_PUNCHES = {
  JAB: createPunchAnimation({
    name: "jab",
    koreanName: "잽",
    timing: TIMING_PRESETS.FAST,
    punchType: "jab",
    hand: "left",
  }),

  CROSS: createPunchAnimation({
    name: "cross",
    koreanName: "크로스",
    timing: TIMING_PRESETS.MEDIUM,
    punchType: "cross",
    hand: "right",
  }),

  LEAD_HOOK: createPunchAnimation({
    name: "lead_hook",
    koreanName: "리드훅",
    timing: TIMING_PRESETS.MEDIUM,
    punchType: "hook",
    hand: "left",
  }),

  REAR_UPPERCUT: createPunchAnimation({
    name: "rear_uppercut",
    koreanName: "리어어퍼컷",
    timing: TIMING_PRESETS.MEDIUM,
    punchType: "uppercut",
    hand: "right",
  }),
} as const;

/**
 * Pre-built combo animations using factory
 * 팩토리를 사용한 사전 빌드 콤보 애니메이션
 */
export const PRESET_COMBOS = {
  JAB_CROSS: createComboAnimation("jab_cross", "잽-크로스", ["jab", "cross"]),

  ONE_TWO_HOOK: createComboAnimation("one_two_hook", "원투훅", [
    "jab",
    "cross",
    "hook",
  ]),

  JAB_CROSS_KICK: createComboAnimation("jab_cross_kick", "잽크로스킥", [
    "jab",
    "cross",
    "front_kick",
  ]),
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// TRIGRAM BREATHING ANIMATION (팔괘 호흡)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a trigram-specific breathing/idle animation
 *
 * Each trigram has a unique breathing pattern reflecting its elemental nature.
 *
 * @param stance - Trigram stance
 * @returns Breathing animation for the stance
 *
 * @korean 팔괘호흡애니메이션생성
 */
export function createTrigramBreathing(
  stance: TrigramStance,
): SkeletalAnimation {
  return createTrigramLocomotion({
    stance,
    type: "idle",
    duration: 3.0,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export type { LeadFoot };
