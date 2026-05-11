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
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { SPACING } from "../../../../types/constants/ui";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import {
  formatBilingualText,
  getEnhancedKoreanOverlayStyles,
  getResponsiveSpacing,
} from "../../../../utils/koreanThemeHelpers";
import { getMobileKoreanFontSize } from "../../../../utils/mobileUIUtils";
import { getSafeAreaPadding } from "../../../../utils/safeAreaUtils";
import {
  getNeonTextShadow,
  getSmoothTransition,
} from "../../../../utils/visualEffects";

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
  /** Viewport width for Super HD font scaling */
  readonly width?: number;
  /** Distance to training dummy in meters (for distance-based hit feedback) */
  readonly distanceToDummy?: number;
  /** Effective reach for current technique in meters */
  readonly effectiveReach?: number;
}

/**
 * TrainingStatsOverlayHtml Component
 *
 * Html overlay displaying training performance metrics with Korean theming.
 * All colors use KOREAN_COLORS constants for consistency.
 *
 * Optimized with React.memo for 60fps performance:
 * - Memoized with custom comparison function
 * - Only re-renders when stats actually change
 * - Reduces unnecessary DOM updates
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
export const TrainingStatsOverlayHtml =
  React.memo<TrainingStatsOverlayHtmlProps>(
    ({
      stats,
      isMobile,
      width = 375,
      distanceToDummy,
      effectiveReach = 0.7, // Default punch reach
    }) => {
      const panelWidth = width > 10 ? width : isMobile ? 180 : 200;
      const padding = getResponsiveSpacing("sm", isMobile);
      const gap = getResponsiveSpacing("xs", isMobile);

      const safeAreaStyles = useMemo(
        () => (isMobile ? getSafeAreaPadding(["top"], padding) : {}),
        [isMobile, padding],
      );

      const formattedAccuracy = useMemo(
        () => stats.accuracy.toFixed(1),
        [stats.accuracy],
      );

      const formattedDuration = useMemo(() => {
        if (!stats.sessionDuration) return "00:00";
        const minutes = Math.floor(stats.sessionDuration / 60);
        const seconds = stats.sessionDuration % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }, [stats.sessionDuration]);

      const distanceInfo = useMemo(() => {
        if (distanceToDummy === undefined) return null;
        const isInRange = distanceToDummy <= effectiveReach;
        return {
          formatted: distanceToDummy.toFixed(2),
          isInRange,
          rangeStatus: isInRange
            ? "사정거리 내 | In Range"
            : "사정거리 밖 | Out of Range",
        };
      }, [distanceToDummy, effectiveReach]);

      const perfectRate = useMemo(() => {
        const totalAttempts = stats.hits + stats.misses;
        if (totalAttempts === 0 || !stats.perfectStrikes) return "0";
        return ((stats.perfectStrikes / totalAttempts) * 100).toFixed(1);
      }, [stats.hits, stats.misses, stats.perfectStrikes]);

      const panelStyle: React.CSSProperties = {
        ...getEnhancedKoreanOverlayStyles({
          opacity: 0.92,
          glowIntensity: "medium",
          includeGradient: false,
          includeBackdropBlur: true,
          depthLayers: 3,
        }),
        ...safeAreaStyles,
        width: `${panelWidth}px`,
        padding: `${padding}px`,
      };

      const titleFontSize = isMobile
        ? getMobileKoreanFontSize("SMALL", width ?? 375) // 16px minimum
        : 18;

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
                textShadow: getNeonTextShadow(
                  KOREAN_COLORS.ACCENT_GOLD,
                  "medium",
                ),
                transition: getSmoothTransition("all", "normal"),
              }}
            >
              {formatBilingualText("훈련 통계", "Training Statistics", "pipe")}
            </div>
          </div>

          {/* Stats Grid with consistent Korean theming */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: `${gap}px`,
            }}
          >
            {/* Score - 점수 */}
            <StatRow
              korean="점수"
              english="Score"
              value={stats.score.toLocaleString()}
              color={KOREAN_COLORS.ACCENT_GOLD}
              isMobile={isMobile}
              width={width}
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
              width={width}
            />

            {/* Hits - 성공 */}
            <StatRow
              korean="성공"
              english="Hits"
              value={stats.hits.toString()}
              color={KOREAN_COLORS.ACCENT_GREEN}
              isMobile={isMobile}
              width={width}
            />

            {/* Misses - 실패 */}
            <StatRow
              korean="실패"
              english="Misses"
              value={stats.misses.toString()}
              color={KOREAN_COLORS.TEXT_TERTIARY}
              isMobile={isMobile}
              width={width}
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
              width={width}
            />

            {/* Session Duration - 시간 */}
            {stats.sessionDuration !== undefined && (
              <StatRow
                korean="시간"
                english="Duration"
                value={formattedDuration}
                color={KOREAN_COLORS.PRIMARY_CYAN}
                isMobile={isMobile}
                width={width}
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
                width={width}
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
                width={width}
              />
            )}

            {/* Distance to Dummy - 거리 */}
            {distanceInfo && (
              <>
                <StatRow
                  korean="거리"
                  english="Distance"
                  value={`${distanceInfo.formatted}m`}
                  color={
                    distanceInfo.isInRange
                      ? KOREAN_COLORS.ACCENT_GREEN
                      : KOREAN_COLORS.ACCENT_RED
                  }
                  isMobile={isMobile}
                  width={width}
                />
                <StatRow
                  korean="상태"
                  english="Status"
                  value={
                    distanceInfo.rangeStatus.split(" | ")[isMobile ? 0 : 1]
                  }
                  color={
                    distanceInfo.isInRange
                      ? KOREAN_COLORS.ACCENT_GREEN
                      : KOREAN_COLORS.ACCENT_RED
                  }
                  isMobile={isMobile}
                  width={width}
                />
              </>
            )}
          </div>
        </div>
      );
    },
    (prevProps, nextProps) => {
      return (
        prevProps.stats.score === nextProps.stats.score &&
        prevProps.stats.combo === nextProps.stats.combo &&
        prevProps.stats.hits === nextProps.stats.hits &&
        prevProps.stats.misses === nextProps.stats.misses &&
        prevProps.stats.accuracy === nextProps.stats.accuracy &&
        prevProps.stats.sessionDuration === nextProps.stats.sessionDuration &&
        prevProps.stats.bestCombo === nextProps.stats.bestCombo &&
        prevProps.stats.perfectStrikes === nextProps.stats.perfectStrikes &&
        prevProps.isMobile === nextProps.isMobile &&
        prevProps.width === nextProps.width &&
        prevProps.distanceToDummy === nextProps.distanceToDummy &&
        prevProps.effectiveReach === nextProps.effectiveReach
      );
    },
  );

