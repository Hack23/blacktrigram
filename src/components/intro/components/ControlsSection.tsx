import React, { useMemo } from "react";
import { Container, Graphics, Text } from "@pixi/react";
import type { ControlsSectionProps } from "../../../types";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  COMBAT_CONTROLS,
} from "../../../types/constants";
import * as PIXI from "pixi.js";

export const ControlsSection: React.FC<ControlsSectionProps> = ({
  title = "게임 조작법 (Game Controls)",
  x = 0,
  y = 0,
  width = 800,
  height = 600,
  ...props
}) => {
  const headerStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.KOREAN_BATTLE,
        fontSize: FONT_SIZES.large,
        fill: KOREAN_COLORS.TEXT_ACCENT,
        fontWeight: FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight, // Fixed: use lowercase
        align: "center",
      }),
    []
  );

  const bodyStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.medium,
        fill: KOREAN_COLORS.TEXT_PRIMARY,
        fontWeight: FONT_WEIGHTS.regular.toString() as PIXI.TextStyleFontWeight, // Fixed: use lowercase
        wordWrap: true,
        wordWrapWidth: 350,
      }),
    []
  );

  const drawBackground = (g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.7);
    g.lineStyle(2, KOREAN_COLORS.PRIMARY_CYAN, 0.5);
    g.drawRoundedRect(0, 0, width, height, 15);
  };

  return (
    <Container x={x} y={y} width={width} height={height} {...props}>
      <Graphics draw={drawBackground} />
      <Text
        text={title}
        anchor={0.5}
        x={width / 2}
        y={30}
        style={headerStyle}
      />

      {/* Basic Controls */}
      <Container x={50} y={80}>
        <Text
          text="기본 조작 (Basic Controls)"
          style={{
            ...bodyStyle,
            fontSize: FONT_SIZES.large,
            fill: KOREAN_COLORS.ACCENT_PRIMARY,
          }}
          y={0}
        />

        {Object.entries(COMBAT_CONTROLS.stanceControls).map(([key, detail]) => (
          <Container key={key} y={40 + parseInt(key) * 25}>
            <Text
              text={`${key}: ${detail.korean} (${detail.technique})`}
              style={bodyStyle}
              x={0}
              y={0}
            />
            <Text
              text={`${key}: ${detail.stance} - ${detail.technique}`}
              style={{
                ...bodyStyle,
                fontSize: FONT_SIZES.small,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
              }}
              x={20}
              y={15}
            />
          </Container>
        ))}
      </Container>

      {/* Advanced Controls */}
      <Container x={400} y={80}>
        <Text
          text="고급 조작 (Advanced Controls)"
          style={{
            ...bodyStyle,
            fontSize: FONT_SIZES.large,
            fill: KOREAN_COLORS.ACCENT_PRIMARY,
          }}
          y={0}
        />

        <Text
          text="SPACE: 기술 실행 (Execute Technique)"
          style={bodyStyle}
          y={40}
        />
        <Text text="SHIFT: 방어 자세 (Guard Stance)" style={bodyStyle} y={65} />
        <Text
          text="CTRL: 급소 겨냥 (Vital Point Targeting)"
          style={bodyStyle}
          y={90}
        />
        <Text text="ESC: 일시정지 (Pause)" style={bodyStyle} y={115} />
      </Container>
    </Container>
  );
};

export default ControlsSection;
