import React from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import type { CombatStatsProps } from "../../../types/components";

// Ensure PixiJS components are extended
import { extendPixiComponents } from "../../../utils/pixiExtensions";
extendPixiComponents();

const CombatStats: React.FC<CombatStatsProps> = ({
  players,
  combatLog,
  x = 0,
  y = 0,
  width = 300,
  height = 160,
}) => {
  return (
    <pixiContainer x={x} y={y} data-testid="combat-stats">
      {/* Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
          g.roundRect(0, 0, width, height, 8);
          g.fill();
          g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.6 });
          g.roundRect(0, 0, width, height, 8);
          g.stroke();
        }}
      />

      {/* Title */}
      <pixiText
        text="전투 통계 (Combat Stats)"
        style={{
          fontSize: 14,
          fill: KOREAN_COLORS.ACCENT_GOLD,
          fontWeight: "bold",
          align: "center",
        }}
        x={width / 2}
        y={10}
        anchor={0.5}
      />

      {/* Player 1 Stats */}
      <pixiContainer x={10} y={35} data-testid="player1-stats">
        <pixiText
          text={players[0].name.korean}
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
          }}
          y={0}
        />
        <pixiText
          text={`데미지: ${players[0].combatStats.totalDamage}`}
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          y={15}
        />
        <pixiText
          text={`크리티컬: ${players[0].combatStats.criticalHits}`}
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          y={30}
        />
        <pixiText
          text={`승리: ${players[0].wins || 0}승`}
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          y={45}
        />
      </pixiContainer>

      {/* Player 2 Stats */}
      <pixiContainer x={width / 2 + 10} y={35} data-testid="player2-stats">
        <pixiText
          text={players[1].name.korean}
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
          }}
          y={0}
        />
        <pixiText
          text={`데미지: ${players[1].combatStats.totalDamage}`}
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          y={15}
        />
        <pixiText
          text={`크리티컬: ${players[1].combatStats.criticalHits}`}
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          y={30}
        />
        <pixiText
          text={`승리: ${players[1].wins || 0}승`}
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
          y={45}
        />
      </pixiContainer>

      {/* Combat Log Preview */}
      <pixiContainer x={10} y={90} data-testid="combat-log-preview">
        <pixiText
          text="최근 로그:"
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontWeight: "bold",
          }}
          y={0}
        />
        {combatLog.slice(-3).map((log, index) => (
          <pixiText
            key={index}
            text={log.substring(0, 25) + (log.length > 25 ? "..." : "")}
            style={{
              fontSize: 9,
              fill: KOREAN_COLORS.TEXT_TERTIARY,
            }}
            y={15 + index * 12}
          />
        ))}
      </pixiContainer>
    </pixiContainer>
  );
};

export default CombatStats;
export default CombatStats;
