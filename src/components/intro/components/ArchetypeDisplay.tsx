import { PlayerArchetypeData } from "@/systems";
import { PlayerArchetype } from "@/types";
import { FancyButton } from "@pixi/ui"; // Import from @pixi/ui instead of pixi.js
import * as PIXI from "pixi.js";
import React, { useEffect, useMemo, useRef } from "react";
import { KOREAN_COLORS } from "../../../types/constants";

// Define the proper props interface
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

// Helper function to create button graphics
const createButtonGraphics = (
  width: number,
  height: number,
  color: number,
  alpha: number = 1
): PIXI.Graphics => {
  const graphics = new PIXI.Graphics();
  graphics.roundRect(0, 0, width, height, 8);
  graphics.fill({ color, alpha });
  return graphics;
};

// Helper function to create progress bar background
const createProgressBg = (width: number, height: number): PIXI.Graphics => {
  const bg = new PIXI.Graphics();
  bg.roundRect(0, 0, width, height, height / 2);
  bg.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
  return bg;
};

// Helper function to create progress bar fill
const createProgressFill = (
  color: number,
  width: number = 200
): PIXI.Graphics => {
  const fill = new PIXI.Graphics();
  fill.roundRect(0, 0, width, 8, 4);
  fill.fill(color);
  return fill;
};

