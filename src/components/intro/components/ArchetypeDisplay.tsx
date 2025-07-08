import * as PIXI from "pixi.js";
import React, { useCallback } from "react";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { KoreanText } from "../../ui/base/korean-text/KoreanText";

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
      <pixiContainer
        x={x}
        y={y}
        data-testid="archetype-display-container"
        layout={{
          width,
          height,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 12,
        }}
      >
        {/* Compact Archetype Selection Header */}
        <pixiContainer
          data-testid="archetype-header"
          layout={{
            width: "100%",
            height: 35,
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
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
            layout={{
              position: "absolute",
              width: "100%",
              height: "100%",
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
            x={0}
            y={0}
            anchor={0.5}
          />
        </pixiContainer>

        {/* Main Archetype Display with flex layout */}
        <pixiContainer
          data-testid="archetype-main-display"
          layout={{
            width: "100%",
            flexGrow: 1,
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: 10,
          }}
        >
          {/* Background panel */}
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
            layout={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          />

          {/* Character Image Container */}
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
            {/* Image background and sprite */}
            {selectedTexture && (
              <>
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
              </>
            )}
          </pixiContainer>

          {/* Archetype Information with proper layout */}
          <pixiContainer
            data-testid="archetype-info"
            layout={{
              width: "100%",
              flexGrow: 1,
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* Character name */}
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
              x={0}
              y={0}
              anchor={0.5}
              data-testid="archetype-title"
            />

            {/* Selection indicator */}
            <pixiContainer
              data-testid="archetype-status"
              layout={{
                width: "90%",
                height: 20,
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  g.fill({
                    color: selectedArchetype.color,
                    alpha: 0.2,
                  });
                  g.roundRect(0, 0, width * 0.9, 20, 3);
                  g.fill();
                  g.stroke({
                    width: 1,
                    color: selectedArchetype.color,
                    alpha: 0.6,
                  });
                  g.roundRect(0, 0, width * 0.9, 20, 3);
                  g.stroke();
                }}
                layout={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
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
                x={0}
                y={0}
                anchor={0.5}
                data-testid="archetype-counter"
              />
            </pixiContainer>

            {/* Combat style indicators */}
            <pixiContainer
              data-testid="combat-indicators"
              layout={{
                width: "100%",
                flexGrow: 1,
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
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
                x={0}
                y={0}
                anchor={0.5}
              />

              {/* Style bars with layout */}
              <pixiContainer
                data-testid="style-bars"
                layout={{
                  width: "90%",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {combatStats.map((stat) => (
                  <pixiContainer
                    key={stat.korean}
                    layout={{
                      width: "100%",
                      height: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
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
                        const barWidth = width * 0.6;
                        // Background bar
                        g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM });
                        g.roundRect(0, -2, barWidth, 6, 1);
                        g.fill();

                        // Filled portion based on stat value
                        const fillWidth = stat.value * barWidth;
                        g.fill({ color: selectedArchetype.color, alpha: 0.8 });
                        g.roundRect(0, -2, fillWidth, 6, 1);
                        g.fill();
                      }}
                      layout={{
                        flexGrow: 1,
                      }}
                    />
                  </pixiContainer>
                ))}
              </pixiContainer>
            </pixiContainer>
          </pixiContainer>
        </pixiContainer>

        {/* Navigation Buttons with flex layout */}
        <pixiContainer
          data-testid="archetype-navigation"
          layout={{
            width: "100%",
            height: 30,
            flexDirection: "row",
            gap: 10,
            paddingLeft: 5,
            paddingRight: 5,
            flexShrink: 0,
          }}
        >
          {/* Previous Button */}
          <pixiContainer
            data-testid="prev-archetype-button"
            layout={{
              width: "50%",
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
              layout={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
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
              x={0}
              y={0}
              anchor={0.5}
            />
          </pixiContainer>

          {/* Next Button */}
          <pixiContainer
            data-testid="next-archetype-button"
            layout={{
              width: "50%",
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
              layout={{
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
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
              x={0}
              y={0}
              anchor={0.5}
            />
          </pixiContainer>
        </pixiContainer>
      </pixiContainer>
    );
  }
);

export default ArchetypeDisplay;