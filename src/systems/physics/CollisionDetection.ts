/**
 * Collision Detection System for Black Trigram combat physics.
 * 
 * **Korean**: 충돌 감지 시스템
 * 
 * Implements precise collision detection for the 70 vital points combat system using:
 * - Broad-phase AABB (Axis-Aligned Bounding Box) checks for performance
 * - Narrow-phase raycasting for precise vital point detection
 * - Attack reach validation based on technique and stance
 * - Bounding boxes for 5 anatomical regions
 * 
 * ## Architecture
 * 
 * The system uses a two-phase collision detection approach:
 * 
 * 1. **Broad-phase**: Fast AABB checks to eliminate impossible collisions
 * 2. **Narrow-phase**: Precise raycasting to identify specific vital points
 * 
 * This ensures 60fps performance even with complex collision queries.
 * 
 * ## Performance
 * 
 * - Broad-phase: O(1) per check (simple distance comparison)
 * - Narrow-phase: O(n) where n = vital points in region (typically 8-20)
 * - Target: <100 collision checks per frame for 60fps
 * 
 * @example
 * ```typescript
 * const collision = new CollisionDetection();
 * 
 * const result = collision.checkAttackHit(
 *   { x: 0, y: 0, z: 5 },        // Attacker position
 *   { x: 0, y: 0, z: 6.5 },      // Defender position
 *   { id: "kick", type: "kick" }, // Technique
 *   TrigramStance.LI,             // Attacker stance
 *   "torso"                       // Target region
 * );
 * 
 * if (result.hit) {
 *   console.log(`Hit ${result.vitalPoint?.names.english}!`);
 *   console.log(`Accuracy: ${(result.accuracy * 100).toFixed(1)}%`);
 * }
 * ```
 * 
 * @module systems/physics/CollisionDetection
 * @category Combat Systems
 * @korean 충돌감지시스템
 */

import * as THREE from "three";
import { TrigramStance } from "../../types/common";
import type {
  AnatomicalRegionPhysics,
  BoundingBox,
  CollisionResult,
  Position3D,
  RaycastQuery,
  TechniqueType,
} from "../../types/physics";
import { 
  BASE_REACH, 
  STANCE_REACH_MODIFIERS, 
  ANATOMICAL_DIMENSIONS 
} from "../../types/physics";
import type { VitalPoint } from "../vitalpoint/types";
import { VITAL_POINTS_DATA } from "../vitalpoint/VitalPointsData";

/**
 * Collision Detection Engine for combat physics.
 * 
 * **Korean**: 충돌 감지 엔진
 * 
 * Provides efficient collision detection for combat using bounding boxes and raycasting.
 * Optimized for 60fps performance with multiple simultaneous collision checks.
 * 
 * @public
 * @category Combat Systems
 * @korean 충돌감지엔진
 */
export class CollisionDetection {
  private readonly boundingBoxes: Map<AnatomicalRegionPhysics, BoundingBox> = new Map();
  private readonly raycaster: THREE.Raycaster = new THREE.Raycaster();
  private vitalPointsByRegion: Map<AnatomicalRegionPhysics, VitalPoint[]> = new Map();
  
  // Geometry cache for object pooling to avoid repeated allocations during combat
  private readonly geometryCache: Map<string, THREE.BufferGeometry> = new Map();

  /**
   * Creates a new CollisionDetection instance.
   * 
   * Initializes bounding boxes for all anatomical regions and organizes
   * vital points by region for efficient lookup.
   */
  constructor() {
    this.initializeBoundingBoxes();
    this.organizeVitalPointsByRegion();
    this.initializeGeometryCache();
  }
  
  /**
   * Cleans up Three.js resources.
   * 
   * **Korean**: 자원 정리
   * 
   * Disposes of cached geometries and releases memory to prevent leaks.
   * Should be called when the CollisionDetection instance is no longer needed.
   * 
   * @public
   * @korean 자원정리
   */
  public dispose(): void {
    // Dispose all cached geometries
    for (const geometry of this.geometryCache.values()) {
      geometry.dispose();
    }
    this.geometryCache.clear();
  }

