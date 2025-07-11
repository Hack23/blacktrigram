import React, { useEffect, useState } from "react";
import { GameMode } from "../../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { KoreanText } from "../../ui/base/korean-text/KoreanText";

export interface MenuSectionProps {
  readonly menuItems: Array<{
    mode: GameMode;
    korean: string;
    english: string;
  }>;
  readonly selectedIndex: number;
  readonly onModeSelect: (mode: GameMode) => void;
  readonly onSelectedIndexChange?: (index: number) => void;
  readonly onPlaySFX?: (sound: string) => void;
  readonly width: number;
  readonly height: number;
  readonly x: number;
  readonly y: number;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  selectedIndex,
  onModeSelect,
  onSelectedIndexChange,
  onPlaySFX,
  width,
  height,
  x,
  y,
}) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [focused, setFocused] = useState<boolean>(false);

  // Keyboard navigation (optional)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!onSelectedIndexChange) return;
      if (event.key === "ArrowUp") {
        event.preventDefault();
        const nextIndex =
          selectedIndex === 0 ? menuItems.length - 1 : selectedIndex - 1;
        onSelectedIndexChange(nextIndex);
        onPlaySFX?.("menu_hover");
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex =
          selectedIndex === menuItems.length - 1 ? 0 : selectedIndex + 1;
        onSelectedIndexChange(nextIndex);
        onPlaySFX?.("menu_hover");
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        onPlaySFX?.("menu_select");
        onModeSelect(menuItems[selectedIndex].mode);
      } else {
        const numKey = parseInt(event.key);
        if (numKey >= 1 && numKey <= menuItems.length) {
          const targetIndex = numKey - 1;
          onSelectedIndexChange(targetIndex);
          onPlaySFX?.("menu_select");
          onModeSelect(menuItems[targetIndex].mode);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedIndex,
    menuItems,
    onSelectedIndexChange,
    onModeSelect,
    onPlaySFX,
  ]);

  // Focus ring for accessibility
  useEffect(() => {
    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);
    window.addEventListener("focusin", handleFocus);
    window.addEventListener("focusout", handleBlur);
    return () => {
      window.removeEventListener("focusin", handleFocus);
      window.removeEventListener("focusout", handleBlur);
    };
  }, []);

  const isMobile = width < 480;
  const buttonHeight = isMobile ? 28 : 32; // Further reduced button height
  const buttonFontSize = isMobile ? 10 : 12; // Further reduced font size
  const menuPanelRadius = isMobile ? 6 : 8;
  const buttonSpacing = isMobile ? 4 : 6; // Reduced spacing

  // Calculate proper spacing to prevent overlap
  const titleHeight = isMobile ? 50 : 60; // Title area
  const instructionsHeight = isMobile ? 60 : 70; // Instructions area at bottom - increased
  const padding = isMobile ? 16 : 20; // Increased padding
  // Calculate available space for buttons
  const availableHeight =
    height - titleHeight - instructionsHeight - padding * 3;
  const buttonsAreaHeight = (buttonHeight + buttonSpacing) * menuItems.length;
  const useCompactLayout = buttonsAreaHeight > availableHeight;


  return (
    <pixiContainer
      x={x}
      y={y}
      layout={{
        width,
        height,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: useCompactLayout ? (isMobile ? 12 : 16) : isMobile ? 18 : 28,
        padding: isMobile ? 16 : 32,
      }}
      data-testid="menu-section"
    >
      {/* Enhanced Panel Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          // Main background
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.96 });
          g.roundRect(0, 0, width, height, menuPanelRadius);
          g.fill();

          // Neon border
          g.stroke({
            width: 3,
            color: KOREAN_COLORS.PRIMARY_CYAN,
            alpha: 0.8,
          });
          g.roundRect(0, 0, width, height, menuPanelRadius);
          g.stroke();

          // Gold accent border
          g.stroke({
            width: 1.5,
            color: KOREAN_COLORS.ACCENT_GOLD,
            alpha: 0.5,
          });
          g.roundRect(6, 6, width - 12, height - 12, menuPanelRadius - 4);
          g.stroke();

          // Focus ring
          if (focused) {
            g.stroke({
              width: 2,
              color: KOREAN_COLORS.ACCENT_CYAN,
              alpha: 0.8,
            });
            g.roundRect(-4, -4, width + 8, height + 8, menuPanelRadius + 2);
            g.stroke();
          }

          // Remove shadow since it's not available in PixiJS v8 Graphics API
        }}
        data-testid="menu-panel-background"
      />

      {/* Menu Title */}
      <KoreanText
        text={{ korean: "메인 메뉴", english: "Main Menu" }}
        style={{
          fontSize: useCompactLayout
            ? isMobile
              ? 18
              : 24
            : isMobile
            ? 20
            : 28,
          fill: KOREAN_COLORS.ACCENT_GOLD,
          align: "center",
          fontWeight: "bold",
          fontFamily: FONT_FAMILY.KOREAN,
          dropShadow: {
            color: KOREAN_COLORS.ACCENT_GOLD,
            distance: 2,
            alpha: 0.7,
          },
        }}
        x={width / 2}
        y={isMobile ? 24 : 32}
        anchor={0.5}
        data-testid="menu-title"
      />

      {/* Menu Items Container with calculated positioning */}
      <pixiContainer
        x={0}
        y={titleHeight}
        layout={{
          width: width,
          flexDirection: "column",
          gap: useCompactLayout ? (isMobile ? 8 : 12) : buttonSpacing,
          alignItems: "center",
        }}
        data-testid="main-menu-buttons"
      >
        {menuItems.map((item, index) => {
          const isSelected = selectedIndex === index;
          const isHovered = hoveredItem === index;
          const buttonWidth = width - (isMobile ? 32 : 64);

          return (
            <pixiContainer
              key={item.mode}
              layout={{
                width: buttonWidth,
                height: buttonHeight,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: useCompactLayout ? 2 : isMobile ? 6 : 10,
              }}
              data-testid={`menu-item-${item.mode}`}
            >
              {/* Button Background */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();

                  // Button background
                  const bgColor = isSelected
                    ? KOREAN_COLORS.ACCENT_GOLD
                    : isHovered
                    ? KOREAN_COLORS.UI_BACKGROUND_LIGHT
                    : KOREAN_COLORS.UI_BACKGROUND_MEDIUM;

                  const bgAlpha = isSelected ? 0.98 : 0.92;

                  g.fill({ color: bgColor, alpha: bgAlpha });
                  g.roundRect(0, 0, buttonWidth, buttonHeight, 8);
                  g.fill();

                  // Button border
                  const borderColor = isSelected
                    ? KOREAN_COLORS.UI_BACKGROUND_DARK
                    : isHovered
                    ? KOREAN_COLORS.ACCENT_GOLD
                    : KOREAN_COLORS.PRIMARY_CYAN;

                  const borderAlpha = isSelected ? 1.0 : isHovered ? 0.8 : 0.7;
                  const borderWidth = isSelected ? 3 : 2;

                  g.stroke({
                    width: borderWidth,
                    color: borderColor,
                    alpha: borderAlpha,
                  });
                  g.roundRect(0, 0, buttonWidth, buttonHeight, 8);
                  g.stroke();
                }}
                interactive={true}
                onPointerDown={() => {
                  onModeSelect(item.mode);
                  onPlaySFX?.("menu_select");
                }}
                onPointerOver={() => {
                  setHoveredItem(index);
                  if (!isSelected) onPlaySFX?.("menu_hover");
                }}
                onPointerOut={() => setHoveredItem(null)}
                layout={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
              />

              {/* Button Text */}
              <pixiText
                text={`${item.korean} (${item.english})`}
                style={{
                  fontSize: useCompactLayout
                    ? buttonFontSize - 2
                    : buttonFontSize,
                  fill: isSelected
                    ? KOREAN_COLORS.UI_BACKGROUND_DARK
                    : isHovered
                    ? KOREAN_COLORS.ACCENT_GOLD
                    : KOREAN_COLORS.TEXT_PRIMARY,
                  align: "center",
                  fontFamily: FONT_FAMILY.KOREAN,
                  fontWeight: isSelected ? "bold" : "normal",
                  letterSpacing: 1.2,
                  dropShadow: isSelected
                    ? {
                        color: KOREAN_COLORS.ACCENT_GOLD,
                        distance: 2,
                        alpha: 0.7,
                      }
                    : undefined,
                }}
                x={buttonWidth / 2}
                y={buttonHeight / 2}
                anchor={0.5}
              />
            </pixiContainer>
          );
        })}
      </pixiContainer>

      {/* Navigation Instructions - Fixed positioning */}
      <pixiContainer
        x={0}
        y={height - instructionsHeight}
        layout={{
          width: width,
          height: instructionsHeight,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: isMobile ? 6 : 8,
          padding: isMobile ? 8 : 12,
        }}
        data-testid="navigation-hint-container"
      >
        {/* Single, clear instruction line */}
        <pixiText
          text="방향키/마우스로 이동 • Enter/클릭으로 선택 • 숫자키로 바로가기"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
            fontFamily: FONT_FAMILY.KOREAN,
            fontWeight: "normal",
            letterSpacing: 0.5,
          }}
          x={width / 2}
          y={instructionsHeight / 2 - (isMobile ? 8 : 10)}
          anchor={0.5}
          data-testid="menu-navigation-hint-korean"
        />

        {/* English instruction */}
        <pixiText
          text="Arrow keys/mouse to navigate • Enter/click to select • Number keys for shortcuts"
          style={{
            fontSize: isMobile ? 9 : 10,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
            fontFamily: FONT_FAMILY.KOREAN,
            fontWeight: "normal",
            letterSpacing: 0.4,
          }}
          x={width / 2}
          y={instructionsHeight / 2 + (isMobile ? 8 : 10)}
          anchor={0.5}
          data-testid="menu-navigation-hint-english"
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default MenuSection;
