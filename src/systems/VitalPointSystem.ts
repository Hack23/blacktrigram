/**
 * System for managing Korean martial arts vital point (급소) targeting and damage calculation.
 * 
 * **Korean**: 급소 시스템 (Vital Point System)
 * 
 * The VitalPointSystem implements anatomical targeting mechanics based on traditional
 * Korean martial arts knowledge of 70 vital points (급소). It handles hit detection,
 * damage calculation, and status effect application for precise strikes.
 * 
 * ## Vital Point Philosophy
 * 
 * Korean martial arts identify specific anatomical locations that, when struck precisely,
 * can cause disproportionate effects. The system categorizes points by:
 * 
 * - **Location**: Head, neck, torso, limbs, and core
 * - **Category**: Neurological, vascular, respiratory, muscular, skeletal, etc.
 * - **Severity**: Minor, moderate, major, critical, lethal
 * - **Effects**: Unconsciousness, paralysis, pain, stunning, etc.
 * 
 * ## Meridian Integration (경락 통합)
 * 
 * The system integrates Traditional Korean Medicine (TKM) meridian theory:
 * - **Time-of-Day Flow**: +30% effectiveness at meridian peak hours
 * - **Meridian Disruption**: Status effects from energy flow blockage
 * - **Elemental Relationships**: 五行 (Wu Xing) elemental advantages
 * 
 * ## Key Features
 * 
 * - Distance-based hit detection with accuracy falloff
 * - Severity multipliers for damage calculation
 * - Targeted vs. proximity-based strikes
 * - Bilingual Korean-English vital point names
 * - Realistic anatomical positioning
 * - Meridian state tracking and flow calculation
 * 
 * @example
 * ```typescript
 * const vitalPointSystem = new VitalPointSystem();
 * 
 * // Process a strike at specific position with time-of-day
 * const result = vitalPointSystem.processHit(
 *   { x: 100, y: 50 }, // Target position
 *   { width: 10, height: 10 }, // Hit box
 *   "GB-20", // Optional: target specific vital point
 *   14 // Optional: hour of day for meridian flow
 * );
 * 
 * if (result.hit && result.vitalPointHit) {
 *   console.log(`Hit ${result.vitalPointHit.names.english}!`);
 *   console.log(`Damage: ${result.damage}, Severity: ${result.severity}`);
 *   console.log(`Meridian bonus: ${result.meridianMultiplier}x`);
 * }
 * ```
 * 
 * @public
 * @category Vital Point System
 * @korean 급소시스템
 */
import { Position, VitalPointSeverity } from "../types/common";
import { VitalPoint, VitalPointHitResult } from "./vitalpoint/types";
import { VITAL_POINTS_DATA } from "./vitalpoint/VitalPointsData";
import { 
  calculateMeridianFlow, 
  generateMeridianEffects 
} from "./vitalpoint/KoreanAnatomy";
import { getMeridiansForVitalPoint } from "./vitalpoint/MeridianVitalPointMapping";
import { StatusEffect } from "./types";

export class VitalPointSystem {
  private vitalPoints: VitalPoint[] = [];
  private meridianStates: Map<string, number> = new Map(); // Tracks disruption level per meridian
  private currentHour: number = 12; // Default to noon

  /**
   * Creates a new VitalPointSystem instance.
   * 
   * Initializes the system with comprehensive Korean vital points database
   * and meridian state tracking.
   * 
   * @param initialHour - Optional initial hour of day (0-23) for meridian flow calculations
   */
  constructor(initialHour: number = 12) {
    // Initialize with comprehensive Korean vital points database
    this.initializeVitalPoints();
    this.currentHour = initialHour;
  }

  /**
   * Sets the current hour of day for meridian flow calculations.
   * 
   * **Korean**: 시간 설정
   * 
   * @param hour - Hour of day (0-23)
   * 
   * @example
   * ```typescript
   * vitalPointSystem.setCurrentHour(20); // 8 PM - Pericardium peak time
   * ```
   * 
   * @public
   * @korean 시간설정
   */
  setCurrentHour(hour: number): void {
    this.currentHour = Math.max(0, Math.min(23, Math.floor(hour)));
  }

