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

/**
 * Calculate ankle articulation for kick chamber
 * 
 * Determines proper ankle positioning for kick chambering and extension,
 * crucial for proper foot alignment and power transfer in Korean martial arts.
 * 
 * @param kickType - Type of kick being chambered
 * @param phase - Kick phase: 'chamber', 'extension', 'retraction'
 * @param side - Which ankle
 * @returns Ankle articulation state with flexion and inversion angles
 * 
 * @example
 * ```typescript
 * const ankleState = calculateAnkleArticulation('front', 'extension', 'right');
 * // Returns: { flexion: 0.5, inversion: 0, side: 'right' }
 * ```
 * 
 * @public
 * @korean 차기챔버용발목관절계산
 */
export function calculateAnkleArticulation(
  kickType: 'front' | 'roundhouse' | 'side' | 'hook' | 'axe',
  phase: 'chamber' | 'extension' | 'retraction',
  side: 'left' | 'right'
): AnkleArticulationState {
  let flexion = 0;
  let inversion = 0;

  switch (kickType) {
    case 'front':
      if (phase === 'chamber') {
        flexion = 0.2; // Slight dorsiflexion in chamber
      } else if (phase === 'extension') {
        flexion = 0.5; // Strong dorsiflexion for striking with ball of foot
      } else {
        flexion = 0.1; // Slight flexion during retraction
      }
      inversion = 0; // Neutral for front kicks
      break;

    case 'roundhouse':
      if (phase === 'chamber') {
        flexion = -0.3; // Plantarflexion in chamber
      } else if (phase === 'extension') {
        flexion = -0.5; // Strong plantarflexion for instep strike
        inversion = -0.2; // Slight eversion to align instep
      } else {
        flexion = -0.2;
        inversion = 0;
      }
      break;

    case 'side':
      if (phase === 'chamber') {
        flexion = 0.3; // Dorsiflexion in chamber
      } else if (phase === 'extension') {
        flexion = 0.4; // Dorsiflexion for heel/blade strike
        inversion = 0.3; // Inversion to present blade edge
      } else {
        flexion = 0.2;
        inversion = 0.1;
      }
      break;

    case 'hook':
      if (phase === 'chamber') {
        flexion = -0.2;
      } else if (phase === 'extension') {
        flexion = -0.4; // Plantarflexion for heel strike
        inversion = -0.15; // Slight eversion
      } else {
        flexion = -0.1;
        inversion = 0;
      }
      break;

    case 'axe':
      if (phase === 'chamber') {
        flexion = 0.1; // Minimal flexion in high chamber
      } else if (phase === 'extension') {
        flexion = 0.5; // Strong dorsiflexion for downward strike
      } else {
        flexion = 0.2;
      }
      inversion = 0; // Neutral for axe kicks
      break;
  }

  // Apply constraints
  flexion = Math.max(
    ADVANCED_JOINT_CONSTRAINTS.ANKLE_ARTICULATION.FLEXION_MIN,
    Math.min(ADVANCED_JOINT_CONSTRAINTS.ANKLE_ARTICULATION.FLEXION_MAX, flexion)
  );
  inversion = Math.max(
    ADVANCED_JOINT_CONSTRAINTS.ANKLE_ARTICULATION.INVERSION_MIN,
    Math.min(ADVANCED_JOINT_CONSTRAINTS.ANKLE_ARTICULATION.INVERSION_MAX, inversion)
  );

  return { flexion, inversion, side };
}

/**
 * Calculate wrist snap for hand strikes
 * 
 * Determines wrist rotation and velocity for power generation in
 * backfist, knife-hand, and other Korean martial arts hand techniques.
 * 
 * @param strikeType - Type of hand strike
 * @param phase - Strike phase: 'wind-up', 'impact', 'follow-through'
 * @param side - Which wrist
 * @returns Wrist snap state with rotation angle and velocity
 * 
 * @example
 * ```typescript
 * const wristState = calculateWristSnap('backfist', 'impact', 'right');
 * // Returns: { rotation: 1.2, velocity: 25.0, side: 'right' }
 * ```
 * 
 * @public
 * @korean 수격용손목스냅계산
 */
