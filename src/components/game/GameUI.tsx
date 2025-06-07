import React from "react";
import { Container, Text } from "@pixi/react";
import type { GameUIProps } from "../../types";
import { Player } from "./Player";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  GAME_CONFIG,
  FONT_SIZES,
} from "../../types/constants";
import * as PIXI from "pixi.js";

export const GameUI: React.FC<GameUIProps> = ({
  players,
  currentRound,
  gamePhase: currentGamePhase,
  timeRemaining,
  isPaused,
  onStanceChange,
  onPlayerUpdate,
  onGamePhaseChange,
  width = GAME_CONFIG.CANVAS_WIDTH,
  height = GAME_CONFIG.CANVAS_HEIGHT,
  ...props
}) => {
  const headerStyle = React.useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.medium,
        fill: KOREAN_COLORS.TEXT_PRIMARY,
        stroke: KOREAN_COLORS.BLACK_SOLID,
        align: "center",
      }),
    []
  );

  const roundTextStyle = React.useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.large,
        fill: KOREAN_COLORS.ACCENT_PRIMARY,
        stroke: KOREAN_COLORS.BLACK_SOLID,
        align: "center",
      }),
    []
  );

  const renderPlayerUI = (playerState: (typeof players)[0], index: number) => {
    if (!playerState) return null;
    return (
      <Player
        key={playerState.id}
        playerState={playerState}
        onStateUpdate={(updates: Partial<typeof playerState>) =>
          onPlayerUpdate(index, updates)
        }
        archetype={playerState.archetype}
        stance={playerState.currentStance}
        position={playerState.position}
        facing={playerState.facing}
        health={playerState.health}
        maxHealth={playerState.maxHealth}
        ki={playerState.ki}
        maxKi={playerState.maxKi}
        stamina={playerState.stamina}
        maxStamina={playerState.maxStamina}
        showVitalPoints={GAME_CONFIG.SHOW_VITAL_POINTS_DEBUG}
        x={index === 0 ? 50 : width - 250}
        y={50}
        width={200}
        height={150}
      />
    );
  };

  return (
    <Container {...props} width={width} height={height}>
      {players.map((p, i) => renderPlayerUI(p, i))}

      {currentGamePhase === "combat" && !isPaused && (
        <Container x={width / 2} y={30}>
          <Text
            text={`Round: ${currentRound}`}
            anchor={0.5}
            style={roundTextStyle}
            y={0}
          />
          <Text
            text={`Time: ${timeRemaining?.toFixed(1)}s`}
            anchor={0.5}
            style={headerStyle}
            y={30}
          />
        </Container>
      )}

      {isPaused && (
        <Text
          text="PAUSED"
          anchor={0.5}
          x={width / 2}
          y={height / 2}
          style={roundTextStyle}
        />
      )}
      {(currentGamePhase === "victory" || currentGamePhase === "defeat") && (
        <Text
          text={currentGamePhase === "victory" ? "VICTORY!" : "DEFEAT!"}
          anchor={0.5}
          x={width / 2}
          y={height / 2}
          style={{
            ...roundTextStyle,
            fontSize: FONT_SIZES.xlarge,
            fill:
              currentGamePhase === "victory"
                ? KOREAN_COLORS.POSITIVE_GREEN
                : KOREAN_COLORS.NEGATIVE_RED,
          }}
        />
      )}
    </Container>
  );
};

export default GameUI;
