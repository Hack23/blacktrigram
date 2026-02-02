/**
 * WaterRipple3D - Adaptive flow ripple effects for Gam (Water) trigram footwork
 *
 * Creates concentric water ripple rings that emanate from footfall positions
 * during Gam stance techniques. Ripples expand outward with wave motion and
 * fade over time, following the philosophy: "물처럼 흘러 적의 힘을 이용하라"
 * (Flow like water and use the enemy's force).
 *
 * PERFORMANCE OPTIMIZATION (Minimal Allocations):
 * - Uses primitive numeric types instead of Vector3 objects to minimize allocations
 * - Ring-based geometry with instancing for efficient rendering
 * - Target: 60fps with up to 10 simultaneous ripple effects
 *
 * Features:
 * - Concentric ring expansion from footfall
 * - Korean cyberpunk cyan water coloring
 * - Wave amplitude oscillation
 * - Smooth alpha fade-out
 * - Mobile performance optimization
 *
 * @module components/combat/WaterRipple3D
 * @category Combat Effects - Water (감괘)
 * @korean 물결파문3D
 */

import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { KOREAN_COLORS } from "../../../../../types/constants";

/**
 * Water ripple effect data for Gam (Water) trigram
 * 물결 파문 효과 데이터 (감괘)
 */
export interface WaterRippleEffect {
  /** Unique identifier */
  readonly id: string;
  /** Origin position in 3D world space (foot impact point) */
  readonly position: [number, number, number];
  /** Flow type: adaptive, flowing, or reactive */
  readonly flowType: "adaptive" | "flowing" | "reactive";
  /** Timestamp when effect was created */
  readonly startTime: number;
  /** Intensity of ripple (0.0 to 1.0) - affects amplitude and radius */
  readonly intensity?: number;
}

/**
 * Props for WaterRipple3D component
 */
export interface WaterRipple3DProps {
  /** Active ripple effects to render */
  readonly effects: readonly WaterRippleEffect[];
  /** Whether to enable ripple effects */
  readonly enabled?: boolean;
  /** Mobile device mode (reduced ring count) */
  readonly isMobile?: boolean;
  /** Callback when effect completes */
  readonly onEffectComplete?: (effectId: string) => void;
}

/**
 * Individual ripple ring data
 */
interface RippleRing {
  /** Current radius of ring (meters) */
  radius: number;
  /** Expansion speed (m/s) */
  speed: number;
  /** Current age (seconds) */
  age: number;
  /** Ring lifetime (seconds) */
  lifetime: number;
  /** Ring opacity (0.0 to 1.0) */
  opacity: number;
  /** Wave phase offset for oscillation */
  phaseOffset: number;
}

/**
 * Performance and physics constants
 * 성능 및 물리 상수
 */
const RIPPLE_CONSTANTS = {
  /** Number of concentric rings per effect */
  RING_COUNT_DESKTOP: 5,
  RING_COUNT_MOBILE: 3,
  /** Ring spawn interval (seconds) */
  RING_SPAWN_INTERVAL: 0.15,
  /** Ripple expansion speed (m/s) */
  EXPANSION_SPEED: {
    adaptive: 2.5, // Moderate, responsive speed
    flowing: 2.0, // Smooth, continuous speed
    reactive: 3.0, // Fast, instant response
  },
  /** Ring lifetime (seconds) */
  LIFETIME: 2.0,
  /** Maximum radius before fade */
  MAX_RADIUS: 4.0,
  /** Wave amplitude (vertical oscillation) */
  WAVE_AMPLITUDE: 0.08,
  /** Wave frequency (oscillations per second) */
  WAVE_FREQUENCY: 4.0,
  /** Ring thickness */
  RING_THICKNESS: 0.08,
  /** Ring segments (higher = smoother circle) */
  RING_SEGMENTS: 32,
  /** Floor Y position */
  FLOOR_Y: 0.01, // Slightly above floor to prevent z-fighting
  /** Maximum delta time for physics stability */
  MAX_DELTA: 1 / 30,
  /** Korean cyberpunk water color (cyan) */
  WATER_COLOR: KOREAN_COLORS.TRIGRAM_GAM_PRIMARY, // 0x1e90ff (blue)
  WATER_COLOR_ADAPTIVE: KOREAN_COLORS.PRIMARY_CYAN, // 0x00e6e6 (cyan)
  WATER_COLOR_FLOWING: 0x00ccff, // Light cyan
  WATER_COLOR_REACTIVE: 0x00ffff, // Bright cyan
} as const;

