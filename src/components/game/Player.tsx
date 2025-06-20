// Complete Player component with Korean martial arts character rendering

import React from "react";
import { KOREAN_COLORS } from "../../types/constants";
import type { PlayerState } from "../../types/player";
import usePixiExtensions from "../../utils/pixiExtensions";

export interface PlayerProps {
  readonly player: PlayerState;
  readonly x: number;
  readonly y: number;
  readonly onClick?: () => void;
}

export const Player: React.FC<PlayerProps> = ({ player, x, y, onClick }) => {
  usePixiExtensions();

  return (
    <pixiContainer x={x} y={y} data-testid="player">
      {/* Player body */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.8 });
          g.rect(-30, -60, 60, 120);
          g.fill();
        }}
        interactive={true}
        onPointerDown={onClick}
      />

      {/* Player name */}
      <pixiText
        text={player.name.korean}
        style={{
          fontSize: 14,
          fill: KOREAN_COLORS.TEXT_PRIMARY,
          align: "center",
        }}
        x={0}
        y={-80}
        anchor={0.5}
      />

      {/* Health bar */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          const healthPercent = player.health / player.maxHealth;

          // Background
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
          g.rect(-25, 70, 50, 8);
          g.fill();

          // Health fill
          g.fill({ color: KOREAN_COLORS.POSITIVE_GREEN, alpha: 0.9 });
          g.rect(-25, 70, 50 * healthPercent, 8);
          g.fill();
        }}
      />
    </pixiContainer>
  );
};

export default Player;
