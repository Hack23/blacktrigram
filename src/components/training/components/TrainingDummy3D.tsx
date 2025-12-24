/**
 * TrainingDummy3D - 3D training dummy with vital points
 *
 * Provides anatomically accurate training dummy with vital points
 * for Korean martial arts practice. Supports anatomy overlays and difficulty modes.
 */

import { useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { KOREAN_VITAL_POINTS } from "../../../systems/vitalpoint/KoreanVitalPoints";
import { KOREAN_COLORS } from "../../../types/constants";
import VitalPointMarker3D from "./VitalPointMarker3D";

/**
 * Difficulty mode for training
 */
export type DifficultyMode = "easy" | "normal" | "hard";

/**
 * Props for TrainingDummy3D component
 */
export interface TrainingDummy3DProps {
  /** 3D world position of the dummy */
  readonly position: [number, number, number];
  /** Currently selected vital point for targeting */
  readonly selectedVitalPoint: string | null;
  /** Whether training is active */
  readonly isTraining: boolean;
  /** Current health of dummy (0-100) */
  readonly health?: number;
  /** Callback when vital point is hit */
  readonly onVitalPointHit?: (vitalPointId: string) => void;
  /** Callback when dummy is defeated */
  readonly onDefeated?: () => void;
  /** Difficulty mode (affects marker sizes) */
  readonly difficulty?: DifficultyMode;
  /** Number of vital points to display (3-70) */
  readonly vitalPointCount?: number;
  /** Whether on mobile device */
  readonly isMobile?: boolean;
}

/**
 * Map body region to 3D position on dummy
 *
 * @param pointId - Unique identifier for the vital point
 * @param category - Anatomical category (head, neck, torso, etc.) - used for position lookup
 * @returns 3D coordinates [x, y, z] relative to dummy center
 */
const getVitalPointPosition = (
  pointId: string,
  category: string
): [number, number, number] => {
  // Base positions (relative to dummy center) based on category
  const positions: Record<string, [number, number, number]> = {
    head: [0, 1.6, 0],
    neck: [0, 1.4, 0.1],
    torso: [0, 1.0, 0.15],
    chest: [0, 1.0, 0.15],
    abdomen: [0, 0.6, 0.15],
    back: [0, 1.0, -0.15],
    arm: [-0.35, 1.0, 0],
    leg: [-0.2, 0.3, 0],
    neurological: [0, 1.6, 0],
    vascular: [0, 1.4, 0.1],
    muscular: [0, 1.0, 0.15],
    skeletal: [0, 0.8, 0.15],
  };

  // Get base position or default to center
  const basePos = positions[category.toLowerCase()] ?? [0, 1.0, 0];

  // Add some randomization for multiple points in same region
  const offset = pointId.charCodeAt(0) * 0.001;
  return [
    basePos[0] + Math.sin(offset) * 0.1,
    basePos[1] + Math.cos(offset) * 0.1,
    basePos[2],
  ];
};

/**
 * Health bar component for training dummy
 */

// Constants defined outside component to avoid recreation
const HEALTH_BAR_WIDTH = 1.2;
const HEALTH_BAR_HEIGHT = 0.1;

const DummyHealthBar: React.FC<{
  health: number;
  position: [number, number, number];
  "data-testid"?: string;
}> = ({ health, position, "data-testid": testId }) => {
  // Memoize geometries to avoid recreating on every render
  const bgGeometry = useMemo(
    () => new THREE.BoxGeometry(HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT, 0.02),
    []
  );
  const healthGeometry = useMemo(
    () => new THREE.BoxGeometry(HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT, 0.02),
    []
  );
  const borderGeometry = useMemo(
    () =>
      new THREE.BoxGeometry(
        HEALTH_BAR_WIDTH + 0.04,
        HEALTH_BAR_HEIGHT + 0.04,
        0.01
      ),
    []
  );

  // Determine health bar color based on health percentage
  const healthColor = useMemo(() => {
    if (health > 70) return KOREAN_COLORS.HEALTH_FULL;
    if (health > 40) return KOREAN_COLORS.HEALTH_MEDIUM;
    if (health > 20) return KOREAN_COLORS.HEALTH_LOW;
    return KOREAN_COLORS.HEALTH_CRITICAL;
  }, [health]);

  // Use scale instead of recreating geometry
  const healthScale: [number, number, number] = useMemo(
    () => [health / 100, 1, 1],
    [health]
  );

  // Cleanup geometries on unmount
  useEffect(() => {
    return () => {
      bgGeometry.dispose();
      healthGeometry.dispose();
      borderGeometry.dispose();
    };
  }, [bgGeometry, healthGeometry, borderGeometry]);

  return (
    <group position={position} data-testid={testId}>
      {/* Background bar */}
      <mesh>
        <primitive object={bgGeometry} />
        <meshBasicMaterial
          color={KOREAN_COLORS.UI_BACKGROUND_DARK}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Health bar (scaled based on health, anchored to left edge) */}
      <mesh
        position={[-(HEALTH_BAR_WIDTH * (1 - health / 100)) / 2, 0, 0.01]}
        scale={healthScale}
      >
        <primitive object={healthGeometry} />
        <meshBasicMaterial color={healthColor} transparent opacity={0.9} />
      </mesh>

      {/* Border frame - outline using EdgesGeometry for crisp border */}
      <lineSegments>
        <edgesGeometry args={[borderGeometry]} />
        <lineBasicMaterial
          color={KOREAN_COLORS.PRIMARY_CYAN}
          transparent
          opacity={0.8}
        />
      </lineSegments>
    </group>
  );
};

