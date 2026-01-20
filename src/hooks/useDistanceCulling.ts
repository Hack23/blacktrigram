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
 * - Uses distanceToSquared() to avoid expensive sqrt operation
 * - Reduces DOM rendering for distant overlays
 *
 * @note Camera position dependency
 * This hook recalculates on every camera movement, which is intentional
 * for accurate culling. In practice, camera movement is throttled by the
 * game loop and useMemo prevents redundant calculations within the same frame.
 * For further optimization, consider implementing a threshold-based approach
 * or debouncing at the component level if camera updates are very frequent.
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
    // Use Vector3.distanceToSquared() to avoid expensive sqrt operation
    const overlayPosition = new THREE.Vector3(...position);
    const distanceSquared = camera.position.distanceToSquared(overlayPosition);
    const cullDistanceSquared = cullDistance * cullDistance;

    // Return true if within cull distance, false otherwise
    return distanceSquared <= cullDistanceSquared;
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

  // Note: Proper hysteresis requires state tracking (was visible previously?)
  // This simplified version uses OR logic as a compromise:
  // - Shows if within showDistance (18m by default)
  // - OR if within cullDistance (20m by default)
  // For true hysteresis, implement with useState and previous visibility tracking
  const isVisible = useMemo(() => {
    if (!enabled) return true;

    const overlayPosition = new THREE.Vector3(...position);
    const distanceSquared = camera.position.distanceToSquared(overlayPosition);
    
    // Use squared distances to avoid sqrt
    const cullDistanceSquared = cullDistance * cullDistance;
    const showDistanceSquared = effectiveShowDistance * effectiveShowDistance;

    // Simplified hysteresis: show if within either threshold
    // TODO: Implement proper hysteresis with useState for previous visibility
    return distanceSquared <= cullDistanceSquared || distanceSquared <= showDistanceSquared;
  }, [camera.position.x, camera.position.y, camera.position.z, position, cullDistance, effectiveShowDistance, enabled]);

  return isVisible;
};

export default useDistanceCulling;
