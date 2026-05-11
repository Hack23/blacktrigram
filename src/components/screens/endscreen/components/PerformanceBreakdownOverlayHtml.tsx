import React, { useMemo } from "react";
import { MatchStatistics } from "../../../../systems/combat";
import { PlayerMatchStats } from "../../../../systems/player";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { hexToRgbaString } from "../../../../utils/colorUtils";

export interface PerformanceBreakdownProps {
  readonly matchStats: MatchStatistics;
  readonly isMobile: boolean;
  readonly isTablet: boolean;
}

/**
 * Helper to convert hex color to CSS string
 */
const toCssColor = (hex: number): string => hexToRgbaString(hex, 1);

/**
 * Category rating component
 */
interface CategoryRatingProps {
  readonly category: string;
  readonly korean: string;
  readonly value: number;
  readonly maxValue: number;
  readonly color: number;
  readonly fontSize: number;
}

const CategoryRating: React.FC<CategoryRatingProps> = ({
  category,
  korean,
  value,
  maxValue,
  color,
  fontSize,
}) => {
  const percentage = Math.round((value / maxValue) * 100);
  const grade = percentage >= 90 ? "S" : percentage >= 75 ? "A" : percentage >= 60 ? "B" : "C";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
      }}
      data-testid={`category-${category.toLowerCase()}`}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: fontSize - 2,
          color: toCssColor(KOREAN_COLORS.TEXT_SECONDARY),
        }}
      >
        <span>{korean} | {category}</span>
        <span
          style={{
            fontWeight: "bold",
            color: toCssColor(color),
            fontSize: fontSize + 2,
          }}
        >
          {grade}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "8px",
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.5),
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: toCssColor(color),
            transition: "width 0.5s ease-out",
          }}
          data-testid={`progress-${category.toLowerCase()}`}
        />
      </div>
    </div>
  );
};

/**
 * Calculate category scores from match statistics
 */
function calculateCategoryScores(stats: PlayerMatchStats) {
  const offense = Math.min(
    (stats.totalDamageDealt / 100) * 50 + (stats.hitsLanded / 10) * 50,
    100
  );

  const defenseRaw = Math.max(0, 100 - stats.totalDamageReceived / 2);
  const defense = Math.min(defenseRaw, 100);

  const technique = Math.min(
    stats.perfectStrikes * 15 + stats.vitalPointHits * 10,
    100
  );

  const damageRatio =
    stats.totalDamageReceived > 0
      ? stats.totalDamageDealt / stats.totalDamageReceived
      : stats.totalDamageDealt > 0
      ? 2
      : 0;
  const efficiency = Math.min(damageRatio * 40, 100);

  return { offense, defense, technique, efficiency };
}

/**
 * Performance Breakdown Component
 * Provides detailed analysis of combat performance by category
 */