  /**
   * Checks if an attack hits the defender.
   * 
   * **Korean**: 공격 타격 확인
   * 
   * Performs two-phase collision detection:
   * 1. Calculate effective attack reach based on technique and stance
   * 2. Broad-phase: Check if defender is within reach
   * 3. Broad-phase: Check if target region's AABB is within reach
   * 4. Narrow-phase: Raycast to find precise vital point hit
   * 
   * @param attackerPosition - 3D position of the attacker
   * @param defenderPosition - 3D position of the defender
   * @param technique - Technique being used with type information
   * @param attackerStance - Attacker's current trigram stance
   * @param targetRegion - Anatomical region being targeted
   * @returns Collision result with hit status, vital point, distance, and accuracy
   * 
   * @example
   * ```typescript
   * const result = collision.checkAttackHit(
   *   { x: 0, y: 0, z: 5 },
   *   { x: 0, y: 0, z: 6 },
   *   { type: "punch" },
   *   TrigramStance.GEON,
   *   "head"
   * );
   * ```
   * 
   * @public
   * @korean 공격타격확인
   */
  checkAttackHit(
    attackerPosition: Position3D,
    defenderPosition: Position3D,
    technique: { type?: string; [key: string]: any },
    attackerStance: TrigramStance,
    targetRegion: AnatomicalRegionPhysics
  ): CollisionResult {
    // Calculate effective attack reach
    const techniqueType = this.parseTechniqueType(technique.type);
    const attackReach = this.calculateAttackReach(techniqueType, attackerStance);
    
    // Calculate distance between attacker and defender
    const distance = this.calculateDistance3D(attackerPosition, defenderPosition);
    
    // Broad-phase: Check if defender is within reach
    if (distance > attackReach.effectiveReach) {
      return {
        hit: false,
        distance,
        accuracy: 0,
      };
    }
    
    // Get target region bounding box
    const targetBox = this.boundingBoxes.get(targetRegion);
    if (!targetBox) {
      return {
        hit: false,
        distance,
        accuracy: 0,
      };
    }
    
    // Narrow-phase: Raycast from attacker to target region
    const attackDirection = this.normalizeVector3D(
      this.subtractVectors3D(defenderPosition, attackerPosition)
    );
    
    const raycastQuery: RaycastQuery = {
      origin: attackerPosition,
      direction: attackDirection,
      maxDistance: attackReach.effectiveReach,
      targetRegion,
    };
    
    // Check intersection with target bounding box
    const intersection = this.raycastBoundingBox(raycastQuery, targetBox, defenderPosition);
    
    if (!intersection) {
      return {
        hit: false,
        distance,
        accuracy: 0,
      };
    }
    
    // Determine specific vital point within region
    const vitalPoint = this.identifyVitalPoint(
      targetRegion,
      intersection.point,
      defenderPosition
    );
    
    if (!vitalPoint) {
      return {
        hit: false,
        distance,
        accuracy: 0,
      };
    }
    
    // Calculate accuracy (how close to vital point center)
    const accuracy = this.calculateHitAccuracy(intersection.point, vitalPoint, defenderPosition);
    
    return {
      hit: true,
      region: targetRegion,
      vitalPoint,
      distance,
      accuracy,
      hitPoint: intersection.point,
    };
  }