export function calculateWristSnap(
  strikeType: 'backfist' | 'knife-hand' | 'palm-heel' | 'ridge-hand' | 'hammer-fist',
  phase: 'wind-up' | 'impact' | 'follow-through',
  side: 'left' | 'right'
): WristSnapState {
  let rotation = 0;
  let velocity = 0;

  switch (strikeType) {
    case 'backfist':
      if (phase === 'wind-up') {
        rotation = -0.8; // Cocked back
        velocity = 0;
      } else if (phase === 'impact') {
        rotation = 1.2; // Snapped forward
        velocity = 25.0; // High velocity snap
      } else {
        rotation = 0.5;
        velocity = 5.0;
      }
      break;

    case 'knife-hand':
      if (phase === 'wind-up') {
        rotation = -0.5;
        velocity = 0;
      } else if (phase === 'impact') {
        rotation = 0.8; // Moderate snap for precision
        velocity = 20.0;
      } else {
        rotation = 0.3;
        velocity = 3.0;
      }
      break;

    case 'palm-heel':
      if (phase === 'wind-up') {
        rotation = -0.3; // Minimal wind-up
        velocity = 0;
      } else if (phase === 'impact') {
        rotation = 0.5; // Push through
        velocity = 15.0; // Lower velocity, more push
      } else {
        rotation = 0.2;
        velocity = 2.0;
      }
      break;

    case 'ridge-hand':
      if (phase === 'wind-up') {
        rotation = 0.8; // Opposite direction
        velocity = 0;
      } else if (phase === 'impact') {
        rotation = -1.0; // Reverse snap
        velocity = 22.0;
      } else {
        rotation = -0.4;
        velocity = 4.0;
      }
      break;

    case 'hammer-fist':
      if (phase === 'wind-up') {
        rotation = 0.2; // Minimal rotation
        velocity = 0;
      } else if (phase === 'impact') {
        rotation = 0.3; // Downward strike, less rotation
        velocity = 18.0;
      } else {
        rotation = 0.1;
        velocity = 2.0;
      }
      break;
  }

  // Apply constraints
  rotation = Math.max(
    ADVANCED_JOINT_CONSTRAINTS.WRIST_SNAP.ROTATION_MIN,
    Math.min(ADVANCED_JOINT_CONSTRAINTS.WRIST_SNAP.ROTATION_MAX, rotation)
  );
  velocity = Math.min(ADVANCED_JOINT_CONSTRAINTS.WRIST_SNAP.MAX_VELOCITY, Math.abs(velocity));

  return { rotation, velocity, side };
}

/**
 * Calculate wrist snap power modifier
 * 
 * Determines power bonus based on wrist snap velocity and rotation.
 * Higher velocity generates more power for whipping strikes.
 * 
 * @param wristState - Current wrist snap state
 * @returns Power multiplier (1.0-1.25x, with hand strikes getting up to 25% bonus)
 * 
 * @example
 * ```typescript
 * const wristState = calculateWristSnap('backfist', 'impact', 'right');
 * const power = calculateWristSnapPowerModifier(wristState);
 * // Returns ~1.20 for proper backfist snap
 * ```
 * 
 * @public
 * @korean 손목스냅파워배율계산
 */
export function calculateWristSnapPowerModifier(wristState: WristSnapState): number {
  // Normalize velocity to 0-1 range
  const normalizedVelocity = wristState.velocity / ADVANCED_JOINT_CONSTRAINTS.WRIST_SNAP.MAX_VELOCITY;
  
  // Normalize rotation magnitude to 0-1 range
  const normalizedRotation = Math.abs(wristState.rotation) / ADVANCED_JOINT_CONSTRAINTS.WRIST_SNAP.ROTATION_MAX;
  
  // Velocity contributes 70%, rotation contributes 30%
  const powerFactor = (normalizedVelocity * 0.7) + (normalizedRotation * 0.3);
  
  // Hand strikes get up to 25% power bonus from wrist snap
  return 1.0 + (powerFactor * 0.25);
}

/**
 * Calculate shoulder elevation for blocks and overhead strikes
 * 
 * Determines vertical shoulder movement for defensive blocks and
 * overhead striking techniques in Korean martial arts.
 * 
 * @param techniqueType - Type of technique requiring shoulder movement
 * @param phase - Technique phase
 * @param side - Which shoulder
 * @returns Shoulder elevation state with vertical displacement
 * 
 * @example
 * ```typescript
 * const shoulderState = calculateShoulderElevation('high-block', 'execution', 'left');
 * // Returns: { elevation: 0.04, side: 'left' }
 * ```
 * 
 * @public
 * @korean 블록및상단공격용어깨들어올림계산
 */
