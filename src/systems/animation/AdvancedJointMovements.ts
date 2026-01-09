/**
 * Advanced Joint Movement System for Korean Martial Arts
 * 
 * Extends the base skeletal animation system with specialized joint movements
 * for authentic martial arts technique execution:
 * - Hip rotation for kicks (고관절 회전)
 * - Shoulder elevation/depression (어깨 들어올림)
 * - Ankle articulation (발목 관절)
 * - Wrist snap mechanics (손목 스냅)
 * - Knee drive positioning (무릎 밀어올림)
 * - Spinal flexion/extension (척추 굽힘)
 * 
 * @module systems/animation/AdvancedJointMovements
 * @category Animation System
 * @korean 고급관절동작시스템
 */

import * as THREE from "three";

/**
 * Hip rotation state for dynamic kick mechanics
 * 
 * Tracks independent hip rotation in multiple planes for realistic
 * high kicks, roundhouse kicks, and hook kicks. Separates hip rotation
 * from pelvis rotation for authentic martial arts biomechanics.
 * 
 * Korean: 고관절 회전 상태
 * 
 * @public
 */
export interface HipRotationState {
  /**
   * Frontal plane rotation (abduction/adduction) in radians
   * - Positive: Leg moves away from body centerline (abduction)
   * - Negative: Leg moves toward centerline (adduction)
   * Range: ±1.8 rad (±103°) for high kicks
   * 
   * @korean 외전각도
   */
  readonly frontalRotation: number;

  /**
   * Sagittal plane rotation (flexion/extension) in radians
   * - Positive: Leg moves forward (flexion)
   * - Negative: Leg moves backward (extension)
   * Range: -1.8 to 1.8 rad for kicks
   * 
   * @korean 굴곡각도
   */
  readonly sagittalRotation: number;

  /**
   * Transverse plane rotation (internal/external rotation) in radians
   * - Positive: Thigh rotates inward
   * - Negative: Thigh rotates outward
   * Range: ±0.8 rad (±46°)
   * 
   * @korean 회전각도
   */
  readonly transverseRotation: number;

  /**
   * Which hip (left or right)
   * @korean 측면
   */
  readonly side: 'left' | 'right';
}

/**
 * Shoulder elevation/depression state for blocks and overhead strikes
 * 
 * Tracks vertical shoulder movement independent of arm rotation.
 * Essential for authentic blocking mechanics and overhead techniques.
 * 
 * Korean: 어깨 들어올림 상태
 * 
 * @public
 */
export interface ShoulderElevationState {
  /**
   * Vertical displacement in meters
   * - Positive: Shoulder elevated (shrug)
   * - Negative: Shoulder depressed (drop)
   * Range: ±0.05 m (±5cm)
   * 
   * @korean 수직변위
   */
  readonly elevation: number;

  /**
   * Which shoulder (left or right)
   * @korean 측면
   */
  readonly side: 'left' | 'right';
}

/**
 * Ankle articulation state for kick chambers and pivots
 * 
 * Tracks ankle joint positioning crucial for proper kick mechanics
 * and pivoting in Korean martial arts.
 * 
 * Korean: 발목 관절 상태
 * 
 * @public
 */
export interface AnkleArticulationState {
  /**
   * Dorsiflexion/plantarflexion angle in radians
   * - Positive: Toes point up (dorsiflexion)
   * - Negative: Toes point down (plantarflexion)
   * Range: -0.8 to 0.5 rad
   * 
   * @korean 발등굽힘각도
   */
  readonly flexion: number;

  /**
   * Inversion/eversion angle in radians
   * Range: ±0.4 rad (±23°)
   * 
   * @korean 안쪽굽힘각도
   */
  readonly inversion: number;

  /**
   * Which ankle (left or right)
   * @korean 측면
   */
  readonly side: 'left' | 'right';
}

/**
 * Wrist snap state for rapid hand strikes
 * 
 * Tracks rapid wrist rotation mechanics essential for backfist,
 * knife-hand, and other Korean martial arts hand techniques.
 * 
 * Korean: 손목 스냅 상태
 * 
 * @public
 */
export interface WristSnapState {
  /**
   * Rotation angle in radians
   * Range: ±1.5 rad (±86°)
   * 
   * @korean 회전각도
   */
  readonly rotation: number;

  /**
   * Snap velocity in rad/s (for power calculation)
   * @korean 회전속도
   */
  readonly velocity: number;

  /**
   * Which wrist (left or right)
   * @korean 측면
   */
  readonly side: 'left' | 'right';
}

/**
 * Knee drive state for clinch work and knee strikes
 * 
 * Tracks independent knee positioning crucial for close-range
 * combat and knee strike techniques.
 * 
 * Korean: 무릎 밀어올림 상태
 * 
 * @public
 */
export interface KneeDriveState {
  /**
   * Drive height in meters (vertical displacement)
   * Range: 0 to 0.8 m (80cm max lift)
   * 
   * @korean 들어올림높이
   */
  readonly height: number;

  /**
   * Forward drive distance in meters
   * Range: 0 to 0.3 m (30cm)
   * 
   * @korean 전방거리
   */
  readonly forward: number;