export const PerformanceBreakdown: React.FC<PerformanceBreakdownProps> = ({
  matchStats,
  isMobile,
  isTablet,
}) => {
  const fontSize = isMobile ? 12 : isTablet ? 13 : 14;
  const labelFontSize = isMobile ? 14 : isTablet ? 16 : 18;
  const padding = isMobile ? 12 : isTablet ? 15 : 18;

  const winnerStats = useMemo(
    () => (matchStats.winner === 0 ? matchStats.player1 : matchStats.player2),
    [matchStats]
  );

  const scores = useMemo(
    () => calculateCategoryScores(winnerStats),
    [winnerStats]
  );

  const techniqueCount = winnerStats.techniques?.length ?? 0;
  const uniqueTechniques = useMemo(() => {
    if (!winnerStats.techniques || winnerStats.techniques.length === 0) {
      return 0;
    }
    return new Set(winnerStats.techniques).size;
  }, [winnerStats.techniques]);

  return (
    <div
      data-testid="performance-breakdown"
      style={{
        width: isMobile ? "95%" : isTablet ? "80%" : "70%",
        maxWidth: "900px",
        background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9),
        border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6)}`,
        borderRadius: "12px",
        padding: padding * 1.5,
        marginBottom: padding,
        fontFamily: FONT_FAMILY.KOREAN,
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: labelFontSize + 2,
          fontWeight: "bold",
          color: toCssColor(KOREAN_COLORS.PRIMARY_CYAN),
          textAlign: "center",
          marginBottom: padding * 1.5,
        }}
        data-testid="breakdown-title"
      >
        전투 분석 | Performance Breakdown
      </div>

      {/* Category Ratings */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: padding,
          marginBottom: padding * 1.5,
        }}
        data-testid="category-ratings"
      >
        <CategoryRating
          category="Offense"
          korean="공격"
          value={scores.offense}
          maxValue={100}
          color={KOREAN_COLORS.ACCENT_RED}
          fontSize={fontSize}
        />
        <CategoryRating
          category="Defense"
          korean="방어"
          value={scores.defense}
          maxValue={100}
          color={KOREAN_COLORS.ACCENT_BLUE}
          fontSize={fontSize}
        />
        <CategoryRating
          category="Technique"
          korean="기술"
          value={scores.technique}
          maxValue={100}
          color={KOREAN_COLORS.ACCENT_GOLD}
          fontSize={fontSize}
        />
        <CategoryRating
          category="Efficiency"
          korean="효율"
          value={scores.efficiency}
          maxValue={100}
          color={KOREAN_COLORS.PRIMARY_CYAN}
          fontSize={fontSize}
        />
      </div>

      {/* Technique Analysis */}
      <div
        style={{
          padding,
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.4),
          borderRadius: "8px",
        }}
        data-testid="technique-analysis"
      >
        <div
          style={{
            fontSize: labelFontSize,
            fontWeight: "bold",
            color: toCssColor(KOREAN_COLORS.ACCENT_GOLD),
            marginBottom: padding / 2,
            textAlign: "center",
          }}
        >
          기술 사용 분석 | Technique Analysis
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
            gap: padding,
            marginTop: padding,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: fontSize + 6,
                fontWeight: "bold",
                color: toCssColor(KOREAN_COLORS.PRIMARY_CYAN),
              }}
            >
              {techniqueCount}
            </div>
            <div
              style={{
                fontSize: fontSize - 2,
                color: toCssColor(KOREAN_COLORS.TEXT_TERTIARY),
              }}
            >
              총 기술 | Total Uses
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: fontSize + 6,
                fontWeight: "bold",
                color: toCssColor(KOREAN_COLORS.ACCENT_GOLD),
              }}
            >
              {uniqueTechniques}
            </div>
            <div
              style={{
                fontSize: fontSize - 2,
                color: toCssColor(KOREAN_COLORS.TEXT_TERTIARY),
              }}
            >
              고유 기술 | Unique
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: fontSize + 6,
                fontWeight: "bold",
                color: toCssColor(KOREAN_COLORS.VITAL_POINT_HIT),
              }}
            >
              {winnerStats.vitalPointHits ?? 0}
            </div>
            <div
              style={{
                fontSize: fontSize - 2,
                color: toCssColor(KOREAN_COLORS.TEXT_TERTIARY),
              }}
            >
              급소 타격 | Vital Hits
            </div>
          </div>
        </div>

        {/* Most Used Techniques */}
        {winnerStats.techniques && winnerStats.techniques.length > 0 && (
          <div
            style={{
              marginTop: padding,
              paddingTop: padding,
              borderTop: `1px solid ${hexToRgbaString(
                KOREAN_COLORS.UI_BORDER,
                0.3
              )}`,
            }}
          >
            <div
              style={{
                fontSize: fontSize - 2,
                color: toCssColor(KOREAN_COLORS.TEXT_TERTIARY),
                marginBottom: padding / 2,
              }}
            >
              주요 기술 | Primary Techniques:
            </div>
            <div
              style={{
                fontSize: fontSize,
                color: toCssColor(KOREAN_COLORS.TEXT_SECONDARY),
                lineHeight: 1.6,
              }}
            >
              {winnerStats.techniques.slice(0, 5).join(", ")}
              {winnerStats.techniques.length > 5 && "..."}
            </div>
          </div>
        )}
      </div>

      {/* Combat Effectiveness Summary */}
      <div
        style={{
          marginTop: padding,
          padding,
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.4),
          borderRadius: "8px",
          textAlign: "center",
        }}
        data-testid="effectiveness-summary"
      >
        <div
          style={{
            fontSize: fontSize - 2,
            color: toCssColor(KOREAN_COLORS.TEXT_TERTIARY),
            marginBottom: padding / 4,
          }}
        >
          전투 효율성 | Combat Effectiveness
        </div>
        <div
          style={{
            fontSize: labelFontSize + 2,
            fontWeight: "bold",
            color: toCssColor(KOREAN_COLORS.ACCENT_GOLD),
          }}
        >
          {Math.round((scores.offense + scores.defense + scores.technique + scores.efficiency) / 4)}%
        </div>
      </div>
    </div>
  );
};