export function calculateShoulderElevation(
  techniqueType: 'high-block' | 'overhead-strike' | 'rising-block' | 'shrug' | 'neutral',
  phase: 'preparation' | 'execution' | 'recovery',
  side: 'left' | 'right'
): ShoulderElevationState {
  let elevation = 0;

  switch (techniqueType) {
    case 'high-block':
      if (phase === 'preparation') {
        elevation = -0.02; // Slight drop before elevation
      } else if (phase === 'execution') {
        elevation = 0.04; // Elevate for high block
      } else {
        elevation = 0.01; // Slight elevation maintained
      }
      break;

    case 'overhead-strike':
      if (phase === 'preparation') {
        elevation = 0.03; // Pre-elevation for wind-up
      } else if (phase === 'execution') {
        elevation = 0.05; // Maximum elevation for overhead power
      } else {
        elevation = 0.01;
      }
      break;

    case 'rising-block':
      if (phase === 'preparation') {
        elevation = -0.03; // Lower for rising motion
      } else if (phase === 'execution') {
        elevation = 0.04; // Elevate as block rises
      } else {
        elevation = 0.02;
      }
      break;

    case 'shrug':
      if (phase === 'execution') {
        elevation = 0.05; // Maximum elevation for defensive shrug
      } else {
        elevation = 0;
      }
      break;

    case 'neutral':
      elevation = 0;
      break;
  }

  // Apply constraints
  elevation = Math.max(
    ADVANCED_JOINT_CONSTRAINTS.SHOULDER_ELEVATION.MIN,
    Math.min(ADVANCED_JOINT_CONSTRAINTS.SHOULDER_ELEVATION.MAX, elevation)
  );

  return { elevation, side };
}

/**
 * Calculate spinal flexion for dodges and low attacks
 * 
 * Determines forward/backward and lateral bending of spine for
 * defensive movements and low attack positioning.
 * 
 * @param movementType - Type of movement requiring spinal flexion
 * @param intensity - Movement intensity (0=minimal, 1=full)
 * @returns Spinal flexion state with flexion and lateral bend angles
 * 
 * @example
 * ```typescript
 * const spineState = calculateSpinalFlexion('duck', 0.8);
 * // Returns: { flexion: 0.6, lateralBend: 0 }
 * ```
 * 
 * @public
 * @korean 회피및하단공격용척추굽힘계산
 */
export function calculateSpinalFlexion(
  movementType: 'duck' | 'lean-back' | 'lean-left' | 'lean-right' | 'low-attack' | 'neutral',
  intensity: number = 1.0
): SpinalFlexionState {
  let flexion = 0;
  let lateralBend = 0;

  // Clamp intensity to 0-1 range
  intensity = Math.max(0, Math.min(1, intensity));

  switch (movementType) {
    case 'duck':
      flexion = 0.7 * intensity; // Forward bend for ducking
      lateralBend = 0;
      break;

    case 'lean-back':
      flexion = -0.4 * intensity; // Backward bend for evasion
      lateralBend = 0;
      break;

    case 'lean-left':
      flexion = 0.1 * intensity; // Slight forward component
      lateralBend = -0.25 * intensity; // Left lateral bend
      break;

    case 'lean-right':
      flexion = 0.1 * intensity;
      lateralBend = 0.25 * intensity; // Right lateral bend
      break;

    case 'low-attack':
      flexion = 0.5 * intensity; // Forward bend for low strikes
      lateralBend = 0;
      break;

    case 'neutral':
      flexion = 0;
      lateralBend = 0;
      break;
  }

  // Apply constraints
  flexion = Math.max(
    ADVANCED_JOINT_CONSTRAINTS.SPINAL_FLEXION.FLEXION_MIN,
    Math.min(ADVANCED_JOINT_CONSTRAINTS.SPINAL_FLEXION.FLEXION_MAX, flexion)
  );
  lateralBend = Math.max(
    ADVANCED_JOINT_CONSTRAINTS.SPINAL_FLEXION.LATERAL_MIN,
    Math.min(ADVANCED_JOINT_CONSTRAINTS.SPINAL_FLEXION.LATERAL_MAX, lateralBend)
  );

  return { flexion, lateralBend };
}

