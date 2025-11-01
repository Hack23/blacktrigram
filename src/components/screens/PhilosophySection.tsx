import * as PIXI from "pixi.js";
import React, { useEffect } from "react";
import { PLAYER_ARCHETYPES_DATA } from "../../systems";
import { KoreanCulture } from "../../systems/trigram/KoreanCulture";
import { TRIGRAM_DATA } from "../../systems/trigram/types";
import { TrigramStance } from "../../types";
import { KOREAN_COLORS } from "../../types/constants";
import {
  ResponsivePixiButton,
  ResponsivePixiContainer,
} from "../ui/base/ResponsivePixiComponents";

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

  // Improved responsive calculations for full screen
  const contentPadding = isMobile ? 20 : 30;
  const sectionSpacing = isMobile ? 15 : 20;
  const buttonArea = isMobile ? 80 : 90;
  const headerHeight = isMobile ? 100 : 120;
  const availableHeight = height - buttonArea - headerHeight - contentPadding;

  // Get philosophy data
  const martialValues = Object.entries(KoreanCulture.MARTIAL_VALUES);
  const trigramPhilosophies = Object.entries(TRIGRAM_DATA).map(
    ([stance, data]) => ({
      stance: stance as TrigramStance,
      ...data,
    })
  );
  const archetypes = Object.entries(PLAYER_ARCHETYPES_DATA);

  // Calculate sections with better space utilization
  const valuesPerRow = isMobile ? 3 : 6;
  const valueItemHeight = isMobile ? 70 : 80;
  const valuesRows = Math.ceil(martialValues.length / valuesPerRow);
  const valuesSectionHeight = Math.min(
    80 + valuesRows * valueItemHeight,
    availableHeight * 0.25
  );

  const trigramsPerRow = isMobile ? 2 : 4;
  const trigramItemHeight = isMobile ? 130 : 150;
  const trigramRows = Math.ceil(trigramPhilosophies.length / trigramsPerRow);
  const trigramSectionHeight = Math.min(
    80 + trigramRows * trigramItemHeight,
    availableHeight * 0.45
  );

  const archetypeItemHeight = isMobile ? 90 : 100;
  const archetypeSectionHeight = Math.min(
    80 + archetypes.length * archetypeItemHeight,
    availableHeight * 0.3
  );

  return (
    <ResponsivePixiContainer
      x={x}
      y={y}
      screenWidth={width}
      screenHeight={height}
      data-testid="philosophy-section"
    >
      {/* Full Screen Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          // Dark cyberpunk background
          const gradient = new PIXI.FillGradient(0, 0, width, height);
          gradient.addColorStop(0, 0x0a0a0f);
          gradient.addColorStop(0.5, 0x1a1a2e);
          gradient.addColorStop(1, 0x0f0f23);
          g.fill(gradient);
          g.rect(0, 0, width, height);
          g.fill();

          // Grid overlay
          g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.1 });
          const gridSize = isMobile ? 50 : 80;
          for (let i = 0; i < width; i += gridSize) {
            g.moveTo(i, 0);
            g.lineTo(i, height);
          }
          for (let i = 0; i < height; i += gridSize) {
            g.moveTo(0, i);
            g.lineTo(width, i);
          }
          g.stroke();
        }}
      />

      {/* Enhanced Header Section */}
      <ResponsivePixiContainer
        x={0}
        y={0}
        screenWidth={width}
        screenHeight={headerHeight}
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            // Header background
            const gradient = new PIXI.FillGradient(0, 0, 0, headerHeight);
            gradient.addColorStop(0, KOREAN_COLORS.UI_BACKGROUND_DARK);
            gradient.addColorStop(0.7, KOREAN_COLORS.UI_BACKGROUND_MEDIUM);
            gradient.addColorStop(1, KOREAN_COLORS.UI_BACKGROUND_LIGHT);
            g.fill(gradient);
            g.rect(
              contentPadding,
              contentPadding,
              width - contentPadding * 2,
              headerHeight - contentPadding * 2
            );
            g.fill();

            // Golden border
            g.stroke({
              width: 3,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.8,
            });
            g.rect(
              contentPadding,
              contentPadding,
              width - contentPadding * 2,
              headerHeight - contentPadding * 2
            );
            g.stroke();

            // Golden accent line
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.8,
            });
            g.moveTo(contentPadding + 20, headerHeight - 15);
            g.lineTo(width - contentPadding - 20, headerHeight - 15);
            g.stroke();
          }}
        />

        <pixiText
          text="흑괘 무도 철학"
          style={{
            fontSize: isMobile ? 28 : 36,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            align: "center",
          }}
          x={width / 2}
          y={headerHeight / 2 - 20}
          anchor={0.5}
        />

        <pixiText
          text="Black Trigram Martial Philosophy"
          style={{
            fontSize: isMobile ? 14 : 18,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Arial, sans-serif",
            align: "center",
          }}
          x={width / 2}
          y={headerHeight / 2 + 10}
          anchor={0.5}
        />
      </ResponsivePixiContainer>

      {/* Scrollable Content */}
      <ResponsivePixiContainer
        x={0}
        y={headerHeight}
        screenWidth={width}
        screenHeight={availableHeight}
      >
        {/* Martial Values Section */}
        <ResponsivePixiContainer
          x={0}
          y={0}
          screenWidth={width}
          screenHeight={valuesSectionHeight}
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_LIGHT, alpha: 0.8 });
              g.roundRect(
                contentPadding,
                0,
                width - contentPadding * 2,
                valuesSectionHeight,
                10
              );
              g.fill();

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.KOREAN_RED,
                alpha: 0.6,
              });
              g.roundRect(
                contentPadding,
                0,
                width - contentPadding * 2,
                valuesSectionHeight,
                10
              );
              g.stroke();
            }}
          />

          <pixiText
            text="무도 가치관 (Martial Values)"
            style={{
              fontSize: isMobile ? 18 : 22,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={contentPadding + 20}
            y={25}
          />

          {/* Values Grid */}
          <ResponsivePixiContainer
            x={contentPadding + 20}
            y={60}
            screenWidth={width - (contentPadding + 20) * 2}
            screenHeight={valuesSectionHeight - 60}
          >
            {martialValues.map(([key, value], index) => {
              const row = Math.floor(index / valuesPerRow);
              const col = index % valuesPerRow;
              const itemWidth =
                (width - (contentPadding + 20) * 2) / valuesPerRow;
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
                        alpha: 0.7,
                      });
                      g.roundRect(
                        5,
                        0,
                        itemWidth - 15,
                        valueItemHeight - 10,
                        6
                      );
                      g.fill();

                      g.stroke({
                        color: KOREAN_COLORS.ACCENT_GOLD,
                        alpha: 0.5,
                      });
                      g.roundRect(
                        5,
                        0,
                        itemWidth - 15,
                        valueItemHeight - 10,
                        6
                      );
                      g.stroke();
                    }}
                  />

                  <pixiText
                    text={value.korean}
                    style={{
                      fontSize: isMobile ? 16 : 18,
                      fill: KOREAN_COLORS.TEXT_PRIMARY,
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                      align: "center",
                    }}
                    x={(itemWidth - 15) / 2}
                    y={20}
                    anchor={0.5}
                  />

                  <pixiText
                    text={value.english}
                    style={{
                      fontSize: isMobile ? 11 : 13,
                      fill: KOREAN_COLORS.TEXT_SECONDARY,
                      fontFamily: "Arial, sans-serif",
                      align: "center",
                    }}
                    x={(itemWidth - 15) / 2}
                    y={45}
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
          y={valuesSectionHeight + sectionSpacing}
          screenWidth={width}
          screenHeight={trigramSectionHeight}
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_LIGHT, alpha: 0.8 });
              g.roundRect(
                contentPadding,
                0,
                width - contentPadding * 2,
                trigramSectionHeight,
                10
              );
              g.fill();

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.PRIMARY_CYAN,
                alpha: 0.6,
              });
              g.roundRect(
                contentPadding,
                0,
                width - contentPadding * 2,
                trigramSectionHeight,
                10
              );
              g.stroke();
            }}
          />

          <pixiText
            text="팔괘 철학 (Eight Trigrams Philosophy)"
            style={{
              fontSize: isMobile ? 18 : 22,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={contentPadding + 20}
            y={25}
          />

          {/* Trigrams Grid */}
          <ResponsivePixiContainer
            x={contentPadding + 20}
            y={60}
            screenWidth={width - (contentPadding + 20) * 2}
            screenHeight={trigramSectionHeight - 60}
          >
            {trigramPhilosophies.map((trigram, index) => {
              const row = Math.floor(index / trigramsPerRow);
              const col = index % trigramsPerRow;
              const itemWidth =
                (width - (contentPadding + 20) * 2) / trigramsPerRow;
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
                      g.fill({ color: trigram.theme.primary, alpha: 0.25 });
                      g.roundRect(
                        5,
                        0,
                        itemWidth - 15,
                        trigramItemHeight - 10,
                        8
                      );
                      g.fill();

                      g.stroke({
                        width: 2,
                        color: trigram.theme.primary,
                        alpha: 0.8,
                      });
                      g.roundRect(
                        5,
                        0,
                        itemWidth - 15,
                        trigramItemHeight - 10,
                        8
                      );
                      g.stroke();
                    }}
                  />

                  <pixiText
                    text={trigram.symbol}
                    style={{
                      fontSize: isMobile ? 32 : 40,
                      fill: trigram.theme.primary,
                      fontFamily: "Arial, sans-serif",
                      align: "center",
                    }}
                    x={(itemWidth - 15) / 2}
                    y={25}
                    anchor={0.5}
                  />

                  <pixiText
                    text={`${trigram.name.korean} (${trigram.name.english})`}
                    style={{
                      fontSize: isMobile ? 12 : 14,
                      fill: KOREAN_COLORS.TEXT_PRIMARY,
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                      align: "center",
                    }}
                    x={(itemWidth - 15) / 2}
                    y={65}
                    anchor={0.5}
                  />

                  <pixiText
                    text={trigram.philosophy.korean}
                    style={{
                      fontSize: isMobile ? 10 : 11,
                      fill: KOREAN_COLORS.TEXT_SECONDARY,
                      fontFamily: "Arial, sans-serif",
                      align: "center",
                      wordWrap: true,
                      wordWrapWidth: itemWidth - 30,
                    }}
                    x={(itemWidth - 15) / 2}
                    y={85}
                    anchor={0.5}
                  />

                  <pixiText
                    text={trigram.combat.english}
                    style={{
                      fontSize: isMobile ? 9 : 10,
                      fill: KOREAN_COLORS.TEXT_TERTIARY,
                      fontFamily: "Arial, sans-serif",
                      align: "center",
                      wordWrap: true,
                      wordWrapWidth: itemWidth - 30,
                    }}
                    x={(itemWidth - 15) / 2}
                    y={110}
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
          y={valuesSectionHeight + trigramSectionHeight + sectionSpacing * 2}
          screenWidth={width}
          screenHeight={archetypeSectionHeight}
        >
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_LIGHT, alpha: 0.8 });
              g.roundRect(
                contentPadding,
                0,
                width - contentPadding * 2,
                archetypeSectionHeight,
                10
              );
              g.fill();

              g.stroke({
                width: 2,
                color: KOREAN_COLORS.SECONDARY_MAGENTA,
                alpha: 0.6,
              });
              g.roundRect(
                contentPadding,
                0,
                width - contentPadding * 2,
                archetypeSectionHeight,
                10
              );
              g.stroke();
            }}
          />

          <pixiText
            text="암흑작전부대 철학 (Dark Operations Unit Philosophy)"
            style={{
              fontSize: isMobile ? 18 : 22,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={contentPadding + 20}
            y={25}
          />

          {/* Archetypes List */}
          <ResponsivePixiContainer
            x={contentPadding + 20}
            y={60}
            screenWidth={width - (contentPadding + 20) * 2}
            screenHeight={archetypeSectionHeight - 60}
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
                      g.fill({ color: data.colors.primary, alpha: 0.2 });
                      g.roundRect(
                        0,
                        0,
                        width - (contentPadding + 20) * 2 - 20,
                        archetypeItemHeight - 10,
                        6
                      );
                      g.fill();

                      g.stroke({
                        width: 1,
                        color: data.colors.primary,
                        alpha: 0.6,
                      });
                      g.roundRect(
                        0,
                        0,
                        width - (contentPadding + 20) * 2 - 20,
                        archetypeItemHeight - 10,
                        6
                      );
                      g.stroke();
                    }}
                  />

                  <pixiText
                    text={`${data.name.korean} (${data.name.english})`}
                    style={{
                      fontSize: isMobile ? 16 : 18,
                      fill: data.colors.primary,
                      fontFamily: "Arial, sans-serif",
                      fontWeight: "bold",
                    }}
                    x={15}
                    y={20}
                  />

                  <pixiText
                    text={data.description.korean}
                    style={{
                      fontSize: isMobile ? 11 : 13,
                      fill: KOREAN_COLORS.TEXT_PRIMARY,
                      fontFamily: "Arial, sans-serif",
                      wordWrap: true,
                      wordWrapWidth:
                        (width - (contentPadding + 20) * 2) / 2 - 30,
                    }}
                    x={15}
                    y={45}
                  />

                  <pixiText
                    text={data.description.english}
                    style={{
                      fontSize: isMobile ? 10 : 12,
                      fill: KOREAN_COLORS.TEXT_SECONDARY,
                      fontFamily: "Arial, sans-serif",
                      wordWrap: true,
                      wordWrapWidth:
                        (width - (contentPadding + 20) * 2) / 2 - 30,
                    }}
                    x={(width - (contentPadding + 20) * 2) / 2}
                    y={45}
                  />

                  <pixiText
                    text="전통 무예 전문가"
                    style={{
                      fontSize: isMobile ? 9 : 11,
                      fill: KOREAN_COLORS.TEXT_TERTIARY,
                      fontFamily: "Arial, sans-serif",
                    }}
                    x={15}
                    y={70}
                  />
                </pixiContainer>
              );
            })}
          </ResponsivePixiContainer>
        </ResponsivePixiContainer>
      </ResponsivePixiContainer>

      {/* Enhanced Footer */}
      <ResponsivePixiContainer
        x={0}
        y={height - buttonArea}
        screenWidth={width}
        screenHeight={buttonArea}
        data-testid="philosophy-footer"
      >
        {/* Footer Background */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            const gradient = new PIXI.FillGradient(0, 0, 0, buttonArea);
            gradient.addColorStop(0, KOREAN_COLORS.UI_BACKGROUND_DARK);
            gradient.addColorStop(0.3, KOREAN_COLORS.UI_BACKGROUND_MEDIUM);
            gradient.addColorStop(1, KOREAN_COLORS.UI_BACKGROUND_DARK);
            g.fill(gradient);
            g.rect(0, 0, width, buttonArea);
            g.fill();

            // Border
            g.stroke({
              width: 3,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.8,
            });
            g.moveTo(0, 0);
            g.lineTo(width, 0);
            g.stroke();
          }}
        />

        {/* Motivation Quote */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.15 });
            g.roundRect(contentPadding, 15, width - contentPadding * 2, 35, 8);
            g.fill();

            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.4,
            });
            g.roundRect(contentPadding, 15, width - contentPadding * 2, 35, 8);
            g.stroke();
          }}
        />

        <pixiText
          text="무술은 단순한 격투가 아닌, 자신을 수양하고 상대를 존중하는 도(道)입니다"
          style={{
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            fontFamily: "Arial, sans-serif",
            fontStyle: "italic",
            align: "center",
            wordWrap: true,
            wordWrapWidth: width - contentPadding * 2 - 20,
          }}
          x={width / 2}
          y={25}
          anchor={0.5}
        />

        <pixiText
          text="Martial arts is not mere combat, but the Way (道) of self-cultivation and respect for others"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            fontFamily: "Arial, sans-serif",
            fontStyle: "italic",
            align: "center",
            wordWrap: true,
            wordWrapWidth: width - contentPadding * 2 - 20,
          }}
          x={width / 2}
          y={42}
          anchor={0.5}
        />

        {/* Back Button */}
        <ResponsivePixiButton
          text="돌아가기"
          x={width - 140}
          y={buttonArea - 50}
          width={120}
          height={40}
          screenWidth={width}
          screenHeight={height}
          variant="secondary"
          onClick={onBack}
          data-testid="philosophy-back-button"
        />

        {/* ESC/B Hint */}
        <pixiContainer x={width - 60} y={15}>
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.9 });
              g.roundRect(-15, -10, 30, 25, 4);
              g.fill();
            }}
          />
          <pixiText
            text="ESC"
            style={{
              fontSize: isMobile ? 8 : 10,
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
              fontSize: isMobile ? 8 : 10,
              fill: KOREAN_COLORS.SECONDARY_MAGENTA,
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
            }}
            x={0}
            y={10}
            anchor={0.5}
          />
        </pixiContainer>
      </ResponsivePixiContainer>
    </ResponsivePixiContainer>
  );
};

export default PhilosophySection;
