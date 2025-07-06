import { PlayerArchetypeData } from "@/systems";
import { PlayerArchetype, TrigramStance } from "@/types";
import { useTick } from "@pixi/react";
import { FancyButton } from "@pixi/ui";
import * as PIXI from "pixi.js";
import { Graphics } from "pixi.js";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { KOREAN_COLORS } from "../../../types/constants";
import "../../../utils/pixiExtensions";
import { createGraphicsContext } from "../../../utils/pixiExtensions";

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
    const imageSize = isMobile ? 80 : isTablet ? 120 : 140;
    const padding = isMobile ? 12 : isTablet ? 16 : 20;
    const primaryColor = archetypeData.colors.primary;

    const prevButtonRef = useRef<FancyButton>(null);
    const nextButtonRef = useRef<FancyButton>(null);

    // Animation for selected state
    const [selectedAnim, setSelectedAnim] = useState(0);
    useTick((ticker) => {
      const target = isSelected ? 1 : 0;
      const diff = target - selectedAnim;
      if (Math.abs(diff) > 0.01) {
        setSelectedAnim(selectedAnim + diff * 0.2 * ticker.deltaTime);
      } else {
        setSelectedAnim(target);
      }
    });

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
        if (selectedAnim > 0) {
          g.roundRect(
            -2 * selectedAnim,
            -2 * selectedAnim,
            width + 4 * selectedAnim,
            height + 4 * selectedAnim,
            18
          );
          g.stroke({
            width: 2 + selectedAnim,
            color: KOREAN_COLORS.ACCENT_GOLD,
            alpha: 0.6 + 0.3 * selectedAnim,
          });
        }

        // Decorative corner elements with archetype theme
        const cornerSize = 24;
        g.moveTo(cornerSize, 16);
        g.lineTo(16, 16);
        g.lineTo(16, cornerSize);
        g.stroke({ width: 3, color: primaryColor, alpha: 0.8 });
      });
    }, [width, height, primaryColor, selectedAnim]);

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
        }, [value, maxValue, color, barWidth, barHeight]);

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
            width: "100%",
            height: "100%",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 8 : 16,
            alignItems: "stretch",
          }}
        >
          {/* Character Portrait Section */}
          <layoutContainer
            layout={{
              width: imageSize + 20,
              flexShrink: 0,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {/* Portrait background */}
            <layoutContainer
              layout={{
                width: imageSize + 16,
                height: imageSize + 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                borderRadius: 8,
              }}
            >
              {/* ✅ FIXED: Better texture handling with Korean text fallback */}
              {texture && texture !== PIXI.Texture.EMPTY ? (
                <layoutSprite
                  texture={texture}
                  anchor={0.5}
                  width={imageSize}
                  height={imageSize}
                  interactive={!!onSelect}
                  cursor={onSelect ? "pointer" : "default"}
                  onPointerTap={() => onSelect?.(archetype)}
                />
              ) : (
                <layoutContainer
                  layout={{
                    width: imageSize,
                    height: imageSize,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: primaryColor,
                    borderRadius: 4,
                  }}
                  interactive={!!onSelect}
                  cursor={onSelect ? "pointer" : "default"}
                  onPointerTap={() => onSelect?.(archetype)}
                >
                  {/* Korean character name as fallback */}
                  <layoutText
                    text={archetypeData.name.korean.slice(0, 2)}
                    style={{
                      fontSize: imageSize / 3,
                      fill: KOREAN_COLORS.UI_BACKGROUND_DARK,
                      fontFamily: "Noto Sans KR, sans-serif",
                      fontWeight: "bold",
                      align: "center",
                    }}
                    anchor={0.5}
                  />
                </layoutContainer>
              )}
            </layoutContainer>

            {/* Core stance indicator */}
            <layoutContainer
              layout={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <layoutText
                text={getTrigramSymbol(archetypeData.coreStance)}
                style={{
                  fontSize: 16,
                  fill: primaryColor,
                }}
              />
              <layoutText
                text="핵심"
                style={{
                  fontSize: 9,
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
              flexDirection: "column",
              gap: isMobile ? 6 : 10,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <layoutContainer
              layout={{
                flexDirection: "column",
                gap: 3,
              }}
            >
              <layoutText
                text={`${archetypeData.name.korean} | ${archetypeData.name.english}`}
                style={{
                  fontFamily: "Noto Sans KR, sans-serif",
                  fontSize: isMobile ? 14 : 18,
                  fill: isSelected ? KOREAN_COLORS.ACCENT_GOLD : primaryColor,
                  fontWeight: "bold",
                }}
              />

              <layoutText
                text={archetypeData.description.korean}
                style={{
                  fontFamily: "Noto Sans KR, sans-serif",
                  fontSize: isMobile ? 10 : 12,
                  fill: KOREAN_COLORS.TEXT_PRIMARY,
                  wordWrap: true,
                  wordWrapWidth: width - imageSize - 80,
                  lineHeight: 14,
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
              width: isMobile ? "100%" : 50,
              height: isMobile ? 40 : "100%",
              flexShrink: 0,
              flexDirection: isMobile ? "row" : "column",
              alignItems: "center",
              justifyContent: "space-around",
              gap: 6,
            }}
          >
            <layoutContainer layout={{ width: 56, height: 56 }}>
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
            </layoutContainer>

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

            <layoutContainer layout={{ width: 56, height: 56 }}>
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
        </layoutContainer>

        {/* Selected indicator */}
        {isSelected && (
          <layoutContainer
            layout={{
              position: "absolute",
              top: 6,
              right: 6,
              backgroundColor: KOREAN_COLORS.ACCENT_GOLD,
              borderRadius: 3,
              padding: 4,
            }}
          >
            <layoutText
              text="✓"
              style={{
                fontSize: 10,
                fill: KOREAN_COLORS.UI_BACKGROUND_DARK,
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
