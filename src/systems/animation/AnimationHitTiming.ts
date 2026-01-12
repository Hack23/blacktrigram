/**
 * Animation Hit Timing System
 * 
 * **Korean**: 애니메이션 타격 타이밍
 * 
 * Defines when visual contact occurs in animations for reality-based hit detection.
 * Hits should only register when the animation visually shows limb contact with target.
 * 
 * ## Philosophy
 * 
 * Black Trigram emphasizes visual authenticity in combat. Hit detection must align
 * with what the player sees on screen. This system defines the exact frames/timing
 * when each technique's strike phase visually connects.
 * 
 * ## Phases
 * 
 * Korean martial arts techniques have distinct phases:
 * - **준비 (Chamber)**: Wind-up, no contact possible
 * - **실행 (Extension)**: Strike extending, contact window opens
 * - **정점 (Peak)**: Maximum extension, highest contact probability
 * - **회수 (Retraction)**: Pulling back, contact window closes
 * - **복귀 (Recovery)**: Return to stance, no contact
 * 
 * @module systems/animation/AnimationHitTiming
 * @category Animation System
 * @korean 애니메이션타격타이밍
 */

import { AnimationType } from "./MartialArtsAnimationBuilder";

/**
 * Hit window timing for a technique animation.
 * 
 * **Korean**: 타격 창 타이밍
 * 
 * Defines when during an animation the technique can actually make contact.
 * Based on visual reach during the extension phase.
 * 
 * @example
 * ```typescript
 * const jabTiming: AnimationHitWindow = {
 *   startTime: 0.10,      // Hit window opens at 100ms (after chamber)
 *   peakTime: 0.15,       // Peak extension at 150ms
 *   endTime: 0.20,        // Hit window closes at 200ms (before retraction)
 *   maxReachMultiplier: 1.0, // 100% of limb length at peak
 * };
 * ```
 * 
 * @public
 * @korean 타격창타이밍
 */
export interface AnimationHitWindow {
  /**
   * Time when hit window opens (seconds).
   * Start of extension phase where limb begins moving toward target.
   * @korean 시작시간
   */
  readonly startTime: number;
  
  /**
   * Time of maximum extension (seconds).
   * Peak of strike where reach is maximum and damage is highest.
   * @korean 정점시간
   */
  readonly peakTime: number;
  
  /**
   * Time when hit window closes (seconds).
   * End of extension phase where limb begins retracting.
   * @korean 종료시간
   */
  readonly endTime: number;
  
  /**
   * Reach multiplier at peak extension (0.0 - 1.5).
   * - 1.0 = full limb extension (standard strikes)
   * - 0.7 = partial extension (close-range techniques)
   * - 1.2+ = overextended (special techniques, jumping kicks)
   * @korean 최대도달배수
   */
  readonly maxReachMultiplier: number;
  
  /**
   * Optional reach curve during hit window.
   * If not provided, assumes linear interpolation from 0 to maxReachMultiplier.
   * @korean 도달곡선
   */
  readonly reachCurve?: (normalizedTime: number) => number;
}

/**
 * Complete hit timing configuration for a technique.
 * 
 * **Korean**: 기술 타격 타이밍 설정
 * 
 * @public
 * @korean 기술타격타이밍
 */
export interface TechniqueHitTiming {
  /**
   * Animation type this timing applies to.
   * @korean 애니메이션타입
   */
  readonly animationType: AnimationType;
  
  /**
   * Hit window configuration.
   * @korean 타격창
   */
  readonly hitWindow: AnimationHitWindow;
  
  /**
   * Whether this technique requires precise timing (true) or has a wider window (false).
   * Affects forgiveness in hit detection.
   * @korean 정밀타이밍필요
   */
  readonly requiresPreciseTiming: boolean;
}

