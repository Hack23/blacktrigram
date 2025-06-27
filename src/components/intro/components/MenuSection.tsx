import "@pixi/layout";
import { extend } from "@pixi/react";
import { FancyButton } from "@pixi/ui";
import { Container, Graphics, Text } from "pixi.js";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { GameMode } from "../../../types/common";
import { KOREAN_COLORS } from "../../../types/constants";

// Extend Container and FancyButton with layout support
extend({ Container, Graphics, Text, FancyButton });

// Add layout type declaration for Container
declare module "pixi.js" {
  interface Container {
    layout?: any; // Layout mixin from @pixi/layout
  }
}

export interface MenuSectionProps {
  readonly menuItems: Array<{
    mode: GameMode;
    korean: string;
    english: string;
    description?: string;
  }>;
  readonly selectedIndex: number;
  readonly onModeSelect: (mode: GameMode) => void;
  readonly width: number;
  readonly height: number;
  readonly x: number;
  readonly y: number;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  selectedIndex,
  onModeSelect,
  width,
  height,
  x,
  y,
}) => {
  const containerRef = useRef<PIXI.Container | null>(null);
  const buttonsRef = useRef<FancyButton[]>([]);
  const isMobile = width < 768;
  const buttonWidth = Math.min(width - 80, 320);
  const buttonHeight = isMobile ? 50 : 60;

  const menuLayout = useMemo(
    () => ({
      width,
      height,
      flexDirection: "column" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: isMobile ? 12 : 16,
      padding: isMobile ? 20 : 40,
    }),
    [width, height, isMobile]
  );

  // Helper function to create button graphics
  const createButtonGraphics = useCallback(
    (color: number, alpha: number = 1): Graphics => {
      const graphics = new Graphics();
      graphics.roundRect(0, 0, buttonWidth, buttonHeight, 8);
      graphics.fill({ color, alpha });
      return graphics;
    },
    [buttonWidth, buttonHeight]
  );

  // Apply layout to container after ref is set
  useEffect(() => {
    if (containerRef.current) {
      // Apply layout properties directly to the container
      containerRef.current.layout = menuLayout;
    }
  }, [menuLayout]);

  // Create menu buttons using @pixi/ui FancyButton
  useEffect(() => {
    if (!containerRef.current) return;

    // Clear existing buttons
    buttonsRef.current.forEach((btn) => btn.destroy());
    buttonsRef.current = [];

    // Find or create buttons container
    let buttonsContainer = containerRef.current.children.find(
      (child) => child.name === "buttons-container"
    ) as PIXI.Container;

    if (!buttonsContainer) {
      buttonsContainer = new Container();
      buttonsContainer.name = "buttons-container";
      buttonsContainer.layout = {
        flexDirection: "column",
        gap: isMobile ? 10 : 12,
        alignItems: "center",
      };
      containerRef.current.addChild(buttonsContainer);
    }

    // Clear the buttons container
    buttonsContainer.removeChildren();

    // Create buttons for each menu item
    menuItems.forEach((item, index) => {
      const isSelected = index === selectedIndex;

      // Create button container for selection indicator
      const buttonWrapper = new Container();
      buttonWrapper.layout = {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: isSelected ? 20 : 0,
      };

      // Selection indicator
      if (isSelected) {
        const indicator = new Graphics();
        indicator.fill({ color: KOREAN_COLORS.ACCENT_GOLD });
        indicator.moveTo(0, -8);
        indicator.lineTo(16, 0);
        indicator.lineTo(0, 8);
        indicator.closePath();
        indicator.fill();
        indicator.x = -30;
        indicator.y = buttonHeight / 2;
        buttonWrapper.addChild(indicator);
      }

      // Create FancyButton with proper views
      const button = new FancyButton({
        defaultView: createButtonGraphics(
          isSelected
            ? KOREAN_COLORS.ACCENT_GOLD
            : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
          isSelected ? 0.9 : 0.8
        ),
        hoverView: createButtonGraphics(
          isSelected
            ? KOREAN_COLORS.ACCENT_GOLD
            : KOREAN_COLORS.UI_BACKGROUND_LIGHT,
          1
        ),
        pressedView: createButtonGraphics(
          isSelected
            ? KOREAN_COLORS.ACCENT_YELLOW
            : KOREAN_COLORS.UI_BACKGROUND_DARK,
          1
        ),
        text: new Text({
          text: `${item.korean} | ${item.english}`,
          style: {
            fontSize: isMobile ? 16 : 18,
            fill: isSelected
              ? KOREAN_COLORS.UI_BACKGROUND_DARK
              : KOREAN_COLORS.TEXT_PRIMARY,
            fontFamily: "Noto Sans KR, sans-serif",
            fontWeight: isSelected ? "bold" : "normal",
            align: "center",
          },
        }),
        padding: 15,
        animations: {
          hover: {
            props: { scale: { x: 1.05, y: 1.05 } },
            duration: 150,
          },
          pressed: {
            props: { scale: { x: 0.95, y: 0.95 } },
            duration: 100,
          },
        },
      });

      // Set layout for proper sizing
      button.layout = {
        width: buttonWidth,
        height: buttonHeight,
      };

      // Add event handler
      button.onPress.connect(() => onModeSelect(item.mode));

      // Add to wrapper and container
      buttonWrapper.addChild(button);
      buttonsContainer.addChild(buttonWrapper);
      buttonsRef.current.push(button);
    });

    // Position buttons container
    buttonsContainer.y = 100; // Below title
  }, [
    menuItems,
    selectedIndex,
    onModeSelect,
    createButtonGraphics,
    buttonWidth,
    buttonHeight,
    isMobile,
  ]);

  return (
    <pixiContainer ref={containerRef} x={x} y={y} data-testid="menu-section">
      {/* Background panel */}
      <pixiGraphics
        draw={useCallback(
          (g: Graphics) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.9 });
            g.roundRect(0, 0, width, height, 16);
            g.fill();

            // Subtle border
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_GOLD,
              alpha: 0.3,
            });
            g.roundRect(0, 0, width, height, 16);
            g.stroke();
          },
          [width, height]
        )}
      />

      {/* Title */}
      <pixiText
        text="흑괘 (Black Trigram)"
        style={{
          fontSize: isMobile ? 28 : 36,
          fill: KOREAN_COLORS.ACCENT_GOLD,
          fontFamily: "Noto Sans KR, sans-serif",
          fontWeight: "bold",
          dropShadow: {
            alpha: 0.5,
            angle: 45,
            blur: 4,
            color: 0x000000,
            distance: 2,
          },
        }}
        anchor={0.5}
        x={width / 2}
        y={50}
      />

      {/* Subtitle - positioned at bottom */}
      <pixiText
        text="한국 무술의 정수를 담은 격투 시뮬레이터"
        style={{
          fontSize: isMobile ? 14 : 16,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
          fontFamily: "Noto Sans KR, sans-serif",
          align: "center",
        }}
        anchor={0.5}
        x={width / 2}
        y={height - 30}
      />
    </pixiContainer>
  );
};

export default MenuSection;
