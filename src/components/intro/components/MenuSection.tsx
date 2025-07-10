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
      {/* Enhanced Background Panel */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          
          // Main background with enhanced styling
          g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 0.95 });
          g.roundRect(0, 0, width, height, 12);
          g.fill();

          // Primary border with glow effect
          g.stroke({
            width: 3,
            color: KOREAN_COLORS.PRIMARY_CYAN,
            alpha: 0.8,
          });
          g.roundRect(0, 0, width, height, 12);
          g.stroke();

          // Inner accent border
          g.stroke({
            width: 1,
            color: KOREAN_COLORS.ACCENT_GOLD,
            alpha: 0.6,
          });
          g.roundRect(6, 6, width - 12, height - 12, 8);
          g.stroke();

          // Subtle corner accents
          const cornerSize = 20;
          g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.3 });
          // Top-left corner
          g.moveTo(12, 12);
          g.lineTo(12 + cornerSize, 12);
          g.lineTo(12, 12 + cornerSize);
          g.closePath();
          g.fill();
          // Top-right corner
          g.moveTo(width - 12, 12);
          g.lineTo(width - 12 - cornerSize, 12);
          g.lineTo(width - 12, 12 + cornerSize);
          g.closePath();
          g.fill();
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

      {/* Menu Title Section */}
      <pixiContainer
        layout={{
          width: "100%",
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginBottom: 8,
        }}
      >
        <KoreanText
          text={{ korean: "메인 메뉴", english: "Main Menu" }}
          style={{
            fontSize: 22,
            fill: KOREAN_COLORS.ACCENT_GOLD,
            align: "center",
            fontWeight: "bold",
            fontFamily: FONT_FAMILY.KOREAN,
          }}
          x={0}
          y={-10}
          anchor={0.5}
          data-testid="menu-title"
        />
        
        {/* Subtitle for better context */}
        <pixiText
          text="Select your path in the Black Trigram"
          style={{
            fontSize: 12,
            fill: KOREAN_COLORS.TEXT_SECONDARY,
            align: "center",
            fontStyle: "italic",
            fontFamily: FONT_FAMILY.PRIMARY,
          }}
          x={0}
          y={12}
          anchor={0.5}
          data-testid="menu-subtitle"
        />
      </pixiContainer>

      {/* Menu Items Container - Full width buttons */}
      <pixiContainer
        data-testid="main-menu-buttons"
        layout={{
          width: "100%",
          flexGrow: 1,
          flexDirection: "column",
          gap: 16,
          paddingLeft: 24,
          paddingRight: 24,
          justifyContent: "center",
        }}
      >
        {menuItems.map((item, index) => {
          const isSelected = selectedIndex === index;
          const isHovered = hoveredItem === index;
          const buttonWidth = width - 48; // Full width minus padding

          return (
            <pixiContainer
              key={item.mode}
              data-testid={`menu-item-${item.mode}`}
              layout={{
                width: "100%",
                height: 60, // Increased height for better visual impact
                flexShrink: 0,
              }}
            >
              {/* Enhanced Menu Item Background */}
              <pixiGraphics
                draw={(g) => {
                  g.clear();

                  // Main button background
                  if (isSelected) {
                    // Selected state - solid color with enhanced visual
                    g.fill({ color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.9 });
                  } else {
                    // Normal/hover state
                    g.fill({
                      color: isHovered
                        ? KOREAN_COLORS.UI_BACKGROUND_LIGHT
                        : KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
                      alpha: 0.9,
                    });
                  }
                  g.roundRect(0, 0, buttonWidth, 60, 8);
                  g.fill();

                  // Enhanced border
                  g.stroke({
                    width: 2,
                    color: isSelected
                      ? KOREAN_COLORS.UI_BACKGROUND_DARK
                      : isHovered
                      ? KOREAN_COLORS.ACCENT_GOLD
                      : KOREAN_COLORS.PRIMARY_CYAN,
                    alpha: isSelected ? 1.0 : 0.7,
                  });
                  g.roundRect(0, 0, buttonWidth, 60, 8);
                  g.stroke();

                  // Selection indicator bar (left side) - using separate roundRect calls
                  if (isSelected) {
                    g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 1.0 });
                    // Create left-rounded rectangle manually
                    g.roundRect(0, 0, 6, 60, 8);
                    g.fill();
                    // Cover the right side to make it square
                    g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_DARK, alpha: 1.0 });
                    g.rect(2, 0, 4, 60);
                    g.fill();
                  }

                  // Subtle inner glow for selected
                  if (isSelected) {
                    g.stroke({
                      width: 1,
                      color: KOREAN_COLORS.ACCENT_CYAN,
                      alpha: 0.8,
                    });
                    g.roundRect(2, 2, buttonWidth - 4, 56, 6);
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

              {/* Menu Item Text - Properly centered */}
              <pixiContainer
                layout={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: isSelected ? 20 : 16, // Account for selection indicator
                  paddingRight: 16,
                }}
              >
                <KoreanText
                  text={{
                    korean: item.korean,
                    english: item.english,
                  }}
                  style={{
                    fontSize: 18,
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

                {/* Menu item number indicator */}
                <pixiText
                  text={(index + 1).toString()}
                  style={{
                    fontSize: 14,
                    fill: isSelected
                      ? KOREAN_COLORS.UI_BACKGROUND_DARK
                      : KOREAN_COLORS.TEXT_SECONDARY,
                    align: "right",
                    fontWeight: "bold",
                    fontFamily: FONT_FAMILY.PRIMARY,
                  }}
                  x={buttonWidth / 2 - 20}
                  y={0}
                  anchor={{ x: 1, y: 0.5 }}
                />
              </pixiContainer>
            </pixiContainer>
          );
        })}
      </pixiContainer>

      {/* Enhanced Navigation Hint */}
      <pixiContainer
        layout={{
          width: "100%",
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 12,
        }}
      >
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.fill({ color: KOREAN_COLORS.UI_BACKGROUND_MEDIUM, alpha: 0.6 });
            g.roundRect(0, 0, width - 48, 40, 6);
            g.fill();
            g.stroke({ width: 1, color: KOREAN_COLORS.ACCENT_GOLD, alpha: 0.4 });
            g.roundRect(0, 0, width - 48, 40, 6);
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
            korean: "방향키/마우스로 이동 • Enter/클릭으로 선택 • 숫자키로 바로가기",
            english: "Arrow keys/mouse to navigate • Enter/click to select • Number keys for shortcuts",
          }}
          style={{
            fontSize: 11,
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
