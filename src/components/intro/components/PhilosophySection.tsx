import React, { useMemo } from "react";
import { Container, Graphics, Text } from "@pixi/react";
import * as PIXI from "pixi.js";
import type { PhilosophySectionProps, PlayerArchetype } from "../../../types";
import {
  KOREAN_COLORS,
  FONT_FAMILY,
  KOREAN_FONT_WEIGHTS,
  PLAYER_ARCHETYPES,
} from "../../../types/constants";
import { KOREAN_TEXT_SIZES } from "../../../types/constants/typography";

const ARCHETYPE_DATA: Record<
  PlayerArchetype,
  {
    korean: string;
    english: string;
    description: { korean: string; english: string };
  }
> = {
  musa: {
    korean: "무사",
    english: "Warrior",
    description: {
      korean: "전통적인 무예의 길을 걷는 명예로운 전사",
      english: "Honorable warrior following the traditional martial path",
    },
  },
  amsalja: {
    korean: "암살자",
    english: "Assassin",
    description: {
      korean: "그림자 속에서 효율성을 추구하는 은밀한 전사",
      english: "Silent warrior pursuing efficiency from the shadows",
    },
  },
  hacker: {
    korean: "해커",
    english: "Hacker",
    description: {
      korean: "정보를 힘으로 삼는 사이버 전사",
      english: "Cyber warrior wielding information as power",
    },
  },
  jeongbo_yowon: {
    korean: "정보요원",
    english: "Intelligence Operative",
    description: {
      korean: "관찰을 통해 지식을 얻는 전략적 전사",
      english: "Strategic warrior gaining knowledge through observation",
    },
  },
  jojik_pokryeokbae: {
    korean: "조직폭력배",
    english: "Organized Crime",
    description: {
      korean: "무자비함을 통해 생존하는 거친 전사",
      english: "Ruthless warrior surviving through brutality",
    },
  },
};

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  onGamePhaseChange,
  onBackToMenu,
  selectedArchetype,
  onArchetypeSelect,
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
        fontSize: KOREAN_TEXT_SIZES.title, // Fixed: use lowercase
        fill: KOREAN_COLORS.TEXT_PRIMARY,
        fontWeight:
          KOREAN_FONT_WEIGHTS.bold.toString() as PIXI.TextStyleFontWeight,
        align: "center",
      }),
    []
  );

  const headerStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: KOREAN_TEXT_SIZES.medium, // Fixed: use lowercase
        fill: KOREAN_COLORS.ACCENT_PRIMARY,
        fontWeight:
          KOREAN_FONT_WEIGHTS.medium.toString() as PIXI.TextStyleFontWeight,
        align: "center",
      }),
    []
  );

  const bodyStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: FONT_FAMILY.PRIMARY,
        fontSize: KOREAN_TEXT_SIZES.small, // Fixed: use lowercase
        fill: KOREAN_COLORS.TEXT_SECONDARY,
        fontWeight:
          KOREAN_FONT_WEIGHTS.regular.toString() as PIXI.TextStyleFontWeight,
        wordWrap: true,
        wordWrapWidth: width - 40,
      }),
    [width]
  );

  const drawBackground = (g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9);
    g.drawRect(0, 0, width, height);
    g.endFill();
  };

  return (
    <Container x={x} y={y} width={width} height={height} {...props}>
      <Graphics draw={drawBackground} />

      <Text
        text="흑괘의 철학 (Philosophy of Black Trigram)"
        anchor={0.5}
        x={width / 2}
        y={30}
        style={titleStyle}
      />

      {/* Archetype Selection */}
      <Container y={100}>
        <Text
          text="무예가 유형 선택 (Select Martial Artist Type)"
          x={20}
          y={0}
          style={headerStyle}
        />

        {PLAYER_ARCHETYPES.map((archetype, index) => {
          const data = ARCHETYPE_DATA[archetype];
          const isSelected = selectedArchetype === archetype;

          return (
            <Container
              key={archetype}
              x={20}
              y={40 + index * 80}
              interactive={true}
              buttonMode={true}
              pointertap={() =>
                onArchetypeSelect && onArchetypeSelect(archetype)
              }
            >
              <Graphics
                draw={(g: PIXI.Graphics) => {
                  g.clear();
                  g.beginFill(
                    isSelected
                      ? KOREAN_COLORS.ACCENT_PRIMARY
                      : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                    isSelected ? 0.3 : 0.1
                  );
                  g.lineStyle(
                    2,
                    isSelected
                      ? KOREAN_COLORS.ACCENT_PRIMARY
                      : KOREAN_COLORS.UI_BORDER
                  );
                  g.drawRoundedRect(0, 0, width - 40, 70, 10);
                  g.endFill();
                }}
              />

              <Text
                text={`${data.korean} (${data.english})`}
                x={15}
                y={15}
                style={{
                  ...headerStyle,
                  fontSize: KOREAN_TEXT_SIZES.small, // Fixed: use lowercase
                  fill: isSelected
                    ? KOREAN_COLORS.TEXT_PRIMARY
                    : KOREAN_COLORS.TEXT_SECONDARY,
                }}
              />

              <Text
                text={data.description.korean}
                x={15}
                y={35}
                style={{
                  ...bodyStyle,
                  fontSize: KOREAN_TEXT_SIZES.small, // Fixed: use lowercase
                }}
              />
            </Container>
          );
        })}
      </Container>

      {/* Back Button */}
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
          style={{
            ...bodyStyle,
            fontSize: KOREAN_TEXT_SIZES.large, // Fixed: use lowercase
            fill: KOREAN_COLORS.TEXT_PRIMARY,
          }}
        />
      </Container>
    </Container>
  );
};

export default PhilosophySection;
