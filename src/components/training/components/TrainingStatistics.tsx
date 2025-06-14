import React, { useMemo } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { KOREAN_COLORS } from "../../../types/constants";
import {
  ResponsivePixiContainer,
  ResponsivePixiPanel,
} from "../../ui/base/ResponsivePixiComponents";
import { ProgressTracker } from "../../ui/ProgressTracker";
import type { TrainingStatistics as TrainingStatsType } from "./types/training";
import { TrigramStance } from "../../../types/enums";

// Extend PIXI components
extend({ Container, Graphics, Text });

/**
 * ## Training Statistics Component
 *
 * **Business Purpose:**
 * Comprehensive statistics display for Korean martial arts training sessions.
 * Provides detailed performance analysis including:
 * - Real-time accuracy tracking with Korean martial arts terminology
 * - Technique execution statistics with traditional grading system
 * - Progress visualization using authentic Korean assessment methods
 * - Performance trends analysis for skill development guidance
 *
 * **Korean Martial Arts Integration:**
 * - Traditional Korean grading terminology ("우수", "양호", "보통", "미흡")
 * - Authentic martial arts progression tracking methodology
 * - Cultural accuracy in performance evaluation standards
 * - Integration with Korean belt/rank advancement requirements
 *
 * **Architecture:**
 * - Real-time statistics calculation with optimized performance
 * - Responsive design adapting to mobile, tablet, and desktop layouts
 * - Integration with training session management hooks
 * - Visual feedback system using traditional Korean color schemes
 *
 * @component
 * @example
 * ```tsx
 * <TrainingStatistics
 *   stats={{
 *     attempts: 25,
 *     hits: 20,
 *     perfectStrikes: 8,
 *     accuracy: 80,
 *     sessionTime: 300,
 *     experienceGained: 150
 *   }}
 *   currentCombo={3}
 *   selectedStance={TrigramStance.GEON}
 *   maxAttempts={30}
 *   x={800}
 *   y={500}
 *   width={320}
 *   height={240}
 *   screenWidth={1200}
 *   screenHeight={800}
 *   isMobile={false}
 * />
 * ```
 *
 * @see {@link useTrainingSession} For statistics data source
 * @see {@link TrainingStatisticsPanel} For panel wrapper component
 * @see {@link ProgressTracker} For individual progress visualization
 *
 * @since 0.2.5
 * @author Black Trigram Development Team
 */
export interface TrainingStatisticsProps {
  /** Current training session statistics including accuracy and performance metrics */
  readonly stats: TrainingStatsType;

  /** Current technique combo count for consecutive successful techniques */
  readonly currentCombo: number;

  /** Currently selected trigram stance affecting difficulty and scoring */
  readonly selectedStance: TrigramStance;

  /** Maximum attempts allowed in current training mode */
  readonly maxAttempts: number;

  /** X position offset for component placement */
  readonly x: number;

  /** Y position offset for component placement */
  readonly y: number;

  /** Component width for responsive layout calculations */
  readonly width: number;

  /** Component height for responsive layout calculations */
  readonly height: number;

  /** Screen width for responsive breakpoint calculations */
  readonly screenWidth: number;

  /** Screen height for responsive layout optimization */
  readonly screenHeight: number;

  /** Whether interface is optimized for mobile devices */
  readonly isMobile: boolean;
}

/**
 * ## Training Statistics Implementation
 *
 * **Business Logic:**
 * - Calculates performance metrics using traditional Korean martial arts standards
 * - Provides immediate feedback on technique execution quality
 * - Tracks progression toward belt advancement requirements
 * - Generates recommendations for focused practice areas
 *
 * **Technical Architecture:**
 * - Optimized statistics calculation with memoized computations
 * - Responsive UI adapting to different screen sizes and orientations
 * - Integration with Korean text rendering system for authentic terminology
 * - Performance-optimized rendering with efficient update patterns
 *
 * **Korean Martial Arts Features:**
 * - Traditional Korean performance evaluation criteria
 * - Authentic martial arts progression tracking methodology
 * - Cultural accuracy in feedback terminology and assessment standards
 * - Visual design consistent with traditional Korean martial arts aesthetics
 *
 * @param props - Training statistics configuration and data
 * @returns JSX.Element representing the complete statistics display interface
 */
