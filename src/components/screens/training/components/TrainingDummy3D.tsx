/**
 * TrainingDummy3D - 3D training dummy with vital points
 *
 * Provides anatomically accurate training dummy using SkeletalPlayer3D
 * for Korean martial arts practice. Supports anatomy overlays and difficulty modes.
 *
 * Refactored to extend SkeletalPlayer3D for visual consistency with player characters.
 *
 * @module components/screens/training/TrainingDummy3D
 * @category 3D Components
 * @korean 훈련인형3D컴포넌트
 */

import { useFrame } from "@react-three/fiber";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { KOREAN_VITAL_POINTS } from "../../../../systems/vitalpoint/KoreanVitalPoints";
import { PlayerArchetype, TrigramStance } from "../../../../types/common";
import { KOREAN_COLORS } from "../../../../types/constants";
import SkeletalPlayer3D from "../../../shared/three/models/SkeletalPlayer3D";
import VitalPointMarker3D from "./VitalPointMarker3D";

/**
 * Difficulty mode for training
 * @korean 난이도모드
 */
export type DifficultyMode = "easy" | "normal" | "hard";

/**
 * Props for TrainingDummy3D component
 * @korean 훈련인형3D속성
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
  /** Maximum health of dummy */
  readonly maxHealth?: number;
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
  /** Archetype to display (affects body type and appearance) */
  readonly archetype?: PlayerArchetype;
  /** Current stance for the dummy */
  readonly stance?: TrigramStance;
}

/**
 * Map body region to 3D position on dummy
 *
 * Positions are calibrated for SkeletalPlayer3D bone structure.
 *
 * @param pointId - Unique identifier for the vital point
 * @param category - Anatomical category (head, neck, torso, etc.)
 * @returns 3D coordinates [x, y, z] relative to dummy center
 * @korean 급소위치계산
 */
const getVitalPointPosition = (
  pointId: string,
  category: string,
): [number, number, number] => {
  // Base positions calibrated for SkeletalPlayer3D skeletal rig
  // These align with the 28-bone humanoid rig structure
  const positions: Record<string, [number, number, number]> = {
    head: [0, 1.75, 0.12], // Head bone + offset
    neck: [0, 1.5, 0.1], // Neck bone
    torso: [0, 1.15, 0.18], // Chest/spine area
    chest: [0, 1.2, 0.2], // Upper chest
    abdomen: [0, 0.85, 0.18], // Lower torso
    back: [0, 1.1, -0.15], // Spine back
    arm: [-0.45, 1.15, 0], // Upper arm area
    leg: [-0.18, 0.4, 0.05], // Thigh area
    neurological: [0, 1.7, 0.08], // Temple/head neural points
    vascular: [0, 1.45, 0.12], // Neck vascular points
    muscular: [0, 1.1, 0.2], // Muscle groups
    skeletal: [0, 0.9, 0.15], // Joints/bones
  };

  // Get base position or default to center torso
  const basePos = positions[category.toLowerCase()] ?? [0, 1.1, 0.15];

  // Add deterministic offset for multiple points in same region
  // Uses character code of pointId for consistent positioning
  const hash =
    pointId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) *
    0.001;
  return [
    basePos[0] + Math.sin(hash * 7.3) * 0.08,
    basePos[1] + Math.cos(hash * 5.1) * 0.08,
    basePos[2] + Math.sin(hash * 3.7) * 0.03,
  ];
};

/**
 * Health bar component for training dummy
 *
 * Displays above the dummy with Korean cyberpunk styling.
 * @korean 훈련인형체력바
 */

// Constants defined outside component to avoid recreation
const HEALTH_BAR_WIDTH = 1.2;
const HEALTH_BAR_HEIGHT = 0.1;

