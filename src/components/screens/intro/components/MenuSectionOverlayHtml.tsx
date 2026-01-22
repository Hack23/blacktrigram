import React, { useEffect, useMemo, useState } from "react";
import { GameMode } from "../../../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import {
  getEnhancedKoreanOverlayStyles,
} from "../../../../utils/koreanThemeHelpers";
import { getMobileKoreanFontSize } from "../../../../utils/mobileUIUtils";
import { getSafeAreaPadding } from "../../../../utils/safeAreaUtils";
import {
  getNeonTextShadow,
} from "../../../../utils/visualEffects";
import { MenuButtons } from "./MenuButtons";
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
  readonly isMobile?: boolean; // For controls/haptics only, use width for layout sizing
}

/**
 * HTML-based MenuSection component for Three.js integration
 *
 * Optimized with React.memo for 60fps performance:
 * - Memoized to prevent unnecessary re-renders
 * - All callbacks use useCallback
 * - Styles pre-calculated and memoized
 */
export const MenuSectionOverlayHtml = React.memo<MenuSectionOverlayHtmlProps>(
  ({
    menuItems,
    selectedIndex,
    onModeSelect,
    onSelectedIndexChange,
    onPlaySFX,
    width = 800,
    height = 300,
    isMobile = false, // Default to false, parent should pass proper device detection
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
    [focused],
  );

  // Memoize title color
  const titleColor = useMemo(
    () => `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
    [],
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

  // Use device detection from prop, with width-based fallback for sizing adjustments
  const isSmallScreen = width < 768; // Mobile-sized screens

  const containerPadding = isSmallScreen ? 16 : 12;
  const titleFontSize = isSmallScreen
    ? getMobileKoreanFontSize("SMALL", width ?? 375)
    : 14;
  const sectionGap = isSmallScreen ? 8 : 6;

  // Safe area support for notched devices (use isMobile for actual device detection)
  const safeAreaStyles = useMemo(
    () =>
      isMobile ? getSafeAreaPadding(["top", "bottom"], containerPadding) : {},
    [isMobile, containerPadding],
  );

  return (
    <div
      style={{
        ...enhancedOverlayStyles,
        ...safeAreaStyles,
        width: `${width}px`,
        minHeight: `${height}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: `${sectionGap}px`,
        padding: `${containerPadding}px`,
        position: "relative",
        overflow: "visible",
      }}
      data-testid="main-menu-section"
    >
      {/* Menu Title */}
      <div
        style={{
          fontSize: `${titleFontSize}px`,
          color: titleColor,
          fontWeight: "bold",
          fontFamily: FONT_FAMILY.KOREAN,
          textAlign: "center",
          textShadow: getNeonTextShadow(KOREAN_COLORS.ACCENT_GOLD, "medium"),
        }}
        data-testid="menu-title"
      >
        메인 메뉴 | Main Menu
      </div>

      {/* Menu Buttons - Extracted to MenuButtons component */}
      <MenuButtons
        menuItems={menuItems}
        selectedIndex={selectedIndex}
        hoveredIndex={hoveredItem}
        onModeSelect={onModeSelect}
        onHoverChange={setHoveredItem}
        onPlaySFX={onPlaySFX}
        width={width}
        isMobile={isMobile}
      />

      {/* Navigation Instructions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isSmallScreen ? "4px" : "6px",
          textAlign: "center",
          fontSize: isSmallScreen ? "10px" : "12px",
          color: `#${KOREAN_COLORS.TEXT_SECONDARY.toString(16).padStart(
            6,
            "0",
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
          style={{ fontSize: isSmallScreen ? "9px" : "10px" }}
          data-testid="menu-navigation-hint-english"
        >
          Arrow keys/mouse to navigate • Enter/click to select • Number keys for
          shortcuts
        </div>
      </div>
    </div>
  );
  },
  (prevProps, nextProps) => {
    // Custom comparison for optimal re-render prevention
    // Including callback props prevents stale closures when parent provides
    // new functions that capture updated state.
    return (
      prevProps.selectedIndex === nextProps.selectedIndex &&
      prevProps.width === nextProps.width &&
      prevProps.height === nextProps.height &&
      prevProps.isMobile === nextProps.isMobile &&
      prevProps.menuItems.length === nextProps.menuItems.length &&
      prevProps.onModeSelect === nextProps.onModeSelect &&
      prevProps.onSelectedIndexChange === nextProps.onSelectedIndexChange &&
      prevProps.onPlaySFX === nextProps.onPlaySFX
    );
  },
);

MenuSectionOverlayHtml.displayName = "MenuSectionOverlayHtml";

export default MenuSectionOverlayHtml;