  /**
   * Gets the current hour of day used for meridian calculations.
   * 
   * **Korean**: 현재 시간 조회
   * 
   * @returns Current hour (0-23)
   * 
   * @public
   * @korean 시간조회
   */
  getCurrentHour(): number {
    return this.currentHour;
  }

  /**
   * Updates meridian disruption state for a specific meridian.
   * 
   * **Korean**: 경락 차단 상태 업데이트
   * 
   * @param meridianId - ID of the meridian
   * @param disruptionLevel - Disruption level (0-1, where 1 is fully blocked)
   * 
   * @public
   * @korean 경락차단업데이트
   */
  setMeridianDisruption(meridianId: string, disruptionLevel: number): void {
    this.meridianStates.set(meridianId, Math.max(0, Math.min(1, disruptionLevel)));
  }

  /**
   * Gets the current disruption level for a meridian.
   * 
   * **Korean**: 경락 차단 수준 조회
   * 
   * @param meridianId - ID of the meridian
   * @returns Disruption level (0-1)
   * 
   * @public
   * @korean 경락차단조회
   */
  getMeridianDisruption(meridianId: string): number {
    return this.meridianStates.get(meridianId) ?? 0;
  }

  /**
   * Clears all meridian disruption states (e.g., after rest or healing).
   * 
   * **Korean**: 경락 상태 초기화
   * 
   * @public
   * @korean 경락초기화
   */
  clearMeridianDisruptions(): void {
    this.meridianStates.clear();
  }

  /**
   * Processes a hit at a specific position to determine vital point impact.
   * 
   * Evaluates whether a strike lands on or near a vital point, calculating
   * damage and effects based on accuracy, severity, and meridian flow.
   * Supports both targeted strikes (specific vital point ID) and proximity-based detection.
   * 
   * ## Hit Detection Algorithm
   * 
   * 1. If targetedVitalPointId provided, validate that specific point
   * 2. Otherwise, find closest vital point to target position
   * 3. Calculate distance from strike to vital point
   * 4. Apply accuracy falloff based on distance (max 50px)
   * 5. Calculate meridian flow bonus based on time of day
   * 6. Apply meridian disruption if applicable
   * 7. Return hit result with damage multipliers and effects
   * 
   * @param targetPosition - Position where strike lands
   * @param _hitBox - Size of hit box (currently unused, reserved for future)
   * @param targetedVitalPointId - Optional specific vital point being targeted
   * @param hour - Optional hour of day (0-23) for meridian flow calculation
   * @returns Hit result with damage, effects, severity, and meridian multiplier
   * 
   * @example
   * ```typescript
   * // Proximity-based strike
   * const result1 = vitalPointSystem.processHit(
   *   { x: 100, y: 50 },
   *   { width: 10, height: 10 }
   * );
   * 
   * // Targeted strike at temple (태양혈) at 2 AM (Liver peak time)
   * const result2 = vitalPointSystem.processHit(
   *   { x: 100, y: 50 },
   *   { width: 10, height: 10 },
   *   "head_temple",
   *   2 // Liver meridian peak hour
   * );
   * 
   * if (result2.meridianMultiplier && result2.meridianMultiplier > 1.0) {
   *   console.log("Peak meridian hour bonus applied!");
   * }
   * ```
   * 
   * @public
   * @korean 타격처리
   */
  processHit(
    targetPosition: Position,
    _hitBox: { width: number; height: number }, // Prefixed with underscore to indicate intentionally unused
    targetedVitalPointId?: string | null,
    hour?: number
  ): VitalPointHitResult & { 
    meridianMultiplier?: number; 
    meridianEffects?: readonly StatusEffect[];
  } {
    // Use provided hour or current system hour
    const effectiveHour = hour ?? this.currentHour;

    // If a specific vital point is targeted, check that one
    if (targetedVitalPointId) {
      const targetVitalPoint = this.getVitalPointById(targetedVitalPointId);
      if (targetVitalPoint) {
        return this.calculateVitalPointHit(targetVitalPoint, targetPosition, effectiveHour);
      }
    }

    // Otherwise, find the closest vital point
    const closestVitalPoint = this.findClosestVitalPoint(targetPosition);
    if (!closestVitalPoint) {
      return {
        hit: false,
        damage: 0,
        effects: [],
        severity: VitalPointSeverity.MINOR,
      };
    }

    // Calculate distance to determine hit accuracy
    const distance = this.calculateDistance(
      targetPosition,
      closestVitalPoint.position
    );
    const maxHitDistance = 50; // pixels

    if (distance <= maxHitDistance) {
      return this.calculateVitalPointHit(closestVitalPoint, targetPosition, effectiveHour);
    }

    return {
      hit: false,
      damage: 0,
      effects: [],
      severity: VitalPointSeverity.MINOR,
    };
  }

