import React, { useCallback, useMemo } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import type { PlayerState } from "../../../types/player";
import { KOREAN_COLORS } from "../../../types/constants";

extend({ Container, Graphics, Text });

export interface CombatStatsProps {
  readonly players: readonly [PlayerState, PlayerState];
  readonly combatLog: readonly string[];
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
}

const calculateAccuracy = (player: PlayerState): number => {
  const totalAttempts = (player.hitsLanded || 0) + (player.hitsTaken || 0);
  if (totalAttempts === 0) return 0;
  return Math.round(((player.hitsLanded || 0) / totalAttempts) * 100);
};

const calculateEffectiveness = (player: PlayerState): number => {
  const damageDealt = player.totalDamageDealt || 0;
  const damageReceived = player.totalDamageReceived || 0;
  const totalDamage = damageDealt + damageReceived;

  if (totalDamage === 0) return 0;
  return Math.round((damageDealt / totalDamage) * 100);
};

export const CombatStats: React.FC<CombatStatsProps> = ({
  players,
  combatLog,
  x = 0,
  y = 0,
  width = 300,
  height = 160,
}) => {
  usePixiExtensions();

  const [player1, player2] = players;

  // Enhanced mobile responsiveness
  const isMobile = width < 400;
  const fontSize = {
    title: isMobile ? 10 : 12,
    log: isMobile ? 7 : 9,
    stats: isMobile ? 6 : 8,
    labels: isMobile ? 7 : 9,
  };

  const drawBackground = useCallback(
    (g: any) => {
      g.clear();
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
      g.roundRect(0, 0, width, height, 8);
      g.fill();

      g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.6 });
      g.roundRect(0, 0, width, height, 8);
      g.stroke();
    },
    [width, height]
  );

  const visibleLog = useMemo(() => combatLog.slice(-5), [combatLog]);

  // Enhanced combat statistics calculations
  const player1Stats = useMemo(
    () => ({
      accuracy: calculateAccuracy(player1),
      effectiveness: calculateEffectiveness(player1),
      hitRatio: (player1.hitsLanded || 0) / Math.max(1, player1.hitsTaken || 0),
      survivalRate: (player1.health / player1.maxHealth) * 100,
    }),
    [player1]
  );

  const player2Stats = useMemo(
    () => ({
      accuracy: calculateAccuracy(player2),
      effectiveness: calculateEffectiveness(player2),
      hitRatio: (player2.hitsLanded || 0) / Math.max(1, player2.hitsTaken || 0),
      survivalRate: (player2.health / player2.maxHealth) * 100,
    }),
    [player2]
  );

  return (
    <pixiContainer x={x} y={y} data-testid="combat-stats">
      <pixiGraphics draw={drawBackground} />

      {/* Enhanced combat log with better mobile layout */}
      <pixiContainer x={10} y={8}>
        <pixiText
          text="전투 기록 - Combat Log"
          style={{
            fontSize: fontSize.title,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
          }}
        />

        {visibleLog.map((entry, index) => (
          <pixiText
            key={index}
            text={entry}
            style={{
              fontSize: fontSize.log,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              wordWrap: true,
              wordWrapWidth: width - 20,
              fontFamily: "Noto Sans KR",
            }}
            x={0}
            y={18 + index * (isMobile ? 10 : 12)}
          />
        ))}
      </pixiContainer>

      {/* Enhanced player statistics comparison */}
      <pixiContainer x={10} y={height - (isMobile ? 70 : 60)}>
        <pixiText
          text="전투 분석 - Combat Analysis"
          style={{
            fontSize: fontSize.labels,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Noto Sans KR",
          }}
        />

        {/* Player 1 Statistics */}
        <pixiContainer y={12}>
          <pixiText
            text={`${player1.name.korean}`}
            style={{
              fontSize: fontSize.stats,
              fill: KOREAN_COLORS.PLAYER_1_COLOR,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
          />

          <pixiText
            text={`정확도: ${player1Stats.accuracy}% | 효과도: ${player1Stats.effectiveness}%`}
            style={{
              fontSize: fontSize.stats - 1,
              fill: KOREAN_COLORS.PLAYER_1_COLOR,
            }}
            y={10}
          />

          <pixiText
            text={`체력: ${Math.round(player1.health)}/${
              player1.maxHealth
            } (${Math.round(player1Stats.survivalRate)}%)`}
            style={{
              fontSize: fontSize.stats - 1,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
            y={20}
          />
        </pixiContainer>

        {/* Player 2 Statistics */}
        <pixiContainer x={width - 140} y={12}>
          <pixiText
            text={`${player2.name.korean}`}
            style={{
              fontSize: fontSize.stats,
              fill: KOREAN_COLORS.PLAYER_2_COLOR,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
              align: "right",
            }}
          />

          <pixiText
            text={`정확도: ${player2Stats.accuracy}% | 효과도: ${player2Stats.effectiveness}%`}
            style={{
              fontSize: fontSize.stats - 1,
              fill: KOREAN_COLORS.PLAYER_2_COLOR,
              align: "right",
            }}
            y={10}
          />

          <pixiText
            text={`체력: ${Math.round(player2.health)}/${
              player2.maxHealth
            } (${Math.round(player2Stats.survivalRate)}%)`}
            style={{
              fontSize: fontSize.stats - 1,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "right",
            }}
            y={20}
          />
        </pixiContainer>

        {/* Combat effectiveness comparison bar */}
        <pixiContainer y={35}>
          <pixiGraphics
            draw={(g) => {
              g.clear();

              const barWidth = width - 20;
              const barHeight = 4;
              const player1Effectiveness = player1Stats.effectiveness;
              const player2Effectiveness = player2Stats.effectiveness;
              const totalEffectiveness =
                player1Effectiveness + player2Effectiveness;

              if (totalEffectiveness > 0) {
                const player1Width =
                  (player1Effectiveness / totalEffectiveness) * barWidth;

                // Player 1 effectiveness
                g.fill({ color: KOREAN_COLORS.PLAYER_1_COLOR, alpha: 0.8 });
                g.rect(0, 0, player1Width, barHeight);
                g.fill();

                // Player 2 effectiveness
                g.fill({ color: KOREAN_COLORS.PLAYER_2_COLOR, alpha: 0.8 });
                g.rect(player1Width, 0, barWidth - player1Width, barHeight);
                g.fill();
              } else {
                // Equal when no data
                g.fill({ color: KOREAN_COLORS.UI_GRAY, alpha: 0.5 });
                g.rect(0, 0, barWidth, barHeight);
                g.fill();
              }

              // Border
              g.stroke({
                width: 1,
                color: KOREAN_COLORS.UI_BORDER,
                alpha: 0.6,
              });
              g.rect(0, 0, barWidth, barHeight);
              g.stroke();
            }}
          />
        </pixiContainer>
      </pixiContainer>
    </pixiContainer>
  );
};

// Fix: Remove duplicate default exports - keep only one
export default CombatStats;
