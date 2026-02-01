/**
 * Step Animation System for Black Trigram
 *
 * **PHASE 4 ENHANCEMENT: Advanced Step Techniques**
 *
 * Implements tactical step movement animations with precise 30cm steps
 * based on Korean martial arts footwork (보법, Bobeop).
 *
 * **New Step Types Added**:
 * - **밀기 스텝 (Push Step)**: Rear foot drives forward for power generation
 * - **당기기 스텝 (Pull Step)**: Front foot pulls back for defensive retreat
 * - **자르기 스텝 (Cut Step)**: Diagonal step for angle creation and evasion
 *
 * Each step animation:
 * - Duration: 300ms (18 frames at 60fps)
 * - Distance: 30cm (approximately one foot width)
 * - Non-interruptible (priority 5, same as attacks)
 * - Maintains guard position
 * - Smooth weight transfer with Korean martial arts principles
 *
 * **Korean Footwork Principles Applied**:
 * - 디딤발 (Didimbal): Stepping foot lands heel-first forward, ball-first backward
 * - 축발 (Chukbal): Pivot foot maintains stability during movement
 * - 체중이동 (Chejung Idong): Weight transfers smoothly through phases
 * - 각도 만들기 (Gakdo Mandeulgi): Angle creation through diagonal movement
 *
 * @module systems/animation/StepAnimations
 * @category Animation
 * @korean 발걸음애니메이션시스템
 */

import type {
  AnimationState,
  StepConfig,
  StepDirection,
  StepKeyframe,
} from "../core/types";
import { STEP_PRIORITY } from "../core/types";

/**
 * Standard step animation parameters
 *
 * Based on issue requirements:
 * - 18 frames at 60fps = 300ms duration
 * - 30cm distance (one foot width)
 * - Guard maintained throughout
 *
 * @korean 표준발걸음파라미터
 */
export const STEP_ANIMATION_PARAMS = {
  /** Total frames for step animation */
  FRAMES: 18,

  /** Target FPS (60 for smooth combat) */
  FPS: 60,

  /** Duration in seconds (300ms) */
  DURATION: 0.3,

  /** Distance moved per step in meters (30cm) */
  DISTANCE: 0.3,

  /** Stamina cost per step - reduced for sustained combat (3 min rounds) */
  STAMINA_COST: 3,

  /** Whether steps are interruptible (false for commitment) */
  INTERRUPTIBLE: false,

  /** Animation priority (same as attack) */
  PRIORITY: STEP_PRIORITY,
} as const;

/**
 * Step keyframes defining weight transfer and foot placement
 *
 * Four-phase step animation:
 * 1. Frames 0-5: Weight shift to back foot (준비, Junbi - Preparation)
 * 2. Frames 6-11: Front foot lift and extension (이동, Idong - Movement)
 * 3. Frames 12-15: Front foot placement (착지, Chakji - Landing)
 * 4. Frames 16-17: Weight settle and stabilize (안정, Anjeong - Stabilization)
 *
 * @korean 발걸음키프레임
 */
