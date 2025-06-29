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

    // Create button views once
    const navButtonViews = useMemo(
      () => ({
        default: createButtonGraphics(40, 40, primaryColor, 0.8),
        hover: createButtonGraphics(44, 44, primaryColor, 1),
        pressed: createButtonGraphics(38, 38, primaryColor, 0.6),
      }),
      [primaryColor]
    );

    // Create refs for buttons
    const prevButtonRef = useRef<FancyButton>(null);
    const nextButtonRef = useRef<FancyButton>(null);

    // Button text components
    const prevButtonText = useMemo(
      () =>
        new PIXI.Text({
          text: "◀",
          style: {
            fontSize: 20,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
            align: "center",
          },
        }),
      []
    );

    const nextButtonText = useMemo(
      () =>
        new PIXI.Text({
          text: "▶",
          style: {
            fontSize: 20,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            fontWeight: "bold",
            align: "center",
          },
        }),
      []
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

    // Create progress bar graphics
    const progressBarGraphics = useMemo(() => {
      const bg = new PIXI.Graphics();
      bg.roundRect(0, 0, 200, 8, 4);
      bg.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });

      const fill = new PIXI.Graphics();
      const fillWidth = (200 * (index + 1)) / total;
      fill.roundRect(0, 0, fillWidth, 8, 4);
      fill.fill(primaryColor);

      return { bg, fill };
    }, [primaryColor, index, total]);

    // Main container layout - simplified without deep nesting
    const mainLayout = useMemo(
      () => ({
        width: width * 0.9,
        height,
        padding: 20,
        borderRadius: 12,
        backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
        backgroundAlpha: 0.9,
      }),
      [width, height]
    );

    return (
      <layoutContainer layout={mainLayout}>
        {/* Character image - positioned absolutely */}
        <layoutSprite
          texture={texture ?? PIXI.Texture.EMPTY}
          anchor={0.5}
          interactive={!!onSelect}
          cursor={onSelect ? "pointer" : "default"}
          onPointerTap={onSelect ? () => onSelect(archetype) : undefined}
          layout={{
            position: "absolute",
            left: isMobile ? (width * 0.9) / 2 - imageSize / 2 : 100,
            top: isMobile ? 20 : height / 2 - imageSize / 2,
            width: imageSize,
            height: imageSize,
          }}
        />

        {/* Character name - positioned absolutely */}
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
            position: "absolute",
            top: isMobile ? imageSize + 40 : 40,
          }}
          anchor={isMobile ? 0.5 : 0}
        />

        {/* Description - positioned absolutely */}
        <layoutText
          text={archetypeData.description.korean}
          style={{
            fontFamily: "Noto Sans KR, sans-serif",
            fontSize: isMobile ? 12 : 14,
            fill: KOREAN_COLORS.TEXT_PRIMARY,
            align: isMobile ? "center" : "left",
            wordWrap: true,
            wordWrapWidth: isMobile ? width * 0.8 : 400,
            lineHeight: 20,
          }}
          layout={{
            position: "absolute",
            top: isMobile ? imageSize + 80 : 80,
          }}
          anchor={{ x: isMobile ? 0.5 : 0, y: 0 }}
        />

        {/* Desktop navigation buttons */}
        {!isMobile && (
          <>
            <pixiFancyButton
              ref={prevButtonRef}
              defaultView={navButtonViews.default}
              hoverView={navButtonViews.hover}
              pressedView={navButtonViews.pressed}
              text={prevButtonText}
              layout={{
                position: "absolute",
                left: 20,
                top: height / 2 - 20,
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
              defaultView={navButtonViews.default}
              hoverView={navButtonViews.hover}
              pressedView={navButtonViews.pressed}
              text={nextButtonText}
              layout={{
                position: "absolute",
                right: 20,
                top: height / 2 - 20,
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

        {/* Mobile navigation buttons */}
        {isMobile && (
          <>
            <pixiFancyButton
              ref={prevButtonRef}
              defaultView={navButtonViews.default}
              hoverView={navButtonViews.hover}
              pressedView={navButtonViews.pressed}
              text={prevButtonText}
              layout={{
                position: "absolute",
                bottom: 60,
                left: width * 0.25,
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
              defaultView={navButtonViews.default}
              hoverView={navButtonViews.hover}
              pressedView={navButtonViews.pressed}
              text={nextButtonText}
              layout={{
                position: "absolute",
                bottom: 60,
                right: width * 0.25,
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

        {/* Progress bar */}
        <layoutGraphics
          context={progressBarGraphics.bg.context}
          layout={{
            position: "absolute",
            bottom: 20,
            left: width * 0.45 - 100,
          }}
        />
        <layoutGraphics
          context={progressBarGraphics.fill.context}
          layout={{
            position: "absolute",
            bottom: 20,
            left: width * 0.45 - 100,
          }}
        />

        {/* Selected indicator */}
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
      </layoutContainer>
    );
  }
);

ArchetypeDisplay.displayName = "ArchetypeDisplay";

export default ArchetypeDisplay;