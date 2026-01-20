/**
 * HitEffects3D - Three.js particle effects for combat
 *
 * Maintains Korean theming and visual feedback for combat actions
 */

import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { HitEffect } from "../../../../systems";
import { HitEffectType } from "../../../../systems/effects";
import { KOREAN_COLORS } from "../../../../types/constants";

/**
 * Props for the HitEffects3D component.
 * Controls which effects are displayed and callbacks for effect lifecycle.
 */
export interface HitEffects3DProps {
  /** Array of active hit effects to render in the scene */
  readonly effects: HitEffect[];
  /** Callback invoked when an effect completes its duration */
  readonly onEffectComplete?: (effectId: string) => void;
  /** Arena bounds for accurate coordinate conversion */
  readonly arenaBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface ActiveEffect extends HitEffect {
  progress: number;
}

/**
 * Individual Hit Effect Component
 * Renders a single effect with Three.js primitives
 */
const HitEffectVisual: React.FC<{
  effect: HitEffect;
  effectRef: React.MutableRefObject<ActiveEffect | null>;
  arenaBounds?: { x: number; y: number; width: number; height: number };
}> = ({ effect, effectRef, arenaBounds }) => {
  const groupRef = useRef<THREE.Group>(null);
  // Use state for alpha to avoid accessing ref during render
  const [alpha, setAlpha] = useState(1);

  // Position in 3D space - convert 2D position to 3D
  const position3D: [number, number, number] = useMemo(() => {
    if (!effect.position) return [0, 1, 0];

    // Convert from screen coordinates to 3D world coordinates
    // Use arena bounds if available, otherwise use default normalization
    const bounds = arenaBounds ?? { x: 0, y: 0, width: 1200, height: 800 };
    const relX = (effect.position.x - bounds.x) / bounds.width;
    const relZ = (effect.position.y - bounds.y) / bounds.height;
    const x = relX * 16 - 8; // Map 0-1 to -8 to 8
    const y = 1.5; // Mid-height for effects
    const z = relZ * 8 - 4; // Map 0-1 to -4 to 4

    return [x, y, z];
  }, [effect.position, arenaBounds]);

  // Animate effect based on type
  useFrame(() => {
    if (!groupRef.current || !effectRef.current) return;

    // Access fresh progress value from ref and update alpha state
    const progress = effectRef.current.progress;
    setAlpha(1 - progress);

    // Rotate for some effects
    if (
      effect.type === HitEffectType.COUNTER ||
      effect.type === HitEffectType.VITAL_POINT_STRIKE
    ) {
      groupRef.current.rotation.y += 0.1;
    }

    // Scale pulse for critical hits
    if (effect.type === HitEffectType.CRITICAL_HIT) {
      const pulse =
        1 + Math.sin(effectRef.current.progress * Math.PI * 4) * 0.2;
      groupRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Render based on effect type
  switch (effect.type) {
    case HitEffectType.HIT:
      return (
        <group ref={groupRef} position={position3D}>
          {/* Impact flash sphere */}
          <mesh>
            <sphereGeometry args={[0.3 * effect.intensity, 16, 16]} />
            <meshBasicMaterial
              color={KOREAN_COLORS.ACCENT_RED}
              transparent
              opacity={alpha * 0.5}
            />
          </mesh>
          {/* Expanding ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <ringGeometry
              args={[0.3 * effect.intensity, 0.35 * effect.intensity, 32]}
            />
            <meshBasicMaterial
              color={KOREAN_COLORS.ACCENT_RED}
              transparent
              opacity={alpha}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      );

    case HitEffectType.CRITICAL_HIT:
      return (
        <group ref={groupRef} position={position3D}>
          {/* Large impact sphere */}
          <mesh>
            <sphereGeometry args={[0.5 * effect.intensity, 16, 16]} />
            <meshBasicMaterial
              color={KOREAN_COLORS.ACCENT_GOLD}
              transparent
              opacity={alpha * 0.7}
            />
          </mesh>
          {/* Star burst lines */}
          {[0, 1, 2, 3].map((i) => {
            const angle = (i * Math.PI) / 2;
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.3, 0, Math.sin(angle) * 0.3]}
                rotation={[0, angle, 0]}
              >
                <boxGeometry args={[0.6, 0.05, 0.05]} />
                <meshBasicMaterial
                  color={KOREAN_COLORS.ACCENT_RED}
                  transparent
                  opacity={alpha}
                />
              </mesh>
            );
          })}
        </group>
      );

    case HitEffectType.BLOCK:
      return (
        <group ref={groupRef} position={position3D}>
          {/* Shield arc */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry
              args={[0.4 * effect.intensity, 0.05, 8, 16, Math.PI]}
            />
            <meshBasicMaterial
              color={KOREAN_COLORS.ACCENT_CYAN}
              transparent
              opacity={alpha}
            />
          </mesh>
          {/* Spark particles */}
          {[0, 1, 2].map((i) => (
            <mesh
              key={i}
              position={[
                (i - 1) * 0.2,
                Math.sin((1 - alpha) * Math.PI) * 0.3, // Use alpha (1 - progress)
                0,
              ]}
            >
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshBasicMaterial
                color={KOREAN_COLORS.ACCENT_CYAN}
                transparent
                opacity={alpha * 0.8}
              />
            </mesh>
          ))}
        </group>
      );

    case HitEffectType.MISS:
      return (
        <group ref={groupRef} position={position3D}>
          {/* Swish trail lines */}
          {[0, 1].map((i) => (
            <mesh
              key={i}
              position={[(i - 0.5) * 0.2, i * 0.1, 0]}
              rotation={[0, 0, (i - 0.5) * 0.3]}
            >
              <boxGeometry args={[0.6, 0.02, 0.02]} />
              <meshBasicMaterial
                color={KOREAN_COLORS.TEXT_TERTIARY}
                transparent
                opacity={alpha}
              />
            </mesh>
          ))}
        </group>
      );

    case HitEffectType.VITAL_POINT_STRIKE:
      return (
        <group ref={groupRef} position={position3D}>
          {/* Pulsing sphere */}
          <mesh>
            <sphereGeometry args={[0.35 * effect.intensity, 16, 16]} />
            <meshBasicMaterial
              color={KOREAN_COLORS.SECONDARY_MAGENTA}
              transparent
              opacity={alpha * 0.5}
            />
          </mesh>
          {/* Concentric rings */}
          {[0.2, 0.3, 0.4].map((radius, i) => (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[radius, radius + 0.02, 32]} />
              <meshBasicMaterial
                color={KOREAN_COLORS.SECONDARY_MAGENTA}
                transparent
                opacity={alpha}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
          {/* Crosshair */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.8, 0.02, 0.02]} />
            <meshBasicMaterial
              color={KOREAN_COLORS.SECONDARY_MAGENTA}
              transparent
              opacity={alpha * 0.8}
            />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.8, 0.02, 0.02]} />
            <meshBasicMaterial
              color={KOREAN_COLORS.SECONDARY_MAGENTA}
              transparent
              opacity={alpha * 0.8}
            />
          </mesh>
        </group>
      );

    case HitEffectType.PARRY:
      return (
        <group ref={groupRef} position={position3D}>
          {/* Deflection arc */}
          <mesh>
            <torusGeometry
              args={[0.35 * effect.intensity, 0.05, 8, 16, Math.PI / 2]}
            />
            <meshBasicMaterial
              color={KOREAN_COLORS.ACCENT_GOLD}
              transparent
              opacity={alpha}
            />
          </mesh>
          {/* Sparks */}
          {[0, 1, 2].map((i) => {
            const angle = (Math.PI / 6) * (i - 1);
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.4, Math.sin(angle) * 0.4, 0]}
              >
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshBasicMaterial
                  color={KOREAN_COLORS.ACCENT_GOLD}
                  transparent
                  opacity={alpha * 0.8}
                />
              </mesh>
            );
          })}
        </group>
      );

    case HitEffectType.COUNTER:
      return (
        <group ref={groupRef} position={position3D}>
          {/* Spinning energy blades */}
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={i}
              rotation={[0, (i * Math.PI) / 2, 0]}
              position={[0, 0, 0]}
            >
              <boxGeometry args={[0.6, 0.05, 0.05]} />
              <meshBasicMaterial
                color={KOREAN_COLORS.PRIMARY_CYAN}
                transparent
                opacity={alpha}
              />
            </mesh>
          ))}
        </group>
      );

    case HitEffectType.GENERAL_DAMAGE:
    case HitEffectType.STATUS_EFFECT:
    default:
      return (
        <group ref={groupRef} position={position3D}>
          <mesh>
            <sphereGeometry args={[0.3 * effect.intensity, 16, 16]} />
            <meshBasicMaterial
              color={KOREAN_COLORS.ACCENT_GREEN}
              transparent
              opacity={alpha * 0.5}
            />
          </mesh>
        </group>
      );
  }
};

