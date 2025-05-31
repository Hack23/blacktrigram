import { useCallback } from "react";
import {
  PixiContainerComponent,
  PixiGraphicsComponent,
  PixiTextComponent,
} from "../ui/base/PixiComponents";
import type { Graphics as PixiGraphics } from "pixi.js";
import { KOREAN_COLORS, TRIGRAM_DATA, type PlayerState } from "../../types";

export interface PlayerVisualsProps {
  readonly playerState: PlayerState;
  readonly isPlayer1: boolean;
}

export function PlayerVisuals({
  playerState,
  isPlayer1,
}: PlayerVisualsProps): React.ReactElement {
  const currentTrigram = TRIGRAM_DATA[playerState.stance];

  const drawPlayerBody = useCallback(
    (g: PixiGraphics) => {
      g.clear();

      // Korean martial arts uniform (dobok)
      g.setFillStyle({
        color: KOREAN_COLORS.WHITE,
        alpha: 0.9,
      });
      g.rect(-25, -90, 50, 90);
      g.fill();

      // Belt indicating player
      const beltColor = isPlayer1
        ? KOREAN_COLORS.PLAYER_1_BLUE
        : KOREAN_COLORS.PLAYER_2_RED;
      g.setFillStyle({ color: beltColor });
      g.rect(-27, -25, 54, 10);
      g.fill();

      // Stance aura effect
      if (playerState.isAttacking) {
        g.setStrokeStyle({
          color: currentTrigram.color,
          width: 3,
          alpha: 0.7,
        });
        g.circle(0, -45, 40);
        g.stroke();
      }
    },
    [playerState.isAttacking, isPlayer1, currentTrigram.color]
  );

  return (
    <PixiContainerComponent
      x={playerState.position.x}
      y={playerState.position.y}
      alpha={playerState.visible !== false ? 1 : 0.5}
    >
      {/* Player body */}
      <PixiGraphicsComponent draw={drawPlayerBody} />

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

      {/* Current stance display */}
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
    </PixiContainerComponent>
  );
}
