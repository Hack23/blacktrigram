import React, { useMemo } from "react";
import { Container, Graphics, Text } from "@pixi/react";
import type { EndScreenProps } from "../../types";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  GAME_CONFIG,
} from "../../types/constants";
import * as PIXI from "pixi.js";

export const EndScreen: React.FC<EndScreenProps> = ({
  winnerId,
  onRestart,
  onReturnToMenu,
  width = GAME_CONFIG.CANVAS_WIDTH,
  height = GAME_CONFIG.CANVAS_HEIGHT,
  ...props
}) => {
  const resultText = useMemo(() => {
    if (winnerId) {
      return {
        korean: "승리!",
        english: "Victory!",
      };
    } else {
      return {
        korean: "무승부",
        english: "Draw",
      };
    }
  }, [winnerId]);

  const titleStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.xlarge,
        fill: winnerId
          ? KOREAN_COLORS.POSITIVE_GREEN
          : KOREAN_COLORS.SECONDARY_YELLOW,
        fontWeight: FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
        align: "center",
        dropShadow: {
          color: KOREAN_COLORS.BLACK_SOLID,
          blur: 5,
          distance: 3,
        },
      }),
    [winnerId]
  );

  return (
    <Container {...props} x={0} y={0} width={width} height={height}>
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DEEP_DARK, 0.9);
          g.drawRect(0, 0, width, height);
          g.endFill();
        }}
      />

      <Text
        text={resultText.korean}
        anchor={0.5}
        x={width / 2}
        y={height / 2 - 100}
        style={titleStyle}
      />
      <Text
        text={resultText.english}
        anchor={0.5}
        x={width / 2}
        y={height / 2 - 50}
        style={{
          ...titleStyle,
          fontSize: FONT_SIZES.large,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
        }}
      />
    </Container>
  );
};

export default EndScreen;
