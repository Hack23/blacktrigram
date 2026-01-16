import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GameMode } from "../../../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import {
  getEnhancedKoreanOverlayStyles,
  getButtonVisualEffectsOnly,
} from "../../../../utils/koreanThemeHelpers";
import {
  getNeonTextShadow,
} from "../../../../utils/visualEffects";
import "./MenuSection.css";

export interface MenuSectionOverlayHtmlProps {
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
 */
export const MenuSectionOverlayHtml: React.FC<MenuSectionOverlayHtmlProps> = ({
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

  // Enhanced overlay styles with neon glow and depth
  const enhancedOverlayStyles = useMemo(
    () =>
      getEnhancedKoreanOverlayStyles({
        opacity: 0.96,
        glowIntensity: focused ? "medium" : "subtle",
        includeGradient: false,
        includeBackdropBlur: false,
        depthLayers: 2,
      }),
    [focused]
  );

  // Memoize RGBA color calculations to avoid repeated bit-shift operations
  const colors = useMemo(
    () => ({
      titleColor: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
      // Button state colors
      buttonSelectedBg: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.98),
      buttonHoveredBg: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_LIGHT, 0.92),
      buttonDefaultBg: hexToRgbaString(
        KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
        0.92
      ),
      buttonSelectedBorder: hexToRgbaString(
        KOREAN_COLORS.UI_BACKGROUND_DARK,
        1.0
      ),
      buttonHoveredBorder: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.8),
      buttonDefaultBorder: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.7),
    }),
    []
  );

  // Keyboard navigation - stops propagation to prevent conflicts with parent
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!onSelectedIndexChange) return;

      if (event.key === "ArrowUp") {
        event.preventDefault();
        event.stopPropagation();
        const nextIndex =
          selectedIndex === 0 ? menuItems.length - 1 : selectedIndex - 1;
        onSelectedIndexChange(nextIndex);
        onPlaySFX?.("menu_hover");
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        event.stopPropagation();
        const nextIndex =
          selectedIndex === menuItems.length - 1 ? 0 : selectedIndex + 1;
        onSelectedIndexChange(nextIndex);
        onPlaySFX?.("menu_hover");
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        onPlaySFX?.("menu_select");
        onModeSelect(menuItems[selectedIndex].mode);
      } else {
        const numKey = parseInt(event.key);
        if (numKey >= 1 && numKey <= menuItems.length) {
          event.stopPropagation();
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
  const isLargeDesktop = width >= 1100; // Scale down for large containers

  const buttonHeight = isMobile ? 45 : isLargeDesktop ? 38 : 55;
  const buttonFontSize = isMobile ? 14 : isLargeDesktop ? 12 : 16;
  const containerPadding = isMobile ? 20 : isLargeDesktop ? 12 : 32;
  const titleFontSize = isMobile ? 20 : isLargeDesktop ? 18 : 28;
  const buttonGap = isMobile ? 8 : isLargeDesktop ? 4 : 12;
  const sectionGap = isMobile ? 12 : isLargeDesktop ? 8 : 20;

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
        ...enhancedOverlayStyles,
        width: `${width}px`,
        height: `${height}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: `${sectionGap}px`,
        padding: `${containerPadding}px`,
        position: "relative",
        overflow: "hidden",
      }}
      data-testid="main-menu-section"
    >
      {/* Menu Title */}
      <div
        style={{
          fontSize: `${titleFontSize}px`,
          color: colors.titleColor,
          fontWeight: "bold",
          fontFamily: FONT_FAMILY.KOREAN,
          textAlign: "center",
          textShadow: getNeonTextShadow(KOREAN_COLORS.ACCENT_GOLD, "medium"),
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
          gap: `${buttonGap}px`,
          width: "100%",
        }}
        data-testid="main-menu-buttons"
      >
        {menuItems.map((item, index) => {
          const isSelected = selectedIndex === index;
          const isHovered = hoveredItem === index;

          // Get only visual effects (glow, transitions, transforms) from utility
          // Color/background/border are menu-specific and applied directly below
          // Using dedicated helper function to avoid fragile destructuring coupling
          // Note: Glow intensity is balanced with background colors to maintain contrast:
          // - Selected: medium glow + bright gold background = balanced
          // - Hovered: medium glow + translucent background = clear feedback
          // - Default: subtle glow + dark background = clean appearance
          const visualEffects = getButtonVisualEffectsOnly({
            variant: "primary",
            isHovered,
            isPressed: false,
            isFocused: false,
            glowIntensity: isSelected ? "medium" : isHovered ? "medium" : "subtle",
            hoverAnimation: "combined",
          });

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
                ...visualEffects,
                width: "100%",
                height: `${buttonHeight}px`,
                fontSize: `${buttonFontSize}px`,
                letterSpacing: "1.2px",
                // Menu-specific color, background, and border (not overrides)
                color: isSelected
                  ? `#${KOREAN_COLORS.UI_BACKGROUND_DARK.toString(16).padStart(
                      6,
                      "0"
                    )}`
                  : isHovered
                  ? `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(
                      6,
                      "0"
                    )}`
                  : `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(
                      6,
                      "0"
                    )}`,
                background: isSelected
                  ? colors.buttonSelectedBg
                  : isHovered
                  ? colors.buttonHoveredBg
                  : colors.buttonDefaultBg,
                border: isSelected
                  ? `3px solid ${colors.buttonSelectedBorder}`
                  : isHovered
                  ? `2px solid ${colors.buttonHoveredBorder}`
                  : `2px solid ${colors.buttonDefaultBorder}`,
                cursor: "pointer",
              }}
              data-testid={`menu-item-${item.mode}`}
            >
              {/* Add test ID aliases for backward compatibility */}
              {item.mode === GameMode.TRAINING && (
                <span
                  data-testid="training-button"
                  style={{ display: "none" }}
                />
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
          color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(
            6,
            "0"
          )}`,
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
          Arrow keys/mouse to navigate • Enter/click to select • Number keys for
          shortcuts
        </div>
      </div>
    </div>
  );
};

export default MenuSectionOverlayHtml;
