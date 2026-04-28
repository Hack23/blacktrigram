/**
 * Injury Tracking System
 * 
 * **Korean**: 부상 추적 시스템
 * 
 * Tracks individual injuries on character models for realistic trauma visualization.
 * Records injury location, type, severity, and timestamp for progressive bruising,
 * cuts, and bleeding effects during combat.
 * 
 * ## Features
 * 
 * - Track injuries by body part and 3D position
 * - Progressive bruising: Multiple hits to same location darken existing bruises
 * - Color-coded severity (getBruiseColor): Yellow (fresh), Purple (moderate), Dark red (severe)
 * - Note: TraumaOverlay3D uses different progression: Dark red → Indigo → Black
 * - Blood effects triggered when damage > 30 in single hit
 * - Injury persistence across combat rounds
 * - Nearby injury lookup using linear scan over tracked injuries (O(n))
 * 
 * @module systems/bodypart/InjuryTracker
 * @category Body Part System
 * @korean 부상추적시스템
 */

import * as THREE from "three";
import { BodyPart } from "./types";
import { InjuryType } from "../../types/injury";
import { BodyRegion } from "../../types/common";

/**
 * Individual injury location data.
 * 
 * **Korean**: 부상 위치 데이터
 * 
 * Records a single injury with its location, severity, and cumulative hit count.
 * Used for progressive bruising visualization.
 * 
 * @public
 * @category Injury Tracking
 * @korean 부상위치
 */
export interface InjuryLocation {
  /** Unique identifier */
  readonly id: string;
  /** Body part affected */
  readonly bodyPart: BodyPart;
  /** Body region for hit detection */
  readonly bodyRegion: BodyRegion;
  /** 3D position relative to character center */
  readonly position: THREE.Vector3;
  /** Damage severity (0-100) */
  readonly severity: number;
  /** Number of hits to this location (for progressive bruising) */
  readonly hitCount: number;
  /** Timestamp when injury occurred */
  readonly timestamp: number;
  /** Injury type */
  readonly type: InjuryType;
}

/**
 * Configuration for injury tracking behavior.
 * 
 * @public
 * @category Injury Tracking
 */
export interface InjuryTrackerConfig {
  /** Maximum number of injuries to track per character */
  readonly maxInjuries: number;
  /** Distance threshold for considering injuries at same location (in units) */
  readonly sameLocationThreshold: number;
  /** Minimum damage required to create an injury */
  readonly minDamageForInjury: number;
  /** Damage threshold for blood effects */
  readonly bloodEffectThreshold: number;
  /** Time before injuries are removed/expired (milliseconds) */
  readonly injuryExpirationTimeMs: number;
}

/**
 * Default injury tracker configuration.
 * 
 * @public
 */
export const DEFAULT_INJURY_TRACKER_CONFIG: InjuryTrackerConfig = {
  maxInjuries: 50, // Reasonable limit for performance
  sameLocationThreshold: 0.6, // 0.6 units distance (accommodates ±0.15 randomization)
  minDamageForInjury: 5, // Minimum 5 damage to show injury
  bloodEffectThreshold: 30, // Blood effects when damage > 30
  injuryExpirationTimeMs: 30000, // Injuries are removed after 30 seconds
} as const;

/**
 * Injury Tracker System.
 * 
 * **Korean**: 부상 추적 시스템
 * 
 * Manages injury recording and retrieval for trauma visualization.
 * Implements progressive bruising by tracking hit counts at similar locations.
 * 
 * @example
 * ```typescript
 * const tracker = new InjuryTracker();
 * 
 * // Record injury from hit
 * const injury = tracker.recordInjury(
 *   BodyPart.TORSO_UPPER,
 *   BodyRegion.TORSO,
 *   new THREE.Vector3(0, 1.5, 0),
 *   25,
 *   InjuryType.BRUISE
 * );
 * 
 * // Get all injuries for visualization
 * const injuries = tracker.getInjuries();
 * ```
 * 
 * @public
 * @category Body Part System
 */
export class InjuryTracker {
  private injuries: Map<string, InjuryLocation>;
  private config: InjuryTrackerConfig;
  private nextId: number;

  constructor(config: InjuryTrackerConfig = DEFAULT_INJURY_TRACKER_CONFIG) {
    this.injuries = new Map();
    this.config = config;
    this.nextId = 0;
  }

  /**
   * Record a new injury or update existing one at similar location.
   * 
   * **Korean**: 부상 기록
   * 
   * If an injury exists near the hit position, it updates the existing injury
   * with increased severity and hit count (progressive bruising). Otherwise,
   * creates a new injury.
   * 
   * @param bodyPart - Body part affected
   * @param bodyRegion - Body region for damage distribution
   * @param position - 3D position relative to character center
   * @param damage - Damage amount (0-100)
   * @param type - Type of injury
   * @returns The created or updated injury, or null if damage is below threshold
   * 
   * @public
   */
  recordInjury(
    bodyPart: BodyPart,
    bodyRegion: BodyRegion,
    position: THREE.Vector3,
    damage: number,
    type: InjuryType
  ): InjuryLocation | null {
    // Check if damage is significant enough to track
    if (damage < this.config.minDamageForInjury) {
      return null;
    }

    // Find nearby injury at similar location (same body part)
    const existing = this.findNearbyInjury(bodyPart, position, this.config.sameLocationThreshold);

    // Only merge injuries that also match type and body region to avoid
    // incorrectly combining different injury types at the same spot
    const shouldMerge =
      !!existing &&
      existing.type === type &&
      existing.bodyRegion === bodyRegion;

    if (shouldMerge && existing) {
      // Progressive bruising - update existing injury
      const newSeverity = Math.min(100, existing.severity + damage / 2);
      const newHitCount = existing.hitCount + 1;

      const updated: InjuryLocation = {
        ...existing,
        severity: newSeverity,
        hitCount: newHitCount,
        timestamp: Date.now(),
      };

      this.injuries.set(existing.id, updated);
      return updated;
    } else {
      // Create new injury
      const id = `injury-${this.nextId++}`;
      const injury: InjuryLocation = {
        id,
        bodyPart,
        bodyRegion,
        position: position.clone(),
        severity: damage,
        hitCount: 1,
        timestamp: Date.now(),
        type,
      };

      this.injuries.set(id, injury);

      // Enforce max injuries limit
      if (this.injuries.size > this.config.maxInjuries) {
        this.removeOldestInjury();
      }

      return injury;
    }
  }

