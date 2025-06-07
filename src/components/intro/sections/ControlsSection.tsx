import React, { useMemo } from "react";
import { Container, Graphics, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import type { ControlsSectionProps } from "../../../types";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  FONT_WEIGHTS,
  COMBAT_CONTROLS,
} from "../../../types/constants";

export const ControlsSection: React.FC<ControlsSectionProps> = ({
  title = "게임 조작법 (Game Controls)",
  onBackToMenu,
  width = 800,
  height = 600,
  x = 0,
  y = 0,
}) => {
  const titleStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: FONT_SIZES.large,
        fill: KOREAN_COLORS.TEXT_PRIMARY,
        fontWeight: FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
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
        fontWeight: FONT_WEIGHTS.regular.toString() as PIXI.TextStyleFontWeight,
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
    g.endFill();
  };

  let currentY = 60;

  return (
    <Container x={x} y={y}>
      <Graphics draw={drawBackground} />
      <Text text={title} x={width / 2} y={25} anchor={0.5} style={titleStyle} />

      <Text
        text="팔괘 자세 (Trigram Stances): 1-8"
        x={20}
        y={currentY}
        style={bodyStyle}
      />

      {Object.entries(COMBAT_CONTROLS.stanceControls).map(([key, detail]) => {
        currentY += 25;
        return (
          <Text
            key={key}
            text={`${key}: ${detail.korean} (${detail.technique})`}
            x={40}
            y={currentY}
            style={bodyStyle}
          />
        );
      })}

      {(() => {
        currentY += 30;
        return null;
      })()}
      <Text text="이동 (Movement)" x={20} y={currentY} style={bodyStyle} />

      {Object.entries(COMBAT_CONTROLS.movement).map(([key, desc]) => {
        currentY += 25;
        return (
          <Text
            key={key}
            text={`${key}: ${desc}`}
            x={40}
            y={currentY}
            style={bodyStyle}
          />
        );
      })}

      {(() => {
        currentY += 30;
        return null;
      })()}
      <Text
        text="전투 행동 (Combat Actions)"
        x={20}
        y={currentY}
        style={bodyStyle}
      />

      {Object.entries(COMBAT_CONTROLS.combat).map(([key, desc]) => {
        currentY += 25;
        return (
          <Text
            key={key}
            text={`${key}: ${desc}`}
            x={40}
            y={currentY}
            style={bodyStyle}
          />
        );
      })}

      {(() => {
        currentY += 30;
        return null;
      })()}
      <Text text="시스템 (System)" x={20} y={currentY} style={bodyStyle} />

      {Object.entries(COMBAT_CONTROLS.system).map(([key, desc]) => {
        currentY += 25;
        return (
          <Text
            key={key}
            text={`${key}: ${desc}`}
            x={40}
            y={currentY}
            style={bodyStyle}
          />
        );
      })}

      {/* Back Button */}
      {onBackToMenu && (
        <Container
          x={width - 120}
          y={height - 60}
          interactive={true}
          buttonMode={true}
          pointertap={onBackToMenu}
        >
          <Graphics
            draw={(g: PIXI.Graphics) => {
              g.clear();
              g.beginFill(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.8);
              g.lineStyle(2, KOREAN_COLORS.UI_BORDER);
              g.drawRoundedRect(0, 0, 100, 40, 5);
              g.endFill();
            }}
          />
          <Text
            text="뒤로 (Back)"
            anchor={0.5}
            x={50}
            y={20}
            style={bodyStyle}
          />
        </Container>
      )}
    </Container>
  );
};

export default ControlsSection;
