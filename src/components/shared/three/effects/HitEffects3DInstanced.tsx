/**
 * HitEffects3DInstanced - GPU-optimized combat hit effects with instanced rendering
 *
 * High-performance hit effects using instanced meshes to reduce draw calls
 * and improve frame time. Targets <2ms per effect with 100+ simultaneous hits.
 *
 * Features:
 * - Instanced mesh rendering for reduced draw calls
 * - Batched effects by type for optimal GPU performance
 * - Shared materials across instances
 * - Korean-themed cyberpunk visuals
 * - Maintains original HitEffects3D API for backwards compatibility
 *
 * Performance:
 * - Draw calls reduced from N to 1 per effect type
 * - GPU utilization: 60-70% target
 * - Frame time: <2ms per effect
 *
 * @module components/shared/three/effects/HitEffects3DInstanced
 * @category Shared Effects
 * @korean 타격효과3D_인스턴스화
 */

import { Instances, Instance } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { HitEffect } from "../../../../systems";
import { HitEffectType } from "../../../../systems/effects";
import { KOREAN_COLORS } from "../../../../types/constants";
import { DEFAULT_PHYSICS_ARENA_BOUNDS, clampToArenaBounds, type PhysicsArenaBounds } from "../../../../types/PhysicsTypes";

/**
 * Props for the HitEffects3DInstanced component
 */
export interface HitEffects3DInstancedProps {
  /** Array of active hit effects to render in the scene */
  readonly effects: HitEffect[];
  /** Callback invoked when an effect completes its duration */
  readonly onEffectComplete?: (effectId: string) => void;
  /** Arena bounds for accurate coordinate conversion (physics-first with meter dimensions) */
  readonly arenaBounds?: PhysicsArenaBounds;
}

/**
 * Active effect instance with animation state
 */
interface ActiveEffectInstance {
  effect: HitEffect;
  progress: number;
  position: THREE.Vector3;
  scale: number;
  opacity: number;
}

/**
 * Convert meter-based position to 3D world position.
 *
 * Positions from the combat system are in meters relative to the arena center.
 * This function clamps the meter-based position to the arena bounds and then
 * uses those clamped meter coordinates directly as 3D world coordinates
 * (with a fixed mid-height for visual hit effects). No 0–1 normalization or
 * additional remapping is performed.
 */
const positionTo3D = (
  effect: HitEffect,
  arenaBounds: PhysicsArenaBounds
): THREE.Vector3 => {
  if (!effect.position) {
    return new THREE.Vector3(0, 1, 0);
  }

  // Position is in meters relative to arena center (0, 0)
  // Player models use meter coordinates directly: position={[playerPos.x, 0, playerPos.y]}
  // So we use meter coordinates directly too for alignment
  
  // Clamp position to arena boundaries using shared helper
  const clamped = clampToArenaBounds(effect.position, arenaBounds);
  
  // Use clamped meter coordinates directly in 3D space (no remapping)
  const x = clamped.x; // Meter position X
  const y = 1.5; // Mid-height for effects
  const z = clamped.y; // Meter position Z (depth)

  return new THREE.Vector3(x, y, z);
};

/**
 * Individual instanced effect component
 * 
 * Performance Note: This component uses refs to store animation state
 * that is updated in useFrame. While React Three Fiber's useFrame runs
 * outside of React's render phase, we maintain a state snapshot
 * (effectRefsSnapshot) for rendering to avoid accessing refs during render.
 * 
 * The ref mutation pattern here is necessary for 60fps performance because:
 * - Updating state on every frame would trigger unnecessary re-renders
 * - Direct ref mutation in useFrame is safe (it runs outside React render)
 * - The state snapshot ensures render consistency without frame-by-frame re-renders
 */
const InstancedEffect: React.FC<{
  instance: ActiveEffectInstance;
  effectRef: React.MutableRefObject<ActiveEffectInstance>;
}> = ({ instance, effectRef }) => {
  const ref = useRef<THREE.Object3D>(null);

  useFrame(() => {
    if (!ref.current) return;

    // Apply transforms from ref state
    ref.current.scale.setScalar(effectRef.current.scale);

    // Rotate for some effects
    if (
      instance.effect.type === HitEffectType.COUNTER ||
      instance.effect.type === HitEffectType.VITAL_POINT_STRIKE
    ) {
      ref.current.rotation.y += 0.1;
    }

    // Scale pulse for critical hits
    if (instance.effect.type === HitEffectType.CRITICAL_HIT) {
      const pulse = 1 + Math.sin(effectRef.current.progress * Math.PI * 4) * 0.2;
      ref.current.scale.setScalar(effectRef.current.scale * pulse);
    }
  });

  return (
    <Instance
      ref={ref}
      position={instance.position}
      scale={instance.scale}
    />
  );
};