  /**
   * Find injury near a given position on the same body part.
   * 
   * **Korean**: 인근 부상 찾기
   * 
   * @param bodyPart - Body part to search
   * @param position - Position to search near
   * @param threshold - Distance threshold
   * @returns Nearby injury or null
   * 
   * @public
   */
  findNearbyInjury(
    bodyPart: BodyPart,
    position: THREE.Vector3,
    threshold: number
  ): InjuryLocation | null {
    let closestInjury: InjuryLocation | null = null;
    let closestDistance = threshold;

    for (const injury of this.injuries.values()) {
      if (injury.bodyPart === bodyPart) {
        const distance = injury.position.distanceTo(position);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestInjury = injury;
        }
      }
    }

    return closestInjury;
  }

  /**
   * Get all tracked injuries.
   * 
   * **Korean**: 모든 부상 조회
   * 
   * @returns Array of all injuries
   * 
   * @public
   */
  getInjuries(): InjuryLocation[] {
    return Array.from(this.injuries.values());
  }

  /**
   * Get injuries for a specific body part.
   * 
   * **Korean**: 신체 부위 부상 조회
   * 
   * @param bodyPart - Body part to query
   * @returns Array of injuries on that body part
   * 
   * @public
   */
  getInjuriesByBodyPart(bodyPart: BodyPart): InjuryLocation[] {
    return this.getInjuries().filter((injury) => injury.bodyPart === bodyPart);
  }

  /**
   * Get bruise color based on severity and hit count.
   * 
   * **Korean**: 타박상 색상 가져오기
   * 
   * Progressive color scheme (for reference - TraumaOverlay3D uses its own colors):
   * - Light bruising (severity < 20): Yellow (#ffeb3b)
   * - Moderate bruising (severity < 50): Purple (#9c27b0)
   * - Severe bruising (severity >= 50): Dark red (#b71c1c)
   * 
   * Note: TraumaOverlay3D uses Dark red → Indigo → Black progression.
   * Consider using TraumaOverlay3D's getBruiseColor for consistent visualization.
   * 
   * @param severity - Injury severity (0-100)
   * @param hitCount - Number of hits to same location
   * @returns Hex color string
   * 
   * @public
   */
  getBruiseColor(severity: number, hitCount: number): string {
    // Progressive darkening with hit count (subtract 1 since first hit shouldn't darken)
    const effectiveSeverity = severity + Math.max(0, hitCount - 1) * 10;

    if (effectiveSeverity < 20) {
      return "#ffeb3b"; // Yellow - light bruising
    } else if (effectiveSeverity < 50) {
      return "#9c27b0"; // Purple - moderate bruising
    } else {
      return "#b71c1c"; // Dark red - severe bruising
    }
  }

  /**
   * Check if damage should trigger blood effects.
   * 
   * **Korean**: 출혈 효과 필요 여부 확인
   * 
   * @param damage - Damage amount
   * @returns Whether to show blood effects
   * 
   * @public
   */
  shouldShowBloodEffect(damage: number): boolean {
    return damage > this.config.bloodEffectThreshold;
  }

  /**
   * Remove oldest injury to maintain performance.
   * 
   * @private
   */
  private removeOldestInjury(): void {
    let oldestId: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [id, injury] of this.injuries.entries()) {
      if (injury.timestamp < oldestTimestamp) {
        oldestTimestamp = injury.timestamp;
        oldestId = id;
      }
    }

    if (oldestId) {
      this.injuries.delete(oldestId);
    }
  }

  /**
   * Clear all injuries (for new match/round).
   * 
   * **Korean**: 모든 부상 초기화
   * 
   * @public
   */
  clearInjuries(): void {
    this.injuries.clear();
    this.nextId = 0;
  }

  /**
   * Remove injuries older than expiration time.
   * 
   * **Korean**: 만료된 부상 제거
   * 
   * @public
   */
  removeExpiredInjuries(): void {
    const now = Date.now();
    const expiredIds: string[] = [];

    for (const [id, injury] of this.injuries.entries()) {
      if (now - injury.timestamp > this.config.injuryExpirationTimeMs) {
        expiredIds.push(id);
      }
    }

    for (const id of expiredIds) {
      this.injuries.delete(id);
    }
  }

  /**
   * Get injury count for performance monitoring.
   * 
   * @returns Current number of tracked injuries
   * 
   * @public
   */
  getInjuryCount(): number {
    return this.injuries.size;
  }
}
