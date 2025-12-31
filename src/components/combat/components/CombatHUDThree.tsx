/**
 * CombatHUDThree - Combat HUD using Three.js Korean UI components
 * 
 */

import React, { useMemo } from "react";
import { PlayerState } from "../../../systems";
import { PLAYER_ARCHETYPES_DATA } from "../../../systems/types";
import { KOREAN_COLORS } from "../../../types/constants";
import { ProgressBar, KoreanText as KoreanText3D } from "../../three";
import { calculateProgressBarSize } from "../../../utils/responsiveLayout";

export interface CombatHUDThreeProps {
  readonly player1: PlayerState;
  readonly player2: PlayerState;
  readonly timeRemaining: number;
  readonly currentRound: number;
  readonly maxRounds: number;
  readonly roundsWon?: { player1: number; player2: number };
  readonly isPaused?: boolean;
  readonly position?: [number, number, number];
  readonly isMobile?: boolean;
}

/**
 * CombatHUDThree Component
 * 
 * Displays player health, ki, stamina, and round information
 * using the new Three.js Korean UI components.
 * 
 * @example
 * ```tsx
 * <CombatHUDThree
 *   player1={player1State}
 *   player2={player2State}
 *   timeRemaining={90}
 *   currentRound={1}
 *   maxRounds={3}
 *   position={[0, 3, 0]}
 * />
 * ```
 */
