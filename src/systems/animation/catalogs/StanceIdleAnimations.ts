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
 * Natural breathing has 4 phases:
 * 1. Inhale (0.0-0.4): Smooth rise
 * 2. Peak hold (0.4-0.5): Brief pause
 * 3. Exhale (0.5-0.9): Smooth fall
 * 4. Valley hold (0.9-1.0): Brief pause
 *
 * @param phase - Breathing phase (0-1)
 * @param min - Minimum scale (exhale)
 * @param max - Maximum scale (inhale peak)
 * @returns Scale factor for chest/torso
 */
function calculateBreathingScale(
  phase: number,
  min: number,
  max: number,
): number {
  // Natural breathing with holds at peak/valley
  let breathValue: number;
  
  if (phase < 0.4) {
    // Inhale phase: smooth rise (0-0.4)
    const inhalePhase = phase / 0.4;
    breathValue = Math.sin(inhalePhase * Math.PI * 0.5); // 0 to 1
  } else if (phase < 0.5) {
    // Peak hold (0.4-0.5)
    breathValue = 1.0;
  } else if (phase < 0.9) {
    // Exhale phase: smooth fall (0.5-0.9)
    const exhalePhase = (phase - 0.5) / 0.4;
    breathValue = Math.cos(exhalePhase * Math.PI * 0.5); // 1 to 0
  } else {
    // Valley hold (0.9-1.0)
    breathValue = 0.0;
  }
  
  // Map to min/max range
  return min + breathValue * (max - min);
}

/**
 * Calculates torso expansion for breathing effect
 *
 * @param breathingScale - Current breathing scale (0.96-1.04)
 * @returns Torso rotation adjustment for breathing (chest expansion forward)
 */
function calculateTorsoBreathingOffset(breathingScale: number): number {
  // Chest expands forward slightly on inhale (natural thoracic extension)
  // Typical breathing expansion: 0.05-0.15 radians (3-8 degrees)
  return (breathingScale - 1) * 0.4;
}

/**
 * Calculates shoulder rise/fall during breathing
 *
 * @param breathingScale - Current breathing scale (0.96-1.04)
 * @returns Shoulder rotation adjustment (very subtle upward rotation on inhale)
 */
function calculateShoulderBreathing(breathingScale: number): number {
  // Shoulders rise slightly on inhale (very subtle - 1-2 degrees)
  // Natural clavicle elevation during respiration
  return (breathingScale - 1) * 0.15;
}

/**
 * Calculates subtle head movement during breathing
 *
 * @param phase - Breathing phase (0-1)
 * @param intensity - Movement intensity (0-1, stance-specific)
 * @returns Head rotation adjustment for natural idle motion
 */
function calculateHeadMovement(phase: number, intensity: number): {
  pitch: number; // X-axis (nod)
  yaw: number;   // Y-axis (turn)
  roll: number;  // Z-axis (tilt)
} {
  // Very subtle head micro-movements for natural idle
  // Fighters maintain awareness with small tracking movements
  const nodCycle = Math.sin(phase * Math.PI * 2) * 0.02 * intensity;
  const turnCycle = Math.sin(phase * Math.PI * 3 + 0.5) * 0.015 * intensity;
  const tiltCycle = Math.sin(phase * Math.PI * 2.5 + 1.0) * 0.01 * intensity;
  
  return {
    pitch: nodCycle,
    yaw: turnCycle,
    roll: tiltCycle,
  };
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
  // Very subtle knee flex synchronized with breathing
  // Single smooth cycle per breath (not double)
  const bouncePhase = Math.sin(phase * Math.PI * 2 - Math.PI * 0.5);
  return bouncePhase * amplitude * 0.12; // Slightly reduced for more natural look
}

/**
 * Calculates stance-specific micro-movements
 *
 * Each stance has unique micro-adjustments reflecting its philosophy:
 * - Guard hand float/tension
 * - Weight shift readiness
 * - Finger/fist micro-adjustments
 *
 * @param phase - Movement phase (0-1)
 * @param stanceType - Type of micro-movement for this stance
 * @returns Movement adjustments for stance character
 */
