import { PlayerArchetypeData } from "@/systems";
import { PlayerArchetype, TrigramStance } from "@/types";
import "@pixi/layout";
import {
  LayoutContainer,
  LayoutGraphics,
  LayoutText,
} from "@pixi/layout/components";
import "@pixi/layout/react";
import { extend } from "@pixi/react";
import { FancyButton } from "@pixi/ui";
import * as PIXI from "pixi.js";
import { Container, Graphics, Text } from "pixi.js";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import { createGraphicsContext } from "../../../utils/pixiExtensions";

extend({
  Container,
  LayoutContainer,
  Graphics,
  LayoutGraphics,
  Text,
  LayoutText,
  FancyButton,
});

export interface ArchetypeDisplayProps {
  archetype: PlayerArchetype;
  archetypeData: PlayerArchetypeData;
  texture?: PIXI.Texture | null;
  total: number;
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect?: (archetype: PlayerArchetype) => void;
  isSelected?: boolean;
  width?: number;
  height?: number;
}

// Helper to get trigram symbol for stance
const getTrigramSymbol = (stance: TrigramStance): string => {
  const trigramMap: Record<TrigramStance, string> = {
    [TrigramStance.GEON]: "☰",
    [TrigramStance.TAE]: "☱",
    [TrigramStance.LI]: "☲",
    [TrigramStance.JIN]: "☳",
    [TrigramStance.SON]: "☴",
    [TrigramStance.GAM]: "☵",
    [TrigramStance.GAN]: "☶",
    [TrigramStance.GON]: "☷",
  };
  return trigramMap[stance] || "☰";
};

