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

    // Significantly reduced archetype image dimensions for better fit
    const getArchetypeImageDimensions = useCallback(() => {
      const baseWidth = isMobile ? 100 : 150; // Reduced from 140/220
      const baseHeight = isMobile ? 160 : 240; // Reduced from 230/360
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
                alpha: 0.95,
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

        {/* Main Archetype Display with optimized layout */}
        <pixiContainer y={50} data-testid="archetype-main-display">
          {/* Background panel with enhanced styling */}
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.fill({
                color: KOREAN_COLORS.UI_BACKGROUND_DARK,
                alpha: 0.95,
              });
              g.roundRect(0, 0, width, height - 120, 12);
              g.fill();

              // Enhanced border with gradient effect
              g.stroke({
                width: 3,
                color: selectedArchetype.color,
                alpha: 0.9,
              });
              g.roundRect(0, 0, width, height - 120, 12);
              g.stroke();

              // Inner highlight border
              g.stroke({
                width: 1,
                color: KOREAN_COLORS.ACCENT_GOLD,
                alpha: 0.5,
              });
              g.roundRect(4, 4, width - 8, height - 128, 8);
              g.stroke();
            }}
          />

          {/* Character Image with improved positioning and styling */}
          {selectedTexture && (
            <pixiContainer data-testid="archetype-image-container">
              {/* Enhanced background glow with better proportions */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  // Subtle glow behind image
                  g.fill({ color: selectedArchetype.color, alpha: 0.12 });
                  g.circle(
                    archImageDims.width / 2,
                    archImageDims.height / 2,
                    (archImageDims.width + 15) / 2
                  );
                  g.fill();

                  // Refined border around image
                  g.stroke({
                    width: 2,
                    color: selectedArchetype.color,
                    alpha: 0.8,
                  });
                  g.roundRect(
                    -3,
                    -3,
                    archImageDims.width + 6,
                    archImageDims.height + 6,
                    6
                  );
                  g.stroke();
                }}
                x={15} // Fixed positioning for better layout
                y={15}
              />

              <pixiSprite
                texture={selectedTexture}
                width={archImageDims.width}
                height={archImageDims.height}
                x={15} // Fixed positioning instead of calculated
                y={15}
                interactive={true}
                onPointerDown={handleImageClick}
                data-testid="archetype-image"
              />
            </pixiContainer>
          )}

          {/* Archetype Information with improved layout */}
          <pixiContainer
            x={archImageDims.width + 35} // Better spacing from image
            y={15}
            data-testid="archetype-info"
          >
            {/* Character name with enhanced styling */}
            <KoreanText
              text={{
                korean: selectedArchetype.korean,
                english: selectedArchetype.english,
              }}
              style={{
                fontSize: isMobile ? 16 : 20, // Slightly larger for better visibility
                fill: selectedArchetype.color,
                fontWeight: "bold",
                align: "left",
                fontFamily: FONT_FAMILY.KOREAN,
              }}
              x={0}
              y={0}
              anchor={{ x: 0, y: 0 }}
              data-testid="archetype-title"
            />

            {/* Character description with better text wrapping */}
            <pixiText
              text={selectedArchetype.description}
              style={{
                fontSize: isMobile ? 13 : 15, // Improved readability
                fill: KOREAN_COLORS.TEXT_PRIMARY, // Better contrast
                align: "left",
                wordWrap: true,
                wordWrapWidth: width - archImageDims.width - 70, // Better width calculation
                lineHeight: isMobile ? 18 : 22, // Better line spacing
                fontFamily: FONT_FAMILY.KOREAN,
              }}
              x={0}
              y={35}
              anchor={{ x: 0, y: 0 }}
              data-testid="archetype-description"
            />

            {/* Enhanced selection indicator with styling */}
            <pixiContainer y={85} data-testid="archetype-status">
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color: selectedArchetype.color,
                    alpha: 0.2,
                  });
                  g.roundRect(0, 0, 80, 25, 4);
                  g.fill();
                  g.stroke({
                    width: 1,
                    color: selectedArchetype.color,
                    alpha: 0.6,
                  });
                  g.roundRect(0, 0, 80, 25, 4);
                  g.stroke();
                }}
              />
              <pixiText
                text={`${selectedIndex + 1} / ${archetypes.length}`}
                style={{
                  fontSize: 12,
                  fill: selectedArchetype.color,
                  align: "center",
                  fontWeight: "bold",
                  fontFamily: FONT_FAMILY.PRIMARY,
                }}
                x={40}
                y={12.5}
                anchor={0.5}
                data-testid="archetype-counter"
              />
            </pixiContainer>

            {/* Combat style indicators */}
            <pixiContainer y={120} data-testid="combat-indicators">
              <pixiText
                text="전투 특성 - Combat Style"
                style={{
                  fontSize: 11,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  align: "left",
                  fontFamily: FONT_FAMILY.KOREAN,
                }}
                x={0}
                y={0}
                anchor={{ x: 0, y: 0 }}
              />

              {/* Style indicators based on archetype */}
              <pixiContainer y={20} data-testid="style-bars">
                {["공격", "방어", "속도", "기술"].map((stat, index) => (
                  <pixiContainer key={stat} y={index * 15}>
                    <pixiText
                      text={stat}
                      style={{
                        fontSize: 9,
                        fill: KOREAN_COLORS.TEXT_SECONDARY,
                        fontFamily: FONT_FAMILY.KOREAN,
                      }}
                      x={0}
                      y={0}
                      anchor={{ x: 0, y: 0 }}
                    />
                    <pixiGraphics
                      draw={(g) => {
                        g.clear();
                        // Background bar
                        g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM });
                        g.roundRect(25, -2, 60, 8, 2);
                        g.fill();

                        // Filled portion (random for now, should be based on archetype data)
                        const fillWidth = (Math.random() * 0.6 + 0.4) * 60;
                        g.fill({ color: selectedArchetype.color, alpha: 0.8 });
                        g.roundRect(25, -2, fillWidth, 8, 2);
                        g.fill();
                      }}
                    />
                  </pixiContainer>
                ))}
              </pixiContainer>
            </pixiContainer>
          </pixiContainer>
        </pixiContainer>

        {/* Enhanced Navigation Buttons */}
        <pixiContainer y={height - 70} data-testid="archetype-navigation">
          {/* Previous Button with improved styling */}
          <pixiContainer
            x={width * 0.2 - 35} // Better positioning
            data-testid="prev-archetype-button"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.9,
                });
                g.roundRect(0, 0, 70, 35, 6); // Larger buttons
                g.fill();
                g.stroke({
                  width: 2,
                  color: KOREAN_COLORS.ACCENT_GOLD,
                  alpha: 0.7,
                });
                g.roundRect(0, 0, 70, 35, 6);
                g.stroke();
              }}
              interactive={true}
              onPointerDown={handlePrevious}
            />
            <pixiText
              text="◀ 이전"
              style={{
                fontSize: 13,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                align: "center",
                fontWeight: "bold",
                fontFamily: FONT_FAMILY.KOREAN,
              }}
              x={35}
              y={17.5}
              anchor={0.5}
            />
          </pixiContainer>

          {/* Next Button with improved styling */}
          <pixiContainer
            x={width * 0.8 - 35} // Better positioning
            data-testid="next-archetype-button"
          >
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.fill({
                  color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                  alpha: 0.9,
                });
                g.roundRect(0, 0, 70, 35, 6); // Larger buttons
                g.fill();
                g.stroke({
                  width: 2,
                  color: KOREAN_COLORS.ACCENT_GOLD,
                  alpha: 0.7,
                });
                g.roundRect(0, 0, 70, 35, 6);
                g.stroke();
              }}
              interactive={true}
              onPointerDown={handleNext}
            />
            <pixiText
              text="다음 ▶"
              style={{
                fontSize: 13,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                align: "center",
                fontWeight: "bold",
                fontFamily: FONT_FAMILY.KOREAN,
              }}
              x={35}
              y={17.5}
              anchor={0.5}
            />
          </pixiContainer>
        </pixiContainer>
      </ResponsivePixiContainer>
    );
  }
);

export default ArchetypeDisplay;
