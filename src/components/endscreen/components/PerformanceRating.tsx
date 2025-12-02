import React, { useMemo } from "react";
import { MatchStatistics } from "../../../systems/combat";
import { FONT_FAMILY, KOREAN_COLORS, PERFORMANCE_RATING_THRESHOLDS } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";
import { pulseAnimation } from "./animations";

export interface PerformanceRatingProps {
  readonly matchStats: MatchStatistics;
  readonly isMobile: boolean;
  readonly isTablet: boolean;
}

/**
 * Helper to convert hex color to CSS string
 */
const toCssColor = (hex: number): string => hexToRgbaString(hex, 1);

/**
 * Calculate performance score based on match statistics
 * Score ranges from 0-100 based on combat effectiveness
 */
function calculatePerformanceScore(stats: MatchStatistics): number {
  const winnerStats = stats.winner === 0 ? stats.player1 : stats.player2;
  
  // Calculate accuracy based on offensive performance only
  // Use a normalized scale: higher hits landed = better accuracy
  const accuracy = Math.min((winnerStats.hitsLanded / 10) * 100, 100);
  
  // Calculate damage efficiency (damage dealt / damage taken ratio)
  // Perfect defense (no damage taken) gets bonus ratio
  const damageRatio = winnerStats.totalDamageReceived > 0
    ? (winnerStats.totalDamageDealt / winnerStats.totalDamageReceived)
    : winnerStats.totalDamageDealt > 0 ? 2 : 0;
  const damageScore = Math.min(damageRatio * 30, 30); // Max 30 points
  
  // Perfect strikes and vital point hits bonus
  const precisionBonus = (winnerStats.perfectStrikes * 5) + (winnerStats.vitalPointHits * 3);
  const precisionScore = Math.min(precisionBonus, 25); // Max 25 points
  
  // Speed bonus (shorter match duration is better)
  const speedScore = stats.matchDuration < 60 ? 15 : stats.matchDuration < 120 ? 10 : 5;
  
  // Combine scores
  const totalScore = (accuracy * 0.3) + damageScore + precisionScore + speedScore;
  
  return Math.min(Math.round(totalScore), 100);
}

/**
 * Get performance rating based on score
 */
function getPerformanceRating(score: number): keyof typeof PERFORMANCE_RATING_THRESHOLDS {
  if (score >= PERFORMANCE_RATING_THRESHOLDS.S.minScore) return "S";
  if (score >= PERFORMANCE_RATING_THRESHOLDS.A.minScore) return "A";
  if (score >= PERFORMANCE_RATING_THRESHOLDS.B.minScore) return "B";
  return "C";
}

/**
 * Performance Rating Component
 * Displays S/A/B/C ranking based on combat performance
 */
export const PerformanceRating: React.FC<PerformanceRatingProps> = ({
  matchStats,
  isMobile,
  isTablet,
}) => {
  const ratingFontSize = isMobile ? 48 : isTablet ? 60 : 72;
  const labelFontSize = isMobile ? 14 : isTablet ? 16 : 18;
  const scoreFontSize = isMobile ? 20 : isTablet ? 24 : 28;
  const padding = isMobile ? 15 : isTablet ? 18 : 20;

  const performanceScore = useMemo(
    () => calculatePerformanceScore(matchStats),
    [matchStats]
  );

  const rating = useMemo(
    () => getPerformanceRating(performanceScore),
    [performanceScore]
  );

  const ratingInfo = PERFORMANCE_RATING_THRESHOLDS[rating];
  
  // Extract winner stats for clarity
  const winnerStats = useMemo(
    () => matchStats.winner === 0 ? matchStats.player1 : matchStats.player2,
    [matchStats]
  );

  return (
    <div
      data-testid="performance-rating"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9),
        border: `3px solid ${hexToRgbaString(ratingInfo.color, 0.8)}`,
        borderRadius: "16px",
        padding: padding * 1.5,
        marginBottom: padding,
        minWidth: isMobile ? "280px" : "320px",
        boxShadow: `0 0 30px ${hexToRgbaString(ratingInfo.color, 0.3)}`,
        animation: "ratingPulse 2s ease-in-out infinite",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: labelFontSize,
          color: toCssColor(KOREAN_COLORS.TEXT_SECONDARY),
          fontFamily: FONT_FAMILY.KOREAN,
          marginBottom: padding / 2,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
        data-testid="rating-label"
      >
        전투 등급 | Performance Rating
      </div>

      {/* Rating Letter */}
      <div
        style={{
          fontSize: ratingFontSize,
          fontWeight: "bold",
          color: toCssColor(ratingInfo.color),
          fontFamily: FONT_FAMILY.KOREAN,
          textShadow: `0 0 20px ${hexToRgbaString(ratingInfo.color, 0.6)}`,
          marginBottom: padding / 2,
          animation: "ratingGlow 1.5s ease-in-out infinite",
        }}
        data-testid="rating-letter"
      >
        {rating}
      </div>

      {/* Rating Description */}
      <div
        style={{
          fontSize: labelFontSize,
          color: toCssColor(KOREAN_COLORS.PRIMARY_CYAN),
          fontFamily: FONT_FAMILY.KOREAN,
          marginBottom: padding,
          textAlign: "center",
        }}
        data-testid="rating-description"
      >
        {ratingInfo.description.korean} | {ratingInfo.description.english}
      </div>

      {/* Performance Score */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: padding,
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.4),
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            fontSize: scoreFontSize,
            fontWeight: "bold",
            color: toCssColor(ratingInfo.color),
            fontFamily: FONT_FAMILY.KOREAN,
            marginBottom: padding / 4,
          }}
          data-testid="performance-score"
        >
          {performanceScore}
        </div>
        <div
          style={{
            fontSize: labelFontSize - 2,
            color: toCssColor(KOREAN_COLORS.TEXT_TERTIARY),
            fontFamily: FONT_FAMILY.KOREAN,
          }}
        >
          전투 점수 | Combat Score
        </div>

        {/* Score Breakdown */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: padding / 2,
            marginTop: padding,
            width: "100%",
            fontSize: labelFontSize - 4,
            color: toCssColor(KOREAN_COLORS.TEXT_SECONDARY),
          }}
          data-testid="score-breakdown"
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ color: toCssColor(KOREAN_COLORS.ACCENT_GOLD), fontWeight: "bold" }}>
              {winnerStats.perfectStrikes ?? 0}
            </div>
            <div>완벽 | Perfect</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: toCssColor(KOREAN_COLORS.VITAL_POINT_HIT), fontWeight: "bold" }}>
              {winnerStats.vitalPointHits ?? 0}
            </div>
            <div>급소 | Vital Hits</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: toCssColor(KOREAN_COLORS.PRIMARY_CYAN), fontWeight: "bold" }}>
              {winnerStats.techniques?.length ?? 0}
            </div>
            <div>기술 | Techniques</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: toCssColor(KOREAN_COLORS.CRITICAL_HIT), fontWeight: "bold" }}>
              {matchStats.criticalHits}
            </div>
            <div>치명타 | Criticals</div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        ${pulseAnimation}

        @keyframes ratingGlow {
          0%, 100% {
            text-shadow: 0 0 20px ${hexToRgbaString(ratingInfo.color, 0.6)};
          }
          50% {
            text-shadow: 0 0 30px ${hexToRgbaString(ratingInfo.color, 0.9)}, 0 0 50px ${hexToRgbaString(ratingInfo.color, 0.5)};
          }
        }
      `}</style>
    </div>
  );
};
