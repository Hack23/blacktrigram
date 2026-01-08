/**
 * TrainingStatsHTML - Html overlay for training statistics
 * 
 * Displays score, combo, hits, misses, and accuracy
 */

import React, { useMemo } from "react";
import { FONT_FAMILY } from "../../../../../types/constants";

/**
 * Training statistics interface
 */
export interface TrainingStats {
  readonly score: number;
  readonly combo: number;
  readonly hits: number;
  readonly misses: number;
  readonly accuracy: number;
  readonly sessionDuration?: number;
  readonly bestCombo?: number;
  readonly perfectStrikes?: number;
}

/**
 * Props for TrainingStatsHTML component
 */
export interface TrainingStatsHTMLProps {
  /** Current training statistics */
  readonly stats: TrainingStats;
  /** Whether on mobile device */
  readonly isMobile: boolean;
}

/**
 * TrainingStatsHTML Component
 * Html overlay displaying training performance metrics
 */
export const TrainingStatsHTML: React.FC<TrainingStatsHTMLProps> = ({
  stats,
  isMobile,
}) => {
  const panelWidth = isMobile ? 240 : 260;
  
  // Format accuracy with memoization
  const formattedAccuracy = useMemo(
    () => stats.accuracy.toFixed(1),
    [stats.accuracy]
  );

  // Format session duration
  const formattedDuration = useMemo(() => {
    if (!stats.sessionDuration) return "00:00";
    const minutes = Math.floor(stats.sessionDuration / 60);
    const seconds = stats.sessionDuration % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [stats.sessionDuration]);

  // Calculate perfect strike rate
  const perfectRate = useMemo(() => {
    const totalAttempts = stats.hits + stats.misses;
    if (totalAttempts === 0 || !stats.perfectStrikes) return "0";
    return ((stats.perfectStrikes / totalAttempts) * 100).toFixed(1);
  }, [stats.hits, stats.misses, stats.perfectStrikes]);

  return (
    <div
      style={{
        width: `${panelWidth}px`,
        background: "rgba(26, 26, 26, 0.85)",
        border: "2px solid rgba(255, 170, 0, 0.9)",
        borderRadius: "12px",
        padding: "15px",
        fontFamily: FONT_FAMILY.KOREAN,
        color: "#ffffff",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
      }}
      data-testid="training-stats-html"
    >
      {/* Header */}
      <div style={{ marginBottom: "15px" }}>
        <div
          style={{
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: "bold",
            color: "#ffd700",
          }}
        >
          훈련 통계
        </div>
        <div
          style={{
            fontSize: isMobile ? "10px" : "12px",
            color: "#999999",
            fontStyle: "italic",
          }}
        >
          Training Statistics
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Score */}
        <StatRow
          korean="점수"
          english="Score"
          value={stats.score.toLocaleString()}
          color="#ffd700"
          isMobile={isMobile}
        />

        {/* Combo */}
        <StatRow
          korean="콤보"
          english="Combo"
          value={`${stats.combo}x`}
          color={stats.combo > 5 ? "#ff4444" : "#00ffff"}
          isMobile={isMobile}
        />

        {/* Hits */}
        <StatRow
          korean="성공"
          english="Hits"
          value={stats.hits.toString()}
          color="#00ff88"
          isMobile={isMobile}
        />

        {/* Misses */}
        <StatRow
          korean="실패"
          english="Misses"
          value={stats.misses.toString()}
          color="#888888"
          isMobile={isMobile}
        />

        {/* Accuracy */}
        <StatRow
          korean="정확도"
          english="Accuracy"
          value={`${formattedAccuracy}%`}
          color={
            stats.accuracy >= 80
              ? "#00ff88"
              : stats.accuracy >= 50
              ? "#ffd700"
              : "#ff4444"
          }
          isMobile={isMobile}
        />

        {/* Session Duration */}
        {stats.sessionDuration !== undefined && (
          <StatRow
            korean="시간"
            english="Duration"
            value={formattedDuration}
            color="#00ffff"
            isMobile={isMobile}
          />
        )}

        {/* Best Combo */}
        {stats.bestCombo !== undefined && stats.bestCombo > 0 && (
          <StatRow
            korean="최고 콤보"
            english="Best Combo"
            value={`${stats.bestCombo}x`}
            color="#ffd700"
            isMobile={isMobile}
          />
        )}

        {/* Perfect Rate */}
        {stats.hits + stats.misses > 0 && (
          <StatRow
            korean="완벽률"
            english="Perfect Rate"
            value={`${perfectRate}%`}
            color={
              parseFloat(perfectRate) >= 30
                ? "#ffd700"
                : parseFloat(perfectRate) >= 10
                ? "#00ffff"
                : "#888888"
            }
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Single stat row component
 */
const StatRow: React.FC<{
  korean: string;
  english: string;
  value: string;
  color: string;
  isMobile: boolean;
}> = ({ korean, english, value, color, isMobile }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: "8px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div>
        <div
          style={{
            fontSize: isMobile ? "11px" : "12px",
            color: "#00ffff",
            fontWeight: "bold",
          }}
        >
          {korean}
        </div>
        <div
          style={{
            fontSize: isMobile ? "8px" : "9px",
            color: "#888888",
          }}
        >
          {english}
        </div>
      </div>
      <div
        style={{
          fontSize: isMobile ? "16px" : "18px",
          fontWeight: "bold",
          color: color,
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default TrainingStatsHTML;