/**
 * Calculate knee drive for knee strikes and clinch
 * 
 * Determines independent knee positioning for close-range combat,
 * crucial for knee strike power and clinch work positioning.
 * 
 * @param technique - Technique requiring knee drive
 * @param phase - Technique phase
 * @param side - Which knee
 * @returns Knee drive state with height and forward distance
 * 
 * @example
 * ```typescript
 * const kneeState = calculateKneeDrive('knee-strike', 'impact', 'right');
 * // Returns: { height: 0.7, forward: 0.25, side: 'right' }
 * ```
 * 
 * @public
 * @korean 무릎차기및클린치용무릎밀어올림계산
 */
export function calculateKneeDrive(
  technique: 'knee-strike' | 'clinch-control' | 'push-kick' | 'neutral',
  phase: 'wind-up' | 'execution' | 'recovery',
  side: 'left' | 'right'
): KneeDriveState {
  let height = 0;
  let forward = 0;

  switch (technique) {
    case 'knee-strike':
      if (phase === 'wind-up') {
        height = 0.3; // Partial chamber
        forward = 0.1;
      } else if (phase === 'execution') {
        height = 0.7; // Drive upward
        forward = 0.25; // Drive forward for power
      } else {
        height = 0.2;
        forward = 0.05;
      }
      break;

    case 'clinch-control':
      if (phase === 'execution') {
        height = 0.4; // Moderate elevation for control
        forward = 0.15; // Forward pressure
      } else {
        height = 0.2;
        forward = 0.08;
      }
      break;

    case 'push-kick':
      if (phase === 'wind-up') {
        height = 0.5; // High chamber
        forward = 0.05;
      } else if (phase === 'execution') {
        height = 0.6; // Maintain height
        forward = 0.3; // Strong forward drive
      } else {
        height = 0.3;
        forward = 0.1;
      }
      break;

    case 'neutral':
      height = 0;
      forward = 0;
      break;
  }

  // Apply constraints
  height = Math.max(
    ADVANCED_JOINT_CONSTRAINTS.KNEE_DRIVE.HEIGHT_MIN,
    Math.min(ADVANCED_JOINT_CONSTRAINTS.KNEE_DRIVE.HEIGHT_MAX, height)
  );
  forward = Math.max(
    ADVANCED_JOINT_CONSTRAINTS.KNEE_DRIVE.FORWARD_MIN,
    Math.min(ADVANCED_JOINT_CONSTRAINTS.KNEE_DRIVE.FORWARD_MAX, forward)
  );

  return { height, forward, side };
}

/**
 * Calculate knee strike power modifier
 * 
 * Determines power bonus based on knee drive height and forward momentum.
 * Greater drive generates more power through proper mechanics.
 * 
 * @param kneeState - Current knee drive state
 * @returns Power multiplier (1.0-1.35x, with knee strikes getting up to 35% bonus)
 * 
 * @example
 * ```typescript
 * const kneeState = calculateKneeDrive('knee-strike', 'execution', 'right');
 * const power = calculateKneeStrikePowerModifier(kneeState);
 * // Returns ~1.30 for properly executed knee strike
 * ```
 * 
 * @public
 * @korean 무릎차기파워배율계산
 */
export function calculateKneeStrikePowerModifier(kneeState: KneeDriveState): number {
  // Normalize height to 0-1 range
  const normalizedHeight = kneeState.height / ADVANCED_JOINT_CONSTRAINTS.KNEE_DRIVE.HEIGHT_MAX;
  
  // Normalize forward drive to 0-1 range
  const normalizedForward = kneeState.forward / ADVANCED_JOINT_CONSTRAINTS.KNEE_DRIVE.FORWARD_MAX;
  
  // Height contributes 60%, forward drive contributes 40%
  const powerFactor = (normalizedHeight * 0.6) + (normalizedForward * 0.4);
  
  // Knee strikes get up to 35% power bonus from proper drive
  return 1.0 + (powerFactor * 0.35);
}

