import { PLAYER_ARCHETYPES_DATA, PlayerState } from "@/systems";
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
  height = 140, // Increased height for more info
  x = 0,
  y = 0,
}) => {
  const isMobile = width < 768;
  const healthBarWidth = isMobile ? 160 : 220;
  const timerWidth = isMobile ? 140 : 180;
  const centerX = width / 2;

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
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.95 });
      g.rect(0, 0, width, height);

      // Gold border with Korean traditional pattern
      g.stroke({ width: 3, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
      g.rect(5, 5, width - 10, height - 10);

      // Center divider with Taeguk symbol inspiration
      g.stroke({ width: 2, color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.6 });
      g.moveTo(width / 2, 10);
      g.lineTo(width / 2, height - 10);

      // Yin-yang inspired circle at center
      g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.4 });
      g.circle(width / 2, height / 2, 30);

      // Score panel backgrounds
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.7 });
      g.roundRect(10, height - 35, 100, 25, 5); // Player 1 score
      g.roundRect(width - 110, height - 35, 100, 25, 5); // Player 2 score
    },
    [width, height]
  );

  return (
    <pixiContainer x={x} y={y} data-testid="combat-hud">
      {/* Enhanced Background */}
      <pixiGraphics draw={drawBackground} />

      {/* Player 1 Info (Left Side) - Enhanced with latest state */}
      <pixiContainer x={20} y={15}>
        {/* Player Name - Korean/English */}
        <pixiText
          text={player1.name.korean}
          style={{
            fontSize: isMobile ? 16 : 20,
            fill: player1Archetype.colors.primary,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
          }}
        />
        <pixiText
          text={player1.name.english}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontStyle: "italic",
          }}
          y={isMobile ? 18 : 22}
        />

        {/* Archetype - Korean/English */}
        <pixiText
          text={`${player1Archetype.name.korean} | ${player1Archetype.name.english}`}
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
            fontFamily: "Noto Sans KR",
          }}
          y={isMobile ? 32 : 38}
        />

        {/* Enhanced Health Bar with latest values */}
        <HealthBar
          current={player1.health}
          max={player1.maxHealth}
          width={healthBarWidth}
          height={25}
          showText={true}
          x={0}
          y={isMobile ? 45 : 50}
          position="left"
          playerName={player1.name.korean}
          screenWidth={width}
          screenHeight={height}
          data-testid="player1-health-bar"
        />

        {/* Real-time Resource Bars */}
        <pixiContainer y={isMobile ? 75 : 85}>
          {/* Ki Bar with Korean/English labels */}
          <pixiText
            text="기력 | Ki"
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
            }}
          />
          <pixiGraphics
            draw={(g) => {
              g.clear();
              // Background
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.8 });
              g.rect(45, 0, 100, 8);

              // Ki fill with current value
              const kiPercent =
                player1.maxKi > 0 ? player1.ki / player1.maxKi : 0;
              g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.9 });
              g.rect(45, 0, 100 * kiPercent, 8);

              // Border
              g.stroke({
                width: 1,
                color: KOREAN_COLORS.PRIMARY_CYAN,
                alpha: 0.6,
              });
              g.rect(45, 0, 100, 8);
            }}
          />
          <pixiText
            text={`${Math.round(player1.ki)}/${player1.maxKi}`}
            style={{
              fontSize: 7,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
            x={150}
            y={2}
          />

          {/* Stamina Bar */}
          <pixiText
            text="체력 | Stamina"
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
            }}
            y={15}
          />
          <pixiGraphics
            draw={(g) => {
              g.clear();
              // Background
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.8 });
              g.rect(65, 15, 80, 8);

              // Stamina fill with current value
              const staminaPercent =
                player1.maxStamina > 0
                  ? player1.stamina / player1.maxStamina
                  : 0;
              g.fill({ color: KOREAN_COLORS.SECONDARY_YELLOW, alpha: 0.9 });
              g.rect(65, 15, 80 * staminaPercent, 8);

              // Border
              g.stroke({
                width: 1,
                color: KOREAN_COLORS.SECONDARY_YELLOW,
                alpha: 0.6,
              });
              g.rect(65, 15, 80, 8);
            }}
          />
          <pixiText
            text={`${Math.round(player1.stamina)}/${player1.maxStamina}`}
            style={{
              fontSize: 7,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
            x={150}
            y={17}
          />
        </pixiContainer>

        {/* Enhanced Stance Indicator */}
        <StanceIndicator
          stance={player1.currentStance}
          x={0}
          y={isMobile ? 110 : 125}
          size={35}
          showDetails={false}
          data-testid="player1-stance-indicator"
        />

        {/* Player 1 Score Display */}
        <pixiContainer x={-10} y={height - 50}>
          <pixiText
            text="승리 | Wins"
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
            }}
          />
          <pixiText
            text={`${roundsWon.player1}`}
            style={{
              fontSize: 16,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
            }}
            x={70}
            y={-3}
            anchor={0.5}
          />
        </pixiContainer>
      </pixiContainer>

      {/* Enhanced Center Timer with Score */}
      <pixiContainer x={centerX - timerWidth / 2} y={20}>
        <RoundTimer
          currentRound={currentRound}
          maxRounds={maxRounds}
          timeRemaining={timeRemaining}
          totalTime={180}
          width={timerWidth}
          height={45}
          x={0}
          y={0}
          isPaused={isPaused}
          screenWidth={width}
          screenHeight={height}
          data-testid="round-timer"
        />

        {/* Bilingual Round Label */}
        <pixiText
          text={`라운드 ${currentRound}/${maxRounds} | Round ${currentRound}/${maxRounds}`}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            align: "center",
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
          }}
          x={timerWidth / 2}
          y={50}
          anchor={0.5}
        />

        {/* Match Score Display */}
        <pixiContainer x={timerWidth / 2} y={70}>
          <pixiText
            text="경기 점수 | Match Score"
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "center",
              fontFamily: "Noto Sans KR",
            }}
            anchor={0.5}
          />
          <pixiText
            text={`${gameScore.player1} - ${gameScore.player2}`}
            style={{
              fontSize: 18,
              fill: KOREAN_COLORS.PRIMARY_CYAN,
              align: "center",
              fontWeight: "bold",
            }}
            y={15}
            anchor={0.5}
          />
        </pixiContainer>

        {/* Round Progress Indicators */}
        <pixiContainer x={timerWidth / 2} y={105}>
          {Array.from({ length: maxRounds }).map((_, i) => (
            <pixiGraphics
              key={i}
              draw={(g) => {
                g.clear();
                const isCompleted = i < currentRound - 1;
                const isCurrent = i === currentRound - 1;

                if (isCurrent) {
                  // Current round - pulsing
                  const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
                  g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: pulse });
                } else if (isCompleted) {
                  g.fill({ color: KOREAN_COLORS.POSITIVE_GREEN, alpha: 0.8 });
                } else {
                  g.fill({ color: KOREAN_COLORS.UI_GRAY, alpha: 0.4 });
                }

                g.circle(-30 + i * 15, 0, 5);
              }}
            />
          ))}
        </pixiContainer>
      </pixiContainer>

      {/* Player 2 Info (Right Side) - Mirror of Player 1 */}
      <pixiContainer x={width - 340} y={15}>
        {/* Player Name - Korean/English (Right-aligned) */}
        <pixiText
          text={player2.name.korean}
          style={{
            fontSize: isMobile ? 16 : 20,
            fill: player2Archetype.colors.primary,
            fontWeight: "bold",
            fontFamily: "Noto Sans KR",
            align: "right",
          }}
          x={320}
          anchor={{ x: 1, y: 0 }}
        />
        <pixiText
          text={player2.name.english}
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontStyle: "italic",
            align: "right",
          }}
          x={320}
          y={isMobile ? 18 : 22}
          anchor={{ x: 1, y: 0 }}
        />

        {/* Archetype - Korean/English */}
        <pixiText
          text={`${player2Archetype.name.korean} | ${player2Archetype.name.english}`}
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.TEXT_TERTIARY,
            fontFamily: "Noto Sans KR",
            align: "right",
          }}
          x={320}
          y={isMobile ? 32 : 38}
          anchor={{ x: 1, y: 0 }}
        />

        {/* Health Bar */}
        <HealthBar
          current={player2.health}
          max={player2.maxHealth}
          width={healthBarWidth}
          height={25}
          showText={true}
          x={320 - healthBarWidth}
          y={isMobile ? 45 : 50}
          position="right"
          playerName={player2.name.korean}
          screenWidth={width}
          screenHeight={height}
          data-testid="player2-health-bar"
        />

        {/* Resource Bars - Right-aligned */}
        <pixiContainer x={100} y={isMobile ? 75 : 85}>
          {/* Ki Bar */}
          <pixiText
            text="기력 | Ki"
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
              align: "right",
            }}
            x={120}
            anchor={{ x: 1, y: 0 }}
          />
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.8 });
              g.rect(75, 0, 100, 8);

              const kiPercent =
                player2.maxKi > 0 ? player2.ki / player2.maxKi : 0;
              g.fill({ color: KOREAN_COLORS.PRIMARY_CYAN, alpha: 0.9 });
              g.rect(75, 0, 100 * kiPercent, 8);

              g.stroke({
                width: 1,
                color: KOREAN_COLORS.PRIMARY_CYAN,
                alpha: 0.6,
              });
              g.rect(75, 0, 100, 8);
            }}
          />
          <pixiText
            text={`${Math.round(player2.ki)}/${player2.maxKi}`}
            style={{
              fontSize: 7,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "right",
            }}
            x={70}
            y={2}
            anchor={{ x: 1, y: 0 }}
          />

          {/* Stamina Bar */}
          <pixiText
            text="체력 | Stamina"
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
              align: "right",
            }}
            x={140}
            y={15}
            anchor={{ x: 1, y: 0 }}
          />
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.8 });
              g.rect(95, 15, 80, 8);

              const staminaPercent =
                player2.maxStamina > 0
                  ? player2.stamina / player2.maxStamina
                  : 0;
              g.fill({ color: KOREAN_COLORS.SECONDARY_YELLOW, alpha: 0.9 });
              g.rect(95, 15, 80 * staminaPercent, 8);

              g.stroke({
                width: 1,
                color: KOREAN_COLORS.SECONDARY_YELLOW,
                alpha: 0.6,
              });
              g.rect(95, 15, 80, 8);
            }}
          />
          <pixiText
            text={`${Math.round(player2.stamina)}/${player2.maxStamina}`}
            style={{
              fontSize: 7,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              align: "right",
            }}
            x={90}
            y={17}
            anchor={{ x: 1, y: 0 }}
          />
        </pixiContainer>

        {/* Stance Indicator */}
        <StanceIndicator
          stance={player2.currentStance}
          x={280}
          y={isMobile ? 110 : 125}
          size={35}
          showDetails={false}
          data-testid="player2-stance-indicator"
        />

        {/* Player 2 Score Display */}
        <pixiContainer x={230} y={height - 50}>
          <pixiText
            text="승리 | Wins"
            style={{
              fontSize: 8,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
              fontFamily: "Noto Sans KR",
              align: "right",
            }}
            x={80}
            anchor={{ x: 1, y: 0 }}
          />
          <pixiText
            text={`${roundsWon.player2}`}
            style={{
              fontSize: 16,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
            }}
            x={45}
            y={-3}
            anchor={0.5}
          />
        </pixiContainer>
      </pixiContainer>

      {/* Enhanced Pause Toggle Button */}
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
