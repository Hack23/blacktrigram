import { PlayerArchetypeData } from "@/systems";
import { PlayerArchetype } from "@/types";
import { FancyButton } from "@pixi/ui";
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

    // Simplified layout without excessive nesting
    return (
      <layoutContainer
        layout={{
          width: width * 0.9,
          height,
          padding: 20,
          borderRadius: 12,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
          flexDirection: isMobile ? "column" : "row",
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

        {/* Character image and info - simplified structure */}
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

        {/* Character info as direct children instead of nested container */}
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
          layout={{
            marginLeft: 10,
            marginRight: 10,
          }}
        />

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

        {/* Mobile: Navigation buttons - positioned absolutely to avoid nesting */}
        {isMobile && (
          <>
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
              layout={{
                position: "absolute",
                bottom: 60,
                left: width * 0.3,
              }}
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
              layout={{
                position: "absolute",
                bottom: 60,
                right: width * 0.3,
              }}
              animations={{
                hover: { props: { scale: { x: 1.1, y: 1.1 } }, duration: 150 },
                pressed: {
                  props: { scale: { x: 0.95, y: 0.95 } },
                  duration: 100,
                },
              }}
            />
          </>
        )}

        {/* Progress bar - positioned absolutely */}
        <pixiProgressBar
          bg={progressViews.bg}
          fill={progressViews.fill}
          fillPaddings={{ top: 2, right: 2, bottom: 2, left: 2 }}
          progress={((index + 1) / total) * 100}
          layout={{
            position: "absolute",
            bottom: 20,
            left: "center",
          }}
        />

        {/* Selected indicator - positioned absolutely */}
        {isSelected && (
          <layoutText
            text="✓ 선택됨"
            style={{
              fontFamily: "Noto Sans KR, sans-serif",
              fontSize: 12,
              fill: KOREAN_COLORS.ACCENT_GOLD,
              fontWeight: "bold",
            }}
            layout={{
              position: "absolute",
              top: 20,
              right: 20,
            }}
          />
        )}

        {/* Description text - positioned absolutely to avoid deep nesting */}
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
          layout={{
            position: "absolute",
            bottom: 80,
          }}
        />
      </layoutContainer>
    );
  }
);

ArchetypeDisplay.displayName = "ArchetypeDisplay";

export default ArchetypeDisplay;
