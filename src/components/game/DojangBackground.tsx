// Underground dojang background for Korean martial arts

import React, { useMemo } from "react";
import { Container, Graphics, Text, useTick } from "@pixi/react";
import type { DojangBackgroundProps } from "../../types";
import {
  KOREAN_COLORS, // Keep if specific KOREAN_COLORS are used
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  GAME_CONFIG,
} from "../../types/constants";
import * as PIXI from "pixi.js"; // Import PIXI

export const DojangBackground: React.FC<DojangBackgroundProps> = ({
  timeOfDay = "day",
  weather = "clear",
  textureName, // Can be used with useTexture hook if needed
  lighting = "atmospheric",
  width = GAME_CONFIG.CANVAS_WIDTH,
  height = GAME_CONFIG.CANVAS_HEIGHT,
  children,
  ...props
}) => {
  const [time, setTime] = React.useState(0);
  useTick((delta) => setTime((t) => t + delta * 0.01)); // Slow down time for visual effect

  const backgroundColor = useMemo(() => {
    if (timeOfDay === "night") {
      return lighting === "dim"
        ? KOREAN_COLORS.UI_BACKGROUND_DARK
        : KOREAN_COLORS.BLACK_SOLID;
    }
    return lighting === "bright"
      ? KOREAN_COLORS.UI_BACKGROUND_LIGHT
      : KOREAN_COLORS.UI_BACKGROUND_MEDIUM;
  }, [timeOfDay, lighting]);

  const dynamicLightingColor = useMemo(() => {
    const baseColor =
      timeOfDay === "night"
        ? KOREAN_COLORS.SECONDARY_BLUE_DARK
        : KOREAN_COLORS.SECONDARY_YELLOW_LIGHT;
    const intensity = Math.sin(time * 0.5) * 0.2 + 0.8; // Pulsating intensity
    // This is a simplified way to "multiply" color intensity.
    // For more accurate color manipulation, consider a color library or more complex PIXI.Color logic.
    const r = (baseColor >> 16) & 0xff;
    const g = (baseColor >> 8) & 0xff;
    const b = baseColor & 0xff;
    return (
      (Math.floor(r * intensity) << 16) |
      (Math.floor(g * intensity) << 8) |
      Math.floor(b * intensity)
    );
  }, [timeOfDay, time]);

  const textStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.large,
        fill: KOREAN_COLORS.TEXT_PRIMARY,
        fontWeight: FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight, // Fixed: use lowercase
        dropShadow: {
          color: KOREAN_COLORS.BLACK_SOLID,
          blur: 4,
          angle: Math.PI / 6,
          distance: 3,
        },
      }),
    []
  );

  const weatherEffectsDraw = React.useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      if (weather === "rain") {
        g.lineStyle(1, KOREAN_COLORS.PRIMARY_BLUE_LIGHT, 0.5);
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          g.moveTo(x, y);
          g.lineTo(x - 5, y + 10);
        }
      } else if (weather === "snow") {
        g.beginFill(KOREAN_COLORS.WHITE_SOLID, 0.8);
        for (let i = 0; i < 50; i++) {
          g.drawCircle(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 2 + 1
          );
        }
        g.endFill();
      }
    },
    [weather, width, height]
  );

  return (
    <Container {...props} width={width} height={height}>
      <Graphics
        draw={(g: PIXI.Graphics) => {
          g.clear();
          g.beginFill(backgroundColor);
          g.drawRect(0, 0, width, height);
          g.endFill();

          // Atmospheric lighting effect
          if (lighting === "atmospheric") {
            g.beginFill(dynamicLightingColor, 0.2);
            g.drawCircle(width / 2, height / 3, Math.min(width, height) / 2);
            g.endFill();
          }
        }}
      />
      {/* Placeholder for texture if textureName is provided */}
      {/* e.g., <Sprite texture={useTexture(textureName)} width={width} height={height} /> */}

      <Graphics draw={weatherEffectsDraw} />

      <Text
        text="도장 (Dojang)"
        x={width / 2}
        y={50}
        anchor={0.5}
        style={textStyle}
      />
      {children}
    </Container>
  );
};