  /**
   * Which knee (left or right)
   * @korean 측면
   */
  readonly side: 'left' | 'right';
}

/**
 * Spinal flexion/extension state for dodges and low attacks
 * 
 * Tracks forward/backward bending of spine for defensive
 * movements and low attack positioning.
 * 
 * Korean: 척추 굽힘 상태
 * 
 * @public
 */
export interface SpinalFlexionState {
  /**
   * Flexion angle in radians (forward/backward bend)
   * - Positive: Forward bend
   * - Negative: Backward bend
   * Range: -0.5 to 0.8 rad
   * 
   * @korean 굽힘각도
   */
  readonly flexion: number;

  /**
   * Lateral bend in radians (side to side)
   * Range: ±0.3 rad (±17°)
   * 
   * @korean 측면굽힘각도
   */
  readonly lateralBend: number;
}

/**
 * Advanced joint movement constraints
 * 
 * Defines anatomically correct limits for all advanced joint movements
 * based on human biomechanics and Korean martial arts techniques.
 * 
 * @korean 고급관절제약조건
 */
export const ADVANCED_JOINT_CONSTRAINTS = {
  /**
   * Hip rotation constraints for kicks
   * @korean 고관절제약조건
   */
  HIP_ROTATION: {
    FRONTAL_MIN: -1.8, // -103° adduction
    FRONTAL_MAX: 1.8,  // 103° abduction
    SAGITTAL_MIN: -1.8, // -103° extension
    SAGITTAL_MAX: 1.8,  // 103° flexion
    TRANSVERSE_MIN: -0.8, // -46° external rotation
    TRANSVERSE_MAX: 0.8,  // 46° internal rotation
  },

  /**
   * Shoulder elevation constraints
   * @korean 어깨들어올림제약조건
   */
  SHOULDER_ELEVATION: {
    MIN: -0.05, // -5cm depression
    MAX: 0.05,  // 5cm elevation
  },

  /**
   * Ankle articulation constraints
   * @korean 발목관절제약조건
   */
  ANKLE_ARTICULATION: {
    FLEXION_MIN: -0.8, // -46° plantarflexion
    FLEXION_MAX: 0.5,  // 29° dorsiflexion
    INVERSION_MIN: -0.4, // -23° eversion
    INVERSION_MAX: 0.4,  // 23° inversion
  },

  /**
   * Wrist snap constraints
   * @korean 손목스냅제약조건
   */
  WRIST_SNAP: {
    ROTATION_MIN: -1.5, // -86°
    ROTATION_MAX: 1.5,  // 86°
    MAX_VELOCITY: 30.0, // 30 rad/s for power strikes
  },

  /**
   * Knee drive constraints
   * @korean 무릎밀어올림제약조건
   */
  KNEE_DRIVE: {
    HEIGHT_MIN: 0,    // Ground level
    HEIGHT_MAX: 0.8,  // 80cm max lift
    FORWARD_MIN: 0,
    FORWARD_MAX: 0.3, // 30cm forward
  },

  /**
   * Spinal flexion constraints
   * @korean 척추굽힘제약조건
   */
  SPINAL_FLEXION: {
    FLEXION_MIN: -0.5, // -29° extension (backward)
    FLEXION_MAX: 0.8,  // 46° flexion (forward)
    LATERAL_MIN: -0.3, // -17° left bend
    LATERAL_MAX: 0.3,  // 17° right bend
  },
} as const;

/**
 * Calculate hip rotation for kick mechanics
 * 
 * Determines optimal hip rotation angles for various kick types,
 * ensuring anatomically correct positioning and maximum power generation.
 * 
 * @param kickType - Type of kick being performed
 * @param targetHeight - Target height for kick (0=low, 1=medium, 2=high)
 * @param side - Which leg is kicking
 * @returns Hip rotation state with all three plane rotations
 * 
 * @example
 * ```typescript
 * const hipState = calculateHipRotationForKick('roundhouse', 2, 'right');
 * // Returns frontal: 1.5, sagittal: 1.3, transverse: 0.6 for high roundhouse
 * ```
 * 
 * @public
 * @korean 차기용고관절회전계산
 */
