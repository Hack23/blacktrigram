// Korean martial arts vital point system

import type { VitalPoint, VitalPointHitResult } from "../types/anatomy";
import type { Position } from "../types/common";
import { VitalPointCategory, VitalPointSeverity } from "../types/enums";
import { KOREAN_VITAL_POINTS } from "./vitalpoint/KoreanVitalPoints";

/**
 * ## Korean Martial Arts Vital Point System
 *
 * **Business Purpose:**
 * Comprehensive vital point (급소) targeting system for Black Trigram that provides:
 * - Anatomically accurate Korean martial arts vital point locations
 * - Traditional Korean medical knowledge integration (한의학)
 * - Realistic damage calculation based on vital point vulnerability
 * - Educational value about Korean martial arts anatomy understanding
 *
 * **Korean Martial Arts Integration:**
 * - Implements traditional Korean vital point knowledge (급소학)
 * - Respects Korean martial arts educational and safety principles
 * - Provides authentic Korean anatomical terminology
 * - Maintains cultural sensitivity in violence representation
 *
 * **Technical Architecture:**
 * - High-performance collision detection for real-time combat
 * - Precise anatomical coordinate mapping system
 * - Configurable difficulty levels for different skill ranges
 * - Integration with Korean medical meridian theory
 *
 * **Safety and Ethics:**
 * - Educational focus on Korean martial arts anatomy knowledge
 * - Realistic consequences to discourage real-world application
 * - Cultural respect for traditional Korean medical wisdom
 * - Clear distinction between game simulation and reality
 *
 * @example
 * ```typescript
 * const vitalSystem = new VitalPointSystem();
 *
 * const hitResult = vitalSystem.checkVitalPointHit(
 *   { x: 150, y: 75 }, // Neck area
 *   8 // Hit precision radius
 * );
 *
 * if (hitResult.isVitalPoint) {
 *   console.log(`급소 타격: ${hitResult.vitalPoint?.korean.korean}`);
 *   console.log(`데미지 배수: ${hitResult.damageMultiplier}x`);
 * }
 * ```
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
export class VitalPointSystem {
  private readonly vitalPoints: readonly VitalPoint[];
  private readonly hitDetectionRadius: number;

  /**
   * **Business Logic:** Initializes Korean martial arts vital point system
   *
   * Loads comprehensive database of Korean martial arts vital points with
   * traditional Korean medical accuracy and modern safety considerations.
   *
   * @param hitDetectionRadius - Default radius for vital point hit detection (pixels)
   */
  constructor(hitDetectionRadius: number = 15) {
    this.vitalPoints = KOREAN_VITAL_POINTS;
    this.hitDetectionRadius = hitDetectionRadius;

    // Validate vital points data integrity
    this.validateVitalPointsData();
  }

  /**
   * **Business Logic:** Detects vital point hits with Korean martial arts precision
   *
   * Performs high-accuracy collision detection to determine if a strike has
   * successfully targeted a vital point. Uses traditional Korean martial arts
   * anatomical knowledge for authentic targeting simulation.
   *
   * @param hitPosition - Screen coordinates of the strike impact
   * @param radius - Hit detection radius (optional, uses default if not provided)
   * @returns Detailed vital point hit analysis with Korean martial arts context
   *
   * @example
   * ```typescript
   * // Check for vital point hit on upper torso
   * const result = vitalSystem.checkVitalPointHit(
   *   { x: 200, y: 150 },
   *   10
   * );
   *
   * if (result.isVitalPoint && result.vitalPoint) {
   *   const koreanName = result.vitalPoint.korean.korean;
   *   const englishName = result.vitalPoint.korean.english;
   *   console.log(`타격 성공: ${koreanName} (${englishName})`);
   *
   *   if (result.vitalPoint.severity === VitalPointSeverity.CRITICAL) {
   *     console.log("위험: 치명적인 급소 타격!");
   *   }
   * }
   * ```
   */
  checkVitalPointHit(
    hitPosition: Position,
    radius: number = this.hitDetectionRadius
  ): VitalPointHitResult {
    // Find the closest vital point within hit radius
    let closestVitalPoint: VitalPoint | null = null;
    let closestDistance = Infinity;

    for (const vitalPoint of this.vitalPoints) {
      const distance = this.calculateDistance(hitPosition, vitalPoint.position);
      const effectiveRadius = radius + vitalPoint.radius;

      if (distance <= effectiveRadius && distance < closestDistance) {
        closestVitalPoint = vitalPoint;
        closestDistance = distance;
      }
    }

    if (!closestVitalPoint) {
      return {
        isVitalPoint: false,
        vitalPoint: null,
        damageMultiplier: 1.0,
        accuracy: 0,
        koreanFeedback: "일반 타격",
        effects: [],
      };
    }

    // Calculate hit accuracy based on precision
    const maxRadius = radius + closestVitalPoint.radius;
    const accuracy = Math.max(0, 1 - closestDistance / maxRadius);

    // Calculate damage multiplier based on vital point severity and accuracy
    const damageMultiplier = this.calculateDamageMultiplier(
      closestVitalPoint,
      accuracy
    );

    // Generate Korean martial arts feedback
    const koreanFeedback = this.generateKoreanVitalPointFeedback(
      closestVitalPoint,
      accuracy
    );

    return {
      isVitalPoint: true,
      vitalPoint: closestVitalPoint,
      damageMultiplier,
      accuracy,
      koreanFeedback,
      effects: closestVitalPoint.effects || [],
      hitLocation: closestVitalPoint.anatomicalName,
      koreanLocation: closestVitalPoint.korean.korean,
    };
  }

  /**
   * **Business Logic:** Calculates damage multiplier for vital point hits
   *
   * Determines damage amplification based on:
   * - Traditional Korean martial arts vital point severity classification
   * - Strike accuracy and precision
   * - Anatomical vulnerability factors
   * - Safety considerations for educational simulation
   *
   * @param vitalPoint - The targeted vital point
   * @param accuracy - Hit accuracy (0.0 to 1.0)
   * @returns Damage multiplier with Korean martial arts authenticity
   *
   * @example
   * ```typescript
   * const multiplier = vitalSystem.calculateDamageMultiplier(
   *   baekhoeholVitalPoint, // Crown point
   *   0.95 // Very accurate hit
   * );
   *
   * console.log(`데미지 배수: ${multiplier}x`);
   * // Output: "데미지 배수: 3.8x" (for critical vital point)
   * ```
   */
  calculateDamageMultiplier(
    vitalPoint: VitalPoint,
    accuracy: number = 1.0
  ): number {
    // Base multiplier based on vital point severity
    let baseMultiplier: number;

    switch (vitalPoint.severity) {
      case VitalPointSeverity.CRITICAL:
        baseMultiplier = 4.0; // 치명적 급소
        break;
      case VitalPointSeverity.MAJOR:
        baseMultiplier = 2.5; // 주요 급소
        break;
      case VitalPointSeverity.MODERATE:
        baseMultiplier = 1.8; // 중간 급소
        break;
      case VitalPointSeverity.MINOR:
        baseMultiplier = 1.3; // 작은 급소
        break;
      default:
        baseMultiplier = 1.0;
    }

    // Apply accuracy modifier (Korean martial arts precision bonus)
    const accuracyBonus = 0.5 + accuracy * 0.5; // Range: 0.5 to 1.0
    const finalMultiplier = baseMultiplier * accuracyBonus;

    // Cap maximum damage for safety and game balance
    return Math.min(finalMultiplier, 5.0);
  }

  /**
   * **Business Logic:** Gets all available vital points for reference
   *
   * Provides complete list of Korean martial arts vital points for:
   * - Educational reference and study
   * - Training mode visualization
   * - Academic research on Korean martial arts anatomy
   * - Cultural preservation of traditional Korean knowledge
   *
   * @returns Complete array of Korean vital points with cultural context
   *
   * @example
   * ```typescript
   * const allPoints = vitalSystem.getAllVitalPoints();
   *
   * // Filter by category for educational display
   * const neurologicalPoints = allPoints.filter(
   *   point => point.category === VitalPointCategory.NEUROLOGICAL
   * );
   *
   * console.log(`신경계 급소: ${neurologicalPoints.length}개`);
   * ```
   */
  getAllVitalPoints(): readonly VitalPoint[] {
    return this.vitalPoints;
  }

  /**
   * **Business Logic:** Finds vital points by anatomical category
   *
   * Categorizes vital points following traditional Korean medical classification
   * for educational and training purposes.
   *
   * @param category - Anatomical category to filter by
   * @returns Vital points in the specified category
   *
   * @example
   * ```typescript
   * // Get all vascular vital points for advanced training
   * const vascularPoints = vitalSystem.getVitalPointsByCategory(
   *   VitalPointCategory.VASCULAR
   * );
   *
   * vascularPoints.forEach(point => {
   *   console.log(`혈관계 급소: ${point.korean.korean}`);
   * });
   * ```
   */
  getVitalPointsByCategory(
    category: VitalPointCategory
  ): readonly VitalPoint[] {
    return this.vitalPoints.filter((point) => point.category === category);
  }

  /**
   * **Business Logic:** Finds vital point by Korean or English name
   *
   * Supports both Korean and English terminology lookup for international
   * accessibility while maintaining cultural authenticity.
   *
   * @param name - Korean or English name of the vital point
   * @returns Matching vital point or null if not found
   *
   * @example
   * ```typescript
   * // Find by Korean name
   * const baekhoehoel = vitalSystem.getVitalPointByName("백회혈");
   *
   * // Find by English name
   * const crownPoint = vitalSystem.getVitalPointByName("Crown Point");
   *
   * if (baekhoehoel) {
   *   console.log(`발견: ${baekhoehoel.description.korean}`);
   * }
   * ```
   */
  getVitalPointByName(name: string): VitalPoint | null {
    const lowerName = name.toLowerCase();

    return (
      this.vitalPoints.find(
        (point) =>
          point.korean.korean.toLowerCase().includes(lowerName) ||
          point.korean.english.toLowerCase().includes(lowerName) ||
          point.anatomicalName.toLowerCase().includes(lowerName)
      ) || null
    );
  }

  /**
   * **Business Logic:** Gets vital points within anatomical region
   *
   * Groups vital points by body regions for systematic Korean martial arts
   * training and educational purposes.
   *
   * @param regionBounds - Rectangular boundary defining the anatomical region
   * @returns Vital points within the specified region
   *
   * @example
   * ```typescript
   * // Get all head and neck vital points
   * const headRegion = {
   *   x: 0, y: 0, width: 200, height: 150
   * };
   *
   * const headPoints = vitalSystem.getVitalPointsInRegion(headRegion);
   * console.log(`두경부 급소: ${headPoints.length}개`);
   * ```
   */
  getVitalPointsInRegion(regionBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): readonly VitalPoint[] {
    return this.vitalPoints.filter((point) => {
      const pos = point.position;
      return (
        pos.x >= regionBounds.x &&
        pos.x <= regionBounds.x + regionBounds.width &&
        pos.y >= regionBounds.y &&
        pos.y <= regionBounds.y + regionBounds.height
      );
    });
  }

  /**
   * **Business Logic:** Calculates Euclidean distance between two points
   *
   * High-precision distance calculation for accurate vital point targeting
   * in real-time combat simulation.
   *
   * @param point1 - First position
   * @param point2 - Second position
   * @returns Distance in pixels
   *
   * @internal
   */
  private calculateDistance(point1: Position, point2: Position): number {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * **Business Logic:** Generates Korean martial arts vital point feedback
   *
   * Creates culturally authentic Korean feedback messages that respect
   * traditional Korean martial arts terminology and educational context.
   *
   * @param vitalPoint - The targeted vital point
   * @param accuracy - Hit accuracy (0.0 to 1.0)
   * @returns Korean martial arts feedback message
   *
   * @internal
   */
  private generateKoreanVitalPointFeedback(
    vitalPoint: VitalPoint,
    accuracy: number
  ): string {
    const pointName = vitalPoint.korean.korean;

    if (accuracy >= 0.9) {
      return `완벽한 ${pointName} 타격!`;
    } else if (accuracy >= 0.7) {
      return `정확한 ${pointName} 급소 공격`;
    } else if (accuracy >= 0.5) {
      return `${pointName} 부분 타격`;
    } else {
      return `${pointName} 근처 타격`;
    }
  }

  /**
   * **Business Logic:** Validates vital points data integrity
   *
   * Ensures all vital points have required Korean martial arts information
   * and proper anatomical positioning for reliable system operation.
   *
   * @throws Error if vital points data is invalid or incomplete
   * @internal
   */
  private validateVitalPointsData(): void {
    if (!this.vitalPoints || this.vitalPoints.length === 0) {
      throw new Error(
        "급소 데이터가 없습니다 - No vital points data available"
      );
    }

    for (const point of this.vitalPoints) {
      // Validate required Korean terminology
      if (!point.korean?.korean || !point.korean?.english) {
        throw new Error(`급소 ${point.id}에 한국어 정보가 없습니다`);
      }

      // Validate anatomical positioning
      if (
        !point.position ||
        typeof point.position.x !== "number" ||
        typeof point.position.y !== "number"
      ) {
        throw new Error(`급소 ${point.id}의 위치 정보가 잘못되었습니다`);
      }

      // Validate severity classification
      if (!Object.values(VitalPointSeverity).includes(point.severity)) {
        throw new Error(`급소 ${point.id}의 심각도 분류가 잘못되었습니다`);
      }
    }

    console.log(
      `✅ 급소 시스템 초기화 완료: ${this.vitalPoints.length}개 급소 로드됨`
    );
  }

  /**
   * **Business Logic:** Gets system performance and accuracy metrics
   *
   * Provides diagnostic information for Korean martial arts training
   * effectiveness and system optimization.
   *
   * @returns Vital point system performance metrics
   */
  getSystemMetrics(): {
    totalVitalPoints: number;
    categoryCounts: Record<VitalPointCategory, number>;
    severityCounts: Record<VitalPointSeverity, number>;
    systemAccuracy: string;
    koreanCulturalRating: string;
  } {
    const categoryCounts = {} as Record<VitalPointCategory, number>;
    const severityCounts = {} as Record<VitalPointSeverity, number>;

    // Initialize counters
    Object.values(VitalPointCategory).forEach(
      (cat) => (categoryCounts[cat] = 0)
    );
    Object.values(VitalPointSeverity).forEach(
      (sev) => (severityCounts[sev] = 0)
    );

    // Count vital points by category and severity
    this.vitalPoints.forEach((point) => {
      categoryCounts[point.category]++;
      severityCounts[point.severity]++;
    });

    return {
      totalVitalPoints: this.vitalPoints.length,
      categoryCounts,
      severityCounts,
      systemAccuracy: this.vitalPoints.length >= 50 ? "높음" : "보통",
      koreanCulturalRating: "매우 우수", // Based on authentic Korean terminology usage
    };
  }
}

export default VitalPointSystem;
