import "@pixi/layout";
import { LayoutContainer, LayoutText } from "@pixi/layout/components";
import "@pixi/layout/react";
import { extend } from "@pixi/react";
import { FancyButton } from "@pixi/ui";
import { Container, Graphics, Text } from "pixi.js";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { GameMode } from "../../../types/common";
import { KOREAN_COLORS } from "../../../types/constants";

// Extend layout components
extend({
  Container,
  LayoutContainer,
  Graphics,
  Text,
  LayoutText,
  FancyButton,
});

export interface MenuSectionProps {
  readonly menuItems: ReadonlyArray<{
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
  const buttonsRef = useRef<FancyButton[]>([]);
  const isMobile = width < 768;
  const buttonWidth = Math.min(width - 80, 320);
  const buttonHeight = isMobile ? 50 : 60;

  const menuLayout = useMemo(
    () => ({
      width,
      height,
      position: "absolute" as const,
      top: y,
      left: x,
      flexDirection: "column" as const,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      gap: isMobile ? 12 : 16,
      padding: isMobile ? 20 : 40,
      backgroundColor: KOREAN_COLORS.UI_BACKGROUND_DARK,
      backgroundAlpha: 0.9,
      borderRadius: 16,
    }),
    [width, height, x, y, isMobile]
  );

  // Helper function to create button graphics
  const createButtonGraphics = useCallback(
    (color: number, alpha: number = 1): Graphics => {
      const graphics = new Graphics();
      graphics.roundRect(0, 0, buttonWidth, buttonHeight, 8);
      graphics.fill({ color, alpha });
      graphics.stroke({
        width: 2,
        color: KOREAN_COLORS.ACCENT_GOLD,
        alpha: alpha * 0.8,
      });
      graphics.roundRect(0, 0, buttonWidth, buttonHeight, 8);
      graphics.stroke();
      return graphics;
    },
    [buttonWidth, buttonHeight]
  );

  // Create menu button component
  const MenuButton: React.FC<{
    item: { mode: GameMode; korean: string; english: string };
    index: number;
    isSelected: boolean;
  }> = useCallback(
    ({ item, index, isSelected }) => {
      const buttonRef = useRef<FancyButton | null>(null);

      // Create button views with proper PixiJS v8 API
      const defaultView = useMemo(() => {
        return createButtonGraphics(
          isSelected
            ? KOREAN_COLORS.ACCENT_GOLD
            : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
          isSelected ? 0.9 : 0.8
        );
      }, [isSelected]);

      const hoverView = useMemo(() => {
        return createButtonGraphics(
          isSelected
            ? KOREAN_COLORS.ACCENT_GOLD
            : KOREAN_COLORS.UI_BACKGROUND_LIGHT,
          1
        );
      }, [isSelected]);

      const pressedView = useMemo(() => {
        return createButtonGraphics(
          isSelected
            ? KOREAN_COLORS.ACCENT_YELLOW
            : KOREAN_COLORS.UI_BACKGROUND_DARK,
          1
        );
      }, [isSelected]);

      const buttonText = useMemo(() => {
        return new Text({
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
        });
      }, [item.korean, item.english, isSelected, isMobile]);

      useEffect(() => {
        if (buttonRef.current) {
          const button = buttonRef.current;
          button.onPress.disconnectAll();
          button.onPress.connect(() => onModeSelect(item.mode));

          // Store reference for cleanup
          buttonsRef.current[index] = button;

          return () => {
            button.onPress.disconnectAll();
          };
        }
      }, [item.mode, index]);

      return (
        <layoutContainer
          layout={{
            flexDirection: "row" as const,
            alignItems: "center" as const,
            marginLeft: isSelected ? 20 : 0,
          }}
        >
          {/* Selection indicator */}
          {isSelected && (
            <layoutText
              text="▶"
              style={{
                fontSize: 20,
                fill: KOREAN_COLORS.ACCENT_GOLD,
                fontWeight: "bold",
              }}
              layout={{
                marginRight: 15,
              }}
            />
          )}

          <pixiFancyButton
            ref={buttonRef}
            defaultView={defaultView}
            hoverView={hoverView}
            pressedView={pressedView}
            text={buttonText}
            data-testid={`menu-button-${item.mode}`}
          />
        </layoutContainer>
      );
    },
    [createButtonGraphics, isMobile, onModeSelect]
  );

  return (
    <layoutContainer layout={menuLayout} data-testid="menu-section">
      {/* Title */}
      <layoutText
        text="격투가의 길"
        style={{
          fontSize: isMobile ? 20 : 24,
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
        layout={{
          alignSelf: "center",
          marginBottom: 10,
        }}
      />

      {/* Subtitle */}
      <layoutText
        text="한국 무술의 정수를 담은 격투 시뮬레이터"
        style={{
          fontSize: isMobile ? 12 : 14,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
          fontFamily: "Noto Sans KR, sans-serif",
          align: "center",
          wordWrap: true,
          wordWrapWidth: width - 80,
        }}
        anchor={0.5}
        layout={{
          alignSelf: "center",
          marginBottom: 20,
        }}
      />

      {/* Menu buttons */}
      <layoutContainer
        layout={{
          flexDirection: "column" as const,
          alignItems: "center" as const,
          gap: isMobile ? 10 : 12,
        }}
      >
        {menuItems.map((item, index) => (
          <MenuButton
            key={item.mode}
            item={item}
            index={index}
            isSelected={index === selectedIndex}
          />
        ))}
      </layoutContainer>

      {/* Footer hint */}
      <layoutText
        text="↑↓ 키로 선택, Enter로 확인"
        style={{
          fontSize: isMobile ? 10 : 12,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
          fontStyle: "italic",
        }}
        anchor={0.5}
        layout={{
          alignSelf: "center",
          marginTop: 15,
        }}
      />
    </layoutContainer>
  );
};

export default MenuSection;
