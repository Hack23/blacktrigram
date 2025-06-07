import React, { useCallback, useState, useMemo } from "react";
import { Container, Graphics, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import type {
  TrainingScreenProps,
  PlayerState,
  TrigramStance,
} from "../../types";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  GAME_CONFIG,
  PLAYER_ARCHETYPE_DATA,
} from "../../types/constants";

export const TrainingScreen: React.FC<TrainingScreenProps> = ({
  player: initialPlayer,
  onGamePhaseChange,
  onPlayerUpdate,
  onReturnToMenu,
  onStartCombat,
  width = GAME_CONFIG.CANVAS_WIDTH,
  height = GAME_CONFIG.CANVAS_HEIGHT,
  ...props
}) => {
  const [player, setPlayer] = useState<PlayerState | undefined>(initialPlayer);

  const archetypeData = player ? PLAYER_ARCHETYPE_DATA[player.archetype] : null;

  const handleStanceSelect = useCallback(
    (stance: TrigramStance) => {
      if (player && onPlayerUpdate) {
        const playerIndex =
          props.players?.findIndex((p: PlayerState) => p.id === player.id) ?? 0;
        onPlayerUpdate(playerIndex as 0 | 1, { currentStance: stance });
      } else if (player) {
        setPlayer((prev) =>
          prev ? { ...prev, currentStance: stance } : undefined
        );
      }
    },
    [player, onPlayerUpdate, props.players]
  );

  const titleStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.xlarge,
        fill: KOREAN_COLORS.TEXT_PRIMARY,
        align: "center",
      }),
    []
  );

  const infoStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.SECONDARY,
        fontSize: FONT_SIZES.medium,
        fill: KOREAN_COLORS.TEXT_SECONDARY,
        wordWrap: true,
        wordWrapWidth: width * 0.4,
      }),
    [width]
  );

  if (!player || !archetypeData) {
    return (
      <Container x={0} y={0} width={width} height={height}>
        <Text
          text="Loading Training..."
          anchor={0.5}
          x={width / 2}
          y={height / 2}
          style={titleStyle}
        />
      </Container>
    );
  }

  return (
    <Container x={0} y={0} width={width} height={height}>
      <Graphics
        draw={(g: PIXI.Graphics) => {
          g.clear();
          g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9);
          g.drawRect(0, 0, width, height);
          g.endFill();
        }}
      />

      <Text
        text="훈련 모드 (Training Mode)"
        anchor={0.5}
        x={width / 2}
        y={50}
        style={titleStyle}
      />

      <Text
        text={`선택된 무예가: ${player.name.korean} (${archetypeData.name.english})`}
        x={50}
        y={120}
        style={infoStyle}
      />
    </Container>
  );
};
