/**
 * Shared physics configuration for Black Trigram screens.
 *
 * **Korean**: 공유 물리 설정
 *
 * This module provides shared physics configuration utilities to ensure
 * consistent physics behavior, coordinate systems, and camera setup across
 * TrainingScreen3D and CombatScreen3D.
 *
 * ## Synchronization Guarantees
 *
 * All screens using these utilities will have:
 * - Identical camera FOV and positioning for same device types
 * - Consistent arena bounds calculations
 * - Same physics constants (acceleration, stamina regen, etc.)
 * - Unified coordinate system (meter-based)
 * - Matching movement speed and range calculations
 *
 * @module utils/sharedPhysicsConfig
 * @category Physics
 * @korean 공유물리설정
 */

import {
  BASE_STAMINA_REGEN_RATE,
  BASE_MOVEMENT_ACCELERATION,
  COMBAT_RANGES_METERS,
} from "@/types/physicsConstants";
import {
  calculateArenaConfiguration,
  type ArenaConfiguration,
} from "./arenaWorldDimensions";

/**
 * Camera configuration for 3D rendering.
 *
 * **Korean**: 카메라 설정
 *
 * @public
 */
export interface CameraConfiguration {
  /** Field of view in degrees */
  readonly fov: number;
  /** Camera position [x, y, z] in meters */
  readonly position: readonly [number, number, number];
  /** Near clipping plane */
  readonly near: number;
  /** Far clipping plane */
  readonly far: number;
}

/**
 * Complete physics configuration for a game screen.
 *
 * **Korean**: 물리 설정
 *
 * Includes all parameters needed to ensure consistent physics
 * behavior across different screens and device types.
 *
 * @public
 */
export interface PhysicsConfiguration {
  /** Arena configuration with pixel and meter dimensions */
  readonly arenaConfig: ArenaConfiguration;
  /** Camera configuration for consistent perspective */
  readonly cameraConfig: CameraConfiguration;
  /** Base stamina regeneration rate (stamina/second) */
  readonly staminaRegenRate: number;
  /** Base movement acceleration (m/s²) */
  readonly movementAcceleration: number;
  /** Combat ranges in meters */
  readonly combatRanges: typeof COMBAT_RANGES_METERS;
  /** Pixels per meter ratio for this configuration */
  readonly pixelsPerMeter: number;
}

/**
 * Create camera configuration based on device type.
 *
 * Mobile devices get a tighter FOV and closer camera position
 * for better framing of the smaller arena. Desktop gets a wider
 * FOV and further camera for full arena view.
 *
 * **Korean**: 카메라 설정 생성
 *
 * @param isMobile - Whether the device is mobile
 * @returns Camera configuration for device type
 *
 * @example
 * ```typescript
 * const mobile = createCameraConfig(true);
 * // { fov: 55, position: [0, 6, 10], near: 0.1, far: 1000 }
 *
 * const desktop = createCameraConfig(false);
 * // { fov: 60, position: [0, 8, 12], near: 0.1, far: 1000 }
 * ```
 *
 * @public
 */
export function createCameraConfig(isMobile: boolean): CameraConfiguration {
  if (isMobile) {
    return {
      fov: 55, // Tighter FOV for smaller mobile arena
      position: [0, 6, 10], // Closer camera
      near: 0.1,
      far: 1000,
    };
  }

  return {
    fov: 60, // Standard FOV for desktop
    position: [0, 8, 12], // Further back for full view
    near: 0.1,
    far: 1000,
  };
}

/**
 * Create complete physics configuration for a screen.
 *
 * This is the primary function for setting up physics in both
 * TrainingScreen3D and CombatScreen3D. It ensures consistent
 * physics behavior by using the same calculations and constants.
 *
 * **Korean**: 물리 설정 생성
 *
 * @param screenWidth - Screen width in pixels
 * @param screenHeight - Screen height in pixels
 * @param topOffset - Pixels reserved at top (HUD, headers)
 * @param bottomOffset - Pixels reserved at bottom (controls, footer)
 * @param isMobile - Whether the device is mobile
 * @returns Complete physics configuration
 *
 * @example
 * ```typescript
 * // Training screen
 * const trainingPhysics = createPhysicsConfig(
 *   1920, 1080, 60, 100, false
 * );
 *
 * // Combat screen
 * const combatPhysics = createPhysicsConfig(
 *   1920, 1080, 60, 100, false
 * );
 *
 * // Both have identical physics configuration
 * trainingPhysics.pixelsPerMeter === combatPhysics.pixelsPerMeter; // true
 * ```
 *
 * @public
 */
export function createPhysicsConfig(
  screenWidth: number,
  screenHeight: number,
  topOffset: number,
  bottomOffset: number,
  isMobile: boolean,
): PhysicsConfiguration {
  // Calculate arena dimensions (same for both screens)
  const arenaConfig = calculateArenaConfiguration(
    screenWidth,
    screenHeight,
    topOffset,
    bottomOffset,
  );

  // Create camera config based on device type
  const cameraConfig = createCameraConfig(isMobile);

  return {
    arenaConfig,
    cameraConfig,
    staminaRegenRate: BASE_STAMINA_REGEN_RATE,
    movementAcceleration: BASE_MOVEMENT_ACCELERATION,
    combatRanges: COMBAT_RANGES_METERS,
    pixelsPerMeter: arenaConfig.pixelsPerMeter,
  };
}
