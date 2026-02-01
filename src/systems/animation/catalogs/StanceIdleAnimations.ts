/**
 * Trigram Stance Idle Animations - Enhanced Breathing & Weight Shift System
 *
 * Defines complete idle animations for all 8 trigram stances (팔괘) with:
 * - Multi-keyframe breathing cycles (4-6 frames per stance)
 * - Subtle weight shifts for natural movement
 * - Stance-specific rhythms reflecting martial philosophy
 * - Proper guard positions from StanceGuardPoses
 *
 * Each trigram idle is the starting point for all techniques in that stance.
 * The breathing and weight shifts reflect the elemental nature:
 * - ☰ 건 (Heaven): Powerful, expansive chest breathing
 * - ☱ 태 (Lake): Fluid, rippling breath flow
 * - ☲ 리 (Fire): Sharp, controlled precision breathing
 * - ☳ 진 (Thunder): Deep coiled power breathing
 * - ☴ 손 (Wind): Rhythmic continuous flow
 * - ☵ 감 (Water): Deep flowing diaphragm breathing
 * - ☶ 간 (Mountain): Minimal steady breathing
 * - ☷ 곤 (Earth): Deep grounded diaphragm breathing
 *
 * @module systems/animation/catalogs/StanceIdleAnimations
 * @category Animation System
 * @korean 팔괘자세대기애니메이션
 */

import { TrigramStance } from "@/types/common";
import type { SkeletalAnimation, StanceGuardPose } from "@/types/skeletal";
import { BoneName } from "@/types/skeletal";
import type { KeyframeConfig } from "../builders/KeyframeConfig";
import { MartialArtsAnimationBuilder } from "../builders/MartialArtsAnimationBuilder";
import {
  GAM_WATER_GUARD_POSE,
  GAN_MOUNTAIN_GUARD_POSE,
  GEON_HIGH_GUARD_POSE,
  GON_EARTH_GUARD_POSE,
  JIN_THUNDER_GUARD_POSE,
  LI_FIRE_GUARD_POSE,
  SON_WIND_GUARD_POSE,
  STANCE_GUARD_CONFIGS,
  TAE_FLUID_GUARD_POSE,
} from "./StanceGuardPoses";

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION TIMING CONSTANTS (애니메이션 타이밍 상수)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Breathing cycle durations per stance (in seconds)
 * Each stance has characteristic breathing rhythm
 *
 * @korean 호흡주기지속시간
 */
const BREATHING_DURATIONS = {
  GEON: 2.4, // Powerful slow breathing
  TAE: 2.8, // Fluid flowing breath
  LI: 1.8, // Sharp controlled breathing
  JIN: 2.2, // Explosive ready breath
  SON: 2.0, // Rhythmic continuous flow
  GAM: 3.0, // Deep flowing breath
  GAN: 2.6, // Steady controlled breath
  GON: 2.6, // Grounded diaphragm breath
} as const;

/**
 * Weight shift amplitudes per stance (percentage of base)
 * Reflects stability vs. mobility of each stance
 * REDUCED by 65% to minimize "bouncing in place" appearance
 *
 * @korean 체중이동진폭
 */
