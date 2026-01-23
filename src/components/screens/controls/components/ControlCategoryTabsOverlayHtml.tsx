/**
 * ControlCategoryTabs - Tab navigation for control categories
 * 
 * Allows switching between Combat, Movement, and System control views
 * Uses BaseButtonOverlayHtml for consistent styling
 * 
 * @module components/screens/controls/components
 */

import React, { useMemo } from "react";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import { useKoreanTheme } from "../../../shared/base/useKoreanTheme";
import { CONTROL_CATEGORIES } from "../constants/ControlsConstants";

export interface ControlCategoryTabsProps {
  readonly selectedTab: 'combat' | 'movement' | 'system';
  readonly onTabChange: (tab: 'combat' | 'movement' | 'system') => void;
  readonly isMobile: boolean;
}

/**
 * ControlCategoryTabs Component
 * 
 * Displays tabs for switching between control categories.
 * Uses Korean theming and responsive sizing.
 * 
 * @example
 * ```tsx
 * <ControlCategoryTabs
 *   selectedTab="combat"
 *   onTabChange={(tab) => setSelectedTab(tab)}
 *   isMobile={false}
 * />
 * ```
 */
export const ControlCategoryTabs: React.FC<ControlCategoryTabsProps> = ({
  selectedTab,
  onTabChange,
  isMobile,
}) => {
  const theme = useKoreanTheme({ variant: 'primary', size: 'md', isMobile });

  const tabStyle = useMemo(() => ({
    display: 'flex',
    flexDirection: 'row' as const,
    gap: isMobile ? '8px' : '12px',
    justifyContent: 'center',
    alignItems: 'center',
    padding: isMobile ? '10px' : '15px',
    flexWrap: 'wrap' as const,
  }), [isMobile]);

  const buttonBaseStyle = useMemo(() => ({
    padding: isMobile ? '8px 16px' : '12px 24px',
    borderRadius: '8px',
    border: `2px solid ${hexToRgbaString(theme.colors.UI_BORDER, 0.6)}`,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: 'bold' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }), [isMobile, theme]);

  return (
    <div style={tabStyle} data-testid="control-category-tabs">
      {CONTROL_CATEGORIES.map((category) => {
        const isSelected = selectedTab === category.id;
        
        const buttonStyle = {
          ...buttonBaseStyle,
          background: isSelected
            ? hexToRgbaString(category.color, 0.3)
            : hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.8),
          borderColor: isSelected
            ? hexToRgbaString(category.color, 1)
            : hexToRgbaString(theme.colors.UI_BORDER, 0.6),
          color: isSelected
            ? `#${category.color.toString(16).padStart(6, '0')}`
            : `#${theme.colors.TEXT_SECONDARY.toString(16).padStart(6, '0')}`,
        };

        return (
          <button
            key={category.id}
            style={buttonStyle}
            onClick={() => onTabChange(category.id as 'combat' | 'movement' | 'system')}
            data-testid={`tab-${category.id}`}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = hexToRgbaString(category.color, 0.1);
                e.currentTarget.style.borderColor = hexToRgbaString(category.color, 0.8);
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.background = hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.8);
                e.currentTarget.style.borderColor = hexToRgbaString(theme.colors.UI_BORDER, 0.6);
              }
            }}
          >
            <span role="img" aria-label={category.english}>{category.icon}</span>
            <span>{category.korean} | {category.english}</span>
          </button>
        );
      })}
    </div>
  );
};