export const STEP_KEYFRAMES: readonly StepKeyframe[] = [
  // Phase 1: Preparation (frames 0-5)
  {
    frame: 0,
    weight: 0.5, // Balanced starting position
    frontFootOffset: 0,
    backFootOffset: 0,
    frontFootLift: 0,
    cogHeight: 0,
  },
  {
    frame: 3,
    weight: 0.3, // Shift weight to back foot
    frontFootOffset: 0,
    backFootOffset: 0,
    frontFootLift: 0,
    cogHeight: -0.01, // Slight crouch for power
  },

  // Phase 2: Movement (frames 6-11)
  {
    frame: 6,
    weight: 0.2, // Mostly on back foot
    frontFootOffset: 0.1,
    backFootOffset: 0,
    frontFootLift: 0.05, // Lift front foot
    cogHeight: -0.01,
  },
  {
    frame: 9,
    weight: 0.3, // Begin weight transfer
    frontFootOffset: 0.5,
    backFootOffset: 0.1,
    frontFootLift: 0.08, // Peak lift
    cogHeight: 0, // Rise to normal height
  },
  {
    frame: 11,
    weight: 0.5, // Halfway through transfer
    frontFootOffset: 0.8,
    backFootOffset: 0.3,
    frontFootLift: 0.05, // Begin descent
    cogHeight: 0,
  },

  // Phase 3: Landing (frames 12-15)
  {
    frame: 12,
    weight: 0.7, // Weight shifting forward
    frontFootOffset: 1.0, // Front foot at target
    backFootOffset: 0.5,
    frontFootLift: 0.02, // Almost landed
    cogHeight: -0.005, // Slight compression on landing
  },
  {
    frame: 14,
    weight: 0.8, // Mostly on front foot
    frontFootOffset: 1.0,
    backFootOffset: 0.8,
    frontFootLift: 0,
    cogHeight: -0.01, // Maximum compression
  },

  // Phase 4: Stabilization (frames 16-17)
  {
    frame: 16,
    weight: 0.9, // Nearly complete transfer
    frontFootOffset: 1.0,
    backFootOffset: 1.0, // Back foot catches up
    frontFootLift: 0,
    cogHeight: -0.005, // Slight rebound
  },
  {
    frame: 17,
    weight: 1.0, // Fully on front foot (new position)
    frontFootOffset: 1.0,
    backFootOffset: 1.0,
    frontFootLift: 0,
    cogHeight: 0, // Return to neutral
  },
];

/**
 * Generate step animation config for a specific direction
 *
 * Creates animation configuration with Korean terminology:
 * - forward: 전진보법 (Jeonjin Bobeop)
 * - back: 후퇴보법 (Hutoe Bobeop)
 * - left: 좌측면보법 (Jwacheuk Myeon Bobeop)
 * - right: 우측면보법 (Ucheuk Myeon Bobeop)
 * - Diagonals: Combined terms
 *
 * @param direction - Step direction (8 possibilities)
 * @returns Step animation configuration
 * @korean 발걸음애니메이션설정생성
 */
export function createStepConfig(direction: StepDirection): StepConfig {
  const stateMap: Record<StepDirection, string> = {
    forward: "step_forward",
    back: "step_back",
    left: "step_left",
    right: "step_right",
    forward_left: "step_forward_left",
    forward_right: "step_forward_right",
    back_left: "step_back_left",
    back_right: "step_back_right",
  };

  return {
    state: stateMap[direction] as AnimationState,
    direction,
    frames: STEP_ANIMATION_PARAMS.FRAMES,
    fps: STEP_ANIMATION_PARAMS.FPS,
    loop: false,
    interruptible: STEP_ANIMATION_PARAMS.INTERRUPTIBLE,
    priority: STEP_ANIMATION_PARAMS.PRIORITY,
    duration: STEP_ANIMATION_PARAMS.DURATION,
    distance: STEP_ANIMATION_PARAMS.DISTANCE,
    maintainsGuard: true, // Always maintain guard during steps
    staminaCost: STEP_ANIMATION_PARAMS.STAMINA_COST,
  };
}

/**
 * Map of all step animation configurations
 *
 * Eight directional step configurations for:
 * - Cardinal directions: forward, back, left, right
 * - Diagonal directions: forward_left, forward_right, back_left, back_right
 *
 * @korean 발걸음애니메이션맵
 */
export const STEP_ANIMATION_CONFIGS: ReadonlyMap<StepDirection, StepConfig> =
  new Map([
    ["forward", createStepConfig("forward")],
    ["back", createStepConfig("back")],
    ["left", createStepConfig("left")],
    ["right", createStepConfig("right")],
    ["forward_left", createStepConfig("forward_left")],
    ["forward_right", createStepConfig("forward_right")],
    ["back_left", createStepConfig("back_left")],
    ["back_right", createStepConfig("back_right")],
  ]);

