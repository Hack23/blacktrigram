import React, { useMemo } from "react";
import { Container, Graphics, Text } from "@pixi/react";
import type { ProgressTrackerProps } from "../../types";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../../types/constants";
import * as PIXI from "pixi.js";

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  label,
  value = 0,
  maxValue = 100,
  width = 200,
  height = 20,
  barColor = KOREAN_COLORS.PRIMARY_CYAN,
  backgroundColor = KOREAN_COLORS.UI_BACKGROUND_DARK,
  borderColor = KOREAN_COLORS.UI_STEEL_GRAY,
  borderWidth = 1,
  showText = true,
  textColor = KOREAN_COLORS.TEXT_PRIMARY,
  showLabels = true, // Added from props
  spacing = 5, // Added from props
  x = 0, // Added from props
  y = 0, // Added from props
  ...props
}) => {
  const percentage =
    maxValue > 0 ? Math.max(0, Math.min(1, value / maxValue)) : 0;

  const textStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.MONO,
        fontSize: FONT_SIZES.small * 0.9, // Slightly smaller for bars
        fill: textColor,
        align: "center",
      }),
    [textColor]
  );

  const labelStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.small,
        fill: KOREAN_COLORS.TEXT_SECONDARY,
        fontWeight:
          FONT_WEIGHTS.semibold.toString() as PIXI.TextStyleFontWeight,
      }),
    []
  );

  const labelYPos = -(FONT_SIZES.small + spacing);

  const draw = (g: PIXI.Graphics) => {
    g.clear();

    // Background
    g.beginFill(backgroundColor as number, 0.8); // Cast as number if ColorValue can be string
    if (borderWidth > 0) {
      g.lineStyle(borderWidth, borderColor as number, 1); // Cast as number
    }
    g.drawRoundedRect(0, 0, width, height, height / 4);
    g.endFill();

    // Bar
    if (percentage > 0) {
      g.beginFill(barColor as number, 1); // Cast as number
      // No border for the fill part to avoid double border
      g.lineStyle(0);
      g.drawRoundedRect(
        borderWidth, // Offset by border
        borderWidth, // Offset by border
        (width - borderWidth * 2) * percentage,
        height - borderWidth * 2,
        (height - borderWidth * 2) / 4
      );
      g.endFill();
    }
  };

  return (
    <Container x={x} y={y} {...props}>
      {showLabels && label && (
        <Text text={label} y={labelYPos} style={labelStyle} />
      )}
      <Graphics draw={draw} />
      {showText && (
        <Text
          text={`${Math.round(value)} / ${maxValue}`}
          anchor={0.5}
          x={width / 2}
          y={height / 2}
          style={textStyle}
        />
      )}
    </Container>
  );
};

export default ProgressTracker;