/**
 * TrainingDummy3D Component
 * Main training dummy with body and vital points
 */
export const TrainingDummy3D: React.FC<TrainingDummy3DProps> = ({
  position,
  selectedVitalPoint,
  isTraining,
  health = 100,
  onVitalPointHit,
  onDefeated,
  difficulty = "normal",
  vitalPointCount = 12,
  isMobile = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Reusable vector for scale manipulation
  const scaleVector = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  // Memoize shared geometries to prevent WebGL context exhaustion
  const geometries = useMemo(
    () => ({
      head: new THREE.SphereGeometry(0.25, 16, 16), // Reduced segments for performance
      torso: new THREE.CapsuleGeometry(0.3, 0.8, 8, 16),
      arm: new THREE.CapsuleGeometry(0.1, 0.6, 4, 8),
      leg: new THREE.CapsuleGeometry(0.12, 0.5, 4, 8),
      ring: new THREE.RingGeometry(0.7, 0.8, 16),
    }),
    []
  );

  // Memoize shared material for dummy body
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: KOREAN_COLORS.UI_STEEL_GRAY,
        metalness: 0.3,
        roughness: 0.7,
      }),
    []
  );

  // Memoize ring material
  const ringMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: KOREAN_COLORS.PRIMARY_CYAN,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Cleanup geometries and materials on unmount
  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((geom) => geom.dispose());
      bodyMaterial.dispose();
      ringMaterial.dispose();
    };
  }, [geometries, bodyMaterial, ringMaterial]);

  // Select vital points to display based on count (expandable to 70)
  const vitalPoints = useMemo(
    () =>
      KOREAN_VITAL_POINTS.slice(
        0,
        Math.min(vitalPointCount, KOREAN_VITAL_POINTS.length)
      ),
    [vitalPointCount]
  );

  // Calculate size multiplier based on difficulty
  const sizeMultiplier = useMemo(() => {
    switch (difficulty) {
      case "easy":
        return 1.5; // Larger targets
      case "normal":
        return 1.0; // Standard size
      case "hard":
        return 0.7; // Smaller targets
      default:
        return 1.0;
    }
  }, [difficulty]);

  // Track previous health to detect defeat
  const prevHealthRef = useRef(health);

  // Store latest onDefeated callback in a ref to avoid stale closure
  const onDefeatedRef = useRef(onDefeated);
  useEffect(() => {
    onDefeatedRef.current = onDefeated;
  }, [onDefeated]);

  // Check for defeat
  React.useEffect(() => {
    if (prevHealthRef.current > 0 && health <= 0) {
      onDefeatedRef.current?.();
    }
    prevHealthRef.current = health;
  }, [health]);

  // Store health in ref for useFrame to avoid stale closure
  const healthRef = useRef(health);
  useEffect(() => {
    healthRef.current = health;
  }, [health]);

  // Breathing animation (slower when health is low)
  useFrame((state) => {
    if (!groupRef.current) return;

    const breathSpeed = healthRef.current > 50 ? 2 : 1;
    const breathScale =
      Math.sin(state.clock.elapsedTime * breathSpeed) * 0.02 + 1;
    scaleVector.set(1, breathScale, 1);
    groupRef.current.scale.copy(scaleVector);
  });

  // Handle vital point hit
  const handlePointHit = useCallback(
    (pointId: string) => {
      onVitalPointHit?.(pointId);
    },
    [onVitalPointHit]
  );

  return (
    <group ref={groupRef} position={position}>
      {/* Head - uses shared geometry and material */}
      <mesh
        position={[0, 1.6, 0]}
        castShadow
        geometry={geometries.head}
        material={bodyMaterial}
      />

      {/* Torso - uses shared geometry and material */}
      <mesh
        position={[0, 1.0, 0]}
        castShadow
        geometry={geometries.torso}
        material={bodyMaterial}
      />

      {/* Left Arm - uses shared geometry and material */}
      <mesh
        position={[-0.4, 1.0, 0]}
        rotation={[0, 0, Math.PI / 6]}
        castShadow
        geometry={geometries.arm}
        material={bodyMaterial}
      />

      {/* Right Arm - uses shared geometry and material */}
      <mesh
        position={[0.4, 1.0, 0]}
        rotation={[0, 0, -Math.PI / 6]}
        castShadow
        geometry={geometries.arm}
        material={bodyMaterial}
      />

      {/* Left Leg - uses shared geometry and material */}
      <mesh
        position={[-0.2, 0.3, 0]}
        castShadow
        geometry={geometries.leg}
        material={bodyMaterial}
      />

      {/* Right Leg - uses shared geometry and material */}
      <mesh
        position={[0.2, 0.3, 0]}
        castShadow
        geometry={geometries.leg}
        material={bodyMaterial}
      />

      {/* Stance indicator ring - uses shared geometry and material */}
      <mesh
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        geometry={geometries.ring}
        material={ringMaterial}
      />

      {/* Vital point markers */}
      {vitalPoints.map((point) => (
        <group
          key={point.id}
          position={getVitalPointPosition(point.id, point.category)}
        >
          <VitalPointMarker3D
            vitalPoint={point}
            isSelected={point.id === selectedVitalPoint}
            isTraining={isTraining}
            isMobile={isMobile}
            onHit={handlePointHit}
            sizeMultiplier={sizeMultiplier}
          />
        </group>
      ))}

      {/* Health bar above dummy */}
      {isTraining && (
        <DummyHealthBar
          health={health}
          position={[0, 2.2, 0]}
          data-testid="training-dummy-health-bar"
        />
      )}
    </group>
  );
};

