import * as PIXI from "pixi.js";
import React, { useCallback } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { KoreanText } from "../../ui/base/korean-text/KoreanText";
import { ResponsivePixiContainer } from "../../ui/base/ResponsivePixiComponents";

// Shape matching ARCHETYPE_DATA entries
export interface ArchetypeDataShape {
  readonly id: string;
  readonly korean: string;
  readonly english: string;
  readonly description: string;
  readonly color: number;
  readonly textureKey: string;
}

export interface ArchetypeDisplayProps {
  readonly archetypes: readonly ArchetypeDataShape[];
  readonly selectedIndex: number;
  readonly textures: Record<string, PIXI.Texture | null>;
  readonly onArchetypeChange: (index: number) => void;
  readonly onPlaySFX: (sound: string) => void;
  readonly width: number;
  readonly height: number;
  readonly x: number;
  readonly y: number;
  readonly isMobile: boolean;
}

export const ArchetypeDisplay: React.FC<ArchetypeDisplayProps> = React.memo(
  ({
    archetypes,
    selectedIndex,
    textures,
    onArchetypeChange,
    onPlaySFX,
    width,
    height,
    x,
    y,
    isMobile,
  }) => {
    const selectedArchetype = archetypes[selectedIndex];
    const selectedTexture = textures[selectedArchetype.textureKey];

    // Compact archetype image dimensions for 25% width layout
    const getArchetypeImageDimensions = useCallback(() => {
      const baseWidth = isMobile ? 60 : 80; // Much smaller for compact layout
      const baseHeight = isMobile ? 90 : 120; // Proportionally smaller
      return {
        width: baseWidth,
        height: baseHeight,
        scale: baseWidth / 331, // Based on original image width
      };
    }, [isMobile]);

    const archImageDims = getArchetypeImageDimensions();

    const handlePrevious = useCallback(() => {
      const newIndex =
        selectedIndex === 0 ? archetypes.length - 1 : selectedIndex - 1;
      onArchetypeChange(newIndex);
      onPlaySFX("menu_hover");
    }, [selectedIndex, archetypes.length, onArchetypeChange, onPlaySFX]);

    const handleNext = useCallback(() => {
      const newIndex = (selectedIndex + 1) % archetypes.length;
      onArchetypeChange(newIndex);
      onPlaySFX("menu_hover");
    }, [selectedIndex, archetypes.length, onArchetypeChange, onPlaySFX]);

    const handleImageClick = useCallback(() => {
      handleNext();
    }, [handleNext]);

    // Combat stats with Korean-English labels
    const combatStats = [
      { korean: "공격", english: "Attack", value: 0.8 },
      { korean: "방어", english: "Defense", value: 0.6 },
      { korean: "속도", english: "Speed", value: 0.7 },
      { korean: "기술", english: "Technique", value: 0.9 },
    ];

    return (
      <ResponsivePixiContainer
        x={x}
        y={y}
        screenWidth={width}
        screenHeight={height}
        data-testid="archetype-display-container"
      >
        {/* Compact Archetype Selection Header */}
        <pixiContainer data-testid="archetype-header">
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                alpha: 0.95,
              });
              g.roundRect(0, 0, width, 35, 6);
              g.fill();
              g.stroke({
                width: 2,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.8,
              });
              g.roundRect(0, 0, width, 35, 6);
              g.stroke();
            }}
          />
          <KoreanText
            text={{
              korean: "무사 선택",
              english: "Archetype Selection",
            }}
            style={{
              fontSize: isMobile ? 10 : 12,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              align: "center",
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.KOREAN,
            }}
            x={width / 2}
            y={17.5}
            anchor={0.5}
          />
        </pixiContainer>

        {/* Compact Main Archetype Display */}
        <pixiContainer y={40} data-testid="archetype-main-display">
          {/* Background panel with compact styling */}
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                alpha: 0.95,
              });
              g.roundRect(0, 0, width, height - 90, 8);
              g.fill();

              // Border with archetype color
              g.stroke({
                width: 2,
                color: selectedArchetype.color,
                alpha: 0.9,
              });
              g.roundRect(0, 0, width, height - 90, 8);
              g.stroke();

              // Inner highlight
              g.stroke({
                width: 1,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.5,
              });
              g.roundRect(2, 2, width - 4, height - 94, 6);
              g.stroke();
            }}
          />

          {/* Compact Character Image */}
          {selectedTexture && (
            <pixiContainer
              x={10}
              y={10}
              data-testid="archetype-image-container"
            >
              {/* Compact image background */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  // Subtle glow
                  g.fill({ color: selectedArchetype.color, alpha: 0.15 });
                  g.circle(
                    archImageDims.width / 2,
                    archImageDims.height / 2,
                    (archImageDims.width + 8) / 2
                  );
                  g.fill();

                  // Border
                  g.stroke({
                    width: 1,
                    color: selectedArchetype.color,
                    alpha: 0.8,
                  });
                  g.roundRect(
                    -2,
                    -2,
                    archImageDims.width + 4,
                    archImageDims.height + 4,
                    4
                  );
                  g.stroke();
                }}
              />

              <pixiSprite
                texture={selectedTexture}
                width={archImageDims.width}
                height={archImageDims.height}
                x={0}
                y={0}
                interactive={true}
                onPointerDown={handleImageClick}
                data-testid="archetype-image"
              />
            </pixiContainer>
          )}

          {/* Compact Archetype Information */}
          <pixiContainer
            x={10}
            y={archImageDims.height + 20}
            data-testid="archetype-info"
          >
            {/* Compact character name */}
            <KoreanText
              text={{
                korean: selectedArchetype.korean,
                english: selectedArchetype.english,
              }}
              style={{
                fontSize: isMobile ? 12 : 14,
                fill: selectedArchetype.color,
                fontWeight: "bold",
                align: "center",
                fontFamily: FONT_FAMILY.KOREAN,
              }}
              x={width / 2 - 10}
              y={0}
              anchor={0.5}
              data-testid="archetype-title"
            />

            {/* Selection indicator */}
            <pixiContainer y={20} data-testid="archetype-status">
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color: selectedArchetype.color,
                    alpha: 0.2,
                  });
                  g.roundRect(0, 0, width - 20, 20, 3);
                  g.fill();
                  g.stroke({
                    width: 1,
                    color: selectedArchetype.color,
                    alpha: 0.6,
                  });
                  g.roundRect(0, 0, width - 20, 20, 3);
                  g.stroke();
                }}
              />
              <pixiText
                text={`${selectedIndex + 1} / ${archetypes.length}`}
                style={{
                  fontSize: 10,
                  fill: selectedArchetype.color,
                  align: "center",
                  fontWeight: "bold",
                  fontFamily: FONT_FAMILY.PRIMARY,
                }}
                x={(width - 20) / 2}
                y={10}
                anchor={0.5}
                data-testid="archetype-counter"
              />
            </pixiContainer>

            {/* Compact combat style indicators with Korean-English labels */}
            <pixiContainer y={50} data-testid="combat-indicators">
              <KoreanText
                text={{
                  korean: "전투 특성",
                  english: "Combat Style",
                }}
                style={{
                  fontSize: 9,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  align: "center",
                  fontFamily: FONT_FAMILY.KOREAN,
                }}
                x={(width - 20) / 2}
                y={0}
                anchor={0.5}
              />

              {/* Compact style bars */}
              <pixiContainer y={15} data-testid="style-bars">
                {combatStats.map((stat, index) => (
                  <pixiContainer key={stat.korean} y={index * 12}>
                    <KoreanText
                      text={{
                        korean: stat.korean,
                        english: stat.english,
                      }}
                      style={{
                        fontSize: 7,
                        fill: KOREAN_COLORS.TEXT_SECONDARY,
                        fontFamily: FONT_FAMILY.KOREAN,
                      }}
                      x={0}
                      y={0}
                      anchor={{ x: 0, y: 0.5 }}
                    />
                    <pixiGraphics
                      draw={(g) => {
                        g.clear();
                        // Background bar
                        g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM });
                        g.roundRect(35, -2, width - 65, 6, 1);
                        g.fill();

                        // Filled portion based on stat value
                        const fillWidth = stat.value * (width - 65);
                        g.fill({ color: selectedArchetype.color, alpha: 0.8 });
                        g.roundRect(35, -2, fillWidth, 6, 1);
                        g.fill();
                      }}
                    />
                  </pixiContainer>
                ))}
              </pixiContainer>
            </pixiContainer>
          </pixiContainer>
        </pixiContainer>

        {/* Compact Navigation Buttons with Korean-English labels */}
        <pixiContainer y={height - 50} data-testid="archetype-navigation">
          {/* Previous Button */}
          <pixiContainer x={5} data-testid="prev-archetype-button">
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.9,
                });
                g.roundRect(0, 0, (width - 15) / 2, 30, 4);
                g.fill();
                g.stroke({
                  width: 1,
                  color: KOREAN_COLORS.ACCENT_GOLD,
                  alpha: 0.7,
                });
                g.roundRect(0, 0, (width - 15) / 2, 30, 4);
                g.stroke();
              }}
              interactive={true}
              onPointerDown={handlePrevious}
            />
            <KoreanText
              text={{
                korean: "◀ 이전",
                english: "◀ Prev",
              }}
              style={{
                fontSize: 9,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                align: "center",
                fontWeight: "bold",
                fontFamily: FONT_FAMILY.KOREAN,
              }}
              x={(width - 15) / 4}
              y={15}
              anchor={0.5}
            />
          </pixiContainer>

          {/* Next Button */}
          <pixiContainer
            x={(width + 5) / 2}
            data-testid="next-archetype-button"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.9,
                });
                g.roundRect(0, 0, (width - 15) / 2, 30, 4);
                g.fill();
                g.stroke({
                  width: 1,
                  color: KOREAN_COLORS.ACCENT_GOLD,
                  alpha: 0.7,
                });
                g.roundRect(0, 0, (width - 15) / 2, 30, 4);
                g.stroke();
              }}
              interactive={true}
              onPointerDown={handleNext}
            />
            <KoreanText
              text={{
                korean: "다음 ▶",
                english: "Next ▶",
              }}
              style={{
                fontSize: 9,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                align: "center",
                fontWeight: "bold",
                fontFamily: FONT_FAMILY.KOREAN,
              }}
              x={(width - 15) / 4}
              y={15}
              anchor={0.5}
            />
          </pixiContainer>
        </pixiContainer>
      </ResponsivePixiContainer>
    );
  }
);

export default ArchetypeDisplay;
