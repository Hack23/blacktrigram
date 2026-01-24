/**
 * BaseHUDContainer - Reusable HUD container with common patterns
 * 
 * Provides consistent container styling and positioning for all HUD components.
 * Eliminates code duplication across Training and Combat HUDs.
 * 
 * Features:
 * - Responsive positioning based on HUD position (left, right, top, bottom)
 * - Korean cyberpunk theming with gradients and borders
 * - Pointer events handling
 * - Backdrop blur effects
 * 
 * @module components/shared/ui
 * @korean 기본HUD컨테이너 - 공통 패턴을 가진 재사용 가능한 HUD 컨테이너
 */

import React from 'react';
import { Z_INDEX } from '../../../types/LayoutTypes';
import { KOREAN_COLORS } from '../../../types/constants';
import { hexToRgbaString } from '../../../utils/colorUtils';

/**
 * HUD position type
 */
export type HUDPosition = 'left' | 'right' | 'top' | 'bottom';

/**
 * Props for BaseHUDContainer component
 */
export interface BaseHUDContainerProps {
  /** Position of the HUD (left, right, top, bottom) */
  readonly position: HUDPosition;
  /** Width in pixels (used for left/right positions; top/bottom use 100% width) */
  readonly width: number;
  /** Height in pixels */
  readonly height: number;
  /** Top offset in pixels (for left/right HUDs) */
  readonly topOffset?: number;
  /** Internal padding in pixels */
  readonly padding?: number;
  /** Gap between sections in pixels */
  readonly gap?: number;
  /** Z-index for layering */
  readonly zIndex?: number;
  /** Additional CSS styles */
  readonly style?: React.CSSProperties;
  /** Child elements */
  readonly children: React.ReactNode;
  /** Test ID for testing */
  readonly dataTestId?: string;
}

/**
 * BaseHUDContainer Component
 * 
 * Reusable container for HUD elements with consistent styling and positioning.
 * Handles left, right, top, and bottom positions with appropriate borders,
 * gradients, and responsive behavior.
 * 
 * @example
 * ```tsx
 * <BaseHUDContainer
 *   position="left"
 *   width={268}
 *   height={940}
 *   topOffset={70}
 *   padding={12}
 *   gap={14}
 *   dataTestId="combat-left-hud"
 * >
 *   <PlayerHUD player={player} />
 *   <SpeedIndicator speed={speed} />
 * </BaseHUDContainer>
 * ```
 */
export const BaseHUDContainer: React.FC<BaseHUDContainerProps> = ({
  position,
  width,
  height,
  topOffset = 0,
  padding = 10,
  gap = 12,
  zIndex = Z_INDEX.HUD,
  style = {},
  children,
  dataTestId,
}) => {
  // Calculate position-specific styles
  // Using KOREAN_COLORS directly for stable memoization instead of useKoreanTheme
  const containerStyle = React.useMemo<React.CSSProperties>(() => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      pointerEvents: 'none',
      padding: `${padding}px`,
      boxSizing: 'border-box',
      gap: `${gap}px`,
      zIndex,
      backdropFilter: 'blur(8px)',
    };

    switch (position) {
      case 'left':
        return {
          ...baseStyle,
          left: 0,
          top: `${topOffset}px`,
          width: `${width}px`,
          height: `${height}px`,
          justifyContent: 'flex-start',
          borderRight: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.4)}`,
          background: `linear-gradient(90deg, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.85)} 0%, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.4)} 100%)`,
        };
      
      case 'right':
        return {
          ...baseStyle,
          right: 0,
          top: `${topOffset}px`,
          width: `${width}px`,
          height: `${height}px`,
          justifyContent: 'flex-start',
          borderLeft: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.4)}`,
          background: `linear-gradient(270deg, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.85)} 0%, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.4)} 100%)`,
        };
      
      case 'top':
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          width: '100%',
          height: `${height}px`,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.4)}`,
          background: `linear-gradient(180deg, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9)} 0%, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.7)} 100%)`,
        };
      
      case 'bottom':
        return {
          ...baseStyle,
          bottom: 0,
          left: 0,
          width: '100%',
          height: `${height}px`,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `2px solid ${hexToRgbaString(KOREAN_COLORS.PRIMARY_CYAN, 0.4)}`,
          background: `linear-gradient(0deg, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.9)} 0%, ${hexToRgbaString(KOREAN_COLORS.UI_BACKGROUND_DARK, 0.7)} 100%)`,
        };
    }
  }, [position, width, height, topOffset, padding, gap, zIndex]);

  return (
    <div
      style={{ ...containerStyle, ...style }}
      data-testid={dataTestId}
    >
      {children}
    </div>
  );
};

export default BaseHUDContainer;