/**
 * Interpolate between two keyframes
 *
 * Linear interpolation for smooth animation between keyframe values.
 * Used for weight transfer, foot position, and center of gravity.
 *
 * @param keyframe1 - Start keyframe
 * @param keyframe2 - End keyframe
 * @param t - Interpolation factor (0-1)
 * @returns Interpolated keyframe values
 * @korean 키프레임보간
 */
export function interpolateStepKeyframes(
  keyframe1: StepKeyframe,
  keyframe2: StepKeyframe,
  t: number,
): StepKeyframe {
  return {
    frame: Math.round(
      keyframe1.frame + (keyframe2.frame - keyframe1.frame) * t,
    ),
    weight: keyframe1.weight + (keyframe2.weight - keyframe1.weight) * t,
    frontFootOffset:
      keyframe1.frontFootOffset +
      (keyframe2.frontFootOffset - keyframe1.frontFootOffset) * t,
    backFootOffset:
      keyframe1.backFootOffset +
      (keyframe2.backFootOffset - keyframe1.backFootOffset) * t,
    frontFootLift:
      keyframe1.frontFootLift +
      (keyframe2.frontFootLift - keyframe1.frontFootLift) * t,
    cogHeight:
      keyframe1.cogHeight + (keyframe2.cogHeight - keyframe1.cogHeight) * t,
  };
}

/**
 * Get step keyframe at specific frame
 *
 * Returns exact keyframe if frame matches, otherwise interpolates
 * between surrounding keyframes for smooth animation.
 *
 * @param frame - Current frame number (0-17)
 * @returns Keyframe data for current frame
 * @korean 프레임별키프레임가져오기
 */
export function getStepKeyframeAtFrame(frame: number): StepKeyframe {
  // Clamp frame to valid range
  const clampedFrame = Math.max(
    0,
    Math.min(STEP_ANIMATION_PARAMS.FRAMES - 1, frame),
  );

  // Find exact match
  const exactMatch = STEP_KEYFRAMES.find((kf) => kf.frame === clampedFrame);
  if (exactMatch) {
    return exactMatch;
  }

  // Find surrounding keyframes for interpolation
  let beforeKeyframe = STEP_KEYFRAMES[0];
  let afterKeyframe = STEP_KEYFRAMES[STEP_KEYFRAMES.length - 1];

  for (let i = 0; i < STEP_KEYFRAMES.length - 1; i++) {
    if (
      STEP_KEYFRAMES[i].frame <= clampedFrame &&
      STEP_KEYFRAMES[i + 1].frame >= clampedFrame
    ) {
      beforeKeyframe = STEP_KEYFRAMES[i];
      afterKeyframe = STEP_KEYFRAMES[i + 1];
      break;
    }
  }

  // Interpolate between keyframes
  const frameDiff = afterKeyframe.frame - beforeKeyframe.frame;
  const t =
    frameDiff > 0 ? (clampedFrame - beforeKeyframe.frame) / frameDiff : 0;

  return interpolateStepKeyframes(beforeKeyframe, afterKeyframe, t);
}

/**
 * Calculate 3D position offset for step direction
 *
 * Converts step direction to normalized 3D vector for character movement.
 * Diagonal steps have shorter individual x/y components to maintain
 * consistent 30cm total distance.
 *
 * @param direction - Step direction
 * @returns 3D position offset [x, y, z] in meters
 * @korean 발걸음방향벡터계산
 */
export function getStepDirectionVector(
  direction: StepDirection,
): [number, number, number] {
  const distance = STEP_ANIMATION_PARAMS.DISTANCE;
  const diagonalFactor = Math.sqrt(2) / 2; // ~0.707 for 45-degree diagonals

  const vectors: Record<StepDirection, [number, number, number]> = {
    forward: [0, 0, -distance], // Negative Z is forward in Three.js
    back: [0, 0, distance],
    left: [-distance, 0, 0],
    right: [distance, 0, 0],
    forward_left: [-distance * diagonalFactor, 0, -distance * diagonalFactor],
    forward_right: [distance * diagonalFactor, 0, -distance * diagonalFactor],
    back_left: [-distance * diagonalFactor, 0, distance * diagonalFactor],
    back_right: [distance * diagonalFactor, 0, distance * diagonalFactor],
  };

  return vectors[direction];
}