// Constants
const IMAGE_SIZE = 120;
const MOBILE_IMAGE_SIZE = 80;

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
    const imageSize = isMobile ? MOBILE_IMAGE_SIZE : IMAGE_SIZE;

    // Get the primary color from archetypeData
    const primaryColor = archetypeData.colors.primary;

    // Create button views outside of nested components to avoid memory issues
    const navButtonViews = useMemo(
      () => ({
        prev: {
          default: createButtonGraphics(40, 40, primaryColor, 0.8),
          hover: createButtonGraphics(44, 44, primaryColor, 1),
          pressed: createButtonGraphics(38, 38, primaryColor, 0.6),
        },
        next: {
          default: createButtonGraphics(40, 40, primaryColor, 0.8),
          hover: createButtonGraphics(44, 44, primaryColor, 1),
          pressed: createButtonGraphics(38, 38, primaryColor, 0.6),
        },
      }),
      [primaryColor]
    );

    // Create refs for buttons with proper type from @pixi/ui
    const prevButtonRef = useRef<FancyButton>(null);
    const nextButtonRef = useRef<FancyButton>(null);

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

    // Create progress bar views
    const progressViews = useMemo(
      () => ({
        bg: createProgressBg(200, 8),
        fill: createProgressFill(primaryColor),
      }),
      [primaryColor]
    );

    return (
      <layoutContainer
        layout={{
          width: width * 0.9,
          height,
          padding: 20,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 20,
          backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
        }}
      >
        {/* Main content row */}
        <layoutContainer
          layout={{
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            gap: isMobile ? 16 : 24,
          }}
        >
          {/* Desktop: Left navigation button */}
          {!isMobile && (
            <pixiFancyButton
              ref={prevButtonRef}
              defaultView={navButtonViews.prev.default}
              hoverView={navButtonViews.prev.hover}
              pressedView={navButtonViews.prev.pressed}
              text={
                new PIXI.Text({
                  text: "◀",
                  style: {
                    fontSize: 20,
                    fill: KOREAN_COLORS.TEXT_PRIMARY,
                    fontWeight: "bold",
                    align: "center",
                  },
                })
              }
              animations={{
                hover: { props: { scale: { x: 1.1, y: 1.1 } }, duration: 150 },
                pressed: {
                  props: { scale: { x: 0.95, y: 0.95 } },
                  duration: 100,
                },
              }}
            />
          )}

          {/* Character image */}
          <layoutContainer
            layout={{
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <layoutSprite
              texture={texture ?? PIXI.Texture.EMPTY}
              layout={{
                width: imageSize,
                height: imageSize,
              }}
              anchor={0.5}
              interactive={!!onSelect}
              cursor={onSelect ? "pointer" : "default"}
              onPointerTap={onSelect ? () => onSelect(archetype) : undefined}
            />
            {isSelected && (
              <layoutText
                text="✓ 선택됨"
                style={{
                  fontFamily: "Noto Sans KR, sans-serif",
                  fontSize: 12,
                  fill: KOREAN_COLORS.ACCENT_GOLD,
                  fontWeight: "bold",
                }}
              />
            )}
          </layoutContainer>

          {/* Character info */}
          <layoutContainer
            layout={{
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <layoutText
              text={`${archetypeData.name.korean} - ${archetypeData.name.english}`}
              style={{
                fontFamily: "Noto Sans KR, sans-serif",
                fontSize: isMobile ? 18 : 24,
                fill: isSelected ? KOREAN_COLORS.ACCENT_GOLD : primaryColor,
                fontWeight: "bold",
                align: "center",
                dropShadow: {
                  color: 0x000000,
                  alpha: 0.5,
                  blur: 4,
                  distance: 2,
                },
              }}
            />
            <layoutText
              text={archetype.toLowerCase().replace(/_/g, " ")}
              style={{
                fontFamily: "Noto Sans KR, sans-serif",
                fontSize: isMobile ? 12 : 14,
                fill: KOREAN_COLORS.TEXT_SECONDARY,
                align: "center",
              }}
            />
            <layoutText
              text={archetypeData.description.korean}
              style={{
                fontFamily: "Noto Sans KR, sans-serif",
                fontSize: isMobile ? 12 : 14,
                fill: KOREAN_COLORS.TEXT_PRIMARY,
                align: "center",
                wordWrap: true,
                wordWrapWidth: isMobile ? 200 : 300,
                lineHeight: 20,
              }}
            />
          </layoutContainer>

          {/* Desktop: Right navigation button */}
          {!isMobile && (
            <pixiFancyButton
              ref={nextButtonRef}
              defaultView={navButtonViews.next.default}
              hoverView={navButtonViews.next.hover}
              pressedView={navButtonViews.next.pressed}
              text={
                new PIXI.Text({
                  text: "▶",
                  style: {
                    fontSize: 20,
                    fill: KOREAN_COLORS.TEXT_PRIMARY,
                    fontWeight: "bold",
                    align: "center",
                  },
                })
              }
              animations={{
                hover: { props: { scale: { x: 1.1, y: 1.1 } }, duration: 150 },
                pressed: {
                  props: { scale: { x: 0.95, y: 0.95 } },
                  duration: 100,
                },
              }}
            />
          )}
        </layoutContainer>

        {/* Mobile: Navigation buttons row */}
        {isMobile && (
          <layoutContainer
            layout={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <pixiFancyButton
              ref={prevButtonRef}
              defaultView={navButtonViews.prev.default}
              hoverView={navButtonViews.prev.hover}
              pressedView={navButtonViews.prev.pressed}
              text={
                new PIXI.Text({
                  text: "◀",
                  style: {
                    fontSize: 20,
                    fill: KOREAN_COLORS.TEXT_PRIMARY,
                    fontWeight: "bold",
                    align: "center",
                  },
                })
              }
              animations={{
                hover: { props: { scale: { x: 1.1, y: 1.1 } }, duration: 150 },
                pressed: {
                  props: { scale: { x: 0.95, y: 0.95 } },
                  duration: 100,
                },
              }}
            />
            <pixiFancyButton
              ref={nextButtonRef}
              defaultView={navButtonViews.next.default}
              hoverView={navButtonViews.next.hover}
              pressedView={navButtonViews.next.pressed}
              text={
                new PIXI.Text({
                  text: "▶",
                  style: {
                    fontSize: 20,
                    fill: KOREAN_COLORS.TEXT_PRIMARY,
                    fontWeight: "bold",
                    align: "center",
                  },
                })
              }
              animations={{
                hover: { props: { scale: { x: 1.1, y: 1.1 } }, duration: 150 },
                pressed: {
                  props: { scale: { x: 0.95, y: 0.95 } },
                  duration: 100,
                },
              }}
            />
          </layoutContainer>
        )}

        {/* Progress bar */}
        <pixiProgressBar
          bg={progressViews.bg}
          fill={progressViews.fill}
          fillPaddings={{ top: 2, right: 2, bottom: 2, left: 2 }}
          progress={((index + 1) / total) * 100}
        />
      </layoutContainer>
    );
  }
);

ArchetypeDisplay.displayName = "ArchetypeDisplay";

export default ArchetypeDisplay;
