import React, { useMemo } from "react";
import { Container, Graphics, Text } from "@pixi/react";
import type { KoreanHeaderProps as ComponentKoreanHeaderProps } from "../../types"; // Renamed to avoid conflict
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  GAME_CONFIG,
} from "../../types/constants";
import * as PIXI from "pixi.js";

export const KoreanHeader: React.FC<ComponentKoreanHeaderProps> = ({
  korean,
  english,
  subtitle,
  level = 1,
  showLogo = false, // Default to false
  // style, // This is for React CSSProperties, not used directly in Pixi rendering here
  onBackButtonClick,
  // className, // For HTML elements, not Pixi
  width = GAME_CONFIG.CANVAS_WIDTH, // Default width
  // height = 80, // Default height, can be dynamic
}) => {
  const titleFillColor: number = useMemo(() => {
    switch (level) {
      case 1:
        return KOREAN_COLORS.ACCENT_PRIMARY;
      case 2:
        return KOREAN_COLORS.PRIMARY_CYAN;
      default:
        return KOREAN_COLORS.TEXT_PRIMARY;
    }
  }, [level]);

  const titleFontSize = useMemo(() => {
    switch (level) {
      case 1:
        return FONT_SIZES.xlarge;
      case 2:
        return FONT_SIZES.large;
      default:
        return FONT_SIZES.medium;
    }
  }, [level]);

  const titleStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: titleFontSize,
        fill: titleFillColor,
        fontWeight: FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight, // Corrected
        align: "center",
      }),
    [titleFontSize, titleFillColor]
  );

  const subtitleStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.SECONDARY,
        fontSize: FONT_SIZES.small,
        fill: KOREAN_COLORS.TEXT_SECONDARY,
        fontWeight: FONT_WEIGHTS.regular.toString() as PIXI.TextStyleFontWeight, // Corrected
        align: "center",
      }),
    []
  );

  const headerHeight = subtitle
    ? titleFontSize * 1.5 + FONT_SIZES.small * 1.5 + 30
    : titleFontSize * 1.5 + 20;

  const drawBackground = (g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.5);
    g.drawRect(0, 0, width, headerHeight);
    g.endFill();

    // Decorative line
    g.beginFill(KOREAN_COLORS.PRIMARY_PINK);
    g.drawRect(0, headerHeight - 5, width, 5);
    g.endFill();
  };

  return (
    <Container width={width} height={headerHeight}>
      <Graphics draw={drawBackground} />
      {showLogo && (
        <Text
          text="흑괘"
          x={50}
          y={headerHeight / 2}
          anchor={[0, 0.5]}
          style={{
            ...titleStyle,
            fontSize: FONT_SIZES.medium,
            fill: KOREAN_COLORS.ACCENT_SECONDARY,
          }}
        />
      )}
      <Text
        text={korean}
        anchor={0.5}
        x={width / 2}
        y={
          subtitle
            ? headerHeight / 2 - FONT_SIZES.small * 0.75
            : headerHeight / 2
        }
        style={titleStyle}
      />
      {subtitle && (
        <Text
          text={typeof subtitle === "string" ? subtitle : subtitle.korean}
          anchor={0.5}
          x={width / 2}
          y={headerHeight / 2 + titleFontSize * 0.75}
          style={{ ...subtitleStyle, fill: KOREAN_COLORS.TEXT_SECONDARY }}
        />
      )}
      {onBackButtonClick && (
        <Text
          text="< 뒤로"
          x={30}
          y={headerHeight / 2}
          anchor={[0, 0.5]}
          interactive={true}
          buttonMode={true}
          pointertap={onBackButtonClick}
          style={{ ...subtitleStyle, fill: KOREAN_COLORS.TEXT_SECONDARY }}
        />
      )}
    </Container>
  );
};

export default KoreanHeader;