export function calculateHipRotationForKick(
  kickType: 'front' | 'roundhouse' | 'side' | 'hook' | 'axe',
  targetHeight: 0 | 1 | 2, // low=0, medium=1, high=2
  side: 'left' | 'right'
): HipRotationState {
  let frontalRotation = 0;
  let sagittalRotation = 0;
  let transverseRotation = 0;

  // Height multiplier (more rotation needed for higher kicks)
  const heightMultiplier = targetHeight === 0 ? 0.5 : targetHeight === 1 ? 0.75 : 1.0;

  switch (kickType) {
    case 'front':
      // Front kick: primarily sagittal plane (forward)
      sagittalRotation = 1.5 * heightMultiplier;
      frontalRotation = 0.2; // Slight abduction for balance
      transverseRotation = 0;
      break;

    case 'roundhouse':
      // Roundhouse: combination of frontal abduction and transverse rotation
      frontalRotation = 1.5 * heightMultiplier;
      sagittalRotation = 0.8 * heightMultiplier;
      transverseRotation = 0.6 * heightMultiplier; // Internal rotation for power
      break;

    case 'side':
      // Side kick: primarily frontal plane (abduction)
      frontalRotation = 1.6 * heightMultiplier;
      sagittalRotation = 0.3;
      transverseRotation = -0.4; // External rotation for proper foot alignment
      break;

    case 'hook':
      // Hook kick: high abduction with forward component
      frontalRotation = 1.7 * heightMultiplier;
      sagittalRotation = 1.2 * heightMultiplier;
      transverseRotation = 0.5;
      break;

    case 'axe':
      // Axe kick: maximum sagittal flexion, some abduction
      frontalRotation = 0.8 * heightMultiplier;
      sagittalRotation = 1.8 * heightMultiplier; // Maximum forward flexion
      transverseRotation = 0.2;
      break;
  }

  // Apply constraints
  frontalRotation = Math.max(
    ADVANCED_JOINT_CONSTRAINTS.HIP_ROTATION.FRONTAL_MIN,
    Math.min(ADVANCED_JOINT_CONSTRAINTS.HIP_ROTATION.FRONTAL_MAX, frontalRotation)
  );
  sagittalRotation = Math.max(
    ADVANCED_JOINT_CONSTRAINTS.HIP_ROTATION.SAGITTAL_MIN,
    Math.min(ADVANCED_JOINT_CONSTRAINTS.HIP_ROTATION.SAGITTAL_MAX, sagittalRotation)
  );
  transverseRotation = Math.max(
    ADVANCED_JOINT_CONSTRAINTS.HIP_ROTATION.TRANSVERSE_MIN,
    Math.min(ADVANCED_JOINT_CONSTRAINTS.HIP_ROTATION.TRANSVERSE_MAX, transverseRotation)
  );

  return {
    frontalRotation,
    sagittalRotation,
    transverseRotation,
    side,
  };
}

/**
 * Calculate kick power modifier from hip rotation
 * 
 * Determines power bonus based on proper hip rotation technique.
 * Greater rotation in the correct planes generates more power.
 * 
 * @param hipState - Current hip rotation state
 * @param kickType - Type of kick
 * @returns Power multiplier (1.0-1.40x, with kicks getting up to 40% bonus)
 * 
 * @example
 * ```typescript
 * const hipState = calculateHipRotationForKick('roundhouse', 2, 'right');
 * const power = calculateKickPowerFromHipRotation(hipState, 'roundhouse');
 * // Returns ~1.35 for properly executed high roundhouse
 * ```
 * 
 * @public
 * @korean 고관절회전에서차기파워계산
 */
export function calculateKickPowerFromHipRotation(
  hipState: HipRotationState,
  kickType: 'front' | 'roundhouse' | 'side' | 'hook' | 'axe'
): number {
  // Normalize rotations to 0-1 range based on constraints
  const normalizedFrontal = Math.abs(hipState.frontalRotation) / 
    ADVANCED_JOINT_CONSTRAINTS.HIP_ROTATION.FRONTAL_MAX;
  const normalizedSagittal = Math.abs(hipState.sagittalRotation) / 
    ADVANCED_JOINT_CONSTRAINTS.HIP_ROTATION.SAGITTAL_MAX;
  const normalizedTransverse = Math.abs(hipState.transverseRotation) / 
    ADVANCED_JOINT_CONSTRAINTS.HIP_ROTATION.TRANSVERSE_MAX;

  // Different kicks benefit from different rotation planes
  let powerFactor = 0;
  switch (kickType) {
    case 'front':
      powerFactor = normalizedSagittal * 0.8 + normalizedFrontal * 0.2;
      break;
    case 'roundhouse':
      powerFactor = normalizedFrontal * 0.5 + normalizedTransverse * 0.3 + normalizedSagittal * 0.2;
      break;
    case 'side':
      powerFactor = normalizedFrontal * 0.7 + normalizedTransverse * 0.3;
      break;
    case 'hook':
      powerFactor = normalizedFrontal * 0.4 + normalizedSagittal * 0.4 + normalizedTransverse * 0.2;
      break;
    case 'axe':
      powerFactor = normalizedSagittal * 0.8 + normalizedFrontal * 0.2;
      break;
  }

  // Kicks can get up to 40% power bonus from proper hip rotation
  return 1.0 + (powerFactor * 0.40);
}

/**
 * Apply hip rotation to Three.js Euler angles
 * 
 * Converts hip rotation state into Three.js Euler angles for rendering.
 * 
 * @param hipState - Hip rotation state
 * @returns Three.js Euler angles (X=sagittal, Y=transverse, Z=frontal)
 * 
 * @public
 * @korean 고관절회전을오일러각으로적용
 */
export function applyHipRotationToEuler(hipState: HipRotationState): THREE.Euler {
  return new THREE.Euler(
    hipState.sagittalRotation,  // X-axis: forward/backward
    hipState.transverseRotation, // Y-axis: twist
    hipState.frontalRotation,    // Z-axis: side to side
    'XYZ'
  );
}
