/**
 * StyledHUDPanel - Reusable HUD Panel Component
 * 
 * A consistent, styled panel for HUD elements following the Black Trigram design system.
 * Provides cyberpunk Korean aesthetic with glassmorphism effects.
 * 
 * Features:
 * - Configurable variants (default, accent)
 * - Responsive padding based on SPACING scale
 * - Hover effects with smooth transitions
 * - Support for custom styles
 * - WCAG AA compliant colors
 * 
 * @korean 스타일이 적용된 HUD 패널
 * @module Components/UI
 */

import React from 'react';
import {
  HUD_STYLE,
  SPACING,
  TRANSITIONS,
  BORDERS,
  type SpacingLevel,
} from '../../../types/constants/designSystem';

/**
 * StyledHUDPanel Props
 */
export interface StyledHUDPanelProps {
  /** Panel content */
  readonly children?: React.ReactNode;
  /** Visual variant of the panel */
  readonly variant?: 'default' | 'accent';
  /** Padding size from SPACING scale */
  readonly padding?: SpacingLevel;
  /** Custom className for additional styling */
  readonly className?: string;
  /** Custom inline styles */
  readonly style?: React.CSSProperties;
  /** Enable hover effect */
  readonly hover?: boolean;
  /** Data test ID for testing */
  readonly dataTestId?: string;
  /** Click handler */
  readonly onClick?: () => void;
  /** Pointer events behavior */
  readonly pointerEvents?: 'auto' | 'none' | 'all';
}

/**
 * StyledHUDPanel Component
 * 
 * Provides a consistent, reusable panel for HUD elements with cyberpunk styling.
 * 
 * @example
 * ```tsx
 * <StyledHUDPanel variant="accent" padding="md" hover>
 *   <div>Panel content</div>
 * </StyledHUDPanel>
 * ```
 */
export const StyledHUDPanel: React.FC<StyledHUDPanelProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className,
  style,
  hover = false,
  dataTestId = 'styled-hud-panel',
  onClick,
  pointerEvents = 'auto',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyles: React.CSSProperties = {
    background: HUD_STYLE.background,
    border: variant === 'accent' ? BORDERS.accent : BORDERS.default,
    borderRadius: HUD_STYLE.borderRadius,
    padding: SPACING[padding],
    boxShadow: hover && isHovered ? HUD_STYLE.shadowHover : HUD_STYLE.shadow,
    backdropFilter: HUD_STYLE.backdropFilter,
    transition: TRANSITIONS.normal,
    boxSizing: 'border-box',
    pointerEvents,
    ...style,
  };

  const handleMouseEnter = () => {
    if (hover) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (hover) {
      setIsHovered(false);
    }
  };

  return (
    <div
      className={className}
      style={baseStyles}
      data-testid={dataTestId}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default StyledHUDPanel;
