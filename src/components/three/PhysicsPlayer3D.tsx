/**
 * Example Player3D component demonstrating physics-based movement integration.
 * 
 * **Korean**: 물리 기반 플레이어 3D 예제 (Physics-Based Player 3D Example)
 * 
 * This component demonstrates how to integrate the MovementPhysics system
 * with a Three.js 3D player character using the usePlayerMovement hook.
 * 
 * @module components/three/PhysicsPlayer3D
 * @category 3D Components
 * @korean 물리플레이어3D
 */

import React, { useEffect, useCallback, useState } from 'react';
import { usePlayerMovement } from '@/hooks/usePlayerMovement';
import { TrigramStance } from '@/types/common';
import { KOREAN_COLORS } from '@/types/constants';
import * as THREE from 'three';

/**
 * Props for PhysicsPlayer3D component.
 * 
 * **Korean**: 물리 플레이어 3D 속성
 * 
 * @public
 * @category 3D Components
 */
export interface PhysicsPlayer3DProps {
  /** Current Eight Trigram stance */
  readonly stance: TrigramStance;
  /** Leg injury factor (0 = healthy, 1 = critical) */
  readonly legInjuryFactor?: number;
  /** Initial position */
  readonly initialPosition?: THREE.Vector3;
  /** Whether movement is enabled */
  readonly enabled?: boolean;
  /** Whether to show velocity indicators */
  readonly showVelocity?: boolean;
  /** Callback when position changes */
  readonly onPositionChange?: (position: THREE.Vector3) => void;
}

/**
 * Get color for stance visualization.
 * 
 * @param stance - Eight Trigram stance
 * @returns Three.js color for the stance
 */
function getStanceColor(stance: TrigramStance): number {
  const stanceColors: Record<TrigramStance, number> = {
    [TrigramStance.GEON]: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
    [TrigramStance.TAE]: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
    [TrigramStance.LI]: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,
    [TrigramStance.JIN]: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
    [TrigramStance.SON]: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
    [TrigramStance.GAM]: KOREAN_COLORS.TRIGRAM_GAM_PRIMARY,
    [TrigramStance.GAN]: KOREAN_COLORS.TRIGRAM_GAN_PRIMARY,
    [TrigramStance.GON]: KOREAN_COLORS.TRIGRAM_GON_PRIMARY,
  };
  return stanceColors[stance];
}

/**
 * Example player component with physics-based movement.
 * 
 * **Korean**: 물리 기반 플레이어 3D (Physics-Based Player 3D)
 * 
 * Demonstrates integration of:
 * - usePlayerMovement hook for physics
 * - Keyboard controls (WASD + Shift for running)
 * - Stance-based visual feedback
 * - Velocity visualization
 * 
 * @example
 * ```tsx
 * <Canvas>
 *   <PhysicsPlayer3D
 *     stance={TrigramStance.GEON}
 *     legInjuryFactor={0.2}
 *     showVelocity={true}
 *   />
 * </Canvas>
 * ```
 * 
 * @public
 * @category 3D Components
 */
export const PhysicsPlayer3D: React.FC<PhysicsPlayer3DProps> = ({
  stance,
  legInjuryFactor = 0,
  initialPosition = new THREE.Vector3(0, 0, 0),
  enabled = true,
  showVelocity = false,
  onPositionChange,
}) => {
  // Physics-based movement
  const { position, velocity, speed, updateControls } = usePlayerMovement({
    stance,
    legInjuryFactor,
    initialPosition,
    enabled,
  });

  // Track key states for movement
  const [keys, setKeys] = useState({
    forward: 0,
    lateral: 0,
    isRunning: false,
  });

  // Update position callback
  useEffect(() => {
    if (onPositionChange) {
      onPositionChange(position);
    }
  }, [position, onPositionChange]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    switch (e.key.toLowerCase()) {
      case 'w':
        setKeys(prev => ({ ...prev, forward: 1 }));
        break;
      case 's':
        setKeys(prev => ({ ...prev, forward: -1 }));
        break;
      case 'a':
        setKeys(prev => ({ ...prev, lateral: -1 }));
        break;
      case 'd':
        setKeys(prev => ({ ...prev, lateral: 1 }));
        break;
      case 'shift':
        setKeys(prev => ({ ...prev, isRunning: true }));
        break;
    }
  }, [enabled]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    switch (e.key.toLowerCase()) {
      case 'w':
      case 's':
        setKeys(prev => ({ ...prev, forward: 0 }));
        break;
      case 'a':
      case 'd':
        setKeys(prev => ({ ...prev, lateral: 0 }));
        break;
      case 'shift':
        setKeys(prev => ({ ...prev, isRunning: false }));
        break;
    }
  }, [enabled]);

  // Register keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Update physics controls when keys change
  useEffect(() => {
    updateControls({
      forward: keys.forward,
      lateral: keys.lateral,
      isRunning: keys.isRunning,
    });
  }, [keys, updateControls]);

  // Calculate emissive intensity based on speed
  const emissiveIntensity = Math.min(speed / 4.0, 0.5);

  return (
    <group>
      {/* Player capsule */}
      <mesh position={position} castShadow receiveShadow>
        <capsuleGeometry args={[0.5, 1.6, 16, 32]} />
        <meshStandardMaterial
          color={getStanceColor(stance)}
          emissive={KOREAN_COLORS.PRIMARY_CYAN}
          emissiveIntensity={emissiveIntensity}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Velocity indicator (optional) */}
      {showVelocity && speed > 0.1 && (
        <arrowHelper
          args={[
            velocity.clone().normalize(),
            position.clone().add(new THREE.Vector3(0, 1, 0)),
            speed * 0.5,
            KOREAN_COLORS.ACCENT_GOLD,
            0.3,
            0.2,
          ]}
        />
      )}

      {/* Ground shadow plane */}
      <mesh
        position={[position.x, 0.01, position.z]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[0.6, 32]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </group>
  );
};

export default PhysicsPlayer3D;