  /**
   * Calculates effective attack reach for a technique.
   * 
   * **Korean**: 공격 범위 계산
   * 
   * Applies stance modifiers to base technique reach.
   * 
   * @param techniqueType - Type of technique
   * @param stance - Current trigram stance
   * @returns Attack reach with all modifiers applied
   * 
   * @private
   * @korean 공격범위계산
   */
  private calculateAttackReach(
    techniqueType: TechniqueType,
    stance: TrigramStance
  ): {
    technique: TechniqueType;
    baseReach: number;
    stance: TrigramStance;
    stanceModifier: number;
    effectiveReach: number;
  } {
    // Use BASE_REACH constant from physics types
    const baseReach = BASE_REACH[techniqueType];
    
    // Use STANCE_REACH_MODIFIERS constant from physics types
    const stanceModifier = STANCE_REACH_MODIFIERS[stance];
    const effectiveReach = baseReach * stanceModifier;
    
    return {
      technique: techniqueType,
      baseReach,
      stance,
      stanceModifier,
      effectiveReach,
    };
  }

  /**
   * Performs raycasting against a bounding box.
   * 
   * **Korean**: 경계 상자 광선 투사
   * 
   * Uses cached geometries from object pool to avoid repeated allocations
   * during combat. Creates a Three.js mesh for the bounding box and performs
   * raycasting to detect intersection points.
   * 
   * @param query - Raycast query parameters
   * @param box - Bounding box to test
   * @param defenderPosition - Position of the defender
   * @returns Intersection point or null if no hit
   * 
   * @private
   * @korean 경계상자광선투사
   */
  private raycastBoundingBox(
    query: RaycastQuery,
    box: BoundingBox,
    defenderPosition: Position3D
  ): { point: Position3D } | null {
    // Get cached geometry from pool to avoid repeated allocations
    const cacheKey = `${box.type}-${box.region}`;
    let geometry = this.geometryCache.get(cacheKey);
    
    // If not cached (shouldn't happen after initialization), create it
    if (!geometry) {
      geometry = this.createGeometryForBox(box);
      this.geometryCache.set(cacheKey, geometry);
    }
    
    // Create temporary mesh for raycasting (mesh is lightweight, geometry is cached)
    const mesh = new THREE.Mesh(geometry);
    mesh.position.set(
      defenderPosition.x + box.center.x,
      defenderPosition.y + box.center.y,
      defenderPosition.z + box.center.z
    );
    
    // Setup raycaster
    this.raycaster.set(
      new THREE.Vector3(query.origin.x, query.origin.y, query.origin.z),
      new THREE.Vector3(query.direction.x, query.direction.y, query.direction.z)
    );
    this.raycaster.far = query.maxDistance;
    
    // Perform raycast
    const intersections = this.raycaster.intersectObject(mesh);
    
    // Clean up temporary mesh (geometry remains cached)
    // Note: mesh.material is undefined, no need to dispose
    
    if (intersections.length > 0) {
      const point = intersections[0].point;
      return {
        point: { x: point.x, y: point.y, z: point.z },
      };
    }
    
    return null;
  }
  
  /**
   * Creates Three.js geometry for a bounding box.
   * 
   * Helper method for geometry cache initialization.
   * 
   * @param box - Bounding box specification
   * @returns Three.js geometry
   * 
   * @private
   * @korean 경계상자지오메트리생성
   */
  private createGeometryForBox(box: BoundingBox): THREE.BufferGeometry {
    switch (box.type) {
      case "sphere":
        return new THREE.SphereGeometry(box.dimensions.x, 8, 8);
      case "box":
        return new THREE.BoxGeometry(
          box.dimensions.x,
          box.dimensions.y,
          box.dimensions.z
        );
      case "capsule":
        return new THREE.CapsuleGeometry(
          box.dimensions.x,
          box.dimensions.y,
          4,
          8
        );
    }
  }

