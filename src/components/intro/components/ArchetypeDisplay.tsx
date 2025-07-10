import * as PIXI from "pixi.js";
import React, { useCallback } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { KoreanText } from "../../ui/base/korean-text/KoreanText";

// Enhanced shape matching PLAYER_ARCHETYPES_DATA entries
export interface ArchetypeDataShape {
  readonly id: string;
  readonly korean: string;
  readonly english: string;
  readonly description: string;
  readonly color: number;
  readonly textureKey: string;
  readonly stats: {
    readonly attackPower: number;
    readonly defense: number;
    readonly speed: number;
    readonly technique: number;
  };
  readonly philosophy: {
    readonly korean: string;
    readonly english: string;
  };
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

    // Compact archetype image dimensions for horizontal layout
    const getArchetypeImageDimensions = useCallback(() => {
      const baseWidth = isMobile ? 140 : 180;
      const baseHeight = isMobile ? 200 : 260;
      return {
        width: baseWidth,
        height: baseHeight,
        scale: baseWidth / 2,
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

    // Convert real stats to 0-1 scale for visualization
    const normalizeStats = useCallback(() => {
      const maxStatValue = 100; // Assuming max stat value is 100
      return [
        {
          korean: "공격",
          english: "Attack",
          value: selectedArchetype.stats.attackPower / maxStatValue,
          rawValue: selectedArchetype.stats.attackPower,
        },
        {
          korean: "방어",
          english: "Defense",
          value: selectedArchetype.stats.defense / maxStatValue,
          rawValue: selectedArchetype.stats.defense,
        },
        {
          korean: "속도",
          english: "Speed",
          value: selectedArchetype.stats.speed / maxStatValue,
          rawValue: selectedArchetype.stats.speed,
        },
        {
          korean: "기술",
          english: "Technique",
          value: selectedArchetype.stats.technique / maxStatValue,
          rawValue: selectedArchetype.stats.technique,
        },
      ];
    }, [selectedArchetype.stats]);

    const combatStats = normalizeStats();

    return (
      <pixiContainer
        x={x}
        y={y}
        data-testid="archetype-display-container"
        layout={{
          width,
          height,
          flexDirection: "row", // Horizontal layout for better space usage
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: 16,
        }}
      >
        {/* Background Panel */}
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({
              color: KOREAN_COLORS.UI_BACKGROUND_DARK,
              alpha: 0.95,
            });
            g.roundRect(0, 0, width, height, 8);
            g.fill();

            // Border with archetype color
            g.stroke({
              width: 2,
              color: selectedArchetype.color,
              alpha: 0.9,
            });
            g.roundRect(0, 0, width, height, 8);
            g.stroke();

            // Inner highlight
            g.stroke({
              width: 1,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.5,
            });
            g.roundRect(2, 2, width - 4, height - 4, 6);
            g.stroke();
          }}
          layout={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />

        {/* Left Side - Character Image and Navigation */}
        <pixiContainer
          data-testid="archetype-image-section"
          layout={{
            width: archImageDims.width + 40,
            height: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: 20,
            flexShrink: 0,
          }}
        >
          {/* Character Image Container */}
          {selectedTexture && (
            <pixiContainer
              data-testid="archetype-image-container"
              layout={{
                width: archImageDims.width + 20,
                height: archImageDims.height + 20,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
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
                    width: 2,
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
                layout={{
                  position: "absolute",
                  alignSelf: "center",
                }}
              />

              <pixiSprite
                texture={selectedTexture}
                width={archImageDims.width}
                height={archImageDims.height}
                interactive={true}
                onPointerDown={handleImageClick}
                data-testid="archetype-image"
                layout={{
                  alignSelf: "center",
                }}
              />
            </pixiContainer>
          )}

          {/* Navigation Buttons */}
          <pixiContainer
            data-testid="archetype-navigation"
            layout={{
              width: "100%",
              height: 30,
              flexDirection: "row",
              gap: 8,
              flexShrink: 0,
            }}
          >
            {/* Previous Button */}
            <pixiContainer
              data-testid="prev-archetype-button"
              layout={{
                width: "45%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                    alpha: 0.9,
                  });
                  g.roundRect(0, 0, (archImageDims.width + 40) * 0.45, 30, 4);
                  g.fill();
                  g.stroke({
                    width: 1,
                    color: KOREAN_COLORS.ACCENT_GOLD,
                    alpha: 0.7,
                  });
                  g.roundRect(0, 0, (archImageDims.width + 40) * 0.45, 30, 4);
                  g.stroke();
                }}
                interactive={true}
                onPointerDown={handlePrevious}
                layout={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
              />
              <pixiText
                text="◀"
                style={{
                  fontSize: 14,
                  fill: KOREAN_COLORS.TEXT_PRIMARY,
                  align: "center",
                  fontWeight: "bold",
                }}
                x={0}
                y={0}
                anchor={0.5}
              />
            </pixiContainer>

            {/* Next Button */}
            <pixiContainer
              data-testid="next-archetype-button"
              layout={{
                width: "45%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                    alpha: 0.9,
                  });
                  g.roundRect(0, 0, (archImageDims.width + 40) * 0.45, 30, 4);
                  g.fill();
                  g.stroke({
                    width: 1,
                    color: KOREAN_COLORS.ACCENT_GOLD,
                    alpha: 0.7,
                  });
                  g.roundRect(0, 0, (archImageDims.width + 40) * 0.45, 30, 4);
                  g.stroke();
                }}
                interactive={true}
                onPointerDown={handleNext}
                layout={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
              />
              <pixiText
                text="▶"
                style={{
                  fontSize: 14,
                  fill: KOREAN_COLORS.TEXT_PRIMARY,
                  align: "center",
                  fontWeight: "bold",
                }}
                x={0}
                y={0}
                anchor={0.5}
              />
            </pixiContainer>
          </pixiContainer>
        </pixiContainer>

        {/* Right Side - Archetype Information */}
        <pixiContainer
          data-testid="archetype-info"
          layout={{
            flexGrow: 1,
            height: "100%",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: 12,
            padding: 20,
          }}
        >
          {/* Header with name and counter */}
          <pixiContainer
            layout={{
              width: "100%",
              height: 40,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <KoreanText
              text={{
                korean: selectedArchetype.korean,
                english: selectedArchetype.english,
              }}
              style={{
                fontSize: isMobile ? 14 : 18,
                fill: selectedArchetype.color,
                fontWeight: "bold",
                align: "left",
                fontFamily: FONT_FAMILY.KOREAN,
              }}
              x={0}
              y={0}
              anchor={{ x: 0, y: 0.5 }}
              data-testid="archetype-title"
            />

            <pixiText
              text={`${selectedIndex + 1} / ${archetypes.length}`}
              style={{
                fontSize: 12,
                fill: selectedArchetype.color,
                align: "right",
                fontWeight: "bold",
                fontFamily: FONT_FAMILY.PRIMARY,
              }}
              x={0}
              y={0}
              anchor={{ x: 1, y: 0.5 }}
              data-testid="archetype-counter"
            />
          </pixiContainer>

          {/* Philosophy */}
          <pixiContainer
            layout={{
              width: "100%",
              height: 60,
              flexShrink: 0,
            }}
          >
            <KoreanText
              text={selectedArchetype.philosophy}
              style={{
                fontSize: isMobile ? 10 : 12,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
                align: "left",
                fontStyle: "italic",
                fontFamily: FONT_FAMILY.KOREAN,
                wordWrap: true,
                wordWrapWidth: width - archImageDims.width - 100,
              }}
              x={0}
              y={0}
              anchor={{ x: 0, y: 0 }}
              data-testid="archetype-philosophy"
            />
          </pixiContainer>

          {/* Combat Stats with real values */}
          <pixiContainer
            data-testid="combat-stats"
            layout={{
              width: "100%",
              flexGrow: 1,
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <KoreanText
              text={{
                korean: "전투 능력치",
                english: "Combat Stats",
              }}
              style={{
                fontSize: isMobile ? 12 : 14,
                fill: KOREAN_COLORS.ACCENT_GOLD,
                align: "left",
                fontWeight: "bold",
                fontFamily: FONT_FAMILY.KOREAN,
              }}
              x={0}
              y={0}
              anchor={{ x: 0, y: 0 }}
            />

            {/* Individual stat bars */}
            {combatStats.map((stat) => (
              <pixiContainer
                key={stat.korean}
                layout={{
                  width: "100%",
                  height: 24,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  flexShrink: 0,
                }}
              >
                {/* Stat label */}
                <pixiContainer
                  layout={{
                    width: 60,
                    height: "100%",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <KoreanText
                    text={{
                      korean: stat.korean,
                      english: stat.english,
                    }}
                    style={{
                      fontSize: isMobile ? 9 : 11,
                      fill: KOREAN_COLORS.TEXT_SECONDARY,
                      fontFamily: FONT_FAMILY.KOREAN,
                      align: "left",
                    }}
                    x={0}
                    y={0}
                    anchor={{ x: 0, y: 0.5 }}
                  />
                </pixiContainer>

                {/* Stat bar container */}
                <pixiContainer
                  layout={{
                    flexGrow: 1,
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <pixiGraphics
                    draw={(g) => {
                      g.clear();
                      const barWidth = Math.min(120, (width - archImageDims.width - 160));

                      // Background bar
                      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM });
                      g.roundRect(0, -3, barWidth, 6, 2);
                      g.fill();

                      // Filled portion based on stat value
                      const fillWidth = stat.value * barWidth;
                      g.fill({ color: selectedArchetype.color, alpha: 0.9 });
                      g.roundRect(0, -3, fillWidth, 6, 2);
                      g.fill();

                      // Border
                      g.stroke({
                        width: 1,
                        color: selectedArchetype.color,
                        alpha: 0.6,
                      });
                      g.roundRect(0, -3, barWidth, 6, 2);
                      g.stroke();
                    }}
                  />
                </pixiContainer>

                {/* Stat value */}
                <pixiContainer
                  layout={{
                    width: 30,
                    height: "100%",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <pixiText
                    text={stat.rawValue.toString()}
                    style={{
                      fontSize: isMobile ? 9 : 11,
                      fill: selectedArchetype.color,
                      align: "right",
                      fontWeight: "bold",
                      fontFamily: FONT_FAMILY.PRIMARY,
                    }}
                    x={0}
                    y={0}
                    anchor={{ x: 1, y: 0.5 }}
                  />
                </pixiContainer>
              </pixiContainer>
            ))}
          </pixiContainer>
        </pixiContainer>
      </pixiContainer>
    );
  }
);

export default ArchetypeDisplay;