TrainingStatsOverlayHtml.displayName = "TrainingStatsOverlayHtml";

/**
 * Single stat row component with Korean theming
 *
 * Uses KOREAN_COLORS constants for all text colors
 * Enhanced with smooth transitions and neon glow on value
 *
 * Optimized with React.memo for performance
 *
 * @korean 통계행컴포넌트
 */
const StatRow = React.memo<{
  korean: string;
  english: string;
  value: string;
  color: number; // Numeric hex color from KOREAN_COLORS (e.g., 0x00ffff)
  isMobile: boolean;
  width: number; // Width for Super HD font scaling
}>(({ korean, english, value, color, isMobile, width }) => {
  const labelFontSize = isMobile
    ? getMobileKoreanFontSize("SMALL", width) // 16px minimum
    : 14;
  const sublabelFontSize = isMobile ? 12 : 11; // Increased from 8-9px
  const valueFontSize = isMobile
    ? getMobileKoreanFontSize("MEDIUM", width) // 18px minimum
    : 20;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: `${SPACING.SM}px`,
        borderBottom: `1px solid ${hexToRgbaString(KOREAN_COLORS.TEXT_PRIMARY, 0.1)}`,
        transition: getSmoothTransition("all", "normal"),
      }}
    >
      <div>
        <div
          style={{
            fontSize: `${labelFontSize}px`,
            color: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN),
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
            textShadow: getNeonTextShadow(KOREAN_COLORS.PRIMARY_CYAN, "subtle"),
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
          textShadow: getNeonTextShadow(color, "medium"),
          transition: getSmoothTransition("transform, color", "normal"),
          transform: "scale(1)",
        }}
      >
        {value}
      </div>
    </div>
  );
});

StatRow.displayName = "StatRow";

export default TrainingStatsOverlayHtml;
