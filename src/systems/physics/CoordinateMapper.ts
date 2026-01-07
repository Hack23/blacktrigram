/**
 * Coordinate Mapper for 2D→3D conversion in Black Trigram.
 * 
 * **Korean**: 좌표 변환기 (2D → 3D)
 * 
 * Maps 2D pixel coordinates from the vital points data (UI overlay) to 3D world
 * coordinates for physics-based collision detection. This allows the UI-based
 * vital point system to work seamlessly with Three.js 3D collision detection.
 * 
 * ## Coordinate Systems
 * 
 * - **2D Pixel Space**: Origin (0,0) at top-left, used by vital points UI overlay
 * - **3D World Space**: Origin (0,0,0) at character center, used by collision detection
 * 
 * ## Character Model Assumptions
 * 
 * - Character height: 1.75m (average adult)
 * - Character width: 0.5m (shoulder width)
 * - Character depth: 0.3m (chest to back)
 * - Standing position: feet at y=0, head at y=1.75
 * 
 * ## Mapping Strategy
 * 
 * The mapper uses anatomical regions to determine the Z-depth (front-to-back position)
 * of vital points, ensuring physically accurate 3D positions for collision detection.
 * 
 * @module systems/physics/CoordinateMapper
 * @category Physics System
 * @korean 좌표변환
 */

import type { Position } from "@/types/common";
import type { Position3D, AnatomicalRegionPhysics } from "@/types/physics";
import type { VitalPoint } from "../vitalpoint/types";

/**
 * Configuration for the character model coordinate mapping.
 * 
 * **Korean**: 캐릭터 모델 설정
 */
export interface CharacterModelConfig {
  /** Character height in meters (default: 1.75m) */
  readonly height: number;
  
  /** Character shoulder width in meters (default: 0.5m) */
  readonly width: number;
  
  /** Character depth (chest to back) in meters (default: 0.3m) */
  readonly depth: number;
  
  /** UI overlay width in pixels (default: 200px) */
  readonly overlayWidth: number;
  
  /** UI overlay height in pixels (default: 300px) */
  readonly overlayHeight: number;
}

/**
 * Average adult standing height used for physics mapping (meters).
 * 
 * This value is based on common anthropometric data and provides a
 * reasonable default for a neutral, unarmed character in Black Trigram.
 */
const AVERAGE_ADULT_HEIGHT_M = 1.75; // 175cm average adult height

/**
 * Average shoulder width used for frontal collision and UI mapping (meters).
 * 
 * This approximates the biacromial (shoulder-to-shoulder) breadth for an
 * adult, which is sufficient for our hitbox and overlay alignment needs.
 */
const AVERAGE_SHOULDER_WIDTH_M = 0.5; // 50cm shoulder width

/**
 * Average torso depth (chest to back) used for front/back hit placement (meters).
 */
const AVERAGE_TORSO_DEPTH_M = 0.3; // 30cm chest depth

/**
 * Default UI overlay width in pixels.
 * 
 * This matches the designed vital-point sprite asset width, ensuring that
 * pixel coordinates from the overlay map consistently to the 3D character.
 */
const DEFAULT_OVERLAY_WIDTH_PX = 200; // Standard UI overlay width

/**
 * Default UI overlay height in pixels.
 * 
 * This matches the designed vital-point sprite asset height, keeping the
 * 2D→3D mapping resolution-independent but asset-consistent.
 */
const DEFAULT_OVERLAY_HEIGHT_PX = 300; // Standard UI overlay height

/**
 * Default character model configuration based on average adult proportions.
 */
const DEFAULT_CHARACTER_CONFIG: CharacterModelConfig = {
  height: AVERAGE_ADULT_HEIGHT_M,
  width: AVERAGE_SHOULDER_WIDTH_M,
  depth: AVERAGE_TORSO_DEPTH_M,
  overlayWidth: DEFAULT_OVERLAY_WIDTH_PX,
  overlayHeight: DEFAULT_OVERLAY_HEIGHT_PX,
};

/**
 * Z-depth (front-to-back) offsets for different anatomical regions.
 * 
 * Units are **meters in model space**, measured along the character's local Z axis,
 * and are applied relative to the character's center plane (Z = 0) and the
 * configured {@link CharacterModelConfig.depth}. With the default depth of
 * `0.3m`, an offset of `0.05` corresponds to ≈5 cm of forward displacement.
 *
 * These values were chosen as simple, stable approximations based on average
 * adult proportions and validated visually against the default rig:
 *
 * - `head: 0.05` → head center sits slightly in front of the torso plane
 *   (≈1/6 of torso depth) to match typical forward head posture.
 * - `neck: 0.02` → neck base is close to the torso plane but not perfectly
 *   centered, acknowledging slight anterior offset of the trachea/sternum.
 * - `torso: 0.0` → torso vital points lie on the reference center plane that
 *   approximates the mid‑chest / spine midpoint.
 * - `arms: 0.05` → relaxed arms hang slightly in front of the torso plane,
 *   using the same forward offset as the head for consistency.
 * - `legs: 0.0` → leg targets (front of thighs/shins) are modeled on the
 *   center plane; depth variation is instead captured by vertical placement.
 *
 * If you change {@link CharacterModelConfig.depth}, you may keep these absolute
 * meter values (for physical fidelity) or re‑express them as fractions of the
 * new depth, but they should continue to represent small (≈0–5 cm) anatomical
 * offsets from the torso midline.
 */
