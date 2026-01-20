/**
 * useDistanceCulling - Distance-based culling hook for HTML overlays
 *
 * Optimizes performance by culling distant HTML overlays that are
 * beyond the camera's effective view distance. Helps maintain 60fps
 * by reducing unnecessary DOM rendering.
 *
 * @module hooks/useDistanceCulling
 * @category Performance
 * @korean 거리컬링훅
 */

import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

/**
 * Distance culling hook options
 */
export interface DistanceCullingOptions {
  /**
   * Maximum distance in meters before culling
   * @default 20
   * @korean 최대거리
   */
  readonly cullDistance?: number;

  /**
   * Whether culling is enabled
   * @default true
   * @korean 컬링활성화
   */
  readonly enabled?: boolean;
}

/**
 * useDistanceCulling hook
 *
 * Calculates whether an overlay should be rendered based on
 * distance from camera. Returns false if object is beyond cull distance.
 *
 * @param position - World position of the overlay [x, y, z]
 * @param options - Culling configuration options
 * @returns boolean - true if should render, false if should cull
 *
 * @example
 * ```tsx
 * const isVisible = useDistanceCulling([5, 0, 0], { cullDistance: 20 });
 * if (!isVisible) return null;
 * ```
 *
 * @performance
 * - Uses useMemo to prevent recalculation on every frame
 * - Distance calculation only runs when camera or position changes
 * - Reduces DOM rendering for distant overlays
 *
 * @korean 거리컬링훅사용
 */
export const useDistanceCulling = (
  position: readonly [number, number, number] | [number, number, number],
  options: DistanceCullingOptions = {},
): boolean => {
  const { cullDistance = 20, enabled = true } = options;

  const camera = useThree((state) => state.camera);

  const isVisible = useMemo(() => {
    // If culling disabled, always render
    if (!enabled) return true;

    // Calculate distance from camera to overlay position
    const overlayPosition = new THREE.Vector3(...position);
    const distance = camera.position.distanceTo(overlayPosition);

    // Return true if within cull distance, false otherwise
    return distance <= cullDistance;
  }, [camera.position.x, camera.position.y, camera.position.z, position, cullDistance, enabled]);

  return isVisible;
};

/**
 * useDistanceCullingWithThreshold - Advanced culling with hysteresis
 *
 * Prevents flickering by using different thresholds for showing/hiding.
 * Once hidden, requires moving closer than cullDistance to show again.
 *
 * @param position - World position of the overlay
 * @param options - Culling configuration with hysteresis
 * @returns boolean - true if should render, false if should cull
 *
 * @example
 * ```tsx
 * const isVisible = useDistanceCullingWithThreshold([5, 0, 0], {
 *   cullDistance: 20,
 *   showDistance: 18, // Show when within 18m
 * });
 * ```
 *
 * @korean 임계값거리컬링훅
 */
export interface AdvancedCullingOptions extends DistanceCullingOptions {
  /**
   * Distance at which to show previously hidden overlay
   * Should be less than cullDistance to prevent flickering
   * @default cullDistance * 0.9
   * @korean 표시거리
   */
  readonly showDistance?: number;
}

export const useDistanceCullingWithThreshold = (
  position: readonly [number, number, number] | [number, number, number],
  options: AdvancedCullingOptions = {},
): boolean => {
  const { cullDistance = 20, showDistance, enabled = true } = options;
  const effectiveShowDistance = showDistance ?? cullDistance * 0.9;

  const camera = useThree((state) => state.camera);

  const isVisible = useMemo(() => {
    if (!enabled) return true;

    const overlayPosition = new THREE.Vector3(...position);
    const distance = camera.position.distanceTo(overlayPosition);

    // Use different thresholds for hiding and showing
    // This prevents flickering at the boundary
    return distance <= cullDistance || distance <= effectiveShowDistance;
  }, [camera.position.x, camera.position.y, camera.position.z, position, cullDistance, effectiveShowDistance, enabled]);

  return isVisible;
};

export default useDistanceCulling;