  /**
   * Retrieves a vital point by its unique identifier.
   * 
   * @param id - Vital point identifier (e.g., "GB-20", "head_temple")
   * @returns Vital point if found, null otherwise
   * 
   * @example
   * ```typescript
   * const temple = vitalPointSystem.getVitalPointById("head_temple");
   * if (temple) {
   *   console.log(temple.names.korean); // "태양혈"
   * }
   * ```
   * 
   * @public
   * @korean 급소조회
   */
  getVitalPointById(id: string): VitalPoint | null {
    return this.vitalPoints.find((vp) => vp.id === id) || null;
  }

  /**
   * Gets all registered vital points in the system.
   * 
   * @returns Read-only array of all vital points
   * 
   * @example
   * ```typescript
   * const allPoints = vitalPointSystem.getVitalPoints();
   * console.log(`${allPoints.length} vital points registered`);
   * ```
   * 
   * @public
   * @korean 급소목록조회
   */
  getVitalPoints(): readonly VitalPoint[] {
    return this.vitalPoints;
  }

  /**
   * Calculates hit result for a technique-based attack.
   * 
   * Determines whether a technique successfully lands on a vital point,
   * factoring in technique accuracy, attacker position, and randomness.
   * Used for AI and player technique execution.
   * 
   * @param technique - Technique being executed with accuracy property
   * @param attackerPosition - Position where attack originates
   * @param _defenderPosition - Defender position (reserved for future use)
   * @param _defenderStance - Defender stance (reserved for future use)
   * @returns Hit result with damage and effects
   * 
   * @example
   * ```typescript
   * const technique = {
   *   id: "geon-thunder-strike",
   *   accuracy: 0.85
   * };
   * 
   * const result = vitalPointSystem.calculateHit(
   *   technique,
   *   { x: 100, y: 50 },
   *   { x: 120, y: 50 },
   *   TrigramStance.GEON
   * );
   * ```
   * 
   * @public
   * @korean 기술타격계산
   */
  calculateHit(
    technique: any,
    attackerPosition: Position,
    _defenderPosition: Position, // Prefixed with underscore to indicate intentionally unused
    _defenderStance: any // Prefixed with underscore to indicate intentionally unused
  ): VitalPointHitResult {
    // Find closest vital point to attack
    const closestVitalPoint = this.findClosestVitalPoint(attackerPosition);

    if (!closestVitalPoint) {
      return {
        hit: false,
        damage: 0,
        effects: [],
        severity: VitalPointSeverity.MINOR,
      };
    }

    // Calculate hit based on technique accuracy and distance
    const distance = this.calculateDistance(
      attackerPosition,
      closestVitalPoint.position
    );
    const hitChance = technique.accuracy * (1 - distance / 100);

    if (Math.random() < hitChance) {
      return {
        hit: true,
        vitalPointHit: closestVitalPoint,
        damage: this.calculateBaseDamage(closestVitalPoint, distance),
        effects: [],
        severity: closestVitalPoint.severity,
      };
    }

    return {
      hit: false,
      damage: 0,
      effects: [],
      severity: VitalPointSeverity.MINOR,
    };
  }

  /**
   * Finds the closest vital point to a given position.
   * 
   * Uses Euclidean distance to determine proximity.
   * 
   * @param position - Target position
   * @returns Closest vital point or null if none registered
   * 
   * @private
   * @korean 최근접급소검색
   */
  private findClosestVitalPoint(position: Position): VitalPoint | null {
    if (this.vitalPoints.length === 0) return null;

    let closest = this.vitalPoints[0];
    let minDistance = this.calculateDistance(position, closest.position);

    for (const vitalPoint of this.vitalPoints) {
      const distance = this.calculateDistance(position, vitalPoint.position);
      if (distance < minDistance) {
        minDistance = distance;
        closest = vitalPoint;
      }
    }

    return closest;
  }

