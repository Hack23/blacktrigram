import React, { useMemo } from "react";
import { Container, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import type { MenuSectionProps } from "../../../types/components";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  FONT_FAMILY,
} from "../../../types/constants";

export const MenuSection: React.FC<MenuSectionProps> = ({
  title,
  onStartGame,
  onShowTraining,
  onShowCredits,
  width = 800,
  height = 600,
  x = 0,
  y = 0,
}) => {
  const titleStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.xlarge,
        fill: KOREAN_COLORS.ACCENT_PRIMARY,
        fontWeight: FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight, // Fixed: use lowercase
        align: "center",
      }),
    []
  );

  const buttonStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.medium,
        fill: KOREAN_COLORS.TEXT_PRIMARY,
        fontWeight: FONT_WEIGHTS.medium.toString() as PIXI.TextStyleFontWeight, // Fixed: use lowercase
        align: "center",
      }),
    []
  );

  return (
    <Container x={x} y={y} width={width} height={height}>
      <Text text={title} anchor={0.5} x={width / 2} y={50} style={titleStyle} />

      <Container x={width / 2} y={120}>
        <Text
          text="Start Game"
          anchor={0.5}
          x={0}
          y={0}
          style={buttonStyle}
          interactive={true}
          buttonMode={true}
          pointertap={onStartGame}
        />
        <Text
          text="Training"
          anchor={0.5}
          x={0}
          y={70}
          style={buttonStyle}
          interactive={true}
          buttonMode={true}
          pointertap={onShowTraining}
        />
        <Text
          text="Credits"
          anchor={0.5}
          x={0}
          y={140}
          style={buttonStyle}
          interactive={true}
          buttonMode={true}
          pointertap={onShowCredits}
        />
      </Container>
    </Container>
  );
};

export default MenuSection;