/**
 * Generate ripple rings for water effect
 * PERFORMANCE: Minimal allocations, rings created incrementally
 */
const createRippleRings = (
  effect: WaterRippleEffect,
  ringCount: number
): RippleRing[] => {
  const rings: RippleRing[] = [];
  const speed = RIPPLE_CONSTANTS.EXPANSION_SPEED[effect.flowType];
  const intensity = effect.intensity ?? 1.0;

  for (let i = 0; i < ringCount; i++) {
    rings.push({
      radius: 0,
      speed: speed * intensity,
      age: -i * RIPPLE_CONSTANTS.RING_SPAWN_INTERVAL, // Negative age = spawn delayed
      lifetime: RIPPLE_CONSTANTS.LIFETIME,
      opacity: 0,
      phaseOffset: Math.random() * Math.PI * 2, // Random wave phase
    });
  }

  return rings;
};

/**
 * Get color based on flow type
 */
const getFlowTypeColor = (flowType: "adaptive" | "flowing" | "reactive"): number => {
  switch (flowType) {
    case "adaptive":
      return RIPPLE_CONSTANTS.WATER_COLOR_ADAPTIVE;
    case "flowing":
      return RIPPLE_CONSTANTS.WATER_COLOR_FLOWING;
    case "reactive":
      return RIPPLE_CONSTANTS.WATER_COLOR_REACTIVE;
  }
};

/**
 * WaterRipple3D Component
 * Renders water ripple effects for Gam (Water) trigram techniques
 */
