/**
 * Martial Arts Animation Builder
 *
 * Korean martial arts specific animation builder with semantic methods
 * that make animations readable by martial arts practitioners.
 *
 * 한국 무술 애니메이션 빌더 - 무술 전문가가 이해할 수 있는 시맨틱 메서드 제공
 *
 * @module systems/animation/MartialArtsAnimationBuilder
 * @category Animation System
 * @korean 무술애니메이션빌더
 */

import type {
  AnimationKeyframe,
  SkeletalAnimation,
} from "../../types/skeletal";
import { BoneName } from "../../types/skeletal";

// Import constants from dedicated constants module
import {
  AnimationType,
  HAND_POSES,
  KICK_PHASES,
  MARTIAL_POSES,
  PUNCH_PHASES,
} from "./MartialArtsConstants";

// Import keyframe configuration helper
import { KeyframeConfig } from "./KeyframeConfig";

// Import hand pose utilities
import {
  applyHandPoseToConfig,
  applyHandPoseToKeyframe,
} from "./HandPoseApplicator";

// Import kick phase utilities
import {
  applyHighPeakPhaseToConfig,
  applyKickPhaseToConfig,
  applyRoundhousePhaseToConfig,
  applySideKickPhaseToConfig,
} from "./KickPhaseApplicator";

// Import martial pose utilities
import { applyMartialPoseToKeyframe } from "./MartialPoseApplicator";

// Import punch phase utilities
import { applyPunchPhaseToConfig } from "./PunchPhaseApplicator";

// Re-export constants for backward compatibility
export { AnimationType, HAND_POSES, KICK_PHASES, MARTIAL_POSES, PUNCH_PHASES };

// ═══════════════════════════════════════════════════════════════════════════
// TECHNIQUE TIMING CONSTANTS (기술 타이밍 상수)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Technique Timing Constants
 *
 * Defines standard timing phases for martial arts techniques to ensure
 * all movements are visible and comprehensible. Minimum total duration
 * is 0.5s to prevent "teleporting" strikes.
 *
 * Korean martial arts emphasize visible technique phases:
 * - 준비 (Preparation) - Wind-up/chamber
 * - 실행 (Execution) - Strike/extension
 * - 회수 (Recovery) - Retraction
 * - 복귀 (Return) - Return to stance
 *
 * @korean 기술타이밍상수
 */
