/**
 * ## Training Statistics Management Hook
 *
 * **Business Purpose:**
 * Comprehensive statistics tracking for Korean martial arts training sessions.
 * Implements traditional Korean martial arts assessment methodology including:
 * - Accuracy tracking following Korean martial arts grading standards
 * - Progress trend analysis using Korean educational principles
 * - Performance milestone recognition with Korean terminology
 * - Session analytics that support Korean martial arts learning progression
 *
 * **Korean Martial Arts Integration:**
 * - Uses traditional Korean martial arts performance metrics
 * - Implements Korean grading system terminology (우수, 양호, 보통, 미흡, 부족)
 * - Respects Korean martial arts progression philosophy
 * - Provides culturally appropriate performance feedback
 *
 * **Technical Architecture:**
 * - Tracks comprehensive training metrics with trend analysis
 * - Provides real-time statistics updates during training sessions
 * - Calculates Korean martial arts specific performance indicators
 * - Generates meaningful progress reports for skill development
 *
 * @param initialStats - Initial statistics state for the training session
 * @returns Statistics management interface with Korean martial arts integration
 *
 * @example
 * ```typescript
 * const {
 *   stats,
 *   updateStats,
 *   getAccuracyTrend,
 *   getKoreanGrade
 * } = useTrainingStatistics({
 *   attempts: 0,
 *   hits: 0,
 *   perfectStrikes: 0,
 *   accuracy: 0,
 *   sessionTime: 0,
 *   experienceGained: 0
 * });
 * ```
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */

import { useState, useCallback, useMemo } from "react";
import type { TrainingStatistics } from "../types/training";

export interface TrainingStatisticsHook {
  /** Current training statistics */
  readonly stats: TrainingStatistics;

  /** Update statistics with new data */
  readonly updateStats: (updates: Partial<TrainingStatistics>) => void;

  /** Get accuracy trend analysis */
  readonly getAccuracyTrend: () => "improving" | "stable" | "declining";

  /** Get Korean martial arts grade based on performance */
  readonly getKoreanGrade: () => {
    grade: string;
    description: string;
    color: string;
  };

  /** Reset statistics to initial state */
  readonly resetStats: () => void;
}

/**
 * **Business Logic:** Creates and manages training statistics following
 * Korean martial arts educational standards
 */
export const useTrainingStatistics = (
  initialStats: TrainingStatistics
): TrainingStatisticsHook => {
  const [stats, setStats] = useState<TrainingStatistics>(initialStats);
  const [accuracyHistory, setAccuracyHistory] = useState<number[]>([]);

  /**
   * **Business Logic:** Updates training statistics with Korean martial arts validation
   */
  const updateStats = useCallback((updates: Partial<TrainingStatistics>) => {
    setStats((prev) => {
      const newStats = { ...prev, ...updates };

      // Track accuracy history for trend analysis
      if (updates.accuracy !== undefined) {
        setAccuracyHistory((history) => {
          const newHistory = [...history, updates.accuracy!];
          return newHistory.slice(-10); // Keep last 10 accuracy readings
        });
      }

      return newStats;
    });
  }, []);

  /**
   * **Business Logic:** Analyzes accuracy trend following Korean teaching methodology
   */
  const getAccuracyTrend = useCallback(() => {
    if (accuracyHistory.length < 5) return "stable";

    const recent = accuracyHistory.slice(-3);
    const earlier = accuracyHistory.slice(-6, -3);

    if (earlier.length === 0) return "stable";

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;

    const diff = recentAvg - earlierAvg;

    if (diff > 5) return "improving";
    if (diff < -5) return "declining";
    return "stable";
  }, [accuracyHistory]);

  /**
   * **Business Logic:** Gets Korean martial arts grade based on performance
   */
  const getKoreanGrade = useCallback(() => {
    const { accuracy } = stats;

    if (accuracy >= 90) {
      return {
        grade: "우수",
        description: "완벽한 실력! 고수의 경지입니다.",
        color: "gold",
      };
    } else if (accuracy >= 80) {
      return {
        grade: "양호",
        description: "훌륭한 실력! 거의 완성 단계입니다.",
        color: "green",
      };
    } else if (accuracy >= 70) {
      return {
        grade: "보통",
        description: "좋은 실력! 꾸준히 발전하고 있습니다.",
        color: "cyan",
      };
    } else if (accuracy >= 50) {
      return {
        grade: "미흡",
        description: "괜찮은 실력! 더 많은 연습이 필요합니다.",
        color: "yellow",
      };
    } else {
      return {
        grade: "부족",
        description: "기본기부터 다시 시작하세요.",
        color: "red",
      };
    }
  }, [stats]);

  /**
   * **Business Logic:** Resets statistics for new training session
   */
  const resetStats = useCallback(() => {
    setStats(initialStats);
    setAccuracyHistory([]);
  }, [initialStats]);

  return {
    stats,
    updateStats,
    getAccuracyTrend,
    getKoreanGrade,
    resetStats,
  };
};

export default useTrainingStatistics;