const REGION_DEPTH_OFFSETS: Record<AnatomicalRegionPhysics, number> = {
  head: 0.05,    // ≈5 cm forward from torso mid-plane to match cranial alignment
  neck: 0.02,    // ≈2 cm forward; neck base is near, but not exactly on, center
  torso: 0.0,    // Torso reference plane (mid‑chest / spine midpoint)
  arms: 0.05,    // ≈5 cm forward; relaxed arms rest slightly in front of torso
  legs: 0.0,     // Legs aligned to torso center plane; front/back handled elsewhere
};

/**
 * Coordinate Mapper for converting 2D pixel coordinates to 3D world coordinates.
 * 
 * **Korean**: 좌표 변환기
 * 
 * Provides bidirectional mapping between the 2D UI overlay coordinate system
 * and the 3D physics world coordinate system.
 * 
 * @public
 * @category Physics System
 * @korean 좌표변환기
 */
export class CoordinateMapper {
  private readonly config: CharacterModelConfig;
  
  /**
   * Creates a new CoordinateMapper with optional custom configuration.
   * 
   * @param config - Optional character model configuration
   */
  constructor(config: Partial<CharacterModelConfig> = {}) {
    this.config = { ...DEFAULT_CHARACTER_CONFIG, ...config };
  }
  
  /**
   * Converts a 2D pixel position to a 3D world position.
   * 
   * **Korean**: 2D → 3D 변환
   * 
   * Maps UI overlay pixel coordinates to 3D world space coordinates suitable
   * for physics collision detection.
   * 
   * @param pixel2D - 2D pixel position (origin top-left)
   * @param region - Anatomical region for Z-depth calculation
   * @returns 3D world position in meters (origin at character center)
   * 
   * @example
   * ```typescript
   * const mapper = new CoordinateMapper();
   * const vitalPoint = { position: { x: 100, y: 50 } };
   * const worldPos = mapper.pixel2DToWorld3D(vitalPoint.position, "head");
   * // worldPos: { x: 0, y: 1.45, z: 0.05 }
   * ```
   */
  pixel2DToWorld3D(pixel2D: Position, region: AnatomicalRegionPhysics): Position3D {
    // Normalize pixel coordinates to 0-1 range
    const normalizedX = pixel2D.x / this.config.overlayWidth;
    const normalizedY = pixel2D.y / this.config.overlayHeight;
    
    // Convert to world coordinates
    // X: Map from pixel space (0 = left, overlayWidth = right) to world space (-width/2 to +width/2)
    const worldX = (normalizedX - 0.5) * this.config.width;
    
    // Y: Map from pixel space (0 = top, overlayHeight = bottom) to world space (height to 0)
    // Invert Y-axis: pixel 0 = top = character head, pixel overlayHeight = bottom = character feet
    const worldY = (1 - normalizedY) * this.config.height;
    
    // Z: Use anatomical region to determine depth offset
    const worldZ = REGION_DEPTH_OFFSETS[region];
    
    return {
      x: worldX,
      y: worldY,
      z: worldZ,
    };
  }
  
  /**
   * Converts a 3D world position to a 2D pixel position.
   * 
   * **Korean**: 3D → 2D 변환
   * 
   * Maps 3D world space coordinates back to UI overlay pixel coordinates.
   * Useful for debugging and visual feedback.
   * 
   * @param world3D - 3D world position in meters
   * @returns 2D pixel position (origin top-left)
   * 
   * @example
   * ```typescript
   * const mapper = new CoordinateMapper();
   * const worldPos = { x: 0, y: 1.45, z: 0.05 };
   * const pixelPos = mapper.world3DToPixel2D(worldPos);
   * // pixelPos: { x: 100, y: 50 }
   * ```
   */
  world3DToPixel2D(world3D: Position3D): Position {
    // Convert world X to normalized 0-1 range
    const normalizedX = (world3D.x / this.config.width) + 0.5;
    
    // Convert world Y to normalized 0-1 range (inverted)
    const normalizedY = 1 - (world3D.y / this.config.height);
    
    // Convert to pixel coordinates
    return {
      x: Math.round(normalizedX * this.config.overlayWidth),
      y: Math.round(normalizedY * this.config.overlayHeight),
    };
  }
  
