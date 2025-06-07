import React, { useState, useMemo } from "react";
import * as PIXI from "pixi.js";
import { Container, Graphics, Text } from "@pixi/react";
import {
  KOREAN_FONT_SIZES,
  type PhilosophySectionProps,
  type PlayerArchetype,
} from "../../../types";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  KOREAN_FONT_WEIGHTS,
  KOREAN_TEXT_SIZES,
  KOREAN_FONT_FAMILY,
  PLAYER_ARCHETYPES_DATA,
} from "../../../types/constants";
import { BaseButton } from "../../ui/base";

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  onGamePhaseChange,
  title = "흑괘 철학 (Black Trigram Philosophy)",
  width = 700,
  height = 450,
  x = 50,
  y = 100,
}) => {
  const [selectedArchetype, setSelectedArchetype] =
    useState<PlayerArchetype>("musa");

  const titleStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.KOREAN_BATTLE,
        fontSize: FONT_SIZES.xlarge,
        fill: KOREAN_COLORS.TEXT_ACCENT,
        fontWeight:
          KOREAN_FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
        align: "center",
        stroke: {
          color: KOREAN_COLORS.BLACK_SOLID,
          width: 2,
        },
      }),
    []
  );

  const bodyStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: KOREAN_TEXT_SIZES.medium,
        fill: KOREAN_COLORS.TEXT_PRIMARY,
        fontWeight:
          KOREAN_FONT_WEIGHTS.regular.toString() as PIXI.TextStyleFontWeight,
        wordWrap: true,
        wordWrapWidth: 500,
        align: "left",
      }),
    []
  );

  const archetypeStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: KOREAN_FONT_SIZES.large,
        fill: KOREAN_COLORS.PRIMARY_CYAN,
        fontWeight:
          KOREAN_FONT_WEIGHTS.medium.toString() as PIXI.TextStyleFontWeight, // Fixed: use Korean font weights
        align: "center",
      }),
    []
  );

  const drawBackground = (g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.8);
    g.lineStyle(2, KOREAN_COLORS.PRIMARY_CYAN, 0.5);
    g.drawRoundedRect(0, 0, width, height, 15);
    g.endFill();
  };

  const centerX = width / 2;

  return (
    <Container x={x} y={y} width={width} height={height}>
      <Graphics draw={drawBackground} />
      <Text text={title} x={centerX} y={30} anchor={0.5} style={titleStyle} />

      <Container x={centerX} y={100}>
        {Object.keys(PLAYER_ARCHETYPES_DATA).map((key, index) => (
          <BaseButton
            key={key}
            text={PLAYER_ARCHETYPES_DATA[key as PlayerArchetype].name.korean}
            x={0}
            y={index * 40}
            width={200}
            height={35}
            anchor={0.5}
            variant={selectedArchetype === key ? "primary" : "secondary"}
            onPixiClick={() => setSelectedArchetype(key as PlayerArchetype)}
          />
        ))}
      </Container>

      {selectedArchetype && PLAYER_ARCHETYPES_DATA[selectedArchetype] && (
        <Container x={centerX} y={height / 2 + 40}>
          <Text
            text={PLAYER_ARCHETYPES_DATA[selectedArchetype].name.english}
            anchor={0.5}
            y={0}
            style={archetypeStyle}
          />
          <Text
            text={PLAYER_ARCHETYPES_DATA[selectedArchetype].description.korean}
            anchor={0.5}
            y={40}
            style={bodyStyle}
          />
          <Text
            text={PLAYER_ARCHETYPES_DATA[selectedArchetype].description.english}
            anchor={0.5}
            y={bodyStyle.fontSize ? 40 + bodyStyle.fontSize * 2.5 : 90}
            style={{
              ...bodyStyle,
              fill: KOREAN_COLORS.TEXT_SECONDARY,
            }}
          />
          <Text
            text={`"${PLAYER_ARCHETYPES_DATA[selectedArchetype].description.korean}"`}
            anchor={0.5}
            y={bodyStyle.fontSize ? 40 + bodyStyle.fontSize * 6 : 170}
            style={{
              ...bodyStyle,
              fontStyle: "italic",
              fill: KOREAN_COLORS.ACCENT_RED,
            }}
          />
        </Container>
      )}
      <BaseButton
        text="Return to Menu"
        x={centerX}
        y={height - 30}
        anchor={0.5}
        onPixiClick={() => onGamePhaseChange?.("intro")}
        variant="ghost"
      />
    </Container>
  );
};

export default PhilosophySection;
