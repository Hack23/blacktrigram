// Complete Player UI component with Korean martial arts character rendering

import React, { useCallback, useMemo } from "react";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import type { PlayerState } from "../../../types/player";
import type { GridPosition } from "../../../types/combat";
import {
  KOREAN_COLORS,
  PLAYER_ARCHETYPES_DATA,
  TRIGRAM_DATA,
} from "../../../types/constants";
import * as PIXI from "pixi.js";

extend({ Container, Graphics, Text });

export interface PlayerProps {
  readonly playerState: PlayerState;
  readonly playerIndex: number;
  readonly onClick: (playerIndex: number) => void;
  readonly gridPosition?: GridPosition;
  readonly gridSize?: number;
  readonly isActive?: boolean;
  readonly x?: number;
  readonly y?: number;
}

export const Player: React.FC<PlayerProps> = ({
  playerState,
  playerIndex,
  onClick,
  gridPosition,
  gridSize = 60,
  isActive = false,
  x = 0,
  y = 0,
}) => {
  usePixiExtensions();

  const archetypeData = PLAYER_ARCHETYPES_DATA[playerState.archetype];
  const stanceData = TRIGRAM_DATA[playerState.currentStance];

  // Calculate position from grid if provided
  const position = useMemo(() => {
    if (gridPosition) {
      return {
        x: gridPosition.col * gridSize + gridSize / 2,
        y: gridPosition.row * gridSize + gridSize / 2,
      };
    }
    return { x, y };
  }, [gridPosition, gridSize, x, y]);

  const healthPercent = playerState.health / playerState.maxHealth;
  const kiPercent = playerState.ki / playerState.maxKi;
  const staminaPercent = playerState.stamina / playerState.maxStamina;

  // Status colors based on health percentage
  const statusColor = useMemo(() => {
    if (healthPercent > 0.6) return KOREAN_COLORS.POSITIVE_GREEN;
    if (healthPercent > 0.3) return KOREAN_COLORS.WARNING_YELLOW;
    return KOREAN_COLORS.NEGATIVE_RED;
  }, [healthPercent]);

  // Draw main player body with Korean martial arts styling
  const drawPlayerBody = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      const bodyColor = archetypeData.colors.primary;
      const alpha = playerState.consciousness > 20 ? 0.9 : 0.5;

      // Player body outline
      g.stroke({ width: 2, color: KOREAN_COLORS.UI_BORDER, alpha: 0.8 });
      g.fill({ color: bodyColor, alpha });

      // Head
      g.circle(0, -30, 12);
      g.fill();
      g.stroke();

      // Body
      g.rect(-8, -18, 16, 36);
      g.fill();
      g.stroke();

      // Arms
      g.rect(-20, -10, 8, 4);
      g.rect(12, -10, 8, 4);
      g.fill();
      g.stroke();

      // Legs
      g.rect(-6, 18, 4, 16);
      g.rect(2, 18, 4, 16);
      g.fill();
      g.stroke();

      // Active player glow
      if (isActive) {
        g.stroke({ width: 3, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
        g.circle(0, 0, 45);
        g.stroke();
      }

      // Status effects visualization
      if (playerState.isBlocking) {
        g.stroke({ width: 2, color: KOREAN_COLORS.ACCENT_BLUE, alpha: 0.9 });
        g.rect(-25, -35, 50, 70);
        g.stroke();
      }

      if (playerState.isStunned) {
        // Stun effect - spinning stars
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2;
          const starX = Math.cos(angle) * 20;
          const starY = Math.sin(angle) * 20 - 40;
          g.fill({ color: KOREAN_COLORS.WARNING_YELLOW, alpha: 0.8 });
          g.star(starX, starY, 4, 3, 2);
          g.fill();
        }
      }
    },
    [
      archetypeData.colors.primary,
      playerState.consciousness,
      playerState.isBlocking,
      playerState.isStunned,
      isActive,
    ]
  );

  // Enhanced health bar with Korean styling
  const drawHealthBar = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      const barWidth = 40;
      const barHeight = 6;

      // Background
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
      g.rect(-barWidth / 2, -50, barWidth, barHeight);
      g.fill();

      // Health fill
      g.fill({ color: statusColor, alpha: 0.9 });
      g.rect(-barWidth / 2, -50, barWidth * healthPercent, barHeight);
      g.fill();

      // Border
      g.stroke({ width: 1, color: KOREAN_COLORS.UI_BORDER, alpha: 0.6 });
      g.rect(-barWidth / 2, -50, barWidth, barHeight);
      g.stroke();
    },
    [healthPercent, statusColor]
  );

  // Resource bars (Ki and Stamina)
  const drawResourceBars = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      const barWidth = 20;
      const barHeight = 3;

      // Ki bar
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.6 });
      g.rect(-25, 40, barWidth, barHeight);
      g.fill();
      g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.8 });
      g.rect(-25, 40, barWidth * kiPercent, barHeight);
      g.fill();

      // Stamina bar
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.6 });
      g.rect(5, 40, barWidth, barHeight);
      g.fill();
      g.fill({ color: KOREAN_COLORS.SECONDARY_YELLOW, alpha: 0.8 });
      g.rect(5, 40, barWidth * staminaPercent, barHeight);
      g.fill();
    },
    [kiPercent, staminaPercent]
  );

  // Status effects indicators
  const drawStatusEffects = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      if (playerState.statusEffects && playerState.statusEffects.length > 0) {
        playerState.statusEffects.slice(0, 3).forEach((effect, index) => {
          const effectColor =
            effect.type === "burn"
              ? KOREAN_COLORS.NEGATIVE_RED
              : effect.type === "poison"
              ? KOREAN_COLORS.POSITIVE_GREEN
              : KOREAN_COLORS.WARNING_YELLOW;

          g.fill({ color: effectColor, alpha: 0.7 });
          g.circle(-20 + index * 10, -65, 3);
          g.fill();
        });
      }
    },
    [playerState.statusEffects]
  );

  const handleClick = useCallback(() => {
    onClick(playerIndex);
  }, [onClick, playerIndex]);

  return (
    <pixiContainer
      x={position.x}
      y={position.y}
      interactive={true}
      onPointerDown={handleClick} // Fix: Changed from onpointerdown to onPointerDown
      data-testid={`player-${playerIndex}`}
    >
      {/* Main player body */}
      <pixiGraphics draw={drawPlayerBody} />

      {/* Health bar */}
      <pixiGraphics draw={drawHealthBar} />

      {/* Resource bars */}
      <pixiGraphics draw={drawResourceBars} />

      {/* Status effects */}
      <pixiGraphics draw={drawStatusEffects} />

      {/* Player name */}
      <pixiText
        text={playerState.name.korean}
        style={{
          fontSize: 10,
          fill: KOREAN_COLORS.TEXT_PRIMARY,
          fontWeight: "bold",
          align: "center",
          fontFamily: "Noto Sans KR",
        }}
        anchor={0.5}
        y={-75}
        data-testid={`player-${playerIndex}-name`}
      />

      {/* Current stance indicator */}
      <pixiContainer y={55} data-testid={`player-${playerIndex}-stance`}>
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: stanceData.theme.primary, alpha: 0.8 });
            g.circle(0, 0, 8);
            g.fill();
            g.stroke({ width: 1, color: stanceData.theme.secondary });
            g.circle(0, 0, 8);
            g.stroke();
          }}
        />
        <pixiText
          text={stanceData.symbol}
          style={{
            fontSize: 8,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
            align: "center",
          }}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Unconscious overlay */}
      {playerState.consciousness <= 0 && (
        <pixiContainer data-testid={`player-${playerIndex}-unconscious`}>
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.7 });
              g.circle(0, 0, 35);
              g.fill();
            }}
          />
          <pixiText
            text="기절"
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.NEGATIVE_RED,
              fontWeight: "bold",
              align: "center",
            }}
            anchor={0.5}
          />
        </pixiContainer>
      )}

      {/* Debug info */}
      <pixiContainer y={70} data-testid={`player-${playerIndex}-debug`}>
        <pixiText
          text={`P${playerIndex + 1}`}
          style={{
            fontSize: 6,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
            align: "center",
          }}
          anchor={0.5}
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default Player;
