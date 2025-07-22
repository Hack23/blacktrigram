import * as PIXI from "pixi.js";
import React, { useEffect } from "react";
import { PLAYER_ARCHETYPES_DATA } from "../../../systems";
import { KoreanCulture } from "../../../systems/trigram/KoreanCulture";
import { TRIGRAM_DATA } from "../../../systems/trigram/types";
import { TrigramStance } from "../../../types";
import { KOREAN_COLORS } from "../../../types/constants";
import {
  ResponsivePixiButton,
  ResponsivePixiContainer,
  ResponsivePixiPanel,
} from "../../ui/base/ResponsivePixiComponents";

export interface PhilosophySectionProps {
  readonly onBack: () => void;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  onBack,
  x = 0,
  y = 0,
  width = 800,
  height = 600,
}) => {
  const isMobile = PIXI.isMobile.phone;

  // Enhanced event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key.toLowerCase() === "b") {
        event.preventDefault();
        event.stopPropagation();
        onBack();
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      if (event.button === 2) {
        event.preventDefault();
        onBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    document.addEventListener("contextmenu", handleContextMenu, {
      passive: false,
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [onBack]);

  // Responsive calculations
  const contentPadding = isMobile ? 15 : 25;
  const sectionSpacing = isMobile ? 20 : 30;
  const buttonArea = isMobile ? 70 : 80;
  const headerHeight = isMobile ? 70 : 85;
  const availableHeight = height - buttonArea - headerHeight;

  // Get philosophy data
  const martialValues = Object.entries(KoreanCulture.MARTIAL_VALUES);
  const trigramPhilosophies = Object.entries(TRIGRAM_DATA).map(
    ([stance, data]) => ({
      stance: stance as TrigramStance,
      ...data,
    })
  );
  const archetypes = Object.entries(PLAYER_ARCHETYPES_DATA);

  // Calculate sections
  const valuesPerRow = isMobile ? 2 : 3;
  const valueItemHeight = isMobile ? 60 : 70;
  const valuesRows = Math.ceil(martialValues.length / valuesPerRow);
  const valuesSectionHeight = Math.min(
    80 + valuesRows * valueItemHeight + 20,
    availableHeight * 0.25
  );

  const trigramsPerRow = isMobile ? 2 : 4;
  const trigramItemHeight = isMobile ? 110 : 130;
  const trigramRows = Math.ceil(trigramPhilosophies.length / trigramsPerRow);
  const trigramSectionHeight = Math.min(
    80 + trigramRows * trigramItemHeight + 20,
    availableHeight * 0.45
  );

  const archetypeItemHeight = isMobile ? 80 : 90;
  const archetypeSectionHeight = Math.min(
    80 + archetypes.length * archetypeItemHeight + 20,
    availableHeight * 0.3
  );

  return (
    <ResponsivePixiPanel
      title="무술 철학 | Martial Philosophy"
      x={x}
      y={y}
      width={width}
      height={height}
      screenWidth={width}
      screenHeight={height}
      data-testid="philosophy-section"
    >
      {/* Enhanced Header Section */}
      <ResponsivePixiContainer
        x={0}
        y={0}
        screenWidth={width}
        screenHeight={height}
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.9 });
            g.roundRect(0, 0, width, headerHeight, 8);
            g.fill();

            // Golden accent line
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.8,
            });
            g.moveTo(contentPadding, headerHeight - 5);
            g.lineTo(width - contentPadding, headerHeight - 5);
            g.stroke();
          }}
        />

        <pixiText
          text="흑괘 무도 철학"
          style={{
            fontSize: isMobile ? 22 : 28,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            align: "center",
          }}
          x={width / 2}
          y={headerHeight / 2 - 15}
          anchor={0.5}
        />

        <pixiText
          text="Black Trigram Martial Philosophy"
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Arial, sans-serif",
            align: "center",
          }}
          x={width / 2}
          y={headerHeight / 2 + 8}
          anchor={0.5}
        />
      </ResponsivePixiContainer>

      {/* Martial Values Section */}
      <ResponsivePixiContainer
        x={0}
        y={headerHeight}
        screenWidth={width}
        screenHeight={height}
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_LIGHT, alpha: 0.7 });
            g.roundRect(0, 0, width, valuesSectionHeight, 6);
            g.fill();

            g.stroke({ width: 1, color: KOREAN_COLORS.UI_BORDER, alpha: 0.5 });
            g.roundRect(0, 0, width, valuesSectionHeight, 6);
            g.stroke();
          }}
        />

        <pixiText
          text="무도 가치관 (Martial Values)"
          style={{
            fontSize: isMobile ? 16 : 18,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
          }}
          x={contentPadding}
          y={20}
        />

        {/* Values Grid */}
        <ResponsivePixiContainer
          x={contentPadding}
          y={50}
          screenWidth={width}
          screenHeight={height}
        >
          {martialValues.map(([key, value], index) => {
            const row = Math.floor(index / valuesPerRow);
            const col = index % valuesPerRow;
            const itemWidth = (width - contentPadding * 2) / valuesPerRow;
            const itemX = col * itemWidth;
            const itemY = row * valueItemHeight;

            return (
              <pixiContainer
                key={key}
                x={itemX}
                y={itemY}
                data-testid={`martial-value-${key}`}
              >
                <pixiGraphics
                  draw={(g) => {
                    g.clear();
                    g.fill({
                      color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                      alpha: 0.6,
                    });
                    g.roundRect(0, 0, itemWidth - 10, valueItemHeight - 10, 4);
                    g.fill();

                    g.stroke({
                      width: 1,
                      color: KOREAN_COLORS.ACCENT_GOLD,
                      alpha: 0.4,
                    });
                    g.roundRect(0, 0, itemWidth - 10, valueItemHeight - 10, 4);
                    g.stroke();
                  }}
                />

                <pixiText
                  text={value.korean}
                  style={{
                    fontSize: isMobile ? 14 : 16,
                    fill: KOREAN_COLORS.TEXT_PRIMARY,
                    fontFamily: "Arial, sans-serif",
                    fontWeight: "bold",
                    align: "center",
                  }}
                  x={(itemWidth - 10) / 2}
                  y={15}
                  anchor={0.5}
                />

                <pixiText
                  text={value.english}
                  style={{
                    fontSize: isMobile ? 10 : 12,
                    fill: KOREAN_COLORS.TEXT_SECONDARY,
                    fontFamily: "Arial, sans-serif",
                    align: "center",
                  }}
                  x={(itemWidth - 10) / 2}
                  y={35}
                  anchor={0.5}
                />
              </pixiContainer>
            );
          })}
        </ResponsivePixiContainer>
      </ResponsivePixiContainer>

      {/* Trigram Philosophy Section */}
      <ResponsivePixiContainer
        x={0}
        y={headerHeight + valuesSectionHeight + sectionSpacing}
        screenWidth={width}
        screenHeight={height}
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_LIGHT, alpha: 0.7 });
            g.roundRect(0, 0, width, trigramSectionHeight, 6);
            g.fill();

            g.stroke({ width: 1, color: KOREAN_COLORS.UI_BORDER, alpha: 0.5 });
            g.roundRect(0, 0, width, trigramSectionHeight, 6);
            g.stroke();
          }}
        />

        <pixiText
          text="팔괘 철학 (Eight Trigrams Philosophy)"
          style={{
            fontSize: isMobile ? 16 : 18,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
          }}
          x={contentPadding}
          y={20}
        />

        {/* Trigrams Grid */}
        <ResponsivePixiContainer
          x={contentPadding}
          y={50}
          screenWidth={width}
          screenHeight={height}
        >
          {trigramPhilosophies.map((trigram, index) => {
            const row = Math.floor(index / trigramsPerRow);
            const col = index % trigramsPerRow;
            const itemWidth = (width - contentPadding * 2) / trigramsPerRow;
            const itemX = col * itemWidth;
            const itemY = row * trigramItemHeight;

            return (
              <pixiContainer
                key={trigram.stance}
                x={itemX}
                y={itemY}
                data-testid={`trigram-${trigram.stance}`}
              >
                <pixiGraphics
                  draw={(g) => {
                    g.clear();
                    g.fill({
                      color: trigram.theme.primary,
                      alpha: 0.2,
                    });
                    g.roundRect(
                      0,
                      0,
                      itemWidth - 10,
                      trigramItemHeight - 10,
                      6
                    );
                    g.fill();

                    g.stroke({
                      width: 2,
                      color: trigram.theme.primary,
                      alpha: 0.6,
                    });
                    g.roundRect(
                      0,
                      0,
                      itemWidth - 10,
                      trigramItemHeight - 10,
                      6
                    );
                    g.stroke();
                  }}
                />

                <pixiText
                  text={trigram.symbol}
                  style={{
                    fontSize: isMobile ? 24 : 28,
                    fill: trigram.theme.primary,
                    fontFamily: "Arial, sans-serif",
                    align: "center",
                  }}
                  x={(itemWidth - 10) / 2}
                  y={15}
                  anchor={0.5}
                />

                <pixiText
                  text={`${trigram.name.korean} (${trigram.name.english})`}
                  style={{
                    fontSize: isMobile ? 11 : 13,
                    fill: KOREAN_COLORS.TEXT_PRIMARY,
                    fontFamily: "Arial, sans-serif",
                    fontWeight: "bold",
                    align: "center",
                  }}
                  x={(itemWidth - 10) / 2}
                  y={45}
                  anchor={0.5}
                />

                <pixiText
                  text={trigram.philosophy.korean}
                  style={{
                    fontSize: isMobile ? 9 : 10,
                    fill: KOREAN_COLORS.TEXT_SECONDARY,
                    fontFamily: "Arial, sans-serif",
                    align: "center",
                    wordWrap: true,
                    wordWrapWidth: itemWidth - 20,
                  }}
                  x={(itemWidth - 10) / 2}
                  y={65}
                  anchor={0.5}
                />

                <pixiText
                  text={trigram.combat.english}
                  style={{
                    fontSize: isMobile ? 8 : 9,
                    fill: KOREAN_COLORS.TEXT_TERTIARY,
                    fontFamily: "Arial, sans-serif",
                    align: "center",
                    wordWrap: true,
                    wordWrapWidth: itemWidth - 20,
                  }}
                  x={(itemWidth - 10) / 2}
                  y={85}
                  anchor={0.5}
                />
              </pixiContainer>
            );
          })}
        </ResponsivePixiContainer>
      </ResponsivePixiContainer>

      {/* Archetype Philosophy Section */}
      <ResponsivePixiContainer
        x={0}
        y={
          headerHeight +
          valuesSectionHeight +
          trigramSectionHeight +
          sectionSpacing * 2
        }
        screenWidth={width}
        screenHeight={height}
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_LIGHT, alpha: 0.7 });
            g.roundRect(0, 0, width, archetypeSectionHeight, 6);
            g.fill();

            g.stroke({ width: 1, color: KOREAN_COLORS.UI_BORDER, alpha: 0.5 });
            g.roundRect(0, 0, width, archetypeSectionHeight, 6);
            g.stroke();
          }}
        />

        <pixiText
          text="무사 유형 철학 (Warrior Archetype Philosophy)"
          style={{
            fontSize: isMobile ? 16 : 18,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
          }}
          x={contentPadding}
          y={20}
        />

        {/* Archetypes List */}
        <ResponsivePixiContainer
          x={contentPadding}
          y={50}
          screenWidth={width}
          screenHeight={height}
        >
          {archetypes.map(([archetype, data], index) => {
            const itemY = index * archetypeItemHeight;

            return (
              <pixiContainer
                key={archetype}
                x={0}
                y={itemY}
                data-testid={`archetype-${archetype}`}
              >
                <pixiGraphics
                  draw={(g) => {
                    g.clear();
                    g.fill({
                      color: data.colors.primary,
                      alpha: 0.15,
                    });
                    g.roundRect(
                      0,
                      0,
                      width - contentPadding * 2,
                      archetypeItemHeight - 10,
                      4
                    );
                    g.fill();

                    g.stroke({
                      width: 1,
                      color: data.colors.primary,
                      alpha: 0.4,
                    });
                    g.roundRect(
                      0,
                      0,
                      width - contentPadding * 2,
                      archetypeItemHeight - 10,
                      4
                    );
                    g.stroke();
                  }}
                />

                <pixiText
                  text={`${data.name.korean} (${data.name.english})`}
                  style={{
                    fontSize: isMobile ? 14 : 16,
                    fill: data.colors.primary,
                    fontFamily: "Arial, sans-serif",
                    fontWeight: "bold",
                  }}
                  x={15}
                  y={15}
                />

                <pixiText
                  text={data.description.korean}
                  style={{
                    fontSize: isMobile ? 10 : 12,
                    fill: KOREAN_COLORS.TEXT_PRIMARY,
                    fontFamily: "Arial, sans-serif",
                    wordWrap: true,
                    wordWrapWidth: (width - contentPadding * 2) / 2 - 20,
                  }}
                  x={15}
                  y={35}
                />

                <pixiText
                  text={data.description.english}
                  style={{
                    fontSize: isMobile ? 9 : 11,
                    fill: KOREAN_COLORS.TEXT_SECONDARY,
                    fontFamily: "Arial, sans-serif",
                    wordWrap: true,
                    wordWrapWidth: (width - contentPadding * 2) / 2 - 20,
                  }}
                  x={(width - contentPadding * 2) / 2}
                  y={35}
                />

                <pixiText
                  text="전통 무예 전문가"
                  style={{
                    fontSize: isMobile ? 8 : 10,
                    fill: KOREAN_COLORS.TEXT_TERTIARY,
                    fontFamily: "Arial, sans-serif",
                  }}
                  x={15}
                  y={55}
                />
              </pixiContainer>
            );
          })}
        </ResponsivePixiContainer>
      </ResponsivePixiContainer>

      {/* Motivation Quote */}
      <ResponsivePixiContainer
        x={contentPadding}
        y={height - buttonArea - 60}
        screenWidth={width}
        screenHeight={height}
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.1 });
            g.roundRect(0, 0, width - contentPadding * 2, 50, 8);
            g.fill();

            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.3,
            });
            g.roundRect(0, 0, width - contentPadding * 2, 50, 8);
            g.stroke();
          }}
        />

        <pixiText
          text="무술은 단순한 격투가 아닌, 자신을 수양하고 상대를 존중하는 도(道)입니다"
          style={{
            fontSize: isMobile ? 11 : 13,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontFamily: "Arial, sans-serif",
            fontStyle: "italic",
            align: "center",
            wordWrap: true,
            wordWrapWidth: width - contentPadding * 2 - 20,
          }}
          x={(width - contentPadding * 2) / 2}
          y={15}
          anchor={0.5}
        />

        <pixiText
          text="Martial arts is not mere combat, but the Way (道) of self-cultivation and respect for others"
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Arial, sans-serif",
            fontStyle: "italic",
            align: "center",
            wordWrap: true,
            wordWrapWidth: width - contentPadding * 2 - 20,
          }}
          x={(width - contentPadding * 2) / 2}
          y={32}
          anchor={0.5}
        />
      </ResponsivePixiContainer>

      {/* Back Button */}
      <ResponsivePixiButton
        text="돌아가기"
        x={width - 150}
        y={height - buttonArea + 10}
        width={120}
        height={40}
        screenWidth={width}
        screenHeight={height}
        variant="secondary"
        onClick={onBack}
        data-testid="philosophy-back-button"
      />

      {/* ESC/B Hint */}
      <pixiContainer x={width - 50} y={height / 2 - 8}>
        <pixiText
          text="ESC"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.SECONDARY_MAGENTA,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
          }}
          x={0}
          y={0}
          anchor={0.5}
        />
        <pixiText
          text="B"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.SECONDARY_MAGENTA,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
          }}
          x={0}
          y={15}
          anchor={0.5}
        />
      </pixiContainer>
    </ResponsivePixiPanel>
  );
};

export default PhilosophySection;
