import React, { useMemo } from "react";
import { Container, Graphics, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import type { MenuSectionProps } from "../../../types";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
} from "../../../types/constants";

export const MenuSection: React.FC<MenuSectionProps> = ({
  onStartCombat,
  onStartTraining,
  onShowPhilosophy,
  onShowControls,
  onShowTraining,
  onShowCredits,
  x = 0,
  y = 0,
  width = 800,
  height = 600,
  ...props
}) => {
  const titleStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.xlarge,
        fill: KOREAN_COLORS.TEXT_PRIMARY,
        fontWeight: FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
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
        fontWeight: FONT_WEIGHTS.medium.toString() as PIXI.TextStyleFontWeight,
        align: "center",
      }),
    []
  );

  const menuItems = [
    { korean: "전투 시작", english: "Start Combat", action: onStartCombat },
    {
      korean: "훈련 모드",
      english: "Training Mode",
      action: onStartTraining || onShowTraining,
    },
    {
      korean: "철학 보기",
      english: "View Philosophy",
      action: onShowPhilosophy,
    },
    { korean: "조작법", english: "Controls", action: onShowControls },
    { korean: "제작진", english: "Credits", action: onShowCredits },
  ];

  const drawBackground = (g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8);
    g.drawRect(0, 0, width, height);
    g.endFill();
  };

  const drawButton = (g: PIXI.Graphics, isHover: boolean = false) => {
    g.clear();
    g.beginFill(
      isHover
        ? KOREAN_COLORS.ACCENT_PRIMARY
        : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
      isHover ? 0.3 : 0.8
    );
    g.lineStyle(2, KOREAN_COLORS.UI_BORDER);
    g.drawRoundedRect(0, 0, 300, 50, 10);
    g.endFill();
  };

  return (
    <Container x={x} y={y} width={width} height={height} {...props}>
      <Graphics draw={drawBackground} />

      <Text
        text="흑괘 (Black Trigram)"
        anchor={0.5}
        x={width / 2}
        y={80}
        style={titleStyle}
      />

      <Container x={width / 2 - 150} y={200}>
        {menuItems.map((item, index) => (
          <Container
            key={index}
            y={index * 70}
            interactive={true}
            buttonMode={true}
            pointertap={item.action}
          >
            <Graphics draw={(g: PIXI.Graphics) => drawButton(g, false)} />
            <Text
              text={`${item.korean} (${item.english})`}
              anchor={0.5}
              x={150}
              y={25}
              style={buttonStyle}
            />
          </Container>
        ))}
      </Container>
    </Container>
  );
};

export default MenuSection;