/**
 * Korean terminology for step directions
 *
 * Maps step directions to Korean martial arts terminology:
 * - 전진보법 (Jeonjin Bobeop): Forward stepping method
 * - 후퇴보법 (Hutoe Bobeop): Retreat stepping method
 * - 측면보법 (Cheungmyeon Bobeop): Side stepping method
 *
 * @korean 발걸음한글용어
 */
export const STEP_KOREAN_TERMS: Record<
  StepDirection,
  { korean: string; romanized: string; english: string }
> = {
  forward: {
    korean: "전진보법",
    romanized: "Jeonjin Bobeop",
    english: "Forward Step",
  },
  back: {
    korean: "후퇴보법",
    romanized: "Hutoe Bobeop",
    english: "Retreat Step",
  },
  left: {
    korean: "좌측면보법",
    romanized: "Jwacheuk Myeon Bobeop",
    english: "Left Side Step",
  },
  right: {
    korean: "우측면보법",
    romanized: "Ucheuk Myeon Bobeop",
    english: "Right Side Step",
  },
  forward_left: {
    korean: "전좌측보법",
    romanized: "Jeon Jwacheuk Bobeop",
    english: "Forward-Left Diagonal Step",
  },
  forward_right: {
    korean: "전우측보법",
    romanized: "Jeon Ucheuk Bobeop",
    english: "Forward-Right Diagonal Step",
  },
  back_left: {
    korean: "후좌측보법",
    romanized: "Hu Jwacheuk Bobeop",
    english: "Back-Left Diagonal Step",
  },
  back_right: {
    korean: "후우측보법",
    romanized: "Hu Ucheuk Bobeop",
    english: "Back-Right Diagonal Step",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ADVANCED STEP TECHNIQUES (고급 발걸음 기술) - PHASE 4 ADDITION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * **NEW PHASE 4**: Advanced step technique types
 *
 * Three specialized stepping techniques from Korean martial arts:
 *
 * 1. **밀기 스텝 (Push Step - Milgi Step)**:
 *    - Rear foot explosively pushes off ground
 *    - Front foot receives and advances
 *    - Generates forward power for closing distance
 *    - Used before strikes or to pressure opponent
 *
 * 2. **당기기 스텝 (Pull Step - Danggigi Step)**:
 *    - Front foot pulls backward quickly
 *    - Rear foot follows to maintain stance
 *    - Creates defensive distance rapidly
 *    - Preserves guard and balance during retreat
 *
 * 3. **자르기 스텝 (Cut Step - Jareugi Step)**:
 *    - Diagonal step at 45° angle
 *    - Off-line from opponent's centerline
 *    - Creates tactical angle advantage
 *    - Evade while positioning for counter
 *
 * @korean 고급발걸음기술유형
 */
export type AdvancedStepType = "push" | "pull" | "cut_left" | "cut_right";

/**
 * **밀기 스텝 (Push Step)** - Power Generation through Rear Foot Drive
 *
 * **Korean Martial Arts Principle**: 뒷발 추진력 (Rear foot propulsion)
 *
 * Explosive forward movement where rear foot provides all the power:
 * 1. Rear foot digs into ground (발뒤꿈치 압박)
 * 2. Explosive extension of rear leg drives body forward
 * 3. Front foot receives and extends farther forward
 * 4. Used to close distance quickly before attacking
 *
 * **Biomechanics**:
 * - Rear knee: Flexes to -25° then explosively extends to -5°
 * - Front knee: Stays relatively straight to receive forward momentum
 * - Pelvis: Drives forward with 20cm total displacement
 * - Guard: Maintained throughout to protect during advance
 *
 * **Tactical Application**:
 * - Close distance for punches or kicks
 * - Pressure opponent toward cage/ropes
 * - Entry for takedowns
 * - Create forward momentum
 *
 * **Duration**: 280ms (explosive movement)
 * **Distance**: 35cm (longer than normal step due to push power)
 *
 * @korean 밀기스텝_뒷발추진
 */
export const PUSH_STEP_KEYFRAMES: readonly StepKeyframe[] = [
  // Initial stance
  {
    frame: 0,
    weight: 0.5,
    frontFootOffset: 0,
    backFootOffset: 0,
    frontFootLift: 0,
    cogHeight: 0,
  },
  // Deep rear knee bend - loading power (준비)
  {
    frame: 2,
    weight: 0.3,
    frontFootOffset: 0,
    backFootOffset: 0,
    frontFootLift: 0,
    cogHeight: -0.02, // Deep crouch
  },
  // Explosive rear leg extension begins (폭발적 추진)
  {
    frame: 5,
    weight: 0.4,
    frontFootOffset: 0.2,
    backFootOffset: 0.1,
    frontFootLift: 0.03,
    cogHeight: -0.01, // Rising from crouch
  },
  // Maximum forward drive (최대 추진력)
  {
    frame: 8,
    weight: 0.6,
    frontFootOffset: 0.7,
    backFootOffset: 0.4,
    frontFootLift: 0.05,
    cogHeight: 0.01, // Rising above neutral
  },
  // Front foot landing (착지)
  {
    frame: 11,
    weight: 0.8,
    frontFootOffset: 1.0,
    backFootOffset: 0.7,
    frontFootLift: 0.01,
    cogHeight: -0.01, // Impact absorption
  },
  // Stabilization (안정)
  {
    frame: 14,
    weight: 0.9,
    frontFootOffset: 1.0,
    backFootOffset: 1.0,
    frontFootLift: 0,
    cogHeight: 0,
  },
];

/**
 * **당기기 스텝 (Pull Step)** - Quick Defensive Retreat
 *
 * **Korean Martial Arts Principle**: 앞발 당김 (Front foot pull-back)
 *
 * Quick retreat where front foot initiates backward movement:
 * 1. Front foot pulls back quickly (ball of foot contact)
 * 2. Weight transfers to rear foot
 * 3. Front foot lands and rear foot follows
 * 4. Creates defensive distance while maintaining guard
 *
 * **Biomechanics**:
 * - Front knee: Lifts to -20° then extends back
 * - Rear knee: Accepts weight with flex to -15°
 * - Pelvis: Moves backward 25cm smoothly
 * - Eyes: Stay on opponent throughout
 *
 * **Tactical Application**:
 * - Escape opponent's attack range
 * - Reset distance after exchange
 * - Defensive retreat under pressure
 * - Maintain guard while withdrawing
 *
 * **Duration**: 300ms (controlled retreat)
 * **Distance**: 30cm (standard defensive distance)
 *
 * @korean 당기기스텝_앞발당김
 */
export const PULL_STEP_KEYFRAMES: readonly StepKeyframe[] = [
  // Initial stance
  {
    frame: 0,
    weight: 0.5,
    frontFootOffset: 0,
    backFootOffset: 0,
    frontFootLift: 0,
    cogHeight: 0,
  },
  // Weight shift to rear (준비)
  {
    frame: 3,
    weight: 0.3,
    frontFootOffset: 0,
    backFootOffset: 0,
    frontFootLift: 0,
    cogHeight: -0.01,
  },
  // Front foot lifts and pulls back (후퇴 시작)
  {
    frame: 6,
    weight: 0.2,
    frontFootOffset: -0.3,
    backFootOffset: 0,
    frontFootLift: 0.04,
    cogHeight: -0.015,
  },
  // Front foot landing backward (착지)
  {
    frame: 10,
    weight: 0.5,
    frontFootOffset: -1.0,
    backFootOffset: -0.3,
    frontFootLift: 0.01,
    cogHeight: -0.02,
  },
  // Rear foot follows (후속 이동)
  {
    frame: 13,
    weight: 0.7,
    frontFootOffset: -1.0,
    backFootOffset: -0.8,
    frontFootLift: 0,
    cogHeight: -0.01,
  },
  // Final stable retreat position (안정)
  {
    frame: 17,
    weight: 0.5,
    frontFootOffset: -1.0,
    backFootOffset: -1.0,
    frontFootLift: 0,
    cogHeight: 0,
  },
];

/**
 * **자르기 스텝 (Cut Step)** - Diagonal Angle Creation
 *
 * **Korean Martial Arts Principle**: 각도 전환 (Angle transition)
 *
 * Diagonal step at 45° to create off-line positioning:
 * 1. Front foot steps forward-lateral at 45°
 * 2. Body pivots to maintain guard facing opponent
 * 3. Rear foot adjusts to restore stance
 * 4. Results in superior angle advantage
 *
 * **Biomechanics**:
 * - Front knee: Lifts and extends diagonally
 * - Pelvis: Rotates 15-20° while moving diagonal
 * - Spine: Counter-rotates to keep guard forward
 * - Total displacement: 30cm at 45° angle
 *
 * **Tactical Application**:
 * - Off-line from opponent's attack vector
 * - Create angle for counter-strikes
 * - Evade linear attacks
 * - Position for opponent's blind side
 *
 * **Duration**: 320ms (requires precision)
 * **Distance**: 30cm at 45° diagonal
 * **Angle**: Off-line by 45° from original centerline
 *
 * @korean 자르기스텝_각도전환
 */
export const CUT_STEP_LEFT_KEYFRAMES: readonly StepKeyframe[] = [
  // Initial stance
  {
    frame: 0,
    weight: 0.5,
    frontFootOffset: 0,
    backFootOffset: 0,
    frontFootLift: 0,
    cogHeight: 0,
  },
  // Weight shift preparation (준비)
  {
    frame: 3,
    weight: 0.3,
    frontFootOffset: 0,
    backFootOffset: 0,
    frontFootLift: 0,
    cogHeight: -0.015,
  },
  // Diagonal step begins - forward-left (각도 이동)
  {
    frame: 7,
    weight: 0.4,
    frontFootOffset: 0.5, // Diagonal: 50% forward, 50% lateral
    backFootOffset: 0,
    frontFootLift: 0.05,
    cogHeight: -0.01,
  },
  // Foot plants at angle (각도 착지)
  {
    frame: 11,
    weight: 0.7,
    frontFootOffset: 1.0,
    backFootOffset: 0.4,
    frontFootLift: 0.01,
    cogHeight: -0.02,
  },
  // Rear foot adjusts (후속 조정)
  {
    frame: 14,
    weight: 0.8,
    frontFootOffset: 1.0,
    backFootOffset: 0.9,
    frontFootLift: 0,
    cogHeight: -0.01,
  },
  // Stable angled position (안정된 각도)
  {
    frame: 18,
    weight: 0.6,
    frontFootOffset: 1.0,
    backFootOffset: 1.0,
    frontFootLift: 0,
    cogHeight: 0,
  },
];

/**
 * Korean terminology for advanced step techniques
 *
 * @korean 고급발걸음한글용어
 */
export const ADVANCED_STEP_KOREAN_TERMS: Record<
  AdvancedStepType,
  { korean: string; romanized: string; english: string }
> = {
  push: {
    korean: "밀기 스텝",
    romanized: "Milgi Step",
    english: "Push Step (Power Drive)",
  },
  pull: {
    korean: "당기기 스텝",
    romanized: "Danggigi Step",
    english: "Pull Step (Quick Retreat)",
  },
  cut_left: {
    korean: "왼쪽 자르기 스텝",
    romanized: "Oenjjok Jareugi Step",
    english: "Cut Step Left (Diagonal Angle)",
  },
  cut_right: {
    korean: "오른쪽 자르기 스텝",
    romanized: "Oreunjjok Jareugi Step",
    english: "Cut Step Right (Diagonal Angle)",
  },
};
