/**
 * TrainingStatsOverlayHtml - Html overlay for training statistics
 * 
 * Displays score, combo, hits, misses, and accuracy with consistent Korean theming.
 * Uses Korean cyberpunk color palette and bilingual text formatting.
 * 
 * @module components/screens/training
 * @category Training UI
 * @korean 훈련통계오버레이
 */

import React, { useMemo } from "react";
import {
  FONT_FAMILY,
  KOREAN_COLORS,
} from "../../../../types/constants";
import { SPACING } from "../../../../types/constants/ui";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import {
  getKoreanOverlayBaseStyles,
  formatBilingualText,
  getResponsiveSpacing,
} from "../../../../utils/koreanThemeHelpers";

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
 * Props for TrainingStatsOverlayHtml component
 */
export interface TrainingStatsOverlayHtmlProps {
  /** Current training statistics */
  readonly stats: TrainingStats;
  /** Whether on mobile device */
  readonly isMobile: boolean;
}

/**
 * TrainingStatsOverlayHtml Component
 * 
 * Html overlay displaying training performance metrics with Korean theming.
 * All colors use KOREAN_COLORS constants for consistency.
 * 
 * @example
 * ```tsx
 * <TrainingStatsOverlayHtml
 *   stats={{ score: 1500, combo: 8, hits: 45, misses: 5, accuracy: 90 }}
 *   isMobile={false}
 * />
 * ```
 * 
 * @korean 훈련통계오버레이컴포넌트
 */
export const TrainingStatsOverlayHtml: React.FC<TrainingStatsOverlayHtmlProps> = ({
  stats,
  isMobile,
}) => {
  const panelWidth = isMobile ? 240 : 260;
  const padding = getResponsiveSpacing("md", isMobile);
  const gap = getResponsiveSpacing("sm", isMobile);
  
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

  // Base panel styles using Korean theme
  const panelStyle: React.CSSProperties = {
    ...getKoreanOverlayBaseStyles(0.9),
    width: `${panelWidth}px`,
    padding: `${padding}px`,
  };

  // Header title styles
  const titleFontSize = isMobile ? 14 : 16;

  return (
    <div style={panelStyle} data-testid="training-stats-html">
      {/* Header with bilingual title */}
      <div style={{ marginBottom: `${padding}px` }}>
        <div
          style={{
            fontSize: `${titleFontSize}px`,
            fontWeight: "bold",
            color: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD),
            fontFamily: FONT_FAMILY.KOREAN,
          }}
        >
          {formatBilingualText("훈련 통계", "Training Statistics", "pipe")}
        </div>
      </div>

      {/* Stats Grid with consistent Korean theming */}
      <div style={{ display: "flex", flexDirection: "column", gap: `${gap}px` }}>
        {/* Score - 점수 */}
        <StatRow
          korean="점수"
          english="Score"
          value={stats.score.toLocaleString()}
          color={KOREAN_COLORS.ACCENT_GOLD}
          isMobile={isMobile}
        />

        {/* Combo - 콤보 */}
        <StatRow
          korean="콤보"
          english="Combo"
          value={`${stats.combo}x`}
          color={
            stats.combo > 5
              ? KOREAN_COLORS.ACCENT_RED
              : KOREAN_COLORS.PRIMARY_CYAN
          }
          isMobile={isMobile}
        />

        {/* Hits - 성공 */}
        <StatRow
          korean="성공"
          english="Hits"
          value={stats.hits.toString()}
          color={KOREAN_COLORS.ACCENT_GREEN}
          isMobile={isMobile}
        />

        {/* Misses - 실패 */}
        <StatRow
          korean="실패"
          english="Misses"
          value={stats.misses.toString()}
          color={KOREAN_COLORS.TEXT_TERTIARY}
          isMobile={isMobile}
        />

        {/* Accuracy - 정확도 */}
        <StatRow
          korean="정확도"
          english="Accuracy"
          value={`${formattedAccuracy}%`}
          color={
            stats.accuracy >= 80
              ? KOREAN_COLORS.ACCENT_GREEN
              : stats.accuracy >= 50
              ? KOREAN_COLORS.ACCENT_GOLD
              : KOREAN_COLORS.ACCENT_RED
          }
          isMobile={isMobile}
        />

        {/* Session Duration - 시간 */}
        {stats.sessionDuration !== undefined && (
          <StatRow
            korean="시간"
            english="Duration"
            value={formattedDuration}
            color={KOREAN_COLORS.PRIMARY_CYAN}
            isMobile={isMobile}
          />
        )}

        {/* Best Combo - 최고 콤보 */}
        {stats.bestCombo !== undefined && stats.bestCombo > 0 && (
          <StatRow
            korean="최고 콤보"
            english="Best Combo"
            value={`${stats.bestCombo}x`}
            color={KOREAN_COLORS.ACCENT_GOLD}
            isMobile={isMobile}
          />
        )}

        {/* Perfect Rate - 완벽률 */}
        {stats.hits + stats.misses > 0 && (
          <StatRow
            korean="완벽률"
            english="Perfect Rate"
            value={`${perfectRate}%`}
            color={
              parseFloat(perfectRate) >= 30
                ? KOREAN_COLORS.ACCENT_GOLD
                : parseFloat(perfectRate) >= 10
                ? KOREAN_COLORS.PRIMARY_CYAN
                : KOREAN_COLORS.TEXT_TERTIARY
            }
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Single stat row component with Korean theming
 * 
 * Uses KOREAN_COLORS constants for all text colors
 * 
 * @korean 통계행컴포넌트
 */
const StatRow: React.FC<{
  korean: string;
  english: string;
  value: string;
  color: number; // Hex color from KOREAN_COLORS
  isMobile: boolean;
}> = ({ korean, english, value, color, isMobile }) => {
  const labelFontSize = isMobile ? 11 : 12;
  const sublabelFontSize = isMobile ? 8 : 9;
  const valueFontSize = isMobile ? 16 : 18;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: `${SPACING.SM}px`,
        borderBottom: `1px solid ${hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, 0.1)}`,
      }}
    >
      <div>
        <div
          style={{
            fontSize: `${labelFontSize}px`,
            color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN),
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
          }}
        >
          {korean}
        </div>
        <div
          style={{
            fontSize: `${sublabelFontSize}px`,
            color: hexToRgbaString(KOREAN_COLORS.TEXT_TERTIARY),
            fontFamily: FONT_FAMILY.KOREAN,
          }}
        >
          {english}
        </div>
      </div>
      <div
        style={{
          fontSize: `${valueFontSize}px`,
          fontWeight: "bold",
          color: hexToRgbaString(color),
          fontFamily: FONT_FAMILY.KOREAN,
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default TrainingStatsOverlayHtml;