/**
 * HitEffects3D Component
 * Manages all active hit effects in the combat scene
 * Uses refs to avoid triggering React re-renders at 60fps
 */
export const HitEffects3D: React.FC<HitEffects3DProps> = ({
  effects,
  onEffectComplete,
  arenaBounds,
}) => {
  // Use refs to track effects without causing re-renders
  const effectRefsMap = useRef<
    Map<string, React.MutableRefObject<ActiveEffect | null>>
  >(new Map());
  const completedEffectsRef = useRef<Set<string>>(new Set());

  // Store effectRefs as state to avoid ref access during render
  // This is updated in useEffect, not during render
  const [effectRefsSnapshot, setEffectRefsSnapshot] = useState<
    Map<string, React.MutableRefObject<ActiveEffect | null>>
  >(new Map());

  // Update effect refs when effects change (minimal state updates)
  useEffect(() => {
    // Clean up refs for removed effects
    const currentIdSet = new Set(effects.map((e) => e.id));
    effectRefsMap.current.forEach((_ref, id) => {
      if (!currentIdSet.has(id)) {
        effectRefsMap.current.delete(id);
        completedEffectsRef.current.delete(id);
      }
    });

    // Initialize refs for new effects
    effects.forEach((effect) => {
      if (!effectRefsMap.current.has(effect.id)) {
        effectRefsMap.current.set(effect.id, {
          current: { ...effect, progress: 0 },
        });
      }
    });

    // Create a snapshot of the refs for use in render
    // This is a new Map with the same refs (not a deep copy)
    setEffectRefsSnapshot(new Map(effectRefsMap.current));
  }, [effects]);

  // Update progress using refs (no setState in useFrame)
  useFrame(() => {
    const now = Date.now();

    effectRefsMap.current.forEach((ref, id) => {
      if (!ref.current) return;

      const progress = Math.min(
        (now - ref.current.startTime) / ref.current.duration,
        1
      );
      ref.current.progress = progress;

      // Handle completion
      const isExpired = progress >= 1;
      if (
        isExpired &&
        onEffectComplete &&
        !completedEffectsRef.current.has(id)
      ) {
        completedEffectsRef.current.add(id);
        onEffectComplete(id);
      }
    });
  });

  // Pre-compute effect data to avoid ref access during render
  const effectsToRender = useMemo(() => {
    return effects
      .map((effect) => {
        const effectRef = effectRefsSnapshot.get(effect.id);
        return { effect, effectRef };
      })
      .filter(
        (
          item
        ): item is {
          effect: HitEffect;
          effectRef: React.MutableRefObject<ActiveEffect | null>;
        } => item.effectRef !== undefined
      );
  }, [effects, effectRefsSnapshot]);

  return (
    <group>
      {effectsToRender.map(({ effect, effectRef }) => {
        return (
          <HitEffectVisual
            key={effect.id}
            effect={effect}
            effectRef={effectRef}
            arenaBounds={arenaBounds}
          />
        );
      })}
    </group>
  );
};

export default HitEffects3D;
