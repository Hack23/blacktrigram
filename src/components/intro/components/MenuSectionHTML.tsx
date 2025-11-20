import React, { useCallback, useEffect, useState } from "react";
import { GameMode } from "../../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../types/constants";
import "./MenuSection.css";

export interface MenuSectionHTMLProps {
  readonly menuItems: Array<{
    mode: GameMode;
    korean: string;
    english: string;
  }>;
  readonly selectedIndex: number;
  readonly onModeSelect: (mode: GameMode) => void;
  readonly onSelectedIndexChange?: (index: number) => void;
  readonly onPlaySFX?: (sound: string) => void;
  readonly width?: number;
  readonly height?: number;
}

/**
 * HTML-based MenuSection component for Three.js integration
 * Migrated from PixiJS to work with @react-three/drei Html component
 */
export const MenuSectionHTML: React.FC<MenuSectionHTMLProps> = ({
  menuItems,
  selectedIndex,
  onModeSelect,
  onSelectedIndexChange,
  onPlaySFX,
  width = 800,
  height = 300,
}) => {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [focused, setFocused] = useState<boolean>(false);

  // Keyboard navigation
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
  const buttonHeight = isMobile ? 45 : 55;
  const buttonFontSize = isMobile ? 14 : 16;

  const handleButtonClick = useCallback(
    (mode: GameMode) => {
      onModeSelect(mode);
      onPlaySFX?.("menu_select");
    },
    [onModeSelect, onPlaySFX]
  );

  const handleButtonHover = useCallback(
    (index: number, isHovering: boolean) => {
      setHoveredItem(isHovering ? index : null);
      if (isHovering) {
        onPlaySFX?.("menu_hover");
      }
    },
    [onPlaySFX]
  );

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: isMobile ? "12px" : "20px",
        padding: isMobile ? "20px" : "32px",
        background: `rgba(${(KOREAN_COLORS.UI_BACKGROUND_DARK >> 16) & 255}, ${(KOREAN_COLORS.UI_BACKGROUND_DARK >> 8) & 255}, ${KOREAN_COLORS.UI_BACKGROUND_DARK & 255}, 0.96)`,
        borderRadius: isMobile ? "6px" : "8px",
        border: `3px solid rgba(${(KOREAN_COLORS.PRIMARY_CYAN >> 16) & 255}, ${(KOREAN_COLORS.PRIMARY_CYAN >> 8) & 255}, ${KOREAN_COLORS.PRIMARY_CYAN & 255}, 0.8)`,
        boxShadow: focused
          ? `0 0 20px rgba(${(KOREAN_COLORS.ACCENT_CYAN >> 16) & 255}, ${(KOREAN_COLORS.ACCENT_CYAN >> 8) & 255}, ${KOREAN_COLORS.ACCENT_CYAN & 255}, 0.8)`
          : "none",
        position: "relative",
      }}
      data-testid="main-menu-section"
    >
      {/* Menu Title */}
      <div
        style={{
          fontSize: isMobile ? "20px" : "28px",
          color: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
          fontWeight: "bold",
          fontFamily: FONT_FAMILY.KOREAN,
          textAlign: "center",
          textShadow: `0 2px 8px rgba(${(KOREAN_COLORS.ACCENT_GOLD >> 16) & 255}, ${(KOREAN_COLORS.ACCENT_GOLD >> 8) & 255}, ${KOREAN_COLORS.ACCENT_GOLD & 255}, 0.7)`,
        }}
        data-testid="menu-title"
      >
        메인 메뉴 | Main Menu
      </div>

      {/* Menu Items */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "8px" : "12px",
          width: "100%",
        }}
        data-testid="main-menu-buttons"
      >
        {menuItems.map((item, index) => {
          const isSelected = selectedIndex === index;
          const isHovered = hoveredItem === index;

          return (
            <button
              key={item.mode}
              onClick={() => handleButtonClick(item.mode)}
              onMouseEnter={() => handleButtonHover(index, true)}
              onMouseLeave={() => handleButtonHover(index, false)}
              aria-label={`${item.korean} (${item.english})`}
              aria-selected={isSelected}
              role="menuitem"
              className="menu-button"
              style={{
                width: "100%",
                height: `${buttonHeight}px`,
                fontSize: `${buttonFontSize}px`,
                fontFamily: FONT_FAMILY.KOREAN,
                fontWeight: isSelected ? "bold" : "normal",
                letterSpacing: "1.2px",
                color: isSelected
                  ? `#${KOREAN_COLORS.UI_BACKGROUND_DARK.toString(16).padStart(6, "0")}`
                  : isHovered
                  ? `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`
                  : `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}`,
                background: isSelected
                  ? `rgba(${(KOREAN_COLORS.ACCENT_GOLD >> 16) & 255}, ${(KOREAN_COLORS.ACCENT_GOLD >> 8) & 255}, ${KOREAN_COLORS.ACCENT_GOLD & 255}, 0.98)`
                  : isHovered
                  ? `rgba(${(KOREAN_COLORS.UI_BACKGROUND_LIGHT >> 16) & 255}, ${(KOREAN_COLORS.UI_BACKGROUND_LIGHT >> 8) & 255}, ${KOREAN_COLORS.UI_BACKGROUND_LIGHT & 255}, 0.92)`
                  : `rgba(${(KOREAN_COLORS.UI_BACKGROUND_MEDIUM >> 16) & 255}, ${(KOREAN_COLORS.UI_BACKGROUND_MEDIUM >> 8) & 255}, ${KOREAN_COLORS.UI_BACKGROUND_MEDIUM & 255}, 0.92)`,
                border: isSelected
                  ? `3px solid rgba(${(KOREAN_COLORS.UI_BACKGROUND_DARK >> 16) & 255}, ${(KOREAN_COLORS.UI_BACKGROUND_DARK >> 8) & 255}, ${KOREAN_COLORS.UI_BACKGROUND_DARK & 255}, 1.0)`
                  : isHovered
                  ? `2px solid rgba(${(KOREAN_COLORS.ACCENT_GOLD >> 16) & 255}, ${(KOREAN_COLORS.ACCENT_GOLD >> 8) & 255}, ${KOREAN_COLORS.ACCENT_GOLD & 255}, 0.8)`
                  : `2px solid rgba(${(KOREAN_COLORS.PRIMARY_CYAN >> 16) & 255}, ${(KOREAN_COLORS.PRIMARY_CYAN >> 8) & 255}, ${KOREAN_COLORS.PRIMARY_CYAN & 255}, 0.7)`,
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textShadow: isSelected
                  ? `0 2px 4px rgba(${(KOREAN_COLORS.ACCENT_GOLD >> 16) & 255}, ${(KOREAN_COLORS.ACCENT_GOLD >> 8) & 255}, ${KOREAN_COLORS.ACCENT_GOLD & 255}, 0.7)`
                  : "none",
              }}
              data-testid={`menu-item-${item.mode}`}
            >
              {/* Add test ID aliases for backward compatibility */}
              {item.mode === GameMode.TRAINING && (
                <span data-testid="training-button" style={{ display: "none" }} />
              )}
              {item.mode === GameMode.VERSUS && (
                <span data-testid="combat-button" style={{ display: "none" }} />
              )}
              {item.korean} ({item.english})
            </button>
          );
        })}
      </div>

      {/* Navigation Instructions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "4px" : "6px",
          textAlign: "center",
          fontSize: isMobile ? "10px" : "12px",
          color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(6, "0")}`,
          fontFamily: FONT_FAMILY.KOREAN,
          marginTop: "auto",
        }}
        data-testid="navigation-hint-container"
      >
        <div data-testid="menu-navigation-hint-korean">
          방향키/마우스로 이동 • Enter/클릭으로 선택 • 숫자키로 바로가기
        </div>
        <div
          style={{ fontSize: isMobile ? "9px" : "10px" }}
          data-testid="menu-navigation-hint-english"
        >
          Arrow keys/mouse to navigate • Enter/click to select • Number keys for shortcuts
        </div>
      </div>
    </div>
  );
};

export default MenuSectionHTML;
