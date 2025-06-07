// Complete Player component with Korean martial arts character rendering

import React, { useMemo } from "react";
import { Container, Graphics, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import type { PlayerProps, TrigramStance } from "../../types";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  TRIGRAM_DATA,
} from "../../types/constants";

const getStanceColor = (stance: string): number => {
  const stanceData = TRIGRAM_DATA[stance as keyof typeof TRIGRAM_DATA];
  return stanceData?.theme?.primary || KOREAN_COLORS.UI_STEEL_GRAY;
};

export const Player: React.FC<PlayerProps> = ({
  playerState,
  onStateUpdate,
  archetype,
  stance,
  position,
  facing,
  health,
  maxHealth,
  ki,
  maxKi,
  stamina,
  maxStamina,
  showVitalPoints,
  x = 0,
  y = 0,
  width = 200,
  height = 150,
  ...props
}) => {
  const { name, currentStance } = playerState;

  const nameTextStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.KOREAN_BATTLE,
        fontSize: FONT_SIZES.medium,
        fill: KOREAN_COLORS.TEXT_ACCENT,
        fontWeight: FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
        stroke: { color: KOREAN_COLORS.BLACK_SOLID, width: 2 }, // Fixed: use stroke object
      }),
    []
  );

  const barHeight = 15;
  const barWidth = width * 0.8;
  const barSpacing = 5;

  const drawBar = (
    g: PIXI.Graphics,
    currentValue: number,
    maxValue: number,
    color: number,
    yOffset: number
  ) => {
    const ratio = currentValue / maxValue;

    // Background bar
    g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK);
    g.drawRect(10, yOffset, barWidth, barHeight);
    g.endFill();

    // Fill bar
    g.beginFill(color);
    g.drawRect(10, yOffset, barWidth * ratio, barHeight);
    g.endFill();

    // Border
    g.lineStyle(1, KOREAN_COLORS.UI_BORDER);
    g.drawRect(10, yOffset, barWidth, barHeight);
  };

  const drawPlayerInfo = React.useCallback(
    (g: PIXI.Graphics) => {
      g.clear();

      // Player background
      g.beginFill(getStanceColor(currentStance), 0.2);
      g.lineStyle(2, getStanceColor(currentStance));
      g.drawRoundedRect(0, 0, width, height, 10);
      g.endFill();

      // Health bar
      drawBar(g, health, maxHealth, KOREAN_COLORS.POSITIVE_GREEN, 30);

      // Ki bar
      drawBar(
        g,
        ki,
        maxKi,
        KOREAN_COLORS.PRIMARY_BLUE_LIGHT,
        30 + barHeight + barSpacing
      );

      // Stamina bar
      drawBar(
        g,
        stamina,
        maxStamina,
        KOREAN_COLORS.SECONDARY_YELLOW_LIGHT,
        30 + (barHeight + barSpacing) * 2
      );
    },
    [
      width,
      height,
      health,
      maxHealth,
      ki,
      maxKi,
      stamina,
      maxStamina,
      currentStance,
      drawBar,
    ]
  );

  return (
    <Container x={x} y={y} {...props}>
      <Graphics draw={drawPlayerInfo} />

      <Text
        text={name.korean}
        anchor={0.5}
        x={width / 2}
        y={10}
        style={nameTextStyle}
      />

      <Text
        text={
          TRIGRAM_DATA[currentStance as TrigramStance]?.name.korean ||
          currentStance
        }
        anchor={0.5}
        x={width / 2}
        y={height - 20}
        style={{
          ...nameTextStyle,
          fontSize: FONT_SIZES.small,
          fill: getStanceColor(currentStance),
        }}
      />

      {showVitalPoints && (
        <Graphics
          draw={(g: PIXI.Graphics) => {
            g.beginFill(KOREAN_COLORS.NEGATIVE_RED, 0.7);
            g.drawCircle(width / 2, height / 2, 3);
            g.endFill();
          }}
        />
      )}
    </Container>
  );
};

export default Player;