function calculateStanceMicroMovement(
  phase: number,
  stanceType: 'aggressive' | 'fluid' | 'precise' | 'coiled' | 'flowing' | 'adaptive' | 'solid' | 'grounded',
): { guardFloat: number; weightShift: number } {
  switch (stanceType) {
    case 'aggressive': // Geon - forward pressure micro-shifts
      return {
        guardFloat: Math.sin(phase * Math.PI * 3) * 0.01,
        weightShift: Math.sin(phase * Math.PI * 2 + 0.3) * 0.008,
      };
    case 'fluid': // Tae - circular flowing micro-shifts
      return {
        guardFloat: Math.sin(phase * Math.PI * 2.5) * 0.015,
        weightShift: Math.sin(phase * Math.PI * 2 - 0.5) * 0.012,
      };
    case 'precise': // Li - minimal, controlled micro-adjustments
      return {
        guardFloat: Math.sin(phase * Math.PI * 4) * 0.005,
        weightShift: Math.sin(phase * Math.PI * 3) * 0.003,
      };
    case 'coiled': // Jin - spring tension micro-pulses
      return {
        guardFloat: Math.sin(phase * Math.PI * 3.5) * 0.012,
        weightShift: Math.sin(phase * Math.PI * 2.5 + 0.8) * 0.01,
      };
    case 'flowing': // Son - continuous rhythmic micro-flow
      return {
        guardFloat: Math.sin(phase * Math.PI * 3 + 0.2) * 0.013,
        weightShift: Math.sin(phase * Math.PI * 2 - 0.3) * 0.01,
      };
    case 'adaptive': // Gam - responsive circular micro-shifts
      return {
        guardFloat: Math.sin(phase * Math.PI * 2.3) * 0.014,
        weightShift: Math.sin(phase * Math.PI * 2 + 0.6) * 0.011,
      };
    case 'solid': // Gan - minimal mountain stability
      return {
        guardFloat: Math.sin(phase * Math.PI * 2) * 0.004,
        weightShift: Math.sin(phase * Math.PI * 2) * 0.002,
      };
    case 'grounded': // Gon - stable grounded micro-adjustments
      return {
        guardFloat: Math.sin(phase * Math.PI * 2.5) * 0.007,
        weightShift: Math.sin(phase * Math.PI * 2 + 0.4) * 0.006,
      };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// GUARD POSE APPLICATION HELPERS (방어자세적용헬퍼)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Applies a complete guard pose to a KeyframeConfig with breathing enhancements
 *
 * DESIGN: Idle animations should include:
 * - Chest breathing (torso expansion)
 * - Shoulder rise/fall (natural respiration)
 * - Subtle head movement (awareness tracking)
 * - Subtle knee bounce (slight knee flex variation)
 * - Guard micro-adjustments (stance-specific)
 * NO pelvis X/Z position movement (causes "walking in place" appearance)
 *
 * @param kf - KeyframeConfig to apply pose to
 * @param pose - Guard pose to apply
 * @param breathingOffset - Torso breathing offset
 * @param shoulderOffset - Shoulder rise/fall offset
 * @param headMovement - Head micro-movement adjustments
 * @param kneeBounce - Subtle knee flex adjustment for bounce effect
 * @param guardAdjustment - Guard hand micro-adjustment
 */
function applyGuardPoseToKeyframe(
  kf: KeyframeConfig,
  pose: StanceGuardPose,
  breathingOffset: number,
  shoulderOffset: number,
  headMovement: { pitch: number; yaw: number; roll: number },
  kneeBounce: number = 0,
  guardAdjustment: number = 0,
): void {
  // === ARM POSITIONS (팔 위치) ===
  // IMPORTANT: Use SHOULDER_L/R, ELBOW_L/R, WRIST_L/R bone names
  // NOT UPPER_ARM, FOREARM, HAND - those are different bones in the hierarchy!

  // Left arm - shoulder controls arm lift/rotation with breathing
  kf.rotate(
    BoneName.SHOULDER_L,
    pose.leftArm.shoulder.x + shoulderOffset + guardAdjustment * 0.3,
    pose.leftArm.shoulder.y,
    pose.leftArm.shoulder.z + guardAdjustment * 0.2,
  );
  // Elbow controls forearm bend with subtle guard float
  kf.rotate(
    BoneName.ELBOW_L,
    pose.leftArm.elbow.x + guardAdjustment * 0.15,
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

  // Right arm - mirror bone hierarchy with breathing
  kf.rotate(
    BoneName.SHOULDER_R,
    pose.rightArm.shoulder.x + shoulderOffset + guardAdjustment * 0.3,
    pose.rightArm.shoulder.y,
    pose.rightArm.shoulder.z - guardAdjustment * 0.2,
  );
  kf.rotate(
    BoneName.ELBOW_R,
    pose.rightArm.elbow.x + guardAdjustment * 0.15,
    pose.rightArm.elbow.y,
    pose.rightArm.elbow.z,
  );
  kf.rotate(
    BoneName.WRIST_R,
    pose.rightArm.wrist.x,
    pose.rightArm.wrist.y,
    pose.rightArm.wrist.z,
  );

  // === HEAD (머리) - Subtle tracking and awareness ===
  // Natural idle head micro-movements for realism
  kf.rotate(
    BoneName.HEAD,
    headMovement.pitch,
    headMovement.yaw,
    headMovement.roll,
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
 * Creates Geon idle animation with natural breathing and micro-movements
 *
 * Heaven stance: Powerful, confident breathing with forward pressure
 * - Chest expansion breathing (2.4s cycle)
 * - Subtle shoulder rise/fall
 * - Alert head tracking
 * - Aggressive guard micro-adjustments
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

  // Generate keyframes with natural breathing and stance character
  for (let i = 0; i <= frames; i++) {
    const phase = i / frames;
    const frameTime = phase * duration;
    
    // Natural breathing cycle
    const breathingScale = calculateBreathingScale(phase, min, max);
    const breathingOffset = calculateTorsoBreathingOffset(breathingScale);
    const shoulderOffset = calculateShoulderBreathing(breathingScale);
    
    // Head tracking (moderate intensity for alert stance)
    const headMovement = calculateHeadMovement(phase, 0.6);
    
    // Stance-specific micro-movements
    const microMove = calculateStanceMicroMovement(phase, 'aggressive');
    const kneeBounce = calculateKneeBounce(phase, amplitude);

    const kf = builder.at(frameTime);
    applyGuardPoseToKeyframe(
      kf,
      pose,
      breathingOffset,
      shoulderOffset,
      headMovement,
      kneeBounce,
      microMove.guardFloat,
    );
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
 * Creates Tae idle animation with natural breathing and micro-movements
 *
 * Lake stance: Fluid, rippling breath with circular flow
 * - Flowing wave breathing (2.8s cycle)
 * - Gentle shoulder rise/fall
 * - Calm head tracking
 * - Fluid guard micro-adjustments
 */
function createTaeIdleAnimation(): SkeletalAnimation {
  const pose = TAE_FLUID_GUARD_POSE;
  const { min, max } = pose.breathingRange;
  const duration = BREATHING_DURATIONS.TAE;
  const amplitude = WEIGHT_SHIFT_AMPLITUDES.TAE;
  const frames = STANCE_GUARD_CONFIGS.tae.breathingFrames;

  const builder = MartialArtsAnimationBuilder.create(
    "stance_tae",
    "태 대기",
  ).asIdle(duration, true);

  for (let i = 0; i <= frames; i++) {
    const phase = i / frames;
    const frameTime = phase * duration;
    
    // Natural breathing cycle
    const breathingScale = calculateBreathingScale(phase, min, max);
    const breathingOffset = calculateTorsoBreathingOffset(breathingScale);
    const shoulderOffset = calculateShoulderBreathing(breathingScale);
    
    // Head tracking (high intensity for adaptive awareness)
    const headMovement = calculateHeadMovement(phase, 0.8);
    
    // Stance-specific micro-movements
    const microMove = calculateStanceMicroMovement(phase, 'fluid');
    const kneeBounce = calculateKneeBounce(phase, amplitude);

    const kf = builder.at(frameTime);
    applyGuardPoseToKeyframe(
      kf,
      pose,
      breathingOffset,
      shoulderOffset,
      headMovement,
      kneeBounce,
      microMove.guardFloat,
    );
    kf.done<MartialArtsAnimationBuilder>();
  }

  return builder.build();
}

/**
 * ☱ 태 (Tae) Lake Idle Animation
 *
 * Fluid mid-guard stance with flowing breath rhythm.
 * Lead hand ready for parrying, rear protects chin.
 *
 * **Breathing**: Flowing waves (2.8s cycle)
 * **Weight**: Circular flowing shifts
 * **Philosophy**: Lake's adaptability, fluid technique
 *
 * @korean 태연못대기애니메이션
 */
export const TAE_IDLE_ANIMATION: SkeletalAnimation = createTaeIdleAnimation();

// ═══════════════════════════════════════════════════════════════════════════
// ☲ LI FIRE IDLE (리 불 대기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates Li idle animation with natural breathing and micro-movements
 *
 * Fire stance: Sharp, controlled precision breathing
 * - Controlled breathing (1.8s cycle)
 * - Minimal shoulder movement
 * - Focused head tracking
 * - Precise guard micro-adjustments
 */
function createLiIdleAnimation(): SkeletalAnimation {
  const pose = LI_FIRE_GUARD_POSE;
  const { min, max } = pose.breathingRange;
  const duration = BREATHING_DURATIONS.LI;
  const amplitude = WEIGHT_SHIFT_AMPLITUDES.LI;
  const frames = STANCE_GUARD_CONFIGS.li.breathingFrames;

  const builder = MartialArtsAnimationBuilder.create(
    "stance_li",
    "리 대기",
  ).asIdle(duration, true);

  for (let i = 0; i <= frames; i++) {
    const phase = i / frames;
    const frameTime = phase * duration;
    
    // Natural breathing cycle (minimal range)
    const breathingScale = calculateBreathingScale(phase, min, max);
    const breathingOffset = calculateTorsoBreathingOffset(breathingScale);
    const shoulderOffset = calculateShoulderBreathing(breathingScale) * 0.6; // Reduced
    
    // Head tracking (low intensity for precision focus)
    const headMovement = calculateHeadMovement(phase, 0.3);
    
    // Stance-specific micro-movements
    const microMove = calculateStanceMicroMovement(phase, 'precise');
    const kneeBounce = calculateKneeBounce(phase, amplitude);

    const kf = builder.at(frameTime);
    applyGuardPoseToKeyframe(
      kf,
      pose,
      breathingOffset,
      shoulderOffset,
      headMovement,
      kneeBounce,
      microMove.guardFloat,
    );
    kf.done<MartialArtsAnimationBuilder>();
  }

  return builder.build();
}

/**
 * ☲ 리 (Li) Fire Idle Animation
 *
 * Aggressive peekaboo guard with sharp controlled breathing.
 * Both hands high protecting face for precision striking.
 *
 * **Breathing**: Sharp controlled (1.8s cycle)
 * **Weight**: Minimal movement for precision
 * **Philosophy**: Fire's precision, vital point targeting
 *
 * @korean 리불대기애니메이션
 */
export const LI_IDLE_ANIMATION: SkeletalAnimation = createLiIdleAnimation();

// ═══════════════════════════════════════════════════════════════════════════
// ☳ JIN THUNDER IDLE (진 천둥 대기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates Jin idle animation with natural breathing and micro-movements
 *
 * Thunder stance: Deep coiled power breathing with explosive readiness
 * - Deep power breathing (2.2s cycle)
 * - Pronounced shoulder rise/fall
 * - Alert head tracking
 * - Coiled tension micro-adjustments
 */
function createJinIdleAnimation(): SkeletalAnimation {
  const pose = JIN_THUNDER_GUARD_POSE;
  const { min, max } = pose.breathingRange;
  const duration = BREATHING_DURATIONS.JIN;
  const amplitude = WEIGHT_SHIFT_AMPLITUDES.JIN;
  const frames = STANCE_GUARD_CONFIGS.jin.breathingFrames;

  const builder = MartialArtsAnimationBuilder.create(
    "stance_jin",
    "진 대기",
  ).asIdle(duration, true);

  for (let i = 0; i <= frames; i++) {
    const phase = i / frames;
    const frameTime = phase * duration;
    
    // Natural breathing cycle (deep range)
    const breathingScale = calculateBreathingScale(phase, min, max);
    const breathingOffset = calculateTorsoBreathingOffset(breathingScale);
    const shoulderOffset = calculateShoulderBreathing(breathingScale) * 1.2; // Enhanced
    
    // Head tracking (moderate intensity for coiled readiness)
    const headMovement = calculateHeadMovement(phase, 0.5);
    
    // Stance-specific micro-movements
    const microMove = calculateStanceMicroMovement(phase, 'coiled');
    const kneeBounce = calculateKneeBounce(phase, amplitude);

    const kf = builder.at(frameTime);
    applyGuardPoseToKeyframe(
      kf,
      pose,
      breathingOffset,
      shoulderOffset,
      headMovement,
      kneeBounce,
      microMove.guardFloat,
    );
    kf.done<MartialArtsAnimationBuilder>();
  }

  return builder.build();
}

/**
 * ☳ 진 (Jin) Thunder Idle Animation
 *
 * Chambered explosive stance with deep power breathing.
 * Fists at ribs, coiled spring ready for explosive release.
 *
 * **Breathing**: Deep coiled power (2.2s cycle)
 * **Weight**: Back-loaded with subtle forward pulse
 * **Philosophy**: Thunder's explosive force, shocking power
 *
 * @korean 진천둥대기애니메이션
 */
export const JIN_IDLE_ANIMATION: SkeletalAnimation = createJinIdleAnimation();

// ═══════════════════════════════════════════════════════════════════════════
// ☴ SON WIND IDLE (손 바람 대기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates Son idle animation with natural breathing and micro-movements
 *
 * Wind stance: Rhythmic continuous flow with never-still motion
 * - Rhythmic flowing breathing (2.0s cycle)
 * - Continuous shoulder movement
 * - Active head tracking
 * - Flowing guard micro-adjustments
 */
function createSonIdleAnimation(): SkeletalAnimation {
  const pose = SON_WIND_GUARD_POSE;
  const { min, max } = pose.breathingRange;
  const duration = BREATHING_DURATIONS.SON;
  const amplitude = WEIGHT_SHIFT_AMPLITUDES.SON;
  const frames = STANCE_GUARD_CONFIGS.son.breathingFrames;

  const builder = MartialArtsAnimationBuilder.create(
    "stance_son",
    "손 대기",
  ).asIdle(duration, true);

  for (let i = 0; i <= frames; i++) {
    const phase = i / frames;
    const frameTime = phase * duration;
    
    // Natural breathing cycle
    const breathingScale = calculateBreathingScale(phase, min, max);
    const breathingOffset = calculateTorsoBreathingOffset(breathingScale);
    const shoulderOffset = calculateShoulderBreathing(breathingScale);
    
    // Head tracking (high intensity for wind's continuous awareness)
    const headMovement = calculateHeadMovement(phase, 0.9);
    
    // Stance-specific micro-movements (wind never stops moving)
    const microMove = calculateStanceMicroMovement(phase, 'flowing');
    const kneeBounce = calculateKneeBounce(phase, amplitude);

    const kf = builder.at(frameTime);
    applyGuardPoseToKeyframe(
      kf,
      pose,
      breathingOffset,
      shoulderOffset,
      headMovement,
      kneeBounce,
      microMove.guardFloat,
    );
    kf.done<MartialArtsAnimationBuilder>();
  }

  return builder.build();
}

/**
 * ☴ 손 (Son) Wind Idle Animation
 *
 * Staggered flowing guard with rhythmic continuous breathing.
 * Lead hand extended, rear at chin for combo readiness.
 *
 * **Breathing**: Rhythmic flowing (2.0s cycle)
 * **Weight**: Lateral rhythmic shifts for mobility
 * **Philosophy**: Wind's continuous pressure, flowing attack
 *
 * @korean 손바람대기애니메이션
 */
export const SON_IDLE_ANIMATION: SkeletalAnimation = createSonIdleAnimation();

// ═══════════════════════════════════════════════════════════════════════════
// ☵ GAM WATER IDLE (감 물 대기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates Gam idle animation with natural breathing and micro-movements
 *
 * Water stance: Deep flowing diaphragm breathing with adaptive motion
 * - Deep flowing breathing (3.0s cycle - longest)
 * - Smooth shoulder rise/fall
 * - Calm adaptive head tracking
 * - Adaptive circular guard micro-adjustments
 */
function createGamIdleAnimation(): SkeletalAnimation {
  const pose = GAM_WATER_GUARD_POSE;
  const { min, max } = pose.breathingRange;
  const duration = BREATHING_DURATIONS.GAM;
  const amplitude = WEIGHT_SHIFT_AMPLITUDES.GAM;
  const frames = STANCE_GUARD_CONFIGS.gam.breathingFrames;

  const builder = MartialArtsAnimationBuilder.create(
    "stance_gam",
    "감 대기",
  ).asIdle(duration, true);

  for (let i = 0; i <= frames; i++) {
    const phase = i / frames;
    const frameTime = phase * duration;
    
    // Natural breathing cycle (deepest, longest)
    const breathingScale = calculateBreathingScale(phase, min, max);
    const breathingOffset = calculateTorsoBreathingOffset(breathingScale);
    const shoulderOffset = calculateShoulderBreathing(breathingScale);
    
    // Head tracking (moderate intensity for adaptive awareness)
    const headMovement = calculateHeadMovement(phase, 0.7);
    
    // Stance-specific micro-movements
    const microMove = calculateStanceMicroMovement(phase, 'adaptive');
    const kneeBounce = calculateKneeBounce(phase, amplitude);

    const kf = builder.at(frameTime);
    applyGuardPoseToKeyframe(
      kf,
      pose,
      breathingOffset,
      shoulderOffset,
      headMovement,
      kneeBounce,
      microMove.guardFloat,
    );
    kf.done<MartialArtsAnimationBuilder>();
  }

  return builder.build();
}

/**
 * ☵ 감 (Gam) Water Idle Animation
 *
 * Mid-level parrying guard with deep flowing breathing.
 * Hands ready at solar plexus for redirecting and countering.
 *
 * **Breathing**: Deep flowing diaphragm (3.0s cycle)
 * **Weight**: Circular flowing adaptation
 * **Philosophy**: Water's adaptation, flow-into-counter
 *
 * @korean 감물대기애니메이션
 */
export const GAM_IDLE_ANIMATION: SkeletalAnimation = createGamIdleAnimation();

// ═══════════════════════════════════════════════════════════════════════════
// ☶ GAN MOUNTAIN IDLE (간 산 대기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates Gan idle animation with natural breathing and micro-movements
 *
 * Mountain stance: Minimal steady breathing with immovable stability
 * - Steady controlled breathing (2.6s cycle)
 * - Minimal shoulder movement
 * - Solid head position (minimal tracking)
 * - Mountain stability (minimal micro-adjustments)
 */
function createGanIdleAnimation(): SkeletalAnimation {
  const pose = GAN_MOUNTAIN_GUARD_POSE;
  const { min, max } = pose.breathingRange;
  const duration = BREATHING_DURATIONS.GAN;
  const amplitude = WEIGHT_SHIFT_AMPLITUDES.GAN;
  const frames = STANCE_GUARD_CONFIGS.gan.breathingFrames;

  const builder = MartialArtsAnimationBuilder.create(
    "stance_gan",
    "간 대기",
  ).asIdle(duration, true);

  for (let i = 0; i <= frames; i++) {
    const phase = i / frames;
    const frameTime = phase * duration;
    
    // Natural breathing cycle (minimal range)
    const breathingScale = calculateBreathingScale(phase, min, max);
    const breathingOffset = calculateTorsoBreathingOffset(breathingScale);
    const shoulderOffset = calculateShoulderBreathing(breathingScale) * 0.5; // Minimal
    
    // Head tracking (very low intensity for mountain immovability)
    const headMovement = calculateHeadMovement(phase, 0.2);
    
    // Stance-specific micro-movements (mountain minimal)
    const microMove = calculateStanceMicroMovement(phase, 'solid');
    const kneeBounce = calculateKneeBounce(phase, amplitude);

    const kf = builder.at(frameTime);
    applyGuardPoseToKeyframe(
      kf,
      pose,
      breathingOffset,
      shoulderOffset,
      headMovement,
      kneeBounce,
      microMove.guardFloat,
    );
    kf.done<MartialArtsAnimationBuilder>();
  }

  return builder.build();
}

/**
 * ☶ 간 (Gan) Mountain Idle Animation
 *
 * High cover defensive guard with steady controlled breathing.
 * Forearms crossed protecting face, immovable stance.
 *
 * **Breathing**: Steady minimal (2.6s cycle)
 * **Weight**: Minimal - mountain solid
 * **Philosophy**: Mountain's immovability, defensive mastery
 *
 * @korean 간산대기애니메이션
 */
export const GAN_IDLE_ANIMATION: SkeletalAnimation = createGanIdleAnimation();

// ═══════════════════════════════════════════════════════════════════════════
// ☷ GON EARTH IDLE (곤 땅 대기)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Creates Gon idle animation with natural breathing and micro-movements
 *
 * Earth stance: Deep grounded diaphragm breathing with stability
 * - Deep diaphragm breathing (2.6s cycle)
 * - Stable shoulder movement
 * - Grounded head tracking
 * - Stable grounded micro-adjustments
 */
function createGonIdleAnimation(): SkeletalAnimation {
  const pose = GON_EARTH_GUARD_POSE;
  const { min, max } = pose.breathingRange;
  const duration = BREATHING_DURATIONS.GON;
  const amplitude = WEIGHT_SHIFT_AMPLITUDES.GON;
  const frames = STANCE_GUARD_CONFIGS.gon.breathingFrames;

  const builder = MartialArtsAnimationBuilder.create(
    "stance_gon",
    "곤 대기",
  ).asIdle(duration, true);

  for (let i = 0; i <= frames; i++) {
    const phase = i / frames;
    const frameTime = phase * duration;
    
    // Natural breathing cycle (deep grounded)
    const breathingScale = calculateBreathingScale(phase, min, max);
    const breathingOffset = calculateTorsoBreathingOffset(breathingScale);
    const shoulderOffset = calculateShoulderBreathing(breathingScale);
    
    // Head tracking (moderate intensity for wrestling awareness)
    const headMovement = calculateHeadMovement(phase, 0.5);
    
    // Stance-specific micro-movements
    const microMove = calculateStanceMicroMovement(phase, 'grounded');
    const kneeBounce = calculateKneeBounce(phase, amplitude);

    const kf = builder.at(frameTime);
    applyGuardPoseToKeyframe(
      kf,
      pose,
      breathingOffset,
      shoulderOffset,
      headMovement,
      kneeBounce,
      microMove.guardFloat,
    );
    kf.done<MartialArtsAnimationBuilder>();
  }

  return builder.build();
}

/**
 * ☷ 곤 (Gon) Earth Idle Animation
 *
 * Low underhook wrestling guard with grounded breathing.
 * Hands at hip level, elbows protecting ribs for ground control.
 *
 * **Breathing**: Deep diaphragm (2.6s cycle)
 * **Weight**: Grounded subtle shifts
 * **Philosophy**: Earth's stability, grounding and takedowns
 *
 * @korean 곤땅대기애니메이션
 */
export const GON_IDLE_ANIMATION: SkeletalAnimation = createGonIdleAnimation();

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