  /**
   * Calculates Euclidean distance between two positions.
   * 
   * @param pos1 - First position
   * @param pos2 - Second position
   * @returns Distance in pixels
   * 
   * @private
   * @korean 거리계산
   */
  private calculateDistance(pos1: Position, pos2: Position): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculates vital point hit result with accuracy, damage, and meridian effects.
   * 
   * **Korean**: 급소타격결과계산
   * 
   * @param vitalPoint - Vital point being struck
   * @param hitPosition - Exact position of strike
   * @param hour - Hour of day for meridian flow calculation
   * @returns Hit result with calculated damage, accuracy, and meridian bonuses
   * 
   * @private
   * @korean 급소타격결과계산
   */
  private calculateVitalPointHit(
    vitalPoint: VitalPoint,
    hitPosition: Position,
    hour: number
  ): VitalPointHitResult & { 
    meridianMultiplier?: number; 
    meridianEffects?: readonly StatusEffect[];
  } {
    const distance = this.calculateDistance(hitPosition, vitalPoint.position);
    const baseDamage = this.calculateBaseDamage(vitalPoint, distance);

    // Get meridians for this vital point
    const meridians = getMeridiansForVitalPoint(vitalPoint.id);
    
    // Calculate meridian flow effectiveness (highest value if multiple meridians)
    let meridianMultiplier = 1.0;
    const allMeridianEffects: StatusEffect[] = [];
    
    if (meridians.length > 0) {
      // Use the best meridian flow multiplier
      meridianMultiplier = Math.max(
        ...meridians.map(meridianId => calculateMeridianFlow(meridianId, hour))
      );

      // Generate meridian disruption effects for each affected meridian
      meridians.forEach(meridianId => {
        const currentDisruption = this.getMeridianDisruption(meridianId);
        const newDisruption = Math.min(1.0, currentDisruption + 0.15); // Add 15% disruption per hit
        this.setMeridianDisruption(meridianId, newDisruption);

        // Generate effects if disruption is significant
        const effects = generateMeridianEffects(meridianId, newDisruption);
        allMeridianEffects.push(...effects);
      });
    }

    // Apply meridian multiplier to damage
    const finalDamage = Math.floor(baseDamage * meridianMultiplier);

    // Convert VitalPointEffect to StatusEffect
    const now = Date.now();
    const vitalPointStatusEffects: StatusEffect[] = vitalPoint.effects.map(effect => ({
      id: effect.id,
      type: effect.type,
      intensity: effect.intensity,
      duration: effect.duration,
      description: effect.description,
      stackable: effect.stackable,
      source: effect.source ?? "vital_point_system",
      startTime: now,
      endTime: now + effect.duration,
    }));

    // Combine vital point effects with meridian effects
    const combinedEffects = [
      ...vitalPointStatusEffects,
      ...allMeridianEffects,
    ];

    return {
      hit: true,
      vitalPointHit: vitalPoint,
      damage: finalDamage,
      effects: combinedEffects,
      severity: vitalPoint.severity,
      accuracy: Math.max(0, 1 - distance / 50),
      meridianMultiplier,
      meridianEffects: allMeridianEffects,
    };
  }

  /**
   * Calculates base damage for a vital point strike.
   * 
   * Applies distance-based falloff to vital point's base damage value.
   * Closer strikes deal more damage up to maximum base damage.
   * 
   * @param vitalPoint - Vital point with base damage property
   * @param distance - Distance from strike to vital point center
   * @returns Calculated damage value
   * 
   * @private
   * @korean 기본피해계산
   */
  private calculateBaseDamage(
    vitalPoint: VitalPoint,
    distance: number
  ): number {
    const baseDamage = vitalPoint.baseDamage || 10;
    const distanceModifier = Math.max(0.1, 1 - distance / 100);
    return Math.floor(baseDamage * distanceModifier);
  }

  /**
   * Initializes the system with comprehensive Korean vital points.
   * 
   * Loads all 70 Korean vital points from the comprehensive database
   * covering head, torso, arms, and legs with proper categorization.
   * 
   * @private
   * @korean 급소초기화
   */
  private initializeVitalPoints(): void {
    // Load all 70 vital points from the comprehensive database
    this.vitalPoints = [...VITAL_POINTS_DATA];
  }
}

export default VitalPointSystem;
