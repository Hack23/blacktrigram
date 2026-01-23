/**
 * ControlBindingsOverlayHtml - Display control bindings filtered by selected category
 * 
 * Shows key bindings in a clean, organized list with Korean-English bilingual labels.
 * Uses responsive grid/list layout based on device type.
 * 
 * @module components/screens/controls/components
 */

import React, { useMemo } from "react";
import { FONT_FAMILY } from "../../../../types/constants";
import { hexToRgbaString } from "../../../../utils/colorUtils";
import { useKoreanTheme } from "../../../shared/base/useKoreanTheme";
import {
  filterKeysByCategory,
  getKeyCategoryColor,
  KEYBOARD_LAYOUT,
  type KeyData,
} from "../constants/ControlsConstants";

/**
 * Props for ControlBindingsOverlayHtml component
 */
export interface ControlBindingsOverlayHtmlProps {
  /** Selected control category to filter and display */
  readonly selectedTab: 'combat' | 'movement' | 'system';
  /** Whether on mobile device (list layout vs grid) */
  readonly isMobile: boolean;
}

/**
 * ControlBindingsOverlayHtml Component
 * 
 * Displays control bindings filtered by selected category.
 * Uses grid layout on desktop and list layout on mobile.
 * 
 * @example
 * ```tsx
 * <ControlBindingsOverlayHtml
 *   selectedTab="combat"
 *   isMobile={false}
 * />
 * ```
 */
export const ControlBindingsOverlayHtml: React.FC<ControlBindingsOverlayHtmlProps> = ({
  selectedTab,
  isMobile,
}) => {
  const theme = useKoreanTheme({ variant: 'primary', size: 'md', isMobile });

  // Filter keys by selected category
  const filteredKeys = useMemo<readonly KeyData[]>(() => {
    return filterKeysByCategory(KEYBOARD_LAYOUT, selectedTab);
  }, [selectedTab]);

  // Container styles - grid for desktop, list for mobile
  const containerStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: isMobile ? '12px' : '16px',
    padding: isMobile ? '15px' : '20px',
    maxHeight: isMobile ? '60vh' : '70vh',
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    background: hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.9),
    borderRadius: '12px',
    border: `2px solid ${hexToRgbaString(theme.colors.UI_BORDER, 0.6)}`,
    boxShadow: `0 4px 15px ${hexToRgbaString(theme.colors.BLACK_SOLID, 0.5)}`,
  }), [isMobile, theme]);

  // Individual binding card style
  const getBindingCardStyle = (keyData: KeyData) => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    padding: isMobile ? '12px' : '14px',
    background: hexToRgbaString(theme.colors.UI_BACKGROUND_MEDIUM, 0.8),
    border: `2px solid ${hexToRgbaString(getKeyCategoryColor(keyData.category), 0.6)}`,
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    cursor: 'default',
  });

  // Key label style (the actual key)
  const keyLabelStyle = (keyData: KeyData) => ({
    fontFamily: FONT_FAMILY.KOREAN,
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: 'bold' as const,
    color: hexToRgbaString(getKeyCategoryColor(keyData.category)),
    textShadow: `0 0 10px ${hexToRgbaString(getKeyCategoryColor(keyData.category), 0.5)}`,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  });

  // Korean label style
  const koreanLabelStyle = {
    fontFamily: FONT_FAMILY.KOREAN,
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: 'bold' as const,
    color: hexToRgbaString(theme.colors.ACCENT_GOLD),
  };

  // Description style
  const descriptionStyle = {
    fontFamily: FONT_FAMILY.KOREAN,
    fontSize: isMobile ? '11px' : '12px',
    color: hexToRgbaString(theme.colors.TEXT_SECONDARY),
    lineHeight: 1.4,
  };

  return (
    <div style={containerStyle} data-testid="control-bindings">
      {filteredKeys.map((keyData) => (
        <div
          key={keyData.code}
          style={getBindingCardStyle(keyData)}
          data-testid={`binding-${keyData.code}`}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = hexToRgbaString(theme.colors.UI_BACKGROUND_MEDIUM, 1);
            e.currentTarget.style.borderColor = hexToRgbaString(getKeyCategoryColor(keyData.category), 1);
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 4px 15px ${hexToRgbaString(getKeyCategoryColor(keyData.category), 0.4)}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = hexToRgbaString(theme.colors.UI_BACKGROUND_MEDIUM, 0.8);
            e.currentTarget.style.borderColor = hexToRgbaString(getKeyCategoryColor(keyData.category), 0.6);
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Key label */}
          <div style={keyLabelStyle(keyData)}>
            <span style={{ 
              padding: '4px 8px', 
              background: hexToRgbaString(getKeyCategoryColor(keyData.category), 0.2),
              borderRadius: '4px',
              minWidth: isMobile ? '40px' : '50px',
              textAlign: 'center' as const,
            }}>
              {keyData.label}
            </span>
            {keyData.labelKorean && (
              <span style={koreanLabelStyle}>
                {keyData.labelKorean}
              </span>
            )}
          </div>

          {/* Description (Korean | English) */}
          {keyData.description && keyData.descriptionKorean && (
            <div style={descriptionStyle}>
              {keyData.descriptionKorean} | {keyData.description}
            </div>
          )}

          {/* Category badge */}
          <div style={{
            fontSize: isMobile ? '9px' : '10px',
            color: hexToRgbaString(theme.colors.TEXT_TERTIARY),
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px',
          }}>
            {keyData.category}
          </div>
        </div>
      ))}

      {filteredKeys.length === 0 && (
        <div style={{
          gridColumn: '1 / -1',
          textAlign: 'center' as const,
          padding: '40px 20px',
          fontFamily: FONT_FAMILY.KOREAN,
          fontSize: isMobile ? '14px' : '16px',
          color: hexToRgbaString(theme.colors.TEXT_SECONDARY),
        }}>
          선택한 카테고리에 컨트롤이 없습니다 | No controls in selected category
        </div>
      )}
    </div>
  );
};

export default ControlBindingsOverlayHtml;
