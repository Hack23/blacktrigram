import React from "react";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import { Player } from "../../game/Player";
import type { PlayerState } from "../../../types/player";
import { KOREAN_COLORS } from "../../../types/constants";

export interface CombatArenaProps {
  readonly players: readonly PlayerState[]; // now readonly
  readonly onPlayerClick?: (idx: number) => void;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
}

export const CombatArena: React.FC<CombatArenaProps> = ({
  players,
  onPlayerClick,
  width = 1200,
  height = 800,
  x = 0,
  y = 0,
}) => {
  usePixiExtensions();

  return (
    <pixiContainer x={x} y={y}>
      {/* Arena Floor */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.beginFill(KOREAN_COLORS.ARENA_BACKGROUND, 0.3);
          g.drawRect(0, 0, width, height);
          g.endFill();

          // Center line
          g.lineStyle(2, KOREAN_COLORS.UI_BORDER, 0.5);
          g.moveTo(width / 2, 0);
          g.lineTo(width / 2, height);
        }}
      />

      {players.map((player, index) => (
        <Player
          key={player.id}
          player={player}
          x={index === 0 ? width * 0.25 : width * 0.75}
          y={height * 0.7}
          onClick={() => onPlayerClick?.(index)} // non-null
        />
      ))}

      {/* Arena Boundaries */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.lineStyle(3, KOREAN_COLORS.ACCENT_GOLD, 0.8);
          g.drawRect(50, 100, width - 100, height - 200);
        }}
      />

      {/* Corner Markers */}
      {[
        [75, 125],
        [width - 75, 125],
        [75, height - 125],
        [width - 75, height - 125],
      ].map(([cornerX, cornerY], index) => (
        <pixiGraphics
          key={index}
          draw={(g) => {
            g.clear();
            g.beginFill(KOREAN_COLORS.ACCENT_GOLD, 0.6);
            g.drawCircle(cornerX, cornerY, 8);
            g.endFill();
          }}
        />
      ))}
    </pixiContainer>
  );
};

export default CombatArena;