const DummyHealthBar: React.FC<{
  readonly health: number;
  readonly maxHealth: number;
  readonly position: [number, number, number];
}> = ({ health, maxHealth, position }) => {
  // Health percentage
  const healthPercent = Math.max(0, Math.min(100, (health / maxHealth) * 100));

  // Memoize geometries to avoid recreating on every render
  const bgGeometry = useMemo(
    () => new THREE.BoxGeometry(HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT, 0.02),
    [],
  );
  const healthGeometry = useMemo(
    () => new THREE.BoxGeometry(HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT, 0.02),
    [],
  );
  const borderGeometry = useMemo(
    () =>
      new THREE.BoxGeometry(
        HEALTH_BAR_WIDTH + 0.04,
        HEALTH_BAR_HEIGHT + 0.04,
        0.01,
      ),
    [],
  );

  // Determine health bar color based on health percentage
  const healthColor = useMemo(() => {
    if (healthPercent > 70) return KOREAN_COLORS.HEALTH_FULL;
    if (healthPercent > 40) return KOREAN_COLORS.HEALTH_MEDIUM;
    if (healthPercent > 20) return KOREAN_COLORS.HEALTH_LOW;
    return KOREAN_COLORS.HEALTH_CRITICAL;
  }, [healthPercent]);

  // Use scale instead of recreating geometry
  const healthScale: [number, number, number] = useMemo(
    () => [healthPercent / 100, 1, 1],
    [healthPercent],
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
    <group position={position} name="dummy-health-bar">
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
        position={[
          -(HEALTH_BAR_WIDTH * (1 - healthPercent / 100)) / 2,
          0,
          0.01,
        ]}
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
 *
 * Main training dummy using SkeletalPlayer3D for consistent visual appearance.
 * Displays vital points for martial arts practice with difficulty-based sizing.
 *
 * @example
 * ```tsx
 * <TrainingDummy3D
 *   position={[0, 0, 5]}
 *   selectedVitalPoint="temple"
 *   isTraining={true}
 *   health={75}
 *   difficulty="normal"
 *   onVitalPointHit={(id) => console.log(`Hit ${id}`)}
 * />
 * ```
 *
 * @korean 훈련인형3D컴포넌트
 */
export const TrainingDummy3D: React.FC<TrainingDummy3DProps> = ({
  position,
  selectedVitalPoint,
  isTraining,
  health = 100,
  maxHealth = 100,
  onVitalPointHit,
  onDefeated,
  difficulty = "normal",
  vitalPointCount = 12,
  isMobile = false,
  archetype = PlayerArchetype.MUSA,
  stance = TrigramStance.GEON,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isStunned, setIsStunned] = useState(false);

  // Select vital points to display based on count (expandable to 70)
  const vitalPoints = useMemo(
    () =>
      KOREAN_VITAL_POINTS.slice(
        0,
        Math.min(vitalPointCount, KOREAN_VITAL_POINTS.length),
      ),
    [vitalPointCount],
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

  // Check for defeat and trigger stun effect on significant damage
  useEffect(() => {
    // Defeated check
    if (prevHealthRef.current > 0 && health <= 0) {
      onDefeatedRef.current?.();
    }

    // Stun on significant damage (more than 20 points)
    if (prevHealthRef.current - health > 20) {
      setIsStunned(true);
      const timer = setTimeout(() => setIsStunned(false), 500);
      return () => clearTimeout(timer);
    }

    prevHealthRef.current = health;
    return undefined;
  }, [health]);

  // Subtle idle animation for training dummy
  useFrame((state) => {
    if (!groupRef.current) return;

    // Gentle breathing/swaying motion
    const time = state.clock.elapsedTime;
    const breathScale = Math.sin(time * 1.5) * 0.01 + 1;
    groupRef.current.scale.y = breathScale;

    // Subtle rotation as if waiting for attack
    groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.02;
  });

  // Handle vital point hit
  const handlePointHit = useCallback(
    (pointId: string) => {
      onVitalPointHit?.(pointId);
    },
    [onVitalPointHit],
  );

  return (
    <group ref={groupRef} position={position} name="training-dummy-3d">
      {/* SkeletalPlayer3D as the base character model */}
      <SkeletalPlayer3D
        playerId="training-dummy"
        archetype={archetype}
        stance={stance}
        position={[0, 0, 0]}
        rotation={Math.PI} // Face the player
        facing="left"
        health={health}
        maxHealth={maxHealth}
        stamina={100}
        ki={50}
        balance="READY"
        pain={0}
        consciousness={100}
        isMobile={isMobile}
        currentAnimation="idle"
        isBlocking={false}
        isStunned={isStunned}
        showHealthBar={false} // We use custom health bar
        showStanceIndicator={false}
        enableFacialExpressions={true}
        enableEyeTracking={true}
      />

      {/* Vital point markers overlaid on the skeletal model */}
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
          maxHealth={maxHealth}
          position={[0, 2.3, 0]}
        />
      )}

      {/* Training mode indicator glow */}
      {isTraining && (
        <pointLight
          position={[0, 1.2, 0.5]}
          color={KOREAN_COLORS.PRIMARY_CYAN}
          intensity={0.3}
          distance={3}
          decay={2}
        />
      )}
    </group>
  );
};

export default TrainingDummy3D;
