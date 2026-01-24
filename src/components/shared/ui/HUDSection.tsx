/**
 * HUDSection - Reusable HUD section with Korean theming
 * 
 * Provides consistent section styling for grouped HUD elements.
 * Includes optional bilingual title support and Korean cyberpunk theming.
 * 
 * Features:
 * - Korean-English bilingual titles
 * - Primary/Secondary variant styling
 * - Responsive sizing
 * - Consistent borders and backgrounds
 * 
 * @module components/shared/ui
 * @korean HUD섹션 - 한국 테마를 가진 재사용 가능한 HUD 섹션
 */

import React from 'react';
import { hexToRgbaString } from '../../../utils/colorUtils';
import { useKoreanTheme } from '../base/useKoreanTheme';

/**
 * Props for HUDSection component
 */
export interface HUDSectionProps {
  /** English title (optional) */
  readonly title?: string;
  /** Korean title (optional) */
  readonly titleKorean?: string;
  /** Child elements */
  readonly children: React.ReactNode;
  /** Visual variant (primary or secondary) */
  readonly variant?: 'primary' | 'secondary';
  /** Internal padding in pixels */
  readonly padding?: number;
  /** Gap between items in pixels */
  readonly gap?: number;
  /** Additional CSS styles */
  readonly style?: React.CSSProperties;
  /** Test ID for testing */
  readonly dataTestId?: string;
  /** Whether mobile layout is active */
  readonly isMobile?: boolean;
  /** Whether to enable pointer events */
  readonly pointerEvents?: boolean;
}

/**
 * HUDSection Component
 * 
 * Reusable section container for HUD elements with Korean theming.
 * Displays optional bilingual title and wraps content with styled borders
 * and backgrounds.
 * 
 * @example
 * ```tsx
 * <HUDSection
 *   title="Statistics"
 *   titleKorean="통계"
 *   variant="primary"
 *   padding={12}
 *   dataTestId="stats-section"
 * >
 *   <StatDisplay label="Hits" value={42} />
 *   <StatDisplay label="Combos" value={12} />
 * </HUDSection>
 * ```
 */
export const HUDSection: React.FC<HUDSectionProps> = ({
  title,
  titleKorean,
  children,
  variant = 'primary',
  padding = 12,
  gap = 8,
  style = {},
  dataTestId,
  isMobile = false,
  pointerEvents = true,
}) => {
  const theme = useKoreanTheme({
    variant,
    size: 'md',
    isMobile,
  });

  // Calculate responsive font size
  const fontSize = isMobile ? 11 : 12;
  const titleFontSize = isMobile ? 12 : 14;

  // Determine border and background colors based on variant
  const borderColor = variant === 'primary'
    ? hexToRgbaString(theme.colors.PRIMARY_CYAN, 0.5)
    : hexToRgbaString(theme.colors.ACCENT_GOLD, 0.5);
  
  const backgroundColor = variant === 'primary'
    ? hexToRgbaString(theme.colors.UI_BACKGROUND_DARK, 0.8)
    : hexToRgbaString(theme.colors.UI_BACKGROUND_MEDIUM, 0.8);

  const titleColor = variant === 'primary'
    ? hexToRgbaString(theme.colors.ACCENT_GOLD, 1)
    : hexToRgbaString(theme.colors.PRIMARY_CYAN, 1);

  return (
    <div
      style={{
        background: backgroundColor,
        border: `2px solid ${borderColor}`,
        borderRadius: '8px',
        padding: `${padding}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: `${gap}px`,
        pointerEvents: pointerEvents ? 'auto' : 'none',
        ...style,
      }}
      data-testid={dataTestId}
    >
      {/* Bilingual Title */}
      {(title || titleKorean) && (
        <div
          style={{
            fontSize: `${titleFontSize}px`,
            fontWeight: 'bold',
            color: titleColor,
            fontFamily: theme.koreanTypography.fontFamily,
            lineHeight: theme.koreanTypography.lineHeight,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          data-testid={dataTestId ? `${dataTestId}-title` : undefined}
        >
          {titleKorean && <span>{titleKorean}</span>}
          {titleKorean && title && <span style={{ color: hexToRgbaString(theme.colors.TEXT_SECONDARY, 0.7) }}>|</span>}
          {title && <span style={{ fontSize: `${fontSize}px` }}>{title}</span>}
        </div>
      )}
      
      {/* Content */}
      {children}
    </div>
  );
};

export default HUDSection;
