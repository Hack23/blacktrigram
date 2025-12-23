/**
 * Korean Vital Points (급소) - Complete 70-Point System
 *
 * This module provides the complete Korean martial arts vital point system
 * with all 70 anatomical targets. This is the primary export used by all
 * combat and training components.
 *
 * **Architecture Note**: This module re-exports VITAL_POINTS_DATA as
 * KOREAN_VITAL_POINTS to maintain backwards compatibility while providing
 * the complete 70-point system. All new code should use VITAL_POINTS_DATA
 * directly from VitalPointsData.ts.
 *
 * @module systems/vitalpoint/KoreanVitalPoints
 * @see {@link ./VitalPointsData.ts} for the complete data source
 */

import {
  TrigramStance,
  VitalPointCategory,
  VitalPointSeverity,
} from "../../types/common";
import { VitalPoint } from "./types";
import { VITAL_POINTS_DATA } from "./VitalPointsData";

/**
 * Complete Korean vital points (급소) system - All 70 anatomical targets
 *
 * **Distribution**:
 * - Head: 12 points (neurological, vascular, skeletal)
 * - Torso: 24 points (organs, ribs, spine, respiratory)
 * - Arms: 17 points (joints, nerves, skeletal)
 * - Legs: 17 points (joints, nerves, mobility)
 *
 * **Severity Levels**:
 * - LETHAL (4 points): Life-threatening strikes
 * - CRITICAL (18 points): Severe incapacitation
 * - MAJOR (28 points): Significant damage
 * - MODERATE (16 points): Moderate effectiveness
 * - MINOR (4 points): Low damage points
 *
 * @public
 * @korean 급소시스템
 */
export const KOREAN_VITAL_POINTS: readonly VitalPoint[] = VITAL_POINTS_DATA;

/**
 * Filter vital points by category (neurological, skeletal, vascular, etc.)
 *
 * @param category - The vital point category to filter by
 * @returns Array of vital points in that category
 *
 * @public
 * @korean 범주별급소
 */
export const getVitalPointsByCategory = (
  category: VitalPointCategory
): VitalPoint[] => {
  return KOREAN_VITAL_POINTS.filter((vp) => vp.category === category);
};

/**
 * Filter vital points by body region ID prefix (head_, torso_, arm_, leg_)
 *
 * @param regionPrefix - Region prefix to filter by (e.g., "head_", "torso_")
 * @returns Array of vital points in that region
 *
 * @public
 * @korean 부위별급소
 */
export const getVitalPointsByRegion = (regionPrefix: string): VitalPoint[] => {
  return KOREAN_VITAL_POINTS.filter((vp) => vp.id.startsWith(regionPrefix));
};

/**
 * Get a specific vital point by its unique ID
 *
 * @param id - Unique vital point identifier
 * @returns The vital point or undefined if not found
 *
 * @public
 * @korean 급소검색
 */
export const getVitalPointById = (id: string): VitalPoint | undefined => {
  return KOREAN_VITAL_POINTS.find((vp) => vp.id === id);
};

/**
 * Get vital points that are most effective with a specific trigram stance
 *
 * @param stance - Trigram stance to check effectiveness for
 * @returns Array of vital points effective for that stance
 *
 * @public
 * @korean 자세별급소
 */
export const getVitalPointsByStance = (stance: TrigramStance): VitalPoint[] => {
  return KOREAN_VITAL_POINTS.filter((vp) =>
    vp.effectiveStances.includes(stance)
  );
};

/**
 * Get vital points by targeting difficulty range
 *
 * @param minDifficulty - Minimum difficulty (0.0 to 1.0)
 * @param maxDifficulty - Maximum difficulty (0.0 to 1.0)
 * @returns Array of vital points within difficulty range
 *
 * @public
 * @korean 난이도별급소
 */
export const getVitalPointsByDifficulty = (
  minDifficulty: number,
  maxDifficulty: number
): VitalPoint[] => {
  return KOREAN_VITAL_POINTS.filter(
    (vp) =>
      vp.targetingDifficulty >= minDifficulty &&
      vp.targetingDifficulty <= maxDifficulty
  );
};

/**
 * Get vital points by severity level
 *
 * @param severity - Severity level to filter by
 * @returns Array of vital points at that severity
 *
 * @public
 * @korean 심각도별급소
 */
export const getVitalPointsBySeverity = (
  severity: VitalPointSeverity
): VitalPoint[] => {
  return KOREAN_VITAL_POINTS.filter((vp) => vp.severity === severity);
};

/**
 * Get vital points statistics for the complete 70-point system
 *
 * @returns Statistics about the vital points system
 *
 * @public
 * @korean 급소통계
 */
export const getVitalPointsStats = () => {
  const stats = {
    total: KOREAN_VITAL_POINTS.length,
    byRegion: {
      head: KOREAN_VITAL_POINTS.filter((vp) => vp.id.startsWith("head_")).length,
      torso: KOREAN_VITAL_POINTS.filter((vp) => vp.id.startsWith("torso_")).length,
      arms: KOREAN_VITAL_POINTS.filter((vp) => vp.id.startsWith("arm_")).length,
      legs: KOREAN_VITAL_POINTS.filter((vp) => vp.id.startsWith("leg_")).length,
    },
    bySeverity: {
      lethal: getVitalPointsBySeverity(VitalPointSeverity.LETHAL).length,
      critical: getVitalPointsBySeverity(VitalPointSeverity.CRITICAL).length,
      major: getVitalPointsBySeverity(VitalPointSeverity.MAJOR).length,
      moderate: getVitalPointsBySeverity(VitalPointSeverity.MODERATE).length,
      minor: getVitalPointsBySeverity(VitalPointSeverity.MINOR).length,
    },
    byCategory: {
      neurological: getVitalPointsByCategory(VitalPointCategory.NEUROLOGICAL).length,
      skeletal: getVitalPointsByCategory(VitalPointCategory.SKELETAL).length,
      vascular: getVitalPointsByCategory(VitalPointCategory.VASCULAR).length,
      organ: getVitalPointsByCategory(VitalPointCategory.ORGAN).length,
      joint: getVitalPointsByCategory(VitalPointCategory.JOINT).length,
      muscular: getVitalPointsByCategory(VitalPointCategory.MUSCULAR).length,
      respiratory: getVitalPointsByCategory(VitalPointCategory.RESPIRATORY).length,
    },
  };
  
  return stats;
};

export default KOREAN_VITAL_POINTS;
