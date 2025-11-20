import { PlayerState } from "@/systems";
import { extend } from "@pixi/react";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import React from "react";
import { KOREAN_COLORS } from "../../../types/constants";

// Register PixiJS components
extend({ Container, Graphics, Sprite, Text });

export interface PlayerStatusPanelProps {
  readonly player: PlayerState;
  readonly position: "left" | "right" | "center";
  readonly isSelected?: boolean;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
}

export const PlayerStatusPanel: React.FC<PlayerStatusPanelProps> = ({
  player,
  position,
  isSelected = false,
  width = 160,
  height = 280,
  x = 0,
  y = 0,
}) => {
  return (
    <pixiContainer x={x} y={y} data-testid={`player-status-${position}`}>
      {/* Basic Player Info */}
      <pixiText
        text={`${player.name.korean} - ${position}`}
        style={{
          fontSize: 14,
          fill: KOREAN_COLORS.TEXT_PRIMARY,
          fontWeight: "bold",
        }}
      />

      {/* Archetype */}
      <pixiText
        text={`유형: ${player.archetype}`}
        style={{
          fontSize: 12,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
        }}
        y={20}
      />

      {/* Stats */}
      <pixiContainer y={40} data-testid="player-stats">
        <pixiText
          text="스탯"
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
          }}
        />

        {/* Ki Level */}
        <pixiContainer y={20} data-testid="ki-stat">
          <pixiText
            text="기 레벨:"
            style={{
              fontSize: 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
          />

          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.beginFill(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8);
              g.drawRect(60, 4, 80, 6);
              g.endFill();

              // Fill based on ki percentage
              const percentage = player.ki / player.maxKi;
              g.beginFill(KOREAN_COLORS.PRIMARY_CYAN, 0.9);
              g.drawRect(60, 4, 80 * percentage, 6);
              g.endFill();
            }}
          />

          <pixiText
            text={`${Math.round(player.ki)}/${player.maxKi}`}
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
            x={145}
            y={2}
            anchor={{ x: 1, y: 0 }}
          />
        </pixiContainer>

        {/* Stamina */}
        <pixiContainer y={40} data-testid="stamina-stat">
          <pixiText
            text="스태미나:"
            style={{
              fontSize: 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
          />

          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.beginFill(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8);
              g.drawRect(60, 4, 80, 6);
              g.endFill();

              // Fill based on stamina percentage
              const percentage = player.stamina / player.maxStamina;
              g.beginFill(KOREAN_COLORS.SECONDARY_YELLOW, 0.9);
              g.drawRect(60, 4, 80 * percentage, 6);
              g.endFill();
            }}
          />

          <pixiText
            text={`${Math.round(player.stamina)}/${player.maxStamina}`}
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
            x={145}
            y={2}
            anchor={{ x: 1, y: 0 }}
          />
        </pixiContainer>

        {/* Balance */}
        <pixiContainer y={60} data-testid="balance-stat">
          <pixiText
            text="밸런스:"
            style={{
              fontSize: 10,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
          />

          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.beginFill(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8);
              g.drawRect(60, 4, 80, 6);
              g.endFill();

              // Fill based on balance percentage
              const percentage = player.balance / 100; // Assuming max is 100
              g.beginFill(KOREAN_COLORS.ACCENT_CYAN, 0.9);
              g.drawRect(60, 4, 80 * percentage, 6);
              g.endFill();
            }}
          />

          <pixiText
            text={`${Math.round(player.balance)}/100`}
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
            x={145}
            y={2}
            anchor={{ x: 1, y: 0 }}
          />
        </pixiContainer>
      </pixiContainer>

      {/* Current Stance */}
      <pixiContainer y={120} data-testid="current-stance">
        <pixiText
          text="현재 자세:"
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
          }}
        />

        <pixiText
          text={player.currentStance}
          style={{
            fontSize: 14,
            fill: KOREAN_COLORS.PRIMARY_CYAN,
          }}
          x={70}
        />
      </pixiContainer>

      {/* Selection Indicator */}
      {isSelected && (
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.lineStyle(2, KOREAN_COLORS.ACCENT_GOLD, 0.8);
            g.drawRect(-5, -5, width + 10, height + 10);

            // Pulsing glow effect
            const alpha = Math.sin(Date.now() * 0.005) * 0.2 + 0.4;
            g.lineStyle(4, KOREAN_COLORS.ACCENT_GOLD, alpha);
            g.drawRect(-10, -10, width + 20, height + 20);
          }}
          data-testid="selected-player-indicator"
        />
      )}
    </pixiContainer>
  );
};

export default PlayerStatusPanel;
