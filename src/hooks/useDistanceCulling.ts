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
 * This hook tracks individual camera position components (x, y, z) in the dependency array.
 * While this causes recalculation on camera movement, it's necessary for accurate culling.
 * The useMemo still prevents redundant calculations within the same frame. For games with
 * very frequent camera updates, consider implementing a threshold-based approach (only update
 * when camera moves more than a certain distance) or debouncing at the component level.
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
    // Extract camera position components to avoid dependency issues
    const camX = camera.position.x;
    const camY = camera.position.y;
    const camZ = camera.position.z;
    
    // Calculate squared distance manually to avoid expensive sqrt operation
    const dx = position[0] - camX;
    const dy = position[1] - camY;
    const dz = position[2] - camZ;
    const distanceSquared = dx * dx + dy * dy + dz * dz;
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
  const { cullDistance = 20, enabled = true } = options;
  // Note: showDistance parameter is currently unused due to incomplete hysteresis implementation
  // const effectiveShowDistance = showDistance ?? cullDistance * 0.9;

  const camera = useThree((state) => state.camera);

  // Note: This implementation doesn't provide true hysteresis yet.
  // True hysteresis requires useState to track previous visibility and apply
  // different thresholds based on current state:
  // - When hidden: show only if distance < showDistance
  // - When visible: hide only if distance > cullDistance
  const isVisible = useMemo(() => {
    if (!enabled) return true;

    // Extract camera position components to avoid dependency issues
    const camX = camera.position.x;
    const camY = camera.position.y;
    const camZ = camera.position.z;
    
    // Calculate squared distance manually to avoid expensive sqrt operation
    const dx = position[0] - camX;
    const dy = position[1] - camY;
    const dz = position[2] - camZ;
    const distanceSquared = dx * dx + dy * dy + dz * dz;
    const cullDistanceSquared = cullDistance * cullDistance;

    // Simplified check - just use cullDistance for now
    // TODO: Implement proper hysteresis with useState tracking previous visibility
    return distanceSquared <= cullDistanceSquared;
  }, [camera.position.x, camera.position.y, camera.position.z, position, cullDistance, enabled]);

  return isVisible;
};

export default useDistanceCulling;
