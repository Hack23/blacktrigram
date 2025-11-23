import React from "react";
import { MatchStatistics } from "../../../systems/combat";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";

export interface MatchStatisticsDisplayProps {
  readonly matchStats: MatchStatistics;
  readonly isMobile: boolean;
  readonly isTablet: boolean;
}

/**
 * Helper to convert hex color to CSS string
 */
const toCssColor = (hex: number): string => hexToRgbaString(hex, 1);

/**
 * Match Statistics Display Component
 * Shows detailed combat statistics for both players
 */
export const MatchStatisticsDisplay: React.FC<MatchStatisticsDisplayProps> = ({
  matchStats,
  isMobile,
  isTablet,
}) => {
  const fontSize = isMobile ? 12 : isTablet ? 14 : 16;
  const labelFontSize = isMobile ? 14 : isTablet ? 16 : 18;
  const padding = isMobile ? 10 : isTablet ? 15 : 20;
  const spacing = isMobile ? 8 : isTablet ? 10 : 12;

  const StatRow: React.FC<{ label: string; value: string | number; highlight?: boolean }> = ({
    label,
    value,
    highlight = false,
  }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing / 2,
        fontSize,
        color: toCssColor(highlight ? KOREAN_COLORS.ACCENT_GOLD : KOREAN_COLORS.TEXT_SECONDARY),
      }}
    >
      <span>{label}:</span>
      <span style={{ fontWeight: "bold", color: toCssColor(KOREAN_COLORS.TEXT_PRIMARY) }}>{value}</span>
    </div>
  );

  const PlayerStats: React.FC<{ playerNum: 1 | 2 }> = ({ playerNum }) => {
    const stats = playerNum === 1 ? matchStats.player1 : matchStats.player2;
    const isWinner = matchStats.winner === (playerNum - 1);

    return (
      <div
        style={{
          flex: 1,
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.6),
          border: `2px solid ${hexToRgbaString(
            isWinner ? KOREAN_COLORS.ACCENT_GOLD : KOREAN_COLORS.UI_BORDER,
            0.8
          )}`,
          borderRadius: "8px",
          padding,
        }}
        data-testid={`player${playerNum}-stats`}
      >
        <div
          style={{
            fontSize: labelFontSize,
            fontWeight: "bold",
            color: toCssColor(isWinner ? KOREAN_COLORS.ACCENT_GOLD : KOREAN_COLORS.PRIMARY_CYAN),
            marginBottom: spacing,
            textAlign: "center",
          }}
        >
          플레이어 {playerNum} | Player {playerNum}
          {isWinner && " 🏆"}
        </div>

        <StatRow label="승리 | Wins" value={stats.wins} highlight={stats.wins > 0} />
        <StatRow label="패배 | Losses" value={stats.losses} />
        <StatRow label="가한 피해 | Damage Dealt" value={stats.totalDamageDealt} />
        <StatRow label="받은 피해 | Damage Taken" value={stats.totalDamageReceived} />
        <StatRow label="명중 | Hits Landed" value={stats.hitsLanded} />
        <StatRow label="피격 | Hits Taken" value={stats.hitsTaken} />
        <StatRow
          label="완벽한 타격 | Perfect Strikes"
          value={stats.perfectStrikes}
          highlight={stats.perfectStrikes > 0}
        />
        <StatRow
          label="급소 공격 | Vital Point Hits"
          value={stats.vitalPointHits}
          highlight={stats.vitalPointHits > 0}
        />
        <StatRow label="연승 | Consecutive Wins" value={stats.consecutiveWins} />

        {stats.techniques && stats.techniques.length > 0 && (
          <div style={{ marginTop: spacing }}>
            <div
              style={{
                fontSize: fontSize - 2,
                color: toCssColor(KOREAN_COLORS.TEXT_TERTIARY),
                marginBottom: spacing / 2,
              }}
            >
              사용한 기술 | Techniques Used:
            </div>
            <div
              style={{
                fontSize: fontSize - 2,
                color: toCssColor(KOREAN_COLORS.TEXT_SECONDARY),
                paddingLeft: spacing,
              }}
            >
              {stats.techniques.slice(0, 5).join(", ")}
              {stats.techniques.length > 5 && "..."}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      data-testid="match-statistics-display"
      style={{
        width: isMobile ? "95%" : isTablet ? "80%" : "70%",
        maxWidth: "900px",
        background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9),
        border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6)}`,
        borderRadius: "12px",
        padding: padding * 1.5,
        marginBottom: spacing * 2,
        fontFamily: FONT_FAMILY.KOREAN,
      }}
    >
      {/* Overall Match Stats */}
      <div
        style={{
          fontSize: labelFontSize + 2,
          fontWeight: "bold",
          color: toCssColor(KOREAN_COLORS.PRIMARY_CYAN),
          textAlign: "center",
          marginBottom: spacing * 1.5,
        }}
      >
        경기 통계 | Match Statistics
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: spacing,
          marginBottom: spacing * 1.5,
          padding,
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.4),
          borderRadius: "8px",
        }}
        data-testid="overall-stats"
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: fontSize - 2, color: toCssColor(KOREAN_COLORS.TEXT_TERTIARY) }}>
            라운드 | Rounds
          </div>
          <div style={{ fontSize: labelFontSize, color: toCssColor(KOREAN_COLORS.TEXT_PRIMARY), fontWeight: "bold" }}>
            {matchStats.currentRound} / {matchStats.maxRounds}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: fontSize - 2, color: toCssColor(KOREAN_COLORS.TEXT_TERTIARY) }}>
            시간 | Duration
          </div>
          <div style={{ fontSize: labelFontSize, color: toCssColor(KOREAN_COLORS.TEXT_PRIMARY), fontWeight: "bold" }}>
            {Math.floor(matchStats.matchDuration / 60)}:
            {(matchStats.matchDuration % 60).toString().padStart(2, "0")}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: fontSize - 2, color: toCssColor(KOREAN_COLORS.TEXT_TERTIARY) }}>
            치명타 | Critical Hits
          </div>
          <div
            style={{
              fontSize: labelFontSize,
              color: toCssColor(KOREAN_COLORS.CRITICAL_HIT),
              fontWeight: "bold",
            }}
          >
            {matchStats.criticalHits}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: fontSize - 2, color: toCssColor(KOREAN_COLORS.TEXT_TERTIARY) }}>
            급소 공격 | Vital Hits
          </div>
          <div
            style={{
              fontSize: labelFontSize,
              color: toCssColor(KOREAN_COLORS.VITAL_POINT_HIT),
              fontWeight: "bold",
            }}
          >
            {matchStats.vitalPointHits}
          </div>
        </div>
      </div>

      {/* Player Stats Side by Side */}
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: spacing * 1.5,
        }}
      >
        <PlayerStats playerNum={1} />
        <PlayerStats playerNum={2} />
      </div>

      {/* Score Display */}
      <div
        style={{
          marginTop: spacing * 1.5,
          padding,
          background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.4),
          borderRadius: "8px",
          textAlign: "center",
        }}
        data-testid="final-score"
      >
        <div
          style={{
            fontSize: labelFontSize,
            color: toCssColor(KOREAN_COLORS.TEXT_SECONDARY),
            marginBottom: spacing / 2,
          }}
        >
          최종 점수 | Final Score
        </div>
        <div
          style={{
            fontSize: labelFontSize + 4,
            fontWeight: "bold",
            color: toCssColor(KOREAN_COLORS.ACCENT_GOLD),
          }}
        >
          {matchStats.finalScore.player1} - {matchStats.finalScore.player2}
        </div>
      </div>
    </div>
  );
};
