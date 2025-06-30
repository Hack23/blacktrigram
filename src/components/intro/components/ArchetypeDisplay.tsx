import { PlayerArchetypeData } from "@/systems";
import { PlayerArchetype } from "@/types";
import { FancyButton } from "@pixi/ui";
import * as PIXI from "pixi.js";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
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

    // --- FIX: Define button text style, not a PIXI.Text instance ---
    const buttonTextStyle = useMemo(
      () => ({
        fontSize: 20,
        fill: KOREAN_COLORS.TEXT_PRIMARY,
        fontWeight: "bold",
        align: "center",
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

    // Create progress bar draw callbacks
    const drawProgressBarBg = useCallback((g: PIXI.Graphics) => {
      g.clear();
      g.roundRect(0, 0, 200, 8, 4);
      g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.8 });
    }, []);

    const drawProgressBarFill = useCallback(
      (g: PIXI.Graphics) => {
        const fillWidth = (200 * (index + 1)) / total;
        g.clear();
        g.roundRect(0, 0, fillWidth, 8, 4);
        g.fill(primaryColor);
      },
      [primaryColor, index, total]
    );

    // Main container layout - simplified without deep nesting
    const mainLayout = useMemo(
      () => ({
        width: width * 0.9,
        height,
        padding: 20,
        borderRadius: 12,
        backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
        backgroundAlpha: 0.9,
        position: "relative" as const,
      }),
      [width, height]
    );

    return (
      <layoutContainer layout={mainLayout}>
        {/* Character image - positioned absolutely */}
        <pixiSprite
          texture={texture ?? PIXI.Texture.EMPTY}
          anchor={0.5}
          interactive={!!onSelect}
          cursor={onSelect ? "pointer" : "default"}
          onPointerTap={onSelect ? () => onSelect(archetype) : undefined}
          layout={{
            position: "absolute",
            left: isMobile ? "50%" : 100,
            top: isMobile ? 20 + imageSize / 2 : "50%",
            width: imageSize,
            height: imageSize,
            marginLeft: isMobile ? -imageSize / 2 : 0,
            marginTop: isMobile ? 0 : -imageSize / 2,
          }}
        />

        {/* Character name - positioned absolutely */}
        <pixiText
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
            left: isMobile ? "50%" : imageSize + 60,
            marginLeft: isMobile ? -((width * 0.9) / 2) : 0,
            width: isMobile ? width * 0.9 : "auto",
          }}
          anchor={isMobile ? 0.5 : 0}
        />

        {/* Description - positioned absolutely */}
        <pixiText
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
            left: isMobile ? "50%" : imageSize + 60,
            marginLeft: isMobile ? -((width * 0.9) / 2) : 0,
            width: isMobile ? width * 0.9 : 400,
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
              // --- FIX: Pass text string and style object ---
              text={"◀"}
              textStyle={buttonTextStyle}
              layout={{
                position: "absolute",
                left: 20,
                top: "50%",
                marginTop: -20,
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
              // --- FIX: Pass text string and style object ---
              text={"▶"}
              textStyle={buttonTextStyle}
              layout={{
                position: "absolute",
                right: 20,
                top: "50%",
                marginTop: -20,
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
              // --- FIX: Pass text string and style object ---
              text={"◀"}
              textStyle={buttonTextStyle}
              layout={{
                position: "absolute",
                bottom: 60,
                left: "25%",
                marginLeft: -20,
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
              // --- FIX: Pass text string and style object ---
              text={"▶"}
              textStyle={buttonTextStyle}
              layout={{
                position: "absolute",
                bottom: 60,
                right: "25%",
                marginRight: -20,
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
        <pixiGraphics
          draw={drawProgressBarBg}
          layout={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            marginLeft: -100,
          }}
        />
        <pixiGraphics
          draw={drawProgressBarFill}
          layout={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            marginLeft: -100,
          }}
        />

        {/* Selected indicator */}
        {isSelected && (
          <pixiText
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
