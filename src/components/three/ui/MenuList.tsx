/**
 * MenuList - Three.js-compatible menu list component
 * 
 * Navigation menu with Korean theming and keyboard support
 * 
 * @module components/three
 */

import { Html } from "@react-three/drei";
import React, { useCallback, useMemo, useState } from "react";
import { KOREAN_COLORS, FONT_FAMILY } from "../../../types/constants";
import { hexToRgbaString } from "../../../utils/colorUtils";

/**
 * Menu item interface
 */
export interface MenuItem {
  readonly id: string;
  readonly korean: string;
  readonly english: string;
  readonly disabled?: boolean;
}

/**
 * Props for MenuList component
 */
export interface MenuListProps {
  readonly items: readonly MenuItem[];
  readonly onSelect: (id: string) => void;
  readonly selectedId?: string;
  readonly position?: [number, number, number];
  readonly width?: number;
  readonly testId?: string;
}

/**
 * MenuList Component
 * 
 * A navigational menu component with Korean cyberpunk styling.
 * Supports keyboard navigation and hover states.
 * 
 * @example
 * ```tsx
 * <MenuList
 *   items={[
 *     { id: "combat", korean: "대전", english: "Combat" },
 *     { id: "training", korean: "훈련", english: "Training" }
 *   ]}
 *   onSelect={(id) => console.log(id)}
 * />
 * ```
 */
export const MenuList: React.FC<MenuListProps> = ({
  items,
  onSelect,
  selectedId,
  position = [0, 0, 0],
  width = 300,
  testId,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleItemClick = useCallback(
    (id: string, disabled?: boolean) => {
      if (!disabled) {
        onSelect(id);
      }
    },
    [onSelect]
  );

  const handleMouseEnter = useCallback((id: string) => {
    setHoveredId(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  // Memoize container styles for performance
  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      width: `${width}px`,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      padding: "12px",
      background: hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9),
      border: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.6)}`,
      borderRadius: "8px",
      boxShadow: `0 0 15px ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.3)}`,
    }),
    [width]
  );

  // Function to get item styles based on state
  const getItemStyle = useCallback(
    (id: string, disabled?: boolean): React.CSSProperties => {
      const isSelected = selectedId === id;
      const isHovered = hoveredId === id;

      let background = hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_MEDIUM, 0.5);
      let borderColor = hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.3);

      if (isSelected) {
        background = hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.2);
        borderColor = hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.8);
      } else if (isHovered && !disabled) {
        background = hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.15);
        borderColor = hexToRgbaString(KOREAN_COLORS.ACCENT_GOLD, 0.6);
      }

      return {
        padding: "12px 16px",
        background,
        border: `2px solid ${borderColor}`,
        borderRadius: "4px",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.4 : 1,
        userSelect: "none",
        WebkitUserSelect: "none",
        transform: isHovered && !disabled ? "translateX(4px)" : "translateX(0)",
      };
    },
    [selectedId, hoveredId]
  );

  // Memoize text styles for performance
  const getTextStyle = useCallback(
    (isKorean: boolean, isSelected: boolean): React.CSSProperties => ({
      display: "block",
      fontFamily: FONT_FAMILY.KOREAN,
      fontSize: isKorean ? "16px" : "14px",
      fontWeight: isKorean ? "bold" : "normal",
      fontStyle: isKorean ? "normal" : "italic",
      color: hexToRgbaString(
        isSelected ? KOREAN_COLORS.ACCENT_GOLD : KOREAN_COLORS.TEXT_PRIMARY
      ),
      textShadow: `0 2px 4px ${hexToRgbaString(KOREAN_COLORS.BLACK_SOLID, 0.5)}`,
    }),
    []
  );

  return (
    <Html position={position} center>
      <div style={containerStyle} data-testid={testId ?? "menu-list"}>
        {items.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id, item.disabled)}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
              style={getItemStyle(item.id, item.disabled)}
              data-testid={`menu-item-${item.id}`}
            >
              <span style={getTextStyle(true, isSelected)}>
                {item.korean}
              </span>
              <span style={getTextStyle(false, isSelected)}>
                {item.english}
              </span>
            </div>
          );
        })}
      </div>
    </Html>
  );
};

MenuList.displayName = "MenuList";
