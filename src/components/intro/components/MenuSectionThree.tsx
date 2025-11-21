/**
 * MenuSectionThree - Improved menu section using Three.js Korean UI components
 * 
 * Replaces MenuSectionHTML with reusable MenuList component from three library
 */

import React, { useMemo, useCallback } from "react";
import { GameMode } from "../../../types/common";
import { MenuList } from "../../three";
import type { MenuItem } from "../../three";

export interface MenuSectionThreeProps {
  readonly menuItems: Array<{
    mode: GameMode;
    korean: string;
    english: string;
  }>;
  readonly selectedIndex: number;
  readonly onModeSelect: (mode: GameMode) => void;
  readonly onSelectedIndexChange?: (index: number) => void;
  readonly onPlaySFX?: (sound: string) => void;
  readonly position?: [number, number, number];
  readonly width?: number;
}

/**
 * MenuSectionThree Component
 * 
 * Uses the new Three.js Korean UI MenuList component for consistent theming.
 * Provides bilingual menu navigation with keyboard and mouse support.
 * 
 * @example
 * ```tsx
 * <MenuSectionThree
 *   menuItems={MENU_ITEMS}
 *   selectedIndex={0}
 *   onModeSelect={handleModeSelect}
 *   position={[0, 0, 0]}
 * />
 * ```
 */
export const MenuSectionThree: React.FC<MenuSectionThreeProps> = ({
  menuItems,
  selectedIndex,
  onModeSelect,
  onSelectedIndexChange,
  onPlaySFX,
  position = [0, 0, 0],
  width = 350,
}) => {
  // Convert menu items to MenuItem format
  const items: MenuItem[] = useMemo(
    () =>
      menuItems.map((item) => ({
        id: item.mode,
        korean: item.korean,
        english: item.english,
      })),
    [menuItems]
  );

  // Get currently selected ID
  const selectedId = useMemo(
    () => menuItems[selectedIndex]?.mode ?? menuItems[0].mode,
    [menuItems, selectedIndex]
  );

  // Handle selection
  const handleSelect = useCallback(
    (id: string) => {
      const itemIndex = menuItems.findIndex((item) => item.mode === id);
      if (itemIndex >= 0) {
        onSelectedIndexChange?.(itemIndex);
        onPlaySFX?.("menu_select");
        onModeSelect(id as GameMode);
      }
    },
    [menuItems, onModeSelect, onSelectedIndexChange, onPlaySFX]
  );

  return (
    <MenuList
      items={items}
      onSelect={handleSelect}
      selectedId={selectedId}
      position={position}
      width={width}
      testId="intro-menu-list"
    />
  );
};

MenuSectionThree.displayName = "MenuSectionThree";
