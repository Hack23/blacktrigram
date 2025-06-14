import React from "react";
import * as PIXI from "pixi.js";
import { usePixiExtensions } from "../../utils/pixiExtensions";
import { KOREAN_COLORS, PLAYER_ARCHETYPES_DATA } from "../../types/constants";
import type { PlayerState } from "../../types/player";

export interface PlayerVisualsProps {
  readonly playerState: PlayerState;
  readonly x?: number;
  readonly y?: number;
  readonly scale?: number;
  readonly showDetails?: boolean;
  readonly animationState?: string;
}

export const PlayerVisuals: React.FC<PlayerVisualsProps> = ({
  playerState,
  x = 0,
  y = 0,
  scale = 1.0,
  showDetails = true,
  animationState = "idle",
}) => {
  usePixiExtensions();

  const archetypeData = PLAYER_ARCHETYPES_DATA[playerState.archetype];
  const healthPercent = playerState.health / playerState.maxHealth;

  const drawPlayerBody = React.useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Main body
      g.beginFill(archetypeData.colors.primary, 0.9);
      g.drawEllipse(0, 0, 25, 40);
      g.endFill();

      // Head
      g.beginFill(archetypeData.colors.secondary, 0.8);
      g.drawCircle(0, -30, 15);
      g.endFill();

      // Arms
      g.lineStyle(8, archetypeData.colors.primary, 0.8);
      g.moveTo(-25, -10);
      g.lineTo(-35, 10);
      g.moveTo(25, -10);
      g.lineTo(35, 10);

      // Legs
      g.moveTo(-10, 30);
      g.lineTo(-15, 60);
      g.moveTo(10, 30);
      g.lineTo(15, 60);
    },
    [archetypeData, animationState]
  );

  const drawHealthBar = React.useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Background
      g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8);
      g.drawRect(-30, -60, 60, 8);
      g.endFill();

      // Health fill
      const healthColor =
        healthPercent > 0.6
          ? KOREAN_COLORS.POSITIVE_GREEN
          : healthPercent > 0.3
          ? KOREAN_COLORS.WARNING_YELLOW
          : KOREAN_COLORS.NEGATIVE_RED;
      g.beginFill(healthColor, 0.9);
      g.drawRect(-28, -58, 56 * healthPercent, 4);
      g.endFill();
    },
    [healthPercent]
  );

  return (
    <pixiContainer x={x} y={y} scale={scale} data-testid="player-visuals">
      <pixiGraphics draw={drawPlayerBody} />

      {showDetails && (
        <>
          <pixiGraphics draw={drawHealthBar} />

          <pixiText
            text={playerState.name.korean}
            style={
              new PIXI.TextStyle({
                fontSize: 10,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                align: "center",
              })
            }
            anchor={0.5}
            y={-70}
          />

          <pixiText
            text={`${Math.round(playerState.health)}/${playerState.maxHealth}`}
            style={
              new PIXI.TextStyle({
                fontSize: 8,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
                align: "center",
              })
            }
            anchor={0.5}
            y={-45}
          />

          <pixiText
            text={playerState.currentStance}
            style={
              new PIXI.TextStyle({
                fontSize: 8,
                fill: KOREAN_COLORS.ACCENT_GOLD,
                align: "center",
              })
            }
            anchor={0.5}
            y={70}
          />
        </>
      )}
    </pixiContainer>
  );
};

export default PlayerVisuals;