export const TrainingStatistics: React.FC<TrainingStatisticsProps> = ({
  stats,
  currentCombo,
  selectedStance,
  maxAttempts,
  x,
  y,
  width,
  height,
  screenWidth,
  screenHeight,
  isMobile,
}) => {
  // Enhanced performance calculations with Korean martial arts grading
  const performanceMetrics = useMemo(() => {
    const accuracy =
      stats.attempts > 0 ? (stats.hits / stats.attempts) * 100 : 0;
    const perfectRatio =
      stats.attempts > 0 ? (stats.perfectStrikes / stats.attempts) * 100 : 0;
    const progressPercentage = (stats.attempts / maxAttempts) * 100;

    // Korean martial arts grading system
    let gradeKorean = "시작";
    let gradeEnglish = "Beginner";

    if (accuracy >= 95) {
      gradeKorean = "우수";
      gradeEnglish = "Excellent";
    } else if (accuracy >= 85) {
      gradeKorean = "양호";
      gradeEnglish = "Good";
    } else if (accuracy >= 70) {
      gradeKorean = "보통";
      gradeEnglish = "Average";
    } else if (accuracy >= 50) {
      gradeKorean = "미흡";
      gradeEnglish = "Below Average";
    } else {
      gradeKorean = "부족";
      gradeEnglish = "Poor";
    }

    return {
      accuracy,
      perfectRatio,
      progressPercentage,
      gradeKorean,
      gradeEnglish,
      sessionMinutes: Math.floor(stats.sessionTime / 60),
      sessionSeconds: stats.sessionTime % 60,
    };
  }, [stats, maxAttempts]);

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      data-testid="training-statistics"
    >
      {/* Enhanced Statistics Panel */}
      <ResponsivePixiPanel
        title="훈련 통계 - Training Statistics"
        x={0}
        y={0}
        width={width}
        height={height}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
      />

      {/* Accuracy Display with Korean Grading */}
      <pixiContainer x={15} y={35} data-testid="accuracy-display">
        <pixiText
          text={`정확도: ${Math.round(performanceMetrics.accuracy)}%`}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
          }}
          data-testid="accuracy-korean"
        />

        <pixiText
          text={`평가: ${performanceMetrics.gradeKorean} (${performanceMetrics.gradeEnglish})`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          y={18}
          data-testid="grade-display"
        />
      </pixiContainer>

      {/* Technique Statistics */}
      <pixiContainer x={15} y={75} data-testid="technique-stats">
        <pixiText
          text={`시도: ${stats.attempts}/${maxAttempts}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
          }}
          data-testid="attempts-count"
        />

        <pixiText
          text={`명중: ${stats.hits}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.ACCENT_GREEN,
          }}
          y={15}
          data-testid="hits-count"
        />

        <pixiText
          text={`완벽한 타격: ${stats.perfectStrikes}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.ACCENT_PURPLE,
          }}
          y={30}
          data-testid="perfect-strikes-count"
        />
      </pixiContainer>

      {/* Current Combo Display */}
      <pixiContainer x={15} y={135} data-testid="combo-display">
        <pixiText
          text={`현재 연속: ${currentCombo}회`}
          style={{
            fontSize: isMobile ? 11 : 13,
            fill:
              currentCombo > 0
                ? KOREAN_COLORS.ACCENT_CYAN
                : KOREAN_COLORS.TEXT_TERTIARY,
            fontWeight: currentCombo > 3 ? "bold" : "normal",
          }}
          data-testid="current-combo"
        />
      </pixiContainer>

      {/* Session Time */}
      <pixiContainer x={15} y={155} data-testid="session-time-display">
        <pixiText
          text={`세션 시간: ${
            performanceMetrics.sessionMinutes
          }:${performanceMetrics.sessionSeconds.toString().padStart(2, "0")}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          data-testid="session-time"
        />
      </pixiContainer>

      {/* Progress Bar */}
      <ProgressTracker
        title="진행도"
        korean="진행도"
        progress={performanceMetrics.progressPercentage / 100}
        maxProgress={100}
        currentValue={stats.attempts}
        x={15}
        y={height - 60}
        width={width - 30}
        height={35}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        color={KOREAN_COLORS.ACCENT_CYAN}
        showText={true}
        data-testid="progress-tracker"
      />

      {/* Experience Gained */}
      {stats.experienceGained > 0 && (
        <pixiContainer x={width - 120} y={35} data-testid="experience-gained">
          <pixiText
            text={`경험치: +${stats.experienceGained}`}
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
            }}
            data-testid="experience-points"
          />
        </pixiContainer>
      )}
    </ResponsivePixiContainer>
  );
};

export default TrainingStatistics;
