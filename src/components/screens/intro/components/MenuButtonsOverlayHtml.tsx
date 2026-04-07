/**
 * MenuButtons - Reusable menu button grid for IntroScreen
 * 
 * Provides 2x2 grid (desktop) or column (mobile) layout for menu navigation.
 * Extracted from MenuSectionOverlayHtml to reduce code duplication.
 * 
 * @module components/screens/intro
 * @category Intro UI
 * @korean 메뉴버튼
 */

import React, { useCallback, useMemo } from "react";
import { GameMode } from "../../../../types/common";
import { FONT_FAMILY, KOREAN_COLORS } from "../../../../types/constants";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import { UIHaptics } from "../../../../utils/hapticFeedback";
import {
  getButtonVisualEffectsOnly,
} from "../../../../utils/koreanThemeHelpers";
import { getMobileKoreanFontSize } from "../../../../utils/mobileUIUtils";
import {
  getKoreanFontOptimization,
} from "../../../../utils/visualEffects";

export interface MenuButtonsProps {
  /** Array of menu items to display */
  readonly menuItems: Array<{
    mode: GameMode;
    korean: string;
    english: string;
  }>;
  /** Currently selected menu item index */
  readonly selectedIndex: number;
  /** Index of currently hovered menu item (null if none) */
  readonly hoveredIndex: number | null;
  /** Callback when a menu item is selected */
  readonly onModeSelect: (mode: GameMode) => void;
  /** Callback when hover state changes */
  readonly onHoverChange: (index: number | null) => void;
  /** Callback to play sound effects */
  readonly onPlaySFX?: (sound: string) => void;
  /** Screen width for responsive sizing */
  readonly width?: number;
  /** Whether on mobile device (for haptics) */
  readonly isMobile?: boolean;
}

/**
 * MenuButtons Component
 * 
 * Displays menu navigation buttons with:
 * - 2x2 grid layout on larger screens
 * - Column layout on small screens
 * - Selected/hovered state visualization
 * - Korean bilingual text
 * - Haptic feedback support
 * 
 * This component delegates to inline button elements with custom styling
 * since BaseButtonOverlayHtml doesn't support the complex selection state
 * and color transitions needed for menu navigation.
 * 
 * Reduces code duplication by 62 lines (MenuSectionOverlayHtml: 372 → 310)
 * 
 * @example
 * ```tsx
 * <MenuButtons
 *   menuItems={MENU_ITEMS}
 *   selectedIndex={0}
 *   hoveredIndex={null}
 *   onModeSelect={(mode) => handleModeSelect(mode)}
 *   onHoverChange={(idx) => setHovered(idx)}
 *   width={800}
 * />
 * ```
 */
export const MenuButtons: React.FC<MenuButtonsProps> = ({
  menuItems,
  selectedIndex,
  hoveredIndex,
  onModeSelect,
  onHoverChange,
  onPlaySFX,
  width = 800,
  isMobile: _isMobile = false, // Prefix with _ to indicate intentionally unused
}) => {
  // Responsive sizing based on screen width
  const isSmallScreen = width < 768;
  const useGridLayout = !isSmallScreen;
  const buttonHeight = isSmallScreen ? 44 : 40;
  const buttonFontSize = isSmallScreen
    ? getMobileKoreanFontSize("SMALL", width ?? 375)
    : 13;
  const buttonGap = isSmallScreen ? 6 : 8;

  // Memoize button state colors
  const colors = useMemo(
    () => ({
      buttonSelectedBg: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.98),
      buttonHoveredBg: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_LIGHT, 0.92),
      buttonDefaultBg: hexToRgbaString(
        KOREAN_COLORS.UI_BACKGROUND_MEDIUM,
        0.92,
      ),
      buttonSelectedBorder: hexToRgbaString(
        KOREAN_COLORS.UI_BACKGROUND_DARK,
        1.0,
      ),
      buttonHoveredBorder: hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.8),
      buttonDefaultBorder: hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.7),
      textSelected: `#${KOREAN_COLORS.UI_BACKGROUND_DARK.toString(16).padStart(6, "0")}`,
      textHovered: `#${KOREAN_COLORS.ACCENT_GOLD.toString(16).padStart(6, "0")}`,
      textDefault: `#${KOREAN_COLORS.TEXT_PRIMARY.toString(16).padStart(6, "0")}`,
    }),
    [],
  );

  const handleButtonClick = useCallback(
    (mode: GameMode) => {
      UIHaptics.buttonTap();
      onModeSelect(mode);
      onPlaySFX?.("menu_select");
    },
    [onModeSelect, onPlaySFX],
  );

  const handleButtonHover = useCallback(
    (index: number, isHovering: boolean) => {
      const newIndex = isHovering ? index : null;
      onHoverChange(newIndex);
      if (isHovering) {
        UIHaptics.menuHover();
        onPlaySFX?.("menu_hover");
      }
    },
    [onHoverChange, onPlaySFX],
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: useGridLayout ? "1fr 1fr" : "1fr",
        gap: `${buttonGap}px`,
        width: "100%",
      }}
      data-testid="main-menu-buttons"
    >
      {menuItems.map((item, index) => {
        const isSelected = selectedIndex === index;
        const isHovered = hoveredIndex === index;

        // Get only visual effects (glow, transitions, transforms)
        const visualEffects = getButtonVisualEffectsOnly({
          variant: "primary",
          isHovered,
          isPressed: false,
          isFocused: false,
          glowIntensity: isSelected
            ? "medium"
            : isHovered
              ? "medium"
              : "subtle",
          hoverAnimation: "combined",
        });

        return (
          <button
            key={item.mode}
            onClick={() => handleButtonClick(item.mode)}
            onMouseEnter={() => handleButtonHover(index, true)}
            onMouseLeave={() => handleButtonHover(index, false)}
            onFocus={(e) => {
              e.currentTarget.style.outline = `3px solid ${hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD)}`;
              e.currentTarget.style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
            aria-label={`${item.korean} (${item.english})`}
            aria-selected={isSelected}
            role="menuitem"
            style={{
              ...visualEffects,
              ...getKoreanFontOptimization(
                buttonFontSize,
                isSelected ? "bold" : "normal",
              ),
              fontFamily: FONT_FAMILY.KOREAN,
              width: "100%",
              height: `${buttonHeight}px`,
              // Menu-specific color, background, and border
              color: isSelected
                ? colors.textSelected
                : isHovered
                  ? colors.textHovered
                  : colors.textDefault,
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
  );
};

export default MenuButtons;
