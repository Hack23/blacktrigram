import React, { useCallback } from "react";
import { PlayerArchetype } from "../../types/enums";
import { KOREAN_COLORS } from "../../types/constants";
import { ResponsivePixiContainer } from "./base/ResponsivePixiComponents";

export interface ArchetypeDisplayProps {
  readonly archetype: PlayerArchetype;
  readonly isSelected?: boolean;
  readonly onSelect?: (archetype: PlayerArchetype) => void;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly screenWidth: number;
  readonly screenHeight: number;
}

const ARCHETYPE_INFO = {
  [PlayerArchetype.MUSA]: {
    korean: "무사",
    english: "Warrior",
    description: "전통 무사 - 힘을 통한 명예",
    englishDescription: "Traditional Warrior - Honor through strength",
    color: KOREAN_COLORS.TRIGRAM_GEON_PRIMARY,
    symbol: "☰",
  },
  [PlayerArchetype.AMSALJA]: {
    korean: "암살자",
    english: "Assassin",
    description: "그림자 암살자 - 은밀함을 통한 효율성",
    englishDescription: "Shadow Assassin - Efficiency through stealth",
    color: KOREAN_COLORS.TRIGRAM_SON_PRIMARY,
    symbol: "☴",
  },
  [PlayerArchetype.HACKER]: {
    korean: "해커",
    english: "Hacker",
    description: "사이버 전사 - 정보를 통한 힘",
    englishDescription: "Cyber Warrior - Power through information",
    color: KOREAN_COLORS.PRIMARY_CYAN,
    symbol: "☲",
  },
  [PlayerArchetype.JEONGBO_YOWON]: {
    korean: "정보요원",
    english: "Agent",
    description: "정보 요원 - 관찰을 통한 지식",
    englishDescription: "Intelligence Agent - Knowledge through observation",
    color: KOREAN_COLORS.TRIGRAM_TAE_PRIMARY,
    symbol: "☱",
  },
  [PlayerArchetype.JOJIK_POKRYEOKBAE]: {
    korean: "조직폭력배",
    english: "Gangster",
    description: "조직 폭력배 - 무자비함을 통한 생존",
    englishDescription: "Organized Crime - Survival through ruthlessness",
    color: KOREAN_COLORS.TRIGRAM_JIN_PRIMARY,
    symbol: "☳",
  },
};

export const ArchetypeDisplay: React.FC<ArchetypeDisplayProps> = ({
  archetype,
  isSelected = false,
  onSelect,
  x,
  y,
  width,
  height,
  screenWidth,
  screenHeight,
}) => {
  const archetypeInfo = ARCHETYPE_INFO[archetype];
  const isMobile = screenWidth < 768;

  const handleClick = useCallback(() => {
    if (onSelect) {
      onSelect(archetype);
    }
  }, [onSelect, archetype]);

  const borderColor = isSelected
    ? KOREAN_COLORS.ACCENT_GOLD
    : archetypeInfo.color;

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={screenWidth}
      screenHeight={screenHeight}
      data-testid={`archetype-display-${archetype}`}
    >
      {/* Background with archetype color */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.fill({
            color: isSelected
              ? KOREAN_COLORS.ACCENT_GOLD
              : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
            alpha: isSelected ? 0.3 : 0.8,
          });
          g.roundRect(0, 0, width, height, 8);
          g.fill();

          g.stroke({
            width: 2,
            color: borderColor,
            alpha: 0.9,
          });
          g.roundRect(0, 0, width, height, 8);
          g.stroke();
        }}
        interactive={!!onSelect}
        onPointerDown={handleClick}
        data-testid={`archetype-background-${archetype}`}
      />

      {/* Trigram Symbol */}
      <pixiContainer x={isMobile ? 15 : 20} y={isMobile ? 15 : 20}>
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: archetypeInfo.color, alpha: 0.8 });
            g.circle(0, 0, isMobile ? 16 : 20);
            g.fill();
          }}
        />
        <pixiText
          text={archetypeInfo.symbol}
          style={{
            fontSize: isMobile ? 14 : 18,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
            align: "center",
          }}
          anchor={0.5}
          data-testid={`archetype-symbol-${archetype}`}
        />
      </pixiContainer>

      {/* Korean Name */}
      <pixiText
        text={archetypeInfo.korean}
        style={{
          fontSize: isMobile ? 16 : 20,
          fill: isSelected
            ? KOREAN_COLORS.BLACK_SOLID
            : KOREAN_COLORS.TEXT_PRIMARY,
          fontWeight: "bold",
          fontFamily: "Noto Sans KR",
        }}
        x={isMobile ? 50 : 60}
        y={isMobile ? 12 : 15}
        data-testid={`archetype-korean-${archetype}`}
      />

      {/* English Name */}
      <pixiText
        text={archetypeInfo.english}
        style={{
          fontSize: isMobile ? 12 : 14,
          fill: isSelected
            ? KOREAN_COLORS.BLACK_SOLID
            : KOREAN_COLORS.TEXT_SECONDARY,
          fontStyle: "italic",
        }}
        x={isMobile ? 50 : 60}
        y={isMobile ? 30 : 35}
        data-testid={`archetype-english-${archetype}`}
      />

      {/* Description - Only show on larger screens */}
      {!isMobile && height > 80 && (
        <>
          <pixiText
            text={archetypeInfo.description}
            style={{
              fontSize: 10,
              fill: isSelected
                ? KOREAN_COLORS.BLACK_SOLID
                : KOREAN_COLORS.TEXT_SECONDARY,
              wordWrap: true,
              wordWrapWidth: width - 70,
            }}
            x={60}
            y={55}
            data-testid={`archetype-description-${archetype}`}
          />

          <pixiText
            text={archetypeInfo.englishDescription}
            style={{
              fontSize: 9,
              fill: isSelected
                ? KOREAN_COLORS.BLACK_SOLID
                : KOREAN_COLORS.TEXT_TERTIARY,
              fontStyle: "italic",
              wordWrap: true,
              wordWrapWidth: width - 70,
            }}
            x={60}
            y={height - 25}
            data-testid={`archetype-description-english-${archetype}`}
          />
        </>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.8 });
            g.roundRect(width - 25, 5, 20, 8, 4);
            g.fill();
          }}
          data-testid={`archetype-selected-indicator-${archetype}`}
        />
      )}
    </ResponsivePixiContainer>
  );
};

export default ArchetypeDisplay;
