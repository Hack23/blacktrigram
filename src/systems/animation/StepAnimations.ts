/**
 * Step Animation System for Black Trigram
 * 
 * Implements tactical step movement animations with precise 30cm steps
 * based on Korean martial arts footwork (보법, Bobeop).
 * 
 * Each step animation:
 * - Duration: 300ms (18 frames at 60fps)
 * - Distance: 30cm (approximately one foot width)
 * - Non-interruptible (priority 5, same as attacks)
 * - Maintains guard position
 * - Smooth weight transfer
 * 
 * @module systems/animation/StepAnimations
 * @category Animation
 * @korean 발걸음애니메이션시스템
 */

import type { AnimationState, StepConfig, StepDirection, StepKeyframe } from './types';
import { STEP_PRIORITY } from './types';

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
  
  /** Stamina cost per step */
  STAMINA_COST: 5,
  
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
    forward: 'step_forward',
    back: 'step_back',
    left: 'step_left',
    right: 'step_right',
    forward_left: 'step_forward_left',
    forward_right: 'step_forward_right',
    back_left: 'step_back_left',
    back_right: 'step_back_right',
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
export const STEP_ANIMATION_CONFIGS: ReadonlyMap<StepDirection, StepConfig> = new Map([
  ['forward', createStepConfig('forward')],
  ['back', createStepConfig('back')],
  ['left', createStepConfig('left')],
  ['right', createStepConfig('right')],
  ['forward_left', createStepConfig('forward_left')],
  ['forward_right', createStepConfig('forward_right')],
  ['back_left', createStepConfig('back_left')],
  ['back_right', createStepConfig('back_right')],
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
  t: number
): StepKeyframe {
  return {
    frame: Math.round(keyframe1.frame + (keyframe2.frame - keyframe1.frame) * t),
    weight: keyframe1.weight + (keyframe2.weight - keyframe1.weight) * t,
    frontFootOffset: keyframe1.frontFootOffset + (keyframe2.frontFootOffset - keyframe1.frontFootOffset) * t,
    backFootOffset: keyframe1.backFootOffset + (keyframe2.backFootOffset - keyframe1.backFootOffset) * t,
    frontFootLift: keyframe1.frontFootLift + (keyframe2.frontFootLift - keyframe1.frontFootLift) * t,
    cogHeight: keyframe1.cogHeight + (keyframe2.cogHeight - keyframe1.cogHeight) * t,
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
  const clampedFrame = Math.max(0, Math.min(STEP_ANIMATION_PARAMS.FRAMES - 1, frame));
  
  // Find exact match
  const exactMatch = STEP_KEYFRAMES.find(kf => kf.frame === clampedFrame);
  if (exactMatch) {
    return exactMatch;
  }
  
  // Find surrounding keyframes for interpolation
  let beforeKeyframe = STEP_KEYFRAMES[0];
  let afterKeyframe = STEP_KEYFRAMES[STEP_KEYFRAMES.length - 1];
  
  for (let i = 0; i < STEP_KEYFRAMES.length - 1; i++) {
    if (STEP_KEYFRAMES[i].frame <= clampedFrame && STEP_KEYFRAMES[i + 1].frame >= clampedFrame) {
      beforeKeyframe = STEP_KEYFRAMES[i];
      afterKeyframe = STEP_KEYFRAMES[i + 1];
      break;
    }
  }
  
  // Interpolate between keyframes
  const frameDiff = afterKeyframe.frame - beforeKeyframe.frame;
  const t = frameDiff > 0 ? (clampedFrame - beforeKeyframe.frame) / frameDiff : 0;
  
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
export function getStepDirectionVector(direction: StepDirection): [number, number, number] {
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
export const STEP_KOREAN_TERMS: Record<StepDirection, { korean: string; romanized: string; english: string }> = {
  forward: {
    korean: '전진보법',
    romanized: 'Jeonjin Bobeop',
    english: 'Forward Step',
  },
  back: {
    korean: '후퇴보법',
    romanized: 'Hutoe Bobeop',
    english: 'Retreat Step',
  },
  left: {
    korean: '좌측면보법',
    romanized: 'Jwacheuk Myeon Bobeop',
    english: 'Left Side Step',
  },
  right: {
    korean: '우측면보법',
    romanized: 'Ucheuk Myeon Bobeop',
    english: 'Right Side Step',
  },
  forward_left: {
    korean: '전좌측보법',
    romanized: 'Jeon Jwacheuk Bobeop',
    english: 'Forward-Left Diagonal Step',
  },
  forward_right: {
    korean: '전우측보법',
    romanized: 'Jeon Ucheuk Bobeop',
    english: 'Forward-Right Diagonal Step',
  },
  back_left: {
    korean: '후좌측보법',
    romanized: 'Hu Jwacheuk Bobeop',
    english: 'Back-Left Diagonal Step',
  },
  back_right: {
    korean: '후우측보법',
    romanized: 'Hu Ucheuk Bobeop',
    english: 'Back-Right Diagonal Step',
  },
};
