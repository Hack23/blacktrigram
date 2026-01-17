/**
 * TrigramParticles3D - Korean trigram symbol particle effects for stance transitions
 *
 * Creates spiraling trigram symbols (☰☱☲☳☴☵☶☷) that emanate from the player
 * during stance changes. Provides visual feedback for the Eight Trigram system
 * with Korean cultural authenticity.
 *
 * Features:
 * - Eight authentic trigram symbols from I Ching
 * - Spiral expansion pattern
 * - Korean-themed colors per trigram
 * - Additive blending for glowing effect
 * - Fade-out animation
 * - Stance-specific visual identity
 *
 * @module components/combat/TrigramParticles3D
 * @category Combat Effects
 * @korean 팔괘입자3D
 */

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../types/constants";
import { TrigramStance, TRIGRAM_DATA } from "../../../../systems/trigram/types";

/**
 * Trigram symbol particle effect data
 */
export interface TrigramParticleEffect {
  /** Unique identifier */
  readonly id: string;
  /** Player position in 3D world space */
  readonly position: [number, number, number];
  /** Current trigram stance */
  readonly stance: TrigramStance;
  /** Timestamp when effect was created */
  readonly startTime: number;
}

/**
 * Props for TrigramParticles3D component
 */
export interface TrigramParticles3DProps {
  /** Active trigram effects to render */
  readonly effects: readonly TrigramParticleEffect[];
  /** Whether to enable trigram effects */
  readonly enabled?: boolean;
  /** Callback when effect completes */
  readonly onEffectComplete?: (effectId: string) => void;
}

/**
 * Get color for trigram stance
 */
const getTrigramColor = (stance: TrigramStance): number => {
  const colorMap: Record<TrigramStance, number> = {
    geon: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
    tae: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
    li: KOREAN_COLORS.TRIGRAM_LI_PRIMARY,
    jin: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
    son: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
    gam: KOREAN_COLORS.TRIGRAM_GAM_PRIMARY,
    gan: KOREAN_COLORS.TRIGRAM_GAN_PRIMARY,
    gon: KOREAN_COLORS.TRIGRAM_GON_PRIMARY,
  };
  return colorMap[stance];
};

/**
 * Effect constants
 */
const TRIGRAM_CONSTANTS = {
  /** Number of trigram symbols to spawn */
  SYMBOL_COUNT: 8,
  /** Effect lifetime in seconds */
  LIFETIME: 2.0,
  /** Spiral expansion radius */
  SPIRAL_RADIUS: 1.5,
  /** Rotation speed (radians/second) */
  ROTATION_SPEED: 2.0,
  /** Symbol font size */
  FONT_SIZE: 0.3,
  /** Rise speed (m/s) */
  RISE_SPEED: 0.5,
} as const;

/**
 * Individual trigram effect instance with animation state
 */
interface TrigramEffectInstance {
  id: string;
  position: THREE.Vector3;
  stance: TrigramStance;
  age: number;
  rotation: number;
}

/**
 * TrigramParticles3D Component
 *
 * Renders Korean trigram symbols that spiral outward during stance transitions.
 * Each of the eight trigrams has its own distinct color and represents a different
 * martial arts principle.
 *
 * @example
 * ```tsx
 * const [trigramEffects, setTrigramEffects] = useState<TrigramParticleEffect[]>([]);
 *
 * // On stance change
 * const handleStanceChange = (newStance: TrigramStance, position: [number, number, number]) => {
 *   setTrigramEffects([...trigramEffects, {
 *     id: generateId(),
 *     position,
 *     stance: newStance,
 *     startTime: Date.now(),
 *   }]);
 * };
 *
 * <TrigramParticles3D
 *   effects={trigramEffects}
 *   enabled={visualEffects.trigrams}
 *   onEffectComplete={(id) => {
 *     setTrigramEffects(prev => prev.filter(e => e.id !== id));
 *   }}
 * />
 * ```
 */
export const TrigramParticles3D: React.FC<TrigramParticles3DProps> = ({
  effects,
  enabled = true,
  onEffectComplete,
}) => {
  const effectInstancesRef = useRef<Map<string, TrigramEffectInstance>>(new Map());
  const completedEffectsRef = useRef<Set<string>>(new Set());

  // Initialize effect instances
  useMemo(() => {
    if (!enabled) return;

    effects.forEach((effect) => {
      if (!effectInstancesRef.current.has(effect.id)) {
        effectInstancesRef.current.set(effect.id, {
          id: effect.id,
          position: new THREE.Vector3(...effect.position),
          stance: effect.stance,
          age: 0,
          rotation: 0,
        });
      }
    });

    // Clean up removed effects
    const effectIds = new Set(effects.map((e) => e.id));
    effectInstancesRef.current.forEach((_, id) => {
      if (!effectIds.has(id)) {
        effectInstancesRef.current.delete(id);
        completedEffectsRef.current.delete(id);
      }
    });
  }, [effects, enabled]);

  // Animation loop
  useFrame((_, delta) => {
    if (!enabled) return;

    effectInstancesRef.current.forEach((instance, effectId) => {
      instance.age += delta;
      instance.rotation += TRIGRAM_CONSTANTS.ROTATION_SPEED * delta;

      // Check if effect is complete
      if (
        instance.age >= TRIGRAM_CONSTANTS.LIFETIME &&
        !completedEffectsRef.current.has(effectId)
      ) {
        completedEffectsRef.current.add(effectId);
        onEffectComplete?.(effectId);
      }
    });
  });

  // Don't render if disabled or no effects
  if (!enabled || effects.length === 0) {
    return null;
  }

  return (
    <group>
      {Array.from(effectInstancesRef.current.values()).map((instance) => {
        const progress = Math.min(instance.age / TRIGRAM_CONSTANTS.LIFETIME, 1);
        const opacity = 1 - progress; // Fade out
        const scale = 0.5 + progress * 0.5; // Slight growth
        const rise = progress * TRIGRAM_CONSTANTS.RISE_SPEED * TRIGRAM_CONSTANTS.LIFETIME;

        // Get trigram symbol and color
        const trigramData = TRIGRAM_DATA[instance.stance];
        const symbol = trigramData.symbol;
        const color = getTrigramColor(instance.stance);

        return (
          <group
            key={instance.id}
            position={[instance.position.x, instance.position.y + rise, instance.position.z]}
            rotation={[0, instance.rotation, 0]}
            scale={[scale, scale, scale]}
          >
            {/* Render multiple symbols in spiral pattern */}
            {Array.from({ length: TRIGRAM_CONSTANTS.SYMBOL_COUNT }).map((_, i) => {
              const angle = (Math.PI * 2 * i) / TRIGRAM_CONSTANTS.SYMBOL_COUNT;
              const radius = TRIGRAM_CONSTANTS.SPIRAL_RADIUS * progress;
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;

              return (
                <Text
                  key={i}
                  position={[x, 0, z]}
                  rotation={[0, -angle, 0]}
                  fontSize={TRIGRAM_CONSTANTS.FONT_SIZE}
                  color={color}
                  outlineColor={KOREAN_COLORS.ACCENT_GOLD}
                  outlineWidth={0.015}
                  material-transparent
                  material-opacity={opacity}
                  material-blending={THREE.AdditiveBlending}
                  data-testid={`trigram-symbol-${i}`}
                >
                  {symbol}
                </Text>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

export default TrigramParticles3D;
