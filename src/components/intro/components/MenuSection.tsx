import React, { useCallback, useEffect, useState } from "react";
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
  // Track hover state for menu items
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Menu navigation with arrow keys
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
        // Numeric shortcuts
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
        gap: 24,
        padding: 20,
      }}
      data-testid="menu-section"
    >
      {/* Background Panel with enhanced styling */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          // Background fill with semi-transparency
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.92 });
          g.roundRect(0, 0, width, height, 8);
          g.fill();

          // Primary border
          g.stroke({
            width: 2,
            color: KOREAN_COLORS.PRIMARY_CYAN,
            alpha: 0.7,
          });
          g.roundRect(0, 0, width, height, 8);
          g.stroke();

          // Secondary accent border
          g.stroke({
            width: 1,
            color: KOREAN_COLORS.ACCENT_GOLD,
            alpha: 0.4,
          });
          g.roundRect(4, 4, width - 8, height - 8, 6);
          g.stroke();
        }}
        data-testid="menu-panel-background"
      />

      {/* Menu Title with KoreanText for proper bilingual support */}
      <KoreanText
        text={{ korean: "메인 메뉴", english: "Main Menu" }}
        style={{
          fontSize: 18,
          fill: KOREAN_COLORS.ACCENT_GOLD,
          align: "center",
          fontWeight: "bold",
          fontFamily: FONT_FAMILY.KOREAN,
        }}
        x={width / 2}
        y={20}
        anchor={0.5}
        data-testid="menu-title"
      />

      {/* Menu Items Container with proper layout */}
      <pixiContainer
        x={20}
        y={50}
        layout={{
          width: width - 40,
          flexDirection: "column",
          gap: 16,
        }}
        data-testid="main-menu-buttons"
      >
        {menuItems.map((item, index) => {
          const isSelected = selectedIndex === index;
          const isHovered = hoveredItem === index;

          return (
            <pixiContainer
              key={item.mode}
              y={index * 60}
              layout={{
                width: width - 40,
                height: 50,
                marginBottom: 12,
              }}
              data-testid={`menu-item-${item.mode}`}
            >
              {/* Menu Item Background */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();

                  // Fill with appropriate color based on state
                  g.fill({
                    color: isSelected
                      ? KOREAN_COLORS.ACCENT_GOLD
                      : isHovered
                      ? KOREAN_COLORS.UI_BACKGROUND_LIGHT
                      : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                    alpha: isSelected ? 0.9 : 0.8,
                  });
                  g.roundRect(0, 0, width - 40, 50, 5);
                  g.fill();

                  // Add border for visual enhancement
                  g.stroke({
                    width: 1,
                    color: isSelected
                      ? KOREAN_COLORS.ACCENT_ORANGE
                      : isHovered
                      ? KOREAN_COLORS.ACCENT_GOLD
                      : KOREAN_COLORS.PRIMARY_CYAN,
                    alpha: isSelected ? 0.9 : 0.6,
                  });
                  g.roundRect(0, 0, width - 40, 50, 5);
                  g.stroke();

                  // Add highlight indicator for selected item
                  if (isSelected) {
                    g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.9 });
                    g.roundRect(0, 0, 4, 50, 2);
                    g.fill();
                  }
                }}
                interactive={true}
                onPointerDown={() => handleMenuItemClick(item.mode, index)}
                onPointerOver={() => handleMenuItemHover(index)}
                onPointerOut={() => setHoveredItem(null)}
              />

              {/* Menu Item Text with proper KoreanText integration */}
              <KoreanText
                text={{
                  korean: item.korean,
                  english: item.english,
                }}
                style={{
                  fontSize: 16,
                  fill: isSelected
                    ? KOREAN_COLORS.UI_BACKGROUND_DARK
                    : KOREAN_COLORS.TEXT_PRIMARY,
                  align: "center",
                  fontFamily: FONT_FAMILY.KOREAN,
                  fontWeight: isSelected ? "bold" : "normal",
                }}
                x={(width - 40) / 2}
                y={25}
                anchor={0.5}
              />
            </pixiContainer>
          );
        })}
      </pixiContainer>

      {/* Keyboard navigation hint with proper Korean text */}
      <KoreanText
        text={{
          korean: "방향키로 메뉴 이동, Enter 키로 선택",
          english: "Use arrow keys to navigate, Enter to select",
        }}
        style={{
          fontSize: 12,
          fill: KOREAN_COLORS.TEXT_SECONDARY,
          align: "center",
          fontStyle: "italic",
          fontFamily: FONT_FAMILY.KOREAN,
        }}
        x={width / 2}
        y={height - 20}
        anchor={0.5}
        data-testid="menu-navigation-hint"
      />
    </pixiContainer>
  );
};

export default MenuSection;