export const CombatHUDThree: React.FC<CombatHUDThreeProps> = ({
  player1,
  player2,
  timeRemaining,
  currentRound,
  maxRounds,
  roundsWon = { player1: 0, player2: 0 },
  isPaused = false,
  position = [0, 0, 0],
  isMobile = false,
}) => {
  // Get archetype data
  const player1Archetype = useMemo(
    () => PLAYER_ARCHETYPES_DATA[player1.archetype],
    [player1.archetype]
  );
  const player2Archetype = useMemo(
    () => PLAYER_ARCHETYPES_DATA[player2.archetype],
    [player2.archetype]
  );

  // Use responsive layout utilities for bar sizing
  const healthBarSize = useMemo(
    () => calculateProgressBarSize(isMobile, 'health'),
    [isMobile]
  );
  
  const kiBarSize = useMemo(
    () => calculateProgressBarSize(isMobile, 'ki'),
    [isMobile]
  );
  
  const staminaBarSize = useMemo(
    () => calculateProgressBarSize(isMobile, 'stamina'),
    [isMobile]
  );

  const barWidth = healthBarSize.width;

  return (
    <>
      {/* Round and Timer Info */}
      <KoreanText3D
        korean={`라운드 ${currentRound} / ${maxRounds}`}
        english={`Round ${currentRound} / ${maxRounds}`}
        size="medium"
        position={[position[0], position[1] + 1, position[2]]}
        weight="bold"
        color={KOREAN_COLORS.ACCENT_GOLD}
        layer="hud"
        testId="round-display"
      />

      <KoreanText3D
        korean={`시간: ${Math.ceil(timeRemaining)}초`}
        english={`Time: ${Math.ceil(timeRemaining)}s`}
        size="medium"
        position={[position[0], position[1] + 0.5, position[2]]}
        color={
          timeRemaining < 10
            ? KOREAN_COLORS.ACCENT_RED
            : KOREAN_COLORS.TEXT_PRIMARY
        }
        layer="hud"
        testId="timer-display"
      />

      {/* Player 1 HUD (Left Side) */}
      <>
        {/* Player 1 Name */}
        <KoreanText3D
          korean={player1Archetype.name.korean}
          english={player1Archetype.name.english}
          size="small"
          position={[position[0] - 5, position[1] + 0.2, position[2]]}
          color={player1Archetype.colors.primary}
          weight="bold"
          layer="hud"
          testId="player1-name"
        />

        {/* Player 1 Health */}
        <ProgressBar
          type="health"
          current={player1.health}
          max={player1.maxHealth}
          label={{ korean: "체력", english: "Health" }}
          position={[position[0] - 5, position[1] - 0.3, position[2]]}
          width={barWidth}
          height={healthBarSize.height}
          showText={true}
          animated={true}
          testId="player1-health"
        />

        {/* Player 1 Ki */}
        <ProgressBar
          type="ki"
          current={player1.ki}
          max={player1.maxKi}
          label={{ korean: "기력", english: "Ki" }}
          position={[position[0] - 5, position[1] - 0.8, position[2]]}
          width={barWidth}
          height={kiBarSize.height}
          showText={true}
          animated={true}
          testId="player1-ki"
        />

        {/* Player 1 Stamina */}
        <ProgressBar
          type="stamina"
          current={player1.stamina}
          max={player1.maxStamina}
          label={{ korean: "지구력", english: "Stamina" }}
          position={[position[0] - 5, position[1] - 1.3, position[2]]}
          width={barWidth}
          height={staminaBarSize.height}
          showText={true}
          animated={true}
          testId="player1-stamina"
        />

        {/* Player 1 Score */}
        <KoreanText3D
          korean={`승: ${roundsWon.player1}`}
          english={`Wins: ${roundsWon.player1}`}
          size="small"
          position={[position[0] - 5, position[1] - 1.8, position[2]]}
          color={KOREAN_COLORS.ACCENT_GOLD}
          layer="hud"
          testId="player1-score"
        />
      </>

      {/* Player 2 HUD (Right Side) */}
      <>
        {/* Player 2 Name */}
        <KoreanText3D
          korean={player2Archetype.name.korean}
          english={player2Archetype.name.english}
          size="small"
          position={[position[0] + 5, position[1] + 0.2, position[2]]}
          color={player2Archetype.colors.primary}
          weight="bold"
          layer="hud"
          testId="player2-name"
        />

        {/* Player 2 Health */}
        <ProgressBar
          type="health"
          current={player2.health}
          max={player2.maxHealth}
          label={{ korean: "체력", english: "Health" }}
          position={[position[0] + 5, position[1] - 0.3, position[2]]}
          width={barWidth}
          height={healthBarSize.height}
          showText={true}
          animated={true}
          testId="player2-health"
        />

        {/* Player 2 Ki */}
        <ProgressBar
          type="ki"
          current={player2.ki}
          max={player2.maxKi}
          label={{ korean: "기력", english: "Ki" }}
          position={[position[0] + 5, position[1] - 0.8, position[2]]}
          width={barWidth}
          height={kiBarSize.height}
          showText={true}
          animated={true}
          testId="player2-ki"
        />

        {/* Player 2 Stamina */}
        <ProgressBar
          type="stamina"
          current={player2.stamina}
          max={player2.maxStamina}
          label={{ korean: "지구력", english: "Stamina" }}
          position={[position[0] + 5, position[1] - 1.3, position[2]]}
          width={barWidth}
          height={staminaBarSize.height}
          showText={true}
          animated={true}
          testId="player2-stamina"
        />

        {/* Player 2 Score */}
        <KoreanText3D
          korean={`승: ${roundsWon.player2}`}
          english={`Wins: ${roundsWon.player2}`}
          size="small"
          position={[position[0] + 5, position[1] - 1.8, position[2]]}
          color={KOREAN_COLORS.ACCENT_GOLD}
          layer="hud"
          testId="player2-score"
        />
      </>

      {/* Pause Indicator */}
      {isPaused && (
        <KoreanText3D
          korean="일시정지"
          english="PAUSED"
          size="xlarge"
          position={[position[0], position[1], position[2] + 1]}
          color={KOREAN_COLORS.ACCENT_RED}
          weight="bold"
          layer="modal"
          testId="pause-indicator"
        />
      )}
    </>
  );
};

CombatHUDThree.displayName = "CombatHUDThree";
