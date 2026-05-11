/**
 * TrainingAICharacter3D - 3D character model for AI opponent in training
 *
 * Displays the AI opponent with stance-based materials and animations
 *
 * Performance optimizations:
 * - Memoized geometries to prevent recreation on every render
 * - Memoized materials for consistent shading
 * - Minimal per-frame operations for 60fps target
 * - Physics-based attack movement for realistic forward momentum
 */

import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { TrigramStance } from "../../../../types/common";
import { KOREAN_COLORS } from "../../../../types/constants";
import { AttackMovementPhysics } from "../../../../systems/physics";
import { AnimationType } from "../../../../systems/animation";

/**
 * Props for TrainingAICharacter3D
 */
export interface TrainingAICharacter3DProps {
  /** Position in 3D space */
  readonly position: [number, number, number];
  /** Current trigram stance */
  readonly stance: TrigramStance;
  /** Whether AI is currently attacking */
  readonly isAttacking?: boolean;
  /** Animation type for current attack (used for forward movement) */
  readonly attackAnimationType?: AnimationType;
  /** Health percentage (0-1) */
  readonly healthPercent?: number;
}

/**
 * Get color based on trigram stance
 */
function getStanceColor(stance: TrigramStance): number {
  const stanceColors: Record<TrigramStance, number> = {
    [TrigramStance.GEON]: KOREAN_COLORS.SECONDARY_YELLOW, // Heaven
    [TrigramStance.TAE]: KOREAN_COLORS.ACCENT_BLUE, // Lake
    [TrigramStance.LI]: KOREAN_COLORS.ACCENT_RED, // Fire
    [TrigramStance.JIN]: KOREAN_COLORS.ACCENT_GOLD, // Thunder
    [TrigramStance.SON]: KOREAN_COLORS.ACCENT_GREEN, // Wind
    [TrigramStance.GAM]: KOREAN_COLORS.PRIMARY_CYAN, // Water
    [TrigramStance.GAN]: KOREAN_COLORS.UI_BACKGROUND_LIGHT, // Mountain
    [TrigramStance.GON]: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, // Earth
  };

  return stanceColors[stance] ?? KOREAN_COLORS.PRIMARY_CYAN;
}

/**
 * TrainingAICharacter3D Component
 * Renders the AI opponent with stance-based visual effects and attack movement
 */
