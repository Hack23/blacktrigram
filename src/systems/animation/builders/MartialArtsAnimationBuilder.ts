/**
 * Martial Arts Animation Builder
 *
 * Korean martial arts specific animation builder with semantic methods
 * that make animations readable by martial arts practitioners.
 *
 * 한국 무술 애니메이션 빌더 - 무술 전문가가 이해할 수 있는 시맨틱 메서드 제공
 *
 * @module systems/animation
 * @category Animation System
 * @korean 무술애니메이션빌더
 */

import type { AnimationKeyframe, SkeletalAnimation } from "@/types/skeletal";
import { BoneName } from "@/types/skeletal";
import * as THREE from "three";

// Import constants from dedicated constants module
import {
  AnimationType,
  HAND_POSES,
  KICK_PHASES,
  MARTIAL_POSES,
  PUNCH_PHASES,
  calculateStanceWidth,
} from "./MartialArtsConstants";

// Import keyframe configuration helper
import { KeyframeConfig } from "./KeyframeConfig";

// Import guard position types
import type { GuardPositionType } from "./KoreanGuardPositions";

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

// Import trigram guard applicator for full-body stance poses
import { TrigramStance } from "@/types/common";
import {
  applyTrigramGuardToConfig,
  getGuardArmBase,
  type TrigramGuardOptions,
} from "./TrigramGuardApplicator";

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
    chamber: 0.1, // 100ms wind-up (준비)
    extend: 0.15, // 150ms strike (실행)
    peak: 0.05, // 50ms hold at extension (정점)
    retract: 0.1, // 100ms pull back (회수)
    recover: 0.15, // 150ms return to stance (복귀)
    total: 0.55, // 550ms total
  },
  /**
   * Fast-Medium techniques (빠른-중간 기술)
   * Examples: Low kicks, lead hooks, quick counters
   * Total: 600ms
   */
  FAST_MEDIUM: {
    chamber: 0.1, // 100ms wind-up (준비)
    extend: 0.15, // 150ms strike (실행)
    peak: 0.05, // 50ms hold at extension (정점)
    retract: 0.1, // 100ms pull back (회수)
    recover: 0.2, // 200ms return to stance (복귀)
    total: 0.6, // 600ms total
  },
  /**
   * Medium-Light techniques (중간-가벼운 기술)
   * Examples: Lead uppercuts, backfists, push kicks
   * Total: 700ms
   */
  MEDIUM_LIGHT: {
    chamber: 0.12, // 120ms wind-up (준비)
    extend: 0.18, // 180ms strike (실행)
    peak: 0.08, // 80ms hold at extension (정점)
    retract: 0.1, // 100ms pull back (회수)
    recover: 0.22, // 220ms return to stance (복귀)
    total: 0.7, // 700ms total
  },
  /**
   * Medium techniques (중간 기술)
   * Examples: Crosses, roundhouse kicks, hooks
   * Total: 730ms
   */
  MEDIUM: {
    chamber: 0.15, // 150ms wind-up (준비)
    extend: 0.2, // 200ms strike (실행)
    peak: 0.08, // 80ms hold at extension (정점)
    retract: 0.12, // 120ms pull back (회수)
    recover: 0.18, // 180ms return to stance (복귀)
    total: 0.73, // 730ms total
  },
  /**
   * Medium-Heavy techniques (중간-무거운 기술)
   * Examples: Body shots, side kicks, crescent kicks
   * Total: 750ms
   */
  MEDIUM_HEAVY: {
    chamber: 0.12, // 120ms wind-up (준비)
    extend: 0.2, // 200ms strike (실행)
    peak: 0.08, // 80ms hold at extension (정점)
    retract: 0.15, // 150ms pull back (회수)
    recover: 0.2, // 200ms return to stance (복귀)
    total: 0.75, // 750ms total
  },
  /**
   * Heavy-Light techniques (무거운-가벼운 기술)
   * Examples: Hooks, uppercuts, sweep kicks
   * Total: 800ms
   */
  HEAVY_LIGHT: {
    chamber: 0.15, // 150ms wind-up (준비)
    extend: 0.2, // 200ms strike (실행)
    peak: 0.1, // 100ms hold at extension (정점)
    retract: 0.15, // 150ms pull back (회수)
    recover: 0.2, // 200ms return to stance (복귀)
    total: 0.8, // 800ms total
  },
  /**
   * Heavy-Medium techniques (무거운-중간 기술)
   * Examples: Question mark kicks, crescent kicks
   * Total: 850ms
   */
  HEAVY_MEDIUM: {
    chamber: 0.12, // 120ms wind-up (준비)
    extend: 0.22, // 220ms strike (실행)
    peak: 0.08, // 80ms hold at extension (정점)
    retract: 0.15, // 150ms pull back (회수)
    recover: 0.28, // 280ms return to stance (복귀)
    total: 0.85, // 850ms total
  },
  /**
   * Heavy techniques (무거운 기술)
   * Examples: Spinning kicks, power punches, jumping techniques
   * Total: 1000ms
   */
  HEAVY: {
    chamber: 0.2, // 200ms wind-up (준비)
    extend: 0.3, // 300ms strike (실행)
    peak: 0.12, // 120ms hold at extension (정점)
    retract: 0.15, // 150ms pull back (회수)
    recover: 0.23, // 230ms return to stance (복귀)
    total: 1.0, // 1000ms total
  },
  /**
   * Combo techniques (연속 기술)
   * Examples: Jab-cross, double hooks, double kicks
   * Total: 700ms
   */
  COMBO_FAST: {
    chamber: 0.08, // 80ms wind-up (준비)
    extend: 0.12, // 120ms strike (실행)
    peak: 0.08, // 80ms hold at extension (정점)
    retract: 0.1, // 100ms pull back (회수)
    recover: 0.32, // 320ms return to stance (복귀)
    total: 0.7, // 700ms total (sum of all phases)
  },
  /**
   * Jumping techniques (뛰어차기 기술)
   * Examples: Jumping kicks, jumping punches
   * Total: 900ms
   */
  JUMPING: {
    chamber: 0.18, // 180ms wind-up (준비)
    extend: 0.22, // 220ms strike (실행)
    peak: 0.08, // 80ms hold at extension (정점)
    retract: 0.12, // 120ms pull back (회수)
    recover: 0.3, // 300ms return to stance (복귀)
    total: 0.9, // 900ms total
  },
  /**
   * Combo heavy techniques (연속 무거운 기술)
   * Examples: Double kicks with different heights
   * Total: 950ms
   */
  COMBO_HEAVY: {
    chamber: 0.12, // 120ms wind-up (준비)
    extend: 0.22, // 220ms strike (실행)
    peak: 0.08, // 80ms hold at extension (정점)
    retract: 0.15, // 150ms pull back (회수)
    recover: 0.38, // 380ms return to stance (복귀)
    total: 0.95, // 950ms total (sum of all phases)
  },
  /**
   * Spinning techniques (회전 기술)
   * Examples: Spinning backfist, tornado kick, spinning heel kick, spinning back kick
   * Total: 1200ms
   */
  SPINNING: {
    chamber: 0.3, // 300ms wind-up with rotation start (준비+회전)
    extend: 0.35, // 350ms strike through rotation (실행)
    peak: 0.12, // 120ms hold at extension (정점)
    retract: 0.15, // 150ms pull back (회수)
    recover: 0.28, // 280ms complete rotation recovery (복귀)
    total: 1.2, // 1200ms total
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
  private type: "attack" | "defense" | "movement" | "idle" | "stance" | "walk" =
    "attack";
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

  /**
   * Configure as stance transition animation (자세 전환 애니메이션)
   */
  asStance(duration: number, shouldLoop: boolean = false): this {
    this.type = "stance";
    this.duration = duration;
    this.loop = shouldLoop;
    return this;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STANCE METHODS (자세 메서드)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Add initial fighting stance keyframe (기본 자세)
   *
   * Adds a neutral fighting stance at time 0 as the starting position
   * for attack animations. This is the ready position before techniques.
   *
   * @korean 기본자세추가
   */
  stance(): this {
    const guard = MARTIAL_POSES.GUARD;
    this.addKeyframe(0, "linear", (kf) => {
      // Legs in neutral stance
      kf.rotate(BoneName.HIP_R, 0, 0, 0);
      kf.rotate(BoneName.HIP_L, 0, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.2, 0, 0);
      kf.rotate(BoneName.KNEE_L, -0.2, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0, 0, 0);

      // Spine neutral
      kf.rotate(BoneName.PELVIS, 0, 0, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0, 0, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, 0, 0);
      kf.rotate(BoneName.HEAD, 0, 0, 0);

      // Arms in guard position
      kf.rotate(BoneName.SHOULDER_L, ...guard.leftShoulder);
      kf.rotate(BoneName.ELBOW_L, ...guard.leftElbow);
      kf.rotate(BoneName.SHOULDER_R, ...guard.rightShoulder);
      kf.rotate(BoneName.ELBOW_R, ...guard.rightElbow);

      // Neutral positions
      kf.position(BoneName.PELVIS, 0, 0, 0);
      kf.position(BoneName.FOOT_R, 0, 0, 0);
      kf.position(BoneName.FOOT_L, 0, 0, 0);

      // Fists in guard
      this.applyHandPose(kf, HAND_POSES.FIST, "both");
    });
    // Don't advance currentTime - stance is at time 0
    return this;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // KICK TECHNIQUES (발차기 기술)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Chamber - Knee lifts to waist height (준비자세)
   * Starting position for all kicks
   *
   * Authentic Korean martial arts chamber mechanics:
   * - Hip flexed to 90° (1.57 rad) bringing knee to torso height
   * - Knee bent tight (120° angle = -2.0 rad) for power generation
   * - Support leg slightly bent for stability
   * - Pelvis tilts back slightly for balance
   * - Toe neutral, ready for extension
   *
   * @korean 준비자세
   */
  chamber(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Apply core kick chamber phase
      applyKickPhaseToConfig(kf, KICK_PHASES.CHAMBER, {
        includeAnkle: true,
        includePelvis: true,
      });

      // Additional stability and balance
      kf.rotate(BoneName.SPINE_LOWER, -0.05, 0, 0); // Slight back lean
      kf.rotate(BoneName.SPINE_UPPER, -0.03, 0, 0); // Upper body stable

      // Arms in guard position
      kf.rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.6);
      kf.rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.6);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Extend - Leg snaps forward (차기 - 확장)
   *
   * Authentic Korean martial arts extension mechanics:
   * - Hip maintains elevation (1.7 rad ~97°) for target height
   * - Knee extends fully (0.1 rad ~6°) for maximum reach
   * - Ankle dorsiflexes (0.5 rad ~29°) pointing toe/ball of foot
   * - Pelvis tilts forward (0.15 rad ~9°) for hip thrust
   * - Support leg bends deeper (-0.35 rad) for power transfer
   * - Spine remains upright for balance
   *
   * This is the impact frame where the strike connects.
   *
   * @korean 차기확장
   */
  extend(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Apply core kick extension phase
      applyKickPhaseToConfig(kf, KICK_PHASES.EXTENSION, {
        includeAnkle: true,
        includePelvis: true,
      });

      // Hip thrust forward (key to Korean kick power)
      kf.rotate(BoneName.SPINE_LOWER, 0.05, 0, 0); // Slight forward lean
      kf.rotate(BoneName.SPINE_UPPER, 0.03, 0, 0); // Follow through

      // Position foot forward for impact
      kf.position(BoneName.FOOT_R, 0.6, 0, 0); // Forward position

      // Arms maintain guard
      kf.rotate(BoneName.SHOULDER_L, -0.9, 0.3, 0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.6);
      kf.rotate(BoneName.SHOULDER_R, -0.9, -0.3, -0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.6);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Retract - Return to chamber (회수)
   *
   * Authentic Korean martial arts retraction mechanics:
   * - Leg returns THROUGH chamber position (proper 낙법)
   * - Knee bends back to tight position (-2.0 rad)
   * - Hip maintains height initially, then lowers
   * - Foot resets to neutral from pointed position
   * - Pelvis returns to neutral
   * - Support leg maintains stability
   *
   * This is critical for proper technique - the leg must return
   * through chamber to protect against counters and maintain balance.
   *
   * @korean 회수자세
   */
  retract(timeOffset: number = 0.15, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Return to chamber position (hip still high)
      applyKickPhaseToConfig(kf, KICK_PHASES.CHAMBER, {
        includeAnkle: true,
        includePelvis: true,
        resetFoot: false, // Foot returns to neutral, not reset
      });

      // Spine returns to neutral
      kf.rotate(BoneName.SPINE_LOWER, -0.05, 0, 0);
      kf.rotate(BoneName.SPINE_UPPER, -0.03, 0, 0);

      // Foot back to neutral
      kf.rotate(BoneName.FOOT_R, 0, 0, 0);

      // Position foot back closer to body
      kf.position(BoneName.FOOT_R, 0, 0, 0);

      // Arms still in guard
      kf.rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.3);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.6);
      kf.rotate(BoneName.SHOULDER_R, -0.6, -0.4, -0.3);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.6);
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
   *
   * Authentic Taekwondo roundhouse chamber (돌려차기 준비):
   * - Hip flexed and rotated out (~1.2 rad flex, ~0.8 rad external rotation)
   * - Knee bent tight (-1.5 rad) preparing for snap
   * - Pelvis begins rotation (-0.5 rad on Y-axis)
   * - Spine counter-rotates for power (0.3 rad on Y-axis)
   * - Support leg stable
   * - Arms in high guard
   *
   * The hip rotation is KEY - it opens the hip for the circular strike path
   * that defines a roundhouse kick vs. a front kick.
   *
   * @korean 돌려차기준비
   */
  roundhouseChamber(
    timeOffset: number = 0.1,
    easing: string = "ease-out",
  ): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Apply rotational phase
      applyRoundhousePhaseToConfig(kf, KICK_PHASES.ROUNDHOUSE_CHAMBER);

      // Support leg begins pivot (축발 회전 시작)
      // Even during chamber, the support foot starts rotating
      kf.rotate(BoneName.HIP_L, 0, -0.2, 0); // Standing hip starts rotation
      kf.rotate(BoneName.KNEE_L, -0.3, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0, 0.79, 0); // 45° pivot start (half of full)

      // Pelvis begins rotation for power loading (힙 회전)
      kf.rotate(BoneName.PELVIS, 0, -0.79, 0); // 45° hip rotation

      // Spine lower follows pelvis rotation
      kf.rotate(BoneName.SPINE_LOWER, 0, -0.4, 0);

      // High guard for head protection - elbows tucked
      kf.rotate(BoneName.SHOULDER_L, -0.9, 0.3, 0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -2.0); // Tighter tuck
      kf.rotate(BoneName.SHOULDER_R, -0.9, -0.3, -0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 2.0); // Tighter tuck
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Roundhouse extension - Full hip rotation for 돌려차기
   *
   * Authentic Taekwondo roundhouse extension (돌려차기 실행):
   * - Hip fully extended with maximal rotation (1.2 rad flex, 1.6 rad rotation)
   * - Knee snaps out to nearly straight (-0.1 rad)
   * - Foot pointed and rotated (0.4 rad dorsiflexion, 0.3 rad rotation)
   * - Pelvis fully rotated (-1.5 rad) providing hip whip power
   * - Spine counter-rotates (0.8 rad) for torque generation
   * - Foot position extends laterally (0.8m forward)
   * - Support leg pivots on ball of foot
   *
   * Enhanced with compensatory torso lean (중심축회전):
   * - Torso leans AWAY from kicking leg for balance
   * - Increases reach and prevents backward fall
   * - 12° lateral lean on Z-axis for high kicks
   *
   * The "snap" comes from the sudden knee extension combined with
   * the hip rotation - this is the signature of Taekwondo roundhouse.
   *
   * @korean 돌려차기
   */
  roundhouseExtend(
    timeOffset: number = 0.15,
    easing: string = "ease-out",
  ): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Full extension with rotation
      kf.rotate(BoneName.HIP_R, 1.2, 0, 1.6);
      kf.rotate(BoneName.KNEE_R, -0.1, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.4, 0, 0.3);
      kf.rotate(BoneName.PELVIS, 0, -1.5, 0);

      // Apply compensatory torso lean for balance (12° away from kick)
      // This must be called BEFORE setting Y-axis spine rotations
      this.applyKickTorsoLean(kf, "right", 12);

      // Spine counter-rotation for torque generation (applied after Z-axis lean)
      // Preserve existing Z-axis lean from applyKickTorsoLean
      const upperSpineRot = kf.rotations.get(BoneName.SPINE_UPPER);
      const lowerSpineRot = kf.rotations.get(BoneName.SPINE_LOWER);
      kf.rotate(
        BoneName.SPINE_UPPER,
        upperSpineRot?.x ?? 0,
        0.8,
        upperSpineRot?.z ?? 0,
      );
      kf.rotate(
        BoneName.SPINE_LOWER,
        lowerSpineRot?.x ?? 0,
        -1.0,
        lowerSpineRot?.z ?? 0,
      );

      // Support leg pivots - CRITICAL for Taekwondo roundhouse (축발 회전)
      // Ball of foot rotates 90-180° to allow full hip opening
      kf.rotate(BoneName.HIP_L, 0, -0.4, 0); // Standing hip rotates with pivot
      kf.rotate(BoneName.KNEE_L, -0.35, 0, 0); // Deeper bend for stability
      kf.rotate(BoneName.FOOT_L, 0, 1.57, 0); // 90° pivot on ball of foot

      // Foot extends laterally
      kf.position(BoneName.FOOT_R, 0.8, 0, 0);

      // Arms maintain high guard
      kf.rotate(BoneName.SHOULDER_L, -0.9, 0.3, 0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.6);
      kf.rotate(BoneName.SHOULDER_R, -0.9, -0.3, -0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.6);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Side kick chamber - Turn sideways for 옆차기
   *
   * Authentic Taekwondo side kick chamber (옆차기 준비):
   * - Body turns 90° sideways (pelvis -1.57 rad on Y-axis)
   * - Hip flexed and chambered (1.3 rad flex, 0.3 rad rotation)
   * - Knee bent tight (-1.6 rad) preparing for lateral thrust
   * - Spine rotates with body (-1.2 rad on Y-axis)
   * - Lean away from kick for balance (0.2 rad lean)
   * - Support leg stable and aligned
   * - Arms protect vital areas
   *
   * The perpendicular chamber is essential - the hips must turn
   * sideways to allow the heel to drive through the target laterally.
   *
   * @korean 옆차기준비
   */
  sideKickChamber(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Apply side kick rotational phase
      applySideKickPhaseToConfig(kf, KICK_PHASES.SIDE_CHAMBER);

      // Support leg alignment
      kf.rotate(BoneName.KNEE_L, -0.3, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0, -0.3, 0); // Turn with body
      kf.rotate(BoneName.HIP_L, 0, -0.3, 0);

      // Head looks at target
      kf.rotate(BoneName.HEAD, 0, -0.5, 0);

      // Arms in defensive position
      kf.rotate(BoneName.SHOULDER_L, -0.7, 0.5, 0.3);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.5);
      kf.rotate(BoneName.SHOULDER_R, -0.7, -0.5, -0.3);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.5);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Side kick extension - Lateral heel thrust for 옆차기
   *
   * Authentic Taekwondo side kick extension (옆차기 실행):
   * - Hip extends laterally (1.3 rad flex, 0.7 rad rotation)
   * - Knee extends fully (-0.1 rad) driving heel through target
   * - Foot turned heel-first (0.4 rad on Y-axis)
   * - Pelvis maintains 90° turn (-1.57 rad)
   * - Spine leans away (0.4 rad) for counterbalance
   * - Foot extends laterally (0.7m to side)
   * - Support leg drives power
   *
   * The side kick is one of the most powerful kicks because the
   * entire body mass drives through the heel in a straight line.
   *
   * @korean 옆차기
   */
  sideKickExtend(timeOffset: number = 0.1, easing: string = "linear"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Full extension laterally
      kf.rotate(BoneName.HIP_R, 1.3, 0, 0.7);
      kf.rotate(BoneName.KNEE_R, -0.1, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0, 0.4, 0);
      kf.rotate(BoneName.PELVIS, 0, -1.57, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0, -1.2, 0.2);
      kf.rotate(BoneName.SPINE_UPPER, 0, -1.2, 0.4);

      // Support leg powers the kick
      kf.rotate(BoneName.KNEE_L, -0.4, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0, -0.3, 0);
      kf.rotate(BoneName.HIP_L, 0, -0.3, 0);

      // Foot extends to side
      kf.position(BoneName.FOOT_R, 0.7, 0, 0);

      // Head maintains target focus
      kf.rotate(BoneName.HEAD, 0, -0.5, 0);

      // Arms balanced
      kf.rotate(BoneName.SHOULDER_L, -0.7, 0.5, 0.3);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.5);
      kf.rotate(BoneName.SHOULDER_R, -0.7, -0.5, -0.3);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.5);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Axe kick rise - Leg rises high for 내려차기
   *
   * Enhanced with hip rotation and support leg positioning
   * @korean 내려차기올리기
   */
  axeKickRise(timeOffset: number = 0.15, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      applyHighPeakPhaseToConfig(kf, KICK_PHASES.HIGH_PEAK);

      // Hip rotation for power generation (골반회전)
      kf.rotate(BoneName.PELVIS, -0.2, -0.6, 0); // Tilt back + Y rotation

      // Spine lean for axe kick balance
      kf.rotate(BoneName.SPINE_LOWER, -0.2, -0.3, 0);
      kf.rotate(BoneName.SPINE_UPPER, -0.15, -0.2, 0);

      // Support leg positioning
      kf.rotate(BoneName.HIP_L, 0, -0.2, 0);
      kf.rotate(BoneName.KNEE_L, -0.3, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0, 0.5, 0); // Slight pivot

      kf.position(BoneName.FOOT_R, 0, 1.5, 0.3);

      // Guard hands protect during exposed position
      kf.rotate(BoneName.SHOULDER_L, -0.9, 0.3, 0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -2.0);
      kf.rotate(BoneName.SHOULDER_R, -0.9, -0.3, -0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 2.0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Axe kick chop - Downward heel strike for 내려차기
   *
   * Enhanced with hip rotation and guard hands
   * @korean 내려차기
   */
  axeKickChop(timeOffset: number = 0.1, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Kicking leg drives down
      kf.rotate(BoneName.HIP_R, 0.8, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.15, 0, 0);
      kf.rotate(BoneName.FOOT_R, -0.3, 0, 0);

      // Hip rotation for power (골반회전)
      kf.rotate(BoneName.PELVIS, 0.1, -0.6, 0); // Forward tilt + Y rotation
      kf.rotate(BoneName.SPINE_LOWER, 0.1, -0.3, 0);

      // Support leg maintains pivot
      kf.rotate(BoneName.KNEE_L, -0.35, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0, 0.5, 0);

      kf.position(BoneName.FOOT_R, 0, 0.5, 0.4);

      // Guard hands remain protective
      kf.rotate(BoneName.SHOULDER_L, -0.9, 0.3, 0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -2.0);
      kf.rotate(BoneName.SHOULDER_R, -0.9, -0.3, -0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 2.0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Back kick spin - 180° turn for 뒤차기
   *
   * Authentic Taekwondo back kick spin (뒤차기 회전):
   * - Body rotates 180° (pelvis -1.5 rad initially)
   * - Spine rotates with body (lower: -1.3 rad, upper: -1.0 rad)
   * - Head looks over shoulder (0.5 rad) to maintain target visual
   * - Hip chambers (0.3 rad flex)
   * - Knee bends (-0.8 rad) preparing for backward thrust
   * - Support leg maintains balance
   *
   * Looking over the shoulder is CRITICAL - you must see the target
   * to execute an accurate back kick. This is emphasized in all
   * traditional Korean martial arts.
   *
   * @korean 뒤차기회전
   */
  backKickSpin(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Body rotation - 180° for back kick
      kf.rotate(BoneName.PELVIS, 0, -1.5, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0, -1.3, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -1.0, 0.1);

      // CRITICAL: Look over shoulder to see target
      kf.rotate(BoneName.HEAD, 0, 0.5, 0);

      // Leg chambers during rotation
      kf.rotate(BoneName.HIP_R, 0.3, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.8, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0, 0, 0);

      // Support leg - PROPER PIVOT for 180° rotation (축발 회전)
      // Ball of foot pivots to allow hip rotation
      kf.rotate(BoneName.HIP_L, 0, -0.4, 0); // Standing hip follows rotation
      kf.rotate(BoneName.KNEE_L, -0.35, 0, 0); // Deeper bend for stability
      kf.rotate(BoneName.FOOT_L, 0, -1.57, 0); // 90° pivot on ball

      // Arms balance during spin - elbows tucked
      kf.rotate(BoneName.SHOULDER_L, -0.6, 0.5, 0.3);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -2.0);
      kf.rotate(BoneName.SHOULDER_R, -0.6, -0.5, -0.3);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 2.0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Back kick thrust - Heel drives backward for 뒤차기
   *
   * Authentic Taekwondo back kick thrust (뒤차기 밀기):
   * - Body completes 180° rotation (pelvis -3.14 rad = π)
   * - Hip extends backward (0.5 rad flex maintained)
   * - Knee extends fully (-0.2 rad) driving heel back
   * - Foot dorsiflexes (-0.4 rad) presenting heel
   * - Foot position extends backward (0 forward, 0 up, -0.8 back)
   * - Head maintains target visual (1.0 rad look-back)
   * - Spine fully rotated with body
   * - Support leg powers the thrust
   *
   * The back kick delivers tremendous power because the entire
   * body mass drives through the strongest leg muscles (glutes,
   * hamstrings) in a straight line backward.
   *
   * @korean 뒤차기
   */
  backKickThrust(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Complete rotation
      kf.rotate(BoneName.PELVIS, 0, -3.14, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0, -3.0, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -2.8, 0.2);

      // Head still looking at target
      kf.rotate(BoneName.HEAD, 0, 1.0, 0);

      // Full leg extension backward
      kf.rotate(BoneName.HIP_R, 0.5, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.2, 0, 0);
      kf.rotate(BoneName.FOOT_R, -0.4, 0, 0);

      // Foot drives backward
      kf.position(BoneName.FOOT_R, 0, 0, -0.8);

      // Support leg powers thrust
      kf.rotate(BoneName.HIP_L, 0, -0.3, 0);
      kf.rotate(BoneName.KNEE_L, -0.5, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0, -0.3, 0);

      // Arms for balance
      kf.rotate(BoneName.SHOULDER_L, -0.6, 0.7, 0.3);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.4);
      kf.rotate(BoneName.SHOULDER_R, -0.6, -0.7, -0.3);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.4);
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
    easing: string = "ease-out",
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
    easing: string = "ease-out",
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
   *
   * Enhanced with hip rotation and guard hand protection
   * @korean 밀어차기준비
   */
  pushKickChamber(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 1.2, 0, 0);
      kf.rotate(BoneName.KNEE_R, -1.8, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.3, 0, 0);

      // Support leg with slight pivot
      kf.rotate(BoneName.HIP_L, 0, -0.2, 0);
      kf.rotate(BoneName.KNEE_L, -0.3, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0, 0.4, 0); // Support foot pivot

      // Hip rotation preparation
      kf.rotate(BoneName.PELVIS, -0.1, -0.3, 0);

      // Guard hands protect during chamber
      kf.rotate(BoneName.SHOULDER_L, -0.9, 0.3, 0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -2.0);
      kf.rotate(BoneName.SHOULDER_R, -0.9, -0.3, -0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 2.0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Push kick thrust - Foot pushes opponent back (밀어차기)
   *
   * Enhanced with hip rotation for power and guard hand protection
   * @korean 밀어차기
   */
  pushKickThrust(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      kf.rotate(BoneName.HIP_R, 1.0, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.15, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.5, 0, 0);

      // Support leg with deeper pivot
      kf.rotate(BoneName.HIP_L, 0, -0.3, 0);
      kf.rotate(BoneName.KNEE_L, -0.35, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0, 0.8, 0); // Support foot pivot for power

      // Hip rotation drives the push (골반회전)
      kf.rotate(BoneName.PELVIS, 0.1, -0.6, 0); // Forward tilt + Y rotation
      kf.rotate(BoneName.SPINE_LOWER, 0.05, -0.3, 0);
      kf.position(BoneName.FOOT_R, 0, 0, 0.5);

      // Guard hands protect during thrust
      kf.rotate(BoneName.SHOULDER_L, -0.9, 0.3, 0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -2.0);
      kf.rotate(BoneName.SHOULDER_R, -0.9, -0.3, -0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 2.0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Spinning heel kick - 360° with heel strike (뒤돌려차기)
   *
   * Full 360° spin requires complete support foot pivot
   * @korean 뒤돌려차기
   */
  spinningHeelKick(
    timeOffset: number = 0.15,
    easing: string = "ease-out",
  ): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Full body rotation for 360° spin
      kf.rotate(BoneName.PELVIS, 0, -4.5, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0, -4.3, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -4.0, 0.15);

      // Kicking leg - heel strike position
      kf.rotate(BoneName.HIP_R, 0.8, 0, 1.2);
      kf.rotate(BoneName.KNEE_R, -0.2, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.3, 0, 0.2);
      kf.position(BoneName.FOOT_R, 0.6, 0.5, 0);

      // Support leg - CRITICAL PIVOT for 360° spin (축발 회전)
      kf.rotate(BoneName.HIP_L, 0, -0.5, 0); // Standing hip rotates
      kf.rotate(BoneName.KNEE_L, -0.4, 0, 0); // Deep bend for stability
      kf.rotate(BoneName.FOOT_L, 0, -2.1, 0); // 120° pivot (continuous spin)

      // Arms tucked for spin speed
      kf.rotate(BoneName.SHOULDER_L, -0.7, 0.4, 0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -2.0);
      kf.rotate(BoneName.SHOULDER_R, -0.7, -0.4, -0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 2.0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Hook kick extension - Leg extends past target (후려차기 연장)
   *
   * Authentic Korean hook kick (후려차기) first phase:
   * - Body rotates past perpendicular (~100°)
   * - Leg extends past target like a missed side kick
   * - Foot positioned to hook back toward target
   * - Head maintains target visual
   *
   * The hook kick is distinct from crescent kick:
   * - Crescent: sweeps ACROSS body
   * - Hook: extends PAST, then hooks BACK
   *
   * @korean 후려차기연장
   */
  hookKickExtend(timeOffset: number = 0.15, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Body rotates past perpendicular
      kf.rotate(BoneName.PELVIS, 0, -1.8, 0); // ~103° rotation
      kf.rotate(BoneName.SPINE_LOWER, 0, -1.6, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -1.4, 0.1);

      // Head tracks target
      kf.rotate(BoneName.HEAD, 0, 0.6, 0);

      // Leg extends past target (like missed side kick)
      kf.rotate(BoneName.HIP_R, 1.3, 0, 0.5);
      kf.rotate(BoneName.KNEE_R, -0.1, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.2, 0, 0.4);

      // Foot positioned past target
      kf.position(BoneName.FOOT_R, 0.3, 0.8, -0.5);

      // Support leg
      kf.rotate(BoneName.HIP_L, 0, -0.2, 0);
      kf.rotate(BoneName.KNEE_L, -0.35, 0, 0);

      // Arms for balance
      kf.rotate(BoneName.SHOULDER_L, -0.5, 0.5, 0.3);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.5);
      kf.rotate(BoneName.SHOULDER_R, -0.5, -0.4, -0.3);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.5);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Hook kick hook-back - Heel hooks back toward target (후려차기 후림)
   *
   * Authentic Korean hook kick (후려차기) second phase:
   * - Leg retracts/hooks back toward target
   * - Heel is the striking surface (발뒤꿈치)
   * - Body rotates back toward target during hook
   * - Snapping motion at knee for power
   *
   * The hook motion is what makes this kick unique:
   * - Extends past, then HOOKS back
   * - Catches opponent from unexpected angle
   * - Heel strikes back of head or temple
   *
   * @korean 후려차기후림
   */
  hookKickHook(timeOffset: number = 0.12, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Body rotates back toward target
      kf.rotate(BoneName.PELVIS, 0, -1.3, 0); // Rotate back ~75°
      kf.rotate(BoneName.SPINE_LOWER, 0, -1.2, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -1.0, 0.1);

      // Head stays on target
      kf.rotate(BoneName.HEAD, 0, 0.4, 0);

      // Leg hooks back - knee bends, hip rotates inward
      kf.rotate(BoneName.HIP_R, 1.0, 0, -0.3); // Hip rotation inward
      kf.rotate(BoneName.KNEE_R, -0.6, 0, 0); // Knee snap for power
      kf.rotate(BoneName.FOOT_R, 0.3, 0, -0.4); // Heel presentation

      // Foot hooks back toward target
      kf.position(BoneName.FOOT_R, 0, 0.8, 0.2);

      // Support leg
      kf.rotate(BoneName.HIP_L, 0, -0.1, 0);
      kf.rotate(BoneName.KNEE_L, -0.4, 0, 0);

      // Arms counter for balance
      kf.rotate(BoneName.SHOULDER_L, -0.6, 0.4, 0.2);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.4);
      kf.rotate(BoneName.SHOULDER_R, -0.5, -0.3, -0.2);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.4);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Tornado kick jump with 360° rotation (회전차기 도약)
   *
   * Authentic Korean tornado kick (회전차기) jump phase:
   * - Jump with full 360° body rotation
   * - Arms swing to generate rotational momentum
   * - Body elevates during spin
   * - Prepares for roundhouse at apex
   *
   * @korean 회전차기도약
   */
  tornadoJump(timeOffset: number = 0.3): this {
    // First half - 180° rotation while rising
    this.addKeyframe(this.currentTime + timeOffset * 0.4, "ease-out", (kf) => {
      kf.rotate(BoneName.PELVIS, 0, -3.14, 0); // 180° rotation
      kf.rotate(BoneName.SPINE_LOWER, 0, -3.0, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -2.8, 0);

      // Jump - elevate body (use pelvis position)
      kf.position(BoneName.PELVIS, 0, 0.3, 0);

      // Both legs tuck for spin
      kf.rotate(BoneName.HIP_R, 0.6, 0, 0);
      kf.rotate(BoneName.KNEE_R, -1.2, 0, 0);
      kf.rotate(BoneName.HIP_L, 0.4, 0, 0);
      kf.rotate(BoneName.KNEE_L, -1.0, 0, 0);

      // Arms swing for momentum
      kf.rotate(BoneName.SHOULDER_L, -0.8, 0.6, 0.4);
      kf.rotate(BoneName.SHOULDER_R, -0.8, -0.6, -0.4);
    });

    // Complete 360° at apex
    this.addKeyframe(this.currentTime + timeOffset, "ease-in", (kf) => {
      kf.rotate(BoneName.PELVIS, 0, -6.28, 0); // Full 360° rotation
      kf.rotate(BoneName.SPINE_LOWER, 0, -6.0, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0, -5.8, 0);

      // Peak height (use pelvis position)
      kf.position(BoneName.PELVIS, 0, 0.5, 0);

      // Kicking leg begins to chamber
      kf.rotate(BoneName.HIP_R, 1.0, 0, 0.4);
      kf.rotate(BoneName.KNEE_R, -1.5, 0, 0);

      // Support leg extends
      kf.rotate(BoneName.HIP_L, 0.3, 0, 0);
      kf.rotate(BoneName.KNEE_L, -0.3, 0, 0);

      // Arms position for kick
      kf.rotate(BoneName.SHOULDER_L, -0.6, 0.3, 0.3);
      kf.rotate(BoneName.SHOULDER_R, -0.6, -0.3, -0.3);
    });

    this.currentTime += timeOffset;
    return this;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PUNCH TECHNIQUES (주먹 기술)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Punch chamber - Fist at hip with vertical palm (주먹준비자세)
   * Korean martial arts chamber position with fist vertical (세로주먹)
   * @param timeOffset Time offset in seconds
   * @param hand Which hand to chamber ("left" | "right")
   * @param easing Easing function
   * @korean 주먹준비자세
   */
  punchChamber(
    timeOffset: number = 0.1,
    hand: "left" | "right" = "right",
    easing: string = "ease-out",
  ): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      applyPunchPhaseToConfig(kf, PUNCH_PHASES.CHAMBER, hand, {
        includeWrist: true,
        includeOppositeArm: true,
        includeSpineMiddle: false,
      });
      // Form fist during chamber
      this.applyHandPose(kf, HAND_POSES.FIST, hand);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Punch wind-up - Arm coils back (주먹준비)
   * @param timeOffset Time offset in seconds
   * @param hand Which hand to wind up ("left" | "right")
   * @param easing Easing function
   * @korean 주먹준비
   */
  punchWindup(
    timeOffset: number = 0.08,
    hand: "left" | "right" = "right",
    easing: string = "linear",
  ): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      applyPunchPhaseToConfig(kf, PUNCH_PHASES.WINDUP, hand, {
        includeOppositeArm: true,
      });
      // Form fist during windup
      this.applyHandPose(kf, HAND_POSES.FIST, hand);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Punch extension - Arm extends with torso rotation (지르기)
   * Includes fist rotation from vertical to pronated and hikite
   *
   * Enhanced with realistic torso rotation (허리비틀기):
   * - Straight punches: 20° counter-rotation for power
   * - Torso rotates OPPOSITE to punch direction
   * - Sequential spine rotation (lower → mid → upper)
   *
   * @param timeOffset Time offset in seconds
   * @param hand Which hand to extend ("left" | "right")
   * @param easing Easing function
   * @korean 지르기
   */
  punchExtend(
    timeOffset: number = 0.07,
    hand: "left" | "right" = "right",
    easing: string = "ease-out",
  ): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Apply punch phase first (sets base spine rotation from PUNCH_PHASES)
      applyPunchPhaseToConfig(kf, PUNCH_PHASES.EXTENSION, hand, {
        includeWrist: true,
        includeSpineMiddle: true,
        includeOppositeArm: true,
      });
      // Then apply enhanced torso rotation which combines with existing values
      this.applyPunchTorsoRotation(kf, hand, 20);
      // Apply fist pose to punching hand
      this.applyHandPose(kf, HAND_POSES.FIST, hand);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Punch peak - Maximum extension with full rotation (정점)
   * Hold at full extension for impact frame
   *
   * Enhanced with sustained torso rotation at impact:
   * - Maintains 20° counter-rotation at peak
   * - Maximizes power transfer through spine
   *
   * @param timeOffset Time offset in seconds
   * @param hand Which hand is extended ("left" | "right")
   * @param easing Easing function
   * @korean 정점
   */
  punchPeak(
    timeOffset: number = 0.05,
    hand: "left" | "right" = "right",
    easing: string = "linear",
  ): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Apply punch phase first (sets base spine rotation from PUNCH_PHASES)
      applyPunchPhaseToConfig(kf, PUNCH_PHASES.PEAK, hand, {
        includeWrist: true,
        includeSpineMiddle: true,
        includeOppositeArm: true,
      });
      // Maintain torso rotation at peak which combines with existing values
      this.applyPunchTorsoRotation(kf, hand, 20);
      // Hold fist pose
      this.applyHandPose(kf, HAND_POSES.FIST, hand);
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
   * Enhanced with Korean martial arts shoulder rotation and hikite (당기기)
   *
   * Enhanced with realistic circular torso rotation (몸통회전):
   * - Hook punches: 50° rotation for circular power
   * - Torso rotates INTO the punch for arc generation
   * - Sequential spine rotation creates whipping motion
   *
   * @param timeOffset Time offset in seconds
   * @param hand Which hand is hooking ("left" | "right")
   * @param easing Easing function
   * @korean 후크
   */
  hookPunch(
    timeOffset: number = 0.1,
    hand: "left" | "right" = "right",
    easing: string = "ease-out",
  ): this {
    const isRight = hand === "right";
    const shoulderBone = isRight ? BoneName.SHOULDER_R : BoneName.SHOULDER_L;
    const elbowBone = isRight ? BoneName.ELBOW_R : BoneName.ELBOW_L;
    const wristBone = isRight ? BoneName.WRIST_R : BoneName.WRIST_L;
    const oppositeShoulder = isRight
      ? BoneName.SHOULDER_L
      : BoneName.SHOULDER_R;
    const oppositeElbow = isRight ? BoneName.ELBOW_L : BoneName.ELBOW_R;

    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Hook arm arcs across
      kf.rotate(shoulderBone, -0.1, isRight ? 0.6 : -0.6, isRight ? 0.4 : -0.4);
      kf.rotate(elbowBone, 0, 0, isRight ? 1.35 : -1.35);
      kf.rotate(wristBone, 0, isRight ? 0.2 : -0.2, 0);

      // Opposite arm pulls back (hikite)
      kf.rotate(oppositeShoulder, -0.2, 0, isRight ? -0.3 : 0.3);
      kf.rotate(oppositeElbow, 0, 0, isRight ? -1.1 : 1.1);

      // Apply enhanced hook torso rotation for circular power (50°)
      this.applyHookTorsoRotation(kf, hand, 50);
      kf.rotate(BoneName.PELVIS, 0, isRight ? 0.35 : -0.35, 0);

      // Rear foot pivot for power generation (축발회전)
      // The rear foot pivots inward as the hip rotates, driving force through kinetic chain
      const rearFoot = isRight ? BoneName.FOOT_R : BoneName.FOOT_L;
      const rearHip = isRight ? BoneName.HIP_R : BoneName.HIP_L;
      kf.rotate(rearFoot, 0, isRight ? 0.4 : -0.4, 0); // Pivot inward ~23°
      kf.rotate(rearHip, 0, isRight ? 0.25 : -0.25, 0); // Hip follows rotation

      // Apply fist pose to punching hand
      this.applyHandPose(kf, HAND_POSES.FIST, hand);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Hook wind-up - Arm pulls to side (후크준비)
   * Enhanced with hikite (당기기) preparation
   * @param timeOffset Time offset in seconds
   * @param hand Which hand is hooking ("left" | "right")
   * @param easing Easing function
   * @korean 후크준비
   */
  hookWindup(
    timeOffset: number = 0.08,
    hand: "left" | "right" = "right",
    easing: string = "linear",
  ): this {
    const isRight = hand === "right";
    const shoulderBone = isRight ? BoneName.SHOULDER_R : BoneName.SHOULDER_L;
    const elbowBone = isRight ? BoneName.ELBOW_R : BoneName.ELBOW_L;
    const oppositeShoulder = isRight
      ? BoneName.SHOULDER_L
      : BoneName.SHOULDER_R;
    const oppositeElbow = isRight ? BoneName.ELBOW_L : BoneName.ELBOW_R;

    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Hook arm pulls back to side
      kf.rotate(shoulderBone, 0.1, isRight ? -0.6 : 0.6, isRight ? -0.5 : 0.5);
      kf.rotate(elbowBone, 0, 0, isRight ? 1.57 : -1.57);

      // Opposite arm in guard
      kf.rotate(oppositeShoulder, -0.1, 0, isRight ? 0.2 : -0.2);
      kf.rotate(oppositeElbow, 0, 0, isRight ? 1.4 : -1.4);

      // Body coiled away
      kf.rotate(BoneName.SPINE_UPPER, 0, isRight ? -0.3 : 0.3, 0);
      kf.rotate(BoneName.PELVIS, 0, isRight ? -0.2 : 0.2, 0);

      // Form fist during hook windup
      this.applyHandPose(kf, HAND_POSES.FIST, hand);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Uppercut punch - Rising punch to chin (어퍼컷)
   * Enhanced with Korean martial arts leg drive and hikite (당기기)
   * @param timeOffset Time offset in seconds
   * @param hand Which hand is uppercutting ("left" | "right")
   * @param easing Easing function
   * @korean 어퍼컷
   */
  uppercutPunch(
    timeOffset: number = 0.1,
    hand: "left" | "right" = "right",
    easing: string = "ease-out",
  ): this {
    const isRight = hand === "right";
    const shoulderBone = isRight ? BoneName.SHOULDER_R : BoneName.SHOULDER_L;
    const elbowBone = isRight ? BoneName.ELBOW_R : BoneName.ELBOW_L;
    const oppositeShoulder = isRight
      ? BoneName.SHOULDER_L
      : BoneName.SHOULDER_R;
    const oppositeElbow = isRight ? BoneName.ELBOW_L : BoneName.ELBOW_R;

    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Uppercut arm rises
      kf.rotate(shoulderBone, 0.8, 0, isRight ? 1.0 : -1.0);
      kf.rotate(elbowBone, 0, 0, isRight ? 1.2 : -1.2);

      // Opposite arm pulls back (hikite)
      kf.rotate(oppositeShoulder, -0.2, 0, isRight ? -0.3 : 0.3);
      kf.rotate(oppositeElbow, 0, 0, isRight ? -1.1 : 1.1);

      // Drive up through legs - explosive extension generates upward force (다리구동력)
      // From crouch position, knees extend powerfully (positive = straighter)
      kf.rotate(BoneName.KNEE_L, 0.15, 0, 0); // Extend from crouch
      kf.rotate(BoneName.KNEE_R, 0.15, 0, 0); // Extend from crouch
      kf.rotate(BoneName.HIP_L, -0.1, 0, 0); // Hip drives upward
      kf.rotate(BoneName.HIP_R, -0.1, 0, 0); // Hip drives upward
      kf.rotate(BoneName.PELVIS, -0.25, isRight ? 0.2 : -0.2, 0); // More explosive rise
      kf.position(BoneName.PELVIS, 0, 0.15, 0.1); // Higher rise from leg drive

      // Apply fist pose to punching hand
      this.applyHandPose(kf, HAND_POSES.FIST, hand);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Uppercut crouch - Dip before rising punch (어퍼컷준비)
   * Enhanced with hikite (당기기) preparation
   * @param timeOffset Time offset in seconds
   * @param hand Which hand is uppercutting ("left" | "right")
   * @param easing Easing function
   * @korean 어퍼컷준비
   */
  uppercutCrouch(
    timeOffset: number = 0.08,
    hand: "left" | "right" = "right",
    easing: string = "linear",
  ): this {
    const isRight = hand === "right";
    const shoulderBone = isRight ? BoneName.SHOULDER_R : BoneName.SHOULDER_L;
    const elbowBone = isRight ? BoneName.ELBOW_R : BoneName.ELBOW_L;
    const oppositeShoulder = isRight
      ? BoneName.SHOULDER_L
      : BoneName.SHOULDER_R;
    const oppositeElbow = isRight ? BoneName.ELBOW_L : BoneName.ELBOW_R;

    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Uppercut arm coils low
      kf.rotate(shoulderBone, 0.3, 0, isRight ? 0.2 : -0.2);
      kf.rotate(elbowBone, 0, 0, isRight ? 1.5 : -1.5);

      // Opposite arm in guard
      kf.rotate(oppositeShoulder, -0.1, 0, isRight ? 0.2 : -0.2);
      kf.rotate(oppositeElbow, 0, 0, isRight ? 1.4 : -1.4);

      // Drop level to load legs
      kf.rotate(BoneName.KNEE_L, -0.4, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.4, 0, 0);
      kf.rotate(BoneName.PELVIS, 0.15, isRight ? -0.1 : 0.1, 0);
      kf.position(BoneName.PELVIS, 0, -0.1, 0);

      // Apply fist pose to punching hand during preparation
      this.applyHandPose(kf, HAND_POSES.FIST, hand);
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
   *
   * Enhanced with hip rotation and proper clinch mechanics
   * @korean 무릎차기
   */
  kneeStrike(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Clinch grip - hands pulling opponent in
      kf.rotate(BoneName.SHOULDER_L, 0.2, 0.3, -0.8);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.8);
      kf.rotate(BoneName.SHOULDER_R, 0.2, -0.3, 0.8);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.8);

      // Knee drive - maximum hip rotation for power
      kf.rotate(BoneName.HIP_R, 1.4, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.5, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.4, 0, 0);

      // Hip rotation drives the knee (골반회전)
      kf.rotate(BoneName.PELVIS, 0.2, -0.6, 0); // Forward tilt + Y rotation
      kf.rotate(BoneName.SPINE_LOWER, 0.1, -0.3, 0);

      // Support leg stable
      kf.rotate(BoneName.KNEE_L, -0.2, 0, 0);
      kf.rotate(BoneName.HIP_L, 0, -0.2, 0);
      kf.rotate(BoneName.FOOT_L, 0, 0.5, 0); // Slight pivot

      kf.position(BoneName.KNEE_R, 0, 0.4, 0.5);

      // Grab hands for clinch knee strike
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Brachial elbow - Horizontal elbow to brachial nerve (상박치기)
   * Targets the lateral neck/brachial plexus area
   * @korean 상박치기
   */
  brachialElbow(timeOffset: number = 0.08, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Arm swings horizontally targeting neck level
      kf.rotate(BoneName.SHOULDER_R, -0.3, 0.2, 0.8);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.6);
      // Strong torso rotation for power
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.8, 0.1);
      kf.rotate(BoneName.SPINE_MIDDLE, 0, 0.6, 0.05);
      kf.rotate(BoneName.PELVIS, 0, 0.5, 0);
      // Elbow aimed at neck height
      kf.position(BoneName.ELBOW_R, 0.3, 0.2, 0.6);
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Slashing elbow - Diagonal cutting elbow (베기팔꿈치)
   * Diagonal slash across opponent's face/temple
   * @korean 베기팔꿈치
   */
  slashingElbow(timeOffset: number = 0.09, easing: string = "linear"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Diagonal slash motion - high to low
      kf.rotate(BoneName.SHOULDER_R, -0.6, 0.3, 1.0);
      kf.rotate(BoneName.ELBOW_R, 0, 0.2, 1.2);
      // Torso follows diagonal path
      kf.rotate(BoneName.SPINE_UPPER, 0.2, 0.5, 0.15);
      kf.rotate(BoneName.SPINE_MIDDLE, 0.1, 0.4, 0.1);
      kf.rotate(BoneName.PELVIS, 0.05, 0.3, 0.05);
      // Elbow cuts diagonally
      kf.position(BoneName.ELBOW_R, 0.2, 0.1, 0.6);
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Spinal elbow - Downward elbow to spine (척추팔꿈치)
   * Strikes spine from behind or above
   * @korean 척추팔꿈치
   */
  spinalElbow(timeOffset: number = 0.1, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Arm drives down toward spine
      kf.rotate(BoneName.SHOULDER_R, -0.8, 0.4, 0.6);
      kf.rotate(BoneName.ELBOW_R, 0, 0.3, 1.0);
      // Body leans forward for reach
      kf.rotate(BoneName.SPINE_UPPER, 0.4, 0.3, 0);
      kf.rotate(BoneName.SPINE_MIDDLE, 0.3, 0.2, 0);
      kf.rotate(BoneName.PELVIS, 0.2, 0.2, 0);
      // Elbow targets lower target
      kf.position(BoneName.ELBOW_R, 0.15, -0.1, 0.7);
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Side knee - Lateral knee to ribs (옆무릎)
   * Clinch knee targeting opponent's side
   * @korean 옆무릎
   */
  sideKneeStrike(timeOffset: number = 0.12, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Clinch position with lateral knee
      kf.rotate(BoneName.SHOULDER_L, 0.3, 0.4, -0.6);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.6);
      kf.rotate(BoneName.SHOULDER_R, 0.3, -0.4, 0.6);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.6);

      // Knee drives laterally
      kf.rotate(BoneName.HIP_R, 1.2, 0, 0.4); // Lateral angle
      kf.rotate(BoneName.KNEE_R, -0.4, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.3, 0, 0);

      // Hip rotation for side angle
      kf.rotate(BoneName.PELVIS, 0.1, -0.4, 0.1);
      kf.rotate(BoneName.SPINE_LOWER, 0.05, -0.3, 0.05);

      // Support leg
      kf.rotate(BoneName.KNEE_L, -0.25, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0, 0.4, 0);

      kf.position(BoneName.KNEE_R, 0.3, 0.3, 0.4);
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Flying knee - Jumping knee strike (뛰어무릎)
   * Explosive airborne knee
   * @korean 뛰어무릎
   */
  flyingKnee(timeOffset: number = 0.15, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Both arms drive for momentum
      kf.rotate(BoneName.SHOULDER_L, -0.5, 0.3, -0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.4);
      kf.rotate(BoneName.SHOULDER_R, -0.5, -0.3, 0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.4);

      // Knee drives high in air
      kf.rotate(BoneName.HIP_R, 1.6, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.3, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.5, 0, 0);

      // Trailing leg extends back
      kf.rotate(BoneName.HIP_L, -0.3, 0, 0);
      kf.rotate(BoneName.KNEE_L, -0.1, 0, 0);

      // Body drives forward and up
      kf.rotate(BoneName.PELVIS, 0.3, -0.5, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0.2, -0.3, 0);

      // Airborne position
      kf.position(BoneName.PELVIS, 0, 0.4, 0.3);
      kf.position(BoneName.KNEE_R, 0, 0.6, 0.6);
      this.applyHandPose(kf, HAND_POSES.FIST, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Kidney knee - Knee to kidney from side (신장무릎)
   * Targets kidney area from side clinch
   * @korean 신장무릎
   */
  kidneyKnee(timeOffset: number = 0.11, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Side clinch grip
      kf.rotate(BoneName.SHOULDER_L, 0.4, 0.5, -0.5);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.5);
      kf.rotate(BoneName.SHOULDER_R, 0.4, -0.5, 0.5);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.5);

      // Knee hooks around to kidney
      kf.rotate(BoneName.HIP_R, 1.3, 0.2, 0.3);
      kf.rotate(BoneName.KNEE_R, -0.45, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.35, 0.1, 0);

      // Body angles for side target
      kf.rotate(BoneName.PELVIS, 0.15, -0.5, 0.1);
      kf.rotate(BoneName.SPINE_LOWER, 0.1, -0.35, 0.05);

      // Support leg angled
      kf.rotate(BoneName.KNEE_L, -0.22, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0, 0.45, 0);

      kf.position(BoneName.KNEE_R, 0.25, 0.35, 0.45);
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Femoral knee - Knee to femoral nerve (대퇴부무릎)
   * Low knee targeting thigh/femoral nerve
   * @korean 대퇴부무릎
   */
  femoralKnee(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Low clinch position
      kf.rotate(BoneName.SHOULDER_L, 0.5, 0.3, -0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.3);
      kf.rotate(BoneName.SHOULDER_R, 0.5, -0.3, 0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.3);

      // Knee drives low
      kf.rotate(BoneName.HIP_R, 1.1, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.6, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.25, 0, 0);

      // Body stays lower
      kf.rotate(BoneName.PELVIS, 0.25, -0.4, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0.15, -0.25, 0);

      // Support leg bent
      kf.rotate(BoneName.KNEE_L, -0.3, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0, 0.35, 0);

      // Low target position
      kf.position(BoneName.KNEE_R, 0, 0.2, 0.5);
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // VITAL POINT STRIKES - DARKOPS (급소격 - 암살기술)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Throat strike - Precise strike to trachea (기도격)
   * Fingers extended targeting windpipe
   * @korean 기도격
   */
  throatStrike(timeOffset: number = 0.08, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Quick dart-like motion to throat level
      kf.rotate(BoneName.SHOULDER_R, -0.2, 0, 0.15);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.3);
      kf.rotate(BoneName.WRIST_R, -0.5, 0, 0);

      // Off hand guards low
      kf.rotate(BoneName.SHOULDER_L, 0.3, 0.2, -0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.6);

      // Subtle body rotation for precision
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.15, 0);
      kf.rotate(BoneName.PELVIS, 0, 0.1, 0);

      // Spear hand for throat targeting
      this.applyHandPose(kf, HAND_POSES.KNIFE_HAND, "right");
      this.applyHandPose(kf, HAND_POSES.FIST, "left");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Temple strike - Precision temple elbow (관자놀이격)
   * Horizontal elbow targeting temple
   * @korean 관자놀이격
   */
  templeElbow(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // High horizontal elbow arc to temple height
      kf.rotate(BoneName.SHOULDER_R, -0.8, 0.9, 0.7);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.7);
      kf.rotate(BoneName.WRIST_R, 0.2, 0, 0);

      // Pulling hand (controls head position)
      kf.rotate(BoneName.SHOULDER_L, 0.3, 0.7, -0.5);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.5);

      // Heavy torso rotation for power
      kf.rotate(BoneName.SPINE_UPPER, 0.1, 0.55, 0);
      kf.rotate(BoneName.SPINE_MIDDLE, 0, 0.4, 0);
      kf.rotate(BoneName.PELVIS, 0, 0.35, 0);

      // Fist for elbow strike
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
      this.applyHandPose(kf, HAND_POSES.GRAB, "left");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Nerve strike - Precision brachial plexus attack (신경격)
   * Short sharp strike to nerve cluster
   * @korean 신경격
   */
  nerveStrike(timeOffset: number = 0.06, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Compact chambered strike
      kf.rotate(BoneName.SHOULDER_R, 0.1, 0.3, 0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.6);
      kf.rotate(BoneName.WRIST_R, -0.3, -0.2, 0);

      // Guard hand high
      kf.rotate(BoneName.SHOULDER_L, -0.6, 0.3, -0.5);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.4);

      // Minimal body movement for stealth
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.12, 0);
      kf.rotate(BoneName.PELVIS, 0, 0.08, 0);

      // Knuckle strike for precise nerve targeting
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
      this.applyHandPose(kf, HAND_POSES.FIST, "left");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Jugular strike - Knife hand to jugular vein (경정맥격)
   * Slicing motion to jugular
   * @korean 경정맥격
   */
  jugularStrike(timeOffset: number = 0.08, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Diagonal knife hand motion
      kf.rotate(BoneName.SHOULDER_R, -0.4, 0.5, 0.35);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.4);
      kf.rotate(BoneName.WRIST_R, -0.4, 0.3, -0.2);

      // Other arm draws back
      kf.rotate(BoneName.SHOULDER_L, 0.2, -0.3, -0.3);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.7);

      // Body rotation for slicing power
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.28, 0.05);
      kf.rotate(BoneName.PELVIS, 0, 0.18, 0);

      // Knife hand for cutting strike
      this.applyHandPose(kf, HAND_POSES.KNIFE_HAND, "right");
      this.applyHandPose(kf, HAND_POSES.FIST, "left");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Occipital strike - Palm heel to base of skull (후두부격)
   * Upward palm strike to brain stem area
   * @korean 후두부격
   */
  occipitalStrike(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Upward palm heel motion
      kf.rotate(BoneName.SHOULDER_R, -1.1, 0.2, 0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.5);
      kf.rotate(BoneName.WRIST_R, -0.8, 0, 0);

      // Control arm at shoulder
      kf.rotate(BoneName.SHOULDER_L, 0.5, 0.5, -0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.2);

      // Body drives upward
      kf.rotate(BoneName.SPINE_UPPER, -0.2, 0.2, 0);
      kf.rotate(BoneName.PELVIS, -0.1, 0.15, 0);
      kf.rotate(BoneName.KNEE_L, -0.2, 0, 0);

      // Palm heel for strike
      this.applyHandPose(kf, HAND_POSES.OPEN_PALM, "right");
      this.applyHandPose(kf, HAND_POSES.GRAB, "left");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Jaw attack - Upward palm to jaw (턱격)
   * Palm strike causing jaw dislocation
   * @korean 턱격
   */
  jawStrike(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Sharp upward palm to jaw height
      kf.rotate(BoneName.SHOULDER_R, -0.9, 0.1, 0.3);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.3);
      kf.rotate(BoneName.WRIST_R, -0.6, 0, 0.1);

      // Guard arm stays protective
      kf.rotate(BoneName.SHOULDER_L, 0.1, 0.3, -0.5);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.5);

      // Explosive hip drive
      kf.rotate(BoneName.SPINE_UPPER, -0.15, 0.22, 0);
      kf.rotate(BoneName.SPINE_MIDDLE, -0.1, 0.15, 0);
      kf.rotate(BoneName.PELVIS, -0.08, 0.12, 0);
      kf.rotate(BoneName.KNEE_L, -0.15, 0, 0);

      // Palm strike pose
      this.applyHandPose(kf, HAND_POSES.OPEN_PALM, "right");
      this.applyHandPose(kf, HAND_POSES.FIST, "left");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Eye gouge approach - Fingers to eyes (안격)
   * Two finger strike to eyes
   * @korean 안격
   */
  eyeGouge(timeOffset: number = 0.06, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Quick forward dart to face level
      kf.rotate(BoneName.SHOULDER_R, -0.35, 0.15, 0.25);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.2);
      kf.rotate(BoneName.WRIST_R, -0.2, 0, 0);

      // Other hand controls head/shoulder
      kf.rotate(BoneName.SHOULDER_L, 0.35, 0.45, -0.35);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.3);

      // Minimal body telegraph
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.08, 0);
      kf.rotate(BoneName.NECK, -0.1, 0.05, 0);

      // Two-finger pose for eye attack
      this.applyHandPose(kf, HAND_POSES.TWO_FINGER, "right");
      this.applyHandPose(kf, HAND_POSES.GRAB, "left");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Solar plexus strike - Deep body shot (명치격)
   * Penetrating strike to solar plexus
   * @korean 명치격
   */
  solarPlexusStrike(
    timeOffset: number = 0.1,
    easing: string = "ease-out",
  ): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Driving straight punch at solar plexus level
      kf.rotate(BoneName.SHOULDER_R, 0.15, 0.05, 0.35);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.15);
      kf.rotate(BoneName.WRIST_R, 0, 0, -0.1);

      // Pulling arm for power generation
      kf.rotate(BoneName.SHOULDER_L, 0.25, -0.3, -0.35);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.8);

      // Full body drive behind punch
      kf.rotate(BoneName.SPINE_UPPER, 0.08, 0.3, 0);
      kf.rotate(BoneName.SPINE_MIDDLE, 0.05, 0.25, 0);
      kf.rotate(BoneName.PELVIS, 0.05, 0.2, 0);

      kf.position(BoneName.PELVIS, 0, 0, 0.08);

      // Fist for penetrating strike
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
      this.applyHandPose(kf, HAND_POSES.FIST, "left");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Liver shot - Hook to liver area (간격)
   * Hooking punch targeting liver
   * @korean 간격
   */
  liverShot(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Hooking motion to right side body
      kf.rotate(BoneName.SHOULDER_R, -0.3, 0.6, 0.5);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.2);
      kf.rotate(BoneName.WRIST_R, 0, 0.2, 0);

      // Left hand guards head
      kf.rotate(BoneName.SHOULDER_L, -0.5, 0.2, -0.5);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.5);

      // Torso rotates into hook
      kf.rotate(BoneName.SPINE_UPPER, 0.05, 0.4, 0);
      kf.rotate(BoneName.SPINE_MIDDLE, 0.03, 0.3, 0);
      kf.rotate(BoneName.PELVIS, 0, 0.25, 0);

      // Fist for hooking strike
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
      this.applyHandPose(kf, HAND_POSES.FIST, "left");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Kidney strike - Hook to kidney from behind (신장격)
   * Rear kidney targeting hook
   * @korean 신장격
   */
  kidneyStrike(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Circular hook coming from behind
      kf.rotate(BoneName.SHOULDER_R, 0.1, 0.7, 0.6);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.0);
      kf.rotate(BoneName.WRIST_R, 0, 0.15, -0.1);

      // Control arm at opponent's shoulder
      kf.rotate(BoneName.SHOULDER_L, 0.4, 0.5, -0.3);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.2);

      // Body rotates around opponent
      kf.rotate(BoneName.SPINE_UPPER, 0, 0.5, 0);
      kf.rotate(BoneName.SPINE_MIDDLE, 0, 0.4, 0);
      kf.rotate(BoneName.PELVIS, 0, 0.35, 0);

      // Fist for kidney shot
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
      this.applyHandPose(kf, HAND_POSES.GRAB, "left");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Spine strike - Downward elbow to spine (척추격)
   * 12-6 elbow targeting spine
   * @korean 척추격
   */
  spineStrike(timeOffset: number = 0.12, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Downward elbow from overhead
      kf.rotate(BoneName.SHOULDER_R, -1.3, 0.1, 0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.9);
      kf.rotate(BoneName.WRIST_R, 0.3, 0, 0);

      // Other arm controls opponent's body
      kf.rotate(BoneName.SHOULDER_L, 0.6, 0.4, -0.35);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.0);

      // Body drives downward
      kf.rotate(BoneName.SPINE_UPPER, 0.35, 0.1, 0);
      kf.rotate(BoneName.SPINE_MIDDLE, 0.25, 0.08, 0);
      kf.rotate(BoneName.PELVIS, 0.2, 0.05, 0);

      // Fist for elbow point
      this.applyHandPose(kf, HAND_POSES.FIST, "right");
      this.applyHandPose(kf, HAND_POSES.GRAB, "left");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Groin strike - Low rising knee or palm (낭심격)
   * Targeting groin area
   * @korean 낭심격
   */
  groinStrike(timeOffset: number = 0.08, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Rising palm heel to groin
      kf.rotate(BoneName.SHOULDER_R, 0.4, 0.1, 0.3);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.4);
      kf.rotate(BoneName.WRIST_R, -0.5, 0, 0.2);

      // Guard arm high
      kf.rotate(BoneName.SHOULDER_L, -0.4, 0.3, -0.5);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.4);

      // Body lowers for low target
      kf.rotate(BoneName.SPINE_UPPER, 0.15, 0.15, 0);
      kf.rotate(BoneName.PELVIS, 0.2, 0.1, 0);
      kf.rotate(BoneName.KNEE_L, -0.4, 0, 0);

      // Palm for groin strike
      this.applyHandPose(kf, HAND_POSES.OPEN_PALM, "right");
      this.applyHandPose(kf, HAND_POSES.FIST, "left");
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

  // ═══════════════════════════════════════════════════════════════════════
  // SPECIALIZED GRAPPLING (특수 잡기 기술)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Hip throw - Classic hip projection (배대되치기)
   * Rotating hip throw with arm control
   * @korean 배대되치기
   */
  hipThrow(timeOffset: number = 0.18, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Hip rotation under opponent
      kf.rotate(BoneName.PELVIS, 0.3, 2.0, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0.4, 1.6, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.5, 1.3, -0.15);

      // Arms pull opponent over
      kf.rotate(BoneName.SHOULDER_L, -0.5, 0.9, -0.7);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -0.8);
      kf.rotate(BoneName.SHOULDER_R, -0.3, -0.5, 0.5);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.3);

      // Legs provide base
      kf.rotate(BoneName.KNEE_L, -0.5, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.35, 0, 0);

      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Takedown entry - Shoot and grab legs (태클진입)
   * Double leg takedown initiation
   * @korean 태클진입
   */
  takedownShoot(timeOffset: number = 0.12, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Low driving position
      kf.rotate(BoneName.PELVIS, 0.7, 0.1, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0.5, 0.08, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.4, 0.05, 0);

      // Arms reach for legs
      kf.rotate(BoneName.SHOULDER_L, 0.6, 0.4, -0.35);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -0.6);
      kf.rotate(BoneName.SHOULDER_R, 0.6, -0.4, 0.35);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.6);

      // Driving legs
      kf.rotate(BoneName.KNEE_L, -0.8, 0, 0);
      kf.rotate(BoneName.KNEE_R, -1.2, 0, 0);
      kf.rotate(BoneName.HIP_R, 0.6, 0, 0);

      kf.position(BoneName.PELVIS, 0, -0.25, 0.15);
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Takedown finish - Lift and dump (태클완료)
   * Complete the takedown with dump
   * @korean 태클완료
   */
  takedownDump(timeOffset: number = 0.15, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Lifting and dumping motion
      kf.rotate(BoneName.PELVIS, 0.2, 0.5, 0);
      kf.rotate(BoneName.SPINE_LOWER, 0.15, 0.4, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.1, 0.35, -0.1);

      // Arms secure and dump
      kf.rotate(BoneName.SHOULDER_L, 0.4, 0.6, -0.5);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.1);
      kf.rotate(BoneName.SHOULDER_R, 0.4, -0.6, 0.5);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.1);

      // Legs drive forward
      kf.rotate(BoneName.KNEE_L, -0.4, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.5, 0, 0);

      kf.position(BoneName.PELVIS, 0, -0.1, 0.25);
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Elbow lock application - Arm bar pressure (팔꿈치꺾기)
   * Specific elbow hyperextension lock
   * @korean 팔꿈치꺾기
   */
  elbowLockApply(timeOffset: number = 0.18, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Two-on-one arm control
      kf.rotate(BoneName.SHOULDER_R, 0.3, 0.7, 0.6);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.5);
      kf.rotate(BoneName.WRIST_R, 0.2, -0.3, 0.1);

      kf.rotate(BoneName.SHOULDER_L, 0.2, 0.8, -0.5);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.6);
      kf.rotate(BoneName.WRIST_L, -0.2, 0.35, -0.1);

      // Torso leans back for leverage
      kf.rotate(BoneName.PELVIS, -0.15, 0.4, 0);
      kf.rotate(BoneName.SPINE_UPPER, -0.25, 0.35, 0);

      // Wide base
      kf.rotate(BoneName.KNEE_L, -0.3, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.35, 0, 0);

      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Shoulder lock twist - Shoulder manipulation (어깨꺾기)
   * Rotational shoulder joint attack
   * @korean 어깨꺾기
   */
  shoulderLockTwist(
    timeOffset: number = 0.2,
    easing: string = "ease-in",
  ): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Arm wrapped and twisting
      kf.rotate(BoneName.SHOULDER_R, -0.2, 0.9, 0.8);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.2);
      kf.rotate(BoneName.WRIST_R, 0.4, -0.5, 0.3);

      kf.rotate(BoneName.SHOULDER_L, 0.5, 0.7, -0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.0);

      // Body rotation for torque
      kf.rotate(BoneName.PELVIS, 0, 0.7, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.1, 0.55, 0);
      kf.rotate(BoneName.SPINE_MIDDLE, 0.05, 0.45, 0);

      kf.rotate(BoneName.KNEE_L, -0.4, 0, 0);

      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Finger manipulation - Small joint lock (손가락비틀기)
   * Precise finger control technique
   * @korean 손가락비틀기
   */
  fingerLockTwist(timeOffset: number = 0.12, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Fine control hand positions
      kf.rotate(BoneName.SHOULDER_R, 0.15, 0.4, 0.35);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.9);
      kf.rotate(BoneName.WRIST_R, 0.5, -0.6, 0.4);

      kf.rotate(BoneName.SHOULDER_L, 0.2, 0.5, -0.3);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.0);
      kf.rotate(BoneName.WRIST_L, -0.3, 0.5, -0.2);

      // Minimal body movement
      kf.rotate(BoneName.PELVIS, 0, 0.25, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.08, 0.2, 0);

      // Precision grip for finger control
      this.applyHandPose(kf, HAND_POSES.GRAB, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Choke grip - Rear naked choke position (교살잡기)
   * Setting up blood choke
   * @korean 교살잡기
   */
  chokeGrip(timeOffset: number = 0.15, easing: string = "ease-in"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Arm across throat
      kf.rotate(BoneName.SHOULDER_R, -0.4, 0.6, 0.7);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.8);
      kf.rotate(BoneName.WRIST_R, 0.2, 0.3, 0);

      // Hand behind head
      kf.rotate(BoneName.SHOULDER_L, -0.6, 0.5, -0.5);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.9);
      kf.rotate(BoneName.WRIST_L, 0, 0.2, -0.1);

      // Chest against back
      kf.rotate(BoneName.SPINE_UPPER, 0.2, 0.2, 0);
      kf.rotate(BoneName.PELVIS, 0.15, 0.15, 0);

      kf.rotate(BoneName.KNEE_L, -0.3, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.35, 0, 0);

      this.applyHandPose(kf, HAND_POSES.GRAB, "right");
      this.applyHandPose(kf, HAND_POSES.GRAB, "left");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Ground control - Mounted position (마운트)
   * Dominant ground position
   * @korean 마운트
   */
  groundMount(timeOffset: number = 0.2, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Sitting on opponent's torso
      kf.rotate(BoneName.PELVIS, 0.4, 0, 0);
      kf.rotate(BoneName.SPINE_UPPER, 0.15, 0, 0);

      // Hands controlling
      kf.rotate(BoneName.SHOULDER_L, 0.4, 0.3, -0.4);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -0.8);
      kf.rotate(BoneName.SHOULDER_R, 0.4, -0.3, 0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 0.8);

      // Knees wide for base
      kf.rotate(BoneName.HIP_L, 0.8, 0, -0.6);
      kf.rotate(BoneName.KNEE_L, -1.4, 0, 0);
      kf.rotate(BoneName.HIP_R, 0.8, 0, 0.6);
      kf.rotate(BoneName.KNEE_R, -1.4, 0, 0);

      kf.position(BoneName.PELVIS, 0, -0.4, 0);
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

  /**
   * Mid-section block - Standard middle block (중단막기)
   * Arms crossed protecting torso
   * @korean 중단막기
   */
  blockMiddle(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Forearm across body at mid-level
      kf.rotate(BoneName.SHOULDER_L, -0.4, 0.5, -0.5);
      kf.rotate(BoneName.SHOULDER_R, 0.2, 0, 0.3);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -1.1);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.4);

      kf.rotate(BoneName.SPINE_UPPER, 0, -0.15, 0);
      kf.rotate(BoneName.KNEE_L, -0.25, 0, 0);

      this.applyHandPose(kf, HAND_POSES.FIST, "both");
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Knife hand block - Open hand deflection (수도막기)
   * Blade of hand for blocking
   * @korean 수도막기
   */
  blockKnifeHand(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Knife hand position
      kf.rotate(BoneName.SHOULDER_L, -0.5, 0.6, -0.5);
      kf.rotate(BoneName.ELBOW_L, 0, 0, -0.7);
      kf.rotate(BoneName.WRIST_L, -0.3, 0.4, 0);

      // Other hand guards solar plexus
      kf.rotate(BoneName.SHOULDER_R, 0.3, 0.2, 0.4);
      kf.rotate(BoneName.ELBOW_R, 0, 0, 1.3);

      kf.rotate(BoneName.SPINE_UPPER, 0, -0.1, 0);
      kf.rotate(BoneName.KNEE_L, -0.25, 0, 0);

      this.applyHandPose(kf, HAND_POSES.KNIFE_HAND, "left");
      this.applyHandPose(kf, HAND_POSES.KNIFE_HAND, "right");
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
   * Forward step - Advancing stance (전진)
   * Weight transfers forward with lead foot
   * @korean 전진
   */
  forwardStep(timeOffset: number = 0.12, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Lead leg steps forward
      kf.rotate(BoneName.HIP_R, 0.35, 0.1, 0);
      kf.rotate(BoneName.KNEE_R, -0.3, 0, 0);
      kf.rotate(BoneName.FOOT_R, 0.1, 0, 0);

      // Rear leg pushes
      kf.rotate(BoneName.HIP_L, -0.1, 0, 0);
      kf.rotate(BoneName.KNEE_L, -0.15, 0, 0);

      // Body moves forward
      kf.rotate(BoneName.SPINE_UPPER, 0.05, 0, 0);
      kf.position(BoneName.PELVIS, 0, 0, 0.15);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Backward step - Retreating stance (후진)
   * Weight transfers backward with rear foot
   * @korean 후진
   */
  backwardStep(timeOffset: number = 0.12, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Lead leg pulls back
      kf.rotate(BoneName.HIP_R, -0.1, 0, 0);
      kf.rotate(BoneName.KNEE_R, -0.25, 0, 0);

      // Rear leg steps back
      kf.rotate(BoneName.HIP_L, 0.25, 0.1, 0);
      kf.rotate(BoneName.KNEE_L, -0.35, 0, 0);
      kf.rotate(BoneName.FOOT_L, 0.1, 0, 0);

      // Body moves backward
      kf.rotate(BoneName.SPINE_UPPER, -0.05, 0, 0);
      kf.position(BoneName.PELVIS, 0, 0, -0.15);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Side step left - Lateral evasion (좌측이동)
   * Quick lateral movement to the left
   * @korean 좌측이동
   */
  sideStepLeft(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Left leg reaches
      kf.rotate(BoneName.HIP_L, 0.1, 0, -0.3);
      kf.rotate(BoneName.KNEE_L, -0.2, 0, 0);

      // Right leg follows
      kf.rotate(BoneName.HIP_R, 0.05, 0, -0.15);
      kf.rotate(BoneName.KNEE_R, -0.25, 0, 0);

      // Body shifts left
      kf.rotate(BoneName.PELVIS, 0, -0.1, 0);
      kf.position(BoneName.PELVIS, -0.2, 0, 0);
    });
    this.currentTime += timeOffset;
    return this;
  }

  /**
   * Side step right - Lateral evasion (우측이동)
   * Quick lateral movement to the right
   * @korean 우측이동
   */
  sideStepRight(timeOffset: number = 0.1, easing: string = "ease-out"): this {
    this.addKeyframe(this.currentTime + timeOffset, easing, (kf) => {
      // Right leg reaches
      kf.rotate(BoneName.HIP_R, 0.1, 0, 0.3);
      kf.rotate(BoneName.KNEE_R, -0.2, 0, 0);

      // Left leg follows
      kf.rotate(BoneName.HIP_L, 0.05, 0, 0.15);
      kf.rotate(BoneName.KNEE_L, -0.25, 0, 0);

      // Body shifts right
      kf.rotate(BoneName.PELVIS, 0, 0.1, 0);
      kf.position(BoneName.PELVIS, 0.2, 0, 0);
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
   * Apply Korean guard position helper
   *
   * Private helper method to reduce code duplication across guard methods.
   * Applies guard positions to the last keyframe in the animation.
   *
   * @param guardType - Type of guard to apply
   * @param side - Which side to apply ("left" | "right" | "both")
   * @returns this for chaining
   * @korean 한국방어자세적용헬퍼
   * @private
   */
  private applyKoreanGuard(
    guardType: GuardPositionType,
    side: "left" | "right" | "both" = "both",
  ): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (lastKf) {
      const kf = new KeyframeConfig();
      kf.withGuard(guardType, side);

      // Merge rotations into last keyframe
      for (const [bone, rotation] of kf.rotations.entries()) {
        lastKf.boneRotations.set(bone, rotation);
      }

      // Apply fist pose to hands in guard
      this.applyHandPoseToKeyframe(lastKf, HAND_POSES.FIST, side);
    }
    return this;
  }

  /**
   * Apply Korean high guard position (상단막기)
   *
   * Traditional Korean martial arts high guard with hands at temple level
   * protecting head and face. Uses authentic 막기자세 positioning.
   *
   * @param side - Which side to apply ("left" | "right" | "both")
   * @returns this for chaining
   * @korean 상단막기자세
   */
  withKoreanHighGuard(side: "left" | "right" | "both" = "both"): this {
    return this.applyKoreanGuard("HIGH_GUARD", side);
  }

  /**
   * Apply Korean middle guard position (중단막기)
   *
   * Standard Korean martial arts guard at chest/solar plexus level.
   * Most versatile guard position, used in most fighting stances.
   *
   * @param side - Which side to apply ("left" | "right" | "both")
   * @returns this for chaining
   * @korean 중단막기자세
   */
  withKoreanMiddleGuard(side: "left" | "right" | "both" = "both"): this {
    return this.applyKoreanGuard("MIDDLE_GUARD", side);
  }

  /**
   * Apply Korean low guard position (하단막기)
   *
   * Low guard position protecting lower body and groin.
   * Used in grappling and ground-fighting scenarios.
   *
   * @param side - Which side to apply ("left" | "right" | "both")
   * @returns this for chaining
   * @korean 하단막기자세
   */
  withKoreanLowGuard(side: "left" | "right" | "both" = "both"): this {
    return this.applyKoreanGuard("LOW_GUARD", side);
  }

  /**
   * Apply trigram-specific guard pose (팔괘자세)
   *
   * Sets the complete body position for the specified trigram stance,
   * including arms, legs, torso, and pelvis. Unlike generic guards,
   * this applies the authentic Korean martial arts posture for each
   * of the eight trigram stances.
   *
   * Use this for:
   * - Idle stance animations
   * - Returning to guard after techniques
   * - Walk/run animations (arms only mode)
   *
   * @param stance - Trigram stance (e.g., TrigramStance.GEON)
   * @param options - Application options (what body parts to apply)
   * @returns this for chaining
   *
   * @example
   * ```typescript
   * // Full guard pose in idle stance
   * builder.at(0).withTrigramGuard(TrigramStance.GEON);
   *
   * // Arms only for walk animation (legs handled separately)
   * builder.at(0).withTrigramGuard(TrigramStance.TAE, {
   *   includeLegs: false,
   *   includePelvis: false
   * });
   * ```
   *
   * @korean 팔괘방어자세
   */
  withTrigramGuard(stance: TrigramStance, options?: TrigramGuardOptions): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (lastKf) {
      const kf = new KeyframeConfig();
      applyTrigramGuardToConfig(kf, stance, options);

      // Merge rotations into last keyframe
      for (const [bone, rotation] of kf.rotations.entries()) {
        lastKf.boneRotations.set(bone, rotation);
      }

      // Apply fist pose to hands in guard
      this.applyHandPoseToKeyframe(lastKf, HAND_POSES.FIST, "both");
    }
    return this;
  }

  /**
   * Get trigram guard arm positions for locomotion animations
   *
   * Returns the base arm positions for the specified trigram's guard pose.
   * Use this when building walk/run animations that need to maintain
   * the trigram's arm guard while adding swing motion.
   *
   * @param stance - Trigram stance
   * @returns Left and right arm base rotations (shoulder, elbow)
   *
   * @example
   * ```typescript
   * const arms = builder.getTrigramArmGuard(TrigramStance.GEON);
   * // Add swing to left shoulder while keeping guard shape
   * kf.rotate(BoneName.SHOULDER_L,
   *   arms.left.shoulder[0] + swingOffset,
   *   arms.left.shoulder[1],
   *   arms.left.shoulder[2]
   * );
   * ```
   *
   * @korean 팔괘팔자세가져오기
   */
  static getTrigramArmGuard(stance: TrigramStance): {
    left: {
      shoulder: [number, number, number];
      elbow: [number, number, number];
    };
    right: {
      shoulder: [number, number, number];
      elbow: [number, number, number];
    };
  } {
    return getGuardArmBase(stance);
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
    hand: "left" | "right" | "both",
  ): void {
    applyHandPoseToConfig(kf, pose, hand);
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
   * Helper to apply finger rotations from a hand pose to an existing keyframe
   * @internal
   */
  private applyHandPoseToKeyframe(
    kf: AnimationKeyframe,
    pose: (typeof HAND_POSES)[keyof typeof HAND_POSES],
    hand: "left" | "right" | "both",
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
    hand: "left" | "right" | "both" = "both",
  ): void {
    this.applyHandPose(kf, HAND_POSES[pose], hand);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // FOOT POSITIONING (발 위치)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Apply foot positions based on stance width (발너비)
   * Sets left and right foot X positions symmetrically around center
   *
   * @param stanceWidthMultiplier - Multiplier from KOREAN_STANCE_BIOMECHANICS
   * @param shoulderWidth - Fighter's shoulder width in centimeters
   * @korean 발너비적용
   *
   * @example
   * ```typescript
   * // Jin Thunder stance (2.0x shoulder width)
   * .withFootWidth(2.0, 46)  // 0.92m total width
   *
   * // Son Wind stance (0.0x - crane stance)
   * .withFootWidth(0.0, 46)  // 0m - single leg
   * ```
   */
  withFootWidth(stanceWidthMultiplier: number, shoulderWidth: number): this {
    const lastKf = this.keyframes[this.keyframes.length - 1];
    const bonePositions = lastKf?.bonePositions;
    if (bonePositions) {
      // Calculate symmetric foot positions using shared helper
      const totalWidth = calculateStanceWidth(
        stanceWidthMultiplier,
        shoulderWidth,
      );
      const halfWidth = totalWidth / 2;

      // Create new map with existing positions plus foot positions
      const newPositions = new Map<BoneName, THREE.Vector3>();
      bonePositions.forEach((pos, bone) => {
        newPositions.set(bone as BoneName, pos);
      });
      newPositions.set(BoneName.FOOT_L, new THREE.Vector3(-halfWidth, 0, 0));
      newPositions.set(BoneName.FOOT_R, new THREE.Vector3(halfWidth, 0, 0));

      // Replace with new map (cast to writable for assignment)
      (
        lastKf as { bonePositions: ReadonlyMap<BoneName, THREE.Vector3> }
      ).bonePositions = newPositions as ReadonlyMap<BoneName, THREE.Vector3>;
    }
    return this;
  }

  /**
   * Apply foot positions to current keyframe during addKeyframe
   * Inline version for use within keyframe callback
   *
   * @param kf - KeyframeConfig to modify
   * @param stanceWidthMultiplier - Multiplier from KOREAN_STANCE_BIOMECHANICS
   * @param shoulderWidth - Fighter's shoulder width in centimeters
   * @korean 발너비설정
   */
  applyFootPositionsDuring(
    kf: KeyframeConfig,
    stanceWidthMultiplier: number,
    shoulderWidth: number,
  ): void {
    const totalWidth = calculateStanceWidth(
      stanceWidthMultiplier,
      shoulderWidth,
    );
    const halfWidth = totalWidth / 2;

    kf.position(BoneName.FOOT_L, -halfWidth, 0, 0);
    kf.position(BoneName.FOOT_R, halfWidth, 0, 0);
  }

  // ═══════════════════════════════════════════════════════════════════════
  // RECOVERY & COMMON (복귀 & 공통)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Recover to fighting guard (복귀)
   * Returns to neutral stance with torso reset
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
      // Reset spine and pelvis to neutral
      kf.rotate(BoneName.PELVIS, 0, 0, 0);
      this.resetTorsoRotation(kf);
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
  // TORSO ROTATION HELPERS (허리비틀기 도우미)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Apply torso rotation for straight punch power generation (주먹허리비틀기)
   *
   * Korean martial arts principle: 허리비틀기 (Heori Biteulgi) - Waist twist for power
   * The torso rotates OPPOSITE to the punch direction, creating torque through
   * the spine that transfers power into the strike.
   *
   * Biomechanics:
   * - SPINE_LOWER rotates 50% of target angle (foundation rotation)
   * - SPINE_MIDDLE rotates 70% of target angle (power transfer zone)
   * - SPINE_UPPER rotates 100% of target angle (maximum rotation at shoulders)
   *
   * @param kf - KeyframeConfig to apply rotation to
   * @param side - Which hand is punching ("left" | "right")
   * @param rotationDegrees - Target rotation in degrees (15-25° recommended)
   *
   * @example
   * ```typescript
   * // Right cross with 20° counter-rotation
   * this.addKeyframe(0.35, "ease-out", (kf) => {
   *   this.applyPunchTorsoRotation(kf, "right", 20);
   *   // ... other punch mechanics
   * });
   * ```
   *
   * @korean 주먹허리비틀기
   */
  private applyPunchTorsoRotation(
    kf: KeyframeConfig,
    side: "left" | "right",
    rotationDegrees: number,
  ): void {
    const isRight = side === "right";
    // Punch rotates torso OPPOSITE to punch direction for power
    const direction = isRight ? 1 : -1;
    const rotationRad = (rotationDegrees * Math.PI) / 180;

    // Get existing spine rotations if any (from applyPunchPhaseToConfig)
    const existingUpper = kf.rotations.get(BoneName.SPINE_UPPER);
    const existingMiddle = kf.rotations.get(BoneName.SPINE_MIDDLE);
    const existingLower = kf.rotations.get(BoneName.SPINE_LOWER);

    // Sequential spine rotation (lower → mid → upper)
    // Combine with existing Y-axis rotations
    kf.rotate(
      BoneName.SPINE_LOWER,
      existingLower?.x ?? 0,
      (existingLower?.y ?? 0) + rotationRad * direction * 0.5,
      existingLower?.z ?? 0,
    );
    kf.rotate(
      BoneName.SPINE_MIDDLE,
      existingMiddle?.x ?? 0,
      (existingMiddle?.y ?? 0) + rotationRad * direction * 0.7,
      existingMiddle?.z ?? 0,
    );
    kf.rotate(
      BoneName.SPINE_UPPER,
      existingUpper?.x ?? 0,
      (existingUpper?.y ?? 0) + rotationRad * direction,
      existingUpper?.z ?? 0,
    );
  }

  /**
   * Apply torso rotation for hook punch circular power (훅허리비틀기)
   *
   * Korean martial arts principle: 몸통회전 (Momtong Hoejeon) - Full torso rotation
   * Hook punches generate power from hip and shoulder rotation in a circular motion.
   * Larger rotation angle (45-60°) creates the circular arc needed for hooks.
   *
   * Biomechanics:
   * - SPINE_LOWER rotates 50% (hip engagement)
   * - SPINE_MIDDLE rotates 70% (core power transfer)
   * - SPINE_UPPER rotates 100% (shoulder whip into target)
   *
   * @param kf - KeyframeConfig to apply rotation to
   * @param side - Which hand is hooking ("left" | "right")
   * @param rotationDegrees - Target rotation in degrees (45-60° recommended)
   *
   * @example
   * ```typescript
   * // Right hook with 50° rotation
   * this.addKeyframe(0.30, "ease-out", (kf) => {
   *   this.applyHookTorsoRotation(kf, "right", 50);
   *   // ... other hook mechanics
   * });
   * ```
   *
   * @korean 훅허리비틀기
   */
  private applyHookTorsoRotation(
    kf: KeyframeConfig,
    side: "left" | "right",
    rotationDegrees: number,
  ): void {
    const isRight = side === "right";
    // Hook rotates torso INTO the punch for circular power
    const direction = isRight ? -1 : 1;
    const rotationRad = (rotationDegrees * Math.PI) / 180;

    // Get existing spine rotations if any and preserve X/Z axes
    const existingLower = kf.rotations.get(BoneName.SPINE_LOWER);
    const existingMiddle = kf.rotations.get(BoneName.SPINE_MIDDLE);
    const existingUpper = kf.rotations.get(BoneName.SPINE_UPPER);

    // Sequential spine rotation for circular motion, combining with existing rotations
    kf.rotate(
      BoneName.SPINE_LOWER,
      existingLower?.x ?? 0,
      (existingLower?.y ?? 0) + rotationRad * direction * 0.5,
      existingLower?.z ?? 0,
    );
    kf.rotate(
      BoneName.SPINE_MIDDLE,
      existingMiddle?.x ?? 0,
      (existingMiddle?.y ?? 0) + rotationRad * direction * 0.7,
      existingMiddle?.z ?? 0,
    );
    kf.rotate(
      BoneName.SPINE_UPPER,
      existingUpper?.x ?? 0,
      (existingUpper?.y ?? 0) + rotationRad * direction,
      existingUpper?.z ?? 0,
    );
  }

  /**
   * Apply torso lean for kick balance (차기허리기울이기)
   *
   * Korean martial arts principle: 중심축회전 (Jungsim Chuk Hoejeon) - Central axis rotation
   * When executing kicks, the torso leans AWAY from the kicking leg to:
   * 1. Maintain balance on the support leg
   * 2. Increase reach by extending the kick further
   * 3. Prevent falling backward during high kicks
   *
   * Biomechanics:
   * - SPINE_LOWER leans away from kick (foundation)
   * - SPINE_MIDDLE leans with lower spine (stability)
   * - SPINE_UPPER leans slightly less (control)
   *
   * @param kf - KeyframeConfig to apply lean to
   * @param side - Which leg is kicking ("left" | "right")
   * @param leanDegrees - Amount of lean in degrees (10-20° recommended)
   *
   * @example
   * ```typescript
   * // Right roundhouse kick with compensatory lean
   * this.addKeyframe(0.35, "ease-out", (kf) => {
   *   this.applyKickTorsoLean(kf, "right", 15);
   *   // ... other kick mechanics
   * });
   * ```
   *
   * @korean 차기허리기울이기
   */
  private applyKickTorsoLean(
    kf: KeyframeConfig,
    side: "left" | "right",
    leanDegrees: number,
  ): void {
    const isRight = side === "right";
    // Lean AWAY from kicking leg (left kick = lean right, right kick = lean left)
    const direction = isRight ? -1 : 1;
    const leanRad = (leanDegrees * Math.PI) / 180;

    // Lateral lean on Z-axis (side-to-side roll) for torso balance.
    // NOTE: This method only sets the Z-axis roll component. Any subsequent kf.rotate
    // calls on these spine bones (e.g. adding Y-axis twist in a kick phase) must
    // preserve or explicitly incorporate this roll, otherwise the lean will be lost.
    kf.rotate(BoneName.SPINE_LOWER, 0, 0, leanRad * direction * 0.9);
    kf.rotate(BoneName.SPINE_MIDDLE, 0, 0, leanRad * direction * 0.7);
    kf.rotate(BoneName.SPINE_UPPER, 0, 0, leanRad * direction * 0.5);
  }

  /**
   * Reset torso to neutral position (허리중립)
   *
   * Returns all spine bones to neutral rotation (0, 0, 0).
   * Used during recovery phases to return to fighting stance.
   *
   * @param kf - KeyframeConfig to reset
   *
   * @korean 허리중립
   */
  private resetTorsoRotation(kf: KeyframeConfig): void {
    kf.rotate(BoneName.SPINE_LOWER, 0, 0, 0);
    kf.rotate(BoneName.SPINE_MIDDLE, 0, 0, 0);
    kf.rotate(BoneName.SPINE_UPPER, 0, 0, 0);
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
    configure: (kf: KeyframeConfig) => void,
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
