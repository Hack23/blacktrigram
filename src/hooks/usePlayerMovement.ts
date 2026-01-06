/**
 * React hook for managing physics-based player movement.
 * 
 * **Korean**: 플레이어 이동 훅 (Player Movement Hook)
 * 
 * Integrates the MovementPhysics engine with React component state,
 * providing seamless physics-based movement for Three.js 3D players.
 * 
 * @module hooks/usePlayerMovement
 * @category Hooks
 * @korean 플레이어이동훅
 */

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MovementPhysics, MovementState, MovementInput } from '@/systems/physics';
import { TrigramStance } from '@/types/common';

/**
 * Configuration for player movement hook.
 * 
 * **Korean**: 이동 설정 (Movement Configuration)
 * 
 * @public
 * @category Hooks
 * @korean 이동설정
 */
export interface UsePlayerMovementConfig {
  /** Current Eight Trigram stance */
  readonly stance: TrigramStance;
  /** Initial 3D position (meters) */
  readonly initialPosition?: THREE.Vector3;
  /** Leg injury factor (0-1, where 1 is fully injured) */
  readonly legInjuryFactor?: number;
  /** Whether movement is enabled */
  readonly enabled?: boolean;
  /** Maximum delta time to prevent physics instability (default: 1/30) */
  readonly maxDeltaTime?: number;
}

/**
 * Movement control inputs for physics update.
 * 
 * **Korean**: 이동 컨트롤 (Movement Controls)
 * 
 * @public
 * @category Hooks
 * @korean 이동컨트롤
 */
export interface MovementControls {
  /** Forward/backward input (-1 to 1) */
  forward: number;
  /** Lateral left/right input (-1 to 1) */
  lateral: number;
  /** Whether running */
  isRunning: boolean;
  /** Whether tactical steps enabled */
  useTacticalSteps: boolean;
}

/**
 * Return type for usePlayerMovement hook.
 * 
 * **Korean**: 이동 훅 반환 (Movement Hook Return)
 * 
 * @public
 * @category Hooks
 * @korean 이동훅반환
 */
export interface UsePlayerMovementReturn {
  /** Current 3D position (read-only reference) */
  readonly position: THREE.Vector3;
  /** Current velocity vector (read-only reference) */
  readonly velocity: THREE.Vector3;
  /** Current speed magnitude (m/s) */
  readonly speed: number;
  /** Maximum speed for current configuration (m/s) */
  readonly maxSpeed: number;
  /** Update movement controls (call from input handlers) */
  readonly updateControls: (controls: Partial<MovementControls>) => void;
  /** Reset position and velocity */
  readonly reset: () => void;
}

/**
 * React hook for physics-based player movement in Three.js.
 * 
 * **Korean**: 플레이어 이동 훅 (Player Movement Hook)
 * 
 * Manages physics-based movement with realistic acceleration, deceleration,
 * stance modifiers, and injury penalties. Integrates with @react-three/fiber
 * useFrame for 60fps updates.
 * 
 * @example
 * ```typescript
 * function Player3D({ stance, legInjury }: Props) {
 *   const { position, speed, updateControls } = usePlayerMovement({
 *     stance,
 *     legInjuryFactor: legInjury,
 *     initialPosition: new THREE.Vector3(0, 0, 0),
 *   });
 * 
 *   // Update controls from keyboard input
 *   useEffect(() => {
 *     const handleKeys = (e: KeyboardEvent) => {
 *       const controls = parseKeyboardInput(e);
 *       updateControls(controls);
 *     };
 *     window.addEventListener('keydown', handleKeys);
 *     return () => window.removeEventListener('keydown', handleKeys);
 *   }, [updateControls]);
 * 
 *   return (
 *     <mesh position={position}>
 *       <capsuleGeometry args={[0.5, 1.6]} />
 *       <meshStandardMaterial color={getStanceColor(stance)} />
 *     </mesh>
 *   );
 * }
 * ```
 * 
 * @public
 * @category Hooks
 * @korean 플레이어이동사용
 */
export function usePlayerMovement(
  config: UsePlayerMovementConfig
): UsePlayerMovementReturn {
  const {
    stance,
    initialPosition = new THREE.Vector3(0, 0, 0),
    legInjuryFactor = 0,
    enabled = true,
    maxDeltaTime = 1 / 30,
  } = config;

  // Physics engine instance (persistent across renders)
  const physicsRef = useRef<MovementPhysics>(new MovementPhysics());

  // Movement state (persistent across renders, use mutable object for performance)
  const stateRef = useRef<Omit<MovementState, 'currentStance'> & { currentStance: TrigramStance }>({
    position: initialPosition.clone(),
    velocity: new THREE.Vector3(0, 0, 0),
    acceleration: 0,
    maxSpeed: 2.0,
    currentStance: stance,
    legInjuryFactor,
  });

  // Current movement controls (updated from input handlers)
  const controlsRef = useRef<MovementControls>({
    forward: 0,
    lateral: 0,
    isRunning: false,
    useTacticalSteps: false,
  });

  // Update stance when it changes
  useEffect(() => {
    stateRef.current.currentStance = stance;
  }, [stance]);

  // Update injury factor when it changes
  useEffect(() => {
    stateRef.current.legInjuryFactor = legInjuryFactor;
  }, [legInjuryFactor]);

  // Physics update loop at 60fps
  useFrame((_threeState, delta) => {
    if (!enabled) return;

    // Clamp delta to prevent physics instability
    const safeDelta = Math.min(delta, maxDeltaTime);

    // Create movement input from current controls
    const controls = controlsRef.current;
    const input: MovementInput = {
      forward: controls.forward,
      lateral: controls.lateral,
      isRunning: controls.isRunning,
      isMoving: controls.forward !== 0 || controls.lateral !== 0,
      useTacticalSteps: controls.useTacticalSteps,
    };

    // Update physics (cast to MovementState for physics engine)
    physicsRef.current.updateMovement(stateRef.current as MovementState, input, safeDelta);
  });

  // Update controls function (memoized to avoid recreation)
  const updateControls = useRef((controls: Partial<MovementControls>) => {
    Object.assign(controlsRef.current, controls);
  }).current;

  // Reset function
  const reset = useRef(() => {
    stateRef.current.position.copy(initialPosition);
    stateRef.current.velocity.set(0, 0, 0);
    stateRef.current.acceleration = 0;
    controlsRef.current.forward = 0;
    controlsRef.current.lateral = 0;
    controlsRef.current.isRunning = false;
  }).current;

  return {
    position: stateRef.current.position,
    velocity: stateRef.current.velocity,
    speed: stateRef.current.velocity.length(),
    maxSpeed: stateRef.current.maxSpeed,
    updateControls,
    reset,
  };
}