  /**
   * Converts a vital point's 2D position to 3D world position.
   * 
   * **Korean**: 급소 위치 변환
   * 
   * Convenience method that extracts position and region from a VitalPoint object.
   * 
   * @param vitalPoint - Vital point with 2D position
   * @returns 3D world position
   * 
   * @example
   * ```typescript
   * const mapper = new CoordinateMapper();
   * const temple = VITAL_POINTS_DATA.find(vp => vp.id === "head_temple");
   * const worldPos = mapper.vitalPointToWorld3D(temple);
   * ```
   */
  vitalPointToWorld3D(vitalPoint: VitalPoint): Position3D {
    // Infer region from vital point ID prefix
    const region = this.inferRegionFromId(vitalPoint.id);
    return this.pixel2DToWorld3D(vitalPoint.position, region);
  }
  
  /**
   * Infers the anatomical region from a vital point ID.
   * 
   * **Korean**: 급소 ID에서 영역 추론
   * 
   * @param vitalPointId - Vital point ID (e.g., "head_temple", "torso_solar_plexus")
   * @returns Anatomical region
   * 
   * @private
   */
  private inferRegionFromId(vitalPointId: string): AnatomicalRegionPhysics {
    if (vitalPointId.startsWith("head_")) return "head";
    if (vitalPointId.startsWith("neck_")) return "neck";
    if (vitalPointId.startsWith("torso_")) return "torso";
    if (vitalPointId.startsWith("arm_")) return "arms";
    if (vitalPointId.startsWith("leg_")) return "legs";
    
    // Default to torso if no clear region prefix
    return "torso";
  }
  
  /**
   * Calculates the distance between a 3D point and a vital point's 3D position.
   * 
   * **Korean**: 거리 계산
   * 
   * @param point3D - Point in 3D world space
   * @param vitalPoint - Vital point to measure distance to
   * @returns Distance in meters
   * 
   * @example
   * ```typescript
   * const mapper = new CoordinateMapper();
   * const attackPoint = { x: 0, y: 1.5, z: 0.1 };
   * const temple = VITAL_POINTS_DATA.find(vp => vp.id === "head_temple");
   * const distance = mapper.distanceToVitalPoint(attackPoint, temple);
   * ```
   */
  distanceToVitalPoint(point3D: Position3D, vitalPoint: VitalPoint): number {
    const vitalPoint3D = this.vitalPointToWorld3D(vitalPoint);
    
    const dx = point3D.x - vitalPoint3D.x;
    const dy = point3D.y - vitalPoint3D.y;
    const dz = point3D.z - vitalPoint3D.z;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  
  /**
   * Finds the closest vital point to a 3D position within a given region.
   * 
   * **Korean**: 가장 가까운 급소 찾기
   * 
   * @param point3D - Point in 3D world space
   * @param vitalPoints - Array of vital points to search
   * @param region - Optional region filter
   * @returns Closest vital point and distance, or null if none found
   * 
   * @example
   * ```typescript
   * const mapper = new CoordinateMapper();
   * const hitPoint = { x: 0, y: 1.7, z: 0.05 };
   * const result = mapper.findClosestVitalPoint(hitPoint, VITAL_POINTS_DATA, "head");
   * if (result) {
   *   console.log(`Hit ${result.vitalPoint.names.english} at ${result.distance}m`);
   * }
   * ```
   */
  findClosestVitalPoint(
    point3D: Position3D,
    vitalPoints: readonly VitalPoint[],
    region?: AnatomicalRegionPhysics
  ): { vitalPoint: VitalPoint; distance: number } | null {
    let closestVitalPoint: VitalPoint | null = null;
    let closestDistance = Infinity;
    
    for (const vitalPoint of vitalPoints) {
      // Filter by region if specified
      if (region) {
        const vpRegion = this.inferRegionFromId(vitalPoint.id);
        if (vpRegion !== region) continue;
      }
      
      const distance = this.distanceToVitalPoint(point3D, vitalPoint);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestVitalPoint = vitalPoint;
      }
    }
    
    if (closestVitalPoint === null) {
      return null;
    }
    
    return {
      vitalPoint: closestVitalPoint,
      distance: closestDistance,
    };
  }
  
  /**
   * Gets the current character model configuration.
   * 
   * @returns Current configuration
   */
  getConfig(): CharacterModelConfig {
    return { ...this.config };
  }
}

/**
 * Default singleton instance for convenient access.
 * 
 * **Korean**: 기본 인스턴스
 * 
 * @example
 * ```typescript
 * import { defaultCoordinateMapper } from './CoordinateMapper';
 * 
 * const worldPos = defaultCoordinateMapper.pixel2DToWorld3D({ x: 100, y: 50 }, "head");
 * ```
 */
export const defaultCoordinateMapper = new CoordinateMapper();
