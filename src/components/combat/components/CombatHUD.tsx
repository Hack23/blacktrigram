import { PLAYER_ARCHETYPES_DATA, PlayerState } from "@/systems";
import { Texture } from "pixi.js"; // 1. Import Texture
import React, { useCallback, useMemo } from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import { extendPixiComponents } from "../../../utils/pixiExtensions";
import { HealthBar } from "../../ui/HealthBar";
import { RoundTimer } from "../../ui/RoundTimer";
import { StanceIndicator } from "../../ui/StanceIndicator";

// Ensure PixiJS components are extended
extendPixiComponents();

export interface CombatHUDProps {
  readonly player1: PlayerState;
  readonly player2: PlayerState;
  readonly timeRemaining: number;
  readonly currentRound: number;
  readonly maxRounds: number;
  readonly gameScore?: { player1: number; player2: number };
  readonly roundsWon?: { player1: number; player2: number };
  readonly isPaused?: boolean;
  readonly onPauseToggle?: () => void;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
}

export const CombatHUD: React.FC<CombatHUDProps> = ({
  player1,
  player2,
  timeRemaining,
  currentRound,
  maxRounds,
  gameScore = { player1: 0, player2: 0 },
  roundsWon = { player1: 0, player2: 0 },
  isPaused = false,
  onPauseToggle,
  width = 1200,
  height = 160, // Increased height for larger layout
  x = 0,
  y = 0,
}) => {
  const isMobile = width < 768;
  const healthBarWidth = isMobile ? 150 : 250; // Adjusted for new layout
  const timerWidth = isMobile ? 120 : 160;
  const centerX = width / 2;
  const portraitSize = isMobile ? 60 : 80;

  // Get latest archetype data
  const player1Archetype = useMemo(
    () => PLAYER_ARCHETYPES_DATA[player1.archetype],
    [player1.archetype]
  );
  const player2Archetype = useMemo(
    () => PLAYER_ARCHETYPES_DATA[player2.archetype],
    [player2.archetype]
  );

  // Enhanced background with score display areas
  const drawBackground = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      
      // Main background with subtle gradient effect
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.95 });
      g.rect(0, 0, width, height);

      // Add subtle glow at top
      g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.05 });
      g.rect(0, 0, width, 3);

      // Korean-inspired border with gold accent
      g.stroke({ width: 3, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
      g.rect(2, 2, width - 4, height - 4);

      // Inner border for depth
      g.stroke({ width: 1, color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.4 });
      g.rect(4, 4, width - 8, height - 8);

      // Center divider with decorative elements
      g.stroke({ width: 2, color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.6 });
      g.moveTo(width / 2, 8);
      g.lineTo(width / 2, height - 8);
      g.stroke();
      
      // Decorative diamond at center top
      const centerX = width / 2;
      g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.7 });
      g.moveTo(centerX, 5);
      g.lineTo(centerX + 4, 10);
      g.lineTo(centerX, 15);
      g.lineTo(centerX - 4, 10);
      g.closePath();
      g.fill();
    },
    [width, height]
  );

  return (
    <pixiContainer x={x} y={y} data-testid="combat-hud">
      {/* Enhanced Background */}
      <pixiGraphics draw={drawBackground} />

      {/* Player 1 Info (Left Side) - Row Layout */}
      <pixiContainer
        x={10}
        y={10}
        layout={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
        }}
      >
        {/* Player 1 Archetype Portrait */}
        <pixiSprite
          texture={Texture.from(
            // 2. Use imported Texture
            `/assets/visual/archetypes/${player1.archetype}.png`
          )}
          width={portraitSize}
          height={portraitSize}
          anchor={0.5}
          x={portraitSize / 2}
          y={portraitSize / 2}
        />

        {/* Player 1 Details Column */}
        <pixiContainer
          layout={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          {/* Player Name */}
          <pixiText
            text={`${player1.name.korean} | ${player1.name.english}`}
            style={{
              fontSize: isMobile ? 14 : 18,
              fill: player1Archetype.colors.primary,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
          />

          {/* Health Bar */}
          <HealthBar
            current={player1.health}
            max={player1.maxHealth}
            width={healthBarWidth}
            height={20}
            showText={true}
            position="left"
            playerName={player1.name.korean}
            screenWidth={width}
            screenHeight={height}
            x={0} // 3. Add missing prop
            y={0} // 3. Add missing prop
            data-testid="player1-health-bar"
          />

          {/* Resource Bars Row */}
          <pixiContainer
            layout={{ display: "flex", flexDirection: "row", gap: 10 }}
          >
            {/* Ki Bar with low warning */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.8,
                });
                g.rect(0, 0, healthBarWidth / 2 - 5, 8);
                const kiPercent =
                  player1.maxKi > 0 ? player1.ki / player1.maxKi : 0;
                const kiColor =
                  kiPercent < 0.25
                    ? KOREAN_COLORS.ACCENT_RED
                    : KOREAN_COLORS.PRIMARY_CYAN;
                g.fill({ color: kiColor, alpha: 0.9 });
                g.rect(0, 0, (healthBarWidth / 2 - 5) * kiPercent, 8);
                // Add pulsing border when low
                if (kiPercent < 0.25) {
                  g.stroke({
                    width: 1,
                    color: KOREAN_COLORS.ACCENT_RED,
                    alpha: 0.5 + Math.sin(Date.now() / 200) * 0.3,
                  });
                  g.rect(0, 0, healthBarWidth / 2 - 5, 8);
                }
              }}
            />
            {/* Stamina Bar with low warning */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.8,
                });
                g.rect(0, 0, healthBarWidth / 2 - 5, 8);
                const staminaPercent =
                  player1.maxStamina > 0
                    ? player1.stamina / player1.maxStamina
                    : 0;
                const staminaColor =
                  staminaPercent < 0.25
                    ? KOREAN_COLORS.ACCENT_RED
                    : KOREAN_COLORS.SECONDARY_YELLOW;
                g.fill({ color: staminaColor, alpha: 0.9 });
                g.rect(0, 0, (healthBarWidth / 2 - 5) * staminaPercent, 8);
                // Add pulsing border when low
                if (staminaPercent < 0.25) {
                  g.stroke({
                    width: 1,
                    color: KOREAN_COLORS.ACCENT_RED,
                    alpha: 0.5 + Math.sin(Date.now() / 200) * 0.3,
                  });
                  g.rect(0, 0, healthBarWidth / 2 - 5, 8);
                }
              }}
            />
          </pixiContainer>
        </pixiContainer>

        {/* Player 1 Stance & Score Column */}
        <pixiContainer
          layout={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <StanceIndicator
            stance={player1.currentStance}
            size={isMobile ? 30 : 40}
            showDetails={false}
            x={0} // 3. Add missing prop
            y={0} // 3. Add missing prop
            data-testid="player1-stance-indicator"
          />
          <pixiText
            text={`${roundsWon.player1}`}
            style={{
              fontSize: 24,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
            }}
          />
        </pixiContainer>
      </pixiContainer>

      {/* Enhanced Center Timer with Score */}
      <pixiContainer x={centerX - timerWidth / 2} y={15}>
        <RoundTimer
          currentRound={currentRound}
          maxRounds={maxRounds}
          timeRemaining={timeRemaining}
          totalTime={180}
          width={timerWidth}
          height={45}
          isPaused={isPaused}
          screenWidth={width}
          screenHeight={height}
          x={0} // 3. Add missing prop
          y={0} // 3. Add missing prop
          data-testid="round-timer"
        />
        <pixiText
          text={`라운드 ${currentRound}`}
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            align: "center",
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
          }}
          x={timerWidth / 2}
          y={50}
          anchor={0.5}
        />
        <pixiText
          text={`${gameScore.player1} - ${gameScore.player2}`}
          style={{
            fontSize: 28,
            fill: KOREAN_COLORS.PRIMARY_CYAN,
            align: "center",
            fontWeight: "bold",
          }}
          x={timerWidth / 2}
          y={80}
          anchor={0.5}
        />
      </pixiContainer>

      {/* Player 2 Info (Right Side) - Row Layout */}
      <pixiContainer
        x={width - 10}
        y={10}
        anchor={{ x: 1, y: 0 }}
        layout={{
          display: "flex",
          flexDirection: "row-reverse", // Reverse row for right alignment
          alignItems: "center",
          gap: 15,
        }}
      >
        {/* Player 2 Archetype Portrait */}
        <pixiSprite
          texture={Texture.from(
            // 2. Use imported Texture
            `/assets/visual/archetypes/${player2.archetype}.png`
          )}
          width={portraitSize}
          height={portraitSize}
          anchor={0.5}
          x={-portraitSize / 2}
          y={portraitSize / 2}
        />

        {/* Player 2 Details Column */}
        <pixiContainer
          layout={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end", // Align text to the right
            gap: 5,
          }}
        >
          {/* Player Name */}
          <pixiText
            text={`${player2.name.korean} | ${player2.name.english}`}
            style={{
              fontSize: isMobile ? 14 : 18,
              fill: player2Archetype.colors.primary,
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
          />

          {/* Health Bar */}
          <HealthBar
            current={player2.health}
            max={player2.maxHealth}
            width={healthBarWidth}
            height={20}
            showText={true}
            position="right"
            playerName={player2.name.korean}
            screenWidth={width}
            screenHeight={height}
            x={0} // 3. Add missing prop
            y={0} // 3. Add missing prop
            data-testid="player2-health-bar"
          />

          {/* Resource Bars Row */}
          <pixiContainer
            layout={{ display: "flex", flexDirection: "row", gap: 10 }}
          >
            {/* Ki Bar with low warning */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.8,
                });
                g.rect(0, 0, healthBarWidth / 2 - 5, 8);
                const kiPercent =
                  player2.maxKi > 0 ? player2.ki / player2.maxKi : 0;
                const kiColor =
                  kiPercent < 0.25
                    ? KOREAN_COLORS.ACCENT_RED
                    : KOREAN_COLORS.PRIMARY_CYAN;
                g.fill({ color: kiColor, alpha: 0.9 });
                g.rect(0, 0, (healthBarWidth / 2 - 5) * kiPercent, 8);
                // Add pulsing border when low
                if (kiPercent < 0.25) {
                  g.stroke({
                    width: 1,
                    color: KOREAN_COLORS.ACCENT_RED,
                    alpha: 0.5 + Math.sin(Date.now() / 200) * 0.3,
                  });
                  g.rect(0, 0, healthBarWidth / 2 - 5, 8);
                }
              }}
            />
            {/* Stamina Bar with low warning */}
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.8,
                });
                g.rect(0, 0, healthBarWidth / 2 - 5, 8);
                const staminaPercent =
                  player2.maxStamina > 0
                    ? player2.stamina / player2.maxStamina
                    : 0;
                const staminaColor =
                  staminaPercent < 0.25
                    ? KOREAN_COLORS.ACCENT_RED
                    : KOREAN_COLORS.SECONDARY_YELLOW;
                g.fill({ color: staminaColor, alpha: 0.9 });
                g.rect(0, 0, (healthBarWidth / 2 - 5) * staminaPercent, 8);
                // Add pulsing border when low
                if (staminaPercent < 0.25) {
                  g.stroke({
                    width: 1,
                    color: KOREAN_COLORS.ACCENT_RED,
                    alpha: 0.5 + Math.sin(Date.now() / 200) * 0.3,
                  });
                  g.rect(0, 0, healthBarWidth / 2 - 5, 8);
                }
              }}
            />
          </pixiContainer>
        </pixiContainer>

        {/* Player 2 Stance & Score Column */}
        <pixiContainer
          layout={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <StanceIndicator
            stance={player2.currentStance}
            size={isMobile ? 30 : 40}
            showDetails={false}
            x={0} // 3. Add missing prop
            y={0} // 3. Add missing prop
            data-testid="player2-stance-indicator"
          />
          <pixiText
            text={`${roundsWon.player2}`}
            style={{
              fontSize: 24,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
            }}
          />
        </pixiContainer>
      </pixiContainer>

      {/* Pause Toggle Button remains at the bottom of the HUD area */}
      {onPauseToggle && (
        <pixiContainer x={width - 90} y={height - 45}>
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.9 });
              g.stroke({
                width: 2,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.8,
              });
              g.roundRect(0, 0, 80, 35, 5);
            }}
            interactive={true}
            cursor="pointer"
            onPointerDown={onPauseToggle}
          />
          <pixiText
            text={isPaused ? "계속" : "정지"}
            style={{
              fontSize: 12,
              fill: KOREAN_COLORS.TEXT_PRIMARY,
              align: "center",
              fontWeight: "bold",
              fontFamily: "Noto Sans KR",
            }}
            x={40}
            y={10}
            anchor={0.5}
          />
          <pixiText
            text={isPaused ? "Resume" : "Pause"}
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "center",
              fontStyle: "italic",
            }}
            x={40}
            y={22}
            anchor={0.5}
          />
        </pixiContainer>
      )}
    </pixiContainer>
  );
};

export default CombatHUD;