  /**
   * Identifies the specific vital point hit within a region.
   * 
   * **Korean**: 급소 식별
   * 
   * Finds the closest vital point to the hit location within the targeted region.
   * 
   * @param region - Anatomical region hit
   * @param hitPoint - 3D point where attack intersected
   * @param defenderPosition - Position of the defender
   * @returns Closest vital point or null if none found
   * 
   * @private
   * @korean 급소식별
   */
  private identifyVitalPoint(
    region: AnatomicalRegionPhysics,
    hitPoint: Position3D,
    defenderPosition: Position3D
  ): VitalPoint | null {
    // Get all vital points for this region
    const vitalPoints = this.vitalPointsByRegion.get(region);
    if (!vitalPoints || vitalPoints.length === 0) {
      return null;
    }
    
    // Find closest vital point to hit location
    let closestPoint: VitalPoint | null = null;
    let minDistance = Infinity;
    
    for (const vp of vitalPoints) {
      // TODO: Convert 2D vital point position to 3D world position
      // Current limitation: Vital points use 2D pixel coordinates (e.g., x: 100, y: 50)
      // but we need 3D meter coordinates (e.g., x: 0, y: 1.7, z: 0).
      // This temporary implementation will produce incorrect positions.
      // A proper 2D→3D coordinate mapper is needed.
      const vpWorldPos: Position3D = {
        x: defenderPosition.x + vp.position.x / 1000, // Convert pixels to meters (rough approximation)
        y: defenderPosition.y + vp.position.y / 1000, // Convert pixels to meters (rough approximation)
        z: defenderPosition.z,
      };
      
      const distance = this.calculateDistance3D(hitPoint, vpWorldPos);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = vp;
      }
    }
    