export const TrainingAICharacter3D: React.FC<TrainingAICharacter3DProps> = ({
  position,
  stance,
  isAttacking = false,
  attackAnimationType,
  healthPercent = 1.0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const stanceAuraRef = useRef<THREE.Mesh>(null);

  const attackPhysics = useMemo(() => new AttackMovementPhysics(), []);
  const attackStartTimeRef = useRef<number | null>(null);
  const originalPositionRef = useRef<THREE.Vector3 | null>(null);
  const attackMovementResultRef = useRef<ReturnType<
    typeof attackPhysics.calculateAttackMovement
  > | null>(null);

  const wasAttackingRef = useRef(false);

  useEffect(() => {
    originalPositionRef.current ??= new THREE.Vector3(...position);
  }, [position]);

  useEffect(() => {
    if (!isAttacking && originalPositionRef.current) {
      originalPositionRef.current.set(...position);
    }
  }, [position, isAttacking]);

  useEffect(() => {
    if (isAttacking && !wasAttackingRef.current) {
      attackStartTimeRef.current = performance.now() / 1000;
      if (originalPositionRef.current) {
        originalPositionRef.current.set(...position);
      }

      if (attackAnimationType) {
        const direction = new THREE.Vector3(0, 0, -1); // Forward toward player
        attackMovementResultRef.current = attackPhysics.calculateAttackMovement(
          {
            animationType: attackAnimationType,
            currentStance: stance,
            direction,
            animationDuration: 0.4, // Default 400ms animation
          }
        );
      }
    } else if (!isAttacking && wasAttackingRef.current) {
      attackStartTimeRef.current = null;
      attackMovementResultRef.current = null;
    }

    wasAttackingRef.current = isAttacking;
  }, [isAttacking, attackAnimationType, stance, position, attackPhysics]);

  const stanceColor = useMemo(() => getStanceColor(stance), [stance]);

  const geometries = useMemo(
    () => ({
      body: new THREE.CapsuleGeometry(0.4, 1.2, 16, 32),
      head: new THREE.SphereGeometry(0.3, 16, 16),
      aura: new THREE.RingGeometry(0.6, 0.8, 32),
    }),
    []
  );

  const materials = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({
        color: stanceColor,
        emissive: stanceColor,
        emissiveIntensity: isAttacking ? 0.6 : 0.2,
        metalness: 0.4,
        roughness: 0.6,
      }),
      head: new THREE.MeshStandardMaterial({
        color: KOREAN_COLORS.ACCENT_GOLD,
        metalness: 0.5,
        roughness: 0.5,
      }),
      aura: new THREE.MeshBasicMaterial({
        color: stanceColor,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      }),
    }),
    [stanceColor, isAttacking]
  );

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((geom) => geom.dispose());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentMaterials = materials;
    return () => {
      Object.values(currentMaterials).forEach((mat) => mat.dispose());
    };
  }, [materials]);

  useFrame((state) => {
    if (!groupRef.current || !stanceAuraRef.current) return;

    const time = state.clock.elapsedTime;

    const breathScale = Math.sin(time * 2) * 0.02 + 1;
    groupRef.current.scale.y = breathScale;

    const auraPulse = Math.sin(time * 3) * 0.1 + 0.9;
    stanceAuraRef.current.scale.setScalar(auraPulse);

    if (
      isAttacking &&
      attackStartTimeRef.current !== null &&
      attackMovementResultRef.current &&
      originalPositionRef.current
    ) {
      const currentTime = performance.now() / 1000;
      const elapsedTime = currentTime - attackStartTimeRef.current;
      const result = attackMovementResultRef.current;

      const isRecoveryPhase =
        elapsedTime >= result.lungeDuration &&
        elapsedTime < result.totalDuration;
      const isInAttackMovement = elapsedTime < result.totalDuration;

      if (isInAttackMovement) {
        const newPosition = attackPhysics.applyAttackMovement(
          originalPositionRef.current,
          result,
          elapsedTime,
          isRecoveryPhase
        );

        groupRef.current.position.copy(newPosition);
      } else {
        groupRef.current.position.copy(originalPositionRef.current);
      }
    } else if (!isAttacking && originalPositionRef.current) {
      groupRef.current.position.copy(originalPositionRef.current);
    }
  });

  return (
    <group
      ref={groupRef}
      name="training-ai-character-3d"
    >
      {/* Main body - capsule representing the AI fighter */}
      <mesh castShadow receiveShadow>
        <primitive object={geometries.body} attach="geometry" />
        <primitive object={materials.body} attach="material" />
      </mesh>

      {/* Head marker */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <primitive object={geometries.head} attach="geometry" />
        <primitive object={materials.head} attach="material" />
      </mesh>

      {/* Stance aura effect */}
      <mesh ref={stanceAuraRef} position={[0, 0, 0]}>
        <primitive object={geometries.aura} attach="geometry" />
        <primitive object={materials.aura} attach="material" />
      </mesh>

      {/* Health indicator (rings around character) */}
      {healthPercent < 1.0 && (
        <mesh position={[0, 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[0.4, 0.5, 32, 1, 0, Math.PI * 2 * healthPercent]}
          />
          <meshBasicMaterial
            color={
              healthPercent > 0.6
                ? KOREAN_COLORS.ACCENT_GREEN
                : healthPercent > 0.3
                ? KOREAN_COLORS.SECONDARY_YELLOW
                : KOREAN_COLORS.ACCENT_RED
            }
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Attack effect */}
      {isAttacking && (
        <pointLight
          position={[0, 0.6, 0.5]}
          intensity={1.5}
          distance={3}
          color={stanceColor}
          decay={2}
        />
      )}
    </group>
  );
};

export default TrainingAICharacter3D;