export const TECHNIQUE_TIMING = {
  /**
   * Fast techniques (빠른 기술)
   * Examples: Jabs, quick strikes, fast kicks
   * Total: 550ms
   */
  FAST: {
    chamber: 0.10,    // 100ms wind-up (준비)
    extend: 0.15,     // 150ms strike (실행)
    peak: 0.05,       // 50ms hold at extension (정점)
    retract: 0.10,    // 100ms pull back (회수)
    recover: 0.15,    // 150ms return to stance (복귀)
    total: 0.55,      // 550ms total
  },
  /**
   * Fast-Medium techniques (빠른-중간 기술)
   * Examples: Low kicks, lead hooks, quick counters
   * Total: 600ms
   */
  FAST_MEDIUM: {
    chamber: 0.10,    // 100ms wind-up (준비)
    extend: 0.15,     // 150ms strike (실행)
    peak: 0.05,       // 50ms hold at extension (정점)
    retract: 0.10,    // 100ms pull back (회수)
    recover: 0.20,    // 200ms return to stance (복귀)
    total: 0.60,      // 600ms total
  },
  /**
   * Medium-Light techniques (중간-가벼운 기술)
   * Examples: Lead uppercuts, backfists, push kicks
   * Total: 700ms
   */
  MEDIUM_LIGHT: {
    chamber: 0.12,    // 120ms wind-up (준비)
    extend: 0.18,     // 180ms strike (실행)
    peak: 0.08,       // 80ms hold at extension (정점)
    retract: 0.10,    // 100ms pull back (회수)
    recover: 0.22,    // 220ms return to stance (복귀)
    total: 0.70,      // 700ms total
  },
  /**
   * Medium techniques (중간 기술)
   * Examples: Crosses, roundhouse kicks, hooks
   * Total: 730ms
   */
  MEDIUM: {
    chamber: 0.15,    // 150ms wind-up (준비)
    extend: 0.20,     // 200ms strike (실행)
    peak: 0.08,       // 80ms hold at extension (정점)
    retract: 0.12,    // 120ms pull back (회수)
    recover: 0.18,    // 180ms return to stance (복귀)
    total: 0.73,      // 730ms total
  },
  /**
   * Medium-Heavy techniques (중간-무거운 기술)
   * Examples: Body shots, side kicks, crescent kicks
   * Total: 750ms
   */
  MEDIUM_HEAVY: {
    chamber: 0.12,    // 120ms wind-up (준비)
    extend: 0.20,     // 200ms strike (실행)
    peak: 0.08,       // 80ms hold at extension (정점)
    retract: 0.15,    // 150ms pull back (회수)
    recover: 0.20,    // 200ms return to stance (복귀)
    total: 0.75,      // 750ms total
  },
  /**
   * Heavy-Light techniques (무거운-가벼운 기술)
   * Examples: Hooks, uppercuts, sweep kicks
   * Total: 800ms
   */
  HEAVY_LIGHT: {
    chamber: 0.15,    // 150ms wind-up (준비)
    extend: 0.20,     // 200ms strike (실행)
    peak: 0.10,       // 100ms hold at extension (정점)
    retract: 0.15,    // 150ms pull back (회수)
    recover: 0.20,    // 200ms return to stance (복귀)
    total: 0.80,      // 800ms total
  },
  /**
   * Heavy-Medium techniques (무거운-중간 기술)
   * Examples: Question mark kicks, crescent kicks
   * Total: 850ms
   */
  HEAVY_MEDIUM: {
    chamber: 0.12,    // 120ms wind-up (준비)
    extend: 0.22,     // 220ms strike (실행)
    peak: 0.08,       // 80ms hold at extension (정점)
    retract: 0.15,    // 150ms pull back (회수)
    recover: 0.28,    // 280ms return to stance (복귀)
    total: 0.85,      // 850ms total
  },
  /**
   * Heavy techniques (무거운 기술)
   * Examples: Spinning kicks, power punches, jumping techniques
   * Total: 1000ms
   */
  HEAVY: {
    chamber: 0.20,    // 200ms wind-up (준비)
    extend: 0.30,     // 300ms strike (실행)
    peak: 0.12,       // 120ms hold at extension (정점)
    retract: 0.15,    // 150ms pull back (회수)
    recover: 0.23,    // 230ms return to stance (복귀)
    total: 1.00,      // 1000ms total
  },
  /**
   * Combo techniques (연속 기술)
   * Examples: Jab-cross, double hooks, double kicks
   * Total: 900ms
   */
  COMBO_FAST: {
    chamber: 0.08,    // 80ms wind-up (준비)
    extend: 0.12,     // 120ms strike (실행)
    peak: 0.08,       // 80ms hold at extension (정점)
    retract: 0.10,    // 100ms pull back (회수)
    recover: 0.32,    // 320ms return to stance (복귀)
    total: 0.90,      // 900ms total
  },
  /**
   * Jumping techniques (뛰어차기 기술)
   * Examples: Jumping kicks, jumping punches
   * Total: 900ms
   */
  JUMPING: {
    chamber: 0.18,    // 180ms wind-up (준비)
    extend: 0.22,     // 220ms strike (실행)
    peak: 0.08,       // 80ms hold at extension (정점)
    retract: 0.12,    // 120ms pull back (회수)
    recover: 0.30,    // 300ms return to stance (복귀)
    total: 0.90,      // 900ms total
  },
  /**
   * Combo heavy techniques (연속 무거운 기술)
   * Examples: Double kicks with different heights
   * Total: 1100ms
   */
  COMBO_HEAVY: {
    chamber: 0.12,    // 120ms wind-up (준비)
    extend: 0.22,     // 220ms strike (실행)
    peak: 0.08,       // 80ms hold at extension (정점)
    retract: 0.15,    // 150ms pull back (회수)
    recover: 0.38,    // 380ms return to stance (복귀)
    total: 1.10,      // 1100ms total
  },
  /**
   * Spinning techniques (회전 기술)
   * Examples: Spinning backfist, tornado kick, spinning heel kick, spinning back kick
   * Total: 1200ms
   */
  SPINNING: {
    chamber: 0.30,    // 300ms wind-up with rotation start (준비+회전)
    extend: 0.35,     // 350ms strike through rotation (실행)
    peak: 0.12,       // 120ms hold at extension (정점)
    retract: 0.15,    // 150ms pull back (회수)
    recover: 0.28,    // 280ms complete rotation recovery (복귀)
    total: 1.20,      // 1200ms total
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// MARTIAL ARTS ANIMATION BUILDER (무술 애니메이션 빌더)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Martial Arts Animation Builder
 *
 * Fluent API for creating Korean martial arts animations with semantic methods.
 * Designed to be readable by martial arts practitioners.
 *
 * @example
 * ```typescript
 * // Create a front kick (앞차기)
 * const frontKick = MartialArtsAnimationBuilder
 *   .create("front_kick", "앞차기")
 *   .asAttack(0.55)
 *   .chamber()           // 준비 - Knee lifts
 *   .withHighGuard()     // 상단방어 - Protect face
 *   .extend()            // 차기 - Leg extends
 *   .retract()           // 회수 - Return to chamber
 *   .recover()           // 복귀 - Return to stance
 *   .build();
 * ```
 *
 * @korean 무술애니메이션빌더
 */
export class MartialArtsAnimationBuilder {
  private name: string;
  private koreanName: string;
  private duration: number = 0.5;
  private type: "attack" | "defense" | "movement" | "idle" = "attack";
  private loop: boolean = false;
  private keyframes: AnimationKeyframe[] = [];
  private currentTime: number = 0;

  private constructor(name: string, koreanName: string) {
    this.name = name;
    this.koreanName = koreanName;
  }

  /**
   * Create new martial arts animation
   * @param name - English animation name
   * @param koreanName - Korean animation name (한글이름)
   */
  static create(name: string, koreanName: string): MartialArtsAnimationBuilder {
    return new MartialArtsAnimationBuilder(name, koreanName);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ANIMATION TYPE SETTERS (애니메이션 타입 설정)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Configure as attack animation (공격 애니메이션)
   */
  asAttack(duration: number): this {
    this.type = "attack";
    this.duration = duration;
    return this;
  }

  /**
   * Configure as defense animation (방어 애니메이션)
   */
  asDefense(duration: number): this {
    this.type = "defense";
    this.duration = duration;
    return this;
  }

  /**
   * Configure as movement animation (이동 애니메이션)
   */
  asMovement(duration: number, shouldLoop: boolean = false): this {
    this.type = "movement";
    this.duration = duration;
    this.loop = shouldLoop;
    return this;
  }

  /**
   * Configure as idle/stance animation (대기 애니메이션)
   */
  asIdle(duration: number, shouldLoop: boolean = true): this {
    this.type = "idle";
    this.duration = duration;
    this.loop = shouldLoop;
    return this;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // KICK TECHNIQUES (발차기 기술)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Chamber - Knee lifts to waist height (준비자세)
   * Starting position for all kicks
   * @korean 준비자세
   */
  chamber(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      applyKickPhaseToConfig(kf, KICK_PHASES.CHAMBER);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Extend - Leg snaps forward (차기 - 확장)
   * @korean 차기확장
   */
  extend(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      applyKickPhaseToConfig(kf, KICK_PHASES.EXTENSION, { includeAnkle: true });
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Retract - Return to chamber (회수)
   * @korean 회수자세
   */
  retract(timeOffset: number = 0.15, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      applyKickPhaseToConfig(kf, KICK_PHASES.CHAMBER, {
        includePelvis: false,
        resetFoot: true,
      });
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Set down - Foot returns to ground (착지)
   * @korean 착지
   */
  setDown(timeOffset: number = 0.1, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 0, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.15, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0, 0, 0);
      kf.rotate(BoneName.KNEE_L, -0.2, 0, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Roundhouse chamber - Hip rotates for 돌려차기
   * @korean 돌려차기준비
   */
  roundhouseChamber(
    timeOffset: number = 0.1,
    easing: string = "ease-out"
  ): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      applyRoundhousePhaseToConfig(kf, KICK_PHASES.ROUNDHOUSE_CHAMBER);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Roundhouse extension - Full hip rotation for 돌려차기
   * @korean 돌려차기
   */
  roundhouseExtend(
    timeOffset: number = 0.15,
    easing: string = "ease-out"
  ): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 1.2, 0, 1.6);
      kf.rotate(BoneName.KNEE_R, -0.1, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.4, 0, 0.3);
      kf.rotate(BoneName.PELVIS, 0, -1.5, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.8, 0);
      kf.position(BoneName.FOOT_R, 0.8, 0, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Side kick chamber - Turn sideways for 옆차기
   * @korean 옆차기준비
   */
  sideKickChamber(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      applySideKickPhaseToConfig(kf, KICK_PHASES.SIDE_CHAMBER);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Side kick extension - Lateral heel thrust for 옆차기
   * @korean 옆차기
   */
  sideKickExtend(timeOffset: number = 0.1, easing: string = "linear"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 1.3, 0, 0.7);
      kf.rotate(BoneName.KNEE_R, -0.1, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0, 0.4, 0);
      kf.rotate(BoneName.PELVIS, 0, -1.57, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -1.2, 0.4);
      kf.position(BoneName.FOOT_R, 0.7, 0, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Axe kick rise - Leg rises high for 내려차기
   * @korean 내려차기올리기
   */
  axeKickRise(timeOffset: number = 0.15, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      applyHighPeakPhaseToConfig(kf, KICK_PHASES.HIGH_PEAK);
      // Additional spine lean for axe kick balance
      kf.rotate(BoneName.SPINE_LOWER, -0.2, 0, 0);
      kf.rotate(BoneName.SPINE_UPPER, -0.15, 0, 0);
      kf.position(BoneName.FOOT_R, 0, 1.5, 0.3);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Axe kick chop - Downward heel strike for 내려차기
   * @korean 내려차기
   */
  axeKickChop(timeOffset: number = 0.1, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 0.8, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.15, 0, 0);
      kf.rotate(BoneName.FOOT_R, -0.3, 0, 0);
      kf.rotate(BoneName.PELVIS, 0.1, 0, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0.1, 0, 0);
      kf.position(BoneName.FOOT_R, 0, 0.5, 0.4);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Back kick spin - 180° turn for 뒤차기
   * @korean 뒤차기회전
   */
  backKickSpin(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.PELVIS, 0, -1.5, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0, -1.3, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -1.0, 0.1);
      kf.rotate(BoneName.HEAD, 0, 0.5, 0);
      kf.rotate(BoneName.HIP_R, 0.3, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.8, 0, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Back kick thrust - Heel drives backward for 뒤차기
   * @korean 뒤차기
   */
  backKickThrust(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.PELVIS, 0, -3.14, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0, -3.0, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -2.8, 0.2);
      kf.rotate(BoneName.HEAD, 0, 1.0, 0);
      kf.rotate(BoneName.HIP_R, 0.5, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.2, 0, 0);
      kf.rotate(BoneName.FOOT_R, -0.4, 0, 0);
      kf.position(BoneName.FOOT_R, 0, 0, -0.8);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Low kick chamber - Small knee lift for low kick (하단차기준비)
   * @korean 하단차기준비
   */
  lowKickChamber(timeOffset: number = 0.08, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 0.5, 0, 0.3);
      kf.rotate(BoneName.KNEE_R, -0.8, 0, 0);
      kf.rotate(BoneName.KNEE_L, -0.2, 0, 0);
      kf.rotate(BoneName.PELVIS, 0, -0.2, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Low kick sweep - Shin sweeps at thigh height (하단차기)
   * @korean 하단차기
   */
  lowKickSweep(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 0.3, 0, 1.5);
      kf.rotate(BoneName.KNEE_R, -0.15, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.3, 0, 0.3);
      kf.rotate(BoneName.PELVIS, 0, -1.2, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.6, 0);
      kf.rotate(BoneName.KNEE_L, -0.4, 0, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Crescent kick chamber - Leg swings inward (반달차기준비)
   * @korean 반달차기준비
   */
  crescentKickChamber(
    timeOffset: number = 0.1,
    easing: string = "ease-out"
  ): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 0.8, 0, -0.8);
      kf.rotate(BoneName.KNEE_R, -0.3, 0, 0);
      kf.rotate(BoneName.PELVIS, 0, 0.3, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -0.2, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Crescent kick arc - Leg sweeps across body (반달차기)
   * @korean 반달차기
   */
  crescentKickArc(
    timeOffset: number = 0.12,
    easing: string = "ease-out"
  ): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 1.2, 0, 1.0);
      kf.rotate(BoneName.KNEE_R, -0.1, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.2, 0, 0);
      kf.rotate(BoneName.PELVIS, 0, -0.5, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.4, 0);
      kf.position(BoneName.FOOT_R, 0.5, 0.8, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Push kick chamber - Ball of foot position (밀어차기준비)
   * @korean 밀어차기준비
   */
  pushKickChamber(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 1.2, 0, 0);
      kf.rotate(BoneName.KNEE_R, -1.8, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.3, 0, 0);
      kf.rotate(BoneName.KNEE_L, -0.3, 0, 0);
      kf.rotate(BoneName.PELVIS, -0.1, 0, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Push kick thrust - Foot pushes opponent back (밀어차기)
   * @korean 밀어차기
   */
  pushKickThrust(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 1.0, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.15, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.5, 0, 0);
      kf.rotate(BoneName.KNEE_L, -0.35, 0, 0);
      kf.rotate(BoneName.PELVIS, 0.1, 0, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0.05, 0, 0);
      kf.position(BoneName.FOOT_R, 0, 0, 0.5);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Spinning heel kick - 360° with heel strike (뒤돌려차기)
   * @korean 뒤돌려차기
   */
  spinningHeelKick(
    timeOffset: number = 0.15,
    easing: string = "ease-out"
  ): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.PELVIS, 0, -4.5, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0, -4.3, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -4.0, 0.15);
      kf.rotate(BoneName.HIP_R, 0.8, 0, 1.2);
      kf.rotate(BoneName.KNEE_R, -0.2, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.3, 0, 0.2);
      kf.position(BoneName.FOOT_R, 0.6, 0.5, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PUNCH TECHNIQUES (주먹 기술)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Punch wind-up - Arm coils back (주먹준비)
   * @korean 주먹준비
   */
  punchWindup(timeOffset: number = 0.08, easing: string = "linear"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      applyPunchPhaseToConfig(kf, PUNCH_PHASES.WINDUP, "right");
      // Form fist during windup
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Punch extension - Arm extends with torso rotation (지르기)
   * @korean 지르기
   */
  punchExtend(timeOffset: number = 0.07, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      applyPunchPhaseToConfig(kf, PUNCH_PHASES.EXTENSION, "right", {
        includeWrist: true,
        includeSpineMiddle: true,
      });
      // Apply fist pose to punching hand
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Cross punch - Left arm punch with full body rotation (크로스)
   * @korean 크로스
   */
  crossPunch(timeOffset: number = 0.15, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_L, -0.7, 0, -0.5);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -0.05);
      kf.rotate(BoneName.WRIST_L, 0, 0, 0.2);
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.45, 0);
      kf.rotate(BoneName.SPINE_MIDDLE, 0, 0.35, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0, 0.25, 0);
      kf.rotate(BoneName.PELVIS, 0, 0.3, 0);
      // Apply fist pose to punching hand
      this.applyHandPose(kf, HAND_POSES.FIST, "left");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Palm strike extension - Open palm heel strike (장권)
   * @korean 장권
   */
  palmStrike(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, -0.7, 0, 0.5);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.05);
      kf.rotate(BoneName.WRIST_R, -0.5, 0, 0.1);
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.4, 0);
      kf.rotate(BoneName.PELVIS, 0, 0.25, 0);
      // Apply open palm pose for palm strike
      this.applyHandPose(kf, HAND_POSES.OPEN_PALM, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Hook punch - Circular punch targeting temple (후크)
   * @korean 후크
   */
  hookPunch(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, -0.1, 0.6, 0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.35);
      kf.rotate(BoneName.WRIST_R, 0, 0.2, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.5, 0);
      kf.rotate(BoneName.SPINE_MIDDLE, 0, 0.4, 0);
      kf.rotate(BoneName.PELVIS, 0, 0.35, 0);
      // Apply fist pose to punching hand
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Hook wind-up - Arm pulls to side (후크준비)
   * @korean 후크준비
   */
  hookWindup(timeOffset: number = 0.08, easing: string = "linear"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, 0.1, -0.6, -0.5);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.57);
      kf.rotate(BoneName.SPINE_UPPER, 0, -0.3, 0);
      kf.rotate(BoneName.PELVIS, 0, -0.2, 0);
      // Form fist during hook windup
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Uppercut punch - Rising punch to chin (어퍼컷)
   * @korean 어퍼컷
   */
  uppercutPunch(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, 0.8, 0, 1.0);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.2);
      kf.rotate(BoneName.KNEE_L, -0.1, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.1, 0, 0);
      kf.rotate(BoneName.PELVIS, -0.2, 0.15, 0);
      kf.position(BoneName.PELVIS, 0, 0.1, 0.1);
      // Apply fist pose to punching hand
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Uppercut crouch - Dip before rising punch (어퍼컷준비)
   * @korean 어퍼컷준비
   */
  uppercutCrouch(timeOffset: number = 0.08, easing: string = "linear"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, 0.3, 0, 0.2);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.5);
      kf.rotate(BoneName.KNEE_L, -0.4, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.4, 0, 0);
      kf.rotate(BoneName.PELVIS, 0.15, -0.1, 0);
      kf.position(BoneName.PELVIS, 0, -0.1, 0);
      // Apply fist pose to punching hand during preparation
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Overhand punch - Looping downward punch (오버핸드)
   * @korean 오버핸드
   */
  overhandPunch(timeOffset: number = 0.12, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, -0.3, 0.4, 0.8);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.8);
      kf.rotate(BoneName.SPINE_UPPER, 0.2, 0.4, 0);
      kf.rotate(BoneName.SPINE_MIDDLE, 0.15, 0.3, 0);
      kf.rotate(BoneName.PELVIS, 0.1, 0.25, 0);
      kf.position(BoneName.PELVIS, 0, -0.05, 0.1);
      // Apply hammer fist pose for overhand impact
      this.applyHandPose(kf, HAND_POSES.HAMMER_FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // ELBOW & KNEE TECHNIQUES (팔꿈치/무릎 기술)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Elbow strike chamber - Arm crosses body (팔꿈치준비)
   * @korean 팔꿈치준비
   */
  elbowChamber(timeOffset: number = 0.05, easing: string = "linear"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, 0, 0.8, -0.3);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.57);
      kf.rotate(BoneName.FOREARM_R, 0, -0.5, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -0.3, 0);
      kf.position(BoneName.HAND_R, -0.2, 0, 0.3);
      // Fist for elbow chamber
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Elbow strike - Elbow drives through target (팔꿈치치기)
   * @korean 팔꿈치치기
   */
  elbowStrike(timeOffset: number = 0.07, easing: string = "linear"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, 0, 0, 0.5);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.3);
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.6, 0.15);
      kf.rotate(BoneName.SPINE_MIDDLE, 0, 0.5, 0.1);
      kf.rotate(BoneName.PELVIS, 0, 0.4, 0);
      kf.position(BoneName.ELBOW_R, 0, 0, 0.7);
      // Clenched fist for elbow strikes
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Elbow uppercut - Upward elbow strike (팔꿈치올려치기)
   * @korean 팔꿈치올려치기
   */
  elbowUppercut(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, 0.8, 0, 1.2);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.4);
      kf.rotate(BoneName.KNEE_L, -0.05, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.05, 0, 0);
      kf.rotate(BoneName.PELVIS, -0.15, 0, 0);
      kf.position(BoneName.PELVIS, 0, 0.08, 0.15);
      kf.position(BoneName.ELBOW_R, 0, 0.7, 0.5);
      // Clenched fist for elbow uppercut
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Knee strike from clinch (무릎차기)
   * @korean 무릎차기
   */
  kneeStrike(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_L, 0.2, 0, -0.8);
      kf.rotate(BoneName.SHOULDER_R, 0.2, 0, 0.8);
      kf.rotate(BoneName.HIP_R, 1.4, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.5, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.4, 0, 0);
      kf.rotate(BoneName.PELVIS, 0.2, 0, 0);
      kf.rotate(BoneName.KNEE_L, -0.1, 0, 0);
      kf.position(BoneName.KNEE_R, 0, 0.4, 0.5);
      // Grab hands for clinch knee strike
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // GRAPPLING TECHNIQUES (잡기 기술)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Throw entry - Step in and grab (던지기진입)
   * @korean 던지기진입
   */
  throwEntry(timeOffset: number = 0.15, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_L, 0.6, 0.5, -0.3);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.0);
      kf.rotate(BoneName.SHOULDER_R, 0.8, -0.3, 0.2);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.2);
      kf.rotate(BoneName.PELVIS, 0, 0.8, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.5, 0);
      kf.rotate(BoneName.KNEE_L, -0.4, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.3, 0, 0);
      kf.position(BoneName.PELVIS, 0, -0.05, 0.2);
      // Apply grab pose to both hands for grappling
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Throw execution - Hip under and throw (던지기)
   * @korean 던지기
   */
  throwExecute(timeOffset: number = 0.15, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_L, -0.4, 0.8, -0.8);
      kf.rotate(BoneName.SHOULDER_R, -0.2, -0.6, 0.6);
      kf.rotate(BoneName.PELVIS, 0.5, 1.8, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0.6, 1.5, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.7, 1.2, -0.2);
      kf.rotate(BoneName.KNEE_L, -0.3, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.2, 0, 0);
      // Apply grab pose - maintaining grip during throw
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Joint lock application (관절기)
   * @korean 관절기
   */
  jointLock(timeOffset: number = 0.15, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_L, -0.1, 1.0, -0.6);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.7);
      kf.rotate(BoneName.WRIST_L, 0, -0.6, -0.4);
      kf.rotate(BoneName.SHOULDER_R, 0.1, -0.8, 0.7);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.4);
      kf.rotate(BoneName.PELVIS, 0.15, 0.6, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.25, 0.4, -0.2);
      kf.rotate(BoneName.KNEE_L, -0.4, 0, 0);
      kf.position(BoneName.PELVIS, 0, -0.1, 0.05);
      // Apply grab pose for control during lock
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Wrist lock grab - Two-hand wrist control (손목잡기)
   * @korean 손목잡기
   */
  wristGrab(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, 0.2, 0.3, 0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.0);
      kf.rotate(BoneName.WRIST_R, 0.3, -0.4, 0.2);
      kf.rotate(BoneName.SHOULDER_L, 0.3, 0.4, -0.3);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.2);
      kf.rotate(BoneName.WRIST_L, -0.2, 0.3, 0);
      kf.rotate(BoneName.PELVIS, 0, 0.2, 0);
      // Apply grab pose to both hands for wrist control
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Wrist lock twist - Apply rotational pressure (손목꺾기)
   * @korean 손목꺾기
   */
  wristTwist(timeOffset: number = 0.15, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, -0.1, 0.5, 0.6);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.3);
      kf.rotate(BoneName.WRIST_R, 0.5, -0.5, 0.4);
      kf.rotate(BoneName.SHOULDER_L, 0.1, 0.6, -0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.4);
      kf.rotate(BoneName.WRIST_L, -0.3, 0.4, -0.2);
      kf.rotate(BoneName.PELVIS, 0, 0.4, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.1, 0.3, 0);
      kf.rotate(BoneName.KNEE_L, -0.4, 0, 0);
      // Apply grab pose for maintaining control during twist
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Arm bar entry - Wrap arm across body (팔꺾기진입)
   * @korean 팔꺾기진입
   */
  armBarEntry(timeOffset: number = 0.15, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, 0.2, 0.6, 0.5);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.4);
      kf.rotate(BoneName.SHOULDER_L, 0.3, 0.5, -0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.3);
      kf.rotate(BoneName.PELVIS, 0.2, 0.5, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.1, 0.4, 0);
      // Grab pose to control opponent's arm
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Arm bar drop - Go to ground for submission (팔꺾기)
   * @korean 팔꺾기
   */
  armBarDrop(timeOffset: number = 0.2, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, -0.3, 0.9, 0.8);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.6);
      kf.rotate(BoneName.SHOULDER_L, 0, 0.8, -0.6);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.6);
      kf.rotate(BoneName.PELVIS, 1.0, 0.2, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.7, 0.15, 0);
      kf.rotate(BoneName.HIP_R, 1.4, 0, 0.4);
      kf.rotate(BoneName.KNEE_R, -0.3, 0, 0);
      kf.rotate(BoneName.HIP_L, 1.2, 0, -0.3);
      kf.rotate(BoneName.KNEE_L, -0.2, 0, 0);
      kf.position(BoneName.PELVIS, 0, -0.4, -0.1);
      // Grab pose to maintain arm control during drop
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Slam lift - Hoist opponent up (슬램올리기)
   * @korean 슬램올리기
   */
  slamLift(timeOffset: number = 0.2, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_L, 0.9, 0.2, -0.3);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -0.8);
      kf.rotate(BoneName.SHOULDER_R, 0.9, -0.2, 0.3);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.8);
      kf.rotate(BoneName.KNEE_L, -0.1, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.1, 0, 0);
      kf.rotate(BoneName.PELVIS, -0.3, 0, 0);
      kf.rotate(BoneName.SPINE_UPPER, -0.2, 0, 0);
      kf.position(BoneName.PELVIS, 0, 0.1, 0);
      // Grab pose for lifting opponent
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Slam down - Drive opponent to ground (슬램)
   * @korean 슬램
   */
  slamDown(timeOffset: number = 0.15, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_L, 0.3, 0.3, -0.6);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.4);
      kf.rotate(BoneName.SHOULDER_R, 0.3, -0.3, 0.6);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.4);
      kf.rotate(BoneName.KNEE_L, -0.6, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.6, 0, 0);
      kf.rotate(BoneName.PELVIS, 0.4, 0, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.3, 0, 0);
      kf.rotate(BoneName.SPINE_MIDDLE, 0.2, 0, 0);
      kf.position(BoneName.PELVIS, 0, -0.15, 0.2);
      // Grab pose maintained during slam
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Clinch grab - Arms wrap around opponent (클린치잡기)
   * @korean 클린치잡기
   */
  clinchGrab(timeOffset: number = 0.12, easing: string = "ease-out"): this {
    const clinch = MARTIAL_POSES.CLINCH;
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_L, ...clinch.leftShoulder);
      kf.rotate(BoneName.ELBOW_L, ...clinch.leftElbow);
      kf.rotate(BoneName.SHOULDER_R, ...clinch.rightShoulder);
      kf.rotate(BoneName.ELBOW_R, ...clinch.rightElbow);
      kf.rotate(BoneName.KNEE_L, -0.4, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.4, 0, 0);
      kf.rotate(BoneName.PELVIS, 0.2, 0, 0);
      // Apply grab pose for clinch control
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Counter parry - Quick deflection (반격막기)
   * @korean 반격막기
   */
  counterParry(timeOffset: number = 0.08, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_L, 0.2, 0.5, -0.6);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -0.9);
      kf.rotate(BoneName.WRIST_L, 0, 0.3, 0);
      kf.rotate(BoneName.SHOULDER_R, 0.1, 0, -0.2);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.5);
      kf.rotate(BoneName.PELVIS, 0, -0.2, 0);
      // Apply open palm for parrying
      this.applyHandPose(kf, HAND_POSES.OPEN_PALM, "left");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Counter strike - Fast return strike (반격치기)
   * @korean 반격치기
   */
  counterStrike(timeOffset: number = 0.08, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, -0.6, 0, 0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.1);
      kf.rotate(BoneName.WRIST_R, 0, 0, -0.2);
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.35, 0);
      kf.rotate(BoneName.SPINE_MIDDLE, 0, 0.25, 0);
      kf.rotate(BoneName.PELVIS, 0, 0.2, 0);
      // Apply fist for counter punch
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Sweep - Low sweeping leg (걸기)
   * @korean 걸기
   */
  sweep(timeOffset: number = 0.15, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.KNEE_L, -1.2, 0, 0);
      kf.rotate(BoneName.HIP_R, 0.5, 0, 1.5);
      kf.rotate(BoneName.KNEE_R, -0.15, 0, 0);
      kf.rotate(BoneName.PELVIS, 0.3, -0.8, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.5, -0.4, 0);
      kf.position(BoneName.FOOT_R, 0.8, -0.1, 0);
      kf.position(BoneName.PELVIS, 0.1, -0.3, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Counter parry - Deflect incoming attack (막기)
   * @korean 막기
   */
  parry(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_L, 0.2, 0.5, -0.8);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -0.8);
      kf.rotate(BoneName.WRIST_L, 0, 0.4, 0);
      kf.rotate(BoneName.PELVIS, 0, -0.3, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -0.2, 0);
      kf.rotate(BoneName.KNEE_L, -0.3, 0, 0);
      // Open palm for parry deflection
      this.applyHandPose(kf, HAND_POSES.OPEN_PALM, "left");
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * High block defensive pose (상단막기)
   * @korean 상단막기
   */
  blockHigh(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_L, -1.0, 0.3, -0.6);
      kf.rotate(BoneName.SHOULDER_R, -1.0, -0.3, 0.6);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.3);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.3);
      kf.rotate(BoneName.KNEE_L, -0.2, 0, 0);
      // Fists for solid blocking surface
      this.applyHandPose(kf, HAND_POSES.FIST, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Low block defensive pose (하단막기)
   * @korean 하단막기
   */
  blockLow(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_L, 0.3, 0.2, -0.4);
      kf.rotate(BoneName.SHOULDER_R, 0.3, -0.2, 0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -0.6);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.6);
      kf.rotate(BoneName.KNEE_L, -0.35, 0, 0);
      kf.rotate(BoneName.PELVIS, 0.1, 0, 0);
      // Fists for blocking
      this.applyHandPose(kf, HAND_POSES.FIST, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MOVEMENT TECHNIQUES (이동 기술)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Step forward or backward (스텝)
   * @korean 스텝
   */
  step(timeOffset: number = 0.12, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 0.3, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.4, 0, 0);
      kf.rotate(BoneName.KNEE_L, -0.2, 0, 0);
      kf.position(BoneName.PELVIS, 0, 0, 0.1);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Lateral shift movement (측면이동)
   * @korean 측면이동
   */
  shift(timeOffset: number = 0.12, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.KNEE_L, -0.25, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.25, 0, 0);
      kf.rotate(BoneName.PELVIS, 0, 0.2, 0);
      kf.position(BoneName.PELVIS, 0.15, 0, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Rotation/pivot movement (회전)
   * @korean 회전
   */
  rotate(timeOffset: number = 0.12, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.PELVIS, 0, 0.78, 0); // ~45 degrees
      kf.rotate(BoneName.SPINE_LOWER, 0, 0.5, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.3, 0);
      kf.rotate(BoneName.KNEE_L, -0.2, 0, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Full 360° spin (회전)
   * @korean 전체회전
   */
  spin(timeOffset: number = 0.2, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.PELVIS, 0, 3.14, 0); // 180 degrees
      kf.rotate(BoneName.SPINE_LOWER, 0, 2.8, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, 2.5, 0);
      kf.rotate(BoneName.HEAD, 0, 0.5, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Spinning kick finish (회전차기)
   * @korean 회전차기
   */
  spinKick(timeOffset: number = 0.12, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 0.8, 0, 1.2);
      kf.rotate(BoneName.KNEE_R, -0.2, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.3, 0, 0.2);
      kf.position(BoneName.FOOT_R, 0.5, 0.3, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Jump/hop movement (점프)
   * @korean 점프
   */
  jump(timeOffset: number = 0.15, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.KNEE_L, -0.4, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.4, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0.3, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.3, 0, 0);
      kf.position(BoneName.PELVIS, 0, 0.15, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Duck/crouch movement (숙이기)
   * @korean 숙이기
   */
  duck(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.KNEE_L, -0.6, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.6, 0, 0);
      kf.rotate(BoneName.PELVIS, 0.15, 0, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.2, 0, 0);
      kf.position(BoneName.PELVIS, 0, -0.15, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Lean back movement (뒤로젖히기)
   * @korean 뒤로젖히기
   */
  lean(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SPINE_LOWER, -0.2, 0, 0);
      kf.rotate(BoneName.SPINE_UPPER, -0.25, 0, 0);
      kf.rotate(BoneName.KNEE_L, -0.15, 0, 0);
      kf.rotate(BoneName.PELVIS, -0.1, 0, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Bob head movement (헤드밥)
   * @korean 헤드밥
   */
  bob(timeOffset: number = 0.08, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.KNEE_L, -0.35, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.35, 0, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.15, 0.2, 0);
      kf.rotate(BoneName.HEAD, 0.1, 0.1, 0);
      kf.position(BoneName.PELVIS, 0.05, -0.08, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Weave movement (위브)
   * @korean 위브
   */
  weave(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.KNEE_L, -0.25, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.4, 0, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.1, -0.25, 0);
      kf.rotate(BoneName.HEAD, 0.05, -0.15, 0);
      kf.position(BoneName.PELVIS, -0.05, -0.05, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Roundhouse kick extension (돌려차기)
   * @korean 돌려차기
   */
  roundhouse(timeOffset: number = 0.12, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 1.2, 0, 1.6);
      kf.rotate(BoneName.KNEE_R, -0.1, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.4, 0, 0.3);
      kf.rotate(BoneName.PELVIS, 0, -1.5, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.8, 0);
      kf.position(BoneName.FOOT_R, 0.8, 0, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Axe kick downward motion (내려차기)
   * @korean 내려차기
   */
  axeKick(timeOffset: number = 0.1, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 0.8, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.15, 0, 0);
      kf.rotate(BoneName.FOOT_R, -0.3, 0, 0);
      kf.rotate(BoneName.PELVIS, 0.1, 0, 0);
      kf.position(BoneName.FOOT_R, 0, 0.5, 0.4);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Throw lift (던지기리프트)
   * @korean 던지기리프트
   */
  throwLift(timeOffset: number = 0.15, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_L, 0.7, 0.6, -0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -0.9);
      kf.rotate(BoneName.SHOULDER_R, 0.7, -0.6, 0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.9);
      kf.rotate(BoneName.PELVIS, 0.8, 1.2, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.5, 0.8, 0);
      kf.rotate(BoneName.KNEE_L, -0.2, 0, 0);
      kf.position(BoneName.PELVIS, 0, 0.05, 0.15);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Shoulder strike (어깨치기)
   * @korean 어깨치기
   */
  shoulderStrike(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.SHOULDER_R, 0.3, 0.8, 0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.4);
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.6, 0.2);
      kf.rotate(BoneName.PELVIS, 0, 0.5, 0);
      kf.position(BoneName.SHOULDER_R, 0, 0, 0.15);
      // Clenched fist for power transfer
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // GUARD POSITIONS (방어 자세)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Apply fighting guard - Hands protect face (경계자세)
   * @korean 경계자세
   */
  withGuard(): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (lastKf) {
      applyMartialPoseToKeyframe(lastKf, MARTIAL_POSES.GUARD);
      // Fists up for guard
      this.applyHandPoseToKeyframe(lastKf, HAND_POSES.FIST, "both");
    }
    return this;
  }

  /**
   * Apply high guard - Hands at temple (상단방어)
   * @korean 상단방어
   */
  withHighGuard(): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (lastKf) {
      applyMartialPoseToKeyframe(lastKf, MARTIAL_POSES.HIGH_GUARD);
    }
    return this;
  }

  /**
   * Apply clinch position (클린치)
   * @korean 클린치
   */
  withClinch(): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (lastKf) {
      applyMartialPoseToKeyframe(lastKf, MARTIAL_POSES.CLINCH);
    }
    return this;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // HAND POSES (손 모양)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Helper to apply finger rotations from a hand pose to a keyframe
   * @internal
   */
  private applyHandPose(
    kf: KeyframeConfig,
    pose: (typeof HAND_POSES)[keyof typeof HAND_POSES],
    hand: "left" | "right" | "both"
  ): void {
    applyHandPoseToConfig(kf, pose, hand);
  }

  /**
   * Apply fist pose to hands - Closed fist for punches (주먹)
   * @param hand Which hand(s) to apply the pose to
   * @korean 주먹쥐기
   */
  withFist(hand: "left" | "right" | "both" = "both"): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (lastKf) {
      this.applyHandPoseToKeyframe(lastKf, HAND_POSES.FIST, hand);
    }
    return this;
  }

  /**
   * Apply open palm pose - Palm strikes and blocks (장권)
   * @param hand Which hand(s) to apply the pose to
   * @korean 손바닥펴기
   */
  withOpenPalm(hand: "left" | "right" | "both" = "both"): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (lastKf) {
      this.applyHandPoseToKeyframe(lastKf, HAND_POSES.OPEN_PALM, hand);
    }
    return this;
  }

  /**
   * Apply spear hand pose - Finger strikes to throat/eyes (관수)
   * @param hand Which hand(s) to apply the pose to
   * @korean 관수펴기
   */
  withSpearHand(hand: "left" | "right" | "both" = "both"): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (lastKf) {
      this.applyHandPoseToKeyframe(lastKf, HAND_POSES.SPEAR_HAND, hand);
    }
    return this;
  }

  /**
   * Apply knife hand pose - Ridge hand strikes (수도)
   * @param hand Which hand(s) to apply the pose to
   * @korean 수도펴기
   */
  withKnifeHand(hand: "left" | "right" | "both" = "both"): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (lastKf) {
      this.applyHandPoseToKeyframe(lastKf, HAND_POSES.KNIFE_HAND, hand);
    }
    return this;
  }

  /**
   * Apply hammer fist pose - Bottom fist strikes (철퇴)
   * @param hand Which hand(s) to apply the pose to
   * @korean 철퇴주먹
   */
  withHammerFist(hand: "left" | "right" | "both" = "both"): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (lastKf) {
      this.applyHandPoseToKeyframe(lastKf, HAND_POSES.HAMMER_FIST, hand);
    }
    return this;
  }

  /**
   * Apply backfist pose - Knuckle strikes (등주먹)
   * @param hand Which hand(s) to apply the pose to
   * @korean 등주먹
   */
  withBackfist(hand: "left" | "right" | "both" = "both"): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (lastKf) {
      this.applyHandPoseToKeyframe(lastKf, HAND_POSES.BACKFIST, hand);
    }
    return this;
  }

  /**
   * Apply grab pose - Grappling and holds (잡기)
   * @param hand Which hand(s) to apply the pose to
   * @korean 잡기손
   */
  withGrab(hand: "left" | "right" | "both" = "both"): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (lastKf) {
      this.applyHandPoseToKeyframe(lastKf, HAND_POSES.GRAB, hand);
    }
    return this;
  }

  /**
   * Apply two finger pose - Eye strikes (이지권)
   * @param hand Which hand(s) to apply the pose to
   * @korean 이지권
   */
  withTwoFinger(hand: "left" | "right" | "both" = "both"): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (lastKf) {
      this.applyHandPoseToKeyframe(lastKf, HAND_POSES.TWO_FINGER, hand);
    }
    return this;
  }

  /**
   * Apply relaxed pose - Natural/idle hands (자연)
   * @param hand Which hand(s) to apply the pose to
   * @korean 자연손
   */
  withRelaxedHands(hand: "left" | "right" | "both" = "both"): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (lastKf) {
      this.applyHandPoseToKeyframe(lastKf, HAND_POSES.RELAXED, hand);
    }
    return this;
  }

  /**
   * Helper to apply finger rotations from a hand pose to an existing keyframe
   * @internal
   */
  private applyHandPoseToKeyframe(
    kf: AnimationKeyframe,
    pose: (typeof HAND_POSES)[keyof typeof HAND_POSES],
    hand: "left" | "right" | "both"
  ): void {
    applyHandPoseToKeyframe(kf, pose, hand);
  }

  /**
   * Apply hand pose during a keyframe (inline version for addKeyframe)
   * @param pose The hand pose to apply
   * @param hand Which hand(s) to apply the pose to
   * @korean 손모양적용
   */
  applyHandPoseDuring(
    kf: KeyframeConfig,
    pose: keyof typeof HAND_POSES,
    hand: "left" | "right" | "both" = "both"
  ): void {
    this.applyHandPose(kf, HAND_POSES[pose], hand);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // RECOVERY & COMMON (복귀 & 공통)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Recover to fighting guard (복귀)
   * @korean 복귀
   */
  recover(timeOffset: number = 0.1, easing: string = "ease-in"): this {
    const guard = MARTIAL_POSES.GUARD;
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Reset legs
      kf.rotate(BoneName.HIP_R, 0, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.2, 0, 0);
      kf.rotate(BoneName.KNEE_L, -0.2, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0, 0, 0);
      // Reset spine
      kf.rotate(BoneName.PELVIS, 0, 0, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0, 0, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, 0, 0);
      // Apply guard
      kf.rotate(BoneName.SHOULDER_L, ...guard.leftShoulder);
      kf.rotate(BoneName.ELBOW_L, ...guard.leftElbow);
      kf.rotate(BoneName.SHOULDER_R, ...guard.rightShoulder);
      kf.rotate(BoneName.ELBOW_R, ...guard.rightElbow);
      // Reset positions
      kf.position(BoneName.PELVIS, 0, 0, 0);
      kf.position(BoneName.FOOT_R, 0, 0, 0);
      // Fists up for guard
      this.applyHandPose(kf, HAND_POSES.FIST, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Full 360° spin recovery (회전복귀)
   * @korean 회전복귀
   */
  spinRecover(timeOffset: number = 0.2, easing: string = "ease-in"): this {
    const guard = MARTIAL_POSES.GUARD;
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Complete rotation to forward-facing
      kf.rotate(BoneName.PELVIS, 0, -6.28, 0); // Full 360°
      kf.rotate(BoneName.SPINE_LOWER, 0, -6.28, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -6.28, 0);
      kf.rotate(BoneName.HEAD, 0, 0, 0);
      // Reset legs
      kf.rotate(BoneName.HIP_R, 0, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.2, 0, 0);
      kf.rotate(BoneName.KNEE_L, -0.25, 0, 0);
      // Guard
      kf.rotate(BoneName.SHOULDER_L, ...guard.leftShoulder);
      kf.rotate(BoneName.ELBOW_L, ...guard.leftElbow);
      kf.rotate(BoneName.SHOULDER_R, ...guard.rightShoulder);
      kf.rotate(BoneName.ELBOW_R, ...guard.rightElbow);
      kf.position(BoneName.PELVIS, 0, -0.05, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // LOW-LEVEL API (저수준 API)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Add custom keyframe with callback
   */
  private addKeyframe(
    time: number,
    easing: string,
    configure: (kf: KeyframeConfig) => void
  ): void {
    const kf = new KeyframeConfig();
    configure(kf);
    this.keyframes.push({
      time,
      easing: easing as "linear" | "ease-in" | "ease-out" | "ease-in-out",
      boneRotations: kf.rotations,
      bonePositions: kf.positions,
    });
  }

  /**
   * Add raw keyframe at specific time
   */
  at(time: number, easing: string = "linear"): KeyframeConfig {
    const kf = new KeyframeConfig();
    kf.setBuilder(this, time, easing);
    return kf;
  }

  /**
   * Internal: Add keyframe from KeyframeConfig
   */
  _addKeyframe(kf: AnimationKeyframe): void {
    this.keyframes.push(kf);
  }

  /**
   * Build the complete animation
   */
  build(): SkeletalAnimation {
    return {
      name: this.name,
      koreanName: this.koreanName,
      duration: this.duration,
      loop: this.loop,
      type: this.type,
      keyframes: this.keyframes,
    };
  }
}
