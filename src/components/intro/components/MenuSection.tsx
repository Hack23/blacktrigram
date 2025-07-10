import React, { useCallback, useEffect, useState } from "react";
import { GameMode } from "../../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import { KoreanText } from "../../ui/base/korean-text/KoreanText";

// Utility for focus ring
const FOCUS_RING_COLOR = KOREAN_COLORS.ACCENT_CYAN;

export interface MenuSectionProps {
  readonly menuItems: Array<{
    mode: GameMode;
    korean: string;
    english: string;
  }>;
  readonly selectedIndex: number;
  readonly onModeSelect: (mode: GameMode) => void;
  readonly onSelectedIndexChange: (index: number) => void;
  readonly onPlaySFX: (sound: string) => void;
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        const nextIndex =
          selectedIndex === 0 ? menuItems.length - 1 : selectedIndex - 1;
        onSelectedIndexChange(nextIndex);
        onPlaySFX("menu_hover");
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex =
          selectedIndex === menuItems.length - 1 ? 0 : selectedIndex + 1;
        onSelectedIndexChange(nextIndex);
        onPlaySFX("menu_hover");
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        onPlaySFX("menu_select");
        onModeSelect(menuItems[selectedIndex].mode);
      } else {
        const numKey = parseInt(event.key);
        if (numKey >= 1 && numKey <= menuItems.length) {
          const targetIndex = numKey - 1;
          onSelectedIndexChange(targetIndex);
          onPlaySFX("menu_select");
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

  const handleMenuItemClick = useCallback(
    (mode: GameMode, index: number) => {
      onSelectedIndexChange(index);
      onPlaySFX("menu_select");
      onModeSelect(mode);
    },
    [onSelectedIndexChange, onPlaySFX, onModeSelect]
  );

  const handleMenuItemHover = useCallback(
    (index: number) => {
      setHoveredItem(index);
      if (index !== selectedIndex) {
        onSelectedIndexChange(index);
        onPlaySFX("menu_hover");
      }
    },
    [selectedIndex, onSelectedIndexChange, onPlaySFX]
  );

  // Accessibility: focus ring on tab
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

  // Responsive sizing
  const isMobile = width < 480;
  const buttonHeight = isMobile ? 44 : 54;
  const buttonFontSize = isMobile ? 15 : 18;
  const menuPanelRadius = isMobile ? 8 : 12;

  return (
    <pixiContainer
      x={x}
      y={y}
      data-testid="menu-section"
      layout={{
        width,
        height,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 12,
        padding: 24,
      }}
    >
      {/* Panel Background */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          // Main background
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.97 });
          g.roundRect(0, 0, width, height, menuPanelRadius);
          g.fill();

          // Outer border
          g.stroke({
            width: 3,
            color: KOREAN_COLORS.PRIMARY_CYAN,
            alpha: 0.7,
          });
          g.roundRect(0, 0, width, height, menuPanelRadius);
          g.stroke();

          // Inner accent border
          g.stroke({
            width: 1,
            color: KOREAN_COLORS.ACCENT_GOLD,
            alpha: 0.5,
          });
          g.roundRect(6, 6, width - 12, height - 12, menuPanelRadius - 4);
          g.stroke();

          // Focus ring
          if (focused) {
            g.stroke({
              width: 2,
              color: FOCUS_RING_COLOR,
              alpha: 0.7,
            });
            g.roundRect(-3, -3, width + 6, height + 6, menuPanelRadius + 2);
            g.stroke();
          }
        }}
        data-testid="menu-panel-background"
        layout={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Title */}
      <pixiContainer
        layout={{
          width: "100%",
          height: 48,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginBottom: 8,
        }}
      >
        <KoreanText
          text={{ korean: "메인 메뉴", english: "Main Menu" }}
          style={{
            fontSize: isMobile ? 18 : 22,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            align: "center",
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
          }}
          x={0}
          y={-8}
          anchor={0.5}
          data-testid="menu-title"
        />
        <pixiText
          text="Select your path in the Black Trigram"
          style={{
            fontSize: isMobile ? 10 : 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
            fontStyle: "italic",
            fontFamily: FONT_FAMILY.PRIMARY,
          }}
          x={0}
          y={14}
          anchor={0.5}
          data-testid="menu-subtitle"
        />
      </pixiContainer>

      {/* Menu Items */}
      <pixiContainer
        data-testid="main-menu-buttons"
        layout={{
          width: "100%",
          flexGrow: 1,
          flexDirection: "column",
          gap: 14,
          paddingLeft: 18,
          paddingRight: 18,
          justifyContent: "center",
        }}
      >
        {menuItems.map((item, index) => {
          const isSelected = selectedIndex === index;
          const isHovered = hoveredItem === index;
          const buttonWidth = width - 36;

          return (
            <pixiContainer
              key={item.mode}
              data-testid={`menu-item-${item.mode}`}
              layout={{
                width: "100%",
                height: buttonHeight,
                flexShrink: 0,
              }}
            >
              {/* Button Background */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();
                  // Button background
                  g.fill({
                    color: isSelected
                      ? KOREAN_COLORS.ACCENT_GOLD
                      : isHovered
                      ? KOREAN_COLORS.UI_BACKGROUND_LIGHT
                      : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                    alpha: isSelected ? 0.96 : 0.92,
                  });
                  g.roundRect(0, 0, buttonWidth, buttonHeight, 7);
                  g.fill();

                  // Border
                  g.stroke({
                    width: 2,
                    color: isSelected
                      ? KOREAN_COLORS.UI_BACKGROUND_DARK
                      : isHovered
                      ? KOREAN_COLORS.ACCENT_GOLD
                      : KOREAN_COLORS.PRIMARY_CYAN,
                    alpha: isSelected ? 1.0 : 0.7,
                  });
                  g.roundRect(0, 0, buttonWidth, buttonHeight, 7);
                  g.stroke();

                  // Selection indicator bar
                  if (isSelected) {
                    g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 1 });
                    g.roundRect(0, 0, 6, buttonHeight, 7);
                    g.fill();
                  }

                  // Subtle glow for selected
                  if (isSelected) {
                    g.stroke({
                      width: 1,
                      color: KOREAN_COLORS.ACCENT_CYAN,
                      alpha: 0.7,
                    });
                    g.roundRect(2, 2, buttonWidth - 4, buttonHeight - 4, 5);
                    g.stroke();
                  }
                }}
                interactive={true}
                onPointerDown={() => handleMenuItemClick(item.mode, index)}
                onPointerOver={() => handleMenuItemHover(index)}
                onPointerOut={() => setHoveredItem(null)}
                layout={{
                  width: "100%",
                  height: "100%",
                }}
              />

              {/* Button Content */}
              <pixiContainer
                layout={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: isSelected ? 18 : 14,
                  paddingRight: 14,
                }}
              >
                <KoreanText
                  text={{
                    korean: item.korean,
                    english: item.english,
                  }}
                  style={{
                    fontSize: buttonFontSize,
                    fill: isSelected
                      ? KOREAN_COLORS.UI_BACKGROUND_DARK
                      : KOREAN_COLORS.TEXT_PRIMARY,
                    align: "center",
                    fontFamily: FONT_FAMILY.KOREAN,
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                  x={0}
                  y={0}
                  anchor={0.5}
                />
                <pixiText
                  text={(index + 1).toString()}
                  style={{
                    fontSize: isMobile ? 11 : 14,
                    fill: isSelected
                      ? KOREAN_COLORS.UI_BACKGROUND_DARK
                      : KOREAN_COLORS.TEXT_SECONDARY,
                    align: "right",
                    fontWeight: "bold",
                    fontFamily: FONT_FAMILY.PRIMARY,
                  }}
                  x={buttonWidth / 2 - 18}
                  y={0}
                  anchor={{ x: 1, y: 0.5 }}
                />
              </pixiContainer>
            </pixiContainer>
          );
        })}
      </pixiContainer>

      {/* Navigation Hint */}
      <pixiContainer
        layout={{
          width: "100%",
          height: 36,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 10,
        }}
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.6 });
            g.roundRect(0, 0, width - 36, 36, 5);
            g.fill();
            g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.3 });
            g.roundRect(0, 0, width - 36, 36, 5);
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
            korean: "방향키/마우스 이동 • Enter/클릭 선택 • 숫자키 바로가기",
            english: "Arrow keys/mouse to navigate • Enter/click to select • Number keys for shortcuts",
          }}
          style={{
            fontSize: isMobile ? 9 : 11,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
            fontStyle: "italic",
            fontFamily: FONT_FAMILY.KOREAN,
          }}
          x={0}
          y={0}
          anchor={0.5}
          data-testid="menu-navigation-hint"
        />
      </pixiContainer>
    </pixiContainer>
  );
};

export default MenuSection;