export const ArchetypeDisplay: React.FC<ArchetypeDisplayProps> = React.memo(
  ({
    archetype,
    archetypeData,
    texture,
    total,
    index,
    onPrev,
    onNext,
    onSelect,
    isSelected = false,
    width = 800,
    height = 300,
  }) => {
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;

    // Responsive sizing
    const imageSize = isMobile ? 100 : isTablet ? 140 : 160;
    const padding = isMobile ? 16 : isTablet ? 20 : 24;
    const primaryColor = archetypeData.colors.primary;

    const prevButtonRef = useRef<FancyButton>(null);
    const nextButtonRef = useRef<FancyButton>(null);

    // Enhanced background with archetype-themed styling
    const mainBackgroundContext = useMemo(() => {
      return createGraphicsContext((g: PIXI.Graphics) => {
        g.clear();

        // Main background
        g.roundRect(0, 0, width, height, 16);
        g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.95 });

        // Archetype color accent
        g.roundRect(0, 0, width, height, 16);
        g.stroke({ width: 2, color: primaryColor, alpha: 0.6 });

        // Selected state enhancement
        if (isSelected) {
          g.roundRect(-2, -2, width + 4, height + 4, 18);
          g.stroke({ width: 3, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.9 });
        }

        // Decorative corner elements with archetype theme
        const cornerSize = 24;
        g.moveTo(cornerSize, 16);
        g.lineTo(16, 16);
        g.lineTo(16, cornerSize);
        g.stroke({ width: 3, color: primaryColor, alpha: 0.8 });
      });
    }, [width, height, primaryColor, isSelected]);

    // Enhanced portrait background
    const portraitBackgroundContext = useMemo(() => {
      return createGraphicsContext((g: PIXI.Graphics) => {
        g.clear();

        // Outer glow effect
        g.roundRect(-4, -4, imageSize + 28, imageSize + 28, 16);
        g.fill({ color: primaryColor, alpha: 0.1 });

        // Main portrait frame
        g.roundRect(0, 0, imageSize + 20, imageSize + 20, 12);
        g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.9 });

        // Inner border
        g.roundRect(2, 2, imageSize + 16, imageSize + 16, 10);
        g.stroke({ width: 2, color: primaryColor, alpha: 0.8 });
      });
    }, [imageSize, primaryColor]);

    // Enhanced progress bar
    const progressBarContext = useMemo(() => {
      return createGraphicsContext((g: PIXI.Graphics) => {
        const barWidth = isMobile ? 100 : 140;
        const barHeight = 10;
        const fillWidth = (barWidth * (index + 1)) / total;

        g.clear();

        // Background with rounded ends
        g.roundRect(0, 0, barWidth, barHeight, barHeight / 2);
        g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.6 });

        // Fill with gradient effect
        g.roundRect(0, 0, fillWidth, barHeight, barHeight / 2);
        g.fill({ color: primaryColor, alpha: 0.9 });

        // Highlight on top
        if (fillWidth > 4) {
          g.roundRect(0, 0, fillWidth, barHeight / 3, barHeight / 6);
          g.fill({ color: 0xffffff, alpha: 0.3 });
        }
      });
    }, [index, total, primaryColor, isMobile]);

    // Enhanced button graphics
    const createButtonGraphics = useCallback(
      (
        color: number,
        alpha: number = 1,
        isHover: boolean = false
      ): Graphics => {
        const graphics = new Graphics();
        const buttonSize = 56;

        if (isHover) {
          graphics.roundRect(-2, -2, buttonSize + 4, buttonSize + 4, 10);
          graphics.fill({ color, alpha: 0.3 });
        }

        graphics.roundRect(0, 0, buttonSize, buttonSize, 8);
        graphics.fill({ color, alpha });

        graphics.roundRect(0, 0, buttonSize, buttonSize, 8);
        graphics.stroke({
          width: 2,
          color: KOREAN_COLORS.TEXT_PRIMARY,
          alpha: 0.8,
        });

        return graphics;
      },
      []
    );

    const buttonViews = useMemo(
      () => ({
        defaultView: createButtonGraphics(primaryColor, 0.8),
        hoverView: createButtonGraphics(primaryColor, 1.0, true),
        pressedView: createButtonGraphics(primaryColor, 0.6),
      }),
      [createButtonGraphics, primaryColor]
    );

    // Connect button handlers
    useEffect(() => {
      if (prevButtonRef.current) {
        const button = prevButtonRef.current;
        button.onPress.disconnectAll();
        button.onPress.connect(onPrev);
      }
      if (nextButtonRef.current) {
        const button = nextButtonRef.current;
        button.onPress.disconnectAll();
        button.onPress.connect(onNext);
      }

      return () => {
        if (prevButtonRef.current && !prevButtonRef.current.destroyed) {
          prevButtonRef.current.onPress.disconnectAll();
        }
        if (nextButtonRef.current && !nextButtonRef.current.destroyed) {
          nextButtonRef.current.onPress.disconnectAll();
        }
      };
    }, [onPrev, onNext]);

    // Enhanced stat bar component
    const StatBar: React.FC<{
      value: number;
      maxValue: number;
      color: number;
      korean: string;
      english: string;
    }> = useCallback(
      ({ value, maxValue, color, korean, english }) => {
        const barWidth = isMobile ? 120 : isTablet ? 160 : 180;
        const barHeight = 8;

        const statBarContext = useMemo(() => {
          return createGraphicsContext((g: PIXI.Graphics) => {
            const fillWidth = (barWidth * value) / maxValue;

            g.clear();

            // Background
            g.roundRect(0, 0, barWidth, barHeight, barHeight / 2);
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.6 });

            // Fill with gradient
            g.roundRect(0, 0, fillWidth, barHeight, barHeight / 2);
            g.fill({ color, alpha: 0.9 });

            // Highlight
            if (fillWidth > 2) {
              g.roundRect(0, 0, fillWidth, barHeight / 3, barHeight / 6);
              g.fill({ color: 0xffffff, alpha: 0.4 });
            }
          });
        }, [value, maxValue, color]);

        return (
          <layoutContainer
            layout={{
              flexDirection: "column",
              gap: 6,
              width: barWidth + 40,
            }}
          >
            <layoutContainer
              layout={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <layoutContainer
                layout={{
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <layoutText
                  text={korean}
                  style={{
                    fontSize: isMobile ? 10 : 12,
                    fill: KOREAN_COLORS.TEXT_SECONDARY,
                    fontFamily: "Noto Sans KR, sans-serif",
                  }}
                />
                <layoutText
                  text={english}
                  style={{
                    fontSize: isMobile ? 8 : 10,
                    fill: KOREAN_COLORS.TEXT_TERTIARY,
                    fontFamily: "Noto Sans KR, sans-serif",
                  }}
                />
              </layoutContainer>
              <layoutText
                text={value.toString()}
                style={{
                  fontSize: isMobile ? 12 : 14,
                  fill: color,
                  fontWeight: "bold",
                }}
              />
            </layoutContainer>

            <layoutGraphics context={statBarContext} />
          </layoutContainer>
        );
      },
      [isMobile, isTablet]
    );

    // Constrained main layout with explicit dimensions
    const mainLayout = useMemo(
      () => ({
        width: width,
        height: height,
        flexDirection: "column" as const,
        padding: padding,
        gap: 16,
      }),
      [width, height, padding]
    );

    return (
      <layoutContainer layout={mainLayout} data-testid="archetype-display">
        {/* Background as separate layer */}
        <layoutGraphics context={mainBackgroundContext} />

        {/* Content container with proper constraints */}
        <layoutContainer
          layout={{
            width: width - padding * 2,
            height: height - padding * 2,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 12 : 20,
            alignItems: "flex-start",
          }}
        >
          {/* Character Portrait Section */}
          <layoutContainer
            layout={{
              width: imageSize + 40,
              height: imageSize + 60,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <layoutGraphics context={portraitBackgroundContext} />

            <layoutContainer
              layout={{
                width: imageSize,
                height: imageSize,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <pixiSprite
                texture={texture ?? PIXI.Texture.EMPTY}
                anchor={0.5}
                width={imageSize}
                height={imageSize}
                interactive={!!onSelect}
                cursor={onSelect ? "pointer" : "default"}
                onPointerTap={onSelect ? () => onSelect(archetype) : undefined}
              />
            </layoutContainer>

            <layoutContainer
              layout={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <layoutText
                text={getTrigramSymbol(archetypeData.coreStance)}
                style={{
                  fontSize: 18,
                  fill: primaryColor,
                }}
              />
              <layoutText
                text="핵심"
                style={{
                  fontSize: 10,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  fontFamily: "Noto Sans KR, sans-serif",
                }}
              />
            </layoutContainer>
          </layoutContainer>

          {/* Information Section */}
          <layoutContainer
            layout={{
              flexGrow: 1,
              maxWidth: width - imageSize - 120,
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Header */}
            <layoutContainer
              layout={{
                flexDirection: "column",
                gap: 4,
              }}
            >
              <layoutText
                text={`${archetypeData.name.korean} | ${archetypeData.name.english}`}
                style={{
                  fontFamily: "Noto Sans KR, sans-serif",
                  fontSize: isMobile ? 16 : 20,
                  fill: isSelected ? KOREAN_COLORS.ACCENT_GOLD : primaryColor,
                  fontWeight: "bold",
                }}
              />

              <layoutText
                text={archetypeData.description.korean}
                style={{
                  fontFamily: "Noto Sans KR, sans-serif",
                  fontSize: isMobile ? 11 : 13,
                  fill: KOREAN_COLORS.TEXT_PRIMARY,
                  wordWrap: true,
                  wordWrapWidth: isMobile ? width - 120 : 300,
                  lineHeight: 16,
                }}
              />
            </layoutContainer>

            {/* Stats Section */}
            <layoutContainer
              layout={{
                flexDirection: isMobile ? "column" : "row",
                gap: isMobile ? 8 : 12,
                flexWrap: "wrap",
              }}
            >
              <StatBar
                korean="공격"
                value={archetypeData.stats.attackPower}
                maxValue={100}
                color={KOREAN_COLORS.NEGATIVE_RED}
                english="Attack"
              />
              <StatBar
                korean="방어"
                value={archetypeData.stats.defense}
                maxValue={100}
                color={KOREAN_COLORS.PRIMARY_BLUE}
                english="Defense"
              />
              <StatBar
                korean="속도"
                value={archetypeData.stats.speed}
                maxValue={100}
                color={KOREAN_COLORS.POSITIVE_GREEN}
                english="Speed"
              />
              <StatBar
                korean="기술"
                value={archetypeData.stats.technique}
                maxValue={100}
                color={KOREAN_COLORS.PRIMARY_CYAN}
                english="Technique"
              />
            </layoutContainer>

            {/* Favored Stances */}
            <layoutContainer
              layout={{
                flexDirection: "column",
                gap: 6,
              }}
            >
              <layoutText
                text="선호 팔괘"
                style={{
                  fontSize: isMobile ? 11 : 13,
                  fill: KOREAN_COLORS.ACCENT_GOLD,
                  fontFamily: "Noto Sans KR, sans-serif",
                  fontWeight: "bold",
                }}
              />
              <layoutContainer
                layout={{
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                {archetypeData.favoredStances.slice(0, 4).map((stance, i) => (
                  <layoutContainer
                    key={i}
                    layout={{
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <layoutText
                      text={getTrigramSymbol(stance)}
                      style={{
                        fontSize: 16,
                        fill: primaryColor,
                      }}
                    />
                    <layoutText
                      text={stance.slice(0, 2)}
                      style={{
                        fontSize: 8,
                        fill: KOREAN_COLORS.TEXT_SECONDARY,
                        fontFamily: "Noto Sans KR, sans-serif",
                      }}
                    />
                  </layoutContainer>
                ))}
              </layoutContainer>
            </layoutContainer>
          </layoutContainer>

          {/* Navigation Controls */}
          <layoutContainer
            layout={{
              width: 60,
              height: isMobile ? 60 : height - padding * 4,
              flexDirection: isMobile ? "row" : "column",
              alignItems: "center",
              justifyContent: "space-around",
              gap: 8,
            }}
          >
            <pixiFancyButton
              ref={prevButtonRef}
              defaultView={buttonViews.defaultView}
              hoverView={buttonViews.hoverView}
              pressedView={buttonViews.pressedView}
              text={isMobile ? "◀" : "▲"}
              textStyle={{
                fontSize: 16,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                fontWeight: "bold",
              }}
              data-testid="archetype-prev-button"
            />

            <layoutContainer
              layout={{
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <layoutGraphics context={progressBarContext} />
              <layoutText
                text={`${index + 1}/${total}`}
                style={{
                  fontSize: 10,
                  fill: KOREAN_COLORS.TEXT_SECONDARY,
                  fontWeight: "bold",
                }}
              />
            </layoutContainer>

            <pixiFancyButton
              ref={nextButtonRef}
              defaultView={buttonViews.defaultView}
              hoverView={buttonViews.hoverView}
              pressedView={buttonViews.pressedView}
              text={isMobile ? "▶" : "▼"}
              textStyle={{
                fontSize: 16,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                fontWeight: "bold",
              }}
              data-testid="archetype-next-button"
            />
          </layoutContainer>
        </layoutContainer>

        {/* Selected indicator */}
        {isSelected && (
          <layoutContainer
            layout={{
              position: "absolute",
              top: 8,
              right: 8,
              padding: 6,
            }}
          >
            <layoutText
              text="✓ 선택됨"
              style={{
                fontFamily: "Noto Sans KR, sans-serif",
                fontSize: 10,
                fill: KOREAN_COLORS.ACCENT_GOLD,
                fontWeight: "bold",
              }}
            />
          </layoutContainer>
        )}
      </layoutContainer>
    );
  }
);

ArchetypeDisplay.displayName = "ArchetypeDisplay";

export default ArchetypeDisplay;