/**
 * Instanced mesh group for a specific effect type
 */
const EffectInstanceGroup: React.FC<{
  type: HitEffectType;
  instances: ActiveEffectInstance[];
  effectRefs: Map<string, React.MutableRefObject<ActiveEffectInstance>>;
  geometry: React.ReactNode;
  color: number;
  opacity: number;
}> = ({ instances, effectRefs, geometry, color, opacity }) => {
  if (instances.length === 0) return null;

  return (
    <Instances limit={100}>
      {geometry}
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
      {instances.map((instance) => {
        const effectRef = effectRefs.get(instance.effect.id);
        if (!effectRef) return null;
        return (
          <InstancedEffect
            key={instance.effect.id}
            instance={instance}
            effectRef={effectRef}
          />
        );
      })}
    </Instances>
  );
};

/**
 * HitEffects3DInstanced Component
 *
 * GPU-optimized hit effects using instanced rendering.
 * Maintains API compatibility with HitEffects3D.
 *
 * Performance:
 * - Reduced draw calls: 1 per effect type instead of 1 per effect
 * - Batched rendering for improved GPU utilization
 * - Shared materials across all instances
 *
 * @example
 * ```tsx
 * <HitEffects3DInstanced
 *   effects={hitEffects}
 *   onEffectComplete={(id) => {
 *     setHitEffects(prev => prev.filter(e => e.id !== id));
 *   }}
 *   arenaBounds={arenaBounds}
 * />
 * ```
 */
