/**
 * TrainingAICharacter3D - 3D character model for AI opponent in training
 * 
 * Displays the AI opponent with stance-based materials and animations
 */

import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { TrigramStance } from "../../../types/common";
import { KOREAN_COLORS } from "../../../types/constants";

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
 * Renders the AI opponent with stance-based visual effects
 */
export const TrainingAICharacter3D: React.FC<TrainingAICharacter3DProps> = ({
  position,
  stance,
  isAttacking = false,
  healthPercent = 1.0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const stanceAuraRef = useRef<THREE.Mesh>(null);
  const attackOffsetRef = useRef(0);

  // Memoize stance color
  const stanceColor = useMemo(() => getStanceColor(stance), [stance]);

  // Animation loop
  useFrame((state) => {
    if (!groupRef.current || !stanceAuraRef.current) return;

    const time = state.clock.elapsedTime;

    // Breathing animation
    // NOTE: This per-character animation is acceptable for training mode (single AI opponent).
    // If planning to display multiple AI characters simultaneously (e.g., multiplayer),
    // batch breathing animations using InstancedMesh or limit animation to active combat participants only.
    // 한 명의 AI 상대만 표시되는 훈련 모드에서는 성능 문제가 없으나,
    // 다수의 AI가 동시에 표시되는 경우에는 InstancedMesh 또는 배치 애니메이션으로 최적화 필요.
    const breathScale = Math.sin(time * 2) * 0.02 + 1;
    groupRef.current.scale.y = breathScale;

    // Stance aura pulsing
    const auraPulse = Math.sin(time * 3) * 0.1 + 0.9;
    stanceAuraRef.current.scale.setScalar(auraPulse);

    // Attack animation with offset
    if (isAttacking) {
      attackOffsetRef.current = Math.sin(time * 10) * 0.1;
    } else {
      attackOffsetRef.current = 0;
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={[position[0], position[1], position[2] + attackOffsetRef.current]}
      data-testid="training-ai-character-3d"
    >
      {/* Main body - capsule representing the AI fighter */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.4, 1.2, 16, 32]} />
        <meshStandardMaterial
          color={stanceColor}
          emissive={stanceColor}
          emissiveIntensity={isAttacking ? 0.6 : 0.2}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Head marker */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={KOREAN_COLORS.ACCENT_GOLD}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Stance aura effect */}
      <mesh ref={stanceAuraRef} position={[0, 0, 0]}>
        <ringGeometry args={[0.6, 0.8, 32]} />
        <meshBasicMaterial
          color={stanceColor}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Health indicator (rings around character) */}
      {healthPercent < 1.0 && (
        <mesh position={[0, 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.5, 32, 1, 0, Math.PI * 2 * healthPercent]} />
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
