/**
 * HitEffects3D - Three.js particle effects for combat
 * 
 * Replaces PixiJS HitEffectsLayer with Three.js 3D particle effects
 * Maintains Korean theming and visual feedback for combat actions
 */

import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { HitEffect } from "../../../systems";
import { HitEffectType } from "../../../systems/effects";
import { KOREAN_COLORS } from "../../../types/constants";

export interface HitEffects3DProps {
  readonly effects: HitEffect[];
  readonly onEffectComplete?: (effectId: string) => void;
}

interface ActiveEffect extends HitEffect {
  progress: number;
}

/**
 * Individual Hit Effect Component
 * Renders a single effect with Three.js primitives
 */
const HitEffectVisual: React.FC<{
  effect: ActiveEffect;
}> = ({ effect }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { progress } = effect;
  const alpha = 1 - progress;

  // Position in 3D space - convert 2D position to 3D
  const position3D: [number, number, number] = useMemo(() => {
    if (!effect.position) return [0, 1, 0];
    
    // Convert from screen coordinates to 3D world coordinates
    // Assuming arena is roughly -10 to 10 in X, 0-5 in Y, -5 to 5 in Z
    const x = (effect.position.x / 600) * 10 - 5; // Normalize to -5 to 5
    const y = 1.5; // Mid-height for effects
    const z = 0;
    
    return [x, y, z];
  }, [effect.position]);

  // Animate effect based on type
  useFrame(() => {
    if (!groupRef.current) return;

    // Rotate for some effects
    if (effect.type === HitEffectType.COUNTER || effect.type === HitEffectType.VITAL_POINT_STRIKE) {
      groupRef.current.rotation.y += 0.1;
    }

    // Scale pulse for critical hits
    if (effect.type === HitEffectType.CRITICAL_HIT) {
      const pulse = 1 + Math.sin(progress * Math.PI * 4) * 0.2;
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
                position={[
                  Math.cos(angle) * 0.3,
                  0,
                  Math.sin(angle) * 0.3,
                ]}
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
              args={[
                0.4 * effect.intensity,
                0.05,
                8,
                16,
                Math.PI,
              ]}
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
                Math.sin(progress * Math.PI) * 0.3,
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
              args={[
                0.35 * effect.intensity,
                0.05,
                8,
                16,
                Math.PI / 2,
              ]}
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
                position={[
                  Math.cos(angle) * 0.4,
                  Math.sin(angle) * 0.4,
                  0,
                ]}
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
 */
export const HitEffects3D: React.FC<HitEffects3DProps> = ({
  effects,
  onEffectComplete,
}) => {
  const [activeEffects, setActiveEffects] = useState<ActiveEffect[]>([]);
  const completedEffectsRef = useRef<Set<string>>(new Set());

  // Update active effects with progress
  useEffect(() => {
    setActiveEffects(
      effects.map((effect) => ({
        ...effect,
        progress: Math.min(
          (Date.now() - effect.startTime) / effect.duration,
          1
        ),
      }))
    );
  }, [effects]);

  // Update progress and clean up expired effects
  useFrame(() => {
    const now = Date.now();
    
    setActiveEffects((prev) => {
      const updated = prev
        .map((effect) => ({
          ...effect,
          progress: Math.min(
            (now - effect.startTime) / effect.duration,
            1
          ),
        }))
        .filter((effect) => {
          const isExpired = effect.progress >= 1;
          // Only call completion callback once per effect
          if (isExpired && onEffectComplete && !completedEffectsRef.current.has(effect.id)) {
            completedEffectsRef.current.add(effect.id);
            onEffectComplete(effect.id);
          }
          return !isExpired;
        });
      
      return updated;
    });
  });

  // Clean up completed effects set when effects change
  useEffect(() => {
    const currentIds = new Set(effects.map(e => e.id));
    completedEffectsRef.current.forEach(id => {
      if (!currentIds.has(id)) {
        completedEffectsRef.current.delete(id);
      }
    });
  }, [effects]);

  return (
    <group>
      {activeEffects.map((effect) => (
        <HitEffectVisual key={effect.id} effect={effect} />
      ))}
    </group>
  );
};

export default HitEffects3D;