export const HitEffects3DInstanced: React.FC<HitEffects3DInstancedProps> = ({
  effects,
  onEffectComplete,
  arenaBounds = DEFAULT_PHYSICS_ARENA_BOUNDS,
}) => {
  const effectRefsMap = useRef<
    Map<string, React.MutableRefObject<ActiveEffectInstance>>
  >(new Map());
  const completedEffectsRef = useRef<Set<string>>(new Set());

  // Track active instances with animation state
  const [activeInstances, setActiveInstances] = useState<Map<string, ActiveEffectInstance>>(
    new Map()
  );

  // Store effectRefs as state to avoid ref access during render
  const [effectRefsSnapshot, setEffectRefsSnapshot] = useState<
    Map<string, React.MutableRefObject<ActiveEffectInstance>>
  >(new Map());

  // Initialize effect instances
  useEffect(() => {
    const currentIdSet = new Set(effects.map((e) => e.id));

    // Clean up removed effects
    effectRefsMap.current.forEach((_ref, id) => {
      if (!currentIdSet.has(id)) {
        effectRefsMap.current.delete(id);
        completedEffectsRef.current.delete(id);
      }
    });

    // Initialize new effects
    const newInstances = new Map<string, ActiveEffectInstance>();
    effects.forEach((effect) => {
      if (!effectRefsMap.current.has(effect.id)) {
        const position = positionTo3D(effect, arenaBounds);
        const instance: ActiveEffectInstance = {
          effect,
          progress: 0,
          position,
          scale: 0.3 * effect.intensity,
          opacity: 1,
        };

        effectRefsMap.current.set(effect.id, {
          current: instance,
        });
        newInstances.set(effect.id, instance);
      } else {
        // Keep existing instance
        const ref = effectRefsMap.current.get(effect.id);
        if (ref?.current) {
          newInstances.set(effect.id, ref.current);
        }
      }
    });

    // Clean up removed instances
    newInstances.forEach((_, id) => {
      if (!currentIdSet.has(id)) {
        newInstances.delete(id);
      }
    });

    setActiveInstances(newInstances);
    setEffectRefsSnapshot(new Map(effectRefsMap.current));
  }, [effects, arenaBounds]);

  // Update progress using refs
  // Performance Note: Ref mutations in useFrame are safe and necessary for 60fps.
  // We avoid state updates here to prevent triggering React re-renders every frame.
  // The effectRefsSnapshot state is updated only when effects change, not every frame.
  useFrame(() => {
    const now = Date.now();

    effectRefsMap.current.forEach((ref, id) => {
      if (!ref.current) return;

      const progress = Math.min(
        (now - ref.current.effect.startTime) / ref.current.effect.duration,
        1
      );
      ref.current.progress = progress;
      ref.current.scale = (0.3 + progress * 0.7) * ref.current.effect.intensity;
      ref.current.opacity = 1 - progress;

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

  // Group instances by effect type for batched rendering
  // Optimization: This recalculates on activeInstances change.
  // For very large effect counts (>1000), consider maintaining groups
  // incrementally in the useEffect that manages effect lifecycle.
  const instancesByType = useMemo(() => {
    const groups = new Map<HitEffectType, ActiveEffectInstance[]>();
    activeInstances.forEach((instance) => {
      const type = instance.effect.type;
      if (!groups.has(type)) {
        groups.set(type, []);
      }
      groups.get(type)!.push(instance);
    });
    return groups;
  }, [activeInstances]);

  return (
    <group name="hit-effects-instanced">
      {/* HIT effects */}
      <EffectInstanceGroup
        type={HitEffectType.HIT}
        instances={instancesByType.get(HitEffectType.HIT) ?? []}
        effectRefs={effectRefsSnapshot}
        geometry={<sphereGeometry args={[1, 16, 16]} />}
        color={KOREAN_COLORS.ACCENT_RED}
        opacity={0.5}
      />

      {/* CRITICAL_HIT effects */}
      <EffectInstanceGroup
        type={HitEffectType.CRITICAL_HIT}
        instances={instancesByType.get(HitEffectType.CRITICAL_HIT) ?? []}
        effectRefs={effectRefsSnapshot}
        geometry={<sphereGeometry args={[1, 16, 16]} />}
        color={KOREAN_COLORS.ACCENT_GOLD}
        opacity={0.7}
      />

      {/* BLOCK effects */}
      <EffectInstanceGroup
        type={HitEffectType.BLOCK}
        instances={instancesByType.get(HitEffectType.BLOCK) ?? []}
        effectRefs={effectRefsSnapshot}
        geometry={<torusGeometry args={[0.8, 0.1, 8, 16, Math.PI]} />}
        color={KOREAN_COLORS.ACCENT_CYAN}
        opacity={0.8}
      />

      {/* VITAL_POINT_STRIKE effects */}
      <EffectInstanceGroup
        type={HitEffectType.VITAL_POINT_STRIKE}
        instances={instancesByType.get(HitEffectType.VITAL_POINT_STRIKE) ?? []}
        effectRefs={effectRefsSnapshot}
        geometry={<sphereGeometry args={[1, 16, 16]} />}
        color={KOREAN_COLORS.SECONDARY_MAGENTA}
        opacity={0.5}
      />

      {/* PARRY effects */}
      <EffectInstanceGroup
        type={HitEffectType.PARRY}
        instances={instancesByType.get(HitEffectType.PARRY) ?? []}
        effectRefs={effectRefsSnapshot}
        geometry={<torusGeometry args={[0.7, 0.1, 8, 16, Math.PI / 2]} />}
        color={KOREAN_COLORS.ACCENT_GOLD}
        opacity={0.8}
      />

      {/* COUNTER effects */}
      <EffectInstanceGroup
        type={HitEffectType.COUNTER}
        instances={instancesByType.get(HitEffectType.COUNTER) ?? []}
        effectRefs={effectRefsSnapshot}
        geometry={<boxGeometry args={[1.2, 0.1, 0.1]} />}
        color={KOREAN_COLORS.PRIMARY_CYAN}
        opacity={0.8}
      />

      {/* MISS effects */}
      <EffectInstanceGroup
        type={HitEffectType.MISS}
        instances={instancesByType.get(HitEffectType.MISS) ?? []}
        effectRefs={effectRefsSnapshot}
        geometry={<boxGeometry args={[1.2, 0.04, 0.04]} />}
        color={KOREAN_COLORS.TEXT_TERTIARY}
        opacity={0.6}
      />

      {/* GENERAL_DAMAGE and STATUS_EFFECT */}
      <EffectInstanceGroup
        type={HitEffectType.GENERAL_DAMAGE}
        instances={[
          ...(instancesByType.get(HitEffectType.GENERAL_DAMAGE) ?? []),
          ...(instancesByType.get(HitEffectType.STATUS_EFFECT) ?? []),
        ]}
        effectRefs={effectRefsSnapshot}
        geometry={<sphereGeometry args={[1, 16, 16]} />}
        color={KOREAN_COLORS.ACCENT_GREEN}
        opacity={0.5}
      />
    </group>
  );
};

export default HitEffects3DInstanced;
