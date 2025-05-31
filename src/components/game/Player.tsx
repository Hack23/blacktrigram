import { useCallback } from "react";
import {
  PixiContainerComponent,
  PixiGraphicsComponent,
  PixiTextComponent,
} from "../ui/base/PixiComponents";
import type { Graphics as PixiGraphics } from "pixi.js";
import {
  KOREAN_COLORS,
  TRIGRAM_DATA,
  type PlayerState,
  type TrigramStance,
} from "../../types";

export interface PlayerProps {
  readonly playerState: PlayerState;
  readonly isPlayer1: boolean;
  readonly onAttack: (
    damage: number,
    position: { x: number; y: number }
  ) => void;
  readonly onStanceChange: (stance: TrigramStance) => void;
}

export function Player({
  playerState,
  isPlayer1,
  onAttack,
}: PlayerProps): React.ReactElement {
  const currentTrigram = TRIGRAM_DATA[playerState.stance];

  const drawPlayer = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      // Player body (Korean martial arts uniform - dobok)
      g.setFillStyle({
        color: KOREAN_COLORS.WHITE,
        alpha: 0.9,
      });
      g.rect(-25, -90, 50, 90);
      g.fill();

      // Belt color based on player
      const beltColor = isPlayer1
        ? KOREAN_COLORS.PLAYER_1_BLUE
        : KOREAN_COLORS.PLAYER_2_RED;
      g.setFillStyle({ color: beltColor });
      g.rect(-27, -25, 54, 10);
      g.fill();

      // Stance aura
      if (playerState.isAttacking) {
        g.setStrokeStyle({
          color: currentTrigram.color,
          width: 4,
          alpha: 0.8,
        });
        g.circle(0, -45, 50);
        g.stroke();
      }

      // Health indicator
      const healthPercent = playerState.health / playerState.maxHealth;
      if (healthPercent < 0.3) {
        g.setStrokeStyle({
          color: KOREAN_COLORS.CRITICAL_RED,
          width: 2,
          alpha: 0.6,
        });
        g.circle(0, -45, 55);
        g.stroke();
      }
    },
    [playerState, isPlayer1, currentTrigram.color]
  );

  const handlePlayerClick = useCallback(() => {
    if (!playerState.isAttacking) {
      const technique = currentTrigram.technique;
      onAttack(technique.damage, playerState.position);
    }
  }, [
    currentTrigram.technique,
    onAttack,
    playerState.position,
    playerState.isAttacking,
  ]);

  return (
    <PixiContainerComponent
      x={playerState.position.x}
      y={playerState.position.y}
      interactive={true}
      onClick={handlePlayerClick}
    >
      {/* Player visual */}
      <PixiGraphicsComponent draw={drawPlayer} />

      {/* Player ID */}
      <PixiTextComponent
        text={playerState.playerId}
        y={-110}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 12,
          fill: isPlayer1
            ? KOREAN_COLORS.PLAYER_1_BLUE
            : KOREAN_COLORS.PLAYER_2_RED,
          fontWeight: "bold",
        }}
      />

      {/* Current stance */}
      <PixiTextComponent
        text={`${currentTrigram.symbol} ${currentTrigram.korean}`}
        y={20}
        anchor={{ x: 0.5, y: 0.5 }}
        style={{
          fontFamily: "Noto Sans KR, Arial, sans-serif",
          fontSize: 14,
          fill: currentTrigram.color,
          fontWeight: "bold",
        }}
      />

      {/* Health bar */}
      <PixiGraphicsComponent
        y={40}
        draw={(g: PixiGraphics) => {
          g.clear();

          const healthPercent = playerState.health / playerState.maxHealth;
          const barWidth = 60;
          const barHeight = 6;

          // Background
          g.setFillStyle({ color: KOREAN_COLORS.GRAY_DARK });
          g.rect(-barWidth / 2, 0, barWidth, barHeight);
          g.fill();

          // Health fill
          const healthColor =
            healthPercent > 0.6
              ? KOREAN_COLORS.Green
              : healthPercent > 0.3
              ? KOREAN_COLORS.Orange
              : KOREAN_COLORS.Red;

          g.setFillStyle({ color: healthColor });
          g.rect(
            -barWidth / 2 + 1,
            1,
            (barWidth - 2) * healthPercent,
            barHeight - 2
          );
          g.fill();
        }}
      />
    </PixiContainerComponent>
  );
}
