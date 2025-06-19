import React, { useCallback } from "react"; // Remove unused useMemo
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import "@pixi/layout";
import { usePixiExtensions } from "../../../utils/pixiExtensions";
import type { PlayerState } from "../../../types/player";
import {
  KOREAN_COLORS,
  PLAYER_ARCHETYPES_DATA,
} from "../../../types/constants";
import { KoreanButton } from "../../ui/base/KoreanLayoutComponents";

extend({ Container, Graphics, Text });

export interface CombatHUDProps {
  readonly player1: PlayerState;
  readonly player2: PlayerState;
  readonly timeRemaining: number;
  readonly currentRound: number;
  readonly maxRounds: number;
  readonly isPaused?: boolean;
  readonly onPauseToggle?: () => void;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const CombatHUD: React.FC<CombatHUDProps> = ({
  player1,
  player2,
  timeRemaining,
  currentRound,
  maxRounds,
  isPaused = false,
  onPauseToggle,
  width = 1200,
  height = 80,
  x = 0,
  y = 0,
}) => {
  usePixiExtensions();

  // Archetype color data for player names
  const archetype1Data = PLAYER_ARCHETYPES_DATA[player1.archetype] || {
    colors: { primary: KOREAN_COLORS.PLAYER_1_COLOR },
    name: { korean: "", english: "" },
  };
  const archetype2Data = PLAYER_ARCHETYPES_DATA[player2.archetype] || {
    colors: { primary: KOREAN_COLORS.PLAYER_2_COLOR },
    name: { korean: "", english: "" },
  };

  // Health bar width - now uses isMobile properly
  const isMobile = width < 600;
  const healthBarWidth = Math.max(160, width * (isMobile ? 0.25 : 0.18));

  // Enhanced responsive player panel with mobile optimization
  const renderPlayerPanel = useCallback(
    (
      player: PlayerState,
      archetypeData: any,
      align: "left" | "right" = "left"
    ) => {
      const barColor = archetypeData.colors.primary;
      const healthPercent = player.health / player.maxHealth;
      const kiPercent = player.ki / player.maxKi;
      const staminaPercent = player.stamina / player.maxStamina;

      return (
        <pixiContainer
          x={
            align === "left"
              ? isMobile
                ? 10
                : 20
              : width - (isMobile ? 200 : 340)
          }
          y={isMobile ? 5 : 10}
          data-testid={`player-${align}-panel`}
        >
          {/* Player name with mobile-responsive font */}
          <pixiText
            text={player.name.korean}
            style={{
              fontSize: isMobile ? 14 : 18,
              fill: barColor,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
              align: align,
            }}
          />

          {/* Archetype with mobile optimization */}
          <pixiText
            text={archetypeData.name.korean}
            style={{
              fontSize: isMobile ? 9 : 12,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
              align: align,
            }}
            y={isMobile ? 15 : 20}
          />

          {/* Health bar with responsive sizing */}
          <pixiGraphics
            draw={(g) => {
              g.clear();
              // Background
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM });
              g.roundRect(0, 0, healthBarWidth, isMobile ? 14 : 18, 6);
              g.fill();
              // Health fill
              g.fill({ color: barColor });
              g.roundRect(
                0,
                0,
                healthBarWidth * healthPercent,
                isMobile ? 14 : 18,
                6
              );
              g.fill();
              // Border
              g.stroke({ width: 1, color: KOREAN_COLORS.UI_BORDER });
              g.roundRect(0, 0, healthBarWidth, isMobile ? 14 : 18, 6);
              g.stroke();
            }}
            y={isMobile ? 25 : 35}
          />

          {/* Health text with mobile sizing */}
          <pixiText
            text={`${Math.round(player.health)}/${player.maxHealth}`}
            style={{
              fontSize: isMobile ? 8 : 10,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              align: align,
            }}
            y={isMobile ? 45 : 58}
          />

          {/* Ki and Stamina bars with mobile optimization */}
          <pixiContainer y={isMobile ? 55 : 75}>
            {/* Ki bar */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                const barWidth = isMobile ? 50 : 70;
                const barHeight = isMobile ? 6 : 8;

                g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM });
                g.roundRect(0, 0, barWidth, barHeight, 3);
                g.fill();
                g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN });
                g.roundRect(0, 0, barWidth * kiPercent, barHeight, 3);
                g.fill();
              }}
            />
            <pixiText
              text={`기력: ${Math.round(player.ki)}`}
              style={{
                fontSize: isMobile ? 6 : 8,
                fill: KOREAN_COLORS.PRIMARY_CYAN,
              }}
              x={isMobile ? 55 : 75}
              y={-2}
            />

            {/* Stamina bar */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                const barWidth = isMobile ? 50 : 70;
                const barHeight = isMobile ? 6 : 8;

                g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM });
                g.roundRect(0, 0, barWidth, barHeight, 3);
                g.fill();
                g.fill({ color: KOREAN_COLORS.SECONDARY_YELLOW });
                g.roundRect(0, 0, barWidth * staminaPercent, barHeight, 3);
                g.fill();
              }}
              y={isMobile ? 8 : 12}
            />
            <pixiText
              text={`체력: ${Math.round(player.stamina)}`}
              style={{
                fontSize: isMobile ? 6 : 8,
                fill: KOREAN_COLORS.SECONDARY_YELLOW,
              }}
              x={isMobile ? 55 : 75}
              y={isMobile ? 6 : 10}
            />
          </pixiContainer>
        </pixiContainer>
      );
    },
    [healthBarWidth, width, isMobile] // Now isMobile is properly used
  );

  // Center panel (round, timer, rounds)
  const renderCenterPanel = useCallback(
    () => (
      <pixiContainer
        x={width / 2}
        y={isMobile ? 5 : 10}
        data-testid="center-panel"
      >
        {/* Round indicator with mobile sizing */}
        <pixiText
          text={`라운드 ${currentRound}/${maxRounds}`}
          style={{
            fontSize: isMobile ? 11 : 14,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
            align: "center",
          }}
          anchor={0.5}
        />

        {/* Timer with mobile optimization */}
        <pixiText
          text={formatTime(timeRemaining)}
          style={{
            fontSize: isMobile ? 14 : 18,
            fill:
              timeRemaining < 30
                ? KOREAN_COLORS.NEGATIVE_RED
                : KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
            align: "center",
          }}
          anchor={0.5}
          y={isMobile ? 15 : 20}
        />

        {/* Round progress dots with mobile sizing */}
        <pixiContainer y={isMobile ? 35 : 45}>
          {Array.from({ length: maxRounds }, (_, i) => (
            <pixiGraphics
              key={i}
              draw={(g) => {
                g.clear();
                const isActive = i < currentRound;
                const dotSize = isMobile ? 4 : 6;
                g.fill({
                  color: isActive
                    ? KOREAN_COLORS.ACCENT_GOLD
                    : KOREAN_COLORS.UI_GRAY,
                  alpha: 0.8,
                });
                g.circle(0, 0, dotSize);
                g.fill();
              }}
              x={(i - maxRounds / 2) * (isMobile ? 12 : 18)}
            />
          ))}
        </pixiContainer>

        {/* Pause indicator with mobile sizing */}
        {isPaused && (
          <pixiText
            text="일시정지"
            style={{
              fontSize: isMobile ? 9 : 12,
              fill: KOREAN_COLORS.WARNING_YELLOW,
              align: "center",
              fontFamily: "Noto Sans KR",
            }}
            anchor={0.5}
            y={isMobile ? 50 : 65}
          />
        )}
      </pixiContainer>
    ),
    [currentRound, maxRounds, timeRemaining, isPaused, width, isMobile] // Now includes isMobile
  );

  return (
    <pixiContainer x={x} y={y} data-testid="combat-hud">
      {/* Background with mobile-optimized sizing */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
          g.roundRect(0, 0, width, height, isMobile ? 6 : 10);
          g.fill();
          g.stroke({
            width: isMobile ? 1 : 2,
            color: KOREAN_COLORS.ACCENT_GOLD,
            alpha: 0.6,
          });
          g.roundRect(0, 0, width, height, isMobile ? 6 : 10);
          g.stroke();
        }}
      />

      {renderPlayerPanel(player1, archetype1Data, "left")}
      {renderCenterPanel()}
      {renderPlayerPanel(player2, archetype2Data, "right")}

      {/* Pause button with mobile optimization */}
      {onPauseToggle && (
        <pixiContainer
          x={width - (isMobile ? 70 : 100)}
          y={height - (isMobile ? 35 : 45)}
        >
          <KoreanButton
            text={{
              korean: isPaused ? "계속" : "정지",
              english: isPaused ? "Resume" : "Pause",
            }}
            onClick={onPauseToggle}
            width={isMobile ? 60 : 80}
            height={isMobile ? 25 : 35}
            variant="secondary"
            data-testid="pause-button"
          />
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default CombatHUD;
