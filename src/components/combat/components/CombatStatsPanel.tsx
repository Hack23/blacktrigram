import { PlayerState } from "@/systems";
import React, { useMemo } from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import { extendPixiComponents } from "../../../utils/pixiExtensions";

extendPixiComponents();

export interface CombatLogEntry {
  id: string;
  timestamp: number;
  korean: string;
  english: string;
  type: "attack" | "defend" | "technique" | "stance" | "damage" | "info";
  playerIndex?: number;
}

export interface CombatStatsPanelProps {
  readonly players: PlayerState[];
  readonly combatLog: CombatLogEntry[];
  readonly matchDuration: number;
  readonly totalDamageDealt: { player1: number; player2: number };
  readonly criticalHits: { player1: number; player2: number };
  readonly perfectStrikes: { player1: number; player2: number };
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
}

export const CombatStatsPanel: React.FC<CombatStatsPanelProps> = ({
  players,
  combatLog,
  matchDuration,
  totalDamageDealt,
  criticalHits,
  perfectStrikes,
  x = 0,
  y = 0,
  width = 320,
  height = 180,
}) => {
  const isMobile = width < 350;

  // Format match duration
  const formattedDuration = useMemo(() => {
    const minutes = Math.floor(matchDuration / 60);
    const seconds = matchDuration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [matchDuration]);

  // Get recent combat log entries
  const recentLog = useMemo(() => {
    return combatLog.slice(0, isMobile ? 3 : 5);
  }, [combatLog, isMobile]);

  // Get type-based colors for log entries
  const getLogColor = (type: string) => {
    switch (type) {
      case "attack":
        return KOREAN_COLORS.ACCENT_RED;
      case "defend":
        return KOREAN_COLORS.ACCENT_GREEN;
      case "technique":
        return KOREAN_COLORS.ACCENT_GOLD;
      case "stance":
        return KOREAN_COLORS.PRIMARY_CYAN;
      case "damage":
        return KOREAN_COLORS.ACCENT_RED;
      default:
        return KOREAN_COLORS.TEXT_SECONDARY;
    }
  };

  return (
    <pixiContainer x={x} y={y} data-testid="combat-stats">
      {/* Enhanced Background with animation pulse */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          // Pulsing glow effect
          const glowAlpha = 0.1 + Math.sin(Date.now() / 1000) * 0.05;
          g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha: glowAlpha });
          g.roundRect(-2, -2, width + 4, height + 4, 10);

          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
          g.roundRect(0, 0, width, height, 8);

          // Border with Korean pattern inspiration
          g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.6 });
          g.roundRect(0, 0, width, height, 8);

          // Decorative corner elements (Korean knot pattern)
          g.stroke({ width: 1, color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.4 });
          for (let i = 0; i < 4; i++) {
            const cornerX = i < 2 ? 10 : width - 20;
            const cornerY = i % 2 === 0 ? 10 : height - 20;
            g.moveTo(cornerX, cornerY);
            g.lineTo(cornerX + 10, cornerY);
            g.moveTo(cornerX, cornerY);
            g.lineTo(cornerX, cornerY + 10);
          }
          g.stroke();
        }}
      />

      {/* Bilingual Header */}
      <pixiContainer x={10} y={10}>
        <pixiText
          text="전투 통계"
          style={{
            fontSize: isMobile ? 12 : 16,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
          }}
        />
        <pixiText
          text="Combat Statistics"
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontStyle: "italic",
          }}
          y={isMobile ? 15 : 18}
        />
      </pixiContainer>

      {/* Real-time Match Info */}
      <pixiContainer x={width - 10} y={10}>
        <pixiText
          text={`경과 시간: ${formattedDuration}`}
          style={{
            fontSize: isMobile ? 8 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "right",
            fontFamily: "Noto Sans KR",
          }}
          anchor={{ x: 1, y: 0 }}
        />
        <pixiText
          text={`Duration: ${formattedDuration}`}
          style={{
            fontSize: isMobile ? 7 : 8,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
            align: "right",
            fontStyle: "italic",
          }}
          y={12}
          anchor={{ x: 1, y: 0 }}
        />
      </pixiContainer>

      {/* Combat Log Section */}
      <pixiContainer x={10} y={isMobile ? 35 : 40}>
        <pixiText
          text="전투 기록 | Combat Log"
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.PRIMARY_CYAN,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
          }}
        />

        {/* Log Entries */}
        <pixiContainer y={15}>
          {recentLog.length > 0 ? (
            recentLog.map((entry, index) => (
              <pixiContainer
                key={entry.id}
                y={index * (isMobile ? 16 : 18)}
                data-testid={`log-entry-${index}`}
              >
                {/* Korean text */}
                <pixiText
                  text={entry.korean}
                  style={{
                    fontSize: isMobile ? 8 : 10,
                    fill: getLogColor(entry.type),
                    fontFamily: "Noto Sans KR",
                  }}
                />
                {/* English text (smaller, below Korean) */}
                <pixiText
                  text={entry.english}
                  style={{
                    fontSize: isMobile ? 6 : 7,
                    fill: KOREAN_COLORS.TEXT_TERTIARY,
                    fontStyle: "italic",
                  }}
                  y={isMobile ? 9 : 11}
                />
              </pixiContainer>
            ))
          ) : (
            <pixiContainer>
              <pixiText
                text="전투 기록이 없습니다"
                style={{
                  fontSize: isMobile ? 8 : 10,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  fontStyle: "italic",
                  fontFamily: "Noto Sans KR",
                }}
              />
              <pixiText
                text="No combat records"
                style={{
                  fontSize: isMobile ? 6 : 8,
                  fill: KOREAN_COLORS.TEXT_TERTIARY,
                  fontStyle: "italic",
                }}
                y={12}
              />
            </pixiContainer>
          )}
        </pixiContainer>
      </pixiContainer>

      {/* Enhanced Player Statistics Comparison */}
      <pixiContainer x={10} y={height - 65}>
        <pixiGraphics
          draw={(g) => {
            g.clear();
            // Stats panel background
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.5 });
            g.roundRect(0, 0, width - 20, 55, 5);

            // Center divider
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.4,
            });
            g.moveTo((width - 20) / 2, 5);
            g.lineTo((width - 20) / 2, 50);
            g.stroke();
          }}
        />

        {/* Player 1 Stats */}
        <pixiContainer x={5} y={5}>
          <pixiText
            text={players[0]?.name?.korean || "플레이어 1"}
            style={{
              fontSize: isMobile ? 9 : 11,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontFamily: "Noto Sans KR",
              fontWeight: "bold",
            }}
          />
          <pixiText
            text={`승리: ${players[0]?.wins || 0} | 피해: ${
              totalDamageDealt.player1
            }`}
            style={{
              fontSize: isMobile ? 7 : 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
            }}
            y={13}
          />
          <pixiText
            text={`치명타: ${criticalHits.player1} | 완벽: ${perfectStrikes.player1}`}
            style={{
              fontSize: isMobile ? 7 : 8,
              fill: KOREAN_COLORS.ACCENT_CYAN,
              fontFamily: "Noto Sans KR",
            }}
            y={25}
          />
          <pixiText
            text={`Wins: ${players[0]?.wins || 0} | Dmg: ${
              totalDamageDealt.player1
            }`}
            style={{
              fontSize: isMobile ? 6 : 7,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
              fontStyle: "italic",
            }}
            y={37}
          />
        </pixiContainer>

        {/* Player 2 Stats */}
        <pixiContainer x={(width - 20) / 2 + 5} y={5}>
          <pixiText
            text={players[1]?.name?.korean || "플레이어 2"}
            style={{
              fontSize: isMobile ? 9 : 11,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              fontFamily: "Noto Sans KR",
              fontWeight: "bold",
            }}
          />
          <pixiText
            text={`승리: ${players[1]?.wins || 0} | 피해: ${
              totalDamageDealt.player2
            }`}
            style={{
              fontSize: isMobile ? 7 : 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
            }}
            y={13}
          />
          <pixiText
            text={`치명타: ${criticalHits.player2} | 완벽: ${perfectStrikes.player2}`}
            style={{
              fontSize: isMobile ? 7 : 8,
              fill: KOREAN_COLORS.ACCENT_CYAN,
              fontFamily: "Noto Sans KR",
            }}
            y={25}
          />
          <pixiText
            text={`Wins: ${players[1]?.wins || 0} | Dmg: ${
              totalDamageDealt.player2
            }`}
            style={{
              fontSize: isMobile ? 6 : 7,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
              fontStyle: "italic",
            }}
            y={37}
          />
        </pixiContainer>
      </pixiContainer>
    </pixiContainer>
  );
};

export default CombatStatsPanel;