    return closestPoint;
  }

  /**
   * Calculates hit accuracy based on distance to vital point center.
   * 
   * **Korean**: 타격 정확도 계산
   * 
   * Accuracy decreases linearly with distance from vital point center.
   * Perfect accuracy (1.0) at center, decreasing to 0 at 5cm radius.
   * 
   * @param hitPoint - Point where attack landed
   * @param vitalPoint - Target vital point
   * @param defenderPosition - Position of the defender
   * @returns Accuracy value from 0 to 1
   * 
   * @private
   * @korean 타격정확도계산
   */
  private calculateHitAccuracy(
    hitPoint: Position3D,
    vitalPoint: VitalPoint,
    defenderPosition: Position3D
  ): number {
    // TODO: Convert 2D vital point position to 3D world position
    // Current limitation: Vital points use 2D pixel coordinates (e.g., x: 100, y: 50)
    // but we need 3D meter coordinates (e.g., x: 0, y: 1.7, z: 0).
    // This temporary implementation will produce incorrect accuracy calculations.
    // A proper 2D→3D coordinate mapper is needed.
    const vpWorldPos: Position3D = {
      x: defenderPosition.x + vitalPoint.position.x / 1000, // Convert pixels to meters (rough approximation)
      y: defenderPosition.y + vitalPoint.position.y / 1000, // Convert pixels to meters (rough approximation)
      z: defenderPosition.z,
    };
    
    const distance = this.calculateDistance3D(hitPoint, vpWorldPos);
    const maxAccuracyDistance = 0.05; // 5cm radius for perfect hit
    
    // Accuracy decreases linearly with distance
    const accuracy = Math.max(0, 1 - distance / maxAccuracyDistance);
    
    return accuracy;
  }

  /**
   * Calculates Euclidean distance between two 3D points.
   * 
   * @param pos1 - First position
   * @param pos2 - Second position
   * @returns Distance in meters
   * 
   * @private
   * @korean 3D거리계산
   */
  private calculateDistance3D(pos1: Position3D, pos2: Position3D): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Subtracts one 3D vector from another.
   * 
   * @param v1 - First vector
   * @param v2 - Second vector
   * @returns Resulting vector
   * 
   * @private
   * @korean 벡터빼기
   */
  private subtractVectors3D(v1: Position3D, v2: Position3D): Position3D {
    return {
      x: v1.x - v2.x,
      y: v1.y - v2.y,
      z: v1.z - v2.z,
    };
  }

  /**
   * Normalizes a 3D vector to unit length.
   * 
   * @param vec - Vector to normalize
   * @returns Normalized vector
   * 
   * @private
   * @korean 벡터정규화
   */
  private normalizeVector3D(vec: Position3D): Position3D {
    const length = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
    if (length === 0) {
      return { x: 0, y: 0, z: 1 }; // Default forward direction
    }
    return {
      x: vec.x / length,
      y: vec.y / length,
      z: vec.z / length,
    };
  }

  /**
   * Parses technique type from string.
   * 
   * @param techniqueTypeStr - Technique type as string
   * @returns Parsed technique type
   * 
   * @private
   * @korean 기술유형파싱
   */
  private parseTechniqueType(techniqueTypeStr?: string): TechniqueType {
    const typeMap: Record<string, TechniqueType> = {
      punch: "punch",
      kick: "kick",
      elbow: "elbow",
      knee: "knee",
      pressure_point: "pressure_point",
      strike: "punch", // Default strike to punch
    };
    
    return typeMap[techniqueTypeStr || "punch"] || "punch";
  }

  /**
   * Initializes bounding boxes for all anatomical regions.
   * 
   * Creates collision volumes for the 5 anatomical regions using the
   * ANATOMICAL_DIMENSIONS constants from the physics types module.
   * 
   * @private
   * @korean 경계상자초기화
   */
  private initializeBoundingBoxes(): void {
    // Head: Sphere (from ANATOMICAL_DIMENSIONS)
    this.boundingBoxes.set("head", {
      type: ANATOMICAL_DIMENSIONS.head.type,
      center: ANATOMICAL_DIMENSIONS.head.center,
      dimensions: { 
        x: ANATOMICAL_DIMENSIONS.head.radius, 
        y: 0, 
        z: 0 
      }, // radius only
      region: "head",
    });
    
    // Neck: Capsule (from ANATOMICAL_DIMENSIONS)
    this.boundingBoxes.set("neck", {
      type: ANATOMICAL_DIMENSIONS.neck.type,
      center: ANATOMICAL_DIMENSIONS.neck.center,
      dimensions: { 
        x: ANATOMICAL_DIMENSIONS.neck.radius, 
        y: ANATOMICAL_DIMENSIONS.neck.height, 
        z: 0 
      }, // radius and height
      region: "neck",
    });
    
    // Torso: Box (from ANATOMICAL_DIMENSIONS)
    this.boundingBoxes.set("torso", {
      type: ANATOMICAL_DIMENSIONS.torso.type,
      center: ANATOMICAL_DIMENSIONS.torso.center,
      dimensions: { 
        x: ANATOMICAL_DIMENSIONS.torso.width, 
        y: ANATOMICAL_DIMENSIONS.torso.height, 
        z: ANATOMICAL_DIMENSIONS.torso.depth 
      }, // width, height, depth
      region: "torso",
    });
    
    // Arms: Capsules (from ANATOMICAL_DIMENSIONS)
    this.boundingBoxes.set("arms", {
      type: ANATOMICAL_DIMENSIONS.arms.type,
      center: ANATOMICAL_DIMENSIONS.arms.center,
      dimensions: { 
        x: ANATOMICAL_DIMENSIONS.arms.radius, 
        y: ANATOMICAL_DIMENSIONS.arms.height, 
        z: 0 
      }, // radius and length
      region: "arms",
    });
    
    // Legs: Capsules (from ANATOMICAL_DIMENSIONS)
    this.boundingBoxes.set("legs", {
      type: ANATOMICAL_DIMENSIONS.legs.type,
      center: ANATOMICAL_DIMENSIONS.legs.center,
      dimensions: { 
        x: ANATOMICAL_DIMENSIONS.legs.radius, 
        y: ANATOMICAL_DIMENSIONS.legs.height, 
        z: 0 
      }, // radius and length
      region: "legs",
    });
  }
  
  /**
   * Initializes geometry cache for object pooling.
   * 
   * Pre-creates all geometries needed for raycasting to avoid repeated
   * allocations during combat. Critical for maintaining 60fps with up to
   * 100 collision checks per frame.
   * 
   * @private
   * @korean 지오메트리캐시초기화
   */
  private initializeGeometryCache(): void {
    // Pre-create and cache geometries for all bounding boxes
    for (const [_region, box] of this.boundingBoxes.entries()) {
      const cacheKey = `${box.type}-${box.region}`;
      const geometry = this.createGeometryForBox(box);
      this.geometryCache.set(cacheKey, geometry);
    }
  }

  /**
   * Organizes vital points by anatomical region for efficient lookup.
   * 
   * NOTE: This categorization currently uses y-coordinate thresholds that assume
   * positions are in meters. However, VITAL_POINTS_DATA uses pixel coordinates
   * (e.g., y: 50), which will cause incorrect categorization. Most vital points
   * will end up in the "legs" region since pixel y-coordinates are typically less
   * than 0.8.
   * 
   * TODO: After implementing 2D→3D coordinate mapping, update this method to use
   * the converted 3D positions, or use the anatomical region data that may already
   * exist in the vital points data structure.
   * 
   * Categorizes the 70 vital points into their respective regions:
   * - Head: 10 vital points
   * - Neck: 8 vital points
   * - Torso: 20 vital points
   * - Arms: 16 vital points
   * - Legs: 16 vital points
   * 
   * @private
   * @korean 급소영역별정리
   */
  private organizeVitalPointsByRegion(): void {
    const regionMap: Map<AnatomicalRegionPhysics, VitalPoint[]> = new Map([
      ["head", []],
      ["neck", []],
      ["torso", []],
      ["arms", []],
      ["legs", []],
    ]);
    
    // Organize vital points by region based on position
    // NOTE: This logic is temporarily disabled due to coordinate system mismatch
    // Vital points use pixel coordinates but thresholds assume meters
    for (const vp of VITAL_POINTS_DATA) {
      const x = vp.position.x / 1000; // Rough conversion from pixels to meters
      const y = vp.position.y / 1000; // Rough conversion from pixels to meters
      
      // Categorize by position: check x-coordinate first for arms/legs distinction
      // to avoid overlap with torso y-range
      let region: AnatomicalRegionPhysics;
      
      if (y >= 1.6) {
        // Head region (top of body)
        region = "head";
      } else if (y >= 1.4 && y < 1.6) {
        // Neck region
        region = "neck";
      } else if (y >= 0.8 && y < 1.4) {
        // Mid-body: distinguish between torso and arms by x-coordinate
        if (Math.abs(x) > 0.2) {
          region = "arms"; // Lateral position indicates arms
        } else {
          region = "torso"; // Central position indicates torso
        }
      } else {
        // Lower body: distinguish between torso (if upper) and legs
        if (y >= 0.6 && Math.abs(x) < 0.15) {
          region = "torso"; // Lower torso
        } else {
          region = "legs";
        }
      }
      
      const list = regionMap.get(region);
      if (list) {
        list.push(vp);
      }
    }
    
    this.vitalPointsByRegion = regionMap;
  }

  /**
   * Gets the bounding box for an anatomical region.
   * 
   * @param region - Anatomical region
   * @returns Bounding box or undefined if not found
   * 
   * @public
   * @korean 경계상자조회
   */
  getBoundingBox(region: AnatomicalRegionPhysics): BoundingBox | undefined {
    return this.boundingBoxes.get(region);
  }

  /**
   * Gets all bounding boxes.
   * 
   * @returns Map of all bounding boxes by region
   * 
   * @public
   * @korean 모든경계상자조회
   */
  getAllBoundingBoxes(): ReadonlyMap<AnatomicalRegionPhysics, BoundingBox> {
    return this.boundingBoxes;
  }

  /**
   * Gets vital points for a specific region.
   * 
   * @param region - Anatomical region
   * @returns Array of vital points in that region
   * 
   * @public
   * @korean 영역별급소조회
   */
  getVitalPointsInRegion(region: AnatomicalRegionPhysics): readonly VitalPoint[] {
    return this.vitalPointsByRegion.get(region) || [];
  }
}

export default CollisionDetection;
