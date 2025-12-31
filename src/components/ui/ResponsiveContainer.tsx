/**
 * ResponsiveContainer Component
 * 
 * Wrapper component that applies responsive layout properties and safe area insets
 * with smooth transitions for window resizing operations.
 * 
 * Enhanced Features:
 * - Five screen size categories (mobile, tablet, desktop, large, xlarge)
 * - Proportional scaling for fonts and spacing
 * - Smooth CSS transitions for resize operations (300ms ease-in-out)
 * - Safe area insets for mobile devices
 * - Consistent mobile-optimized layout
 * 
 * @module components/ui/ResponsiveContainer
 * @category Mobile UI
 * @korean 반응형컨테이너
 */

import React, { CSSProperties } from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

/**
 * Props for ResponsiveContainer component
 */
export interface ResponsiveContainerProps {
  /** Child components to render */
  readonly children: React.ReactNode;
  /** Whether to apply safe area insets */
  readonly applySafeArea?: boolean;
  /** Padding density */
  readonly padding?: 'none' | 'compact' | 'normal' | 'spacious';
  /** Custom className */
  readonly className?: string;
  /** Custom style overrides */
  readonly style?: CSSProperties;
  /** Whether to enable smooth transitions for resize operations */
  readonly enableTransitions?: boolean;
  /** Test ID for testing */
  readonly testId?: string;
}

/**
 * ResponsiveContainer Component
 * 
 * Automatically applies responsive layout properties including:
 * - Safe area insets for mobile devices (notch, home indicator)
 * - Responsive padding based on device size
 * - Touch-friendly spacing
 * - Smooth transitions for resize operations (300ms ease-in-out)
 * - Proportional scaling across all screen sizes
 * 
 * Usage:
 * - Wrap HUD components for automatic mobile optimization
 * - Apply safe area insets to avoid overlap with device UI
 * - Consistent spacing across all screen sizes
 * - Enable transitions for smooth window resizing
 * 
 * @example
 * ```tsx
 * <ResponsiveContainer 
 *   applySafeArea 
 *   padding="normal"
 *   enableTransitions
 * >
 *   <CombatHUD />
 * </ResponsiveContainer>
 * ```
 * 
 * @public
 * @korean 반응형컨테이너
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  applySafeArea = true,
  padding = 'normal',
  enableTransitions = true,
  className,
  style,
  testId = 'responsive-container',
}) => {
  const { width, height } = useWindowSize();
  const layout = useResponsiveLayout(width, height);

  // Calculate padding based on density
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'compact':
        return layout.spacing.xs;
      case 'spacious':
        return layout.spacing.lg;
      case 'normal':
      default:
        return layout.spacing.md;
    }
  };

  const paddingValue = getPadding();

  // Container style with safe area insets and optional transitions
  const containerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    ...(enableTransitions && {
      transition: layout.transition,
    }),
    ...(applySafeArea && {
      paddingTop: layout.safeArea.top + paddingValue,
      paddingBottom: layout.safeArea.bottom + paddingValue,
      paddingLeft: layout.safeArea.left + paddingValue,
      paddingRight: layout.safeArea.right + paddingValue,
    }),
    ...(!applySafeArea && padding !== 'none' && {
      padding: paddingValue,
    }),
    ...style,
  };

  return (
    <div
      className={className}
      style={containerStyle}
      data-testid={testId}
      data-mobile={layout.isMobile}
      data-tablet={layout.isTablet}
      data-desktop={layout.isDesktop}
      data-landscape={layout.isLandscape}
      data-screen-size={layout.screenSize}
    >
      {children}
    </div>
  );
};

ResponsiveContainer.displayName = 'ResponsiveContainer';