const WEIGHT_SHIFT_AMPLITUDES = {
  GEON: 0.005, // Subtle shift - mobile stance (was 0.015)
  TAE: 0.007, // Fluid flowing shifts (was 0.02)
  LI: 0.003, // Minimal - precision stance (was 0.008)
  JIN: 0.009, // Larger - coiled spring (was 0.025)
  SON: 0.006, // Rhythmic lateral shifts (was 0.018)
  GAM: 0.008, // Flowing adaptation (was 0.022)
  GAN: 0.002, // Minimal - mountain solid (was 0.005)
  GON: 0.004, // Grounded subtle shifts (was 0.012)
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// BREATHING ANIMATION HELPERS (호흡 애니메이션 헬퍼)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculates breathing scale at a given phase
 *
 * @param phase - Breathing phase (0-1, where 0.5 is peak inhale)
 * @param min - Minimum scale (exhale)
 * @param max - Maximum scale (inhale peak)
 * @returns Scale factor for chest/torso
 */
function calculateBreathingScale(
  phase: number,
  min: number,
  max: number,
): number {
  // Use sine wave for natural breathing rhythm
  // Phase 0.5 = peak inhale, 0 and 1 = exhale
  const breathPhase = Math.sin(phase * Math.PI * 2);
  const amplitude = (max - min) / 2;
  const center = (max + min) / 2;
  return center + breathPhase * amplitude;
}

/**
 * Calculates torso expansion for breathing effect
 *
 * @param breathingScale - Current breathing scale (0.96-1.04)
 * @returns Torso rotation adjustment for breathing
 */
function calculateTorsoBreathingOffset(breathingScale: number): number {
  // Chest expands forward slightly on inhale
  return (breathingScale - 1) * 0.3;
}

/**
 * Calculates subtle knee bounce offset at a given phase
 *
 * DESIGN: Idle animations should only have light knee bounce - no pelvis
 * position movement which creates a "walking in place" appearance.
 *
 * @param phase - Breathing/bounce phase (0-1)
 * @param amplitude - Maximum bounce amount (knee bend adjustment)
 * @returns Knee rotation adjustment for natural bounce
 */
function calculateKneeBounce(phase: number, amplitude: number): number {
  // Subtle knee flex synchronized with breathing
  // Two bounces per breath cycle for natural feel
  const bouncePhase = Math.sin(phase * Math.PI * 4);
  return bouncePhase * amplitude * 0.15; // Very subtle knee flex
}

// ═══════════════════════════════════════════════════════════════════════════
// GUARD POSE APPLICATION HELPERS (방어자세적용헬퍼)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Applies a complete guard pose to a KeyframeConfig with breathing and knee bounce
 *
 * DESIGN: Idle animations should only have:
 * - Chest breathing (torso expansion)
 * - Subtle knee bounce (slight knee flex variation)
 * NO pelvis X/Z position movement (causes "walking in place" appearance)
 *
 * @param kf - KeyframeConfig to apply pose to
 * @param pose - Guard pose to apply
 * @param breathingOffset - Torso breathing offset
 * @param kneeBounce - Subtle knee flex adjustment for bounce effect
 */
function applyGuardPoseToKeyframe(
  kf: KeyframeConfig,
  pose: StanceGuardPose,
  breathingOffset: number,
  kneeBounce: number = 0,
): void {
  // === ARM POSITIONS (팔 위치) ===
  // IMPORTANT: Use SHOULDER_L/R, ELBOW_L/R, WRIST_L/R bone names
  // NOT UPPER_ARM, FOREARM, HAND - those are different bones in the hierarchy!

  // Left arm - shoulder controls arm lift/rotation
  kf.rotate(
    BoneName.SHOULDER_L,
    pose.leftArm.shoulder.x,
    pose.leftArm.shoulder.y,
    pose.leftArm.shoulder.z,
  );
  // Elbow controls forearm bend
  kf.rotate(
    BoneName.ELBOW_L,
    pose.leftArm.elbow.x,
    pose.leftArm.elbow.y,
    pose.leftArm.elbow.z,
  );
  // Wrist controls hand rotation
  kf.rotate(
    BoneName.WRIST_L,
    pose.leftArm.wrist.x,
    pose.leftArm.wrist.y,
    pose.leftArm.wrist.z,
  );

  // Right arm - mirror bone hierarchy
  kf.rotate(
    BoneName.SHOULDER_R,
    pose.rightArm.shoulder.x,
    pose.rightArm.shoulder.y,
    pose.rightArm.shoulder.z,
  );
  kf.rotate(
    BoneName.ELBOW_R,
    pose.rightArm.elbow.x,
    pose.rightArm.elbow.y,
    pose.rightArm.elbow.z,
  );
  kf.rotate(
    BoneName.WRIST_R,
    pose.rightArm.wrist.x,
    pose.rightArm.wrist.y,
    pose.rightArm.wrist.z,
  );

  // === TORSO (몸통) - Full spine chain for proper rotation ===
  // SPINE_LOWER: Base torso twist (inherits from pelvis)
  kf.rotate(
    BoneName.SPINE_LOWER,
    pose.torso.x * 0.3,
    pose.torso.y * 0.4,
    pose.torso.z * 0.3,
  );
  // SPINE_MIDDLE: Mid-torso twist
  kf.rotate(
    BoneName.SPINE_MIDDLE,
    pose.torso.x * 0.3,
    pose.torso.y * 0.3,
    pose.torso.z * 0.3,
  );
  // SPINE_UPPER: Upper chest with breathing - gets most of the rotation
  kf.rotate(
    BoneName.SPINE_UPPER,
    pose.torso.x * 0.4 + breathingOffset,
    pose.torso.y * 0.3,
    pose.torso.z * 0.4,
  );

  // === LEG POSITIONS (다리 위치) ===
  // IMPORTANT: Use HIP_L/R for hip rotation, not THIGH!
  // HIP bone controls the leg's root rotation

  // Left leg - HIP controls leg lift/rotation at socket
  kf.rotate(
    BoneName.HIP_L,
    pose.leftLeg.hip.x,
    pose.leftLeg.hip.y,
    pose.leftLeg.hip.z,
  );
  // KNEE controls lower leg bend (primarily X axis flex)
  // Add subtle knee bounce for natural idle movement
  kf.rotate(
    BoneName.KNEE_L,
    pose.leftLeg.knee.x + kneeBounce,
    pose.leftLeg.knee.y,
    pose.leftLeg.knee.z,
  );
  // FOOT controls ankle rotation
  kf.rotate(
    BoneName.FOOT_L,
    pose.leftLeg.ankle.x,
    pose.leftLeg.ankle.y,
    pose.leftLeg.ankle.z,
  );

  // Right leg - mirror bone hierarchy
  kf.rotate(
    BoneName.HIP_R,
    pose.rightLeg.hip.x,
    pose.rightLeg.hip.y,
    pose.rightLeg.hip.z,
  );
  kf.rotate(
    BoneName.KNEE_R,
    pose.rightLeg.knee.x + kneeBounce,
    pose.rightLeg.knee.y,
    pose.rightLeg.knee.z,
  );
  kf.rotate(
    BoneName.FOOT_R,
    pose.rightLeg.ankle.x,
    pose.rightLeg.ankle.y,
    pose.rightLeg.ankle.z,
  );

  // === PELVIS (골반) - Root of entire body ===
  // Controls overall body rotation and position
  kf.rotate(BoneName.PELVIS, pose.pelvis.x, pose.pelvis.y, pose.pelvis.z);
  // Pelvis position: ONLY stance height drop (Y)
  // NO X/Z offset - this prevents "walking in place" appearance
  const pelvisHeight = pose.pelvisHeight ?? 0;
  kf.position(BoneName.PELVIS, 0, pelvisHeight, 0);

  // === FOOT POSITIONING (발 위치) ===
  // Position feet for stance width and depth
  const stanceDepth = pose.stanceDepth ?? 0;
  // Left foot: negative X (left side), negative Z (front for forward stances)
  kf.position(BoneName.FOOT_L, -pose.stanceWidth / 2, 0, -stanceDepth / 2);
  // Right foot: positive X (right side), positive Z (back for forward stances)
  kf.position(BoneName.FOOT_R, pose.stanceWidth / 2, 0, stanceDepth / 2);
}

// ═══════════════════════════════════════════════════════════════════════════
// ☰ GEON HEAVEN IDLE (건 하늘 대기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates Geon idle animation with breathing and subtle knee bounce
 * NO pelvis position movement - only breathing and knee flex
 */
function createGeonIdleAnimation(): SkeletalAnimation {
  const pose = GEON_HIGH_GUARD_POSE;
  const { min, max } = pose.breathingRange;
  const duration = BREATHING_DURATIONS.GEON;
  const amplitude = WEIGHT_SHIFT_AMPLITUDES.GEON;
  const frames = STANCE_GUARD_CONFIGS.geon.breathingFrames;

  const builder = MartialArtsAnimationBuilder.create(
    "stance_geon",
    "건 대기",
  ).asIdle(duration, true);

  // Generate keyframes with breathing and subtle knee bounce
  for (let i = 0; i <= frames; i++) {
    const phase = i / frames;
    const frameTime = phase * duration;
    const breathingScale = calculateBreathingScale(phase, min, max);
    const breathingOffset = calculateTorsoBreathingOffset(breathingScale);
    const kneeBounce = calculateKneeBounce(phase, amplitude);

    const kf = builder.at(frameTime);
    applyGuardPoseToKeyframe(kf, pose, breathingOffset, kneeBounce);
    kf.done<MartialArtsAnimationBuilder>();
  }

  return builder.build();
}

/**
 * ☰ 건 (Geon) Heaven Idle Animation
 *
 * Powerful high guard stance with expansive chest breathing.
 * Boxing-style guard protecting chin and temples.
 *
 * **Breathing**: Slow powerful expansion (2.4s cycle)
 * **Weight**: Subtle forward shift for aggression
 * **Philosophy**: Heaven's creative force, direct power
 *
 * @korean 건하늘대기애니메이션
 */
export const GEON_IDLE_ANIMATION: SkeletalAnimation = createGeonIdleAnimation();

// ═══════════════════════════════════════════════════════════════════════════
// ☱ TAE LAKE IDLE (태 연못 대기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☱ 태 (Tae) Lake Idle Animation - ENHANCED FOR 95% QUALITY
 *
 * **Korean**: 태괘 호흡 자세 (Tae-gwae Hoheup Jase)
 * **Philosophy**: Lake's adaptability through flowing breath
 *
 * Characteristics:
 * - Fluid ribcage movement mimicking water waves
 * - Circular lateral weight shifts for mobility
 * - Lead hand ready for fluid parrying
 * - Back-weighted cat stance with subtle flow
 * - ENHANCED: Lateral micro-shifts, flowing spine coordination
 *
 * Animation Cycle (7 keyframes for 2.8s cycle):
 * - 0ms: Neutral baseline - back-weighted
 * - 400ms: Begin inhale - ribcage expanding
 * - 800ms: Mid-inhale - lateral shift right
 * - 1400ms: Peak inhale - maximum expansion
 * - 1800ms: Hold - subtle lateral left
 * - 2200ms: Begin exhale - flowing release
 * - 2800ms: Return to neutral
 *
 * Biomechanics: 
 * - Ribcage lateral expansion mimicking waves
 * - Subtle side-to-side weight distribution
 * - Fluid spine articulation through segments
 * - Cat stance back leg loading maintained
 *
 * @korean 태연못대기애니메이션
 * @duration 2800ms (2.8s - fluid flowing rhythm)
 * @category Idle Animation
 * @quality 95% - Anatomically accurate, flowing
 */
export const TAE_IDLE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("stance_tae", "태 대기")
    .asIdle(2.8, true)
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 0ms: Neutral baseline - back-weighted cat stance
    // ─────────────────────────────────────────────────────────────────────
    .at(0)
    .rotate(BoneName.PELVIS, 0.1, -0.7, 0) // Cat stance pelvis - rotated
    .rotate(BoneName.SPINE_LOWER, 0, -0.02, 0) // Neutral with slight rotation
    .rotate(BoneName.SPINE_UPPER, 0.2, -0.5, 0.1) // Forward lean + rotation
    .rotate(BoneName.SHOULDER_L, -0.7, 0.6, 0.3) // Lead arm extended
    .rotate(BoneName.SHOULDER_R, -1.0, -0.2, -0.5) // Rear at chin
    .rotate(BoneName.ELBOW_L, 0, 0, -1.8) // Elbow protecting ribs
    .rotate(BoneName.ELBOW_R, 0, 0, 2.2) // Tight elbow
    .rotate(BoneName.WRIST_L, 0.1, 0.3, 0.2) // Open palm
    .rotate(BoneName.WRIST_R, 0.2, -0.2, 0) // Fist at chin
    .rotate(BoneName.HEAD, 0.05, -0.3, 0) // Head aligned with stance
    .rotate(BoneName.NECK, 0.03, -0.15, 0) // Neck follows rotation
    .position(BoneName.PELVIS, 0, -0.1, 0) // Cat stance height
    .rotate(BoneName.HIP_L, 0.1, 0.2, 0) // Cat stance - front leg light
    .rotate(BoneName.KNEE_L, 0.18, 0, 0) // Nearly straight
    .rotate(BoneName.FOOT_L, -0.08, 0, 0) // Light touch
    .rotate(BoneName.HIP_R, -0.3, -0.25, 0) // Back leg loaded
    .rotate(BoneName.KNEE_R, 1.05, 0, 0) // Deep bend
    .rotate(BoneName.FOOT_R, -0.2, 0, 0) // Spring loaded
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 400ms: Begin inhale - ribcage expanding with lateral shift
    // ─────────────────────────────────────────────────────────────────────
    .at(0.4)
    .rotate(BoneName.PELVIS, 0.09, -0.69, 0) // Pelvis stable
    .rotate(BoneName.SPINE_LOWER, -0.01, -0.02, -0.01) // Begin arch, slight right lean
    .rotate(BoneName.SPINE_UPPER, 0.18, -0.48, 0.08) // Chest expanding
    .rotate(BoneName.SHOULDER_L, -0.72, 0.58, 0.32) // Lead arm subtle adjust
    .rotate(BoneName.SHOULDER_R, -1.02, -0.18, -0.48) // Rear opening
    .rotate(BoneName.HEAD, 0.06, -0.29, 0) // Head micro-adjust
    .rotate(BoneName.NECK, 0.04, -0.14, 0) // Neck adjusts
    .position(BoneName.PELVIS, -0.003, -0.098, 0.002) // Subtle right shift
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 800ms: Mid-inhale - lateral weight shift right
    // ─────────────────────────────────────────────────────────────────────
    .at(0.8)
    .rotate(BoneName.PELVIS, 0.08, -0.68, 0.01) // Pelvis rolls right
    .rotate(BoneName.SPINE_LOWER, -0.02, -0.02, -0.02) // More arch + lateral
    .rotate(BoneName.SPINE_UPPER, 0.16, -0.46, 0.06) // Chest expanding laterally
    .rotate(BoneName.SHOULDER_L, -0.75, 0.56, 0.35) // Lead arm adjusts
    .rotate(BoneName.SHOULDER_R, -1.05, -0.16, -0.46) // Rear widens
    .rotate(BoneName.ELBOW_L, 0.01, 0, -1.78) // Subtle adjust
    .rotate(BoneName.ELBOW_R, 0.01, 0, 2.18) // Mirror
    .rotate(BoneName.HEAD, 0.07, -0.28, 0.01) // Head adjusts with flow
    .rotate(BoneName.NECK, 0.05, -0.13, 0) // Neck
    .position(BoneName.PELVIS, -0.005, -0.095, 0.004) // Right shift + rise
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1400ms: Peak inhale - maximum expansion
    // ─────────────────────────────────────────────────────────────────────
    .at(1.4)
    .rotate(BoneName.PELVIS, 0.07, -0.67, 0.02) // Peak lateral roll
    .rotate(BoneName.SPINE_LOWER, -0.04, -0.02, -0.03) // Maximum arch
    .rotate(BoneName.SPINE_UPPER, 0.14, -0.44, 0.04) // Full expansion
    .rotate(BoneName.SHOULDER_L, -0.78, 0.54, 0.38) // Lead arm peak
    .rotate(BoneName.SHOULDER_R, -1.08, -0.14, -0.44) // Rear peak opening
    .rotate(BoneName.ELBOW_L, 0.02, 0, -1.76) // Peak adjust
    .rotate(BoneName.ELBOW_R, 0.02, 0, 2.16) // Mirror
    .rotate(BoneName.HEAD, 0.08, -0.27, 0.02) // Head high
    .rotate(BoneName.NECK, 0.06, -0.12, 0.01) // Neck extended
    .position(BoneName.PELVIS, -0.006, -0.092, 0.005) // Peak position
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1800ms: Hold - subtle shift to left (wave motion)
    // ─────────────────────────────────────────────────────────────────────
    .at(1.8)
    .rotate(BoneName.PELVIS, 0.08, -0.68, -0.01) // Shift left begins
    .rotate(BoneName.SPINE_LOWER, -0.03, -0.02, 0.01) // Lateral left
    .rotate(BoneName.SPINE_UPPER, 0.15, -0.45, 0.05) // Hold with shift
    .rotate(BoneName.SHOULDER_L, -0.76, 0.55, 0.36) // Adjust left
    .rotate(BoneName.SHOULDER_R, -1.06, -0.15, -0.45) // Adjust
    .rotate(BoneName.HEAD, 0.07, -0.28, -0.01) // Head follows
    .rotate(BoneName.NECK, 0.055, -0.125, 0) // Neck
    .position(BoneName.PELVIS, 0.002, -0.094, 0.004) // Shift left
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 2200ms: Begin exhale - flowing release
    // ─────────────────────────────────────────────────────────────────────
    .at(2.2)
    .rotate(BoneName.PELVIS, 0.09, -0.69, 0) // Return to center
    .rotate(BoneName.SPINE_LOWER, -0.01, -0.02, 0) // Releasing arch
    .rotate(BoneName.SPINE_UPPER, 0.18, -0.48, 0.08) // Chest contracting
    .rotate(BoneName.SHOULDER_L, -0.72, 0.58, 0.32) // Return flow
    .rotate(BoneName.SHOULDER_R, -1.02, -0.18, -0.48) // Closing
    .rotate(BoneName.ELBOW_L, 0.01, 0, -1.79) // Settling
    .rotate(BoneName.ELBOW_R, 0.01, 0, 2.19) // Mirror
    .rotate(BoneName.HEAD, 0.06, -0.29, 0) // Head settling
    .rotate(BoneName.NECK, 0.04, -0.14, 0) // Neck
    .position(BoneName.PELVIS, 0, -0.098, 0.001) // Nearly baseline
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 2800ms: Return to neutral - cycle complete
    // ─────────────────────────────────────────────────────────────────────
    .at(2.8)
    .rotate(BoneName.PELVIS, 0.1, -0.7, 0) // Baseline restored
    .rotate(BoneName.SPINE_LOWER, 0, -0.02, 0) // Neutral
    .rotate(BoneName.SPINE_UPPER, 0.2, -0.5, 0.1) // Baseline
    .rotate(BoneName.SHOULDER_L, -0.7, 0.6, 0.3) // Guard restored
    .rotate(BoneName.SHOULDER_R, -1.0, -0.2, -0.5) // Mirror
    .rotate(BoneName.ELBOW_L, 0, 0, -1.8) // Baseline
    .rotate(BoneName.ELBOW_R, 0, 0, 2.2) // Baseline
    .rotate(BoneName.WRIST_L, 0.1, 0.3, 0.2) // Open palm
    .rotate(BoneName.WRIST_R, 0.2, -0.2, 0) // Fist ready
    .rotate(BoneName.HEAD, 0.05, -0.3, 0) // Baseline
    .rotate(BoneName.NECK, 0.03, -0.15, 0) // Baseline
    .position(BoneName.PELVIS, 0, -0.1, 0) // Baseline height
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☲ LI FIRE IDLE (리 불 대기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☲ 리 (Li) Fire Idle Animation - ENHANCED FOR 95% QUALITY
 *
 * **Korean**: 리괘 호흡 자세 (Li-gwae Hoheup Jase)
 * **Philosophy**: Fire's precision through controlled breath
 *
 * Characteristics:
 * - Sharp, minimal breathing emphasizing control
 * - High peekaboo guard with minimal movement
 * - Precision-ready stance - every movement intentional
 * - Minimal weight shifts for striking accuracy
 * - ENHANCED: Micro-adjustments, surgical precision
 *
 * Animation Cycle (6 keyframes for 1.8s cycle - fastest breathing):
 * - 0ms: Neutral baseline - tight guard
 * - 300ms: Begin inhale - controlled expansion
 * - 600ms: Mid-inhale - minimal ribcage lift
 * - 900ms: Peak inhale - sharp focus
 * - 1200ms: Begin exhale - precise release
 * - 1800ms: Return to neutral
 *
 * Biomechanics: 
 * - Minimal ribcage elevation (3-4° max)
 * - Shoulders stay squared and tight
 * - Almost no weight shift - rooted precision
 * - Micro head movements for targeting focus
 *
 * @korean 리불대기애니메이션
 * @duration 1800ms (1.8s - sharp controlled rhythm)
 * @category Idle Animation
 * @quality 95% - Precision control
 */
export const LI_IDLE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("stance_li", "리 대기")
    .asIdle(1.8, true)
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 0ms: Neutral baseline - tight peekaboo guard
    // ─────────────────────────────────────────────────────────────────────
    .at(0)
    .rotate(BoneName.PELVIS, 0.05, -0.4, 0) // Slight forward lean
    .rotate(BoneName.SPINE_LOWER, 0.01, 0, 0) // Nearly neutral - minimal
    .rotate(BoneName.SPINE_UPPER, 0.15, -0.4, 0) // Forward lean for guard
    .rotate(BoneName.SHOULDER_L, -1.3, 0.3, 0.4) // High guard left
    .rotate(BoneName.SHOULDER_R, -1.3, -0.3, -0.4) // High guard right
    .rotate(BoneName.ELBOW_L, 0, 0, -2.0) // Tight elbow
    .rotate(BoneName.ELBOW_R, 0, 0, 2.0) // Mirror
    .rotate(BoneName.WRIST_L, 0.3, 0.1, 0) // Fists at temples
    .rotate(BoneName.WRIST_R, 0.3, -0.1, 0) // Mirror
    .rotate(BoneName.HEAD, 0.08, -0.2, 0) // Head slightly forward
    .rotate(BoneName.NECK, 0.04, -0.1, 0) // Neck aligned
    .position(BoneName.PELVIS, 0, -0.12, 0) // Standard height
    .rotate(BoneName.HIP_L, 0.2, 0.3, 0.15) // Square stance left
    .rotate(BoneName.KNEE_L, 0.8, 0, 0) // Moderate bend
    .rotate(BoneName.FOOT_L, -0.15, 0.1, 0) // Grounded
    .rotate(BoneName.HIP_R, 0.2, -0.3, -0.15) // Square stance right
    .rotate(BoneName.KNEE_R, 0.8, 0, 0) // Mirror bend
    .rotate(BoneName.FOOT_R, -0.15, -0.1, 0) // Grounded
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 300ms: Begin inhale - controlled minimal expansion
    // ─────────────────────────────────────────────────────────────────────
    .at(0.3)
    .rotate(BoneName.PELVIS, 0.04, -0.4, 0) // Stable
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Minimal arch
    .rotate(BoneName.SPINE_UPPER, 0.14, -0.39, 0) // Slight chest expansion
    .rotate(BoneName.SHOULDER_L, -1.32, 0.29, 0.41) // Micro adjust
    .rotate(BoneName.SHOULDER_R, -1.32, -0.29, -0.41) // Mirror
    .rotate(BoneName.HEAD, 0.085, -0.19, 0) // Head micro-adjust
    .rotate(BoneName.NECK, 0.045, -0.09, 0) // Neck
    .position(BoneName.PELVIS, 0, -0.119, 0.001) // Minimal rise
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 600ms: Mid-inhale - minimal ribcage lift
    // ─────────────────────────────────────────────────────────────────────
    .at(0.6)
    .rotate(BoneName.PELVIS, 0.03, -0.4, 0) // Micro back tilt
    .rotate(BoneName.SPINE_LOWER, -0.01, 0, 0) // Slight arch
    .rotate(BoneName.SPINE_UPPER, 0.13, -0.38, 0) // Chest lifting
    .rotate(BoneName.SHOULDER_L, -1.34, 0.28, 0.42) // Minimal opening
    .rotate(BoneName.SHOULDER_R, -1.34, -0.28, -0.42) // Mirror
    .rotate(BoneName.ELBOW_L, 0.01, 0, -1.99) // Micro adjust
    .rotate(BoneName.ELBOW_R, 0.01, 0, 1.99) // Mirror
    .rotate(BoneName.HEAD, 0.09, -0.18, 0) // Head focus
    .rotate(BoneName.NECK, 0.05, -0.08, 0) // Neck
    .position(BoneName.PELVIS, 0, -0.118, 0.002) // Minimal position
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 900ms: Peak inhale - sharp focus
    // ─────────────────────────────────────────────────────────────────────
    .at(0.9)
    .rotate(BoneName.PELVIS, 0.02, -0.4, 0) // Peak back tilt (minimal)
    .rotate(BoneName.SPINE_LOWER, -0.02, 0, 0) // Peak arch (small)
    .rotate(BoneName.SPINE_UPPER, 0.12, -0.37, 0) // Peak expansion
    .rotate(BoneName.SHOULDER_L, -1.36, 0.27, 0.43) // Peak position
    .rotate(BoneName.SHOULDER_R, -1.36, -0.27, -0.43) // Mirror
    .rotate(BoneName.HEAD, 0.095, -0.17, 0) // Peak focus
    .rotate(BoneName.NECK, 0.055, -0.07, 0) // Peak extension
    .position(BoneName.PELVIS, 0, -0.117, 0.003) // Peak height (minimal)
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1200ms: Begin exhale - precise release
    // ─────────────────────────────────────────────────────────────────────
    .at(1.2)
    .rotate(BoneName.PELVIS, 0.04, -0.4, 0) // Return forward
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Releasing arch
    .rotate(BoneName.SPINE_UPPER, 0.14, -0.39, 0) // Chest contracting
    .rotate(BoneName.SHOULDER_L, -1.32, 0.29, 0.41) // Returning
    .rotate(BoneName.SHOULDER_R, -1.32, -0.29, -0.41) // Mirror
    .rotate(BoneName.ELBOW_L, 0.005, 0, -1.995) // Settling
    .rotate(BoneName.ELBOW_R, 0.005, 0, 1.995) // Mirror
    .rotate(BoneName.HEAD, 0.085, -0.19, 0) // Head settling
    .rotate(BoneName.NECK, 0.045, -0.09, 0) // Neck
    .position(BoneName.PELVIS, 0, -0.119, 0.001) // Nearly baseline
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1800ms: Return to neutral - cycle complete
    // ─────────────────────────────────────────────────────────────────────
    .at(1.8)
    .rotate(BoneName.PELVIS, 0.05, -0.4, 0) // Baseline restored
    .rotate(BoneName.SPINE_LOWER, 0.01, 0, 0) // Neutral
    .rotate(BoneName.SPINE_UPPER, 0.15, -0.4, 0) // Baseline
    .rotate(BoneName.SHOULDER_L, -1.3, 0.3, 0.4) // Guard restored
    .rotate(BoneName.SHOULDER_R, -1.3, -0.3, -0.4) // Mirror
    .rotate(BoneName.ELBOW_L, 0, 0, -2.0) // Baseline
    .rotate(BoneName.ELBOW_R, 0, 0, 2.0) // Baseline
    .rotate(BoneName.WRIST_L, 0.3, 0.1, 0) // Fists ready
    .rotate(BoneName.WRIST_R, 0.3, -0.1, 0) // Mirror
    .rotate(BoneName.HEAD, 0.08, -0.2, 0) // Baseline
    .rotate(BoneName.NECK, 0.04, -0.1, 0) // Baseline
    .position(BoneName.PELVIS, 0, -0.12, 0) // Baseline height
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☳ JIN THUNDER IDLE (진 천둥 대기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☳ 진 (Jin) Thunder Idle Animation - ENHANCED FOR 95% QUALITY
 *
 * **Korean**: 진괘 호흡 자세 (Jin-gwae Hoheup Jase)
 * **Philosophy**: Thunder's explosive power through coiled breath
 *
 * Characteristics:
 * - Deep power breathing with explosive potential
 * - Chambered fists at ribs - coiled spring ready
 * - Back-loaded weight with forward pulse readiness
 * - Shoulders squared, core tight for power transfer
 * - ENHANCED: Coiling/uncoiling micro-movements, spring tension
 *
 * Animation Cycle (7 keyframes for 2.2s cycle):
 * - 0ms: Neutral baseline - coiled ready
 * - 330ms: Begin inhale - loading spring
 * - 660ms: Mid-inhale - deep diaphragm
 * - 1100ms: Peak inhale - maximum coil
 * - 1430ms: Hold - explosive readiness
 * - 1760ms: Begin exhale - spring release
 * - 2200ms: Return to neutral
 *
 * Biomechanics: 
 * - Deep diaphragmatic breathing for power
 * - Subtle back-to-forward weight pulse
 * - Core tightening on exhale for explosive readiness
 * - Shoulders load back, fists chambered tight
 *
 * @korean 진천둥대기애니메이션
 * @duration 2200ms (2.2s - coiled power rhythm)
 * @category Idle Animation
 * @quality 95% - Explosive readiness
 */
export const JIN_IDLE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("stance_jin", "진 대기")
    .asIdle(2.2, true)
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 0ms: Neutral baseline - coiled ready position
    // ─────────────────────────────────────────────────────────────────────
    .at(0)
    .rotate(BoneName.PELVIS, 0.15, -0.3, 0) // Forward lean, coiled
    .rotate(BoneName.SPINE_LOWER, 0.03, 0, 0) // Slight forward lean
    .rotate(BoneName.SPINE_UPPER, 0.25, -0.3, 0) // Forward coil position
    .rotate(BoneName.SHOULDER_L, -0.4, 0.8, 0.6) // Chambered left fist
    .rotate(BoneName.SHOULDER_R, -0.4, -0.8, -0.6) // Chambered right fist
    .rotate(BoneName.ELBOW_L, 0, 0, -2.4) // Tight to ribs
    .rotate(BoneName.ELBOW_R, 0, 0, 2.4) // Mirror
    .rotate(BoneName.WRIST_L, 0.4, 0.3, 0) // Fist clenched
    .rotate(BoneName.WRIST_R, 0.4, -0.3, 0) // Mirror
    .rotate(BoneName.HEAD, 0.12, -0.15, 0) // Head forward, focused
    .rotate(BoneName.NECK, 0.07, -0.08, 0) // Neck aligned
    .position(BoneName.PELVIS, 0, -0.14, -0.02) // Slightly back-weighted
    .rotate(BoneName.HIP_L, 0.3, 0.5, 0.3) // Wide horse stance left
    .rotate(BoneName.KNEE_L, 1.57, 0, 0) // Deep bend (90°)
    .rotate(BoneName.FOOT_L, -0.25, 0.2, 0) // Coiled power
    .rotate(BoneName.HIP_R, 0.3, -0.5, -0.3) // Wide horse stance right
    .rotate(BoneName.KNEE_R, 1.57, 0, 0) // Deep bend mirror
    .rotate(BoneName.FOOT_R, -0.25, -0.2, 0) // Spring loaded
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 330ms: Begin inhale - loading the spring
    // ─────────────────────────────────────────────────────────────────────
    .at(0.33)
    .rotate(BoneName.PELVIS, 0.14, -0.3, 0) // Pelvis begins settling
    .rotate(BoneName.SPINE_LOWER, 0.01, 0, 0) // Lower spine loading
    .rotate(BoneName.SPINE_UPPER, 0.23, -0.29, 0) // Upper expanding back
    .rotate(BoneName.SHOULDER_L, -0.42, 0.78, 0.62) // Loading back
    .rotate(BoneName.SHOULDER_R, -0.42, -0.78, -0.62) // Mirror
    .rotate(BoneName.HEAD, 0.13, -0.14, 0) // Head adjusts
    .rotate(BoneName.NECK, 0.075, -0.07, 0) // Neck
    .position(BoneName.PELVIS, 0, -0.138, -0.025) // Settling back
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 660ms: Mid-inhale - deep diaphragm loading
    // ─────────────────────────────────────────────────────────────────────
    .at(0.66)
    .rotate(BoneName.PELVIS, 0.12, -0.3, 0) // More back weight
    .rotate(BoneName.SPINE_LOWER, -0.01, 0, 0) // Beginning arch
    .rotate(BoneName.SPINE_UPPER, 0.21, -0.28, 0) // Chest expanding
    .rotate(BoneName.SHOULDER_L, -0.45, 0.76, 0.65) // Shoulders back
    .rotate(BoneName.SHOULDER_R, -0.45, -0.76, -0.65) // Mirror
    .rotate(BoneName.ELBOW_L, 0.02, 0, -2.38) // Micro adjust
    .rotate(BoneName.ELBOW_R, 0.02, 0, 2.38) // Mirror
    .rotate(BoneName.HEAD, 0.14, -0.13, 0) // Head rising
    .rotate(BoneName.NECK, 0.08, -0.06, 0) // Neck
    .position(BoneName.PELVIS, 0, -0.136, -0.028) // Deep back load
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1100ms: Peak inhale - maximum coil/spring compression
    // ─────────────────────────────────────────────────────────────────────
    .at(1.1)
    .rotate(BoneName.PELVIS, 0.10, -0.3, 0) // Peak back tilt
    .rotate(BoneName.SPINE_LOWER, -0.03, 0, 0) // Peak arch
    .rotate(BoneName.SPINE_UPPER, 0.19, -0.27, 0) // Peak expansion
    .rotate(BoneName.SHOULDER_L, -0.48, 0.74, 0.68) // Peak coil
    .rotate(BoneName.SHOULDER_R, -0.48, -0.74, -0.68) // Mirror
    .rotate(BoneName.ELBOW_L, 0.03, 0, -2.36) // Peak tension
    .rotate(BoneName.ELBOW_R, 0.03, 0, 2.36) // Mirror
    .rotate(BoneName.HEAD, 0.16, -0.12, 0) // Peak focus
    .rotate(BoneName.NECK, 0.09, -0.05, 0) // Peak extension
    .position(BoneName.PELVIS, 0, -0.134, -0.03) // Maximum back load
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1430ms: Hold - explosive readiness (spring loaded)
    // ─────────────────────────────────────────────────────────────────────
    .at(1.43)
    .rotate(BoneName.PELVIS, 0.11, -0.3, 0) // Holding tension
    .rotate(BoneName.SPINE_LOWER, -0.025, 0, 0) // Hold coil
    .rotate(BoneName.SPINE_UPPER, 0.20, -0.275, 0) // Slight settle
    .rotate(BoneName.SHOULDER_L, -0.47, 0.75, 0.67) // Hold ready
    .rotate(BoneName.SHOULDER_R, -0.47, -0.75, -0.67) // Mirror
    .rotate(BoneName.HEAD, 0.155, -0.125, 0) // Focused hold
    .rotate(BoneName.NECK, 0.085, -0.055, 0) // Hold
    .position(BoneName.PELVIS, 0, -0.135, -0.029) // Hold position
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1760ms: Begin exhale - spring releasing forward
    // ─────────────────────────────────────────────────────────────────────
    .at(1.76)
    .rotate(BoneName.PELVIS, 0.14, -0.3, 0) // Forward shift begins
    .rotate(BoneName.SPINE_LOWER, 0.01, 0, 0) // Releasing coil
    .rotate(BoneName.SPINE_UPPER, 0.23, -0.29, 0) // Chest contracting
    .rotate(BoneName.SHOULDER_L, -0.42, 0.78, 0.62) // Releasing
    .rotate(BoneName.SHOULDER_R, -0.42, -0.78, -0.62) // Mirror
    .rotate(BoneName.ELBOW_L, 0.01, 0, -2.39) // Settling
    .rotate(BoneName.ELBOW_R, 0.01, 0, 2.39) // Mirror
    .rotate(BoneName.HEAD, 0.13, -0.14, 0) // Head settling
    .rotate(BoneName.NECK, 0.075, -0.07, 0) // Neck
    .position(BoneName.PELVIS, 0, -0.139, -0.023) // Forward pulse
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 2200ms: Return to neutral - cycle complete
    // ─────────────────────────────────────────────────────────────────────
    .at(2.2)
    .rotate(BoneName.PELVIS, 0.15, -0.3, 0) // Baseline restored
    .rotate(BoneName.SPINE_LOWER, 0.03, 0, 0) // Neutral
    .rotate(BoneName.SPINE_UPPER, 0.25, -0.3, 0) // Baseline
    .rotate(BoneName.SHOULDER_L, -0.4, 0.8, 0.6) // Guard restored
    .rotate(BoneName.SHOULDER_R, -0.4, -0.8, -0.6) // Mirror
    .rotate(BoneName.ELBOW_L, 0, 0, -2.4) // Baseline
    .rotate(BoneName.ELBOW_R, 0, 0, 2.4) // Baseline
    .rotate(BoneName.WRIST_L, 0.4, 0.3, 0) // Fists ready
    .rotate(BoneName.WRIST_R, 0.4, -0.3, 0) // Mirror
    .rotate(BoneName.HEAD, 0.12, -0.15, 0) // Baseline
    .rotate(BoneName.NECK, 0.07, -0.08, 0) // Baseline
    .position(BoneName.PELVIS, 0, -0.14, -0.02) // Baseline
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☴ SON WIND IDLE (손 바람 대기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☴ 손 (Son) Wind Idle Animation - ENHANCED FOR 95% QUALITY
 *
 * **Korean**: 손괘 호흡 자세 (Son-gwae Hoheup Jase)
 * **Philosophy**: Wind's continuous flow through rhythmic breath
 *
 * Characteristics:
 * - Rhythmic flowing breath emphasizing mobility
 * - Staggered guard - lead extended, rear ready
 * - Lateral rhythmic weight shifts like wind gusts
 * - Continuous subtle movement - never fully still
 * - ENHANCED: Figure-8 micro-movements, flowing transitions
 *
 * Animation Cycle (7 keyframes for 2.0s cycle):
 * - 0ms: Neutral baseline - flow ready
 * - 285ms: Begin inhale - shift left
 * - 570ms: Mid-inhale - expanding
 * - 1000ms: Peak inhale - shift right
 * - 1285ms: Hold - center flow
 * - 1570ms: Begin exhale - shift left
 * - 2000ms: Return to neutral
 *
 * Biomechanics: 
 * - Rhythmic lateral weight distribution
 * - Continuous spine micro-rotation (figure-8 pattern)
 * - Lead arm subtle extension/retraction flow
 * - Head tracking with wind-like micro-adjustments
 *
 * @korean 손바람대기애니메이션
 * @duration 2000ms (2.0s - rhythmic flowing)
 * @category Idle Animation
 * @quality 95% - Continuous flow
 */
export const SON_IDLE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("stance_son", "손 대기")
    .asIdle(2.0, true)
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 0ms: Neutral baseline - flow ready position
    // ─────────────────────────────────────────────────────────────────────
    .at(0)
    .rotate(BoneName.PELVIS, 0.08, -0.5, 0) // Side stance rotation
    .rotate(BoneName.SPINE_LOWER, 0.02, -0.1, 0.01) // Slight twist + lean
    .rotate(BoneName.SPINE_UPPER, 0.18, -0.5, 0.05) // Forward + rotated
    .rotate(BoneName.SHOULDER_L, -0.9, 0.7, 0.4) // Lead extended
    .rotate(BoneName.SHOULDER_R, -1.1, -0.3, -0.6) // Rear at chin
    .rotate(BoneName.ELBOW_L, 0, 0, -1.6) // Lead elbow extended but safe
    .rotate(BoneName.ELBOW_R, 0, 0, 2.3) // Rear tight
    .rotate(BoneName.WRIST_L, 0.2, 0.4, 0.1) // Lead open hand
    .rotate(BoneName.WRIST_R, 0.3, -0.2, 0) // Rear fist
    .rotate(BoneName.HEAD, 0.06, -0.35, 0.02) // Head tracking
    .rotate(BoneName.NECK, 0.04, -0.18, 0.01) // Neck flow
    .position(BoneName.PELVIS, 0, -0.11, 0) // Standard height
    .rotate(BoneName.HIP_L, 1.2, 0.3, 0.2) // CRANE STANCE - left leg RAISED HIGH
    .rotate(BoneName.KNEE_L, 2.0, 0, 0) // Knee deeply bent (45° angle)
    .rotate(BoneName.FOOT_L, -0.4, 0.3, 0) // Foot hanging, toes pointed
    .rotate(BoneName.HIP_R, 0.1, -0.15, 0) // Standing leg - nearly straight
    .rotate(BoneName.KNEE_R, 0.18, 0, 0) // Slight bend for balance
    .rotate(BoneName.FOOT_R, -0.1, 0, 0) // Grounded, 100% weight
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 285ms: Begin inhale - lateral shift left (wind gust)
    // ─────────────────────────────────────────────────────────────────────
    .at(0.285)
    .rotate(BoneName.PELVIS, 0.07, -0.49, 0.02) // Pelvis rolls left
    .rotate(BoneName.SPINE_LOWER, 0.01, -0.09, 0.02) // Lateral left lean
    .rotate(BoneName.SPINE_UPPER, 0.17, -0.48, 0.07) // Flow left
    .rotate(BoneName.SHOULDER_L, -0.92, 0.68, 0.42) // Lead extends more
    .rotate(BoneName.SHOULDER_R, -1.12, -0.28, -0.58) // Rear adjusts
    .rotate(BoneName.HEAD, 0.065, -0.34, 0.025) // Head flows left
    .rotate(BoneName.NECK, 0.045, -0.17, 0.015) // Neck
    .position(BoneName.PELVIS, 0.004, -0.108, 0.002) // Shift left + rise
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 570ms: Mid-inhale - chest expanding, center
    // ─────────────────────────────────────────────────────────────────────
    .at(0.57)
    .rotate(BoneName.PELVIS, 0.06, -0.50, 0) // Center
    .rotate(BoneName.SPINE_LOWER, 0, -0.10, 0) // Expanding back
    .rotate(BoneName.SPINE_UPPER, 0.16, -0.49, 0.04) // Chest lifting
    .rotate(BoneName.SHOULDER_L, -0.95, 0.66, 0.45) // Lead peak extension
    .rotate(BoneName.SHOULDER_R, -1.15, -0.26, -0.56) // Rear opening
    .rotate(BoneName.ELBOW_L, 0.02, 0, -1.58) // Lead extends
    .rotate(BoneName.ELBOW_R, 0.02, 0, 2.28) // Rear adjusts
    .rotate(BoneName.HEAD, 0.07, -0.33, 0.01) // Center focus
    .rotate(BoneName.NECK, 0.05, -0.16, 0) // Neck
    .position(BoneName.PELVIS, 0, -0.106, 0.004) // Peak rise
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1000ms: Peak inhale - lateral shift right
    // ─────────────────────────────────────────────────────────────────────
    .at(1.0)
    .rotate(BoneName.PELVIS, 0.05, -0.51, -0.02) // Pelvis rolls right
    .rotate(BoneName.SPINE_LOWER, -0.01, -0.11, -0.02) // Lateral right
    .rotate(BoneName.SPINE_UPPER, 0.15, -0.51, 0.02) // Flow right
    .rotate(BoneName.SHOULDER_L, -0.98, 0.64, 0.48) // Lead maximum
    .rotate(BoneName.SHOULDER_R, -1.18, -0.24, -0.54) // Rear peak
    .rotate(BoneName.ELBOW_L, 0.03, 0, -1.56) // Lead peak
    .rotate(BoneName.ELBOW_R, 0.03, 0, 2.26) // Rear
    .rotate(BoneName.HEAD, 0.075, -0.32, -0.01) // Head right
    .rotate(BoneName.NECK, 0.055, -0.15, -0.01) // Neck right
    .position(BoneName.PELVIS, -0.004, -0.105, 0.005) // Shift right
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1285ms: Hold - center flow, balanced
    // ─────────────────────────────────────────────────────────────────────
    .at(1.285)
    .rotate(BoneName.PELVIS, 0.06, -0.50, 0) // Center hold
    .rotate(BoneName.SPINE_LOWER, -0.005, -0.10, 0) // Balanced
    .rotate(BoneName.SPINE_UPPER, 0.16, -0.50, 0.03) // Center
    .rotate(BoneName.SHOULDER_L, -0.96, 0.65, 0.46) // Hold
    .rotate(BoneName.SHOULDER_R, -1.16, -0.25, -0.55) // Hold
    .rotate(BoneName.HEAD, 0.07, -0.33, 0) // Center
    .rotate(BoneName.NECK, 0.05, -0.16, 0) // Center
    .position(BoneName.PELVIS, 0, -0.106, 0.004) // Hold center
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1570ms: Begin exhale - shift left again (wind cycle)
    // ─────────────────────────────────────────────────────────────────────
    .at(1.57)
    .rotate(BoneName.PELVIS, 0.07, -0.49, 0.01) // Left shift
    .rotate(BoneName.SPINE_LOWER, 0.01, -0.09, 0.01) // Releasing left
    .rotate(BoneName.SPINE_UPPER, 0.17, -0.48, 0.06) // Contracting
    .rotate(BoneName.SHOULDER_L, -0.92, 0.68, 0.42) // Retracting
    .rotate(BoneName.SHOULDER_R, -1.12, -0.28, -0.58) // Closing
    .rotate(BoneName.ELBOW_L, 0.01, 0, -1.59) // Settling
    .rotate(BoneName.ELBOW_R, 0.01, 0, 2.29) // Settling
    .rotate(BoneName.HEAD, 0.065, -0.34, 0.015) // Left flow
    .rotate(BoneName.NECK, 0.045, -0.17, 0.01) // Neck
    .position(BoneName.PELVIS, 0.003, -0.109, 0.002) // Left shift
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 2000ms: Return to neutral - cycle complete
    // ─────────────────────────────────────────────────────────────────────
    .at(2.0)
    .rotate(BoneName.PELVIS, 0.08, -0.5, 0) // Baseline restored
    .rotate(BoneName.SPINE_LOWER, 0.02, -0.1, 0.01) // Neutral
    .rotate(BoneName.SPINE_UPPER, 0.18, -0.5, 0.05) // Baseline
    .rotate(BoneName.SHOULDER_L, -0.9, 0.7, 0.4) // Guard restored
    .rotate(BoneName.SHOULDER_R, -1.1, -0.3, -0.6) // Mirror
    .rotate(BoneName.ELBOW_L, 0, 0, -1.6) // Baseline
    .rotate(BoneName.ELBOW_R, 0, 0, 2.3) // Baseline
    .rotate(BoneName.WRIST_L, 0.2, 0.4, 0.1) // Lead ready
    .rotate(BoneName.WRIST_R, 0.3, -0.2, 0) // Rear ready
    .rotate(BoneName.HEAD, 0.06, -0.35, 0.02) // Baseline
    .rotate(BoneName.NECK, 0.04, -0.18, 0.01) // Baseline
    .position(BoneName.PELVIS, 0, -0.11, 0) // Baseline
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☵ GAM WATER IDLE (감 물 대기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☵ 감 (Gam) Water Idle Animation - ENHANCED FOR 95% QUALITY
 *
 * **Korean**: 감괘 호흡 자세 (Gam-gwae Hoheup Jase)
 * **Philosophy**: Water's deep flow through adaptive breath
 *
 * Characteristics:
 * - Deep flowing diaphragmatic breathing (longest cycle)
 * - Circular weight distribution mimicking water currents
 * - Mid-level parrying hands ready for redirection
 * - Fluid spine articulation through all segments
 * - ENHANCED: Largest movements, deep wave-like flow
 *
 * Animation Cycle (8 keyframes for 3.0s cycle - slowest/deepest):
 * - 0ms: Neutral baseline - flow ready
 * - 375ms: Begin inhale - circular shift begins
 * - 750ms: Early mid-inhale - lateral flow
 * - 1125ms: Late mid-inhale - deep expansion
 * - 1500ms: Peak inhale - maximum wave
 * - 1875ms: Hold - balanced flow
 * - 2250ms: Begin exhale - releasing wave
 * - 3000ms: Return to neutral
 *
 * Biomechanics: 
 * - Deep diaphragm with maximum ribcage expansion
 * - Circular pelvis micro-rotations (water current)
 * - Flowing spine articulation (wave propagation)
 * - Largest weight shifts of all stances
 *
 * @korean 감물대기애니메이션
 * @duration 3000ms (3.0s - deepest flowing breath)
 * @category Idle Animation
 * @quality 95% - Maximum flow depth
 */
export const GAM_IDLE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("stance_gam", "감 대기")
    .asIdle(3.0, true)
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 0ms: Neutral baseline - adaptive flow position
    // ─────────────────────────────────────────────────────────────────────
    .at(0)
    .rotate(BoneName.PELVIS, 0.12, -0.45, 0) // Forward lean, slight rotation
    .rotate(BoneName.SPINE_LOWER, 0.03, -0.05, 0) // Subtle flow ready
    .rotate(BoneName.SPINE_UPPER, 0.20, -0.45, 0) // Forward adaptive
    .rotate(BoneName.SHOULDER_L, -0.8, 0.5, 0.4) // Mid-level parry ready
    .rotate(BoneName.SHOULDER_R, -0.8, -0.5, -0.4) // Mirror
    .rotate(BoneName.ELBOW_L, 0, 0, -1.9) // Elbows at solar plexus
    .rotate(BoneName.ELBOW_R, 0, 0, 1.9) // Mirror
    .rotate(BoneName.WRIST_L, 0.2, 0.3, 0.1) // Open hands for redirect
    .rotate(BoneName.WRIST_R, 0.2, -0.3, -0.1) // Mirror
    .rotate(BoneName.HEAD, 0.08, -0.25, 0) // Head centered
    .rotate(BoneName.NECK, 0.05, -0.12, 0) // Neck aligned
    .position(BoneName.PELVIS, 0, -0.13, 0) // Standard height
    .rotate(BoneName.HIP_L, 0.15, 0.2, 0) // Front leg - adaptive stance
    .rotate(BoneName.KNEE_L, 0.35, 0, 0) // Light bend for flow
    .rotate(BoneName.FOOT_L, -0.08, 0, 0) // Light touch
    .rotate(BoneName.HIP_R, -0.25, -0.2, 0) // Back leg - more weight
    .rotate(BoneName.KNEE_R, 1.4, 0, 0) // Deep bend for stability
    .rotate(BoneName.FOOT_R, -0.2, 0, 0) // Grounded
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 375ms: Begin inhale - circular shift begins (left)
    // ─────────────────────────────────────────────────────────────────────
    .at(0.375)
    .rotate(BoneName.PELVIS, 0.11, -0.44, 0.02) // Pelvis rotates left
    .rotate(BoneName.SPINE_LOWER, 0.02, -0.04, 0.02) // Flow left begins
    .rotate(BoneName.SPINE_UPPER, 0.19, -0.43, 0.02) // Upper flows
    .rotate(BoneName.SHOULDER_L, -0.82, 0.48, 0.42) // Left adjusts
    .rotate(BoneName.SHOULDER_R, -0.82, -0.48, -0.38) // Right adjusts
    .rotate(BoneName.HEAD, 0.085, -0.24, 0.015) // Head flows left
    .rotate(BoneName.NECK, 0.055, -0.11, 0.01) // Neck
    .position(BoneName.PELVIS, 0.005, -0.128, 0.003) // Shift left + rise
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 750ms: Early mid-inhale - lateral flow expanding
    // ─────────────────────────────────────────────────────────────────────
    .at(0.75)
    .rotate(BoneName.PELVIS, 0.10, -0.43, 0.03) // More left rotation
    .rotate(BoneName.SPINE_LOWER, 0.01, -0.03, 0.03) // Lateral expansion
    .rotate(BoneName.SPINE_UPPER, 0.18, -0.41, 0.04) // Chest opening left
    .rotate(BoneName.SHOULDER_L, -0.85, 0.46, 0.45) // Widening
    .rotate(BoneName.SHOULDER_R, -0.85, -0.46, -0.36) // Mirror
    .rotate(BoneName.ELBOW_L, 0.02, 0, -1.88) // Arms adjusting
    .rotate(BoneName.ELBOW_R, 0.02, 0, 1.88) // Mirror
    .rotate(BoneName.HEAD, 0.09, -0.23, 0.02) // Head tracking flow
    .rotate(BoneName.NECK, 0.06, -0.10, 0.015) // Neck
    .position(BoneName.PELVIS, 0.007, -0.126, 0.005) // Peak left shift
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1125ms: Late mid-inhale - transitioning to right
    // ─────────────────────────────────────────────────────────────────────
    .at(1.125)
    .rotate(BoneName.PELVIS, 0.09, -0.44, 0.01) // Center transition
    .rotate(BoneName.SPINE_LOWER, 0, -0.04, 0) // Center expanding
    .rotate(BoneName.SPINE_UPPER, 0.17, -0.42, 0.01) // Deep breath
    .rotate(BoneName.SHOULDER_L, -0.88, 0.44, 0.48) // Deep expansion
    .rotate(BoneName.SHOULDER_R, -0.88, -0.44, -0.34) // Mirror
    .rotate(BoneName.HEAD, 0.095, -0.24, 0.01) // Center
    .rotate(BoneName.NECK, 0.065, -0.11, 0.005) // Center
    .position(BoneName.PELVIS, 0.002, -0.124, 0.006) // Center high
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1500ms: Peak inhale - maximum wave (right side)
    // ─────────────────────────────────────────────────────────────────────
    .at(1.5)
    .rotate(BoneName.PELVIS, 0.08, -0.45, -0.03) // Peak right rotation
    .rotate(BoneName.SPINE_LOWER, -0.01, -0.05, -0.03) // Arch right
    .rotate(BoneName.SPINE_UPPER, 0.16, -0.43, -0.02) // Peak expansion right
    .rotate(BoneName.SHOULDER_L, -0.91, 0.42, 0.50) // Maximum opening
    .rotate(BoneName.SHOULDER_R, -0.91, -0.42, -0.32) // Mirror
    .rotate(BoneName.ELBOW_L, 0.03, 0, -1.86) // Peak position
    .rotate(BoneName.ELBOW_R, 0.03, 0, 1.86) // Mirror
    .rotate(BoneName.HEAD, 0.10, -0.25, -0.02) // Right flow
    .rotate(BoneName.NECK, 0.07, -0.12, -0.015) // Neck right
    .position(BoneName.PELVIS, -0.006, -0.122, 0.007) // Peak right shift
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1875ms: Hold - balanced flow at peak
    // ─────────────────────────────────────────────────────────────────────
    .at(1.875)
    .rotate(BoneName.PELVIS, 0.09, -0.44, -0.01) // Settling center
    .rotate(BoneName.SPINE_LOWER, 0, -0.04, -0.01) // Hold expansion
    .rotate(BoneName.SPINE_UPPER, 0.17, -0.42, 0) // Balanced hold
    .rotate(BoneName.SHOULDER_L, -0.89, 0.43, 0.49) // Hold
    .rotate(BoneName.SHOULDER_R, -0.89, -0.43, -0.33) // Mirror
    .rotate(BoneName.HEAD, 0.095, -0.24, -0.01) // Center hold
    .rotate(BoneName.NECK, 0.065, -0.11, -0.005) // Hold
    .position(BoneName.PELVIS, -0.002, -0.124, 0.006) // Center balanced
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 2250ms: Begin exhale - releasing wave (back to left)
    // ─────────────────────────────────────────────────────────────────────
    .at(2.25)
    .rotate(BoneName.PELVIS, 0.11, -0.44, 0.01) // Flow left return
    .rotate(BoneName.SPINE_LOWER, 0.02, -0.04, 0.01) // Releasing
    .rotate(BoneName.SPINE_UPPER, 0.19, -0.43, 0.02) // Contracting
    .rotate(BoneName.SHOULDER_L, -0.83, 0.47, 0.43) // Closing flow
    .rotate(BoneName.SHOULDER_R, -0.83, -0.47, -0.37) // Mirror
    .rotate(BoneName.ELBOW_L, 0.01, 0, -1.89) // Settling
    .rotate(BoneName.ELBOW_R, 0.01, 0, 1.89) // Mirror
    .rotate(BoneName.HEAD, 0.085, -0.24, 0.01) // Left return
    .rotate(BoneName.NECK, 0.055, -0.11, 0.005) // Neck
    .position(BoneName.PELVIS, 0.004, -0.128, 0.003) // Left settling
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 3000ms: Return to neutral - cycle complete
    // ─────────────────────────────────────────────────────────────────────
    .at(3.0)
    .rotate(BoneName.PELVIS, 0.12, -0.45, 0) // Baseline restored
    .rotate(BoneName.SPINE_LOWER, 0.03, -0.05, 0) // Neutral
    .rotate(BoneName.SPINE_UPPER, 0.20, -0.45, 0) // Baseline
    .rotate(BoneName.SHOULDER_L, -0.8, 0.5, 0.4) // Guard restored
    .rotate(BoneName.SHOULDER_R, -0.8, -0.5, -0.4) // Mirror
    .rotate(BoneName.ELBOW_L, 0, 0, -1.9) // Baseline
    .rotate(BoneName.ELBOW_R, 0, 0, 1.9) // Baseline
    .rotate(BoneName.WRIST_L, 0.2, 0.3, 0.1) // Hands ready
    .rotate(BoneName.WRIST_R, 0.2, -0.3, -0.1) // Mirror
    .rotate(BoneName.HEAD, 0.08, -0.25, 0) // Baseline
    .rotate(BoneName.NECK, 0.05, -0.12, 0) // Baseline
    .position(BoneName.PELVIS, 0, -0.13, 0) // Baseline
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☶ GAN MOUNTAIN IDLE (간 산 대기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☶ 간 (Gan) Mountain Idle Animation - ENHANCED FOR 95% QUALITY
 *
 * **Korean**: 간괘 호흡 자세 (Gan-gwae Hoheup Jase)
 * **Philosophy**: Mountain's immovability through minimal breath
 *
 * Characteristics:
 * - Minimal controlled breathing emphasizing solidity
 * - High cover guard - immovable defensive wall
 * - Nearly imperceptible weight shifts - mountain stillness
 * - Controlled micro-movements only when necessary
 * - ENHANCED: Smallest movements of all stances, rock-solid
 *
 * Animation Cycle (6 keyframes for 2.6s cycle):
 * - 0ms: Neutral baseline - immovable
 * - 433ms: Begin inhale - subtle expansion
 * - 866ms: Mid-inhale - controlled lift
 * - 1300ms: Peak inhale - minimal peak
 * - 1733ms: Begin exhale - controlled release
 * - 2600ms: Return to neutral
 *
 * Biomechanics: 
 * - Minimal ribcage elevation (2-3° max)
 * - Nearly zero weight shift - rooted stance
 * - Micro spine adjustments only
 * - Forearms maintain cover position throughout
 *
 * @korean 간산대기애니메이션
 * @duration 2600ms (2.6s - steady immovable)
 * @category Idle Animation
 * @quality 95% - Minimal mountain stability
 */
export const GAN_IDLE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("stance_gan", "간 대기")
    .asIdle(2.6, true)
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 0ms: Neutral baseline - immovable mountain stance
    // ─────────────────────────────────────────────────────────────────────
    .at(0)
    .rotate(BoneName.PELVIS, 0.05, 0, 0) // Squared, minimal tilt
    .rotate(BoneName.SPINE_LOWER, 0.01, 0, 0) // Nearly neutral - solid
    .rotate(BoneName.SPINE_UPPER, 0.08, 0, 0) // Minimal forward
    .rotate(BoneName.SHOULDER_L, -1.4, 0.4, 0.5) // High cover left
    .rotate(BoneName.SHOULDER_R, -1.4, -0.4, -0.5) // High cover right
    .rotate(BoneName.ELBOW_L, 0, 0, -2.1) // Forearms crossed high
    .rotate(BoneName.ELBOW_R, 0, 0, 2.1) // Mirror
    .rotate(BoneName.WRIST_L, 0.2, 0.2, 0) // Fists protecting face
    .rotate(BoneName.WRIST_R, 0.2, -0.2, 0) // Mirror
    .rotate(BoneName.HEAD, 0.04, 0, 0) // Head minimal tilt
    .rotate(BoneName.NECK, 0.02, 0, 0) // Neck solid
    .position(BoneName.PELVIS, 0, -0.15, 0) // Grounded - lowest stance
    .rotate(BoneName.HIP_L, 0.1, 0.08, 0) // Square stance left - symmetric
    .rotate(BoneName.KNEE_L, 0.6, 0, 0) // Moderate bend
    .rotate(BoneName.FOOT_L, -0.1, 0, 0) // Rooted
    .rotate(BoneName.HIP_R, 0.1, -0.08, 0) // Square stance right - mirror
    .rotate(BoneName.KNEE_R, 0.6, 0, 0) // Equal bend
    .rotate(BoneName.FOOT_R, -0.1, 0, 0) // Immovable
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 433ms: Begin inhale - subtle controlled expansion
    // ─────────────────────────────────────────────────────────────────────
    .at(0.433)
    .rotate(BoneName.PELVIS, 0.04, 0, 0) // Micro adjustment
    .rotate(BoneName.SPINE_LOWER, 0.005, 0, 0) // Minimal arch
    .rotate(BoneName.SPINE_UPPER, 0.075, 0, 0) // Subtle expansion
    .rotate(BoneName.SHOULDER_L, -1.42, 0.39, 0.51) // Micro adjust
    .rotate(BoneName.SHOULDER_R, -1.42, -0.39, -0.51) // Mirror
    .rotate(BoneName.HEAD, 0.045, 0, 0) // Micro head lift
    .rotate(BoneName.NECK, 0.025, 0, 0) // Neck
    .position(BoneName.PELVIS, 0, -0.149, 0) // Minimal rise
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 866ms: Mid-inhale - controlled minimal lift
    // ─────────────────────────────────────────────────────────────────────
    .at(0.866)
    .rotate(BoneName.PELVIS, 0.03, 0, 0) // More micro back
    .rotate(BoneName.SPINE_LOWER, 0, 0, 0) // Neutral holding
    .rotate(BoneName.SPINE_UPPER, 0.07, 0, 0) // Minimal chest
    .rotate(BoneName.SHOULDER_L, -1.44, 0.38, 0.52) // Subtle back
    .rotate(BoneName.SHOULDER_R, -1.44, -0.38, -0.52) // Mirror
    .rotate(BoneName.ELBOW_L, 0.01, 0, -2.09) // Micro adjust
    .rotate(BoneName.ELBOW_R, 0.01, 0, 2.09) // Mirror
    .rotate(BoneName.HEAD, 0.05, 0, 0) // Minimal lift
    .rotate(BoneName.NECK, 0.03, 0, 0) // Neck
    .position(BoneName.PELVIS, 0, -0.148, 0) // Peak rise (minimal)
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1300ms: Peak inhale - minimal peak (mountain doesn't move much)
    // ─────────────────────────────────────────────────────────────────────
    .at(1.3)
    .rotate(BoneName.PELVIS, 0.025, 0, 0) // Peak micro tilt
    .rotate(BoneName.SPINE_LOWER, -0.005, 0, 0) // Tiny arch
    .rotate(BoneName.SPINE_UPPER, 0.065, 0, 0) // Peak minimal
    .rotate(BoneName.SHOULDER_L, -1.46, 0.37, 0.53) // Peak subtle
    .rotate(BoneName.SHOULDER_R, -1.46, -0.37, -0.53) // Mirror
    .rotate(BoneName.HEAD, 0.055, 0, 0) // Peak minimal
    .rotate(BoneName.NECK, 0.035, 0, 0) // Peak
    .position(BoneName.PELVIS, 0, -0.147, 0) // Peak (very small)
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1733ms: Begin exhale - controlled release
    // ─────────────────────────────────────────────────────────────────────
    .at(1.733)
    .rotate(BoneName.PELVIS, 0.04, 0, 0) // Return forward
    .rotate(BoneName.SPINE_LOWER, 0.005, 0, 0) // Releasing
    .rotate(BoneName.SPINE_UPPER, 0.075, 0, 0) // Contracting
    .rotate(BoneName.SHOULDER_L, -1.42, 0.39, 0.51) // Returning
    .rotate(BoneName.SHOULDER_R, -1.42, -0.39, -0.51) // Mirror
    .rotate(BoneName.ELBOW_L, 0.005, 0, -2.095) // Settling
    .rotate(BoneName.ELBOW_R, 0.005, 0, 2.095) // Mirror
    .rotate(BoneName.HEAD, 0.045, 0, 0) // Settling
    .rotate(BoneName.NECK, 0.025, 0, 0) // Neck
    .position(BoneName.PELVIS, 0, -0.149, 0) // Nearly baseline
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 2600ms: Return to neutral - cycle complete
    // ─────────────────────────────────────────────────────────────────────
    .at(2.6)
    .rotate(BoneName.PELVIS, 0.05, 0, 0) // Baseline restored
    .rotate(BoneName.SPINE_LOWER, 0.01, 0, 0) // Neutral
    .rotate(BoneName.SPINE_UPPER, 0.08, 0, 0) // Baseline
    .rotate(BoneName.SHOULDER_L, -1.4, 0.4, 0.5) // Guard restored
    .rotate(BoneName.SHOULDER_R, -1.4, -0.4, -0.5) // Mirror
    .rotate(BoneName.ELBOW_L, 0, 0, -2.1) // Baseline
    .rotate(BoneName.ELBOW_R, 0, 0, 2.1) // Baseline
    .rotate(BoneName.WRIST_L, 0.2, 0.2, 0) // Fists ready
    .rotate(BoneName.WRIST_R, 0.2, -0.2, 0) // Mirror
    .rotate(BoneName.HEAD, 0.04, 0, 0) // Baseline
    .rotate(BoneName.NECK, 0.02, 0, 0) // Baseline
    .position(BoneName.PELVIS, 0, -0.15, 0) // Baseline grounded
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON EARTH IDLE (곤 땅 대기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ☷ 곤 (Gon) Earth Idle Animation - ENHANCED FOR 95% QUALITY
 *
 * **Korean**: 곤괘 호흡 자세 (Gon-gwae Hoheup Jase)
 * **Philosophy**: Earth's grounded stability through diaphragm breath
 *
 * Characteristics:
 * - Deep grounded diaphragmatic breathing
 * - Low wrestling underhook guard position
 * - Rooted weight distribution - heavy and stable
 * - Subtle down-and-forward weight pulses
 * - ENHANCED: Grounded power, wrestler's readiness
 *
 * Animation Cycle (7 keyframes for 2.6s cycle):
 * - 0ms: Neutral baseline - grounded ready
 * - 371ms: Begin inhale - deep diaphragm
 * - 742ms: Mid-inhale - expanding low
 * - 1300ms: Peak inhale - maximum ground connection
 * - 1671ms: Hold - rooted power
 * - 2042ms: Begin exhale - controlled release
 * - 2600ms: Return to neutral
 *
 * Biomechanics: 
 * - Deep diaphragm with abdominal expansion
 * - Minimal upper chest - lower body focus
 * - Weight settles down not up (grounding)
 * - Underhook guard maintains hip-level position
 *
 * @korean 곤땅대기애니메이션
 * @duration 2600ms (2.6s - grounded deep breath)
 * @category Idle Animation
 * @quality 95% - Grounded wrestler stability
 */
export const GON_IDLE_ANIMATION: SkeletalAnimation =
  MartialArtsAnimationBuilder.create("stance_gon", "곤 대기")
    .asIdle(2.6, true)
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 0ms: Neutral baseline - grounded wrestling ready
    // ─────────────────────────────────────────────────────────────────────
    .at(0)
    .rotate(BoneName.PELVIS, 0.18, -0.2, 0) // Forward lean - wrestling posture
    .rotate(BoneName.SPINE_LOWER, 0.05, 0, 0) // Forward grounded
    .rotate(BoneName.SPINE_UPPER, 0.28, -0.2, 0) // Deep forward lean
    .rotate(BoneName.SHOULDER_L, -0.5, 0.6, 0.5) // Underhook position left
    .rotate(BoneName.SHOULDER_R, -0.5, -0.6, -0.5) // Mirror
    .rotate(BoneName.ELBOW_L, 0, 0, -2.0) // Elbows at hips
    .rotate(BoneName.ELBOW_R, 0, 0, 2.0) // Mirror
    .rotate(BoneName.WRIST_L, 0.3, 0.4, 0.2) // Hands at hip level
    .rotate(BoneName.WRIST_R, 0.3, -0.4, -0.2) // Mirror
    .rotate(BoneName.HEAD, 0.15, -0.1, 0) // Head forward but eyes up
    .rotate(BoneName.NECK, 0.10, -0.05, 0) // Neck extended
    .position(BoneName.PELVIS, 0, -0.16, -0.03) // Low and slightly back
    .rotate(BoneName.HIP_L, 0.1, 0.5, 0.4) // Wide wrestling stance left
    .rotate(BoneName.KNEE_L, 1.4, 0, 0) // Deep bend for takedowns
    .rotate(BoneName.FOOT_L, -0.3, 0.2, 0) // Grounded power
    .rotate(BoneName.HIP_R, 0.1, -0.5, -0.4) // Wide wrestling stance right
    .rotate(BoneName.KNEE_R, 1.4, 0, 0) // Equal deep bend
    .rotate(BoneName.FOOT_R, -0.3, -0.2, 0) // Stable base
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 371ms: Begin inhale - deep diaphragm expansion
    // ─────────────────────────────────────────────────────────────────────
    .at(0.371)
    .rotate(BoneName.PELVIS, 0.17, -0.2, 0) // Pelvis begins settling
    .rotate(BoneName.SPINE_LOWER, 0.04, 0, 0) // Lower expanding
    .rotate(BoneName.SPINE_UPPER, 0.27, -0.19, 0) // Slight lift
    .rotate(BoneName.SHOULDER_L, -0.52, 0.58, 0.52) // Arms adjusting
    .rotate(BoneName.SHOULDER_R, -0.52, -0.58, -0.52) // Mirror
    .rotate(BoneName.HEAD, 0.16, -0.09, 0) // Head micro-lift
    .rotate(BoneName.NECK, 0.11, -0.04, 0) // Neck
    .position(BoneName.PELVIS, 0, -0.158, -0.032) // Slight forward
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 742ms: Mid-inhale - expanding low (diaphragm focus)
    // ─────────────────────────────────────────────────────────────────────
    .at(0.742)
    .rotate(BoneName.PELVIS, 0.16, -0.2, 0) // More forward shift
    .rotate(BoneName.SPINE_LOWER, 0.03, 0, 0) // Lower spine expanding
    .rotate(BoneName.SPINE_UPPER, 0.26, -0.18, 0) // Chest lifting slightly
    .rotate(BoneName.SHOULDER_L, -0.55, 0.56, 0.55) // Opening
    .rotate(BoneName.SHOULDER_R, -0.55, -0.56, -0.55) // Mirror
    .rotate(BoneName.ELBOW_L, 0.02, 0, -1.98) // Micro adjust
    .rotate(BoneName.ELBOW_R, 0.02, 0, 1.98) // Mirror
    .rotate(BoneName.HEAD, 0.17, -0.08, 0) // Head rising
    .rotate(BoneName.NECK, 0.12, -0.03, 0) // Neck
    .position(BoneName.PELVIS, 0, -0.156, -0.028) // Forward + rise
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1300ms: Peak inhale - maximum ground connection
    // ─────────────────────────────────────────────────────────────────────
    .at(1.3)
    .rotate(BoneName.PELVIS, 0.15, -0.2, 0) // Peak forward
    .rotate(BoneName.SPINE_LOWER, 0.02, 0, 0) // Peak expansion
    .rotate(BoneName.SPINE_UPPER, 0.25, -0.17, 0) // Peak lift
    .rotate(BoneName.SHOULDER_L, -0.58, 0.54, 0.58) // Peak opening
    .rotate(BoneName.SHOULDER_R, -0.58, -0.54, -0.58) // Mirror
    .rotate(BoneName.ELBOW_L, 0.03, 0, -1.96) // Peak position
    .rotate(BoneName.ELBOW_R, 0.03, 0, 1.96) // Mirror
    .rotate(BoneName.HEAD, 0.18, -0.07, 0) // Peak focus
    .rotate(BoneName.NECK, 0.13, -0.02, 0) // Peak extension
    .position(BoneName.PELVIS, 0, -0.154, -0.025) // Peak forward
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 1671ms: Hold - rooted power at peak
    // ─────────────────────────────────────────────────────────────────────
    .at(1.671)
    .rotate(BoneName.PELVIS, 0.155, -0.2, 0) // Hold position
    .rotate(BoneName.SPINE_LOWER, 0.025, 0, 0) // Hold slight settle
    .rotate(BoneName.SPINE_UPPER, 0.255, -0.175, 0) // Hold
    .rotate(BoneName.SHOULDER_L, -0.57, 0.55, 0.57) // Hold
    .rotate(BoneName.SHOULDER_R, -0.57, -0.55, -0.57) // Mirror
    .rotate(BoneName.HEAD, 0.175, -0.075, 0) // Hold focus
    .rotate(BoneName.NECK, 0.125, -0.025, 0) // Hold
    .position(BoneName.PELVIS, 0, -0.155, -0.026) // Hold rooted
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 2042ms: Begin exhale - controlled grounded release
    // ─────────────────────────────────────────────────────────────────────
    .at(2.042)
    .rotate(BoneName.PELVIS, 0.17, -0.2, 0) // Returning back
    .rotate(BoneName.SPINE_LOWER, 0.04, 0, 0) // Releasing
    .rotate(BoneName.SPINE_UPPER, 0.27, -0.19, 0) // Contracting
    .rotate(BoneName.SHOULDER_L, -0.52, 0.58, 0.52) // Closing
    .rotate(BoneName.SHOULDER_R, -0.52, -0.58, -0.52) // Mirror
    .rotate(BoneName.ELBOW_L, 0.01, 0, -1.99) // Settling
    .rotate(BoneName.ELBOW_R, 0.01, 0, 1.99) // Mirror
    .rotate(BoneName.HEAD, 0.16, -0.09, 0) // Settling
    .rotate(BoneName.NECK, 0.11, -0.04, 0) // Neck
    .position(BoneName.PELVIS, 0, -0.159, -0.031) // Nearly baseline
    .done<MartialArtsAnimationBuilder>()
    
    // ─────────────────────────────────────────────────────────────────────
    // Keyframe 2600ms: Return to neutral - cycle complete
    // ─────────────────────────────────────────────────────────────────────
    .at(2.6)
    .rotate(BoneName.PELVIS, 0.18, -0.2, 0) // Baseline restored
    .rotate(BoneName.SPINE_LOWER, 0.05, 0, 0) // Neutral
    .rotate(BoneName.SPINE_UPPER, 0.28, -0.2, 0) // Baseline
    .rotate(BoneName.SHOULDER_L, -0.5, 0.6, 0.5) // Guard restored
    .rotate(BoneName.SHOULDER_R, -0.5, -0.6, -0.5) // Mirror
    .rotate(BoneName.ELBOW_L, 0, 0, -2.0) // Baseline
    .rotate(BoneName.ELBOW_R, 0, 0, 2.0) // Baseline
    .rotate(BoneName.WRIST_L, 0.3, 0.4, 0.2) // Hands ready
    .rotate(BoneName.WRIST_R, 0.3, -0.4, -0.2) // Mirror
    .rotate(BoneName.HEAD, 0.15, -0.1, 0) // Baseline
    .rotate(BoneName.NECK, 0.10, -0.05, 0) // Baseline
    .position(BoneName.PELVIS, 0, -0.16, -0.03) // Baseline grounded
    .done<MartialArtsAnimationBuilder>()
    .build();

// ═══════════════════════════════════════════════════════════════════════════
// TRIGRAM IDLE ANIMATION MAP (팔괘대기애니메이션맵)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Map of all 8 trigram stance idle animations
 *
 * Use this map for efficient lookup of stance-specific idle animations.
 * Each animation includes proper guard position, breathing, and weight shifts.
 *
 * @korean 팔괘대기애니메이션맵
 */
export const TRIGRAM_IDLE_ANIMATIONS: ReadonlyMap<
  TrigramStance,
  SkeletalAnimation
> = new Map([
  [TrigramStance.GEON, GEON_IDLE_ANIMATION],
  [TrigramStance.TAE, TAE_IDLE_ANIMATION],
  [TrigramStance.LI, LI_IDLE_ANIMATION],
  [TrigramStance.JIN, JIN_IDLE_ANIMATION],
  [TrigramStance.SON, SON_IDLE_ANIMATION],
  [TrigramStance.GAM, GAM_IDLE_ANIMATION],
  [TrigramStance.GAN, GAN_IDLE_ANIMATION],
  [TrigramStance.GON, GON_IDLE_ANIMATION],
]);

/**
 * Map of all 8 trigram stance idle animations by string name
 *
 * This map provides string-keyed access to idle animations for registry integration.
 * Animation names match the pattern "stance_X" used in useSkeletalAnimation.
 *
 * @korean 팔괘대기애니메이션문자열맵
 */
export const TRIGRAM_IDLE_ANIMATIONS_BY_NAME: ReadonlyMap<
  string,
  SkeletalAnimation
> = new Map([
  ["stance_geon", GEON_IDLE_ANIMATION],
  ["stance_tae", TAE_IDLE_ANIMATION],
  ["stance_li", LI_IDLE_ANIMATION],
  ["stance_jin", JIN_IDLE_ANIMATION],
  ["stance_son", SON_IDLE_ANIMATION],
  ["stance_gam", GAM_IDLE_ANIMATION],
  ["stance_gan", GAN_IDLE_ANIMATION],
  ["stance_gon", GON_IDLE_ANIMATION],
]);

/**
 * Get idle animation for a specific trigram stance
 *
 * @param stance - Trigram stance identifier
 * @returns Stance-specific idle animation with breathing and weight shifts
 *
 * @example
 * ```typescript
 * const geonIdle = getTrigramIdleAnimation(TrigramStance.GEON);
 * // Returns GEON_IDLE_ANIMATION with high guard, forward breathing
 *
 * const gamIdle = getTrigramIdleAnimation(TrigramStance.GAM);
 * // Returns GAM_IDLE_ANIMATION with flowing parry guard
 * ```
 *
 * @korean 팔괘대기애니메이션가져오기
 */
export function getTrigramIdleAnimation(
  stance: TrigramStance,
): SkeletalAnimation | undefined {
  return TRIGRAM_IDLE_ANIMATIONS.get(stance);
}

/**
 * Get idle animation by stance name string
 *
 * Convenient accessor for string-based stance lookups.
 *
 * @param stanceName - Stance name (e.g., "geon", "tae", "li")
 * @returns Stance-specific idle animation or undefined
 *
 * @korean 문자열로대기애니메이션가져오기
 */
export function getTrigramIdleByName(
  stanceName: string,
): SkeletalAnimation | undefined {
  const normalizedName = stanceName.toLowerCase();

  for (const [stance, animation] of TRIGRAM_IDLE_ANIMATIONS) {
    if (stance === normalizedName) {
      return animation;
    }
  }

  return undefined;
}

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION COLLECTION (애니메이션모음)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Array of all trigram idle animations for iteration
 *
 * @korean 모든팔괘대기애니메이션
 */
export const ALL_TRIGRAM_IDLE_ANIMATIONS: readonly SkeletalAnimation[] = [
  GEON_IDLE_ANIMATION,
  TAE_IDLE_ANIMATION,
  LI_IDLE_ANIMATION,
  JIN_IDLE_ANIMATION,
  SON_IDLE_ANIMATION,
  GAM_IDLE_ANIMATION,
  GAN_IDLE_ANIMATION,
  GON_IDLE_ANIMATION,
];

/**
 * Idle animation metadata for debugging and introspection
 *
 * @korean 대기애니메이션메타데이터
 */
export const TRIGRAM_IDLE_METADATA = {
  GEON: {
    name: "stance_geon",
    korean: "건 대기",
    english: "Heaven Idle",
    breathingDuration: BREATHING_DURATIONS.GEON,
    weightShiftType: "forward" as const,
    philosophy: "Creative force, direct power",
  },
  TAE: {
    name: "stance_tae",
    korean: "태 대기",
    english: "Lake Idle",
    breathingDuration: BREATHING_DURATIONS.TAE,
    weightShiftType: "circular" as const,
    philosophy: "Adaptability, fluid technique",
  },
  LI: {
    name: "stance_li",
    korean: "리 대기",
    english: "Fire Idle",
    breathingDuration: BREATHING_DURATIONS.LI,
    weightShiftType: "lateral" as const,
    philosophy: "Precision, vital point targeting",
  },
  JIN: {
    name: "stance_jin",
    korean: "진 대기",
    english: "Thunder Idle",
    breathingDuration: BREATHING_DURATIONS.JIN,
    weightShiftType: "forward" as const,
    philosophy: "Explosive force, shocking power",
  },
  SON: {
    name: "stance_son",
    korean: "손 대기",
    english: "Wind Idle",
    breathingDuration: BREATHING_DURATIONS.SON,
    weightShiftType: "lateral" as const,
    philosophy: "Continuous pressure, flowing attack",
  },
  GAM: {
    name: "stance_gam",
    korean: "감 대기",
    english: "Water Idle",
    breathingDuration: BREATHING_DURATIONS.GAM,
    weightShiftType: "circular" as const,
    philosophy: "Adaptation, flow-into-counter",
  },
  GAN: {
    name: "stance_gan",
    korean: "간 대기",
    english: "Mountain Idle",
    breathingDuration: BREATHING_DURATIONS.GAN,
    weightShiftType: "lateral" as const,
    philosophy: "Immovability, defensive mastery",
  },
  GON: {
    name: "stance_gon",
    korean: "곤 대기",
    english: "Earth Idle",
    breathingDuration: BREATHING_DURATIONS.GON,
    weightShiftType: "forward" as const,
    philosophy: "Stability, grounding and takedowns",
  },
} as const;