/**
 * Hit timing database for animation types.
 * 
 * **Korean**: 애니메이션 타격 타이밍 데이터베이스
 * 
 * Based on TECHNIQUE_TIMING constants from MartialArtsAnimationBuilder.
 * Only includes timing for techniques with actual hit windows.
 * Movement and non-combat animations can query this and will get undefined.
 * 
 * @public
 * @korean 애니메이션타격타이밍데이터베이스
 */
export const ANIMATION_HIT_TIMING: Partial<Record<AnimationType, TechniqueHitTiming>> = {
  // ═══════════════════════════════════════════════════════════════════════
  // PUNCH TECHNIQUES (주먹 기술)
  // ═══════════════════════════════════════════════════════════════════════
  
  [AnimationType.JAB]: {
    animationType: AnimationType.JAB,
    hitWindow: {
      startTime: 0.10,   // Chamber: 100ms, Extension starts
      peakTime: 0.15,    // Peak at 150ms (midpoint of 150ms extension)
      endTime: 0.25,     // Retraction starts at 250ms
      maxReachMultiplier: 0.95, // Jabs don't fully extend (speed > reach)
    },
    requiresPreciseTiming: false, // Fast technique with forgiving window
  },
  
  [AnimationType.CROSS]: {
    animationType: AnimationType.CROSS,
    hitWindow: {
      startTime: 0.15,   // Longer chamber for power
      peakTime: 0.25,    // Peak at 250ms
      endTime: 0.35,     // Window closes at 350ms
      maxReachMultiplier: 1.0, // Full extension for power
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.HOOK]: {
    animationType: AnimationType.HOOK,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.25,
      endTime: 0.35,
      maxReachMultiplier: 0.85, // Hooks are shorter range (arc motion)
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.UPPERCUT]: {
    animationType: AnimationType.UPPERCUT,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.25,
      endTime: 0.35,
      maxReachMultiplier: 0.7, // Close-range technique
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.OVERHAND]: {
    animationType: AnimationType.OVERHAND,
    hitWindow: {
      startTime: 0.20,
      peakTime: 0.30,
      endTime: 0.42,
      maxReachMultiplier: 1.1, // Longer reach from arc
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.BACKFIST]: {
    animationType: AnimationType.BACKFIST,
    hitWindow: {
      startTime: 0.12,
      peakTime: 0.18,
      endTime: 0.27,
      maxReachMultiplier: 0.9, // Snapping technique
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.HAMMER_FIST]: {
    animationType: AnimationType.HAMMER_FIST,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.25,
      endTime: 0.35,
      maxReachMultiplier: 0.85,
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.PALM_STRIKE]: {
    animationType: AnimationType.PALM_STRIKE,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.25,
      endTime: 0.35,
      maxReachMultiplier: 1.0,
    },
    requiresPreciseTiming: false,
  },
  
  // ═══ Specialized Punch Variants ═══
  
  [AnimationType.SPEAR_HAND_STRIKE]: {
    animationType: AnimationType.SPEAR_HAND_STRIKE,
    hitWindow: {
      startTime: 0.08,
      peakTime: 0.13,
      endTime: 0.20,
      maxReachMultiplier: 1.05, // Extended fingers add reach
    },
    requiresPreciseTiming: true, // Precise targeting required
  },
  
  [AnimationType.NERVE_STRIKE]: {
    animationType: AnimationType.NERVE_STRIKE,
    hitWindow: {
      startTime: 0.10,
      peakTime: 0.15,
      endTime: 0.22,
      maxReachMultiplier: 0.9,
    },
    requiresPreciseTiming: true, // Must hit exact nerve point
  },
  
  [AnimationType.PRESSURE_POINT_STRIKE]: {
    animationType: AnimationType.PRESSURE_POINT_STRIKE,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.25,
      endTime: 0.32,
      maxReachMultiplier: 0.85,
    },
    requiresPreciseTiming: true, // Precise pressure point targeting
  },
  
  [AnimationType.LIGHTNING_STRIKE]: {
    animationType: AnimationType.LIGHTNING_STRIKE,
    hitWindow: {
      startTime: 0.06,
      peakTime: 0.10,
      endTime: 0.15,
      maxReachMultiplier: 0.95,
    },
    requiresPreciseTiming: true, // Very fast, small window
  },
  
  [AnimationType.RAPID_BARRAGE]: {
    animationType: AnimationType.RAPID_BARRAGE,
    hitWindow: {
      startTime: 0.05,
      peakTime: 0.12,
      endTime: 0.20,
      maxReachMultiplier: 0.85, // Multiple hits, shorter reach each
    },
    requiresPreciseTiming: false, // Volume of strikes compensates
  },
  
  [AnimationType.RHYTHMIC_STRIKES]: {
    animationType: AnimationType.RHYTHMIC_STRIKES,
    hitWindow: {
      startTime: 0.08,
      peakTime: 0.15,
      endTime: 0.25,
      maxReachMultiplier: 0.9,
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.NERVE_PARALYSIS]: {
    animationType: AnimationType.NERVE_PARALYSIS,
    hitWindow: {
      startTime: 0.12,
      peakTime: 0.20,
      endTime: 0.28,
      maxReachMultiplier: 0.85,
    },
    requiresPreciseTiming: true,
  },
  
  [AnimationType.THROAT_STRIKE]: {
    animationType: AnimationType.THROAT_STRIKE,
    hitWindow: {
      startTime: 0.10,
      peakTime: 0.15,
      endTime: 0.22,
      maxReachMultiplier: 0.95,
    },
    requiresPreciseTiming: true, // Must hit throat precisely
  },
  
  [AnimationType.EYE_GOUGE]: {
    animationType: AnimationType.EYE_GOUGE,
    hitWindow: {
      startTime: 0.08,
      peakTime: 0.12,
      endTime: 0.18,
      maxReachMultiplier: 0.8, // Very close range
    },
    requiresPreciseTiming: true, // Extremely precise target
  },
  
  [AnimationType.HEAVEN_STRIKE]: {
    animationType: AnimationType.HEAVEN_STRIKE,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.25,
      endTime: 0.35,
      maxReachMultiplier: 1.1, // Powerful extension
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.FLOWING_CROSS]: {
    animationType: AnimationType.FLOWING_CROSS,
    hitWindow: {
      startTime: 0.12,
      peakTime: 0.22,
      endTime: 0.32,
      maxReachMultiplier: 1.0,
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.SOLAR_PLEXUS_STRIKE]: {
    animationType: AnimationType.SOLAR_PLEXUS_STRIKE,
    hitWindow: {
      startTime: 0.12,
      peakTime: 0.20,
      endTime: 0.28,
      maxReachMultiplier: 0.95,
    },
    requiresPreciseTiming: true, // Must hit solar plexus
  },
  
  [AnimationType.FLOWING_PUSH]: {
    animationType: AnimationType.FLOWING_PUSH,
    hitWindow: {
      startTime: 0.12,
      peakTime: 0.20,
      endTime: 0.30,
      maxReachMultiplier: 1.0,
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.LIVER_DISRUPTION]: {
    animationType: AnimationType.LIVER_DISRUPTION,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.25,
      endTime: 0.33,
      maxReachMultiplier: 0.9,
    },
    requiresPreciseTiming: true, // Must hit liver
  },
  
  [AnimationType.EAR_STRIKE]: {
    animationType: AnimationType.EAR_STRIKE,
    hitWindow: {
      startTime: 0.10,
      peakTime: 0.16,
      endTime: 0.24,
      maxReachMultiplier: 0.85,
    },
    requiresPreciseTiming: true, // Must hit ear precisely
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // KICK TECHNIQUES (발차기 기술)
  // ═══════════════════════════════════════════════════════════════════════
  
  [AnimationType.FRONT_KICK]: {
    animationType: AnimationType.FRONT_KICK,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.27,
      endTime: 0.40,
      maxReachMultiplier: 1.0, // Full leg extension
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.ROUNDHOUSE_KICK]: {
    animationType: AnimationType.ROUNDHOUSE_KICK,
    hitWindow: {
      startTime: 0.20,
      peakTime: 0.32,
      endTime: 0.48,
      maxReachMultiplier: 1.05, // Slight overextension at peak
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.SIDE_KICK]: {
    animationType: AnimationType.SIDE_KICK,
    hitWindow: {
      startTime: 0.20,
      peakTime: 0.35,
      endTime: 0.50,
      maxReachMultiplier: 1.1, // Maximum reach technique
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.BACK_KICK]: {
    animationType: AnimationType.BACK_KICK,
    hitWindow: {
      startTime: 0.25,
      peakTime: 0.40,
      endTime: 0.55,
      maxReachMultiplier: 1.15, // Powerful extension backward
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.AXE_KICK]: {
    animationType: AnimationType.AXE_KICK,
    hitWindow: {
      startTime: 0.25,
      peakTime: 0.45,
      endTime: 0.65,
      maxReachMultiplier: 1.2, // High vertical reach
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.CRESCENT_KICK]: {
    animationType: AnimationType.CRESCENT_KICK,
    hitWindow: {
      startTime: 0.18,
      peakTime: 0.32,
      endTime: 0.48,
      maxReachMultiplier: 1.0,
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.LOW_KICK]: {
    animationType: AnimationType.LOW_KICK,
    hitWindow: {
      startTime: 0.12,
      peakTime: 0.22,
      endTime: 0.35,
      maxReachMultiplier: 0.95, // Lower target, less extension
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.PUSH_KICK]: {
    animationType: AnimationType.PUSH_KICK,
    hitWindow: {
      startTime: 0.12,
      peakTime: 0.22,
      endTime: 0.35,
      maxReachMultiplier: 1.0,
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.JUMPING_KICK]: {
    animationType: AnimationType.JUMPING_KICK,
    hitWindow: {
      startTime: 0.30,
      peakTime: 0.45,
      endTime: 0.60,
      maxReachMultiplier: 1.3, // Airborne extension
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.SPINNING_HEEL_KICK]: {
    animationType: AnimationType.SPINNING_HEEL_KICK,
    hitWindow: {
      startTime: 0.40,
      peakTime: 0.60,
      endTime: 0.80,
      maxReachMultiplier: 1.15, // Spinning adds reach
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.TORNADO_KICK]: {
    animationType: AnimationType.TORNADO_KICK,
    hitWindow: {
      startTime: 0.45,
      peakTime: 0.65,
      endTime: 0.85,
      maxReachMultiplier: 1.25, // Jumping + spinning
    },
    requiresPreciseTiming: false,
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // ELBOW & KNEE TECHNIQUES (팔꿈치 & 무릎 기술)
  // ═══════════════════════════════════════════════════════════════════════
  
  [AnimationType.ELBOW_STRIKE]: {
    animationType: AnimationType.ELBOW_STRIKE,
    hitWindow: {
      startTime: 0.10,
      peakTime: 0.18,
      endTime: 0.28,
      maxReachMultiplier: 0.5, // Very close range
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.ELBOW_UPPERCUT]: {
    animationType: AnimationType.ELBOW_UPPERCUT,
    hitWindow: {
      startTime: 0.12,
      peakTime: 0.22,
      endTime: 0.32,
      maxReachMultiplier: 0.45, // Close range upward
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.SPINNING_ELBOW]: {
    animationType: AnimationType.SPINNING_ELBOW,
    hitWindow: {
      startTime: 0.30,
      peakTime: 0.50,
      endTime: 0.70,
      maxReachMultiplier: 0.6, // Spinning adds slight reach
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.TEMPLE_ELBOW]: {
    animationType: AnimationType.TEMPLE_ELBOW,
    hitWindow: {
      startTime: 0.10,
      peakTime: 0.18,
      endTime: 0.26,
      maxReachMultiplier: 0.5,
    },
    requiresPreciseTiming: true, // Must hit temple
  },
  
  [AnimationType.SPINNING_BACK_ELBOW]: {
    animationType: AnimationType.SPINNING_BACK_ELBOW,
    hitWindow: {
      startTime: 0.28,
      peakTime: 0.45,
      endTime: 0.62,
      maxReachMultiplier: 0.55,
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.SPINAL_ELBOW]: {
    animationType: AnimationType.SPINAL_ELBOW,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.25,
      endTime: 0.35,
      maxReachMultiplier: 0.5,
    },
    requiresPreciseTiming: true, // Must hit spine
  },
  
  [AnimationType.BRACHIAL_ELBOW]: {
    animationType: AnimationType.BRACHIAL_ELBOW,
    hitWindow: {
      startTime: 0.10,
      peakTime: 0.18,
      endTime: 0.26,
      maxReachMultiplier: 0.5,
    },
    requiresPreciseTiming: true, // Must hit brachial plexus
  },
  
  [AnimationType.KNEE_STRIKE]: {
    animationType: AnimationType.KNEE_STRIKE,
    hitWindow: {
      startTime: 0.12,
      peakTime: 0.22,
      endTime: 0.35,
      maxReachMultiplier: 0.4, // Very close range
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.FLYING_KNEE]: {
    animationType: AnimationType.FLYING_KNEE,
    hitWindow: {
      startTime: 0.25,
      peakTime: 0.40,
      endTime: 0.55,
      maxReachMultiplier: 0.65, // Jumping adds reach
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.KIDNEY_KNEE]: {
    animationType: AnimationType.KIDNEY_KNEE,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.25,
      endTime: 0.35,
      maxReachMultiplier: 0.4,
    },
    requiresPreciseTiming: true, // Must hit kidney
  },
  
  [AnimationType.FEMORAL_KNEE]: {
    animationType: AnimationType.FEMORAL_KNEE,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.25,
      endTime: 0.35,
      maxReachMultiplier: 0.4,
    },
    requiresPreciseTiming: true, // Must hit femoral artery
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // GRAPPLING TECHNIQUES (잡기 기술)
  // ═══════════════════════════════════════════════════════════════════════
  
  [AnimationType.THROW]: {
    animationType: AnimationType.THROW,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.35,
      endTime: 0.55,
      maxReachMultiplier: 0.7, // Must be close to grab
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.GRAPPLE]: {
    animationType: AnimationType.GRAPPLE,
    hitWindow: {
      startTime: 0.10,
      peakTime: 0.30,
      endTime: 0.50,
      maxReachMultiplier: 0.8, // Reach to grab
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.SWEEP]: {
    animationType: AnimationType.SWEEP,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.30,
      endTime: 0.45,
      maxReachMultiplier: 0.9, // Low sweep
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.SLAM]: {
    animationType: AnimationType.SLAM,
    hitWindow: {
      startTime: 0.20,
      peakTime: 0.40,
      endTime: 0.60,
      maxReachMultiplier: 0.7,
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.WRIST_LOCK]: {
    animationType: AnimationType.WRIST_LOCK,
    hitWindow: {
      startTime: 0.10,
      peakTime: 0.25,
      endTime: 0.40,
      maxReachMultiplier: 0.75,
    },
    requiresPreciseTiming: true, // Must grab wrist
  },
  
  [AnimationType.ARM_BAR]: {
    animationType: AnimationType.ARM_BAR,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.35,
      endTime: 0.55,
      maxReachMultiplier: 0.8,
    },
    requiresPreciseTiming: true, // Must control arm
  },
  
  [AnimationType.SHOULDER_LOCK]: {
    animationType: AnimationType.SHOULDER_LOCK,
    hitWindow: {
      startTime: 0.12,
      peakTime: 0.30,
      endTime: 0.48,
      maxReachMultiplier: 0.75,
    },
    requiresPreciseTiming: true, // Must control shoulder
  },
  
  [AnimationType.HIP_THROW]: {
    animationType: AnimationType.HIP_THROW,
    hitWindow: {
      startTime: 0.18,
      peakTime: 0.38,
      endTime: 0.58,
      maxReachMultiplier: 0.7,
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.LEG_REAP]: {
    animationType: AnimationType.LEG_REAP,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.30,
      endTime: 0.45,
      maxReachMultiplier: 0.85,
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.SMALL_CIRCLE_LOCK]: {
    animationType: AnimationType.SMALL_CIRCLE_LOCK,
    hitWindow: {
      startTime: 0.12,
      peakTime: 0.28,
      endTime: 0.44,
      maxReachMultiplier: 0.7,
    },
    requiresPreciseTiming: true, // Hapkido precision
  },
  
  [AnimationType.FINGER_LOCK]: {
    animationType: AnimationType.FINGER_LOCK,
    hitWindow: {
      startTime: 0.10,
      peakTime: 0.23,
      endTime: 0.36,
      maxReachMultiplier: 0.75,
    },
    requiresPreciseTiming: true, // Must grab fingers
  },
  
  [AnimationType.ELBOW_LOCK]: {
    animationType: AnimationType.ELBOW_LOCK,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.32,
      endTime: 0.49,
      maxReachMultiplier: 0.8,
    },
    requiresPreciseTiming: true, // Must control elbow
  },
  
  [AnimationType.SHOULDER_MANIPULATION]: {
    animationType: AnimationType.SHOULDER_MANIPULATION,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.32,
      endTime: 0.49,
      maxReachMultiplier: 0.75,
    },
    requiresPreciseTiming: true,
  },
  
  [AnimationType.MOUNTAIN_LOCK]: {
    animationType: AnimationType.MOUNTAIN_LOCK,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.32,
      endTime: 0.49,
      maxReachMultiplier: 0.75,
    },
    requiresPreciseTiming: true,
  },
  
  [AnimationType.EARTH_EMBRACE]: {
    animationType: AnimationType.EARTH_EMBRACE,
    hitWindow: {
      startTime: 0.18,
      peakTime: 0.40,
      endTime: 0.62,
      maxReachMultiplier: 0.8,
    },
    requiresPreciseTiming: false,
  },
  
  [AnimationType.TAKEDOWN]: {
    animationType: AnimationType.TAKEDOWN,
    hitWindow: {
      startTime: 0.15,
      peakTime: 0.35,
      endTime: 0.55,
      maxReachMultiplier: 0.75,
    },
    requiresPreciseTiming: false,
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // DEFENSIVE TECHNIQUES (방어 기술)
  // ═══════════════════════════════════════════════════════════════════════
  
  [AnimationType.BLOCK]: {
    animationType: AnimationType.BLOCK,
    hitWindow: {
      startTime: 0.03,
      peakTime: 0.05,
      endTime: 0.08,
      maxReachMultiplier: 0.6, // Arms defending
    },
    requiresPreciseTiming: true, // Must time block correctly
  },
  
  [AnimationType.PARRY]: {
    animationType: AnimationType.PARRY,
    hitWindow: {
      startTime: 0.03,
      peakTime: 0.06,
      endTime: 0.10,
      maxReachMultiplier: 0.7,
    },
    requiresPreciseTiming: true, // Precise deflection
  },
  
  [AnimationType.COUNTER_STRIKE]: {
    animationType: AnimationType.COUNTER_STRIKE,
    hitWindow: {
      startTime: 0.08,
      peakTime: 0.15,
      endTime: 0.25,
      maxReachMultiplier: 0.9, // Counter-strike reach
    },
    requiresPreciseTiming: true, // Timing critical for counters
  },
};

/**
 * Get hit timing configuration for an animation type.
 * 
 * **Korean**: 애니메이션 타격 타이밍 가져오기
 * 
 * @param animationType - Animation type to get timing for
 * @returns Hit timing configuration, or undefined if not a combat animation
 * 
 * @example
 * ```typescript
 * const jabTiming = getAnimationHitTiming(AnimationType.JAB);
 * if (jabTiming) {
 *   console.log(`Jab hit window: ${jabTiming.hitWindow.startTime}s - ${jabTiming.hitWindow.endTime}s`);
 * }
 * ```
 * 
 * @public
 * @korean 애니메이션타격타이밍가져오기
 */
export function getAnimationHitTiming(animationType: AnimationType): TechniqueHitTiming | undefined {
  return ANIMATION_HIT_TIMING[animationType];
}

/**
 * Check if a technique can hit at the given animation time.
 * 
 * **Korean**: 타격 가능 시간 확인
 * 
 * @param animationType - Animation type
 * @param currentTime - Current time in animation (seconds)
 * @returns True if within hit window
 * 
 * @example
 * ```typescript
 * const canHit = isWithinHitWindow(AnimationType.JAB, 0.15);
 * // Returns true (0.15s is within jab's 0.10-0.25s window)
 * ```
 * 
 * @public
 * @korean 타격가능시간확인
 */
export function isWithinHitWindow(
  animationType: AnimationType,
  currentTime: number
): boolean {
  const timing = ANIMATION_HIT_TIMING[animationType];
  if (!timing) {
    // Not a combat animation (movement, stance change, etc.)
    return false;
  }
  const { startTime, endTime } = timing.hitWindow;
  return currentTime >= startTime && currentTime <= endTime;
}

/**
 * Calculate current reach multiplier at a specific time in the animation.
 * 
 * **Korean**: 현재 도달 배수 계산
 * 
 * @param animationType - Animation type
 * @param currentTime - Current time in animation (seconds)
 * @returns Reach multiplier (0.0 - max), or 0 if outside hit window
 * 
 * @example
 * ```typescript
 * const reach = getCurrentReachMultiplier(AnimationType.JAB, 0.15);
 * // Returns 0.95 (jab at peak time)
 * 
 * const noReach = getCurrentReachMultiplier(AnimationType.JAB, 0.05);
 * // Returns 0 (before hit window starts)
 * ```
 * 
 * @public
 * @korean 현재도달배수계산
 */
export function getCurrentReachMultiplier(
  animationType: AnimationType,
  currentTime: number
): number {
  const timing = ANIMATION_HIT_TIMING[animationType];
  if (!timing) {
    // Not a combat animation
    return 0;
  }
  const { startTime, peakTime, endTime, maxReachMultiplier, reachCurve } = timing.hitWindow;
  
  // Outside hit window
  if (currentTime < startTime || currentTime > endTime) {
    return 0;
  }
  
  // Normalize time within hit window (0 = start, 0.5 = peak, 1 = end)
  let normalizedTime: number;
  if (currentTime <= peakTime) {
    // Start to peak (0 to 0.5)
    normalizedTime = 0.5 * ((currentTime - startTime) / (peakTime - startTime));
  } else {
    // Peak to end (0.5 to 1)
    normalizedTime = 0.5 + 0.5 * ((currentTime - peakTime) / (endTime - peakTime));
  }
  
  // Apply reach curve if provided, otherwise use simple interpolation
  if (reachCurve) {
    return maxReachMultiplier * reachCurve(normalizedTime);
  }
  
  // Default: Peak at center (0.5), taper off at edges
  // Use smooth curve: 1 - (2 * normalizedTime - 1)^2
  const peakFactor = 1 - Math.pow(2 * normalizedTime - 1, 2);
  return maxReachMultiplier * peakFactor;
}
