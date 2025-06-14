import React, { useCallback } from "react";
import * as PIXI from "pixi.js";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import { KOREAN_COLORS } from "../../../types/constants";
import type { PlayerState } from "../../../types/player";

export interface CombatStatsProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly combatLog: readonly string[];
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
}

export const CombatStats: React.FC<CombatStatsProps> = ({
  players,
  combatLog,
  x = 0,
  y = 0,
  width = 300,
  height = 160,
}) => {
  usePixiExtensions();

  const panelDraw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.92);
      g.lineStyle(2, KOREAN_COLORS.ACCENT_CYAN, 0.6);
      g.drawRoundedRect(0, 0, width, height, 10);
      g.endFill();

      // Traditional Korean pattern
      g.lineStyle(1, KOREAN_COLORS.ACCENT_GOLD, 0.2);
      g.drawCircle(width / 2, 25, 15);
      g.moveTo(width / 2 - 15, 25);
      g.arc(width / 2, 25, 15, Math.PI, 0);
    },
    [width, height]
  );

  const logPanelDraw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.7);
      g.drawRoundedRect(0, 0, width - 20, 80, 5);
      g.endFill();
    },
    [width]
  );

  // Calculate accuracy safely
  const calculateAccuracy = (player: PlayerState) => {
    const hits = player.hitsLanded || 0;
    const total = hits + (player.hitsTaken || 0);
    return total > 0 ? Math.round((hits / total) * 100) : 0;
  };

  return (
    <pixiContainer x={x} y={y} data-testid="combat-stats">
      {/* Main Panel */}
      <pixiGraphics draw={panelDraw} />

      {/* Title */}
      <pixiText
        text="전투 현황 Combat Status"
        style={{
          fontSize: 14,
          fill: KOREAN_COLORS.ACCENT_GOLD,
          fontWeight: "bold",
          align: "center",
        }}
        x={width / 2}
        y={8}
        anchor={0.5}
      />

      {/* Combat Log */}
      <pixiContainer x={10} y={45}>
        <pixiText
          text="전투 기록"
          style={{
            fontSize: 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
        />
        <pixiGraphics draw={logPanelDraw} y={12} />

        {combatLog.slice(-4).map((entry, index) => (
          <pixiText
            key={index}
            text={entry}
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
            }}
            x={5}
            y={20 + index * 12}
          />
        ))}
      </pixiContainer>

      {/* Performance Comparison */}
      <pixiContainer x={10} y={height - 30}>
        <pixiText
          text="성능 비교"
          style={{
            fontSize: 9,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
          }}
        />

        {/* Accuracy comparison */}
        <pixiText
          text={`정확도: P1 ${calculateAccuracy(players[0])}%`}
          style={{
            fontSize: 7,
            fill: KOREAN_COLORS.PLAYER_1_COLOR,
          }}
          y={12}
        />

        <pixiText
          text={`P2 ${calculateAccuracy(players[1])}%`}
          style={{
            fontSize: 7,
            fill: KOREAN_COLORS.PLAYER_2_COLOR,
          }}
          x={width - 80}
          y={12}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default CombatStats;
