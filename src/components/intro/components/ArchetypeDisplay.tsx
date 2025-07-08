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

    // Calculate optimal archetype image dimensions
    const getArchetypeImageDimensions = useCallback(() => {
      const baseWidth = isMobile ? 140 : 220;
      const baseHeight = isMobile ? 230 : 360;
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

    return (
      <ResponsivePixiContainer
        x={x}
        y={y}
        screenWidth={width}
        screenHeight={height}
        data-testid="archetype-display-container"
      >
        {/* Archetype Selection Header */}
        <pixiContainer data-testid="archetype-header">
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                alpha: 0.9,
              });
              g.roundRect(0, 0, width, 40, 8);
              g.fill();
              g.stroke({
                width: 2,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.8,
              });
              g.roundRect(0, 0, width, 40, 8);
              g.stroke();
            }}
          />
          <pixiText
            text="무사 선택 - Archetype Selection"
            style={{
              fontSize: isMobile ? 12 : 16,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              align: "center",
              fontWeight: "bold",
              fontFamily: FONT_FAMILY.KOREAN,
            }}
            x={width / 2}
            y={20}
            anchor={0.5}
          />
        </pixiContainer>

        {/* Main Archetype Display */}
        <pixiContainer y={50} data-testid="archetype-main-display">
          {/* Background panel */}
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                alpha: 0.9,
              });
              g.roundRect(0, 0, width, height - 120, 8);
              g.fill();
              g.stroke({
                width: 2,
                color: selectedArchetype.color,
                alpha: 0.8,
              });
              g.roundRect(0, 0, width, height - 120, 8);
              g.stroke();
            }}
          />

          {/* Character Image */}
          {selectedTexture && (
            <pixiContainer data-testid="archetype-image-container">
              {/* Background glow in character's color */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({ color: selectedArchetype.color, alpha: 0.15 });
                  g.circle(
                    archImageDims.width / 2,
                    archImageDims.height / 2,
                    (archImageDims.width + 20) / 2
                  );
                  g.fill();

                  // Border in character's color
                  g.stroke({
                    width: 2,
                    color: selectedArchetype.color,
                    alpha: 0.6,
                  });
                  g.roundRect(
                    -5,
                    -5,
                    archImageDims.width + 10,
                    archImageDims.height + 10,
                    8
                  );
                  g.stroke();
                }}
                x={isMobile ? (width - archImageDims.width) / 2 : 30}
                y={isMobile ? 10 : 20}
              />

              <pixiSprite
                texture={selectedTexture}
                width={archImageDims.width}
                height={archImageDims.height}
                x={isMobile ? (width - archImageDims.width) / 2 : 30}
                y={isMobile ? 10 : 20}
                interactive={true}
                onPointerDown={handleImageClick}
                data-testid="archetype-image"
              />
            </pixiContainer>
          )}

          {/* Archetype Information */}
          <pixiContainer
            x={isMobile ? 0 : archImageDims.width + 60}
            y={isMobile ? archImageDims.height + 30 : 20}
            data-testid="archetype-info"
          >
            {/* Character name with KoreanText */}
            <KoreanText
              text={{
                korean: selectedArchetype.korean,
                english: selectedArchetype.english,
              }}
              style={{
                fontSize: isMobile ? 14 : 16,
                fill: selectedArchetype.color,
                fontWeight: "bold",
                align: isMobile ? "center" : "left",
                fontFamily: FONT_FAMILY.KOREAN,
              }}
              x={isMobile ? width / 2 : 0}
              y={0}
              anchor={isMobile ? { x: 0.5, y: 0 } : { x: 0, y: 0 }}
              data-testid="archetype-title"
            />

            {/* Character description */}
            <pixiText
              text={selectedArchetype.description}
              style={{
                fontSize: isMobile ? 12 : 14,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
                align: isMobile ? "center" : "left",
                wordWrap: true,
                wordWrapWidth: isMobile
                  ? width - 40
                  : width - archImageDims.width - 90,
                fontFamily: FONT_FAMILY.KOREAN,
              }}
              x={isMobile ? width / 2 : 0}
              y={30}
              anchor={isMobile ? { x: 0.5, y: 0 } : { x: 0, y: 0 }}
              data-testid="archetype-description"
            />

            {/* Selection indicator */}
            <pixiText
              text={`${selectedIndex + 1} / ${archetypes.length}`}
              style={{
                fontSize: 12,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
                align: isMobile ? "center" : "left",
                fontFamily: FONT_FAMILY.PRIMARY,
              }}
              x={isMobile ? width / 2 : 0}
              y={isMobile ? 80 : 100}
              anchor={isMobile ? { x: 0.5, y: 0 } : { x: 0, y: 0 }}
              data-testid="archetype-counter"
            />
          </pixiContainer>
        </pixiContainer>

        {/* Navigation Buttons */}
        <pixiContainer y={height - 70} data-testid="archetype-navigation">
          {/* Previous Button */}
          <pixiContainer
            x={width * 0.25 - 30}
            data-testid="prev-archetype-button"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, 60, 30, 5);
                g.fill();
                g.stroke({
                  width: 1,
                  color: KOREAN_COLORS.ACCENT_GOLD,
                  alpha: 0.6,
                });
                g.roundRect(0, 0, 60, 30, 5);
                g.stroke();
              }}
              interactive={true}
              onPointerDown={handlePrevious}
            />
            <pixiText
              text="◀ 이전"
              style={{
                fontSize: 12,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                align: "center",
                fontFamily: FONT_FAMILY.KOREAN,
              }}
              x={30}
              y={15}
              anchor={0.5}
            />
          </pixiContainer>

          {/* Next Button */}
          <pixiContainer
            x={width * 0.75 - 30}
            data-testid="next-archetype-button"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.8,
                });
                g.roundRect(0, 0, 60, 30, 5);
                g.fill();
                g.stroke({
                  width: 1,
                  color: KOREAN_COLORS.ACCENT_GOLD,
                  alpha: 0.6,
                });
                g.roundRect(0, 0, 60, 30, 5);
                g.stroke();
              }}
              interactive={true}
              onPointerDown={handleNext}
            />
            <pixiText
              text="다음 ▶"
              style={{
                fontSize: 12,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                align: "center",
                fontFamily: FONT_FAMILY.KOREAN,
              }}
              x={30}
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