export const WaterRipple3D: React.FC<WaterRipple3DProps> = ({
  effects,
  enabled = true,
  isMobile = false,
  onEffectComplete,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // PERFORMANCE: Reuse materials instead of creating on every render
  const materialsRef = useRef<Map<number, THREE.MeshBasicMaterial>>(new Map());
  
  // PERFORMANCE: Reuse geometries instead of creating on every render
  const geometriesRef = useRef<Map<string, THREE.RingGeometry>>(new Map());

  // Create ring meshes for each effect
  const ringMeshes = useMemo(() => {
    if (!enabled || effects.length === 0) return [];

    const ringCount = isMobile
      ? RIPPLE_CONSTANTS.RING_COUNT_MOBILE
      : RIPPLE_CONSTANTS.RING_COUNT_DESKTOP;

    return effects.map((effect) => ({
      effectId: effect.id,
      position: effect.position,
      color: getFlowTypeColor(effect.flowType),
      rings: createRippleRings(
        effect,
        ringCount
      ),
    }));
  }, [effects, enabled, isMobile]);
  
  // Cleanup materials and geometries on unmount
  React.useEffect(() => {
    return () => {
      // Dispose all cached materials
      materialsRef.current.forEach((material) => material.dispose());
      materialsRef.current.clear();
      
      // Dispose all cached geometries
      geometriesRef.current.forEach((geometry) => geometry.dispose());
      geometriesRef.current.clear();
    };
  }, []);
  
  // Get or create reusable material for a color
  const getMaterial = React.useCallback((color: number): THREE.MeshBasicMaterial => {
    if (!materialsRef.current.has(color)) {
      materialsRef.current.set(
        color,
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
    }
    return materialsRef.current.get(color)!;
  }, []);
  
  // Get or create reusable geometry for a radius (quantized to fixed steps)
  const getGeometry = React.useCallback((radius: number): THREE.RingGeometry => {
    // PERFORMANCE: Quantize radius into 64 discrete steps to prevent unbounded geometry growth
    // Without quantization, continuous radius expansion creates ~4000 unique geometries per effect
    const GEOMETRY_STEP_COUNT = 64;
    const maxRadius = RIPPLE_CONSTANTS.MAX_RADIUS;
    
    // Quantize radius to nearest step
    const step = Math.floor((radius / maxRadius) * GEOMETRY_STEP_COUNT);
    const quantizedRadius = (step / GEOMETRY_STEP_COUNT) * maxRadius;
    const key = `${step}`;
    
    if (!geometriesRef.current.has(key)) {
      geometriesRef.current.set(
        key,
        new THREE.RingGeometry(
          quantizedRadius,
          quantizedRadius + RIPPLE_CONSTANTS.RING_THICKNESS,
          RIPPLE_CONSTANTS.RING_SEGMENTS
        )
      );
    }
    return geometriesRef.current.get(key)!;
  }, []);

  // Physics update loop
  useFrame((_state, delta) => {
    if (!enabled || !groupRef.current) return;

    const safeDelta = Math.min(delta, RIPPLE_CONSTANTS.MAX_DELTA);

    ringMeshes.forEach((meshData) => {
      meshData.rings.forEach((ring) => {
        // Update ring age
        ring.age += safeDelta;

        // Skip if not yet spawned
        if (ring.age < 0) {
          ring.opacity = 0;
          return;
        }

        // Expand radius
        ring.radius += ring.speed * safeDelta;

        // Calculate opacity based on lifetime
        const lifeProgress = ring.age / ring.lifetime;
        if (lifeProgress < 0.2) {
          // Fade in
          ring.opacity = lifeProgress * 5;
        } else if (lifeProgress > 0.8) {
          // Fade out
          ring.opacity = (1 - lifeProgress) * 5;
        } else {
          // Full visibility
          ring.opacity = 1;
        }

        // Check if ring expired
        if (ring.age >= ring.lifetime || ring.radius >= RIPPLE_CONSTANTS.MAX_RADIUS) {
          ring.opacity = 0;
        }
      });

      // Check if all rings expired
      const allExpired = meshData.rings.every(
        (ring) => ring.age >= ring.lifetime || ring.radius >= RIPPLE_CONSTANTS.MAX_RADIUS
      );

      if (allExpired && onEffectComplete) {
        onEffectComplete(meshData.effectId);
      }
    });
  });

  if (!enabled || ringMeshes.length === 0) {
    return null;
  }

  return (
    <group ref={groupRef}>
      {ringMeshes.map((meshData) =>
        meshData.rings.map((ring, ringIndex) => {
          // Skip rings not yet spawned or expired
          if (ring.age < 0 || ring.opacity <= 0) {
            return null;
          }

          // Calculate wave amplitude with oscillation
          const time = performance.now() / 1000;
          const waveOffset =
            Math.sin(time * RIPPLE_CONSTANTS.WAVE_FREQUENCY + ring.phaseOffset) *
            RIPPLE_CONSTANTS.WAVE_AMPLITUDE *
            ring.opacity;

          // PERFORMANCE: Reuse geometry; clone material to avoid shared opacity mutation
          const geometry = getGeometry(ring.radius);
          const baseMaterial = getMaterial(meshData.color);
          
          // Clone material per ring to prevent shared opacity issues
          // (Multiple rings would otherwise share the same material and opacity)
          const material = baseMaterial.clone();
          material.opacity = ring.opacity * 0.6;
          material.transparent = true;

          return (
            <mesh
              key={`${meshData.effectId}-ring-${ringIndex}`}
              position={[
                meshData.position[0],
                RIPPLE_CONSTANTS.FLOOR_Y + waveOffset,
                meshData.position[2],
              ]}
              rotation={[-Math.PI / 2, 0, 0]} // Horizontal ring
              geometry={geometry}
              material={material}
            />
          );
        })
      )}
    </group>
  );
};

/**
 * Default export for lazy loading
 */
export default WaterRipple3D;
